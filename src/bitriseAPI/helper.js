const got = require("got");
const chalk = require("chalk");

const options = {
  headers: {
    Authorization: `${process.env.ACCESS_TOKEN}`,
  },
};

const GETRequestWrapper = async (url, searchOptions) => {
  try {
    const searchParams = new URLSearchParams(searchOptions);
    return got(url, options, { searchParams });
  } catch (error) {
    console.log(
      chalk.red(`Get request encountered the following error: ${error.message}`)
    );
    return error;
  }
};

const POSTRequestWrapper = async (url, payload) => {
  try {
    return got.post(url, { ...options, json: payload });
  } catch (error) {
    console.log(
      chalk.red(
        `POST request encountered the following error: ${error.message}`
      )
    );
    return error;
  }
};

module.exports = {
  GETRequestWrapper,
  POSTRequestWrapper,
};
