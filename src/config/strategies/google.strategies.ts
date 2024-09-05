import { Strategy as GoogleStrategy, StrategyOptions } from "passport-google-oauth20";
import User from "../../models/user";
import dotenv from "dotenv";
import { hashPassword } from "../../utils/passwordManager";
dotenv.config();

const googleOptions: StrategyOptions = {
    clientID: process.env.GOOGLE_CLIENT_ID! as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET! as string,
    callbackURL: process.env.GOOGLE_CALLBACK,
    scope: ["profile", "email"]
};

const googleStrategy = new GoogleStrategy(googleOptions, async (accessToken, refreshToken, profile, done) => {
    const { sub, name, email } = profile._json;
    try {
        let user = await User.find({ email });

        if (user) {
            return done(null, user);
        } else {
            const randomPassword = Math.random().toString(36).slice(-8);

            const hashedPassword = await hashPassword(randomPassword);
            user = await User.create({
                name,
                email,
                password: hashedPassword,
                isVerified: true
            });
        }
        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
});

export default googleStrategy;
