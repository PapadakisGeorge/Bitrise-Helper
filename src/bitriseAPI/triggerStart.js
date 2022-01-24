const chalk = require("chalk");
const { WORKFLOWS } = require("../model/model");

const { triggerBuild } = require("./triggerBuild");
const { watcherStart } = require("./watcherStart");
const { createTriggerPayload } = require("../utils/createTriggerPayload");
const inquirer = require("inquirer");

const triggerStart = async (initialWorkflow = "") => {
  let workflow;
  let skipTests;
  let workflowQuestion;
  const availableWorkflowsMatrix = Object.values(WORKFLOWS);

  const branchQuestion = await inquirer.prompt([
    {
      name: "branch",
      message: "Enter the branch name you want to trigger:\n",
      type: "input",
      validate(answer) {
        if (!answer) {
          return "You need to specify a branch!";
        }
        return true;
      },
    },
  ]);

  if (!initialWorkflow) {
    workflowQuestion = await inquirer.prompt([
      {
        name: "workflow",
        message: "Which workflow do you want to trigger?",
        type: "list",
        choices: availableWorkflowsMatrix,
      },
    ]);
  }

  console.log(branchQuestion.branch, workflowQuestion.workflow);

  const skipTestsQuestion = await inquirer.prompt([
    {
      name: "skipTests",
      message: "Skip tests?",
      type: "list",
      choices: ["Yes", "No"],
    },
  ]);

  const branchName = branchQuestion.branch;
  workflow = workflowQuestion.workflow;
  skipTests = skipTestsQuestion.skipTests === "Yes" ? "true" : "false";
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
  if (response.statusCode > 201) {
    console.log("Something went wrong, try again :(");
  } else {
    console.log(
      `Build triggered successfully, more info: ${
        JSON.parse(response.body).build_url
      }`
    );
  }

  let shouldWatchBuilds = await inquirer.prompt([
    {
      name: "watcher",
      message: "Would you like to watch the build?",
      type: "list",
      choices: ["Yes", "No"],
    },
  ]);

  if (shouldWatchBuilds.watcher === "Yes") {
    await watcherStart(branchName);
  } else {
    process.exit(0);
  }
};
module.exports = {
  triggerStart,
};
