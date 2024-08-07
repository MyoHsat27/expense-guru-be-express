import express, { Request, Response, NextFunction } from 'express';
import v1Routes from './routes/v1/index';

const app = express();

app.use(express.json());

app.use('/api/v1', v1Routes);
app.use('/test', (req: Request, res: Response) => {
    res.send('Thar Linn Htet - Larry, Myo Hsat Nanda - Open Heaven');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong');
});

export default app;
