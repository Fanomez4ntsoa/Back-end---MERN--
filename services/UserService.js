const BaseService = require("./BaseService");
const UserServiceInterface = require('../contracts/UserServiceInterface');
const UserModel = require('../models/UserModel');
const generateToken = require("../utils/generateToken");
const bcrypt = require('bcryptjs');
const errorMessage = require('../resources/lang/fr/errorMessage');
const successMessage = require('../resources/lang/fr/successMessage');

/**
 * @implements (UserServiceInterface)
 */
class UserService extends BaseService {
    constructor() {
        super(UserModel);
    }

    /**
     * Authentification
     * 
     * @param {string} email 
     * @param {string} password 
     */
    async authentificationUser(email, password) {
        try {
            const user = await UserModel.findOne({ email });
            if(user === null) {
                res.status(404).json({ message: errorMessage.auth.email });
            }
            if(!await user.matchPassword(password)) {
                res.status(401).json({ message: errorMessage.auth.password });
            }
            return {
                message: successMessage.default,
                data: {
                    _id: user._id,
                    email: user.email,
                    password: user.password,
                    token: generateToken(user._id)
                }
            };
        } catch (error) {
            throw new Error(
                errorMessage.default + 
                error.message
            );
        }
    }

    /**
     * Récuperer tous les utilisateurs 
     * @returns 
     */
    async allUsers() {
        try {
            return await UserModel.find({})
        } catch (error) {
            throw new Error(`Error on getting all users : ${error.message}`)
        }
    }

    /**
     * Récuperer un profile d'un utilisateur par son id
     * 
     * @param {string} userId 
     * @returns 
     */
    async userProfile(userId) {
        try {
            const user = await this.getById(userId);
            return {
                message: 'Profile successful recovery',
                data: {
                    _id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    isAdmin: user.isAdmin,
                }
            };
        } catch (error) {
            throw new Error(`Error on getting user profile: ${error.message}`);
        }
    }

    /**
     * Mise à jour des informations du profile d'un utilisateur
     * 
     * @param {string} userId 
     * @param {void} data 
     * @returns 
     */
    async updateUserProfile(userId, data) {
        try {
            const user = await this.getById(userId);
    
            if (user) {
                user.firstname = data.firstname || user.firstname;
                user.lastname = data.lastname || user.lastname;
                user.email = data.email || user.email;
                
                if (data.password) {
                    if(!data.confirmPassword) {
                        throw new Error('Confirm password is required when updating password');
                    }

                    if (data.password !== data.confirmPassword) {
                        throw new Error('Password and confirm password do not match');
                    }

                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(data.password, salt);
                }
    
                const updatedUser = await this.update(userId, user);
                return {
                    _id: updatedUser._id,
                    firstname: updatedUser.firstname,
                    lastname: updatedUser.lastname,
                    email: updatedUser.email,
                    isAdmin: updatedUser.isAdmin,
                    token: generateToken(updatedUser._id),
                };
            } else {
                throw new Error('User not found');
            }
        } catch (error) {
            throw new Error(`Error on updating user profile: ${error.message}`);
        }
    }
}

module.exports = UserService;