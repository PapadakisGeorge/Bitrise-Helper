const chalk = require("chalk");
const { createTriggerPayload } = require("../utils/createTriggerPayload");
const { triggerBuild } = require("./triggerBuild");
const { forEachSeries } = require("p-iteration");

/**
 * @param builds A list with each builds' desired branch, workflow and environmental variables.
 */
const triggerMultipleBuilds = async (builds) => {
  await forEachSeries(builds, async (build) => {
    const [branch, workflow, envVariables] = build;
    const payload = createTriggerPayload(branch, workflow, envVariables);
    let response = await triggerBuild(payload);

    if (response.statusCode > 299)
      console.log(chalk.red("Something went wrong, try again :("));
    else
      console.log(
        chalk.green(
          `Build triggered successfully, more info: ${
            JSON.parse(response.body).build_url
          }`
        )
      );
  });
};

module.exports = {
  triggerMultipleBuilds,
};
