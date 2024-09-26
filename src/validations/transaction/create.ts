import { z } from "zod";
import { TransactionType } from "../../types/transaction";

export const createValidation = z
    .object({
        categoryId: z.string({ message: "Need category!" }),
        amount: z
            .number({ message: "Need amount!" })
            .positive({ message: "Amount must be positive!" }),
        type: z.enum([TransactionType.INCOME, TransactionType.EXPENSE], { message: "Need type!" })
    }).required();