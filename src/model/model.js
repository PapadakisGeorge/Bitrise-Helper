const WORKFLOWS = {
  WORKFLOW_ANDROID: "Workflow_Android",
  WORKFLOW_IOS: "Workflow_IOS",
  WORKFLOW_ANDROID_EDGE: "Workflow_Android_Edge",
  WORKFLOW_IOS_EDGE: "Workflow_IOS_Edge",
};

const YES_OPTIONS = ["yes", "Yes", "YES", "Y", "y"];
const NO_OPTIONS = ["no", "No", "NO", "N", "n"];
const YES_NO_OPTIONS = [...YES_OPTIONS, ...NO_OPTIONS];

const RESERVED_SESSIONS = Object.freeze({
  Workflow_Android: 15,
  Workflow_IOS: 20,
  Workflow_Android_Edge: 10,
  Workflow_IOS_Edge: 30,
  Execute_Android_Tests: 15,
  Execute_Android_Edge_Tests: 10,
  Execute_IOS_Tests: 20,
  Execute_IOS_Edge_Suite_1_Tests: 15,
  Execute_IOS_Edge_Suite_2_Tests: 15,
});
const TEST_SUITES = [
  "regression",
  "smoke",
  "dbg",
  "iwg",
  "cms",
  "login",
  "checkNumbers",
  "errorHandling",
  "registration",
  "withdrawFunds",
  "screenshots",
  "spendingLimits",
  "schedulePlay",
];

const RESERVED_SESSIONS = {
  Workflow_Android: 15,
  Workflow_IOS: 20,
  Workflow_Android_Edge: 10,
  Workflow_IOS_Edge: 30,
  Execute_Android_Tests: 15,
  Execute_Android_Edge_Tests: 10,
  Execute_IOS_Tests: 20,
  Execute_IOS_Edge_Suite_1_Tests: 15,
  Execute_IOS_Edge_Suite_2_Tests: 15,
};

const STATUSES = Object.freeze({
  running: 0,
  successful: 1,
  failed: 2,
  "aborted with failure": 3,
  "aborted with success": 4,
});

module.exports = {
  WORKFLOWS,
  YES_OPTIONS,
  NO_OPTIONS,
  YES_NO_OPTIONS,
  STATUSES,
  RESERVED_SESSIONS,
  TEST_SUITES,
};
