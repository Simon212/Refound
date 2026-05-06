import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    let token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: 'Kein Token bereitgestellt' });

    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Session abgelaufen oder Token ungültig' });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

export const isAdmin = (req, res, next) => {
    if (req.userRole === 'ADMIN') {
        next();
    } else {
        res.status(403).json({ error: 'Admin-Rechte erforderlich!' });
    }
};
