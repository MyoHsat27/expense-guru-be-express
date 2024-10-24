import express, { Router, Request, Response } from "express";
import { userController } from "../../../controllers/v1/userController";

const router: Router = express.Router();
const { register, login,logout,update ,checkPassword} = userController();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout)
router.put("/edit",update)
router.post("/checkPassword",checkPassword)
export default router;
