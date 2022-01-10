const buildTypeAverageRunTime = {
    'Workflow_Android': 25,
    'Execute_Android_Tests': 30,
    'Workflow_IOS': 30,
    'Execute_IOS_Tests': 40,
    'Workflow_Android_Edge': 30,
    'Execute_Android_Edge_Tests': 25,
    'Workflow_IOS_Edge': 30,
    'Execute_IOS_Edge_Suite_1_Tests': 40,
    'Execute_IOS_Edge_Suite_2_Tests': 40,
    'Workflow_Unit_Tests': 25,
}

/**
 * @param triggerTime The time the build was triggered.
 * @returns {number} How many minutes the build has been running.
 */
const runTime = (triggerTime) => {
    const currentDate = new Date();
    const triggerTimeFormatted = new Date(triggerTime);
    return Math.trunc((currentDate.getTime() - triggerTimeFormatted.getTime())/60000);
};

/**
 * @param triggerTime The time the build was triggered.
 * @param buildType The type of the build.
 * @returns {number} How many minutes are remaining for the build to end.
 */
const approximateFinish = (triggerTime, buildType) => {
    return buildTypeAverageRunTime[`${buildType}`] - runTime(triggerTime);
}

module.exports = {
    runTime,
    approximateFinish
}