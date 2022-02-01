const { getData } = require("./dataFetcher");
const { getBranchData } = require("../utils/getDataWithOptions");
const { askQuestionList, askForBranch } = require("../utils/question");

const chalk = require("chalk");
const { STATUSES } = require("../model/model");

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
  let status;
  let branch = initialBranch;
  if (!branch) {
    branch = await askForBranch();

    const verboseStatus = await askQuestionList(
      "status",
      "Which build status do you want to fetch?\n",
      Object.keys(STATUSES)
    );
    status = STATUSES[Object.keys(STATUSES)[verboseStatus]];

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
  }
};

module.exports = {
  fetchActiveBranchBuilds,
  fetchActiveBuilds,
};
