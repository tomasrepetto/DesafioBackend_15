import jwt from 'jsonwebtoken';
import User from '../models/usersModel.js';

export const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
};

export const addUserToLocals = async (req, res, next) => {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
        console.log("Middleware - Authenticated User:", req.user);
    } else if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);
            if (user) {
                req.user = user;
                res.locals.user = user;
                console.log("Middleware - Authenticated User via JWT:", user);
            } else {
                res.locals.user = null;
                console.log("Middleware - No user found via JWT");
            }
        } catch (error) {
            res.locals.user = null;
            console.log("Middleware - Invalid JWT");
        }
    } else {
        res.locals.user = null;
        console.log("Middleware - No user");
    }
    next();
};

export const auth = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

export const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (roles.length && !roles.includes(req.user.rol)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
};







