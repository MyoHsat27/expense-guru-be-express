import { Queue } from "bullmq";
import { redisClient } from "../config/redisConnection";
import { FrequencyType, QueueName } from "../enums/queue";
import { ScheduledTransaction } from "../types/scheduledTransaction";

const transactionQueue = new Queue(QueueName.TRANSACTION_QUEUE, { defaultJobOptions: { attempts: 3, backoff: { type: 'exponential', delay: 1000 } }, connection: redisClient });

function calculateCronExpression(frequency: string, option: number) {
    switch (frequency) {
        case FrequencyType.WEEKLY:
            return `0 0 * * ${option}`;
        case FrequencyType.MONTHLY:
            return `0 0 ${option} * *`;
        default:
            throw new Error('Invalid Frequency Type')
    }
}

async function scheduleTransactionJob(schedule: ScheduledTransaction) {
    const { data, userId, transactionName, frequency, startDate, endDate, dayOfWeek, dayOfMonth } = schedule;
    const delay = startDate && new Date(startDate) > new Date() ? new Date(startDate).getTime() - Date.now() : 0;
    console.log(delay);

    if (frequency === FrequencyType.ONCE) {
        await transactionQueue.add(
            `oneTime-${transactionName}-by-${userId}`,
            { data, userId },
            { delay: delay, removeOnComplete: 1000 }
        );
    } else {
        const cron = calculateCronExpression(frequency, frequency === FrequencyType.WEEKLY ? dayOfWeek! : dayOfMonth!);
        await transactionQueue.add(
            `initialJob-${transactionName}-by-${userId}`,
            { data, userId },
            { delay: delay }
        );
        await transactionQueue.upsertJobScheduler(
            `repeatJob-${transactionName}-by-${userId}`,
            {
                pattern: cron,
                endDate: new Date(endDate!)
            },
            {
                name: `scheduleJob-${transactionName}-by-${userId}`,
                data: {data, userId}
            }
        )
    }


    //--------- this is the last update version of repeat job scheduler --------- ///
    // else if (frequency === FrequencyType.WEEKLY) {
    //     const cron = calculateCronExpression(frequency, dayOfWeek!);
    //     await transactionQueue.upsertJobScheduler(
    //         `repeatable-transaction-job-${transactionName}-by-${userId}`,
    //         {
    //             pattern: cron,
    //             startDate: new Date(startDate),
    //             endDate: new Date(endDate!),
    //         },
    //         {
    //             name: `schedule-job-${transactionName}-by-${userId}`,
    //             data: { data, userId }
    //         }
    //     )
    // } else if (frequency === FrequencyType.MONTHLY) {
    //     const cron = calculateCronExpression(frequency, dayOfMonth!);
    //     await transactionQueue.upsertJobScheduler(
    //         `repeatable-transaction-job-${transactionName}-by-${userId}`,
    //         {
    //             pattern: cron,
    //             startDate: new Date(startDate),
    //             endDate: new Date(endDate!)
    //         },
    //         {
    //             name: `schedule-job-${transactionName}-by-${userId}`,
    //             data: { data, userId }
    //         }
    //     )
    // }
    //--------- this is the last update version of repeat job scheduler --------- ///

    console.log(`Scheduled transaction ${transactionName} for user ${userId}`);
}

export default scheduleTransactionJob;
