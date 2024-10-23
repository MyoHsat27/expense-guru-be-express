import { Request, Response } from "express";
import { HttpBadRequestHandler, HttpCreatedHandler } from "../../helpers/httpExceptionHandler";
import { userService } from "../../services/v1/userService";
import { validate } from "../../utils/zodValidation";
import { signUpValidation } from "../../validations/signup";
import { hashPassword, comparePassword } from "../../utils/passwordManager";
import { signInValidation } from "../../validations/signin";
import { generateToken } from "../../utils/jwtManager";
import { authMeUserResponseMapper } from "../../utils/mappers/user.mapper";
import { UserObject, UserResponseObject } from "../../types/user";
import { editUserValidation } from "../../validations/profile/edit";

const { findOne, save , updateUser } = userService();
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
                _id: user._id,
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
                success: true,
                data: savedUser
            });
        } catch (error: any) {
            return HttpBadRequestHandler(res, { error: error.message });
        }
    };

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
    const logout = async(req:Request,res:Response)=>{
        try{
            res.clearCookie("authToken",{httpOnly:true,secure:true});

            return HttpCreatedHandler(res,{
                message:"Logout Successfully",
                success:true
            });
            
        }catch(error:any){
            return   HttpBadRequestHandler(res, { error: error.message });
        }
    }
    const update = async(req:Request,res:Response)=>{
        try{
            const body = req.body;

            const validatedResult = validate(body, editUserValidation);
            if (validatedResult) {
                return HttpBadRequestHandler(res, validatedResult);
            }
            const {id,username,email,password} = body;
            const updateData: any = {
                username,
                email,   
            };

            if (password !== "") {
                updateData.password = await hashPassword(password);
            }
            const updatedUser =  await updateUser(id,updateData);
            console.log(updatedUser)
            return HttpCreatedHandler(res,{
                message:"Edit user succcessfully",
                success:true,
                passwordChanged:!!updateData.password
            })
        }catch(error:any){
            return HttpBadRequestHandler(res,{error:error.message})
        }
    }
    const checkPassword = async(req:Request,res:Response)=>{
        try{
            const {password,id} = req.body
            const user = await findOne({_id:id})
            if(!user){
                return HttpBadRequestHandler(res,"User not found")
            }
            const isPasswordCorrect = await comparePassword(password,user.password);
            if(!isPasswordCorrect){
                return res.json({message:"Incorrect Password",success:false,status:400})
            }
            return HttpCreatedHandler(res,{
                message:"Password is correct",
                success:true
            })
        }catch(error:any){
            return HttpBadRequestHandler(res,{error:error.message})
        }
    }
    return { register, login, authMe, logout,update,checkPassword };
};
