import request from "supertest";
import app from "../../src/app.js";

test("GET buka halaman awal", async () => {
  const res = await request(app)
    .get("/") 
    .expect(200);
  expect(res.body.success).toBe(true);
}, 5000); // Timeout 5 detik (opsional)