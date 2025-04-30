import argon2 from "argon2";
import jwt from "jsonwebtoken";
import M_staff from "../Models/M_staff.js";
import M_members from "../Models/M_member.js";
import { dataFailedResponse } from "../Utils/customResponse.js";

export const login = async (req, res) => {
    try{
        let user = await M_staff.findOne({ email: req.body.email });
        let typeModel = "staff";

        if(!user){
            user = await M_members.findOne({ email: req.body.email, isVerified: true });
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
        // console.log(error);
        return res.status(500).json(dataFailedResponse(error.message));
    }
}

export const generateRefreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        // Jika refresh token tidak ada
        if (!refreshToken) return res.status(401).json({ message: 'Refresh token is missing' });

        // Cari user berdasarkan refresh token
        let user = await M_members.findOne({ refreshToken });
        if (!user) {
            user = await M_staff.findOne({ refreshToken });
        }

        // Jika user tidak ditemukan
        if (!user) return res.status(401).json({ message: 'User not found' });

        // Verifikasi refresh token
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                // Jika token tidak valid
                return res.status(403).json({ message: 'Invalid refresh token' });
            }

            // Ambil data user yang sudah didekode
            const { _id, name, email, role } = user;

            // Generate access token baru
            const accessToken = jwt.sign(
                { userId: _id, name, email, role },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            );

            // Kirim access token ke client
            res.status(200).json({ accessToken });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const logout = async(req, res) => {
    try{
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(401);

        let user = await M_staff.findOne({ refreshToken: refreshToken });
        let typeModel = "staff";

        if(!user) {
            user = await M_members.findOne({ refreshToken: refreshToken });
            typeModel = "member";
        }

        if(!user) return res.sendStatus(204);


        if(typeModel == 'staff') {
            await M_staff.updateOne({refreshToken: null});
        }else{
            await M_members.updateOne({refreshToken: null});
        }
        res.clearCookie('refreshToken');
        return res.status(200).json({success: true, message: 'logout successfully'});
    }catch(error){
        console.log(error);
        return res.status(500).json(dataFailedResponse(error.message));
    }
}