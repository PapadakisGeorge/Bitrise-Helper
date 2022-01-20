const {validateInputs} = require("./validateInputs");
const BITRISE_APP_URL = 'https://app.bitrise.io/app/af50b4926a122ad0#/builds/';

/**
 * @param build An object containing the build data.
 * @param finishTime The finish time of the build in minutes.
 * @returns {string} The desired text.
 */
const spinnerText = (build, finishTime) => {
    validateInputs([
            {value: build, desiredType: 'object'},
            {value: Number(finishTime), desiredType: 'number'}
        ],
    );
    const buildWorkflowID = build.triggered_workflow;
    const buildPartialURL = build.slug;
    const buildNumber = build.build_number
    const branchName = build.branch;

  if (Number(finishTime) > 1) {
    return `${buildWorkflowID} workflow for ${branchName} (build number ${buildNumber}) in progress, ETC ${finishTime} minutes.\nMore info: ${BITRISE_APP_URL}${buildPartialURL}`;
  } else if (Number(finishTime) < -10) {
    return `${buildWorkflowID} workflow for ${branchName} (build number ${buildNumber}) in progress, but is taking to long.\nCheck if everything is alright here: ${BITRISE_APP_URL}${buildPartialURL}`;
  } else {
    return `${buildWorkflowID} workflow for ${branchName} (build number ${buildNumber}) in progress, will finish soon.\nMore info: ${BITRISE_APP_URL}${buildPartialURL}`;
  }
};

/**
 * @param build An object containing the build data.
 * @param finishTime The finish time of the build in minutes.
 * @param spinners The spinners object to add the new spinner.
 */
const startSpinner = (build, finishTime, spinners) => {
    validateInputs([
        {value: build, desiredType: 'object'},
        {value: Number(finishTime), desiredType: 'number'},
    ]);
    const buildNumber = build.build_number;
    spinners.add(`spinner-${buildNumber}`, {
        text: spinnerText(build, finishTime),
        color: 'cyan'
    });

}

/**
 * @param build An object containing the build data.
 * @param finishTime The finish time of the build in minutes.
 * @param spinners The spinners object to add the new spinner.
 */
const updateSpinnerText = (build, finishTime, spinners) => {
    validateInputs([
        {value: build, desiredType: 'object'},
        {value: finishTime, desiredType: 'number'},
    ]);
    const buildNumber = build.build_number;
    spinners.update(`spinner-${buildNumber}`, {
            text: spinnerText(build, finishTime),
        }
    );
}

/**
 * @param buildNumber The build number of the workflow.
 * @param buildType The name of the workflow.
 * @param buildStatus The result of the build.
 * @param buildURL An object with the current builds running.
 * @param spinners The spinners object to add the new spinner.
 */
const stopSpinner = (buildNumber, buildType, buildStatus, buildURL, spinners) => {
    validateInputs([
        {value: Number(buildNumber), desiredType: 'number'},
        {value: buildType, desiredType: 'string'},
        {value: Number(buildStatus), desiredType: 'number'},
        {value: buildURL, desiredType: 'string'},
    ]);
    const spinnerOptions = {
        '1': 'succeeded',
        '2': 'failed',
        '3': 'was aborted',
        '4': 'was aborted with success'
    };
    const spinnerStopText = `${buildType} ${buildNumber} ${spinnerOptions[buildStatus]}! More info: ${BITRISE_APP_URL}${buildURL}`
    if (buildStatus === 2) {
        spinners.fail(`spinner-${buildNumber}`, {
            text: spinnerStopText
        });
    } else {
        spinners.succeed(`spinner-${buildNumber}`, {
                text: spinnerStopText
            }
        );
    }
}

module.exports = {
    spinnerText,
    stopSpinner,
    updateSpinnerText,
    startSpinner
}