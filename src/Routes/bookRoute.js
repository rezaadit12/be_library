import express from 'express';
import { getAllBooks, getBookById, createNewBook, updateBook, deleteBook} from '../Controllers/bookController.js';
import uploadImage from '../Middleware/uploadImage.js';
import verifyToken from '../Middleware/verifyToken.js';
import authorizeRole from '../Middleware/authorizeRole.js';

const  router = express.Router();

// router.get('/books', verifyToken, getAllBooks);
router.get('/books', getAllBooks);
router.get('/books/:id', getBookById);
router.post('/books', uploadImage.single('image'),  createNewBook);
router.patch('/books/:id', uploadImage.single('image'), updateBook);
router.delete('/books/:id', deleteBook);

export default router;