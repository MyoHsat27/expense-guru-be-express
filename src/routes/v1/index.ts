import express, { Router } from "express";
import users from "./modules/users";
import wallet from "./modules/wallet";
import auth from "./modules/auth";

const router: Router = express.Router();

router.use("/users", users);
router.use("/wallet", wallet);
router.use("/auth", auth);

export default router;
