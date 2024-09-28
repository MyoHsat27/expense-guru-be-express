import { z } from "zod";
import { TransactionType } from "../../types/transaction";
import { checkDateFormat } from "../../helpers/helper";

export const getTransactionValidation = z
    .object({
        page: z
            .string()
            .regex(/^\d+$/, "can't add negative value or character")
            .nullable()
            .optional(),
        limit: z
            .string()
            .regex(/^\d+$/, "can't add negative value or character")
            .nullable()
            .optional(),
        date: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be in format "yyyy-mm-dd"')
            .date()
            .optional(),
        type: z
            .enum([TransactionType.INCOME, TransactionType.EXPENSE], {
                message: "Type must be Income or Expense"
            })
            .nullable()
            .optional(),
    })
    .refine(
        (values) => {
            if (!values.date) return true;
            else {
                return checkDateFormat(values.date);
            }
        },
        {
            message: "Date must be valid date",
            path: ["date"]
        }
    )