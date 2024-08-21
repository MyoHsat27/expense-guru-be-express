import express, { Router, Request, Response } from "express";
import { walletController } from "../../../controllers/v1/walletController";
import passport from "passport";

const router: Router = express.Router();
const { getBalance } = walletController();

router.get("/balance", passport.authenticate("jwt", { session: false }), getBalance);

export default router;
