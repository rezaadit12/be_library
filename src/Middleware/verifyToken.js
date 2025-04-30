import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; //operator ini sama dengan operator ternary

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    try{
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if(err) return res.sendStatus(403);
            next();
        });
    }catch(err){
        return res.status(403).json({ message: err.message || 'Invalid token' });
    }
}

export default verifyToken;