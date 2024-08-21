import { HttpBadRequestHandler, HttpFetchedHandler } from "../../helpers/httpExceptionHandler";
import { Request, Response } from "express";
import { walletService } from "../../services/v1/walletService";
import { UserObject } from "../../types/user";

const { findByUserId: findBalanceByUserId } = walletService();
export const walletController = () => {
    const getBalance = async (req: Request, res: Response) => {
        const user = req.user as UserObject;
        const userId = user._id;
        try {
            const balance = await findBalanceByUserId(userId);
            return HttpFetchedHandler(res, {
                success: true,
                data: balance
            });
        } catch (error: any) {
            return HttpBadRequestHandler(res, { error: error.message });
        }
    };
    return { getBalance };
};
