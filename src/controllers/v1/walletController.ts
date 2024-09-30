import { HttpBadRequestHandler, HttpFetchedHandler } from "../../helpers/httpExceptionHandler";
import { Request, Response } from "express";
import { walletService } from "../../services/v1/walletService";
import { UserObject } from "../../types/user";

const { findByUserId: findWalletByUser } = walletService();
export const walletController = () => {
    const getBalance = async (req: Request, res: Response) => {
        const userId = req.user as string;
        try {
            const wallet = await findWalletByUser(userId);
            return HttpFetchedHandler(res, {
                success: true,
                data: wallet
            });
        } catch (error: any) {
            return HttpBadRequestHandler(res, { error: error.message });
        }
    };
    return { getBalance };
};
