import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/Config/database.js";

dotenv.config();

// Koneksi ke database
connectDB();

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server running at ${process.env.APP_URL}:${port}`);
});
