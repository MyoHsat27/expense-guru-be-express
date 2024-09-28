import { z } from 'zod';

export const changeCategoryValidation = z
    .object({
        categoryId: z.string({ message: "Need category!" }),
    }).required()