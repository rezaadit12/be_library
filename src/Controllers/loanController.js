import M_books from "../Models/M_book.js";
import M_loan from "../Models/M_loan.js";
import { fetchAllDataSuccess, dataSuccessResponse, dataFailedResponse } from "../Utils/customResponse.js";

export const createLoan = async (req, res) => {
    try {
        // const { member_id, book_id, staff_id } = req.body;
        const { member_id, book_id } = req.body;

        const dataBook = await M_books.findOne({_id: book_id})
        if(!dataBook) return res.status(400).json(dataFailedResponse('book not found'));
     
        if(dataBook.AvailableCopies == 0){
            return res.status(422).json({ success: false, message: 'Cannot process: Book is out of stock' });
        }

        let returnBook = new Date();
        returnBook.setDate(returnBook.getDate() + 7);
        const newLoan = new M_loan({
            member: member_id,
            book: book_id,
            // staff: staff_id,
            staff: req.user.userId,
            status: 'borrowed',
            returnDate: returnBook
        });
        await newLoan.save();

        dataBook.AvailableCopies = dataBook.AvailableCopies - 1;
        await dataBook.save();

        res.status(201).json({
            message: "Loan created successfully",
            data: newLoan
        });
    } catch (error) {
        console.error("Error creating loan:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getLoans = async (req, res) => {
    try {
        const loans = await M_loan.find({status:'borrowed'})
            .populate("member")
            .populate("book")
            .populate("staff");

            return res.json(fetchAllDataSuccess('Get loans successfully', loans.length, loans));

    } catch (error) {
        res.status(500).json({ message: "Error fetching loans" });
    }
};

export const returnLoan = async (req, res) => {
    try {
        const { loan_id } = req.params;

        const loan = await M_loan.findById(loan_id);
        if (!loan) {
            return res.status(404).json({ success: false, message: "Loan not found" });
        }

        if (loan.status !== 'borrowed') {
            return res.status(400).json({ success: false, message: "Book is already returned" });
        }

        // Update status
        loan.status = 'returned';
        await loan.save();

        // Tambah stok buku
        const book = await M_books.findById(loan.book);
        if (book) {
            book.AvailableCopies += 1;
            await book.save();
        }

        res.status(200).json({ message: "Book returned successfully", data: loan });
    } catch (error) {
        console.error("Error returning book:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

