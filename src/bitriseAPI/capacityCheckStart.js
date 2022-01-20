const chalk = require("chalk");
const readline = require("readline-sync");

const { forEach } = require("p-iteration");
const {
  getBuildAverageRunTime,
  approximateFinish,
} = require("../utils/runTime");
const { getData } = require("./dataFetcher");
const {
  WORKFLOWS,
  YES_NO_OPTIONS,
  YES_OPTIONS,
  NO_OPTIONS,
  RESERVED_SESSIONS,
} = require("../model/model");
const { triggerStart } = require("./triggerStart");

const capacityCheckStart = async () => {
  //Control input.
  let WORKFLOW;
  const availableWorkflowsMatrix = Object.values(WORKFLOWS);

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
  await getTimeAndReservedSessions(WORKFLOW);
  await forEach(filteredBuilds, async (build) => {
    const buildName = build.triggered_workflow;
    const approximateEndTime = await approximateFinish(
      build.triggered_at,
      buildName
    );
    if (
      buildName.includes("Execute") &&
      Number(approximateEndTime) >
        Number(workflowData[WORKFLOW].approximateTriggerTime)
    ) {
      occupiedSessions += workflowData[buildName].RESERVED_SESSIONS;
      saveBuildData(build, approximateEndTime);
    } else if (buildName.includes("Workflow")) {
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
    WORKFLOW === "Workflow_Android"
      ? Number(RESERVED_SESSIONS["Workflow_Android"]) +
        Number(RESERVED_SESSIONS["Workflow_IOS"])
      : Number(workflowData[WORKFLOW].RESERVED_SESSIONS);

  if (occupiedSessions + sessionsYouWillNeed > SESSIONS_LIMIT) {
    console.log(
      chalk.red(
        `Workflow ${WORKFLOW} will need ${sessionsYouWillNeed} sessions, so it should not be triggered at the moment :( Estimated sessions (with your build) ${
          occupiedSessions + sessionsYouWillNeed
        }`
      )
    );
  } else {
    console.log(
      chalk.green(
        `${WORKFLOW} will need ${sessionsYouWillNeed} sessions, so it can be triggered!!!`
      )
    );
    let shouldTriggerBuild;
    while (!shouldTriggerBuild) {
      shouldTriggerBuild = readline.question(
        `Would you like to trigger the ${WORKFLOW}? (y/n):\n`,
        {
          limit: YES_NO_OPTIONS,
          limitMessage: `Type y or n!`,
        }
      );
    }

    if (NO_OPTIONS.includes(shouldTriggerBuild)) {
      process.exit(0);
    } else if (YES_OPTIONS.includes(shouldTriggerBuild)) {
      await triggerStart(WORKFLOW);
    }
  }
};

module.exports = {
  capacityCheckStart,
};
