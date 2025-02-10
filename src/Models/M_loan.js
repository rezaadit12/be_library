import mongoose, { Mongoose } from "mongoose";
const { Schema } = mongoose;

const memberSchema = new mongoose({
    memberID: { type: Schema.Types.ObjectId, required: true, ref: "member" },
    username: { type: String, required: true },
    email: { type: String, required: true },
});

const bookSchema = new mongoose({
    bookID: { type: Schema.Types.ObjectId, required: true, ref: "book" },
    title: { type: String, required: true },
    isbn: { type: String, required: true }
});

const staffSchema = new Mongoose({
    staffID: { type: Schema.Types.ObjectId, required: true, ref: "staff" },
    username: { type: String, required: true }
});

const M_loans = new mongoose({
    member: { type: memberSchema, required: true },
    book: { type: bookSchema, required: true },
    loanDate: { type: Date, required: true, default: Date.now },
    returnDate: Date,
    status: { type: String, required: true },
    staff: { type: staffSchema, required: true }
}, { timestamps: true });


export default mongoose.model('loan', M_loans);

