import { getUserByEmail } from '../dao/userMongo.js';
import { isValidPassword } from '../utils/bcryptPassword.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import User from '../models/usersModel.js';
import bcrypt from 'bcryptjs';
import passport from 'passport';

export const loginUser = async (req, res, next) => {
    passport.authenticate('login', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            const token = jwt.sign({ id: user._id, email: user.email, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.status(200).json({ message: 'Login successful', token });
        });
    })(req, res, next);
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        console.log('Email received for forgot password:', email);
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        console.log('User found:', user);

        // Verifica si el usuario tiene el campo username, si no, lo establece
        if (!user.username) {
            user.username = email.split('@')[0]; // Asignar el nombre de usuario basado en el correo electrónico
        }

        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'youremail@gmail.com', // Cambia esto a tu correo electrónico
                pass: 'yourpassword' // Cambia esto a tu contraseña de aplicación o contraseña
            }
        });

        const mailOptions = {
            to: user.email,
            from: 'passwordreset@example.com',
            subject: 'Password Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
            Please click on the following link, or paste this into your browser to complete the process:\n\n
            http://${req.headers.host}/reset/${token}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.error('Error sending email:', err);
                return res.status(500).json({ message: 'Error sending email' });
            }
            res.status(200).json({ message: 'An email has been sent to ' + user.email + ' with further instructions.' });
        });
    } catch (error) {
        console.error('Error processing forgot password request:', error);
        res.status(500).json({ message: 'Error processing forgot password request' });
    }
};

export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).send('Password reset token is invalid or has expired.');

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) return res.status(400).send('New password cannot be the same as the old password.');

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.status(200).send('Password has been reset successfully.');
};














