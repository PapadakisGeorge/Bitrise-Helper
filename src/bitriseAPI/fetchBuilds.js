const {getBranchData} = require('../utils/getDataWithOptions');
const {
    consoleBlue,
    consoleYellow,
    consoleRed,
    consoleGreen
} = require('../utils/consoleColors');
const readline = require('readline-sync');

const { STATUSES } = require('../model/model');

const BITRISE_BUILDS_URL = 'https://api.bitrise.io/v0.1/apps/af50b4926a122ad0/builds';

const fetchActiveBuilds = () => fetchBranchBuilds({ initialStatus: 0 })

const fetchBranchBuilds = async ({initialBranch, initialStatus = ''}) => {
    let status= initialStatus;
    let branch = initialBranch;
    while (!branch) {
        branch = readline.question(`Enter the branch name you want build for:\n`,);
        if (!branch) {
            console.log(consoleRed, 'You need to specify a branch!')
        }
    }

    while (typeof status !== "number") {
        let statusInput = readline.keyInSelect(Object.keys(STATUSES), `Which build status do you want to fetch?`);
        if (statusInput === -1) {
            console.log(consoleBlue, 'Aborting fetch...');
            process.exit(0)
        }

        status = STATUSES[Object.keys(STATUSES)[statusInput]];
    }

    console.log(consoleBlue, `Getting builds on Bitrise of ${branch}...`);
    let [buildData, totalBuilds] = await getBranchData(BITRISE_BUILDS_URL, branch, status);

    if (totalBuilds === 0) {
        console.log(consoleYellow, `No builds of ${branch} branch detected.`);
    } else {
        return buildData.map((build) => ({buildNumber: build.build_number, buildSlug: build.slug}) );
    }
}

module.exports = {
    fetchActiveBuilds
}
