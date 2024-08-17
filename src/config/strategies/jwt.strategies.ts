import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secret: "secret"
};

const jwtStrategy = () => {};

export default jwtStrategy;
