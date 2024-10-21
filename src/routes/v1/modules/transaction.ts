import express, { Router } from "express";
import { TransactionController } from "../../../controllers/v1/transactionController"

const router: Router = express.Router();
const { createTransaction, getTransactionsByUser, getTransactionById, updateTransactionCategory, updateTransactionNote, getTotalIncome, getTotalExpense } = TransactionController();

router.post("/create", createTransaction);
router.get("/", getTransactionsByUser);
router.get("/:id", getTransactionById);
router.put("/:id/change-category", updateTransactionCategory)
router.get("/total/income", getTotalIncome);
router.get("/total/expense", getTotalExpense);
router.put("/change-note", updateTransactionNote);

export default router;