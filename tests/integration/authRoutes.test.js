import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import app from "../../src/app.js";
import M_staff from "../../src/Models/M_staff.js";
import argon2 from "argon2";

let mongod;
let cookie;

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
    const hashedPassword = await argon2.hash("securePass123");
    await M_staff.create({
      username: "testuser",
      email: "testuser@example.com",
      password: hashedPassword,
      role: "admin",
      phoneNumber: "081234567890", // ← tambahkan ini
    });
  });

describe("[AUTH] POST /login", () => {
  it("should login successfully and return accessToken", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: "testuser@example.com", password: "securePass123" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("email", "testuser@example.com");

    cookie = res.headers["set-cookie"].find((c) => c.includes("refreshToken"));
    expect(cookie).toBeDefined();
  });

  it("should fail with wrong password", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: "testuser@example.com", password: "wrongpass" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "Email or password is incorrect");
  });

  it("should fail if user not found", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: "unknown@example.com", password: "whatever" });

    expect(res.status).toBe(500);
  });
});

describe("[AUTH] POST /token", () => {
  it("should return new accessToken using refreshToken", async () => {
    const loginRes = await request(app)
      .post("/login")
      .send({ email: "testuser@example.com", password: "securePass123" });

    const cookie = loginRes.headers["set-cookie"].find((c) => c.includes("refreshToken"));

    const res = await request(app).post("/token").set("Cookie", cookie);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
  });

  it("should return 401 without refreshToken", async () => {
    const res = await request(app).post("/token");
    expect(res.status).toBe(401);
  });
});

describe("[AUTH] POST /logout", () => {
  it("should logout successfully", async () => {
    const loginRes = await request(app)
      .post("/login")
      .send({ email: "testuser@example.com", password: "securePass123" });

    const cookie = loginRes.headers["set-cookie"].find((c) => c.includes("refreshToken"));

    const res = await request(app).post("/logout").set("Cookie", cookie);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "logout successfully");
  });

  it("should return 401 if no refreshToken", async () => {
    const res = await request(app).post("/logout");
    expect(res.status).toBe(401);
  });
});
