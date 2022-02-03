const { POSTRequestWrapper } = require("./helper");
const { fetchActiveBuilds } = require("./fetchBuilds");
const { askQuestionInput, askQuestionList } = require("../utils/question");

const chalk = require("chalk");
const { map } = require("p-iteration");

const findBuildNumber = async () => {
  const builds = await fetchActiveBuilds();
  const buildNumbers = await map(builds, async (build) => build.build_number);
  const buildNumbersList = await map(
    builds,
    async (build) =>
      `${build.build_number} - ${build.branch} - ${build.triggered_workflow}`
  );

  const buildNumberKnownInputQuestion = await askQuestionList(
    "buildNumberKnown",
    "Do you know the build number of the build you want to abort?"
  );

  const isBuildNumberKnown = buildNumberKnownInputQuestion === "Yes";

  if (isBuildNumberKnown) {
    const buildNumber = await askQuestionInput(
      "buildNumber",
      "Please enter the build you want to abort:",
      "You need to enter the build number!",
      "number"
    );

    if (buildNumbers.includes(buildNumber)) {
      return builds.filter((build) => build.build_number === buildNumber)[0]
        .slug;
    } else {
      console.log(
        chalk.red(
          `No workflow with build number ${buildNumber} is running. Try again.`
        )
      );
      process.exit(0);
    }
  } else {
    const buildSelection = await askQuestionList(
      "buildNumber",
      "Please select the build you want to abort:\n",
      buildNumbersList
    );
    const buildNumber = Number(buildSelection.split(" - ")[0]);
    return builds.filter((build) => build.build_number === buildNumber)[0].slug;
  }
};

const abortBuild = async () => {
  const buildSlug = await findBuildNumber();
  const abortReason = await askQuestionInput(
    "abortReason",
    "Please add an abort reason:\n",
    "You need to add an abort reason!"
  );

  const payload = {
    buildSlug,
    "build-abort-params": {
      abort_reason: abortReason,
    },
  };

  let response = await abort(payload);
  if (response.statusCode > 299) {
    console.error("Something went wrong");
  } else {
    console.log(chalk.green("The build was aborted successfully"));
  }
  process.exit(0);
};

const abort = async (payload) => {
  return await POSTRequestWrapper(
    `https://api.bitrise.io/v0.1/apps/af50b4926a122ad0/builds/${payload.buildSlug}/abort`,
    payload["build-abort-params"]
  );
};

module.exports = {
  abortBuild,
};
