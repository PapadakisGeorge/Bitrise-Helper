const { POSTRequestWrapper } = require("./helper");
const readline = require("readline-sync");
const { CONSOLE_RED, CONSOLE_GREEN } = require("../model/model");
const { YES_NO_OPTIONS, YES_OPTIONS, NO_OPTIONS } = require("../model/model");
const { fetchActiveBranchBuilds } = require("./fetchBuilds");

const findBuildNumber = async () => {
  let buildNumber;
  const builds = await fetchActiveBranchBuilds();
  while (!buildNumber) {
    let buildNumberKnownInput = readline.question(
      "Do you know the build number of the build you want to abort? (y/n):\n",
      {
        limit: YES_NO_OPTIONS,
        limitMessage: `Type y or n!`,
      }
    );

    if (YES_OPTIONS.includes(buildNumberKnownInput)) {
      while (!buildNumber) {
        buildNumber = readline.question(
          "Please enter the build you want to abort:\n"
        );
      }
      return builds.filter((build) => build.buildNumber == buildNumber)[0]
        .buildSlug;
    } else if (NO_OPTIONS.includes(buildNumberKnownInput)) {
      const buildNumbers = builds.map((build) => build.buildNumber);
      let buildNumberInput = readline.keyInSelect(
        buildNumbers,
        `Please select the build you want to abort`
      );
      if (buildNumberInput === -1) process.exit(0);
      return builds.filter(
        (build) => build.buildNumber == buildNumbers[buildNumberInput]
      )[0].buildSlug;
    }
  }
};

const abortBuild = async () => {
  const buildSlug = await findBuildNumber();
  const abortReason = readline.question("Please add an abort reason:\n");
  const payload = {
    buildSlug,
    "build-abort-params": {
      abort_reason: abortReason,
    },
  };
  console.log(payload);
  let response = await abort(payload);
  if (response.statusCode > 201) {
    console.error("Something went wrong");
  } else {
    console.log(CONSOLE_GREEN, "The build was aborted successfully");
  }
  process.exit(0);
};

const abort = async (payload) => {
  try {
    return await POSTRequestWrapper(
      `https://api.bitrise.io/v0.1/apps/af50b4926a122ad0/builds/${payload.buildSlug}/abort`,
      payload["build-abort-params"]
    );
  } catch (error) {
    console.log(
      CONSOLE_RED,
      `Request encountered the following error while posting data with error: ${error.message}`
    );
    return error;
  }
};

module.exports = {
  abortBuild,
};
