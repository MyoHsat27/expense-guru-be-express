import { Request, Response } from "express";
import { userService } from "../../services/v1/userService";
import { authMeUserResponseMapper } from "../../utils/mappers/user.mapper";
import { UserObject, UserResponseObject } from "../../types/user";
import { HttpBadRequestHandler, HttpCreatedHandler, HttpForbiddenHandler, HttpUnauthorizedHandler } from "../../helpers/httpExceptionHandler";
import jsonwebtoken from "jsonwebtoken";

const { findOne } = userService();
export const authController = () => {
    const authMe = async (req: Request, res: Response) => {
        try {
            const userId = req.user as string; // Ensure this has been set by `authenticateJWT`
            const user = await findOne({ _id: userId });
            const userResponse = authMeUserResponseMapper().map<UserObject, UserResponseObject>(user, "UserObject", "UserResponseObject")
            return HttpCreatedHandler(res, {
                message: "Authenticated User found",
                success: true,
                data: userResponse
            });
        } catch (error: any) {
            return HttpBadRequestHandler(res, { error: error.message });
        }
    };

    const reNewAccessToken = async (req: Request, res: Response) => {
        const cookie = req.cookies;
        if (!cookie?.refreshToken) return HttpUnauthorizedHandler(res, "No refreshToken is provided!");
        const refreshToken = cookie.refreshToken;

        try {
            const decoded: any = await new Promise((resolve, reject) => {
                jsonwebtoken.verify(refreshToken, process.env.JWT_REFRESH_SECRET!, (err: any, decoded: any) => {
                    if (err) return reject(err);
                    resolve(decoded);
                })
            })
            const userId = decoded.id;
            const user = await findOne({ _id: userId });
            if (!user) return HttpForbiddenHandler(res, "User not found");
            const accessToken = jsonwebtoken.sign({ 'id': user._id }, process.env.JWT_SECRET!, { expiresIn: '15m' });
            return res.status(200).json({
                success: true,
                message: "Access token renewed",
                accessToken,
            });
        } catch (error) {
            return HttpForbiddenHandler(res, "Invalid or expired refresh token.");
        }
    }
    return { authMe, reNewAccessToken }
}