const {createTriggerPayload} = require('../src/utils/createTriggerPayload');
const expect = require('expect');
const {
    VALID_INPUTS,
    INVALID_INPUTS
} = require('./mocks/createTriggerPayload.mocks')

test('Given valid inputs the correct payload is created', () => {
    expect(createTriggerPayload(VALID_INPUTS.branch, VALID_INPUTS.workflow, VALID_INPUTS.envVariables)).toStrictEqual(VALID_INPUTS.expectedResult);
});

test('Given invalid inputs the function handles the error gratefully', () => {
    INVALID_INPUTS.forEach((invalidInput) => {
        expect(createTriggerPayload(invalidInput.branch, invalidInput.workflow, invalidInput.envVariables)).toEqual(invalidInput.expectedResult)
    });
});