import dotenv from 'dotenv';
dotenv.config();

import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/usersModel.js';
import { isValidPassword } from '../utils/bcryptPassword.js';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
  throw new Error('GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET must be set');
}

passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/api/auth/github/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('GitHub profile:', profile);
      let user = await User.findOne({ githubId: profile.id });
      if (!user) {
        user = new User({
          githubId: profile.id,
          username: profile.username || profile.displayName || profile._json.login,
          email: profile.emails && profile.emails[0].value ? profile.emails[0].value : `${profile.username}@github.com`,
          password: ' ', // Dejar el campo password vacío
        });
        await user.save();
      }
      console.log('Authenticated user:', user);
      return done(null, user);
    } catch (err) {
      console.error('Error in GitHub strategy:', err);
      return done(err, null);
    }
  }
));

passport.use('login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user || !isValidPassword(password, user.password)) {
      return done(null, false, { message: 'Invalid credentials' });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

const initializePassport = () => {
  passport.initialize();
  passport.session();
};

export { initializePassport };














