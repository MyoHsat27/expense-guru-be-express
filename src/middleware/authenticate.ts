import { Request, Response, NextFunction } from "express";
import { HttpUnauthorizedHandler } from "../helpers/httpExceptionHandler";
import jsonwebtoken from "jsonwebtoken";

// Middleware function to authenticate user via JWT token
export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) return HttpUnauthorizedHandler(res, "No Authorization Header provided!");
        const token = authHeader.split(' ')[1];
        jsonwebtoken.verify(
            token,
            process.env.JWT_SECRET!,
            (err, decoded: any) => {
                if (err || !decoded) return HttpUnauthorizedHandler(res, "Invalid token");
                req.user = decoded.id;
                next();
            }
        )
    } catch (error: any) {
        return HttpUnauthorizedHandler(res, "Invalid or expired token."); // Respond to the client
    }
};
