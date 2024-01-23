const BaseService = require("./BaseService");
const UserServiceInterface = require('../contracts/UserServiceInterface');
const UserModel = require('../models/UserModel');
const generateToken = require("../utils/generateToken");

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
            if (user && (await user.matchPassword(password))) {
                return {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    token: generateToken(user._id),
                };
            } else {
                throw new Error('Invalid email or password');
            } 
        } catch (error) {
            throw new Error(`Error on user authentication: ${error.message}`);
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
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
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
                user.name = data.name || user.name;
                user.email = data.email || user.email;
                
                if (data.password) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(data.password, salt);
                }
    
                const updatedUser = await this.update(userId, user);
                return {
                    _id: updatedUser._id,
                    name: updatedUser.name,
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