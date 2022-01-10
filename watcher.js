const {getData} = require('./src/bitriseAPI/dataFetcher');
const {getBranchData} = require('./src/utils/branchData');
const {
    stopSpinner,
    updateSpinnerText,
    startSpinner
} = require('./src/utils/spinners');
const {
    ConsoleBlue,
    ConsoleYellow,
    ConsoleRed,
    ConsoleGreen
} = require('./src/utils/consoleColors');
const readline = require('readline-sync');

const {forEach} = require('p-iteration');
const Spinners = require('spinnies');
const cron = require('node-cron');
const _ = require('lodash');
const {shellExec} = require("./src/utils/shellCommand");

const start = async () => {
    // const BRANCH = process.argv[2];
    const BRANCH = readline.question(`Enter the branch name you want to watch:\n`)
    const BITRISE_BUILDS_URL = 'https://api.bitrise.io/v0.1/apps/af50b4926a122ad0/builds';

    if (BRANCH) {
        console.log(ConsoleBlue, `Getting builds on Bitrise of ${BRANCH} currently running...`);

        //Get data for running builds when the script is initiated
        let [buildData, totalBuilds] = await getBranchData(BITRISE_BUILDS_URL, BRANCH, 0);

        if (totalBuilds === 0) {
            console.log(ConsoleYellow, `No builds of ${BRANCH} branch detected.`);
            process.exit(0);
        } else {

            if (totalBuilds === 1) console.log(ConsoleGreen, `Build detected!`);
            else console.log(ConsoleGreen, `Builds detected!`);

            const spinners = new Spinners();
            let currentBuilds = {}

            const checkIfNewSpinnerIsNeeded = (build) => {
                const buildNumber = build.build_number;
                const buildPartialURL = build.slug
                if (!(`${buildPartialURL}` in currentBuilds)) {
                    currentBuilds[`${buildNumber}`] = buildPartialURL;
                    startSpinner(build, spinners)
                }
            }

            //Initialise the spinners of the detected builds.
            await forEach(buildData, async (build) => checkIfNewSpinnerIsNeeded(build));

            //Once per minute check for the status of the builds.
            cron.schedule('* * * * *', async function () {

                //Get the data of running builds and handle the spinners.
                [buildData, totalBuilds] = await getBranchData(BITRISE_BUILDS_URL, BRANCH, 0);
                await forEach(buildData, async (build) => checkIfNewSpinnerIsNeeded(build));

                await forEach(Object.keys(currentBuilds), async (buildNumber) => {
                    const rawData = await getData(BITRISE_BUILDS_URL,
                        [
                            ['build_number', `${buildNumber}`],
                            ['status', 0]
                        ]
                    );
                    const buildData = JSON.parse(rawData.body).data;

                    if (buildData.length === 0) {
                        const buildURL = currentBuilds[`${buildNumber}`];
                        stopSpinner(buildNumber, buildURL, spinners);
                        // shellExec('osascript -e "display notification \\"Build finished!\\" with title \\"BITRISE BUILD WITH NUMBER ${buildNumber}\\""');
                        // shellExec('say Build ${buildNumber} finished!');
                        delete currentBuilds[`${buildNumber}`];
                    } else {
                        updateSpinnerText( buildData[0], spinners);
                    }
                });

                //If no builds are running the currentBuilds object should be empty and the program to stop.
                if (_.isEmpty(currentBuilds)) {
                    process.exit(0);
                }
            });

        }
    } else {
        console.log(ConsoleRed, 'No branch specified :(');
        process.exit(1);
    }
}

(async () => {
    await start();
})();