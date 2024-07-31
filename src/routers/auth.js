import { Router } from 'express';
import passport from 'passport';
import { loginUser, loginWithPassport, registerUser, forgotPassword, resetPassword, logoutUser, getProfile } from '../controllers/authController.js';
import { ensureAuthenticated, addUserToLocals } from '../middleware/authMiddleware.js';

const router = Router();

router.use(addUserToLocals); // Añade este middleware para todas las rutas

router.post('/login', passport.authenticate('login', { failureRedirect: '/login' }), loginWithPassport);

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    req.session.save((err) => {
      if (err) {
        console.error('Error saving session:', err);
        return res.redirect('/');
      }
      console.log('Session saved successfully for user:', req.user.email);
      res.redirect('/');
    });
  }
);

router.get('/logout', logoutUser);

router.post('/register', registerUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/profile', ensureAuthenticated, getProfile);

export default router;


















































