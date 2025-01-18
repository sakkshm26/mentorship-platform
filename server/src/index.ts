import express from "express";
import cors from "cors";
import UserRouter from "./routes/user.routes";
import { errorHandler } from "./middlewares/error.middlewares";
import morganMiddleware from "./middlewares/morgan.middlewares";
import MenteeRouter from "./routes/mentee.routes";
import MentorRouter from "./routes/mentor.routes";
import AdminRouter from "./routes/admin.routes";
import PaymentGatewayRouter from "./routes/payment_gateway.routes";
import OpenRouter from "./routes/open.routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ credentials: true, origin: ["http://localhost:3000", "http://localhost:5000", "https://www.getboldd.com", "https://getboldd.com", "https://admin.getboldd.com", "https://www.admin.getboldd.com", "https://www.turtlex.in", "https://turtlex.in", "https://admin.turtlex.in", "https://www.admin.turtlex.in", "https://turtlex.netlify.app"]}));
app.use(morganMiddleware);

app.get("/health", (req, res) => {
    res.send("Service running!");
})
app.use("/internal/user", UserRouter);
app.use("/internal/mentee", MenteeRouter);
app.use("/internal/mentor", MentorRouter);
app.use("/admin", AdminRouter);
app.use("/payment-gateway", PaymentGatewayRouter);
app.use("/open", OpenRouter);

app.use(errorHandler);

app.listen(4000, () => {
    console.log("Server is running on port 4000");
})