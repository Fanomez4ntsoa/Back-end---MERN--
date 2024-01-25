const { PATTERN_GMAIL, PATTERN_YAHOO, PATTERN_OUTLOOK, PATTERN_MAIL, PATTERN_CLOUD, PATTERN_MICROSOFT, PATTERN_EXTENSION_GMAIL, PATTERN_EXTENSION_YAHOO, PATTERN_EDU } = require('../config/constant');

class EmailHelper {

    /**
     * Check if email is Valid
     * 
     * @param {string} email 
     * @returns boolean|null
     */
    static isValidEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        const allowedDomains = [
            PATTERN_GMAIL,
            PATTERN_YAHOO,
            PATTERN_OUTLOOK,
            PATTERN_MAIL,
            PATTERN_CLOUD,
            PATTERN_MICROSOFT
        ];

        const allowedExtensions = [
            PATTERN_EXTENSION_GMAIL,
            PATTERN_EXTENSION_YAHOO,
            PATTERN_EDU
        ];

        if (emailRegex.test(email)) {
            const [, domain, extension] = email.split('@')[1].split('.');

            console.log('Domain:', domain);
            console.log('Extension:', extension);
            return allowedDomains.includes(domain) && allowedExtensions.includes(extension);
        }

        return false;
    }
}

module.exports = EmailHelper;