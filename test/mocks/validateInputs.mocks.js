const {ValidationError} = require('../../src/utils/validateInputs');

const HAPPY_SINGLE_INPUTS = [
    {
        input: 'a string',
        desiredType: 'string',
        expectedResult: undefined
    },
    {
        input: ['value1', 'value2'],
        desiredType: 'array',
        expectedResult: undefined
    },
    {
        input: {properties: ''},
        desiredType: 'object',
        expectedResult: undefined
    },
    {
        input: 1,
        desiredType: 'number',
        expectedResult: undefined
    },
];


const UNHAPPY_SINGLE_INPUTS = [
    {
        input: 'value is string',
        desiredType: 'array',
        expectedResult: new ValidationError(`\nInput: value is string\nType: not array`)
    },
    {
        input: ['value1 of array', 'value2 of array'],
        desiredType: 'number',
        expectedResult: new ValidationError(`\nInput: value1 of array,value2 of array\nType: not number`)
    },
    {
        input: 1,
        desiredType: 'string',
        expectedResult: new ValidationError(`\nInput: 1\nType: not string`)
    },
];

const HAPPY_MULTIPLE_INPUT = {
    inputs: [
        {value: 'string', desiredType: 'string'},
        {value: 1, desiredType: 'number'},
        {value: ['value1', 'value2'], desiredType: 'array'}
    ],
    expectedResult: undefined
};

const UNHAPPY_MULTIPLE_INPUT = {
    inputs: [
        {value: 'value is string', desiredType: 'array'},
        {value: 1, desiredType: 'number'},
        {value: ['value1', 'value2'], desiredType: 'array'}
    ],
    expectedResult: new ValidationError(`\nInput: value is string\nType: not array`)
};

module.exports = {
    HAPPY_SINGLE_INPUTS,
    UNHAPPY_SINGLE_INPUTS,
    HAPPY_MULTIPLE_INPUT,
    UNHAPPY_MULTIPLE_INPUT
}