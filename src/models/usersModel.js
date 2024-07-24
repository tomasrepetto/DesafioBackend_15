import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    rol: String,
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    }
});

export const userModel = mongoose.model('User', userSchema);