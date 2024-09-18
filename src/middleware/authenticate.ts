import { Request, Response, NextFunction } from "express";
import { getDataFromToken } from "../utils/jwtManager";
import { HttpUnauthorizedHandler } from "../helpers/httpExceptionHandler";

interface JwtPayload {
    _id: string;
    username: string;
    email: string;
}

// Middleware function to authenticate user via JWT token
export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tokenData = await getDataFromToken(req);
        req.user = tokenData; // Add user data to the request object
        next(); // Call the next middleware or route handler
    } catch (error: any) {
        return HttpUnauthorizedHandler(res, "Invalid or expired token."); // Respond to the client
    }
};
