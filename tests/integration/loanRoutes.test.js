import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../src/app.js';
import M_books from '../../src/Models/M_book.js';
import M_member from '../../src/Models/M_member.js';
import M_loan from '../../src/Models/M_loan.js';
import M_staff from '../../src/Models/M_staff.js';

let mongod;
let memberId;
let staffId;
let bookId;
let loanId;

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
    await M_books.deleteMany({});
    await M_member.deleteMany({});
    await M_staff.deleteMany({});
    await M_loan.deleteMany({});

    const member = await M_member.create({
        name: 'Test Member',
        email: 'testmember@example.com',
        username: 'testmember'
    });
    
    const staff = await M_staff.create({
        name: 'Test Staff',
        email: 'teststaff@example.com',
        username: 'teststaff',
        password: 'test123',
        phoneNumber: '08123456789',
        role: 'admin'
    });
    
    const book = await M_books.create({
        title: "JavaScript Basics",
        synopsis: "Learn JS",
        author: "Author A",
        publisher: "TechBooks",
        publishedYear: 2021,
        isbn: "123-4567890123",
        AvailableCopies: 3,
        Categories: [{ categoryID: "67a19cfb366cbb86688b7cd1", categoryName: "Programming" }]
    });

    memberId = member._id;  
    staffId = staff._id;    
    bookId = book._id;      

    const loan = await M_loan.create({
        member: member._id,
        book: book._id,
        staff: staff._id,  
        status: 'borrowed',
        returnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    loanId = loan._id.toString();
});


describe('Loan API Integration Test', () => {
    it('should create a new loan', async () => {
        const res = await request(app)
            .post('/loans/create')
            // .set('Authorization', `Bearer ${token}`)
            .send({
                member_id: memberId,
                book_id: bookId,
                staff_id: staffId
            });

        expect(res.status).toBe(201);
        expect(res.body.message).toBe('Loan created successfully');
        expect(res.body.data).toHaveProperty('_id');
    });

    it('should fetch all loans', async () => {
        const res = await request(app).get('/loans');

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Get loans successfully');
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should return a borrowed book', async () => {
        const res = await request(app).put(`/loans/return/${loanId}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Book returned successfully');

        const loan = await M_loan.findById(loanId);
        expect(loan.status).toBe('returned');
    });

    it('should return 404 for non-existent loan', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app).put(`/loans/return/${fakeId}`);

        expect(res.status).toBe(404);
        expect(res.body.message).toBe('Loan not found');
    });

    it('should return 400 when returning already returned book', async () => {
        await request(app).put(`/loans/return/${loanId}`); // first return
        const res = await request(app).put(`/loans/return/${loanId}`); // second return

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Book is already returned');
    });
});
