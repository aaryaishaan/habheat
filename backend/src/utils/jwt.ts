import jwt from "jsonwebtoken"
import { ENV } from "../config/env.js";

interface jwtPayload {
    userId: string;
}

export const generateToken = (userId:string): string =>{

    if(!userId){
        throw new Error (`No payload found for token generation`);
    }
    const token= jwt.sign({userId}, ENV.JWT_SECRET, 
        {expiresIn: "7d"}
    )
    return token;

};

export const verifyToken = (token: string):jwtPayload =>{
    if(!token){
        throw new Error(`No token found.`)
    }

    return jwt.verify(token, ENV.JWT_SECRET) as jwtPayload
}