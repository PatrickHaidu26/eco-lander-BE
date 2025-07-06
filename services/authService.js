const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const EcoSmartUser = require('../models/ecoSmartUser');
const SmartLandUser = require('../models/smartLandUser');

const generateToken = (userId, email, userType) => {
    return jwt.sign({ userId, email, userType }, process.env.JWT_SECRET, { expiresIn: '10h' });
};

const ecosmartRegister = async ({ name, email, password }) => {
    const existingUser = await EcoSmartUser.findOne({ email: email.toLowerCase() });
    if (existingUser) throw new Error('Email already registered');
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new EcoSmartUser({ name, email: email.toLowerCase(), password: hashedPassword });
    await user.save();
    return generateToken(user._id, user.email, 'ecosmart');
};

const ecosmartLogin = async ({ email, password }) => {
    const user = await EcoSmartUser.findOne({ email: email.toLowerCase() });
    if (!user) throw new Error('Invalid credentials');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');
    return generateToken(user._id, user.email, 'ecosmart');
};

const smartlandRegister = async ({ name, email, password }) => {
    const existingUser = await SmartLandUser.findOne({ email: email.toLowerCase() });
    if (existingUser) throw new Error('Email already registered');
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new SmartLandUser({ name, email: email.toLowerCase(), password: hashedPassword });
    await user.save();
    return generateToken(user._id, user.email, 'smartland');
};

const smartlandLogin = async ({ email, password }) => {
    const user = await SmartLandUser.findOne({ email: email.toLowerCase() });
    if (!user) throw new Error('Invalid credentials');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');
    return generateToken(user._id, user.email, 'smartland');
};

const logout = async (req, res) => {
    res.clearCookie('token');
};

module.exports = {
    ecosmartRegister,
    ecosmartLogin,
    smartlandRegister,
    smartlandLogin,
    logout
};