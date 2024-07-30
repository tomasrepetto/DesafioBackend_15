import { Router } from 'express';
import passport from 'passport';
import { forgotPassword, resetPassword, loginUser } from '../controllers/authController.js';

const router = Router();

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/login', passport.authenticate('login', { failureRedirect: '/login' }), loginUser);

router.get('/github', passport.authenticate('github', { scope: [ 'user:email' ] }));

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    console.log('GitHub callback - user:', req.user);
    res.redirect('/'); // Redirigir a la página de inicio después de la autenticación exitosa
  }
);

export default router;






















