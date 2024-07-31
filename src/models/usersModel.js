import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        enum: ['user', 'premium'],
        default: 'user'
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

const User = mongoose.model('User', userSchema);

export default User;




















