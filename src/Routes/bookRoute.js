import express from 'express';
import { getAllBooks, getBookById, createNewBook, updateBook, deleteBook} from '../Controllers/bookController.js';
import uploadImage from '../Middleware/uploadImage.js';

const  router = express.Router();

router.get('/books', getAllBooks);
router.get('/books/:id', getBookById);
router.post('/books', uploadImage.single('image'),  createNewBook);
router.patch('/books/:id', updateBook);
router.delete('/books/:id', deleteBook);

export default router;