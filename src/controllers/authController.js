import { getUserByEmail } from '../dao/userMongo.js';
import { isValidPassword } from '../utils/bcryptPassword.js';
import jwt from 'jsonwebtoken';

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await getUserByEmail(email);
        if (!user || !isValidPassword(password, user.password)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ id: user._id, email: user.email, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};