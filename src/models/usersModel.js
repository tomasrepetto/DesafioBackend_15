import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    githubId: {
        type: String,
        required: false
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false // Cambiar a false para permitir registros sin email
    },
    password: {
        type: String,
        required: false // Cambiar a false para permitir registros sin password
    },
    rol: {
        type: String,
        default: 'user'
    }
});

const User = mongoose.model('User', userSchema);

export default User;

