import M_books from '../Models/M_book.js';
import { fetchAllDataSuccess, dataSuccessResponse, dataFailedResponse } from "../Utils/customResponse.js";

export const getAllBooks = async (req, res) => {
    try {
        const books = await M_books.find();
        return res.json(fetchAllDataSuccess('Get books successfully', books.length, books));
    } catch (error) {
        return res.status(500).json(dataFailedResponse(error.message));
    }
}

export const getBookById = async (req, res) => {
    const { id } = req.params;
    try {
        const book = await M_books.findById(id);
        if(!book){
            return res.status(404).json(dataFailedResponse('book not found!'));
        }
        return res.json(dataSuccessResponse('Get Book by ID successfully', book));
    } catch (error) {
        return res.status(500).json(dataFailedResponse(error.message));
    }
}

export const createNewBook = async (req, res) => {
    const data = req.body;
    const image = req.file;
    try {
        const duplicate = await M_books.findOne({isbn: data.isbn}, 'id');
        if(duplicate){
            return res.status(400).json(dataFailedResponse('Data book already exists!'));
        }

        const imageUrl = image ? `/assets/images/${image.filename}` : null;
        const book = new M_books({ 
            ...data, 
            image: imageUrl // Simpan URL gambar di database
        });
        
        const createNewBook = await book.save();
        return res.status(201).json(dataSuccessResponse('Book created successfully', createNewBook));
    } catch (error) {
        return res.status(500).json(dataFailedResponse(error.message));
    }
}

export const updateBook = async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json(dataFailedResponse('Data to update can not be empty!'));
    }
    const { id } = req.params;
    try {
        const book = await M_books.updateOne({_id:id}, {$set: req.body});
        if(!book){
            return res.status(400).json(dataFailedResponse('book not found'));
        }
        return res.status(200).json(dataSuccessResponse("book updated successfully", req.body))
    } catch (error) {
        return res.status(500).json(dataFailedResponse(error.message));
    }
}

export const deleteBook = async (req, res) => {
    const { id } = req.params;
    try {
        const deleteBook = await M_books.deleteOne({_id:id});
        if(deleteBook.deletedCount === 0){
            return res.status(400).json(dataFailedResponse('book not found'));
        }
        return res.status(200).json(dataSuccessResponse("book deleted successfully", deleteBook))
    } catch (error) {
        return res.status(500).json(dataFailedResponse(error.message));
    }
}



