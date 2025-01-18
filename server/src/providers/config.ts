import dotenv from "dotenv";
dotenv.config();

export const config = {
    database_uri_dev: process.env.DB_URI_DEV || (() => {throw new Error("Missing DB_URI_DEV in env")})(),
    database_uri_prod: process.env.DB_URI_PROD || (() => {throw new Error("Missing DB_URI_PROD in env")})(),
	access_token_secret: process.env.ACCESS_TOKEN_SECRET || (() => {throw new Error("Missing ACCESS_TOKEN_SECRET in env")})(),
	refresh_token_secret: process.env.REFRESH_TOKEN_SECRET || (() => {throw new Error("Missing REFRESH_TOKEN_SECRET in env")})(),
    node_env: process.env.NODE_ENV || (() => {throw new Error("Missing NODE_ENV in env")})(),
    admin_api_key: process.env.ADMIN_API_KEY || (() => {throw new Error("Missing ADMIN_API_KEY in env")})(),
    admin_email: process.env.ADMIN_EMAIL || (() => {throw new Error("Missing ADMIN_EMAIL in env")})(),
    admin_password: process.env.ADMIN_PASSWORD || (() => {throw new Error("Missing ADMIN_PASSWORD in env")})(),
    lead_create_script_url: process.env.LEAD_CREATE_SCRIPT_URL || (() => {throw new Error("Missing LEAD_CREATE_SCRIPT_URL in env")})(),
    lead_update_script_url: process.env.LEAD_UPDATE_SCRIPT_URL || (() => {throw new Error("Missing LEAD_UPDATE_SCRIPT_URL in env")})(),
    create_booking_script_url: process.env.CREATE_BOOKING_SCRIPT_URL || (() => {throw new Error("Missing CREATE_BOOKING_SCRIPT_URL in env")})(),
    lead_login_script_url: process.env.LEAD_LOGIN_SCRIPT_URL || (() => {throw new Error("Missing LEAD_LOGIN_SCRIPT_URL in env")})(),
    payment_update_script_url: process.env.PAYMENT_UPDATE_SCRIPT_URL || (() => {throw new Error("Missing PAYMENT_UPDATE_SCRIPT_URL in env")})(),
    session_list_create_script_url: process.env.SESSION_LIST_CREATE_SCRIPT_URL || (() => {throw new Error("Missing SESSION_LIST_CREATE_SCRIPT_URL in env")})(),
    carnival_lead_create_script_url: process.env.CARNIVAL_LEAD_CREATE_SCRIPT_URL || (() => {throw new Error("Missing CARNIVAL_LEAD_CREATE_SCRIPT_URL in env")})(),
    razorpay_key_id: process.env.RAZORPAY_KEY_ID || (() => {throw new Error("Missing RAZORPAY_KEY_ID in env")})(),
    razorpay_key_secret: process.env.RAZORPAY_KEY_SECRET || (() => {throw new Error("Missing RAZORPAY_KEY_SECRET in env")})(),
    razorpay_webhook_secret: process.env.RAZORPAY_WEBHOOK_SECRET || (() => {throw new Error("Missing RAZORPAY_WEBHOOK_SECRET in env")})(),
    facebook_conversions_api_access_token: process.env.FACEBOOK_CONVERSIONS_API_ACCESS_TOKEN || (() => {throw new Error("Missing FACEBOOK_CONVERSIONS_API_ACCESS_TOKEN in env")})(),
    facebook_pixel_id: process.env.FACEBOOK_PIXEL_ID || (() => {throw new Error("Missing FACEBOOK_PIXEL_ID in env")})(),
}