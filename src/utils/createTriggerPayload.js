const { validateInputs } = require("./validateInputs");

/**
 *
 * @param branch Branch name, type should be string.
 * @param workflow Workflow name, type should be string.
 * @param envVariables Environmental variables the build will use, type should be an array.
 * @returns {{build_params: {base_repository_url: string, workflow_id: string, environments, branch: string}, hook_info: {type: string}}|*} Returns a valid payload.
 */
const createTriggerPayload = (branch, workflow, envVariables) => {
  validateInputs([
    { value: branch, desiredType: "string" },
    { value: workflow, desiredType: "string" },
    { value: envVariables, desiredType: "array" },
  ]);
  return {
    hook_info: {
      type: "bitrise",
    },
    build_params: {
      branch: `${branch}`,
      workflow_id: `${workflow}`,
      base_repository_url: "https://github.com/camelotls/ie-native-app",
      environments: envVariables,
    },
  };
};

module.exports = {
  createTriggerPayload,
};
