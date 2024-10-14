import { TransactionService } from "../../services/v1/transactionService";
import { Request, Response } from "express";
import { validate } from "../../utils/zodValidation";
import { createTransactionValidation } from "../../validations/transaction/create";
import { HttpBadRequestHandler, HttpCreatedHandler, HttpFetchedHandler } from "../../helpers/httpExceptionHandler";
import { walletService } from "../../services/v1/walletService";
import { changeCategoryValidation } from "../../validations/transaction/change_category";
import { TransactionTab } from "../../enums/transactionTab";
import { changeNoteValidation } from "../../validations/transaction/change_note";

const { save: saveTransaction, getAllTransactions, getDetailTransaction, updateTransactionCategory: changeTransactionCategory, updateTransactionNote: changeNote, getTotalExpense: fetchTotalExpense, getTotalIncome: fetchTotalIncome } = TransactionService();

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
            const { tab, month } = req.query;

            const validTypes = [TransactionTab.ALL, TransactionTab.INCOME, TransactionTab.EXPENSE];
            if (tab && !validTypes.includes(tab as TransactionTab)) {
                return HttpBadRequestHandler(res, {message: "Invalid transaction type"})
            }

            if (month && (!/^(0[1-9]|1[0-2])$/.test(month as string))) {
                return HttpBadRequestHandler(res, { message: "Invalid month format. Use MM format (e.g., '01' for January)." });
            }

            const transactions = await getAllTransactions(userId, tab as string, month as string);
            
            return HttpFetchedHandler(res, {
                message: "Fetched transactions successfully!",
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
            return HttpBadRequestHandler(res, { error: err.message })
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
            return HttpBadRequestHandler(res, { error: err.message })
        }
    }

    const updateTransactionNote = async(req: Request, res: Response) => {
        try {
            const userId = req.user as string;
            const body = req.body;

            const validationResult = validate(body, changeNoteValidation);
            if (validationResult) {
                return HttpBadRequestHandler(res, { error: validationResult });
            }
            
            const updatedTransaction = await changeNote(body.id, userId, body.note);
            return HttpFetchedHandler(res, {
                message: "Transaction's note updated successfully!",
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
        updateTransactionNote,
        getTotalExpense,
        getTotalIncome
    }
}