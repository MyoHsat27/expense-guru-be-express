import { Worker, Job } from "bullmq";
import {redisClient, connectRedis} from '../config/redisConnection'
import { QueueName } from "../enums/queue";
import { TransactionService } from '../services/v1/transactionService';

const { save: saveTransaction } = TransactionService();

const initializeWorker = async () => {
    await connectRedis();

    const worker = new Worker(QueueName.TRANSACTION_QUEUE, async (job: Job) => {
        const { data, userId } = job.data;
        console.log(`Processing transaction job for user ${userId} ...`);
        await saveTransaction(data, userId);
    }, { connection: redisClient });

    worker.on('completed', (job: Job) => {
        console.log(`Job ${job.id} has completed successfully!`);
    });
    worker.on('failed', (job: any, err) => {
        console.log(`Job ${job.id} has failed with ${err.message}`)
    });
    worker.on("error", (err) => {
        console.error(err);
    });
}

export default initializeWorker;
