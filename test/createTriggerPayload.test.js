const {createTriggerPayload} = require('../src/utils/createTriggerPayload');
const expect = require('expect');
const {matchers} = require('jest-json-schema');

expect.extend(matchers);

const {
    VALID_INPUTS,
    INVALID_INPUTS
} = require('./mocks/createTriggerPayload.mocks')

describe('The function that creates the payload for triggering a build works as intented', () =>{
    it('Given valid inputs the correct payload is created', () => {
        expect(createTriggerPayload(VALID_INPUTS.branch, VALID_INPUTS.workflow, VALID_INPUTS.envVariables)).toStrictEqual(VALID_INPUTS.expectedResult);
    });

    it('Given valid inputs the payload has the correct type', () => {
        expect(createTriggerPayload(VALID_INPUTS.branch, VALID_INPUTS.workflow, VALID_INPUTS.envVariables)).toMatchSchema(VALID_INPUTS.schema);
    });

    it('Given invalid inputs the function handles the error gratefully', () => {
        INVALID_INPUTS.forEach((invalidInput) => {
            expect(createTriggerPayload(invalidInput.branch, invalidInput.workflow, invalidInput.envVariables)).toEqual(invalidInput.expectedResult)
        });
    });
})
