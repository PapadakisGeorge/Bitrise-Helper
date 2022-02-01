const { getData } = require("../bitriseAPI/dataFetcher");

/**
 * @param url The url the call will use.
 * @param branch Which branch's builds will be searched.
 * @param status The status of the workflow.
 * @returns {Promise<(*)[]>} The data of the builds and the number of builds.
 */
const getBranchData = async (url, branch, status) => {
  const rawData = await getData(url, [["status", status]]);
  const branchData = JSON.parse(rawData.body).data.filter((build) =>
    build.branch.includes(branch)
  );

  return [branchData, branchData.length];
};

/**
 * @param url The url the call will use.
 * @param workflow Which workflow's builds will be searched.
 * @param status The status of the workflow.
 * @returns {Promise<(*)[]>} The data of the builds and the number of builds.
 */
const getWorkflowData = async (url, workflow, status) => {
  const rawData = await getData(url, [
    ["workflow", workflow],
    ["status", status],
  ]);
  return JSON.parse(rawData.body).data;
};

module.exports = {
  getBranchData,
  getWorkflowData,
};
