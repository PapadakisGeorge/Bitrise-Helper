const { validateInputs } = require("./validateInputs");

/**
 *
 * @param branchName Branch name, type should be string.
 * @param workflow Workflow name, type should be string.
 * @param envVariables Environmental variables the build will use, type should be array.
 * @param message Message that will be displayed on Bitrise UI, type should be string.
 * @returns {{build_params: {base_repository_url: string, workflow_id: string, environments, branch: string}, hook_info: {type: string}}|*} Returns a valid payload.
 */
const createTriggerPayload = (
  branchName,
  workflow,
  envVariables,
  message = ""
) => {
  validateInputs([
    { value: branchName, desiredType: "string" },
    { value: workflow, desiredType: "string" },
    { value: envVariables, desiredType: "array" },
    { value: message, desiredType: "string" },
  ]);
  return {
    hook_info: {
      type: "bitrise",
    },
    build_params: {
      branch: branchName,
      commit_message: message,
      workflow_id: workflow,
      base_repository_url: "https://github.com/camelotls/ie-native-app",
      environments: envVariables,
    },
  };
};

module.exports = {
  createTriggerPayload,
};
