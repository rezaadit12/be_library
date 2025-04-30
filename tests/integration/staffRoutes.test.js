import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../../src/app.js";
import M_staff from "../../src/Models/M_staff.js";
import argon2 from "argon2";

let mongod;
let staffId;

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
});

beforeEach(async () => {
    await M_staff.deleteMany({});

    const passwordHash = await argon2.hash("password123");
    const staff = await M_staff.create({
        username: "John Doe",
        email: "john@example.com",
        password: passwordHash,
        role: "admin",
        phoneNumber: "0878387473827"
    });
    staffId = staff._id;
});

describe("[GET] /staff", () => {
    it("should return all staff", async () => {
        const res = await request(app).get("/staff");

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("success", true);
        expect(res.body).toHaveProperty("message", "Get all staff successfully");
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.total_data).toBeGreaterThan(0);
    });
});

describe("[GET] /staff/:id", () => {
    it("should return staff by ID", async () => {
        const res = await request(app).get(`/staff/${staffId}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("success", true);
        expect(res.body).toHaveProperty("message", "Get staff by ID successfully");
        expect(res.body).toHaveProperty("data");
        expect(res.body.data).toHaveProperty("email", "john@example.com");
    });

    it("should return 404 if staff not found", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app).get(`/staff/${fakeId}`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("success", false);
        expect(res.body).toHaveProperty("message", "staff not found!");
    });
});

describe("[POST] /staff", () => {
    it("should create a new staff", async () => {
        const res = await request(app)
        .post("/staff")
        .send({
            username: "Alice",
            email: "alice@example.com",
            password: "securepassword",
            role: "staff",
            phoneNumber: "0878387473827"
        });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("success", true);
        expect(res.body).toHaveProperty("message", "Staff created successfully");
        expect(res.body.data).toHaveProperty("email", "alice@example.com");
    });

    it("should not allow duplicate email", async () => {
        const res = await request(app)
        .post("/staff")
        .send({
            username: "Duplicate",
            email: "john@example.com",
            password: "password123",
            role: "admin",
            phoneNumber: "0878387473827"
        });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("message", "Data staff already exists!");
    });
});

describe("[PATCH] /staff/:id", () => {
    it("should update existing staff", async () => {
        const res = await request(app)
        .patch(`/staff/${staffId}`)
        .send({
            name: "John Updated",
            password: "newpassword"
        });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "staff updated successfully");
        expect(res.body.data).toHaveProperty("name", "John Updated");
    });

    it("should return error if staff not found", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app).patch(`/staff/${fakeId}`).send({
        name: "No one"
        });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("message", "staff not found");
    });
});

describe("[DELETE] /staff/:id", () => {
    it("should delete existing staff", async () => {
        const res = await request(app).delete(`/staff/${staffId}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "staff deleted successfully");
        expect(res.body.data.deletedCount).toBe(1);
    });

    it("should return error if staff not found", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app).delete(`/staff/${fakeId}`);
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("message", "staff not found");
    });
});
