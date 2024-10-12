import { z } from "zod";
import { TransactionType } from "../../types/transaction";

export const createTransactionValidation = z
    .object({
        categoryId: z.string({ message: "Need category!" }),
        amount: z
            .number({ message: "Need amount!" })
            .positive({ message: "Amount must be positive!" }),
        type: z.enum([TransactionType.INCOME, TransactionType.EXPENSE], { message: "Need type!" }),
        note: z.string().min(5, { message: "Note must be at least 5 characters long" })
            .max(200, { message: "Note can't exceed 200 characters" })
            .optional()
            .or(z.literal(""))
    }).required();