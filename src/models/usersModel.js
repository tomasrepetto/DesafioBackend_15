import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user', enum: ['user', 'premium', 'admin'] },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

const userModel = mongoose.model('User', userSchema);

export { userModel };