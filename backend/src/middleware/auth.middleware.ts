import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";

export const protectRoute =  (req:Request, res:Response, next:NextFunction) : void =>{
  try {
    const token= req.cookies.token;

    if(!token){
        res.status(401).json({
            message: "Unauthorized-Token missing."
        })
        return;
    }

    //verify the token here:

    const decoded= verifyToken(token);

    req.userId= decoded.userId;
    next();



  } catch (error) {
      console.error("Authentication error:", error);

        res.status(401).json({
            message: "Unauthorized - Invalid or expired token",
        });
    
  }


}