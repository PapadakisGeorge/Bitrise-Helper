const {getWorkflowData} = require('../utils/getDataWithOptions');
const {forEach} = require("p-iteration");

const BITRISE_BUILDS_URL = `https://api.bitrise.io/v0.1/apps/${process.env.APP_SLUG}/builds`;

/**
 *
 * @param buildType The name of the workflow the average run time we are looking for.
 * @returns {Promise<number>} The average run time in minutes
 */
const getBuildAverageRunTime = async (buildType) => {
    const data = await getWorkflowData(BITRISE_BUILDS_URL, buildType, 1);
    let sumOfTimes = 0;
    await forEach(data, async (build) => {
        const startTime = new Date(build.triggered_at);
        const finishTime = new Date(build.finished_at);
        sumOfTimes += finishTime - startTime
    });
    return Math.trunc(sumOfTimes / (data.length * 60000));
}

/**
 * @param triggerTime The time the build was triggered.
 * @returns {number} How many minutes the build has been running.
 */
const runTime = (triggerTime) => {
    const currentDate = new Date();
    const triggerTimeFormatted = new Date(triggerTime);
    return Math.trunc((currentDate.getTime() - triggerTimeFormatted.getTime()) / 60000);
};

/**
 * @param triggerTime The time the build was triggered.
 * @param buildType The type of the build.
 * @returns {number} How many minutes are remaining for the build to end.
 */
const approximateFinish = async (triggerTime, buildType) => {
    const averageRunTime = await getBuildAverageRunTime(buildType);
    return averageRunTime - runTime(triggerTime);
}

module.exports = {
    runTime,
    approximateFinish,
    getBuildAverageRunTime
}