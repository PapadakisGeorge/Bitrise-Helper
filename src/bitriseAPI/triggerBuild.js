const {POSTRequestWrapper} = require('./helper');
const {CONSOLE_RED} = require('../model/model');

/**
 * @param payload The payload of the call.
 */
const triggerBuild = async (payload) => {
    try {
        return await POSTRequestWrapper(
            'https://api.bitrise.io/v0.1/apps/af50b4926a122ad0/builds',
            payload);
    } catch (error) {
        console.log(CONSOLE_RED, `Request encountered the following error while posting data with error: ${error.message}`);
        return error;
    }
}

module.exports = {
    triggerBuild
}