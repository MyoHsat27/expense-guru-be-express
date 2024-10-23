import User from "../../models/user";
import { UserCreateObject } from "../../types/user";
import { walletService } from "./walletService";

const { create: createWallet } = walletService();

export const userService = () => {
    const findOne = async (param: Record<string, string>) => {
        const user = await User.findOne(param);
        return user;
    };

    const create = (user: UserCreateObject) => {
        const newUser = new User(user);
        return newUser;
    };

    const save = async (user: UserCreateObject) => {
        const newUser = create(user);
        const savedUser = await newUser.save();

        if (savedUser) {
            const newWallet = createWallet({
                userId: savedUser._id,
                totalBalance: 0
            });
            await newWallet.save();
        }
        return savedUser;
    };

    const updateUser = async (id: string, updateData: Partial<UserCreateObject>) => {
        const user = await User.findById(id);
        if (!user) {
            throw new Error('User not found');
        }

        Object.assign(user, updateData); // Update the user object with the new data
        const updatedUser = await user.save(); // Save the updated user to the database
        return updatedUser;
    };
    return { findOne, save ,updateUser};
};
