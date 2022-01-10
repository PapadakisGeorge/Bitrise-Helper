const {approximateFinish} = require('./runTime');

const BITRISE_APP_URL = 'https://app.bitrise.io/build/';

/**
 * @param build An object containing the build data.
 * @returns {string} The desired text.
 */
const spinnerText = (build) => {
    const buildWorkflowID = build.triggered_workflow;
    const buildPartialURL = build.slug;
    const finishTime = approximateFinish(build.triggered_at, buildWorkflowID);

    return Number(finishTime) > 0 ?
        `${buildWorkflowID} workflow in progress, approximate finish time ${finishTime} minutes. More info: ${BITRISE_APP_URL}${buildPartialURL}` :
        `${buildWorkflowID} workflow in progress, will finish soon. More info: ${BITRISE_APP_URL}${buildPartialURL}`
}

/**
 * @param build An object containing the build data.
 * @param spinners The spinners object to add the new spinner.
 */
const startSpinner = (build, spinners) => {
    const buildNumber = build.build_number;
    spinners.add(`spinner-${buildNumber}`, {
        text: spinnerText(build)
    });

}

/**
 * @param build An object containing the build data.
 * @param spinners The spinners object to add the new spinner.
 */
const updateSpinnerText = (build, spinners) => {
    const buildNumber = build.build_number;
    spinners.update(`spinner-${buildNumber}`, {
            text: spinnerText(build),
        }
    );
}

/**
 * @param buildNumber The build number of the workflow.
 * @param buildURL An object with the current builds running.
 * @param spinners The spinners object to add the new spinner.
 */
const stopSpinner = (buildNumber, buildURL, spinners) => {
    spinners.succeed(`spinner-${buildNumber}`, {
            text: `Build ${buildNumber} finished! More info:  ${BITRISE_APP_URL}${buildURL} `,
            successColor: 'greenBright'
        }
    );
}

module.exports = {
    stopSpinner,
    updateSpinnerText,
    startSpinner
}