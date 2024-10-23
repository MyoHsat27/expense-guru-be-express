import express, { Router, Request, Response } from "express";
import { userController } from "../../../controllers/v1/userController";
import { authenticateJWT } from "../../../middleware/authenticate";

const router: Router = express.Router();
const { register, login, authMe,logout,update ,checkPassword} = userController();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", authenticateJWT, logout)
router.get("/auth/me", authenticateJWT, authMe)
router.put("/edit",update)
router.post("/checkPassword",checkPassword)
export default router;
