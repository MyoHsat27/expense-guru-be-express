import { Request, Response } from "express";
import { HttpBadRequestHandler, HttpCreatedHandler } from "../../helpers/httpExceptionHandler";
import { userService } from "../../services/v1/userService";
import { validate } from "../../utils/zodValidation";
import { signUpValidation } from "../../validations/signup";
import { hashPassword, comparePassword } from "../../utils/passwordManager";
import { signInValidation } from "../../validations/signin";
import { generateToken } from "../../utils/jwtManager";

const { findOne, save } = userService();
export const userController = () => {
    const login = async (req: Request, res: Response) => {
        try {
            const body = req.body;
            const validatedResult = validate(body, signInValidation);
            if (validatedResult) {
                return HttpBadRequestHandler(res, validatedResult);
            }

            const { email, password } = body;
            const user = await findOne({ email });
            if (!user) {
                return HttpBadRequestHandler(res, "user not found");
            }

            const validPassword = await comparePassword(password, user.password);
            if (!validPassword) {
                return HttpBadRequestHandler(res, "email or password is wrong");
            }

            const tokenData = {
                id: user._id,
                username: user.username,
                email: user.email
            };

            const token = await generateToken(tokenData);
            res.cookie("authToken", token, {
                httpOnly: true,
            });

            HttpCreatedHandler(res, {
                message: "Login successful",
                success: true,
                authToken: token
            });
        } catch (error: any) {
            return HttpBadRequestHandler(res, { error: error.message });
        }
    };

    const register = async (req: Request, res: Response) => {
        try {
            const body = req.body;

            const validationResult = validate(body, signUpValidation);
            if (validationResult) {
                return HttpBadRequestHandler(res, validationResult);
            }

            const { username, email, password } = body;

            const user = await findOne({ email });
            if (user) {
                return HttpBadRequestHandler(res, "user already exists");
            }
            console.log("FUCK");
            const hashedPassword = await hashPassword(password);
            const savedUser = await save({
                username,
                email,
                password: hashedPassword
            });

            return HttpCreatedHandler(res, {
                responseMessage: "User created successfully",
                success: true
            });
        } catch (error: any) {
            return HttpBadRequestHandler(res, { error: error.message });
        }
    };

    const authMe = async (req: Request, res: Response) => {
        try {
            const user = req.user; // Ensure this has been set by `authenticateJWT`
            return HttpCreatedHandler(res, {
                message: "Authenticated User found",
                success: true,
                data: user
            });
        } catch (error: any) {
            return HttpBadRequestHandler(res, { error: error.message });
        }
    };
    const logout = async(req:Request,res:Response)=>{
        try{
            res.cookie("authToken", "", {
                httpOnly: true,
                expires: new Date(0), // Set expiration date to the past
            });

            return HttpCreatedHandler(res,{
                message:"Logout Successfully",
                success:true
            });
            
        }catch(error:any){
            return   HttpBadRequestHandler(res, { error: error.message });
        }
    }
    return { register, login, authMe, logout };
};
