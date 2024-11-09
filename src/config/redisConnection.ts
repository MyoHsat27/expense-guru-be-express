import { Redis } from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const redisConfig = {
    host: process.env.REDIS_HOST!,
    port: parseInt(process.env.REDIS_PORT!, 10),
    password: process.env.REDIS_PASSWORD!,
    maxRetriesPerRequest: null,
};

const redisClient = new Redis(redisConfig);

const connectRedis = async () => {
    return new Promise<void>((resolve, reject) => {
        redisClient.on('connect', () => {
            console.log('Connected to Redis');
            resolve();
        });
        redisClient.on('error', (err) => {
            console.error('Redis connection error:', err);
            reject(err);
        });
    });
}

// redisClient.on('connect', () => console.log('Connected to Redis'));
// redisClient.on('error', (err) => console.error('Redis connection error:', err));

export { redisClient, connectRedis };
