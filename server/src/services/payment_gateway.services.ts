import Razorpay from "razorpay";
import { nanoid } from "nanoid";
import { config } from "../providers/config";
import { trial_booking_table, mentor_table, payment_table, user_table } from "../db/schema";
import { eq } from "drizzle-orm";
import { DB } from "../db";
import crypto from "crypto";
import axios from "axios";
import { normalizeCurrency } from "../utils/common";

interface createTrialBookingRazorpayOrderProps {
    mentor_id: string;
    user_id: string;
    mentee_id: string;
}

interface razorpayPaymentCaptureWebhookProps {
    payload: any;
    headers: any
}

const razorpay = new Razorpay({
    key_id: config.razorpay_key_id,
    key_secret: config.razorpay_key_secret
})

export const PaymentGatewayService = {
    createTrialBookingRazorpayOrder: async ({ mentor_id, user_id, mentee_id }: createTrialBookingRazorpayOrderProps) => {
        const mentor = await DB.select({ trial_fee: mentor_table.trial_fee }).from(mentor_table).where(eq(mentor_table.id, mentor_id));
        const user = await DB.select({ full_name: user_table.full_name, phone: user_table.phone }).from(user_table).where(eq(user_table.id, user_id));
        if (!mentor.length || !user.length) {
            throw new Error("Invalid mentor or user id");
        }
        const amount = mentor[0].trial_fee;
        if (!amount) {
            throw new Error("Mentor has no trial fee set");
        }
        const order = await razorpay.orders.create({
            amount: amount,
            currency: "INR",
            receipt: nanoid(),
            payment_capture: true,
            notes: {
                type: "trial_booking",
                mentor_id,
                mentee_id
            }
        })
        return { order_id: order.id, amount: order.amount, currency: order.currency, phone: user[0].phone, full_name: user[0].full_name }
    },

    createTrialBookingRazorpayOrderForSession: async ({ mentor_id, session_id }: { mentor_id: string, session_id: string }) => {
        const mentor = await DB.select({ trial_fee: mentor_table.trial_fee }).from(mentor_table).where(eq(mentor_table.id, mentor_id));
        if (!mentor.length) {
            throw new Error("Invalid mentor ID");
        }
        const amount = mentor[0].trial_fee;
        if (!amount) {
            throw new Error("Mentor has no trial fee set");
        }
        const order = await razorpay.orders.create({
            amount: amount,
            currency: "INR",
            receipt: nanoid(),
            payment_capture: true,
            notes: {
                type: "trial_booking",
                mentor_id,
                session_id
            }
        })
        return { order_id: order.id, amount: order.amount, currency: order.currency }
    },

    razorpayPaymentCaptureWebhook: async ({ payload, headers }: razorpayPaymentCaptureWebhookProps) => {
        const hmac = crypto.createHmac("sha256", config.razorpay_webhook_secret);
        hmac.update(JSON.stringify(payload));
        const digest = hmac.digest("hex");
        if (digest === headers['x-razorpay-signature'] && payload.event === "payment.captured") {
            const found_payment = await DB.select().from(payment_table).where(eq(payment_table.event_id, headers["x-razorpay-event-id"]));
            if (!found_payment.length) {
                const razorpay_order = await razorpay.orders.fetch(payload.payload.payment.entity.order_id);
                const created_payment = await DB.insert(payment_table).values({
                    payment_id: payload.payload.payment.entity.id,
                    order_id: payload.payload.payment.entity.order_id,
                    signatue: headers['x-razorpay-signature'],
                    event_id: headers["x-razorpay-event-id"],
                    amount: payload.payload.payment.entity.amount,
                    currency: payload.payload.payment.entity.currency
                }).returning();
                if (razorpay_order?.notes?.type === "trial_booking") {
                    if (razorpay_order.notes.mentee_id) { // payment made normally
                        const booking = await DB.insert(trial_booking_table).values({
                            fk_booking_mentee: razorpay_order.notes.mentee_id as string,
                            fk_booking_mentor: razorpay_order.notes.mentor_id as string
                        }).returning();
                        await DB.update(payment_table).set({
                            fk_payment_trial_booking: booking[0].id,
                            type: "trial_booking"
                        }).where(eq(payment_table.id, created_payment[0].id));
                        const found_mentee = (await DB.select({ phone: user_table.phone, full_name: user_table.full_name }).from(user_table).where(eq(user_table.fk_user_mentee, razorpay_order.notes.mentee_id as string)))[0];
                        const found_mentor = (await DB.select({ full_name: user_table.full_name, per_month_fee: mentor_table.per_month_fee })
                            .from(user_table)
                            .where(eq(user_table.fk_user_mentor, razorpay_order.notes.mentor_id as string))
                            .innerJoin(mentor_table, eq(mentor_table.id, user_table.fk_user_mentor))
                        )[0];
                        try {
                            await axios({
                                method: "post",
                                url: config.payment_update_script_url,
                                data: {
                                    phone: `+91-${found_mentee?.phone?.slice(2)}`,
                                    mentor_name: found_mentor.full_name,
                                    per_month_fee: `₹${normalizeCurrency({ currency: "INR", value: found_mentor.per_month_fee as number })}`
                                }
                            })
                        } catch (err) { }
                        try {
                            await axios.post("https://hooks.slack.com/services/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", {
                                text: `Mentee ${found_mentee.full_name} booked a trial session with ${found_mentor.full_name}`
                            })
                        } catch (err) { }
                    } else if (razorpay_order.notes.session_id) { // payment made from session list
                        const booking = await DB.insert(trial_booking_table).values({
                            session_id: razorpay_order.notes.session_id as string,
                            fk_booking_mentor: razorpay_order.notes.mentor_id as string
                        }).returning();
                        await DB.update(payment_table).set({
                            fk_payment_trial_booking: booking[0].id,
                            type: "trial_booking"
                        }).where(eq(payment_table.id, created_payment[0].id));
                        const found_mentor = (await DB.select({ full_name: user_table.full_name })
                            .from(user_table)
                            .where(eq(user_table.fk_user_mentor, razorpay_order.notes.mentor_id as string))
                            .innerJoin(mentor_table, eq(mentor_table.id, user_table.fk_user_mentor))
                        )[0];
                        try {
                            await axios.post("https://hooks.slack.com/services/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", {
                                text: `A trial session was booked with the mentor ${found_mentor.full_name} from the custom list.`
                            })
                        } catch (err) { }
                    }
                }
            }
        }
    }
}