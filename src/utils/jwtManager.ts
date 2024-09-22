import jsonwebtoken from "jsonwebtoken";
import { Request } from "express";

export const generateToken = async (user:any) => {
    const payload = {
        id: user._id,
        email: user.email,
        username: user.username,
    };
    return await jsonwebtoken.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: "1d"
    });
};

export const getDataFromToken = (request: Request) => {
    try {
        // Retrieve the token from the cookies
        const token = request.cookies.authToken || "";

        // Verify and decode the token using the secret key
        const decodedToken: any = jsonwebtoken.verify(token, process.env.JWT_SECRET!);

        // Return the user ID from the decoded token
        return decodedToken;
    } catch (error: any) {
        throw new Error("Unauthorized");
    }
};
