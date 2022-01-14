const readline = require('readline-sync');
const {
    consoleBlue,
    consoleRed, consoleGreen,
} = require('../utils/consoleColors');
const {WORKFLOWS, YES_NO_OPTIONS, YES_OPTIONS, NO_OPTIONS} = require('../model/model');

const {triggerBuild} = require("./triggerBuild");
const {watcherStart} = require("./watcherStart");
const {createTriggerPayload} = require("../utils/createTriggerPayload");

const triggerStart = async (initialWorkflow = '') => {
    let BRANCH;
    let WORKFLOW = initialWorkflow;
    let SKIP_TESTS;
    const availableWorkflowsMatrix = Object.values(WORKFLOWS);
    while (!BRANCH) {
        BRANCH = readline.question(`Enter the branch name you want to trigger:\n`,);
        if (!BRANCH) {
            console.log(consoleRed, 'You need to specify a branch!')
        }
        if (!initialWorkflow) {
            while (!WORKFLOW) {
                let WORKFLOW_INPUT = readline.keyInSelect(availableWorkflowsMatrix, `Which workflow do you want to trigger?`);
                if (WORKFLOW_INPUT === -1) {
                    console.log(consoleBlue, 'Aborting trigger...');
                    process.exit(0)
                }
                WORKFLOW = availableWorkflowsMatrix[WORKFLOW_INPUT];
            }
        }
        while (!SKIP_TESTS) {
            SKIP_TESTS = readline.question(`Skip tests? (y/n):\n`, {
                limit: YES_NO_OPTIONS,
                limitMessage: `Type y or n!`
            });
        }


        const skippingTestsText = YES_OPTIONS.includes(SKIP_TESTS) ? 'Tests will be skipped' : 'Tests will run'
        console.log(consoleBlue, `Triggering ${WORKFLOW} for branch ${BRANCH}. ${skippingTestsText}`);
    }

    const envVariables = [
        {
            "is_expand": true,
            "mapped_to": "SKIP_TESTS",
            "value": YES_OPTIONS.includes(SKIP_TESTS) ? "true" : "false"
        },
    ]
    const payload = createTriggerPayload(BRANCH, WORKFLOW, envVariables);

    let response = await triggerBuild(payload);
    if
    (response.statusCode > 201
    ) {
        console.log(consoleRed, 'Something went wrong, try again :(')
    } else {
        console.log(consoleGreen, `Build triggered successfully, more info: ${JSON.parse(response.body).build_url}`);
        let shouldWatchBuilds;
        while (!shouldWatchBuilds) {
            shouldWatchBuilds = readline.question(`Would you like to watch the build? (y/n):\n`, {
                limit: YES_NO_OPTIONS,
                limitMessage: `Type y or n!`
            });
        }

        if (NO_OPTIONS.includes(shouldWatchBuilds)) {
            process.exit(0);
        } else if (YES_OPTIONS.includes(shouldWatchBuilds)) {
            await watcherStart(BRANCH)
        }
    }
}

module.exports = {
    triggerStart
}
