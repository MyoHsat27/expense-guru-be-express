import express, { Router, Request, Response } from 'express';

const router: Router = express.Router();

router.get('/login', (req: Request, res: Response) => {
    res.send('Hello, TypeScript Express!');
});

export default router;
