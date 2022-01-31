const SPINNER_TEXT_HAPPY_PATH_INPUTS = [
  {
    build: {
      triggered_workflow: "A valid workflow",
      slug: "aValidSlug",
      build_number: "6666",
      branch: "valid branch",
    },
    finishTime: "2",
    expectedResult:
      "A valid workflow workflow for valid branch (build number 6666) in progress, ETC 2 minutes.\nMore info: https://app.bitrise.io/app/af50b4926a122ad0#/builds/aValidSlug",
  },
  {
    build: {
      triggered_workflow: "A valid workflow",
      slug: "aValidSlug",
      build_number: "6666",
      branch: "valid branch",
    },
    finishTime: "1",
    expectedResult:
      "A valid workflow workflow for valid branch (build number 6666) in progress, will finish soon.\nMore info: https://app.bitrise.io/app/af50b4926a122ad0#/builds/aValidSlug",
  },
  {
    build: {
      triggered_workflow: "A valid workflow",
      slug: "aValidSlug",
      build_number: "6666",
      branch: "valid branch",
    },
    finishTime: "-15",
    expectedResult:
      "A valid workflow workflow for valid branch (build number 6666) in progress, but is taking to long.\nCheck if everything is alright here: https://app.bitrise.io/app/af50b4926a122ad0#/builds/aValidSlug",
  },
];

const START_SPINNER_HAPPY_PATH_INPUTS = {
  build: {
    triggered_workflow: "A valid workflow",
    slug: "aValidSlug",
    build_number: "6666",
    branch: "valid branch",
  },
  finishTime: "1",
  expectedResult: {
    "spinner-6666": {
      color: "cyan",
      succeedColor: "green",
      failColor: "red",
      spinnerColor: "greenBright",
      succeedPrefix: "✓",
      failPrefix: "✖",
      status: "spinning",
      text: "A valid workflow workflow for valid branch (build number 6666) in progress, will finish soon.\nMore info: https://app.bitrise.io/app/af50b4926a122ad0#/builds/aValidSlug",
    },
  },
};

const UPDATE_SPINNER_HAPPY_PATH_INPUTS = {
  build: {
    triggered_workflow: "A valid workflow",
    slug: "aValidSlug",
    build_number: "6666",
    branch: "valid branch",
  },
  finishTime: "3",
  expectedResult: {
    "spinner-6666": {
      color: "cyan",
      succeedColor: "green",
      failColor: "red",
      spinnerColor: "greenBright",
      succeedPrefix: "✓",
      failPrefix: "✖",
      status: "spinning",
      text: "A valid workflow workflow for valid branch (build number 6666) in progress, ETC 3 minutes.\nMore info: https://app.bitrise.io/app/af50b4926a122ad0#/builds/aValidSlug",
    },
  },
};

const STOP_SPINNER_SUCCESS = {
  build: {
    triggered_workflow: "A valid workflow",
    slug: "aValidSlug",
    build_number: "6668",
    branch: "valid branch",
  },
  buildNumber: "6668",
  buildType: "A valid workflow",
  buildStatus: "1",
  buildURL: "aValidSlug",
  expectedResult: {
    "spinner-6668": {
      color: "cyan",
      succeedColor: "green",
      failColor: "red",
      spinnerColor: "greenBright",
      succeedPrefix: "✓",
      failPrefix: "✖",
      status: "succeed",
      text: "A valid workflow 6668 succeeded! More info: https://app.bitrise.io/app/af50b4926a122ad0#/builds/aValidSlug",
    },
  },
};
const STOP_SPINNER_FAILURE = {
  build: {
    triggered_workflow: "A valid workflow",
    slug: "aValidSlug",
    build_number: "6669",
    branch: "valid branch",
  },
  buildNumber: "6669",
  buildType: "A valid workflow",
  buildStatus: "2",
  buildURL: "aValidSlug",
  expectedResult: {
    "spinner-6669": {
      color: "cyan",
      failColor: "red",
      spinnerColor: "greenBright",
      status: "succeed",
      succeedColor: "green",
      succeedPrefix: "✓",
      failPrefix: "✖",
      text: "A valid workflow 6669 failed! More info: https://app.bitrise.io/app/af50b4926a122ad0#/builds/aValidSlug",
    },
  },
};
const STOP_SPINNER_ABORTED = {
  build: {
    triggered_workflow: "A valid workflow",
    slug: "aValidSlug",
    build_number: "66610",
    branch: "valid branch",
  },
  buildNumber: "66610",
  buildType: "A valid workflow",
  buildStatus: "3",
  buildURL: "aValidSlug",
  expectedResult: {
    "spinner-66610": {
      color: "cyan",
      succeedColor: "green",
      failColor: "red",
      spinnerColor: "greenBright",
      succeedPrefix: "✓",
      failPrefix: "✖",
      status: "succeed",
      text: "A valid workflow 66610 was aborted! More info: https://app.bitrise.io/app/af50b4926a122ad0#/builds/aValidSlug",
    },
  },
};
const STOP_SPINNER_ABORTED_WITH_SUCCESS = {
  build: {
    triggered_workflow: "A valid workflow",
    slug: "aValidSlug",
    build_number: "66611",
    branch: "valid branch",
  },
  buildNumber: "66611",
  buildType: "A valid workflow",
  buildStatus: "4",
  buildURL: "aValidSlug",
  expectedResult: {
    "spinner-66611": {
      color: "cyan",
      succeedColor: "green",
      failColor: "red",
      spinnerColor: "greenBright",
      succeedPrefix: "✓",
      failPrefix: "✖",
      status: "succeed",
      text: "A valid workflow 66611 was aborted with success! More info: https://app.bitrise.io/app/af50b4926a122ad0#/builds/aValidSlug",
    },
  },
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
