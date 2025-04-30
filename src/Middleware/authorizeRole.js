import jwt from "jsonwebtoken";

export const authorizeRole = (role) => async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userRole = decoded.role;

        if (!userRole) {
            return res.status(403).json({ success: false, message: "Forbidden: Only admin or staff can access this" });
        }

        if (userRole.toLowerCase() !== role.toLowerCase()) {
            return res.status(403).json({ message: `Forbidden: Only ${role} can access this` });
        }

        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: err.message || 'Invalid token' });
    }
}

export default authorizeRole;
