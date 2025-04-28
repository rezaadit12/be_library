import jwt from "jsonwebtoken";

export const authorizeRole = (role) => async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) return res.status(403).json({message: 'No token provided'});

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userRole = decoded.role;

    if(userRole.toLowerCase() !== role.toLowerCase()) return res.status(403).json({message: `Forbidden: Only ${role} cas access this`});

    req.user = decoded;
    next();
}

export default authorizeRole;
