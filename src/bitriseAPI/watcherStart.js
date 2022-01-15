const {getData} = require('./dataFetcher');
const {getBranchData} = require('../utils/getDataWithOptions');
const {
    stopSpinner,
    updateSpinnerText,
    startSpinner
} = require('../utils/spinners');
const {
    consoleBlue,
    consoleYellow,
    consoleRed,
    consoleGreen
} = require('../model/model');
const readline = require('readline-sync');

const {forEach} = require('p-iteration');
const Spinners = require('spinnies');
const cron = require('node-cron');
const _ = require('lodash');
const {shellExec} = require('../utils/shellCommand');
const {approximateFinish} = require('../utils/runTime');

const watcherStart = async (initialBranch = '') => {
    let BRANCH = initialBranch;
    while (!BRANCH) {
        BRANCH = readline.question(`Enter the branch name you want to watch:\n`,);
        if (!BRANCH) {
            console.log(consoleRed, 'You need to specify a branch!')
        }
    }

    console.log(consoleBlue, `Getting builds on Bitrise of ${BRANCH} currently running...`);

    //Get data for running builds when the script is initiated
    const BITRISE_BUILDS_URL = 'https://api.bitrise.io/v0.1/apps/af50b4926a122ad0/builds';
    let [buildData, totalBuilds] = await getBranchData(BITRISE_BUILDS_URL, BRANCH, 0);

    if (totalBuilds === 0) {
        console.log(consoleYellow, `No builds of ${BRANCH} branch detected.`);
        process.exit(0);
    } else {
        if (totalBuilds === 1) console.log(consoleGreen, `Build detected!`);
        else console.log(consoleGreen, `Builds detected!`);

        const spinners = new Spinners();
        let currentBuilds = {}

        const checkIfNewSpinnerIsNeeded = async (build) => {
            const buildNumber = build.build_number;
            if (!(buildNumber in currentBuilds)) {

                const finishTime = await approximateFinish(build.triggered_at, build.triggered_workflow);
                currentBuilds[buildNumber] = {};
                currentBuilds[buildNumber].url = build.slug;
                currentBuilds[buildNumber].finishTime = finishTime;
                startSpinner(build, finishTime, spinners);
            }
        }

        //Initialise the spinners of the detected builds.
        await forEach(buildData, async (build) => await checkIfNewSpinnerIsNeeded(build));

        //Once per minute check for the status of the builds.
        cron.schedule('* * * * *', async function () {
            await forEach(Object.keys(currentBuilds), async (buildNumber) => {
                const rawData = await getData(BITRISE_BUILDS_URL,
                    [
                        ['build_number', buildNumber]
                    ]
                );
                const buildData = JSON.parse(rawData.body).data[0];

                if (buildData.status !== 0) {
                    const buildURL = currentBuilds[buildNumber].url;
                    stopSpinner(buildNumber, buildData.triggered_workflow, buildData.status, buildURL, spinners);
                    delete currentBuilds[buildNumber];
                    shellExec('osascript -e "display notification \\"Build finished!\\" with title \\"BITRISE BUILD\\""');
                    shellExec('say Builds finished!');
                } else {
                    const finishTime = currentBuilds[buildNumber].finishTime - 1;
                    currentBuilds[buildNumber].finishTime = finishTime;
                    updateSpinnerText(buildData, finishTime, spinners);
                }
            });

            //If no builds are running the currentBuilds object should be empty and the program to stop.
            if (_.isEmpty(currentBuilds)) {
                process.exit(0);
            }

            //Get the data of running builds and handle the spinners.
            [buildData, totalBuilds] = await getBranchData(BITRISE_BUILDS_URL, BRANCH, 0);
            await forEach(buildData, async (build) => await checkIfNewSpinnerIsNeeded(build));
        });
    }
}

module.exports = {
    watcherStart
}
