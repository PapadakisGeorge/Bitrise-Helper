const chalk = require("chalk");

const { forEach } = require("p-iteration");
const {
  getBuildAverageRunTime,
  approximateFinish,
} = require("../utils/runTime");
const { getData } = require("./dataFetcher");
const { WORKFLOWS, RESERVED_SESSIONS } = require("../model/model");
const { triggerStart } = require("./triggerStart");
const inquirer = require("inquirer");

const capacityCheckStart = async () => {
  //Control input.
  let workflow;
  const availableWorkflowsMatrix = Object.values(WORKFLOWS);

  const workflowQuestion = await inquirer.prompt([
    {
      name: "workflow",
      message: "Which workflow do you want to trigger?",
      type: "list",
      choices: availableWorkflowsMatrix,
    },
  ]);
  workflow = workflowQuestion.workflow;

  // Start the actual work.
  let workflowData = {};

  const BITRISE_BUILDS_URL = `https://api.bitrise.io/v0.1/apps/${process.env.APP_SLUG}/builds`;
  const SESSIONS_LIMIT = "70";

  const getTimeAndReservedSessions = async (workflow) => {
    const approximateTriggerTime = await getBuildAverageRunTime(workflow);
    workflowData[workflow] = {
      approximateTriggerTime: approximateTriggerTime,
      RESERVED_SESSIONS: RESERVED_SESSIONS[workflow],
    };
  };
  //Get builds that are currently running, in how much time will the build end, and return the number of sessions will use when my builds will start.

  let occupiedSessions = 0;

  const buildsRunningRawData = await getData(BITRISE_BUILDS_URL, [
    ["status", 0],
  ]);
  const buildsRunning = JSON.parse(buildsRunningRawData.body).data;
  const filteredBuilds = buildsRunning.filter((build) =>
    Object.keys(RESERVED_SESSIONS).includes(build.triggered_workflow)
  );

  await forEach(
    filteredBuilds,
    async (build) => await getTimeAndReservedSessions(build.triggered_workflow)
  );

  //Get the average time of the builds the user wants to run and how many sessions should they use.
  let buildsThatAffect = {};
  const saveBuildData = (build, approximateEndTime) => {
    buildsThatAffect[`${build.build_number}`] = {
      sessions: workflowData[build.triggered_workflow].RESERVED_SESSIONS,
      buildName: build.triggered_workflow,
      finishTime: approximateEndTime,
    };
  };
  const checkIfSkipTestsWasUsed = (build) => {
    if (!Object.keys(build).includes("original_build_params")) {
      return false;
    }
    if ("environments" in build.original_build_params) {
      build.original_build_params.environments.forEach((envVar) => {
        if (envVar.key === "SKIP_TESTS" && envVar.value === "true") {
          return true;
        }
      });
    } else {
      return false;
    }
  };
  await getTimeAndReservedSessions(workflow);
  await forEach(filteredBuilds, async (build) => {
    const buildName = build.triggered_workflow;
    const approximateEndTime = await approximateFinish(
      build.triggered_at,
      buildName
    );
    if (
      buildName.includes("Execute") &&
      Number(approximateEndTime) >
        Number(workflowData[workflow].approximateTriggerTime)
    ) {
      occupiedSessions += workflowData[buildName].RESERVED_SESSIONS;
      saveBuildData(build, approximateEndTime);
    } else if (buildName.includes("workflow")) {
      if (!checkIfSkipTestsWasUsed(build)) {
        occupiedSessions += Number(workflowData[buildName].RESERVED_SESSIONS);
        saveBuildData(build, approximateEndTime);
      }
    }
  });

  Object.keys(buildsThatAffect).forEach((buildNumber) => {
    const buildName = buildsThatAffect[buildNumber].buildName;
    const reserveTense = buildName.includes("Execute")
      ? "reserves"
      : "will reserve";
    const finishTimeText =
      buildsThatAffect[buildNumber].finishTime > 1
        ? `in about ${buildsThatAffect[buildNumber].finishTime} minutes.`
        : "soon.";
    console.log(
      chalk.cyan(
        `${buildsThatAffect[buildNumber].buildName} with build number ${buildNumber} ${reserveTense} ${buildsThatAffect[buildNumber].sessions} sessions and will end ${finishTimeText}`
      )
    );
  });

  const sessionsYouWillNeed =
    workflow === "workflow_Android"
      ? Number(RESERVED_SESSIONS["workflow_Android"]) +
        Number(RESERVED_SESSIONS["workflow_IOS"])
      : Number(workflowData[workflow].RESERVED_SESSIONS);

  if (occupiedSessions + sessionsYouWillNeed > SESSIONS_LIMIT) {
    console.log(
      chalk.red(
        `workflow ${workflow} will need ${sessionsYouWillNeed} sessions, so it should not be triggered at the moment :( Estimated sessions (with your build) ${
          occupiedSessions + sessionsYouWillNeed
        }`
      )
    );
  } else {
    console.log(
      chalk.green(
        `${workflow} will need ${sessionsYouWillNeed} sessions, so it can be triggered!!!`
      )
    );
    const triggerQuestion = await inquirer.prompt([
      {
        name: "trigger",
        message: `Would you like to trigger the ${workflow}?`,
        type: "list",
        choices: ["Yes", "No"],
      },
    ]);
    const shouldTriggerBuild = triggerQuestion.trigger === "Yes";

    if (!shouldTriggerBuild) {
      process.exit(0);
    } else {
      await triggerStart(workflow);
    }
  }
};

module.exports = {
  capacityCheckStart,
};
