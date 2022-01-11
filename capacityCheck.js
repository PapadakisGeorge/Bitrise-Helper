const {
    consoleGreen,
    consoleRed,
    consoleCyan
} = require('./src/utils/consoleColors');
const readline = require('readline-sync');
const _ = require('lodash');

const {forEach} = require('p-iteration');
const {getBuildAverageRunTime, approximateFinish} = require('./src/utils/runTime');
const {getData} = require('./src/bitriseAPI/dataFetcher');

const start = async () => {
    //Control input.
    const availableWorkflowsMatrix = ['Workflow_Android', 'Workflow_IOS', 'Workflow_Android_Edge', 'Workflow_IOS_Edge'];
    let availableWorkflows = '';
    availableWorkflowsMatrix.forEach((workflow, index) => availableWorkflows = index === availableWorkflowsMatrix.length - 1 ? availableWorkflows.concat(`${workflow}`) : availableWorkflows.concat(`${workflow}, `));
    const workflow = readline.question(`Choose one or more of the following workflows you wish to trigger: ${availableWorkflows}\n`, {
        limit: availableWorkflowsMatrix,
        limitMessage: `Not a valid workflow! Available workflows are: ${availableWorkflows}`
    });
    // const details = readline.question('Want to see details? y/n\n', {
    //     limit: ['y', 'n'],
    //     limitMessage: 'Please type y or n'
    // });

// Start the actual work.
    let workflowData = {}

    const reservedSessions = {
        Workflow_Android: 15,
        Workflow_IOS: 20,
        Workflow_Android_Edge: 10,
        Workflow_IOS_Edge: 30,
        Execute_Android_Tests: 15,
        Execute_Android_Edge_Tests: 10,
        Execute_IOS_Tests: 20,
        Execute_IOS_Edge_Suite_1_Tests: 15,
        Execute_IOS_Edge_Suite_2_Tests: 15,
    }

    const BITRISE_BUILDS_URL = 'https://api.bitrise.io/v0.1/apps/af50b4926a122ad0/builds';
    const SESSIONS_LIMIT = '70';

    const getTimeAndReservedSessions = async (workflow) => {
        const approximateTriggerTime = await getBuildAverageRunTime(workflow);
        workflowData[workflow] = {
            approximateTriggerTime: approximateTriggerTime,
            reservedSessions: reservedSessions[workflow]
        };
    }
//Get builds that are currently running, in how much time will the build end, and return the number of sessions will use when my builds will start.

    let occupiedSessions = 0;

    const buildsRunningRawData = await getData(BITRISE_BUILDS_URL, [['status', 0]]);
    const buildsRunning = JSON.parse(buildsRunningRawData.body).data;
    const filteredBuilds = buildsRunning.filter((build) => Object.keys(reservedSessions).includes(build.triggered_workflow));

    await forEach(filteredBuilds, async (build) => await getTimeAndReservedSessions(build.triggered_workflow));

//Get the average time of the builds the user wants to run and how many sessions should they use.
    let buildsThatAffect = {};
    const saveBuildData = (build, approximateEndTime) => {
        buildsThatAffect[`${build.build_number}`] = {
            sessions: workflowData[build.triggered_workflow].reservedSessions,
            buildName: build.triggered_workflow,
            finishTime: approximateEndTime,
        };
    }

    const checkIfSkipTestsWasUsed = (build) => {
        if (!Object.keys(build).includes('original_build_params')) {
            return false
        }
        if ('environments' in build.original_build_params) {
            build.original_build_params.environments.forEach((envVar) => {
                if (envVar.key === 'SKIP_TESTS' && envVar.value === 'true') {
                    return true
                }
            });
        } else {
            return false
        }
    }
    await getTimeAndReservedSessions(workflow);
    await forEach(filteredBuilds, async (build) => {
        const buildName = build.triggered_workflow;
        const approximateEndTime = await approximateFinish(build.triggered_at, buildName);
        if (buildName.includes('Execute') && Number(approximateEndTime) > Number(workflowData[workflow].approximateTriggerTime)) {
            occupiedSessions += workflowData[buildName].reservedSessions;
            saveBuildData(build, approximateEndTime);
        } else if (buildName.includes('Workflow')) {
            if (!checkIfSkipTestsWasUsed(build)) {
                occupiedSessions += Number(workflowData[buildName].reservedSessions);
                saveBuildData(build, approximateEndTime);
            }
        }
    });
    Object.keys(buildsThatAffect).forEach((buildNumber) => {
        const buildName = buildsThatAffect[buildNumber].buildName;
        const reserveTense = buildName.includes('Execute') ? 'reserves' : 'will reserve';
        console.log(consoleCyan, `${buildsThatAffect[buildNumber].buildName} with build number ${buildNumber} ${reserveTense} ${buildsThatAffect[buildNumber].sessions} sessions and will end in about ${buildsThatAffect[buildNumber].finishTime} minutes.`);
    });

    if (occupiedSessions + Number(workflowData[workflow].reservedSessions) > SESSIONS_LIMIT) console.log(consoleRed, `Workflow ${workflow} should not be triggered at the moment :( Estimated sessions (with your build) ${occupiedSessions + Number(workflowData[workflow].reservedSessions)}`);
    else console.log(consoleGreen, `${workflow} can be triggered!!!`);
}

(async () => {
    await start();
})();