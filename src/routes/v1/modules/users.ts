import express, { Router, Request, Response } from "express";
import { userController } from "../../../controllers/v1/userController";
import { authenticateJWT } from "../../../middleware/authenticate";

const router: Router = express.Router();
const { register, login, authMe } = userController();

router.post("/register", register);
router.post("/login", login);
router.get("/auth/me", authenticateJWT, authMe)

export default router;
