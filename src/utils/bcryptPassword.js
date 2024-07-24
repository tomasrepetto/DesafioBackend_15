import bcrypjs from 'bcrypt';

export const createHash = (password) => {
    const salt = bcrypjs.genSaltSync(10);
    const passHash = bcrypjs.hashSync(password, salt);
    return passHash;
};

export const isValidPassword = (password, userPassword) => {
    const passValid = bcrypjs.compareSync(password, userPassword);
    return passValid;
};

