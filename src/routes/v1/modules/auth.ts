import express, { Router, Request, Response } from "express";
import passport from "passport";
import { generateToken } from "../../../utils/jwtManager";
import { UserObject } from "../../../types/user";
import { authenticateJWT } from "../../../middleware/authenticate";
import { authController } from "../../../controllers/v1/authController";

const router: Router = express.Router();
const { authMe, reNewAccessToken} = authController();

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
        failureRedirect: "/users/login",
        failureMessage: true
    }), async(req, res) => {

        if (!req.user) {
            return res.status(400).json({
                success: false,
                message: "User authentication failed.",
            });
        }

        const user = req.user as UserObject; 
        const token =await generateToken(user); // Generate JWT token
        
        // Set the token in the cookie
        res.cookie("authToken", token, {
            httpOnly: true,
        });

        // Redirect to the home page
        return res.redirect("http://localhost:3000/auth/google-callback");
    }
);

router.get("/me", authenticateJWT, authMe);
router.get("/refresh", reNewAccessToken);

export default router;
