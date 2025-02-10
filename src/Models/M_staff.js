import mongoose from "mongoose";
const { Schema } = mongoose;


const M_staff = new Schema({
    username: { type: String, required: true },
    roles: { type: [String], required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    refreshToken: { type: String }
}, { timestamps: true });

export default mongoose.model('staff', M_staff);
