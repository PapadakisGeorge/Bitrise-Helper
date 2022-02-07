const { GETRequestWrapper } = require("./helper");
const chalk = require("chalk");

const getWorkflows = async () => {
  try {
    const workflows = await GETRequestWrapper(
      `https://api.bitrise.io/v0.1/apps/${process.env.APP_SLUG}/build-workflows`
    );
    return JSON.parse(workflows.body).data;
  } catch (error) {
    console.log(chalk.red(`Error while retrieving the names of the workflows`));
    return error;
  }
};

module.exports = {
  getWorkflows,
};
