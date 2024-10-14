import express, { Router } from "express";
import { TransactionController } from "../../../controllers/v1/transactionController"
import { authenticateJWT } from "../../../middleware/authenticate"

const router: Router = express.Router();
const { createTransaction, getTransactionsByUser, getTransactionById, updateTransactionCategory, updateTransactionNote, getTotalIncome, getTotalExpense } = TransactionController();

router.post("/create", authenticateJWT, createTransaction);
router.get("/", authenticateJWT, getTransactionsByUser);
router.get("/:id", authenticateJWT, getTransactionById);
router.put("/:id/change-category", authenticateJWT, updateTransactionCategory)
router.get("/total/income", authenticateJWT, getTotalIncome);
router.get("/total/expense", authenticateJWT, getTotalExpense);
router.put("/change-note", authenticateJWT, updateTransactionNote);

export default router;