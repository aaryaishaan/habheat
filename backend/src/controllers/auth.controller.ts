import {Request, Response} from 'express';

import {User} from '../models/user.model.js';
import {generateToken} from '../utils/jwt.js';
import {comparePassword, hashPassword} from '../utils/password.js';


export const registerUser =
    async(req: Request, res: Response): Promise<void> => {
  try {
    const {name, email, password} = req.body;

    if (!name || !email || !password) {
      res.status(400).json({message: 'Fill in the required fields'})
      return;
    }

    // check if the user already exists:
    const userExists = await User.findOne({email});
    if (userExists) {
      res.status(400).json({message: 'User already exists. Please login.'})
      return;
    }
    
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
        name, 
        email, 
        password: hashedPassword
    })
    
    //GENERATE JWT HERE:

    const token= generateToken(user._id.toString());
    
    //SEND THE TOKEN IN THE COOKIE:

    res.cookie("token", token,{
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,

    })


    res.status(201).json(
        {message: `User ${user.name} created successfully`,
        user: {
            id: user._id,
            name:user.name,
            email: user.email,
        }})



  } catch (error) {
    console.log(`Error in registering the user`,error)

    res.status(500).json({message: 'Internal Server Error. BRB!'})
  }
}

export const loginUser = 
async (req:Request, res:Response): Promise <void> =>{

    try {
     const {email, password} = req.body;
     
     if(!email || !password) {
        res.status(400).json({
            message:"Fill in the required fields."
        })
        return;
     }

     // checking if userExists:
    
     const user = await User.findOne({email});
       if(!user){
        res.status(400).json({
            message: "User does not exists. Please Register."
        })
        return;
       }
     
       //compare the hashed passwords here

      const isPasswordCorrect= await comparePassword(password,user.password)
      if(!isPasswordCorrect){
        res.status(401).json({
            message: "Invalid Credentials."
        })
        return;
      }
      
      //GENERATE TOKEN

      const token = generateToken(user._id.toString());

      //send token

      res.cookie("token", token, {
       httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })

      res.status(200).json({
        message: "User logged in Successfully.",
        user:{
            id: user._id,
            name: user.name,
            email: user.email,

        }
      })



    } catch (error) {

        console.error("Login error:", error);

        res.status(500).json({
            message: "Internal server error. BRB!",
        });
        
    }

}

export const logoutUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        res.clearCookie("token");

        res.status(200).json({
            message: "Logout successful",
        });
    } catch (error) {
        console.error("Logout error:", error);

        res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const updateUser = async (req:Request, res:Response): Promise<void> =>{
    try {
    const{name, email}= req.body;
    
    if(!name && !email){
        res.status(400).json({
            message:"Nothing to update"
        })
        return;
    }
   const user = await User.findById(req.userId);

   if(!user){
    res.status(404).json({
        message: "User not found"
    })
    return;
   }

   if(name) user.name = name;
   if (email) user.email= email;

await user.save();


        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });


    } catch (error) {
         console.error("Update profile error:", error);

        res.status(500).json({
            message: "Internal server error",
        });


    }
}

export const getMe =
 async (req:Request, res:Response): Promise <void> =>{

    try {
    const userId = req.userId;

     const user = await User.findById(userId).select("-password");

     if(!user){
        res.status(404).json({
            message: "User not found",
        })
        return;
     }

     res.status(200).json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,


        }
     })

        
    } catch (error) {
         console.error("getMe error:", error);

        res.status(500).json({
            message: "Internal server error. BRB!",
        });
        
    }

 }