import { TransactionService } from "../../services/v1/transactionService";
import { Request, Response } from "express";
import { validate } from "../../utils/zodValidation";
import { createTransactionValidation } from "../../validations/transaction/create";
import { HttpBadRequestHandler, HttpCreatedHandler, HttpFetchedHandler } from "../../helpers/httpExceptionHandler";
import { walletService } from "../../services/v1/walletService";
import { changeCategoryValidation } from "../../validations/transaction/change_category";

const { save: saveTransaction, getAllTransactions, getDetailTransaction, updateTransactionCategory: changeTransactionCategory, getTotalExpense: fetchTotalExpense, getTotalIncome: fetchTotalIncome } = TransactionService();

export const TransactionController = () => {
    const createTransaction = async (req: Request, res: Response) => {
        try {
            const body = req.body;
            const userId = req.user as string;
            const validationResult = validate(body, createTransactionValidation);
            if (validationResult) {
                return HttpBadRequestHandler(res, validationResult);
            }

            const savedTransaction = await saveTransaction(body, userId);
            return HttpCreatedHandler(res, {
                message: "Transaction created successfully.",
                success: true,
                data: savedTransaction,
            })
        } catch (err: any) {
            return HttpBadRequestHandler(res, { error: err.message })
        }
    }

    const getTransactionsByUser = async (req: Request, res: Response) => {
        try {
            const userId = req.user as string;
            const transactions = await getAllTransactions(userId);
            if (transactions.length < 1) {
                return HttpBadRequestHandler(res, { message: "No transaction created by user" })
            }

            return HttpFetchedHandler(res, {
                message: "Transactions are being caught successfully!",
                success: true,
                data: transactions
            })
        } catch (err: any) {
            return HttpBadRequestHandler(res, { error: err.message })
        }
    }

    const getTransactionById = async (req: Request, res: Response) => {
        try {
            const userId = req.user as string;
            const { id } = req.params;
            const transaction = await getDetailTransaction(id, userId);
            return HttpFetchedHandler(res, {
                message: "Detailed Transaction is caught successfully!",
                success: true,
                data: transaction
            })
        } catch (err: any) {
            return HttpBadRequestHandler(res, { error: err.message })
        }
    }

    const getTotalIncome = async (req: Request, res: Response) => {
        try {
            const userId = req.user as string;
            const response = await fetchTotalIncome(userId);
            return HttpFetchedHandler(res, {
                success: true,
                data: response
            })
        } catch (err: any) {
            return HttpBadRequestHandler(res, {error: err.message})
        }
    }

    const getTotalExpense = async (req: Request, res: Response) => {
        try {
            const userId = req.user as string;
            const response = await fetchTotalExpense(userId);
            return HttpFetchedHandler(res, {
                success: true,
                data: response
            })
        } catch (err: any) {
            return HttpBadRequestHandler(res, { error: err.message })
        }
    }

    const updateTransactionCategory = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const userId = req.user as string;
            const body = req.body;
            const validationResult = validate(body, changeCategoryValidation);
            if (validationResult) {
                return HttpBadRequestHandler(res, validationResult)
            }

            const updatedTransaction = await changeTransactionCategory(id, userId, body.categoryId);
            return HttpFetchedHandler(res, {
                message: "Transaction's category updated successfully!",
                success: true,
                data: updatedTransaction
            })
        } catch (err: any) {
            return HttpBadRequestHandler(res, {error: err.message})
        }
    }

    return {
        createTransaction,
        getTransactionsByUser,
        getTransactionById,
        updateTransactionCategory,
        getTotalExpense,
        getTotalIncome
    }
}