const got = require('got');
const {ConsoleRed} = require('../utils/consoleColors');

const options = {
    headers: {
        Authorization: `${process.env.ACCESS_TOKEN}`,
    },
};

const GETRequestWrapper = async (
    url,
    searchOptions
) => {
    try {
        const searchParams = new URLSearchParams(searchOptions);
        return got(
            url,
            options,
            {searchParams}
        );
    } catch (error) {
        console.log(ConsoleRed, `Request encountered the following error: ${error.message}`);
        return error;
    }
};

// const POSTRequestWrapper = async (
//         requestName,
//         url,
//         payload
//     ) => {
//         try {
//             return got.post(
//                 url,
//                 payload
//             );
//         } catch (error) {
//             log.warn(`POST request ${requestName} encountered the following error: ${error.message}`);
//             return error;
//         }
//     }
// ;

module.exports = {
    GETRequestWrapper,
    // POSTRequestWrapper
}