const {ValidationError} = require('../../src/utils/validateInputs');

const VALID_INPUTS = {
    branch: 'Valid branch input',
    workflow: 'Valid workflow input',
    envVariables: ['Valid workflow env variable 1', 'Valid workflow env variable 2'],
    expectedResult: {
        "hook_info": {
            "type": "bitrise"
        },
        "build_params": {
            "branch": "Valid branch input",
            "workflow_id": "Valid workflow input",
            "base_repository_url": "https://github.com/camelotls/ie-native-app",
            "environments": ['Valid workflow env variable 1', 'Valid workflow env variable 2']
        }
    },
    schema: {
        type: 'object',
        properties: {
            hook_info: {
                type: 'object',
                properties: {
                    type: {
                        type: 'string',

                    }
                }
            },
            build_params: {
                type: 'object',
                properties: {
                    branch: {
                        type: 'string'
                    },
                    workflow_id: {
                        type: 'string'
                    },
                    base_repository_url: {
                        type: 'string'
                    },
                    environments: {
                        type: 'array',
                        items: {
                            type: 'string'
                        }
                    },
                }
            }
        }
    }
}


const INVALID_INPUTS = [{
    branch: 'Valid branch input',
    workflow: 'Valid workflow input',
    envVariables: 'String is an invalid input',
    expectedResult: new ValidationError(`\nInput: String is an invalid input\nType: not array`)
}, {
    branch: ['Array is an invalid input'],
    workflow: 'Valid workflow input',
    envVariables: ['Array is valid'],
    expectedResult: new ValidationError(`\nInput: Array is an invalid input\nType: not string`)
}, {

    branch: 'Valid branch input',
    workflow: 1,
    envVariables: ['Array is valid'],
    expectedResult: new ValidationError(`\nInput: 1\nType: not string`)
}
]

module.exports = {
    VALID_INPUTS,
    INVALID_INPUTS
}