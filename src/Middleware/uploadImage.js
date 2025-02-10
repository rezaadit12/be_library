import multer from "multer";
// import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/images');
    },
    filename: (req, file, callback) => {
        const timestamp = new Date().getTime();
        const originalname = file.originalname;
        callback(null, `${timestamp}-${originalname}`);
    },
});

// Filter hanya gambar
const fileFilter = (req, file, callback) => {
    if (file.mimetype.startsWith("image/")) { // ini sama saja seperti image/* (artinya semua format gambar)
        callback(null, true);
    } else {
        callback(new Error("Only image files are allowed!"), false);
    }
};

const upload = multer ({storage, fileFilter});

export default upload