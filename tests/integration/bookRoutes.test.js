import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import app from "../../src/app.js";
import BookModel from "../../src/Models/M_book.js";

let mongod;
let bookId;

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
  await BookModel.deleteMany({});
  const book = await BookModel.create({
    title: "Mastering JavaScript",
    synopsis: "An in-depth look at JavaScript. Explore advanced features, ES6+, and how to write clean, efficient code.",
    author: "Jane Smith",
    publisher: "Code Press",
    publishedYear: 2022,
    isbn: "978-9876543210",
    AvailableCopies: 2,
    Categories: [{ categoryID: "67a19cfb366cbb86688b7cd1", categoryName: "Programming" }]
  });
  bookId = book._id;
});

describe("Book Routes [GET] /books", () => {
  it("should get all books", async () => {
    const res = await request(app)
      .get("/books")
      .set("content-type", "application/json");

    expect(res.status).toBe(200);

    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("message", "Get books successfully");
    expect(res.body).toHaveProperty("total_data");
    expect(res.body).toHaveProperty("data");
    
    // Pastikan data adalah array dan memiliki minimal 1 buku
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);

    const book = res.body.data[0];
    propertyCheck(book);
  });
});


describe("Book Routes [GET] /books/:id", () => {
  it("should get book by id", async () => {
    const res = await request(app)
      .get(`/books/${bookId}`)
      .set("content-type", "applicationjson/");

      expect(res.status).toBe(200);

      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("message", "Get Book by ID successfully");
      expect(res.body).toHaveProperty("data");
      
      const book = res.body.data;
      propertyCheck(book);
  });
});

// belum termasuk image 
describe('Book Routes [POST] /books', () => {
  it('should create a new book', async() => {
    const newBook = {
      title: "Mastering JavaScript",
      synopsis: "An in-depth look at JavaScript. Explore advanced features, ES6+, and how to write clean, efficient code.",
      author: "Jane Smith",
      publisher: "Code Press",
      publishedYear: 2022,
      isbn: "978-98761243210",
      AvailableCopies: 2,
      Categories: [{ categoryID: "67a19cfb366cbb86688b7cd1", categoryName: "Programming" }]
    }

    const res = await request(app)
      .post('/books')
      .set('Content-type', 'application/json')  
      .send(newBook);

    expect(res.status).toBe(201);

    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("message", "Book created successfully");
    expect(res.body).toHaveProperty("data");

    const book = res.body.data;
    propertyCheck(book);
  });
});

describe('Book Routes [PATCH] /books/:id', () => {
  it("should update book By ID", async() => {

    const newBook = {
      title: "Mastering JavaScript",
      synopsis: "An in-depth look at JavaScript. Explore advanced features, ES6+, and how to write clean, efficient code.",
      author: "Jane Smith",
      publisher: "Code Press",
      publishedYear: 2022,
      isbn: "978-98761243210",
      AvailableCopies: 2,
      Categories: [{ categoryID: "67a19cfb366cbb86688b7cd1", categoryName: "Programming" }]
    }

    const res = await request(app)
      .patch(`/books/${bookId}`)
      .set('Content-type', 'application/json')
      .send(newBook);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "book updated successfully");
    expect(res.body).toHaveProperty("data");

    const book = res.body.data;
    propertyCheck(book);
  }); 
});

describe('Book Routes [DELETE] /books/:id', () => {
  it('should delete book By ID', async() => {
    const res = await request(app)
      .delete(`/books/${bookId}`)
      .set('Content-type', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "book deleted successfully");

    const status = res.body.data;
    expect(status.deletedCount).toBeGreaterThan(0);
  });
});


function propertyCheck(book) {
  // expect(book).toHaveProperty("_id");
  expect(book).toHaveProperty("title");
  expect(book).toHaveProperty("synopsis");
  expect(book).toHaveProperty("author");
  expect(book).toHaveProperty("publisher");
  expect(book).toHaveProperty("publishedYear");
  expect(book).toHaveProperty("isbn");
  expect(book).toHaveProperty("AvailableCopies");
  expect(book).toHaveProperty("Categories");
  expect(Array.isArray(book.Categories)).toBe(true);

  if (book.Categories.length > 0) {
    expect(book.Categories[0]).toHaveProperty("categoryID");
    expect(book.Categories[0]).toHaveProperty("categoryName");
  }
}