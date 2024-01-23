/**
 * @interface
 * @template T
 */
class BaseServiceInterface {

    /**
     * @param {string} id
     * @returns {Promise<T|null>}
     */
    getById(id) {}

    /**
     * @param {T} data
     * @returns {Promise<T|null>}
     */
    create(data) {}

    /**
     * @param {string} id
     * @param {T} data
     * @returns {Promise<T|null>}
     */
    update(id, data) {}

    /**
     * @param {string} id
     * @returns {Promise<boolean>}
     */
    delete(id) {}
}

module.exports = BaseServiceInterface;