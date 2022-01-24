const { getData } = require("./dataFetcher");
const { getBranchData } = require("../utils/getDataWithOptions");
const {
  stopSpinner,
  updateSpinnerText,
  startSpinner,
} = require("../utils/spinners");
const { shellExec } = require("../utils/shellCommand");
const { approximateFinish } = require("../utils/runTime");
const { fetchActiveBuilds } = require("./fetchBuilds");

const chalk = require("chalk");
const { forEach } = require("p-iteration");
const cron = require("node-cron");
const _ = require("lodash");

const Spinners = require("spinnies");
const inquirer = require("inquirer");
const LIST_OPTION = "Select from a list";
const MANUAL_INPUT_OPTION = "Enter manually";

const watcherStart = async (initialBranch = "") => {
  let branchName = initialBranch;
  while (!branchName) {
    let manualOrListQuestion = await inquirer.prompt([
      {
        name: "manualOrList",
        message:
          "Do you want to select a branch from a list or enter the branch name manually?",
        type: "list",
        choices: [LIST_OPTION, MANUAL_INPUT_OPTION],
      },
    ]);

    const getFromList = manualOrListQuestion.manualOrList === LIST_OPTION;

    if (getFromList) {
      console.log(chalk.blue("Fetching active builds..."));
      const activeBuilds = await fetchActiveBuilds();
      const activeBranchNamesList = _.uniq(
        activeBuilds.map((build) => build.branch)
      );
      let selectBranchQuestion = await inquirer.prompt([
        {
          name: "branch",
          message: "Select the branch you want to watch:",
          type: "list",
          choices: activeBranchNamesList,
        },
      ]);
      branchName = selectBranchQuestion.branch;
    } else {
      const branchQuestion = await inquirer.prompt([
        {
          name: "branch",
          message:
            "Enter the branch name, or part of it, that you want to watch:\n",
          type: "input",
          validate(answer) {
            if (!answer) {
              return "You need to specify a branch!";
            }
            return true;
          },
        },
      ]);
      branchName = branchQuestion.branch;
    }
  }
  console.log(
    chalk.blue(
      `Getting builds on Bitrise of ${branchName} currently running...`
    )
  );

  //Get data for running builds when the script is initiated
  const BITRISE_BUILDS_URL = `https://api.bitrise.io/v0.1/apps/${process.env.APP_SLUG}/builds`;
  let [buildData, totalBuilds] = await getBranchData(
    BITRISE_BUILDS_URL,
    branchName,
    0
  );

  if (totalBuilds === 0) {
    console.log(chalk.yellow(`No builds of ${branchName} branch detected.`));
    process.exit(0);
  } else {
    if (totalBuilds === 1) console.log(chalk.green(`Build detected!`));
    else console.log(chalk.green(`Builds detected!`));

    const spinners = new Spinners();
    let currentBuilds = {};

    const checkIfNewSpinnerIsNeeded = async (build) => {
      const buildNumber = build.build_number;
      if (!(buildNumber in currentBuilds)) {
        const finishTime = await approximateFinish(
          build.triggered_at,
          build.triggered_workflow
        );
        currentBuilds[buildNumber] = {};
        currentBuilds[buildNumber].url = build.slug;
        currentBuilds[buildNumber].finishTime = finishTime;
        startSpinner(build, finishTime, spinners);
      }
    };

    //Initialise the spinners of the detected builds.
    await forEach(
      buildData,
      async (build) => await checkIfNewSpinnerIsNeeded(build)
    );

    //Once per minute check for the status of the builds.
    cron.schedule("* * * * *", async function () {
      await forEach(Object.keys(currentBuilds), async (buildNumber) => {
        const rawData = await getData(BITRISE_BUILDS_URL, [
          ["build_number", buildNumber],
        ]);
        const buildData = JSON.parse(rawData.body).data[0];
        const buildStatus = buildData.status;
        if (buildStatus !== 0) {
          const buildURL = currentBuilds[buildNumber].url;
          stopSpinner(
            buildNumber,
            buildData.triggered_workflow,
            buildStatus,
            buildURL,
            spinners
          );
          delete currentBuilds[buildNumber];
          if (buildStatus === 2) {
            shellExec(
              'osascript -e "display notification \\"Build failed!\\" with title \\"BITRISE BUILD\\""'
            );
            shellExec("say Builds failed!");
          } else {
            shellExec(
              'osascript -e "display notification \\"Build finished!\\" with title \\"BITRISE BUILD\\""'
            );
            shellExec("say Builds finished!");
          }
        } else {
          const finishTime = currentBuilds[buildNumber].finishTime - 1;
          currentBuilds[buildNumber].finishTime = finishTime;
          updateSpinnerText(buildData, finishTime, spinners);
        }
      });

      //Get the data of running builds and handle the spinners.
      [buildData, totalBuilds] = await getBranchData(
        BITRISE_BUILDS_URL,
        branchName,
        0
      );
      await forEach(
        buildData,
        async (build) => await checkIfNewSpinnerIsNeeded(build)
      );

      //If no builds are running the currentBuilds object should be empty and the program to stop.
      if (_.isEmpty(currentBuilds)) {
        process.exit(0);
      }
    });
  }
};

module.exports = {
  watcherStart,
};
