import { HttpBadRequestHandler, HttpCreatedHandler } from "../../helpers/httpExceptionHandler";
import { Request, Response } from "express";
import { walletService } from "../../services/v1/walletService";

export const walletController = () => {
    const { findByUserId: findBalanceByUserId } = walletService();
    const getBalance = async (req: Request, res: Response) => {
        const userId = req.body.get("userId")!;
        try {
            const balance = await findBalanceByUserId(userId);
            return HttpCreatedHandler(res, {
                success: true,
                data: balance
            });
        } catch (error: any) {
            return HttpBadRequestHandler(res, { error: error.message });
        }
    };
    return { getBalance };
};
