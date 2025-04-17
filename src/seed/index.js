import dotenv from "dotenv";
dotenv.config(); 

import mongoose from "mongoose";
import seedAdmin from "./adminSeeder.js";
import connectDB from "../Config/database.js";

const runSeeders = async() => {
    try {
        await connectDB();
        await seedAdmin();
        mongoose.connection.close();
    } catch (err) {
        console.error("Seeding error:", err);
        mongoose.connection.close();
    }
}

runSeeders();