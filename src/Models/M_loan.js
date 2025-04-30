import mongoose, { Mongoose } from "mongoose";
const { Schema } = mongoose;

// const memberSchema = new mongoose({
//     memberID: { type: Schema.Types.ObjectId, required: true, ref: "member" },
//     username: { type: String, required: true },
//     email: { type: String, required: true },
// });

// const bookSchema = new mongoose({
//     bookID: { type: Schema.Types.ObjectId, required: true, ref: "book" },
//     title: { type: String, required: true },
//     isbn: { type: String, required: true }
// });

// const staffSchema = new Mongoose({
//     staffID: { type: Schema.Types.ObjectId, required: true, ref: "staff" },
//     username: { type: String, required: true }
// });

const M_loans = new Schema({
    member:     { type: Schema.Types.ObjectId, ref: "member", required: true },
    book:       { type: Schema.Types.ObjectId, ref: "book", required: true },
    staff:      { type: Schema.Types.ObjectId, ref: "staff", required: true },
    loanDate:   { type: Date, required: true, default: Date.now },
    returnDate: { type: Date },
    status:     { type: String, required: true }
}, { timestamps: true });


export default mongoose.model('loan', M_loans);

