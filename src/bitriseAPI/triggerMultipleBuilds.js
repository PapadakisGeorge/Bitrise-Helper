const {CONSOLE_RED, CONSOLE_GREEN} = require('../model/model');
const {createTriggerPayload} = require("../utils/createTriggerPayload");
const {triggerBuild} = require("./triggerBuild");
const {forEach} = require("p-iteration");


/**
 * @param builds A list with each builds' desired branch, workflow and environmental variables.
 */
const triggerMultipleBuilds = async (builds) => {
    await forEach(
        builds,
        async (build) => {
            const [branch, workflow, envVariables] = build;
            const payload = createTriggerPayload(branch, workflow, envVariables);
            let response = await triggerBuild(payload);

            if (response.statusCode > 299) console.log(CONSOLE_RED, 'Something went wrong, try again :(')
            else console.log(CONSOLE_GREEN, `Build triggered successfully, more info: ${JSON.parse(response.body).build_url}`);
        });
}


module.exports = {
    triggerMultipleBuilds
}