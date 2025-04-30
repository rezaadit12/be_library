import mongoose from "mongoose";
const { Schema } = mongoose;

const M_members = new Schema({
    username: { type: String, required: true },
    address: String,
    phone_number: String,
    email:          { type: String, required: true, unique: true },
    password:       { type: String, requried: true },
    joinDate:       { type: Date, default: null},
    refreshToken:   { type: String, default: null },
    isVerified:     { type: Boolean, requried: true },
    otp: {
        code:       String,
        expiresAt:  { type: Date}
    }

}, { timestamps: true });

export default mongoose.model('member', M_members);
