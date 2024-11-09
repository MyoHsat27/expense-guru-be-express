import { z } from 'zod';
import { createTransactionValidation } from './create';

export const onceScheduleTransactionValidation = z
    .object({
        data: createTransactionValidation,
        transactionName: z.string({ message: "Need scheduler name" }),
        frequency: z.literal("Once"),
        startDate: z.coerce.date()
    });

export const weeklyScheduleTransactionValidation = z
    .object({
        data: createTransactionValidation,
        transactionName: z.string({ message: "Need scheduler name" }),
        frequency: z.literal("Weekly"),
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
        dayOfWeek: z.number().min(0).max(6)
    })

export const monthlyScheduleTransactionValidation = z
    .object({
        data: createTransactionValidation,
        transactionName: z.string({ message: "Need scheduler name" }),
        frequency: z.literal("Monthly"),
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
        dayOfMonth: z.number().min(1).max(31),
    })

export const scheduleTransactionValidation = z.union([onceScheduleTransactionValidation, weeklyScheduleTransactionValidation, monthlyScheduleTransactionValidation]);
