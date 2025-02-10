import mongoose from "mongoose";
const { Schema } = mongoose;

const M_category = new Schema({
    categoryName: { type: String, required: true }
});

export default mongoose.model('category', M_category);