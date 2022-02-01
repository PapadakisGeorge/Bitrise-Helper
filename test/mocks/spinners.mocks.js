const validBuildParameters = (buildNumber) => {
  return {
    triggered_workflow: "A valid workflow",
    slug: "aValidSlug",
    build_number: buildNumber,
    branch: "valid branch",
  };
};

const spinnerObject = (number, status, text) => {
  let result = {};
  result[number] = {
    color: "cyan",
    succeedColor: "green",
    failColor: "red",
    spinnerColor: "greenBright",
    succeedPrefix: "✓",
    failPrefix: "✖",
    status: status,
    text: text,
  };
  return result;
};

const SPINNER_TEXT_HAPPY_PATH_INPUTS = [
  {
    build: validBuildParameters(6666),
    finishTime: "2",
    expectedResult:
      "A valid workflow workflow for valid branch (build number 6666) in progress, ETC 2 minutes.\nMore info: https://app.bitrise.io/app/af50b4926a122ad0#/builds/aValidSlug",
  },
  {
    build: validBuildParameters(6666),
    finishTime: "1",
    expectedResult:
      "A valid workflow workflow for valid branch (build number 6666) in progress, will finish soon.\nMore info: https://app.bitrise.io/app/af50b4926a122ad0#/builds/aValidSlug",
  },
  {
    build: validBuildParameters(6666),
    finishTime: "-15",
    expectedResult:
      "A valid workflow workflow for valid branch (build number 6666) in progress, but is taking to long.\nCheck if everything is alright here: https://app.bitrise.io/app/af50b4926a122ad0#/builds/aValidSlug",
  },
];

const START_SPINNER_HAPPY_PATH_INPUTS = {
  build: validBuildParameters(6666),
  finishTime: "1",
  expectedResult: spinnerObject(
    "spinner-6666",
    "spinning",
    "A valid workflow workflow for valid branch (build number 6666) in progress, will finish soon.\nMore info: https://app.bitrise.io/app/af50b4926a122ad0#/builds/aValidSlug"
  ),
};

const UPDATE_SPINNER_HAPPY_PATH_INPUTS = {
  build: validBuildParameters(6666),
  finishTime: "3",
  expectedResult: spinnerObject(
    "spinner-6666",
    "spinning",
    "A valid workflow workflow for valid branch (build number 6666) in progress, ETC 3 minutes.\nMore info: https://app.bitrise.io/app/af50b4926a122ad0#/builds/aValidSlug"
  ),
};

const STOP_SPINNER_SUCCESS = {
  build: validBuildParameters(6668),
  buildNumber: "6668",
  buildType: "A valid workflow",
  buildStatus: "1",
  buildURL: "aValidSlug",
  expectedResult: spinnerObject(
    "spinner-6668",
    "succeed",
    "A valid workflow 6668 succeeded! More info: https://app.bitrise.io/app/af50b4926a122ad0#/builds/aValidSlug"
  ),
};
const STOP_SPINNER_FAILURE = {
  build: validBuildParameters(6669),
  buildNumber: "6669",
  buildType: "A valid workflow",
  buildStatus: "2",
  buildURL: "aValidSlug",
  expectedResult: spinnerObject(
    "spinner-6669",
    "succeed",
    "A valid workflow 6669 failed! More info: https://app.bitrise.io/app/af50b4926a122ad0#/builds/aValidSlug"
  ),
};
const STOP_SPINNER_ABORTED = {
  build: validBuildParameters(66610),
  buildNumber: "66610",
  buildType: "A valid workflow",
  buildStatus: "3",
  buildURL: "aValidSlug",
  expectedResult: spinnerObject(
    "spinner-66610",
    "succeed",
    "A valid workflow 66610 was aborted! More info: https://app.bitrise.io/app/af50b4926a122ad0#/builds/aValidSlug"
  ),
};
const STOP_SPINNER_ABORTED_WITH_SUCCESS = {
  build: validBuildParameters(66611),
  buildNumber: "66611",
  buildType: "A valid workflow",
  buildStatus: "4",
  buildURL: "aValidSlug",
  expectedResult: spinnerObject(
    "spinner-66611",
    "succeed",
    "A valid workflow 66611 was aborted with success! More info: https://app.bitrise.io/app/af50b4926a122ad0#/builds/aValidSlug"
  ),
};

module.exports = {
  SPINNER_TEXT_HAPPY_PATH_INPUTS,
  START_SPINNER_HAPPY_PATH_INPUTS,
  UPDATE_SPINNER_HAPPY_PATH_INPUTS,
  STOP_SPINNER_SUCCESS,
  STOP_SPINNER_FAILURE,
  STOP_SPINNER_ABORTED,
  STOP_SPINNER_ABORTED_WITH_SUCCESS,
};
