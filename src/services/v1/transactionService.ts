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

    const getTotalTransaction = async (userId: string, type: string) => {
        try {
            const walletId = await findWalletByUser(userId);

            const results = await Transaction.aggregate([
                { $match: { walletId: walletId._id, type: type } },
                {
                    $group: {
                        _id: "$type",
                        totalAmount: { $sum: "$amount" },
                    }
                }
            ]);

            if (results.length === 0) {
                console.log("No transactions found.");
                return { [type]: 0 };
            }

            const formattedResults = results.reduce((acc, item) => {
                acc[item._id] = item.totalAmount;
                return acc;
            }, {});

            return formattedResults;
        } catch (err: any) {
            throw new Error("Failed to get total transactions: " + err.message);
        }
    };


    const getTotalIncome = async (userId: string) =>{
        return await getTotalTransaction(userId, "income")
    }

    const getTotalExpense = async (userId: string)=>{
        return await getTotalTransaction(userId, "expense")
    }

    const create = async (transaction: TransactionCreateObject, userId: string) => {
        const wallet = await findWalletByUser(userId);
        const category = await findCategory({ _id: transaction.categoryId, userId: userId });
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
            const category = await findCategory({ _id: categoryId, userId: userId })
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
        updateTransactionCategory,
        getTotalIncome,
        getTotalExpense
    }
}