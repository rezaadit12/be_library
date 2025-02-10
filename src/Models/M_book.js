import mongoose from "mongoose";
const { Schema } = mongoose;

const categorySchema = new Schema({
    categoryID: { type: Schema.Types.ObjectId, required: true, ref: "category" },
    categoryName: { type: String, required: true }
});

const M_books = new Schema({
    title: { type: String, required: true },
    synopsis: { type: String, required: true },
    author: { type: String, required: true },
    publisher: { type: String, required: true },
    publishedYear: { type: Number, required: true },
    isbn: { type: String, required: true, unique: true },
    AvailableCopies: { type: Number, required: true, min: 0 },
    image: String,
    Categories: { type: [categorySchema], default: [] }
}, { timestamps: true });

export default mongoose.model('book', M_books);

