import express, { Router } from "express";
import users from "./modules/users";
import wallet from "./modules/wallet";

const router: Router = express.Router();

router.use("/users", users);
router.use("/wallet", wallet);

export default router;
