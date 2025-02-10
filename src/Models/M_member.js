import mongoose from "mongoose";
const { Schema } = mongoose;

const M_members = new Schema({
    username: { type: String, required: true },
    address: String,
    phone_number: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, requried: true },
    joinDate: { type: Date, requried: true },
    refreshToken: { type: String, required: true },
    isVerified: { type: String, requried: true },
    otp: {
        code: { type: Number, requried: true },
        expiresAt: { type: Date, requried: true }
    }

}, { timestamps: true });

export default mongoose.model('member', M_members);
