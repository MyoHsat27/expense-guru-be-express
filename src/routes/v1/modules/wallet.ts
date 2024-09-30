import express, { Router, Request, Response } from "express";
import { walletController } from "../../../controllers/v1/walletController";
import passport from "passport";
import { authenticateJWT } from "../../../middleware/authenticate";

const router: Router = express.Router();
const { getBalance } = walletController();

router.get("/balance", authenticateJWT, getBalance);

export default router;
