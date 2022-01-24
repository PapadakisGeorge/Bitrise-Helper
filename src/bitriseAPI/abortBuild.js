const { POSTRequestWrapper } = require("./helper");
const { fetchActiveBuilds } = require("./fetchBuilds");

const chalk = require("chalk");
const inquirer = require("inquirer");
const { map } = require("p-iteration");

const findBuildNumber = async () => {
  let buildNumber;
  const builds = await fetchActiveBuilds();
  const buildNumbers = await map(builds, async (build) => build.build_number);

  const buildNumberKnownInputQuestion = await inquirer.prompt([
    {
      name: "buildNumberKnown",
      message: `Do you know the build number of the build you want to abort?`,
      type: "list",
      choices: ["Yes", "No"],
    },
  ]);
  const isBuildNumberKnown =
    buildNumberKnownInputQuestion.buildNumberKnown === "Yes";

  if (isBuildNumberKnown) {
    const buildNumberQuestion = await inquirer.prompt([
      {
        name: "buildNumber",
        message: "Please enter the build you want to abort:",
        type: "input",
        validate(answer) {
          if (isNaN(Number(answer))) {
            return "You need to enter the build number!";
          }
          return true;
        },
      },
    ]);
    buildNumber = buildNumberQuestion.buildNumber;
    console.log(buildNumbers);
    if (buildNumbers.includes(buildNumber)) {
      return builds.filter((build) => build.buildNumber == buildNumber)[0]
        .buildSlug;
    } else {
      console.log(
        chalk.red(
          `No workflow with build number ${buildNumber} is running. Try again.`
        )
      );
      process.exit(0);
    }
  } else {
    let buildNumberInput = inquirer.prompt([
      {
        name: "buildNumber",
        message: "Please select the build you want to abort:",
        type: "list",
        choices: buildNumbers,
      },
    ]);
    buildNumber = buildNumberInput.buildNumber;
    return builds.filter(
      (build) => build.buildNumber == buildNumbers[buildNumberInput]
    )[0].buildSlug;
  }
};

const abortBuild = async () => {
  const buildSlug = await findBuildNumber();
  const abortReasonQuestion = inquirer.prompt([
    {
      name: "abortReason",
      message: "Please add an abort reason:\n",
      type: "input",
      validate(answer) {
        if (!answer) {
          return "You need to add an abort reason!";
        }
        return true;
      },
    },
  ]);
  const abortReason = abortReasonQuestion.abortReason;
  const payload = {
    buildSlug,
    "build-abort-params": {
      abort_reason: abortReason,
    },
  };
  console.log(payload);
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
