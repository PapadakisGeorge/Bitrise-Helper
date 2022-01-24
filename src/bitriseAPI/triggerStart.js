const readline = require("readline-sync");
const chalk = require("chalk");
const {
  WORKFLOWS,
  YES_NO_OPTIONS,
  YES_OPTIONS,
  NO_OPTIONS,
  TEST_SUITES,
} = require("../model/model");

const { triggerBuild } = require("./triggerBuild");
const { watcherStart } = require("./watcherStart");
const { createTriggerPayload } = require("../utils/createTriggerPayload");

const triggerStart = async (initialWorkflow = "") => {
  let BRANCH;
  let WORKFLOW = initialWorkflow;
  let SKIP_TESTS;
  let TEST_SUITE_TAG = "";

  const availableWorkflowsMatrix = Object.values(WORKFLOWS);
  while (!BRANCH) {
    BRANCH = readline.question(`Enter the branch name you want to trigger:\n`);
    if (!BRANCH) {
      console.log(chalk.red("You need to specify a branch!"));
    }
    if (!initialWorkflow) {
      while (!WORKFLOW) {
        let WORKFLOW_INPUT = readline.keyInSelect(
          availableWorkflowsMatrix,
          `Which workflow do you want to trigger?`
        );
        if (WORKFLOW_INPUT === -1) {
          console.log(chalk.blue("Aborting trigger..."));
          process.exit(0);
        }
        WORKFLOW = availableWorkflowsMatrix[WORKFLOW_INPUT];
      }
    }
    while (!SKIP_TESTS) {
      SKIP_TESTS = readline.question(`Skip tests? (y/n):\n`, {
        limit: YES_NO_OPTIONS,
        limitMessage: `Type y or n!`,
      });
    }

    const skippingTestsText = YES_OPTIONS.includes(SKIP_TESTS)
      ? "Tests will be skipped"
      : "Tests will run";
    if (NO_OPTIONS.includes(SKIP_TESTS)) {
      let TEST_SUITE;
      while (!TEST_SUITE) {
        TEST_SUITE = readline.keyInSelect(
          TEST_SUITES,
          `Do you want to run a specific test suite?\n`
        );
      }
      if (TEST_SUITE === -1) {
        console.log(chalk.blue("Will not run a specific test suite."));
      } else {
        TEST_SUITE_TAG = `@${TEST_SUITES[TEST_SUITE]}`;
      }
    }
    console.log(
      chalk.blue(
        `Triggering ${WORKFLOW} for branch ${BRANCH}. ${skippingTestsText}.${
          TEST_SUITE_TAG ? `Running tests with tag ${TEST_SUITE_TAG}` : ""
        }`
      )
    );
  }

  const envVariables = [
    {
      is_expand: true,
      mapped_to: "SKIP_TESTS",
      value: YES_OPTIONS.includes(SKIP_TESTS) ? "true" : "false",
    },
    {
      mapped_to: "TEST_SUITE_NAME",
      value: TEST_SUITE_TAG,
    },
  ];
  const payload = createTriggerPayload(BRANCH, WORKFLOW, envVariables);

  let response = await triggerBuild(payload);
  if (response.statusCode > 299) {
    console.log(chalk.red("Something went wrong, try again :("));
  } else {
    console.log(
      chalk.green(
        `Build triggered successfully, more info: ${
          JSON.parse(response.body).build_url
        }`
      )
    );
    let shouldWatchBuilds;
    while (!shouldWatchBuilds) {
      shouldWatchBuilds = readline.question(
        `Would you like to watch the build? (y/n):\n`,
        {
          limit: YES_NO_OPTIONS,
          limitMessage: `Type y or n!`,
        }
      );

      if (NO_OPTIONS.includes(shouldWatchBuilds)) {
        process.exit(0);
      } else if (YES_OPTIONS.includes(shouldWatchBuilds)) {
        await watcherStart(BRANCH);
      }
    }
  }
};
module.exports = {
  triggerStart,
};
