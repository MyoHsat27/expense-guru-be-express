import { z } from "zod";

export const editUserValidation = z.object(
    {
        username: z.string({ message: "require username" }),
        email: z.string({ message: "require email" }).email({ message: "format is wrong" }),
        // password: z.string({ message: "require password" }).min(6, "password required at least 6 character").optional()
    }
).required()