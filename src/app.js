import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bookRoute from "./Routes/bookRoute.js";
import logRequest from "./Middleware/logsInfo.js";
// import multer from "multer";

/**
 * ----------| Warning! |----------
 *      Don't run servers here
 * --------------------------------
 */


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logRequest);

// Routes
app.use(bookRoute);

app.use('/assets/images',express.static('public/images')); // yang diakses oleh url eg: http://localhost:3000/asssets/images/nama_gambar

// app.use((err, req, res, next) => {
//     if (err instanceof multer.MulterError) {
//         return res.status(400).json({ error: `Multer Error: ${err.message}` });
//     } else if (err) {
//         return res.status(500).json({ error: `Server Error: ${err.message}` });
//     }
//     next();
// });


app.get("/", (req, res) => {
    res.status(200).json({ success: true, message: "Selamat datang" }); 
});

export default app; 
