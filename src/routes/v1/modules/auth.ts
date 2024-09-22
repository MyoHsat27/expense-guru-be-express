import express, { Router, Request, Response } from "express";
import passport from "passport";
import { generateToken } from "../../../utils/jwtManager";

const router: Router = express.Router();

router.get(
    "/google",
    passport.authenticate("google", {
        session: false
    })
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        // successRedirect: "http://localhost:3000/home",
        failureRedirect: "/users/login",
        failureMessage: true
    }), async(req, res) => {
        // Check if req.user is defined
        if (!req.user) {
            return res.status(400).json({
                success: false,
                message: "User authentication failed.",
            });
        }

        // Assuming user info is in req.user
        const user = req.user as object; // Cast req.user to any or a User type if you have one
        const token =await generateToken(user); // Generate JWT token
        
        // Set the token in the cookie
        res.cookie("authToken", token, {
            httpOnly: true, // Prevents JavaScript access to the cookie
        });

        // Redirect to the home page
        return res.redirect("http://localhost:3000/auth/google-callback");
    }
);

export default router;
