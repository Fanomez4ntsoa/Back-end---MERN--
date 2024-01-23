const asyncHandler = require("express-async-handler");
const UserService = require('../services/UserService');
const User = require('../models/UserModel');
const generateToken = require("../utils/generateToken");

/**
 * @description Authentification user
 * @route POST /api/user/login
 * @access Public
 */
const login = asyncHandler(async(req, res) => {
    const userService = new UserService();
    const { email, password } = req.body;

    try {
        const authenticatedUser = await userService.authentificationUser(email, password);
        res.json(authenticatedUser);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

/**
 * @description Register user
 * @route POST /api/user/register
 * @access Public
 */
const register = asyncHandler(async(req, res) => {
    const userService = new UserService();
    if (!req.body) {
        res.status(400).json({ error: 'Request body is missing' });
        return;
    }
    const { name, email, password } = req.body;
    
    if (!name) {
        res.status(400).json({ error: 'Name is required' });
        return;
    } else if (!email) {
        res.status(400).json({ error: 'Email is required' });
        return;
    } else if (!password) {
        res.status(400).json({ error: 'Password is required' });
        return;
    }

    try {
        const userExists = await User.findOne({ email })

        if (userExists) {
            res.status(400)
            throw new Error('User already exists')
        }
        
        const createdUser = await userService.create({ 
            name,
            email,
            password
        });
        
        if(createdUser) {
            res.status(201).json({
                _id: createdUser._id,
                name: createdUser.name,
                email: createdUser.email,
                isAdmin: createdUser.isAdmin,
                token: generateToken(createdUser._id),
                })
            } else {
            res.status(400)
            throw new Error('Invalid user data')
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

/**
 * @description Get All users
 * @route GET /api/users/
 * @access Private/Admin
 */
const getUsers = asyncHandler(async(req, res) => {
    const userService = new UserService();
    try {
        const users = await userService.allUsers()
        if(users === 0) {
            res.status(400).json({ message: 'No User'});
        }
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @description Get User by Id
 * @route GET /api/user/:id
 * @access Private/Admin
 */
const getUserById = asyncHandler(async(req, res) => {
    try {
        const userService = new UserService();
        const user = await userService.getById(req.params.id);
        if(user) {
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                })
        } else {
            res.status(404);
            throw new Error('User not found');
        } 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

/**
 * @description Update User by Id
 * @route PUT /api/user/:id
 * @access Private/Admin
 */
const updateUser = asyncHandler(async(req, res) => {
    const userService = new UserService();
    const updated = await userService.update(req.params.id, req.body);
    res.json(updated);
});

/**
 * @description Get user profile
 * @route GET /api/user/profile
 * @access Private
 */
const getUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const userService = new UserService();

    try {
        const userProfile = await userService.getUserProfile(userId);
        res.json(userProfile);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @description Update user profile
 * @route PUT /api/user/profile
 * @access Private
 */
const updateUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const userData = req.body;
    const userService = new UserService();

    try {
        const updatedUserProfile = await userService.updateUserProfile(userId, userData);
        res.json(updatedUserProfile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @description Delete user by id
 * @route DELETE /api/user/:id
 * @access Private/Admin
 */
const deleteUser = asyncHandler(async(req, res) => {
    const userService = new UserService();
    const deleted = await userService.delete(req.params.id);
    res.json(deleted);
})

module.exports = { login, register, getUsers ,getUserProfile, getUserById, updateUser, updateUserProfile, deleteUser }