import { Strategy as GoogleStrategy, StrategyOptions } from "passport-google-oauth20";
import User from "../../models/user";
import dotenv from "dotenv";
import { hashPassword } from "../../utils/passwordManager";
import { userService } from "../../services/v1/userService";
dotenv.config();

const { save } = userService();

const googleOptions: StrategyOptions = {
    clientID: process.env.GOOGLE_CLIENT_ID! as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET! as string,
    callbackURL: process.env.GOOGLE_CALLBACK,
    scope: ["profile", "email"]
};

const googleStrategy = new GoogleStrategy(googleOptions, async (accessToken, refreshToken, profile, done) => {
    const { sub, name, email } = profile._json;
    try {
        let user = await User.findOne({ email });

        if (user) {
            return done(null, user.toObject());
        } else {
            const randomPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await hashPassword(randomPassword);

            const newUser = {
                username: name!,
                email: email!,
                password: hashedPassword!,
            };
            user = await save(newUser)
        }
        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
});

export default googleStrategy;
