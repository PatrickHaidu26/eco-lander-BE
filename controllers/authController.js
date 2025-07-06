const { ecosmartRegister, ecosmartLogin, smartlandRegister, smartlandLogin, logout } = require('../services/authService');
const { serialize } = require('cookie');

const ecosmartRegisterUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    try {
        const token = await ecosmartRegister({ name, email, password });
        const serialized = serialize('authToken', token, {
            httpOnly: true,
            sameSite: 'strict',
            path: '/'
        });
        res.setHeader('Set-Cookie', serialized);
        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const ecosmartLoginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    try {
        const token = await ecosmartLogin({ email, password });
        const serialized = serialize('authToken', token, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? "none" : "lax",
            secure: process.env.NODE_ENV === 'production',
            path: '/'
        });
        res.setHeader('Set-Cookie', serialized);
        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const smartlandRegisterUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    try {
        const token = await smartlandRegister({ name, email, password });
        const serialized = serialize('authToken', token, {
            httpOnly: true,
            sameSite: 'strict',
            path: '/'
        });
        res.setHeader('Set-Cookie', serialized);
        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const smartlandLoginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    try {
        const token = await smartlandLogin({ email, password });
        const serialized = serialize('authToken', token, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? "none" : "lax",
            secure: process.env.NODE_ENV === 'production',
            path: '/'
        });
        res.setHeader('Set-Cookie', serialized);
        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const logoutUser = async (req, res) => {
    try {
        await logout(req, res);
        const serialized = serialize('authToken', null, {
            httpOnly: true,
            maxAge: -1,
            sameSite: 'strict',
            path: '/'
        });
        res.setHeader('Set-Cookie', serialized);
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    ecosmartRegisterUser,
    ecosmartLoginUser,
    smartlandRegisterUser,
    smartlandLoginUser,
    logoutUser
};

