const { getUserUsingId, updateUserUsingId, deleteUserUsingId, getAll, getUserUsingEmail } = require('../services/userService');

const getUserById = async (req, res) => {
    const { userId, userType } = req.user;

    try {
        const user = await getUserUsingId(userId, userType);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const { userType } = req.user;
    
    try {
        const user = await updateUserUsingId(id, { name, email }, userType);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.params;
    const { userType } = req.user;
    
    try {
        await deleteUserUsingId(id, userType);
        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const getAllUsers = async (req, res) => {
    const { userType } = req.query;
    
    try {
        const users = await getAll(userType);
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}  

const getUserByEmail = async (req, res) => {
    const { email } = req.params;
    const { userType } = req.query;
    
    try {
        const user = await getUserUsingEmail(email, userType);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    getUserById,
    updateUser,
    deleteUser,
    getAllUsers,
    getUserByEmail
}
