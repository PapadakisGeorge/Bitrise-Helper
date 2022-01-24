const { triggerBuild } = require("./triggerBuild");
const { watcherStart } = require("./watcherStart");
const { createTriggerPayload } = require("../utils/createTriggerPayload");
const {
  askQuestionList,
  askForWorkflow,
  askForBranch,
} = require("../utils/question");

const triggerStart = async (initialWorkflow = "") => {
  let workflow;
  let skipTests;

  const branchName = await askForBranch();

  if (!initialWorkflow) {
    workflow = await askForWorkflow();

    const skipTestsQuestion = await askQuestionList("skipTests", "Skip tests?");

    skipTests = skipTestsQuestion === "Yes" ? "true" : "false";
    const skippingTestsText =
      skipTests === "true" ? "Tests will be skipped" : "Tests will run";
    console.log(
      `Triggering ${workflow} for branch ${branchName}. ${skippingTestsText}`
    );

    const envVariables = [
      {
        is_expand: true,
        mapped_to: "SKIP_TESTS",
        value: skipTests,
      },
    ];
    const payload = createTriggerPayload(branchName, workflow, envVariables);

    let response = await triggerBuild(payload);
    if (response.statusCode > 299) {
      console.log("Something went wrong, try again :(");
    } else {
      console.log(
        `Build triggered successfully, more info: ${
          JSON.parse(response.body).build_url
        }`
      );
    }

    let shouldWatchBuilds = await askQuestionList(
      "watcher",
      "Would you like to watch the build?"
    );

    if (shouldWatchBuilds === "Yes") {
      await watcherStart(branchName);
    } else {
      process.exit(0);
    }
  }
};

module.exports = {
  triggerStart,
};
