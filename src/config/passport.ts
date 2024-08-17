import passport from "passport";
import { Express } from "express";

const usePassport = (app: Express): void => {
    app.use(passport.initialize());
};

export default usePassport;
