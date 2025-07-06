const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.cookies.authToken;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = decoded;
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }
    next();
}

const isValidEmail = (req, res, next) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const email = req.body.email;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email' });
    }
    next();
}

const isValidRegistration = (req, res, next) => {
    const { 
        username,
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        county,
        city,
        DOB,
        GDPRApproved
    } = req.body;

    // Username validation
    if (!username || !/^[a-zA-Z0-9._]{3,30}$/.test(username)) {
        return res.status(400).json({ 
            message: 'Username must be 3-30 characters and contain only letters, numbers, dots, and underscores' 
        });
    }

    // Email validation
    if (!email || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
        return res.status(400).json({ message: 'Invalid email address' });
    }

    // Phone number validation
    if (!phoneNumber || !/^(\+)?(07[0-8]{1}[0-9]{1}|02[0-9]{2}|03[0-9]{2}){1}?(\s|\.|\-)?([0-9]{3}(\s|\.|\-|)){2}$/.test(phoneNumber)) {
        return res.status(400).json({ message: 'Invalid Romanian phone number' });
    }

    // Name validation
    if (!firstName || firstName.length < 2 || firstName.length > 50) {
        return res.status(400).json({ message: 'First name must be between 2 and 50 characters' });
    }
    if (!lastName || lastName.length < 2 || lastName.length > 50) {
        return res.status(400).json({ message: 'Last name must be between 2 and 50 characters' });
    }

    // Password validation
    if (!password || password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // County validation
    const validCounties = ['AB', 'AR', 'AG', 'BC', 'BH', 'BN', 'BT', 'BV', 'BR', 'B', 'BZ', 'CS', 'CL', 'CJ', 'CT', 'CV', 'DB', 'DJ', 'GL', 'GR', 'GJ', 'HR', 'HD', 'IL', 'IS', 'IF', 'MM', 'MH', 'MS', 'NT', 'OT', 'PH', 'SM', 'SJ', 'SB', 'SV', 'TR', 'TM', 'TL', 'VS', 'VL', 'VN'];
    if (!county || !validCounties.includes(county)) {
        return res.status(400).json({ message: 'Invalid county' });
    }

    // GDPR validation
    if (!GDPRApproved) {
        return res.status(400).json({ message: 'GDPR approval is required' });
    }

    next();
};

module.exports = { authMiddleware, isAdmin, isValidEmail, isValidRegistration };