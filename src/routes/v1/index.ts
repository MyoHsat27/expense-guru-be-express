import express, { Router } from "express";
import users from "./modules/users";
import wallet from "./modules/wallet";
import auth from "./modules/auth";
import category from "./modules/category";

const router: Router = express.Router();

router.use("/users", users);
router.use("/wallet", wallet);
router.use("/auth", auth);
router.use("/category", category)

export default router;
