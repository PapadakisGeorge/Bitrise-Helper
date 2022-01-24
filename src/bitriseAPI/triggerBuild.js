const { POSTRequestWrapper } = require("./helper");
const chalk = require("chalk");

/**
 * @param payload The payload of the call.
 */
const triggerBuild = async (payload) => {
  try {
    return await POSTRequestWrapper(
      `https://api.bitrise.io/v0.1/apps/${process.env.APP_SLUG}/builds`,
      payload
    );
  } catch (error) {
    console.log(
      chalk.red(
        `Request encountered the following error while posting data with error: ${error.message}`
      )
    );
    return error;
  }
};

module.exports = {
  triggerBuild,
};
