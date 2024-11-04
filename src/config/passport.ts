import passport from "passport";
import { Express } from "express";
import jwtStrategy from "./strategies/jwt.strategies";
import googleStrategy from "./strategies/google.strategies";
import githubStrategy from "./strategies/github.strategies";

const usePassport = (app: Express): void => {
    app.use(passport.initialize());
    passport.use(jwtStrategy);
    passport.use(googleStrategy);
    passport.use(githubStrategy)
};

export default usePassport;
