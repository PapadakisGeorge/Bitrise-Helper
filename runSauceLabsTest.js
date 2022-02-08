const { runChildProcess } = require("./src/utils/shellCommand");
const { askQuestionList, askQuestionInput } = require("./src/utils/question");
const got = require("got");
const chalk = require("chalk");
const Spinners = require("spinnies");
const fs = require("fs");
const { getAllFeatureNames } = require("./src/utils/getFeatures");

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const requireTestSuite = async () => {
  return await askQuestionList(
    "testSuite",
    "Which test suite are you going to run",
    ["android", "android edge", "ios", "ios edge"]
  );
};

const requireBranch = async () => {
  return askQuestionInput("branch", "Which branch?\n", "Invalid branch");
};

const sauce_credentials = {
  username: process.env.SAUCE_USERNAME,
  password: process.env.SAUCE_ACCESS_KEY,
};

const options = {
  headers: {
    "Content-Type": "application/json",
  },
  Authorization: "Basic",
  ...sauce_credentials,
};

const searchInSauceStorage = async (branch) => {
  const searchOptions = [
    ["query", branch],
    ["per_page", "1000"],
  ];
  const searchParams = new URLSearchParams(searchOptions);

  const appsListRawData = await got(
    "https://api.eu-central-1.saucelabs.com/v1/storage/files",
    options,
    {
      searchParams,
    }
  );

  return JSON.parse(appsListRawData.body).items;
};

const requireAppName = async (testSuite, branch) => {
  const flattenedType = testSuite.includes("ios") ? "ios" : "android";
  let appsList = await searchInSauceStorage(branch);

  appsList = appsList.filter(
    (item) => item.name.includes(branch) && item.kind === flattenedType
  );

  const appNames = appsList.map((item) => item.name);

  if (appNames.length === 0) {
    console.log(chalk.red("No apps of your branch/test suite found"));
    process.exit(0);
  }

  return await askQuestionList("sauceApp", "Choose the app", appNames);
};

const checkForTunnel = async () => {
  let sauceLabsTunnelResponse = await got(
    `https://api.eu-central-1.saucelabs.com/rest/v1/${process.env.SAUCE_USERNAME}/tunnels`,
    options
  );

  sauceLabsTunnelResponse = sauceLabsTunnelResponse.body;

  if (sauceLabsTunnelResponse === "[]") {
    console.log(chalk.blue("No tunnel detected."));
    runChildProcess(
      'sh ./src/shellScripts/new.sh "${PROJECT_PATH}/sc-4.7.1-osx/bin/sc -u ${SAUCE_USERNAME} -k ${SAUCE_ACCESS_KEY} -x https://eu-central-1.saucelabs.com/rest/v1 -i ${TUNNEL_IDENTIFIER}"'
    );
    const spinners = new Spinners();
    spinners.add("tunnel-spinner", { text: "Establishing Sauce Tunnel..." });
    await sleep(30000);
    spinners.succeed("tunnel-spinner");
  } else console.log(chalk("Tunnel detected."));
};

const checkForWiremock = async () => {
  try {
    await got("http://localhost:5040/cms/dictionary.json");
    console.log(chalk.blue("Wiremock already running."));
  } catch (error) {
    if (error)
      runChildProcess(
        'sh ./src/shellScripts/new.sh "java -jar ${PROJECT_PATH}/wiremock-standalone-2.25.1.jar --port 5040 --root-dir ${PROJECT_PATH}/ie-native-app/docker-mocks/mocks --verbose --local-response-templating"'
      );
  }
};

const requireTestName = async (testSuite) => {
  const featuresList = await getAllFeatureNames(testSuite);

  return await askQuestionList("testName", "Which test? \n", featuresList);
};

const createTempConfig = (testSuite, appName) => {
  const confFileDirPath = "../ie-native-app/test/conf/";
  let confFilePath;
  let confName;
  let tempConfName;

  switch (testSuite) {
    case "android":
      confName = "wdio.android.sauce.conf.js";
      confFilePath = `${confFileDirPath}${confName}`;
      tempConfName = `temp.${confName}`;
      break;
    case "android edge":
      confName = "wdio.android.edge.conf.js";
      confFilePath = `${confFileDirPath}${confName}`;
      tempConfName = `temp.${confName}`;
      break;
    case "ios":
      confName = "wdio.ios.sauce.conf.js";
      confFilePath = `${confFileDirPath}${confName}`;
      tempConfName = `temp.${confName}`;
      break;
    case "ios edge":
      confName = "wdio.ios.sauce.edge.conf.js";
      confFilePath = `${confFileDirPath}${confName}`;
      tempConfName = `temp.${confName}`;
      break;
    default:
      break;
  }
  const tempConfFilePath = `${confFileDirPath}${tempConfName}`;

  fs.readFile(confFilePath, "utf-8", function (err, data) {
    if (err) throw err;
    const newValue = testSuite.includes("android")
      ? data.replace(/app-release-[\D\d.-]+\.apk/gim, appName)
      : data.replace(/CtpIENativeApp-[\D\d.-]+\.app\.zip/gim, appName);
    fs.writeFile(tempConfFilePath, newValue, "utf-8", function (err) {
      if (err) throw err;
    });
  });

  return tempConfName;
};
const runSauceLabsTest = async () => {
  let shouldRun = true;
  let testSuite = await requireTestSuite();
  let branch = await requireBranch();
  let appName = await requireAppName(testSuite, branch);
  let testName = await requireTestName(testSuite);
  const tempConfName = createTempConfig(testSuite, appName);
  await checkForTunnel();
  await checkForWiremock();

  while (shouldRun) {
    runChildProcess(
      `sh ./src/shellScripts/new.sh "cd ${process.env.PROJECT_PATH}/ie-native-app && ${process.env.PROJECT_PATH}/ie-native-app/node_modules/.bin/wdio test/conf/${tempConfName} --spec ${testName}"`
    );
    const askForRerun = await askQuestionList("reRun", "Do you want to rerun?");
    if (askForRerun === "No") {
      shouldRun = false;
      runChildProcess(
        `sh ./src/shellScripts/new.sh "${process.env.PROJECT_PATH}/ie-native-app && rm ${process.env.PROJECT_PATH}/ie-native-app/test/conf/${tempConfName}"`
      );
    } else {
      testName = await requireTestName(testSuite);
      runChildProcess(
        `sh ./src/shellScripts/new.sh "${process.env.PROJECT_PATH}/ie-native-app/node_modules/.bin/wdio test/conf/${tempConfName} --spec ${testName}"`
      );
    }
  }
};
(async () => {
  await runSauceLabsTest();
})();
