import { z } from 'zod';

export const changeNoteValidation = z.object({
    note: z
        .string()
        .min(5, { message: "Note must be at least 5 characters long" })
        .max(200, { message: "Note can't exceed 200 characters" }).optional().or(z.literal(''))
});
