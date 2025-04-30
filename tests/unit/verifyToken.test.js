import {jest} from '@jest/globals'
import verifyToken from '../../src/Middleware/verifyToken.js';
import jwt from 'jsonwebtoken';

describe('verifyToken middleware', () => {
    const secret = 'test_secret_token';
    
    const mockReq = (token) => ({
        headers: { authorization: token ? `Bearer ${token}` : undefined }
    });

    const mockRes = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        res.sendStatus = jest.fn().mockReturnValue(res);
        return res;
    };

    const next = jest.fn();

    beforeAll(() => {
        process.env.ACCESS_TOKEN_SECRET = secret;
    });

    it('should return 403 if no token is provided', () => {
        const req = mockReq();
        const res = mockRes();

        verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if token is expired', () => {
        const expiredToken = jwt.sign({ userId: '1' }, secret, { expiresIn: '-1s' });
        const req = mockReq(expiredToken);
        const res = mockRes();

        verifyToken(req, res, next);

        expect(res.sendStatus).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next if token is valid', () => {
        const validToken = jwt.sign({ userId: '1' }, secret, { expiresIn: '1h' });
        const req = mockReq(validToken);
        const res = mockRes();

        verifyToken(req, res, next);

        expect(next).toHaveBeenCalled();
    });
});

