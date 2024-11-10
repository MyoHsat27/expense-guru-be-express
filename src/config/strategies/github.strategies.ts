import {Strategy as GithubStrategy,StrategyOptions} from 'passport-github2'
import User from '../../models/user';
import { hashPassword } from '../../utils/passwordManager';
import { userService } from '../../services/v1/userService';
import dotenv from 'dotenv';
dotenv.config();

const {save} =  userService();
const githubOptions : StrategyOptions={
    clientID:process.env.GITHUB_CLIENT_ID! as string,
    clientSecret:process.env.GITHUB_CLIENT_SECRET! as string,
    callbackURL:"http://localhost:8000/api/v1/auth/github/callback",
    scope: ['user:email']
}

const githubStrategy = new GithubStrategy(githubOptions,async(accessToken:any, refreshToken:any, profile:any, done:any)=>{
    const email = profile.emails[0]?.value;
    const name =  profile.username;
    try{
        let user  = await User.findOne({email});
        if (user) { 
            return done(null, user.toObject());
        } else {
            const randomPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await hashPassword(randomPassword);

            const newUser = {
                username: name,
                email: email,
                password: hashedPassword!,
                Oauth:true
            };
            user = await save(newUser)
        }
        return done(null, user);
    }catch(error){
        return done(error,false)
    }
})

export default githubStrategy;