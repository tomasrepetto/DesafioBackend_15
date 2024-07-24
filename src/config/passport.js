import passport from 'passport';
import local from 'passport-local';
import { getUserByEmail, getUserById } from '../dao/userMongo.js';
import { isValidPassword } from '../utils/bcryptPassword.js';
import { getCartsByIdService } from '../dao/cartsMongo.js';

const LocalStrategy = local.Strategy;

export const initializaPassport = () => {
    passport.use('login', new LocalStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            try {
                const user = await getUserByEmail(email);
                if (!user || !isValidPassword(password, user.password)) {
                    return done(null, false, { message: 'Invalid credentials' });
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await getUserById(id);
            if (user) {
                const cart = await getCartsByIdService(user.cartId);
                user.cart = cart;
            }
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};