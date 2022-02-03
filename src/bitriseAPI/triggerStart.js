const chalk = require("chalk");
const { WORKFLOW_OPTIONS } = require("../model/model");
const { triggerBuild } = require("./triggerBuild");
const { watcherStart } = require("./watcherStart");
const { createTriggerPayload } = require("../utils/createTriggerPayload");
const {
  askQuestionList,
  askForWorkflow,
  askForBranch,
} = require("../utils/question");

const triggerStart = async (initialWorkflow = "") => {
  let workflow = initialWorkflow;
  let skipTests;

  const branchName = await askForBranch("trigger");

  if (!initialWorkflow) {
    workflow = await askForWorkflow();
  }

  const skipTestsQuestion = WORKFLOW_OPTIONS[workflow].canSkipTests
    ? await askQuestionList("skipTests", "Skip tests?")
    : "no";

  skipTests = skipTestsQuestion === "Yes" ? "true" : "false";
  const skippingTestsText =
    skipTests === "true" ? "Tests will be skipped" : "Tests will run";
  console.log(
    `Triggering ${workflow} for branch ${branchName}. ${skippingTestsText}`
  );

  let selectedTestSuite;
  let envVariables = [
    {
      is_expand: true,
      mapped_to: "SKIP_TESTS",
      value: skipTests,
    },
  ];
  let bitriseMessage = "";
  if (skipTests === "true") {
    bitriseMessage = "Build will not run tests";
  } else {
    if (WORKFLOW_OPTIONS[workflow].testSuites.length) {
      selectedTestSuite = await askQuestionList(
        "testSuite",
        "Do you want to run a specific test suite?",
        ["ALL", ...WORKFLOW_OPTIONS[workflow].testSuites]
      );

      if (selectedTestSuite === "ALL") {
        console.log(chalk.blue("Build will run all the test suites."));
      } else {
        const testSuiteTagVariable = {
          mapped_to: "TEST_SUITE_NAME",
          value: `@${selectedTestSuite}`,
        };
        envVariables.push(testSuiteTagVariable);
        bitriseMessage = `Build will run test suite ${selectedTestSuite}`;
        console.log(
          chalk.blue(`Build will run tests for @${selectedTestSuite}.`)
        );
      }
    }
  }

  const payload = createTriggerPayload(
    branchName,
    workflow,
    envVariables,
    bitriseMessage
  );

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
};

module.exports = {
  triggerStart,
};
