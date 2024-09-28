import Transaction from "../../models/transaction";
import { TransactionCreateObject } from "../../types/transaction";
import { walletService } from "./walletService";
import { CategoryService } from "./categoryService";
import { transformToObjectId } from "../../helpers/helper";

const { findById: findCategoryById, findOne: findCategory } = CategoryService();
const { findByUserId: findWalletByUser, calculateBalance: calculateWalletBalance } = walletService();

export const TransactionService = () => {
    const getAllTransactions = async (userId: string) => {
        try {
            const wallet = await findWalletByUser(userId);
            const transactions = await Transaction.find({ walletId: wallet._id }).populate({ path: "categoryId", select: "name -_id" }).sort({ createdAt: -1 });
            return transactions;
        } catch (err: any) {
            throw new Error("Failed to retrieve transactions: " + err.message)
        }
    }

    const getDetailTransaction = async (transactionId: string, userId: string) => {
        try {
            const wallet = await findWalletByUser(userId);
            const transaction = await Transaction.findOne({ _id: transactionId, walletId: wallet._id }).populate({ path: "categoryId", select: "name -_id" });
            if (!transaction) {
                throw new Error("Transaction not found or does not belong to the user.")
            }
            return transaction;
        } catch (err: any) {
            throw new Error("Failed to retrieve detailed transaction: " + err.message)
        }
    }

    const create = async (transaction: TransactionCreateObject, userId: string) => {
        const wallet = await findWalletByUser(userId);
        const category = await findCategory({_id: transaction.categoryId, userId: userId});
        const newTransaction = new Transaction({ ...transaction, walletId: wallet._id, categoryId: category._id });
        return newTransaction;
    }

    const save = async (transaction: TransactionCreateObject, userId: string) => {
        const createdTransaction = await create(transaction, userId);
        const savedTransaction = await createdTransaction.save();
        await calculateWalletBalance(
            createdTransaction.walletId,
            transaction.amount,
            transaction.type
        );

        return savedTransaction;
    }

    const updateTransactionCategory = async (transactionId: string, userId: string, categoryId: string) => {
        try {
            const category = await findCategory({_id: categoryId, userId: userId})
            const wallet = await findWalletByUser(userId);

            const currentTransaction = await Transaction.findOne({ _id: transactionId, walletId: wallet._id });
            if (!currentTransaction) {
                throw new Error("Transaction not found!")
            }
            currentTransaction.categoryId = category._id;
            const updatedTransaction = await currentTransaction.save();
            return updatedTransaction;
        } catch (err: any) {
            throw new Error("Failed to update the transaction's category: " + err.message)
        }
    }

    return {
        save,
        getAllTransactions,
        getDetailTransaction,
        updateTransactionCategory
    }
}