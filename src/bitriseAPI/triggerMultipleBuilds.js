const {consoleRed, consoleGreen} = require('../utils/consoleColors');
const {createPayload} = require("../utils/createPayload");
const {triggerBuild} = require("./triggerBuild");


/**
 * @param builds A list with each builds' desired branch, workflow and environmental variables.
 */
const triggerBuildMultipleBuilds = async (builds) => {
    for (const build of builds) {
        const [branch, workflow, envVariables] = build;
        const payload = createPayload(branch, workflow, envVariables);
        let response = await triggerBuild(payload);

        if (response.statusCode > 201) console.log(consoleRed, 'Something went wrong, try again :(')
        else console.log(consoleGreen, `Build triggered successfully, more info: ${JSON.parse(response.body).build_url}`);
    }
}


module.exports = {
    triggerBuildMultipleBuilds
}