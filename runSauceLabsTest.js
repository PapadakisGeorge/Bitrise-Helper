const { runChildProcess, shellExec } = require("./src/utils/shellCommand");
const { askQuestionList, askQuestionInput } = require("./src/utils/question");
const got = require("got");
const chalk = require("chalk");
const Spinners = require("spinnies");

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const runSauceLabsTest = async () => {
  const testSuite = await askQuestionList(
    "testSuite",
    "Which test suite are you going to run",
    ["Android", "iOS", "iOS edge", "Android Edge"]
  );

  const branch = await askQuestionInput(
    "branch",
    "Which branch?\n",
    "Invalid branch"
  );
  const flattenedType = testSuite.includes("iOS") ? "ios" : "android";

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

  let appsList = JSON.parse(appsListRawData.body).items;

  appsList = appsList.filter(
    (item) => item.name.includes(branch) && item.kind === flattenedType
  );

  const appNames = appsList.map((item) => item.name);
  if (appNames.length === 0) {
    console.log(chalk.red("No apps of your branch/test suite found"));
    process.exit(0);
  }
  const chooseSauceLabsApp = await askQuestionList(
    "sauceApp",
    "Choose the app",
    appNames
  );

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

  try {
    await got("http://localhost:5040/cms/dictionary.json");
    console.log(chalk.blue("Wiremock already running."));
  } catch (error) {
    if (error)
      runChildProcess(
        'sh ./src/shellScripts/new.sh "java -jar ${PROJECT_PATH}/wiremock-standalone-2.25.1.jar --port 5040 --root-dir ${PROJECT_PATH}/ie-native-app/docker-mocks/mocks --verbose --local-response-templating"'
      );
  }

  const confFileDirPath = "../ie-native-app/test/conf/";
  let confFilePath;
  let confName;
  let tempConfName;
  switch (testSuite) {
    case "Android":
      confName = "wdio.android.sauce.conf.js";
      confFilePath = `${confFileDirPath}${confName}`;
      tempConfName = `temp.${confName}`;
      break;
    case "Android edge":
      confName = "wdio.android.edge.conf.js";
      confFilePath = `${confFileDirPath}${confName}`;
      confName = `temp.${confName}`;
      break;
    case "iOS":
      confName = "wdio.ios.sauce.conf.js";
      confFilePath = `${confFileDirPath}${confName}`;
      tempConfName = `temp.${confName}`;
      break;
    case "iOS edge":
      confName = "wdio.ios.sauce.edge.conf.js";
      confFilePath = `${confFileDirPath}${confName}`;
      tempConfName = `temp.${confName}`;
      break;
    default:
      break;
  }
  const tempConfFilePath = `${confFileDirPath}${tempConfName}`;

  const testName = await askQuestionInput(
    "testName",
    "Which test?\n",
    "Invalid test"
  );
  const fs = require("fs");

  fs.readFile(confFilePath, "utf-8", function (err, data) {
    if (err) throw err;
    const newValue = testSuite.includes("Android")
      ? data.replace(/app-release-[\D\d.-]+\.apk/gim, chooseSauceLabsApp)
      : data.replace(
          /CtpIENativeApp-[\D\d.-]+\.app\.zip/gim,
          chooseSauceLabsApp
        );
    fs.writeFile(tempConfFilePath, newValue, "utf-8", function (err, data) {
      if (err) throw err;
    });
  });

  runChildProcess(
    `sh ./src/shellScripts/new.sh "cd ${process.env.PROJECT_PATH}/ie-native-app && ${process.env.PROJECT_PATH}/ie-native-app/node_modules/.bin/wdio test/conf/${tempConfName} --spec ${testName} && rm ${process.env.PROJECT_PATH}ie-native-app/test/conf/${tempConfName}"`
  );
};

(async () => {
  await runSauceLabsTest();
})();
