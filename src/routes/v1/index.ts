import express, { Router } from "express";
import users from "./modules/users";
import wallet from "./modules/wallet";
import auth from "./modules/auth";
import category from "./modules/category";
import transaction from "./modules/transaction";

const router: Router = express.Router();

router.use("/users", users);
router.use("/wallet", wallet);
router.use("/auth", auth);
router.use("/category", category);
router.use("/transaction", transaction);

export default router;
