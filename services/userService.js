const EcoSmartUser = require('../models/ecoSmartUser');
const SmartLandUser = require('../models/smartLandUser');

const getUserUsingId = async (id, userType) => {
    if (userType === 'ecosmart') {
        return await EcoSmartUser.findById(id).select('-password');
    } else {
        return await SmartLandUser.findById(id).select('-password');
    }
}

const updateUserUsingId = async (id, userData, userType) => {
    delete userData.password;
    
    if (userType === 'ecosmart') {
        return await EcoSmartUser.findByIdAndUpdate(id, userData, { new: true }).select('-password');
    } else {
        return await SmartLandUser.findByIdAndUpdate(id, userData, { new: true }).select('-password');
    }
}

const deleteUserUsingId = async (id, userType) => {
    if (userType === 'ecosmart') {
        return await EcoSmartUser.findByIdAndDelete(id);
    } else {
        return await SmartLandUser.findByIdAndDelete(id);
    }
}

const getAll = async (userType) => {
    if (userType === 'ecosmart') {
        return await EcoSmartUser.find().select('-password');
    } else {
        return await SmartLandUser.find().select('-password');
    }
}

const getUserUsingEmail = async (email, userType) => {
    if (userType === 'ecosmart') {
        return await EcoSmartUser.findOne({ email }).select('-password');
    } else {
        return await SmartLandUser.findOne({ email }).select('-password');
    }
}

const getUserByUsername = async (username) => {
    return await User.findOne({ username }).select('-password');
}

const getUsersByType = async (userType) => {
    return await User.find({ userType }).select('-password');
}

module.exports = { 
    getUserUsingId, 
    updateUserUsingId, 
    deleteUserUsingId, 
    getAll, 
    getUserUsingEmail,
    getUserByUsername,
    getUsersByType
};