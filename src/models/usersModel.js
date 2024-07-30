import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    githubId: {
        type: String,
        required: false,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    rol: {
        type: String,
        required: false,
        default: 'user',
    },
    resetPasswordToken: {
        type: String,
        required: false,
    },
    resetPasswordExpires: {
        type: Date,
        required: false,
    }
});

const User = mongoose.model('User', userSchema);

export default User;







