import express, { Router, Request, Response } from "express";
import passport from "passport";

const router: Router = express.Router();

router.post(
    "/google",
    passport.authenticate("google", {
        session: false
    })
);

router.post(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        successRedirect: "/api/v1/wallet/balance",
        failureRedirect: "/users/login",
        failureMessage: true
    })
);

export default router;
