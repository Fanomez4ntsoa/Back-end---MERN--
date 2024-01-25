const asyncHandler = require("express-async-handler");
const UserService = require('../services/UserService');
const User = require('../models/UserModel');
const generateToken = require("../utils/generateToken");
const EmailHelper = require("../utils/emailHelper");
const errorMessage = require('../resources/lang/fr/errorMessage');

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
        if(authenticatedUser.error) {
            res.status(authenticatedUser.status).json({ message: authenticatedUser.message });    
        } else {
            res.status(authenticatedUser.status).json({ message: authenticatedUser.message, data: authenticatedUser.data});
        }
        
    } catch (error) {
        res.status(500).json({ error: error.message});
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
        res.status(422).json({ message: errorMessage.validations });
        return;
    }
    const { firstname, lastname, email, password } = req.body;
    if (!firstname) {
        res.status(400).json({ message: errorMessage.user.firstname });
        return;
    } else if (!lastname) {
        res.status(400).json({ message: errorMessage.user.lastname });
        return;
    } else if (!email) {
        res.status(400).json({ message: errorMessage.user.email });
        return;
    } else if (!password) {
        res.status(400).json({ message: errorMessage.user.password });
        return;
    }
    

    try {
        const userExists = await User.findOne({ email })
        const email_valid = EmailHelper.isValidEmail(email);

        if (userExists) {
            res.status(409).json({ message: errorMessage.user.already_exist });
        }
        if(!email_valid) {
            res.status(404).json({ message: errorMessage.user.invalid_email })
        }

        const createdUser = await userService.create({
            firstname, 
            lastname,
            email_valid,
            password
        });
        
        if(createdUser) {
            res.status(201).json({
                message: successMessage.user.created,
                data: {
                    _id: createdUser._id,
                    firstname: createdUser.firstname,
                    lastname: createdUser.lastname,
                    email: createdUser.email,
                    isAdmin: createdUser.isAdmin,
                    token: generateToken(createdUser._id),
                    }
                })
        } else {
        res.status(403).json({ message: errorMessage.default});
        }
    } catch (error) {
        res.status(500).json({ message: errorMessage.default + error.message });
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
                firstname: user.firstname,
                lastname: user.lastname,
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
        const userProfile = await userService.userProfile(userId);
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