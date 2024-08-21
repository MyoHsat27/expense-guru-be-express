import passport from "passport";
import { Express } from "express";
import jwtStrategy from "./strategies/jwt.strategies";
import User from "../models/user";
import { UserObject } from "../types/user";

const usePassport = (app: Express): void => {
    app.use(passport.initialize());
    passport.use(jwtStrategy);
};

export default usePassport;
