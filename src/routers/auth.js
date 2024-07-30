import { Router } from 'express';
import passport from 'passport';
import { forgotPassword, resetPassword, loginUser } from '../controllers/authController.js';

const router = Router();

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/login', loginUser);
router.get('/github', passport.authenticate('github', { scope: [ 'user:email' ] }));
router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });

export default router;


