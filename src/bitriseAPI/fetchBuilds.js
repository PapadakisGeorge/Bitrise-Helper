const { getData } = require("./dataFetcher");
const { getBranchData } = require("../utils/getDataWithOptions");
const chalk = require("chalk");
const { STATUSES } = require("../model/model");
const inquirer = require("inquirer");

const BITRISE_BUILDS_URL = `https://api.bitrise.io/v0.1/apps/${process.env.APP_SLUG}/builds`;

const fetchActiveBuilds = async () => {
  try {
    const rawBuildsData = await getData(BITRISE_BUILDS_URL, [["status", 0]]);
    const buildsData = JSON.parse(rawBuildsData.body).data;
    if (buildsData.length === 0) {
      console.log(chalk.yellow("No branches are running at Bitrise!"));
      process.exit(0);
    }
    return buildsData;
  } catch (error) {
    console.log(chalk.yellow("Error while fetching the active builds"));
  }
};

const fetchActiveBranchBuilds = () => fetchBranchBuilds({ initialStatus: 0 });

const fetchBranchBuilds = async ({ initialBranch, initialStatus = "" }) => {
  let status = initialStatus;
  let branch = initialBranch;
  if (!branch) {
    const branchQuestion = await inquirer.prompt([
      {
        name: "branch",
        message: "Enter the branch name you want build for:\n",
        type: "input",
        validate(answer) {
          if (!answer) {
            return "You need to specify a branch!";
          }
          return true;
        },
      },
    ]);
    branch = branchQuestion.branch;
  }

  while (typeof status !== "number") {
    const statusQuestion = await inquirer.prompt([
      {
        name: "statusSTATUSES",
        message: "Which build status do you want to fetch?\n",
        type: "list",
        choices: Object.keys(STATUSES),
      },
    ]);
    status = STATUSES[Object.keys(STATUSES)[statusQuestion.status]];
  }

  console.log(chalk.blue(`Getting builds on Bitrise of ${branch}...`));
  let [buildData, totalBuilds] = await getBranchData(
    BITRISE_BUILDS_URL,
    branch,
    status
  );

  if (totalBuilds === 0) {
    console.log(chalk.yellow(`No builds of ${branch} branch detected.`));
  } else {
    return buildData.map((build) => ({
      buildNumber: build.build_number,
      buildSlug: build.slug,
    }));
  }
};

module.exports = {
  fetchActiveBranchBuilds,
  fetchActiveBuilds,
};
