const {
    spinnerText,
    stopSpinner,
    updateSpinnerText,
    startSpinner
} = require('../src/utils/spinners');
const expect = require('expect');
const Spinners = require("spinnies");

const {
    SPINNER_TEXT_HAPPY_PATH_INPUTS,
    START_SPINNER_HAPPY_PATH_INPUTS,
    UPDATE_SPINNER_HAPPY_PATH_INPUTS,
    STOP_SPINNER_SUCCESS,
    STOP_SPINNER_FAILURE,
    STOP_SPINNER_ABORTED,
    STOP_SPINNER_ABORTED_WITH_SUCCESS
} = require('./mocks/spinners.mocks')


const spinner = new Spinners();


afterAll(() => spinner.stopAll());

describe('The spinner text function works as expected', () => {
    it('For various finish times I get the expected text', () => {
        SPINNER_TEXT_HAPPY_PATH_INPUTS.forEach((HAPPY_INPUT) => expect(spinnerText(HAPPY_INPUT.build, HAPPY_INPUT.finishTime)).toEqual(HAPPY_INPUT.expectedResult))
    });
});

describe('The start spinner function works as expected', () => {
    it('Starting a spinner adds the spinner to the Spinner object', () => {
        startSpinner(START_SPINNER_HAPPY_PATH_INPUTS.build, START_SPINNER_HAPPY_PATH_INPUTS.finishTime, spinner);
        expect(spinner.spinners).toStrictEqual(START_SPINNER_HAPPY_PATH_INPUTS.expectedResult);
    });
});

describe('The update spinner text function works as expected', () => {
    it('Updating a spinner modifies the spinner stored to the Spinner object', () => {
        startSpinner(START_SPINNER_HAPPY_PATH_INPUTS.build, START_SPINNER_HAPPY_PATH_INPUTS.finishTime, spinner);
        updateSpinnerText(UPDATE_SPINNER_HAPPY_PATH_INPUTS.build, UPDATE_SPINNER_HAPPY_PATH_INPUTS.finishTime, spinner);
        expect(spinner.spinners).toStrictEqual(UPDATE_SPINNER_HAPPY_PATH_INPUTS.expectedResult);
    });
});

describe('The stop spinner text function works as expected', () => {
    it('Stopping a spinner updates the spinner stored to the Spinner object (status = success)', () => {
        startSpinner(STOP_SPINNER_SUCCESS.build, START_SPINNER_HAPPY_PATH_INPUTS.finishTime, spinner);
        stopSpinner(
            STOP_SPINNER_SUCCESS.buildNumber,
            STOP_SPINNER_SUCCESS.buildType,
            STOP_SPINNER_SUCCESS.buildStatus,
            STOP_SPINNER_SUCCESS.buildURL,
            spinner);
        expect(spinner.spinners).toMatchObject(STOP_SPINNER_SUCCESS.expectedResult);
    });

    it('Stopping a spinner updates the spinner stored to the Spinner object (status = failure)', () => {
        startSpinner(STOP_SPINNER_FAILURE.build, START_SPINNER_HAPPY_PATH_INPUTS.finishTime, spinner);
        stopSpinner(
            STOP_SPINNER_FAILURE.buildNumber,
            STOP_SPINNER_FAILURE.buildType,
            STOP_SPINNER_FAILURE.buildStatus,
            STOP_SPINNER_FAILURE.buildURL,
            spinner);
        expect(spinner.spinners).toMatchObject(STOP_SPINNER_FAILURE.expectedResult);
    });

    it('Stopping a spinner updates the spinner stored to the Spinner object (status = abort)', () => {
        startSpinner(STOP_SPINNER_ABORTED.build, START_SPINNER_HAPPY_PATH_INPUTS.finishTime, spinner);
        stopSpinner(
            STOP_SPINNER_ABORTED.buildNumber,
            STOP_SPINNER_ABORTED.buildType,
            STOP_SPINNER_ABORTED.buildStatus,
            STOP_SPINNER_ABORTED.buildURL,
            spinner);
        expect(spinner.spinners).toMatchObject(STOP_SPINNER_ABORTED.expectedResult);
    });

    it('Stopping a spinner updates the spinner stored to the Spinner object (status = abort with success)', () => {
        startSpinner(STOP_SPINNER_ABORTED_WITH_SUCCESS.build, START_SPINNER_HAPPY_PATH_INPUTS.finishTime, spinner);
        stopSpinner(
            STOP_SPINNER_ABORTED_WITH_SUCCESS.buildNumber,
            STOP_SPINNER_ABORTED_WITH_SUCCESS.buildType,
            STOP_SPINNER_ABORTED_WITH_SUCCESS.buildStatus,
            STOP_SPINNER_ABORTED_WITH_SUCCESS.buildURL,
            spinner);
        expect(spinner.spinners).toMatchObject(STOP_SPINNER_ABORTED_WITH_SUCCESS.expectedResult);
    });
});