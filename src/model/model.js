const WORKFLOWS = {
    WORKFLOW_ANDROID:'Workflow_Android',
    WORKFLOW_IOS:'Workflow_IOS',
    WORKFLOW_ANDROID_EDGE:'Workflow_Android_Edge',
    WORKFLOW_IOS_EDGE:'Workflow_IOS_Edge'
}

const YES_OPTIONS = ['yes','Yes','YES','Y','y'];
const NO_OPTIONS = ['no','No','NO','N','n'];
const YES_NO_OPTIONS = [...YES_OPTIONS,...NO_OPTIONS];

const STATUSES = Object.freeze({
    'running': 0,
    'successful': 1,
    'failed': 2,
    'aborted with failure': 3,
    'aborted with success': 4,
});

module.exports= {
    WORKFLOWS,
    YES_OPTIONS,
    NO_OPTIONS,
    YES_NO_OPTIONS,
    STATUSES
}
