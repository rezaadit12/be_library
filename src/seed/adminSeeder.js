import argon2 from "argon2";
import M_staff from "../Models/M_staff.js";

const seedAdmin = async () => {
    const adminExists = await M_staff.findOne({email: "superadmin@admin.com"});

    if(adminExists){
        console.log("Admin already exists");
        return;
    }

    const hashedPassword = await argon2.hash("Adminku242411!");

    const admin = new M_staff({
        username: "Super Admin",
        role: "Admin",
        email: "superadmin@admin.com",
        phoneNumber: "087865434543",
        password: hashedPassword,
        refresh_token: null
    });

    await admin.save();
    console.log("Admin seeded successfully");
};

export default seedAdmin;