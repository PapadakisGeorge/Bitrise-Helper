const createPayload = (branch, workflow, envVariables) => {
    try {
        return {
            "hook_info": {
                "type": "bitrise"
            },
            "build_params": {
                "branch": `${branch}`,
                "workflow_id": `${workflow}`,
                "base_repository_url": "https://github.com/camelotls/ie-native-app",
                "environments": envVariables
            }
        }
    } catch (error) {
        console.log(`Error while creating the payload: ${error.message}`);
        return error;
    }
}

module.exports ={
    createPayload
}