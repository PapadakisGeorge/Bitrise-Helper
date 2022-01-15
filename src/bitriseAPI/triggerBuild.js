const {POSTRequestWrapper} = require('./helper');
const {consoleRed} = require('../model/model');

/**
 * @param payload The payload of the call.
 */
const triggerBuild = async (payload) => {
    try {
        return await POSTRequestWrapper(
            'https://api.bitrise.io/v0.1/apps/af50b4926a122ad0/builds',
            payload);
    } catch (error) {
        console.log(consoleRed, `Request encountered the following error while posting data with error: ${error.message}`);
        return error;
    }
}

module.exports = {
    triggerBuild
}