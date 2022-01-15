const {consoleRed, consoleGreen} = require('../model/model');
const {createTriggerPayload} = require("../utils/createTriggerPayload");
const {triggerBuild} = require("./triggerBuild");


/**
 * @param builds A list with each builds' desired branch, workflow and environmental variables.
 */
const triggerMultipleBuilds = async (builds) => {
    for (const build of builds) {
        const [branch, workflow, envVariables] = build;
        const payload = createTriggerPayload(branch, workflow, envVariables);
        let response = await triggerBuild(payload);

        if (response.statusCode > 201) console.log(consoleRed, 'Something went wrong, try again :(')
        else console.log(consoleGreen, `Build triggered successfully, more info: ${JSON.parse(response.body).build_url}`);
    }
}


module.exports = {
    triggerMultipleBuilds
}