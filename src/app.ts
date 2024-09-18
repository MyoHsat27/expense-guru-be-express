import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import v1Routes from "./routes/v1/index";
import { dbConnect } from "./config/mongoose";
import usePassport from "./config/passport";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed HTTP methods
    credentials: true  // If you are using cookies, set this to true
}))
app.use(cookieParser())
app.use(express.json());

dbConnect();

usePassport(app);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong");
});

app.use("/api/v1", v1Routes);
app.use("/test", (req: Request, res: Response) => {
    res.send("Thar Linn Htet - Larry, Myo Hsat Nanda - Open Heaven");
});

export default app;
