const {
    consoleBlue,
    consoleRed, consoleGreen,
} = require('./src/utils/consoleColors');
const readline = require('readline-sync');
const {WORKFLOWS} = require('./src/model/model');

const {triggerBuild} = require("./src/bitriseAPI/triggerBuild");

const start = async () => {
    let BRANCH;
    let WORKFLOW;
    let SKIP_TESTS;
    const availableWorkflowsMatrix = Object.values(WORKFLOWS);
    while (!BRANCH) {
        BRANCH = readline.question(`Enter the branch name you want to trigger:\n`,);
        if (!BRANCH) {
            console.log(consoleRed, 'You need to specify a branch!')
        }
        while (!WORKFLOW) {
            let WORKFLOW_INPUT = readline.keyInSelect(availableWorkflowsMatrix, `Which workflow do you want to trigger?`);
            if (WORKFLOW_INPUT === -1) {
                console.log(consoleBlue, 'Aborting trigger...');
                process.exit(0)
            }
            WORKFLOW = availableWorkflowsMatrix[WORKFLOW_INPUT];
            while (!SKIP_TESTS) {
                SKIP_TESTS = readline.question(`Skip tests? (y/n):\n`, {
                    limit: ['y', 'n'],
                    limitMessage: `Type y or n!`
                });
            }
        }

        const skippingTestsText = SKIP_TESTS === 'y' ? 'Tests will be skipped' : 'Tests will run'
        console.log(consoleBlue, `Triggering ${WORKFLOW} for branch ${BRANCH}. ${skippingTestsText}`);
    }

    //Create payload
    const BITRISE_BUILDS_URL = 'https://api.bitrise.io/v0.1/apps/af50b4926a122ad0/builds';
    const payload = {
        "hook_info": {
            "type": "bitrise"
        },
        "build_params": {
            "branch": `${BRANCH}`,
            "workflow_id": `${WORKFLOW}`,
            "base_repository_url": "https://github.com/camelotls/ie-native-app",
            "environments": [
                {
                    "is_expand": true,
                    "mapped_to": "SKIP_TESTS",
                    "value": SKIP_TESTS === 'y' ? "true" : "false"
                },
            ]
        }
    }
    let response = await triggerBuild(BITRISE_BUILDS_URL, payload);
    if (response.statusCode > 201) console.log(consoleRed, 'Something went wrong, try again :(')
    else console.log(consoleGreen, `Build triggered successfully, more info: ${JSON.parse(response.body).build_url}`)
}

(async () => {
    await start();
})();
