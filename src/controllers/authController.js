import User from '../models/usersModel.js';
import { hashPassword, generateResetToken } from '../utils/bcryptPassword.js';
import { sendMail } from '../config/nodemailer.js';
import jwt from 'jsonwebtoken';
import passport from 'passport';

// Controlador para el login de usuario
export const loginUser = (req, res) => {
    res.redirect('/profile');
};

// Controlador para el registro de usuario
export const registerUser = async (req, res) => {
    const { username, email, password, rol } = req.body;  // Asegúrate de que el rol esté incluido
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        const hashedPassword = hashPassword(password);
        const newUser = new User({ username, email, password: hashedPassword, rol });  // Establece el rol del usuario
        await newUser.save();

        req.login(newUser, (err) => {
            if (err) {
                return res.status(500).send('Error logging in after registration');
            }
            return res.redirect('/profile');
        });
    } catch (error) {
        return res.status(500).send('Error registering user');
    }
};

// Controlador para el inicio de sesión utilizando Passport
export const loginWithPassport = async (req, res, next) => {
    passport.authenticate('login', (err, user, info) => {
        if (err) {
            console.error('Error during login authentication:', err);
            return next(err);
        }
        if (!user) {
            console.log('Login failed: Invalid credentials');
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        req.logIn(user, (err) => {
            if (err) {
                console.error('Error during login:', err);
                return next(err);
            }
            const token = jwt.sign({ id: user._id, email: user.email, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });
            console.log('Login successful:', user.email);
            return res.status(200).json({ message: 'Login successful', token });
        });
    })(req, res, next);
};

// Controlador para restablecer la contraseña
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('User not found');
        }

        const resetToken = generateResetToken();
        user.resetPasswordToken = resetToken.token;
        user.resetPasswordExpires = resetToken.expires;
        await user.save();

        const resetUrl = `http://localhost:8080/reset/${resetToken.token}`;
        const message = `You are receiving this email because you (or someone else) have requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

        await sendMail(user.email, 'Password Reset Request', message);

        res.status(200).send('Reset password email sent');
    } catch (error) {
        return res.status(500).send('Error sending reset password email');
    }
};

export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).send('Invalid or expired token');
        }

        user.password = hashPassword(password);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.send('Password has been reset');
    } catch (error) {
        return res.status(500).send('Error resetting password');
    }
};

// Controlador para logout
export const logoutUser = (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).send('Error logging out');
        }
        res.redirect('/');
    });
};

// Controlador para obtener el perfil del usuario
export const getProfile = (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    res.render('index', { user: req.user });
};

























