import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
        console.log("Database is connected");
    } catch (err) {
        console.error("Database connection error:", err);
        process.exit(1); // Keluar dari proses jika gagal koneksi
    }
};

export default connectDB;
