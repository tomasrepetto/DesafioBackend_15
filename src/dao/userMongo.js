import { userModel } from "../models/usersModel.js";

export const getUserById = async (id) => await userModel.findById(id);
    
export const getUserByEmail = async (email) => await userModel.findOne({email});
    
export const registerUser = async (user) => {
    const newUser = await userModel.create({ ...user });
    const newCart = await createCartService();
    newUser.cartId = newCart._id;
    await newUser.save();
    return newUser;
};