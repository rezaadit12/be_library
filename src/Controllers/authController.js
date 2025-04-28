import argon2 from "argon2";
import jwt from "jsonwebtoken";
import M_staff from "../Models/M_staff.js";
import M_members from "../Models/M_member.js";
import { dataFailedResponse } from "../Utils/customResponse.js";


// export const register = (Model) => async (req, res) => {
//     const { name, email, password, confPassword } = req.body;

//     if(password !== confPassword) return res.status(400).json({message: 'Password does not match!'});

//     const hashPassword = await argon2.hash(password);
//     try {
//         await Model.create({

//         });
//     } catch (error) {
        
//     }

// }

export const login = async (req, res) => {
    try{
        let user = await M_staff.findOne({ email: req.body.email });
        let typeModel = "staff";

        if(!user){
            user = await M_members.findOne({ email: req.body.email });
            typeModel = 'member';
        }

        const matchData = await argon2.verify(user.password, req.body.password);

        if(!matchData) return res.status(400).json({message: "Email or password is incorrect"});

        const userId = user.id;
        const username = user.username;
        const email = user.email;
        const role = user.role;

        const accessToken = jwt.sign({ userId, username, email, role }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '15m'
        }); 

        const refreshToken = jwt.sign({userId, username, email, role}, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '7d'
        }); 

        if(typeModel == 'staff'){
            await M_staff.updateOne({_id: userId}, {refreshToken:refreshToken });
        }else{
            await M_members.updateOne({_id: userId}, {refreshToken:refreshToken });
        }

        res.cookie('refreshToken', refreshToken, {
            secure: process.env.NODE_ENV !== "development",
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({ accessToken, user});
    }catch(error){
        console.log(error);
        return res.status(500).json(dataFailedResponse(error.message));
    }
}

export const generateRefreshToken = async(req, res) => {
    try{
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(401);
        

        let user = await M_members.findOne({refreshToken: refreshToken });
        if(!user){
            user = await M_staff.findOne({refreshToken: refreshToken });
        }

        if(!user) return res.sendStatus(403);

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if(err) return res.sendStatus(403);

            const  {_id, name, email, role } = user;
            const accessToken = jwt.sign({ userId: _id, name, email, role }, process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m'}
            );
            res.json({ accessToken })
        });
    }catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}