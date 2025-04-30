import M_members from "../Models/M_member.js";
import argon2 from "argon2";
import { fetchAllDataSuccess, dataSuccessResponse, dataFailedResponse } from "../Utils/customResponse.js";
import { sendCodeVerification    } from "../Config/sendMail.js";

export const registerMember = async (req, res) => {
    const { username, address, phone_number, email, password, confirm_password } = req.body;

    if (!username || !address || !phone_number || !email || !password || !confirm_password) {
        return res.status(400).json(dataFailedResponse('All fields are required.'));
    }

    if(password !== confirm_password) return res.status(400).json({message: 'Password does not match!'});

    try {        
        const checkExistAccount = await M_members.findOne({ email });

        const randomCodeVerification = `${Math.floor(100000 + Math.random() * 900000)}`;
        let now = new Date();
        now.setMinutes(now.getMinutes() + 10);
        
        if (checkExistAccount) {
            if (checkExistAccount.isVerified) {
                return res.json(dataFailedResponse('Account already exists and is verified'));
            }
        
            // Update OTP & resend email
            checkExistAccount.otp.code = randomCodeVerification;
            checkExistAccount.otp.expiresAt = now;
            
            const sendEmail = await sendCodeVerification(checkExistAccount.username, email, randomCodeVerification);
            
            if (sendEmail) {
                const data = await checkExistAccount.save();
                return res.status(200).json(dataSuccessResponse('Verification code resent to your email', data));
            } else {
                return res.status(500).json(dataFailedResponse('Failed to resend verification email'));
            }
        }
        
        // Kalau belum ada, buat akun baru
        const data = {
            username, 
            address, 
            phone_number, 
            email,  
            password: await argon2.hash(password),
            isVerified: false,
            otp: {
                code: randomCodeVerification,
                expiresAt: now,
            }
        };
        
        const sendEmail = await sendCodeVerification(username, email, data.otp.code);
        
        if (sendEmail) {
            const createNewMember = await M_members.create(data);
            return res.status(201).json(dataSuccessResponse('Account created successfully. Please verify via email.', createNewMember));
        } else {
            return res.status(500).json(dataFailedResponse('Failed to send verification email'));
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json(dataFailedResponse(error.message));
    }
}

export const verifyOtpCode = async(req, res) => {
    const { otp_code } = req.body;
    if(!otp_code) return res.status(400).json(dataFailedResponse('code otp is required.'));
    try{
        const currentTime = new Date();
        const member = await M_members.findOne({'otp.code': otp_code});
        if (!member) {
            return res.status(404).json(dataFailedResponse('OTP not found'));
        }
        
        const isOtpValid = member.otp.expiresAt > currentTime;
        
        if (!isOtpValid) {
            return res.status(400).json(dataFailedResponse('OTP has expired, try again!'));
        }

        member.joinDate = currentTime;
        member.isVerified = true;
        const memberIsVerified = await member.save();

        if (memberIsVerified) {
            return res.status(200).json({
                message: 'Your account has been successfully verified. You can now log in.',
                data: memberIsVerified
            });
        } else {
            return res.status(500).json({
                message: 'Account verification failed. Please try again later.'
            });
        }
    }catch(error){
        console.log(error);
        return res.status(500).json(dataFailedResponse(error.message));
    }
}

export const getAllMembers = async(req, res) => {
    try{
        const members = await M_members.find();
        return res.json(fetchAllDataSuccess('Get members successfully', members.length, members));
    }catch(error){
        console.log(error);
        return res.status(500).json(dataFailedResponse(error.message));
    }
}

export const getMemberById = async (req, res) => {
    const { id } = req.params;
    try{
        const member = await M_members.findOne({_id: id});
        if(!member) return res.status(404).json(dataFailedResponse('member not found!'));
        return res.json(dataSuccessResponse('Get member by id successfully', member));
    }catch(error){
        console.log(error);
        return res.status(500).json(dataFailedResponse(error));
    }
}

//update member
//delete member
//forgot password
//
