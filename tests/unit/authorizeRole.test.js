import {jest} from '@jest/globals'
import jwt from 'jsonwebtoken';
import { authorizeRole } from '../../src/Middleware/authorizeRole.js';
    

describe('authorizeRole middleware', () => {
    const mockReq = (token) => ({
        headers: { authorization: token ? `Bearer ${token}` : undefined }
    });

    const mockRes = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json   = jest.fn().mockReturnValue(res);
        return res;
    };

    const next = jest.fn();

    const secret = 'asdfkj8asdf*askddfjlkjsdfLKSDJDF'; // Should match your test .env

    const createToken = (payload, options = {}) => 
        jwt.sign(payload, secret, { expiresIn: '1h', ...options });

    beforeAll(() => {
        process.env.ACCESS_TOKEN_SECRET = secret;
    });

    it('should return 403 if no token provided', async () => {
        const req = mockReq();
        const res = mockRes();

        await authorizeRole('admin')(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should return 403 if role is not authorized', async () => {
        const token = createToken({ role: 'user' });
        const req = mockReq(token);
        const res = mockRes();

        await authorizeRole('admin')(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should call next() if role matches', async () => {
        const token = createToken({ role: 'admin', userId: '123' });
        const req = mockReq(token);
        const res = mockRes();

        await authorizeRole('admin')(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('should return error if token is expired', async () => {
        const expiredToken = createToken({ role: 'admin' }, { expiresIn: '-1s' });
        const req = mockReq(expiredToken);
        const res = mockRes();

        await authorizeRole('admin')(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
    });
});
