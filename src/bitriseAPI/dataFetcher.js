const {GETRequestWrapper} = require('./helper');
const {ConsoleRed} = require('../utils/consoleColors');

/**
 * @param url The url the call will use.
 * @param searchOptions The parameters of the call.
 * @returns {Promise<Response<string>|*|undefined>} The data the call will fetch.
 */
const getData = async (url, searchOptions) => {
    try {
        return await GETRequestWrapper(
            url,
            searchOptions);
    } catch (error) {
        console.log(ConsoleRed, `Request encountered the following error while fetching data with error: ${error.message}`);
        return error;
    }
}

module.exports = {
    getData
}