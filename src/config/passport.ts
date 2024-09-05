import passport from "passport";
import { Express } from "express";
import jwtStrategy from "./strategies/jwt.strategies";
import googleStrategy from "./strategies/google.strategies";

const usePassport = (app: Express): void => {
    app.use(passport.initialize());
    passport.use(jwtStrategy);
    passport.use(googleStrategy);
};

export default usePassport;
