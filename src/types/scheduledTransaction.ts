import { TransactionCreateObject } from "./transaction"

export interface ScheduledTransaction {
    data: TransactionCreateObject,
    userId: string,
    transactionName: string,
    frequency: 'Once' | 'Weekly' | 'Monthly',
    startDate: Date,
    endDate?: Date,
    dayOfWeek?: number,
    dayOfMonth?: number
}