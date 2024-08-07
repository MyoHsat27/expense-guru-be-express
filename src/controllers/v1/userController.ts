import { Request, Response } from 'express';
import { HttpBadRequestHandler, HttpCreatedHandler } from '../../helpers/httpExceptionHandler';
import { userService } from '../../services/v1/userService';
import { validate } from '../../utils/zodValidation';
import { signUpValidation } from '../../validations/signup';
import { hashPassword } from '../../utils/passwordManager';

const { findOne, save } = userService();
export const userController = () => {
    const register = async (req: Request, res: Response) => {
        try {
            const body = req.body;

            const validationResult = validate(body, signUpValidation);
            if (validationResult) {
                return HttpBadRequestHandler(validationResult);
            }
            const { username, email, password } = body;

            const user = await findOne({ email });
            if (user) {
                return HttpBadRequestHandler('user already exists');
            }
            const hashedPassword = await hashPassword(password);
            const savedUser = await save({
                username,
                email,
                password: hashedPassword
            });

            return HttpCreatedHandler({
                responseMessage: 'User created successfully',
                success: true
            });
        } catch (error: any) {
            return HttpBadRequestHandler({ error: error.message });
        }
    };
    return { register };
};
