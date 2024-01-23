/**
 * @interface
 * @template T
 */
class UserServiceInterface {
    /**
     * @param {string} email
     * @param {string} password
     * @returns {Promise<T|null>}
     */
    authentificationUser(email, password) {}

    /**
     * @returns {Promise<T|null>}
     */
    allUsers() {}

    /**
     * @param {string} id
     * @returns {Promise<T|null>}
     */
    userProfile(id) {}

    /**
     * @param {string} id 
     * @param {T} data 
     * @returns {Promise<T|null>}
     */
    updateUserProfile(id, data) {}

}

module.exports = UserServiceInterface;