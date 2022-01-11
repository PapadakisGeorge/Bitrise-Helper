const {POSTRequestWrapper} = require('./helper');
const {consoleRed} = require('../utils/consoleColors');

/**
 * @param url The url the call will use.
 * @param payload The payload of the call.
 * @returns {Promise<Response<string>|*|undefined>} The response of the call.
 */
const triggerBuild = async (url, payload) => {
    try {
        return await POSTRequestWrapper(
            url,
            payload);
    } catch (error) {
        console.log(consoleRed, `Request encountered the following error while posting data with error: ${error.message}`);
        return error;
    }
}

module.exports = {
    triggerBuild
}