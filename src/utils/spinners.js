/**
 * @param build An object containing the build data.
 * @param finishTime The finish time of the build in minutes.
 * @returns {string} The desired text.
 */
const spinnerText = (build, finishTime) => {
    const buildWorkflowID = build.triggered_workflow;
    const buildPartialURL = build.slug;
    const buildNumber = build.build_number

    if (Number(finishTime) > 1) {
        return `${buildWorkflowID} workflow (build number ${buildNumber}) in progress, ETC ${finishTime} minutes. More info: ${process.env.BITRISE_APP_URL}${buildPartialURL}`
    } else if (Number(finishTime) < -10) {
        return `${buildWorkflowID} workflow (build number ${buildNumber}) in progress, but is taking to long. Check if everything is alright here: ${process.env.BITRISE_APP_URL}${buildPartialURL}`
    } else {
        return `${buildWorkflowID} workflow (build number ${buildNumber}) in progress, will finish soon. More info: ${process.env.BITRISE_APP_URL}${buildPartialURL}`
    }
}

/**
 * @param build An object containing the build data.
 * @param finishTime The finish time of the build in minutes.
 * @param spinners The spinners object to add the new spinner.
 */
const startSpinner = (build, finishTime, spinners) => {
    const buildNumber = build.build_number;
    spinners.add(`spinner-${buildNumber}`, {
        text: spinnerText(build, finishTime)
    });

}

/**
 * @param build An object containing the build data.
 * @param finishTime The finish time of the build in minutes.
 * @param spinners The spinners object to add the new spinner.
 */
const updateSpinnerText = (build, finishTime, spinners) => {
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
    const buildStatusFormatted = {
        '1': 'succeeded',
        '2': 'failed',
        '3': 'was aborted',
        '4': 'was aborted with success'
    };
    spinners.succeed(`spinner-${buildNumber}`, {
            text: `${buildType} ${buildNumber} ${buildStatusFormatted[buildStatus]}! More info: ${process.env.BITRISE_APP_URL}${buildURL} `,
            successColor: 'greenBright'
        }
    );
}

module.exports = {
    stopSpinner,
    updateSpinnerText,
    startSpinner
}