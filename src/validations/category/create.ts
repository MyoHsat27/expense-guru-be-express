import { z } from 'zod';

export const categoryCreateValidation = z
    .object({
        name: z.string({ message: "Category name is required" })
            .max(20, { message: "Category must be at most 20 characters long" })
            .regex(/^[A-Za-z\s]*$/, {
                message: "Category can only contain letters and spaces",
            })
    })
    .required();

export type CategoryType = z.infer<typeof categoryCreateValidation>;