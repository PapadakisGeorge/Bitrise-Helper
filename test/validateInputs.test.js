const {validateInput, validateInputs} = require('../src/utils/validateInputs');
const expect = require('expect');

const {
    HAPPY_SINGLE_INPUTS,
    UNHAPPY_SINGLE_INPUTS,
    HAPPY_MULTIPLE_INPUT,
    UNHAPPY_MULTIPLE_INPUT
} = require('./mocks/validateInputs.mocks')

describe('The validate single input function both work as expected', () => {
    it('Given various correct inputs the single input function does what is supposed to do', () => {
        HAPPY_SINGLE_INPUTS.forEach((HAPPY_INPUT) => {
            expect(validateInput(HAPPY_INPUT.input, HAPPY_INPUT.desiredType)).toEqual(HAPPY_INPUT.expectedResult)
        });
    });

    it('Given various incorrect inputs the single input function does what is supposed to do', () => {
        UNHAPPY_SINGLE_INPUTS.forEach((UNHAPPY_INPUT) => {
            expect(() => validateInput(UNHAPPY_INPUT.input, UNHAPPY_INPUT.desiredType)).toThrow(UNHAPPY_INPUT.expectedResult)
        });
    });
});

describe('The validate multiple input function both work as expected', () => {
    it('Given a valid input of multiple inputs the function functions as expected', () => {
        expect(validateInputs(HAPPY_MULTIPLE_INPUT.inputs)).toEqual(HAPPY_MULTIPLE_INPUT.expectedResult)
    });

    it('Given an invalid input of multiple inputs the function functions returns the correct error', () => {
        expect(() => validateInputs(UNHAPPY_MULTIPLE_INPUT.inputs)).toThrow(UNHAPPY_MULTIPLE_INPUT.expectedResult)
    });
});