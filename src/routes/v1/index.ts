import express, { Router } from "express";
import users from "./modules/users";
import wallet from "./modules/wallet";
import auth from "./modules/auth";
import category from "./modules/category";
import transaction from "./modules/transaction";
import { authenticateJWT } from "../../middleware/authenticate";

const router: Router = express.Router();

router.use("/users", users);
router.use("/auth", auth);

router.use(authenticateJWT);

router.use("/wallet", wallet);
router.use("/category", category);
router.use("/transaction", transaction);

export default router;
