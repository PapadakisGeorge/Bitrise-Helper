const got = require('got');
const {CONSOLE_RED} = require('../model/model');

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
        console.log(CONSOLE_RED, `Get request encountered the following error: ${error.message}`);
        return error;
    }
};

const POSTRequestWrapper = async (
        url,
        payload
    ) => {
        try {
            return got.post(
                url,
                {...options, json: payload}
            );
        } catch (error) {
            console.log(CONSOLE_RED, `POST request encountered the following error: ${error.message}`);
            return error;
        }
    }

module.exports = {
    GETRequestWrapper,
    POSTRequestWrapper
}