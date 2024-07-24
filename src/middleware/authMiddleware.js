import jwt from 'jsonwebtoken';
import { getUserById } from '../dao/userMongo.js';

export const auth = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await getUserById(decoded.id);
        if(!user) {
            res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

export const authorize = (roles = []) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (roles.length && !roles.includes(req.user.rol)) {
            res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
};
