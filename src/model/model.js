const WORKFLOWS = {
    WORKFLOW_ANDROID:'Workflow_Android',
    WORKFLOW_IOS:'Workflow_IOS',
    WORKFLOW_ANDROID_EDGE:'Workflow_Android_Edge',
    WORKFLOW_IOS_EDGE:'Workflow_IOS_Edge'
}

const YES_OPTIONS = ['yes','Yes','YES','Y','y'];
const NO_OPTIONS = ['no','No','NO','N','n'];
const YES_NO_OPTIONS = [...YES_OPTIONS,...NO_OPTIONS];

const RESERVED_SESSIONS = {
    Workflow_Android: 15,
    Workflow_IOS: 20,
    Workflow_Android_Edge: 10,
    Workflow_IOS_Edge: 30,
    Execute_Android_Tests: 15,
    Execute_Android_Edge_Tests: 10,
    Execute_IOS_Tests: 20,
    Execute_IOS_Edge_Suite_1_Tests: 15,
    Execute_IOS_Edge_Suite_2_Tests: 15,
}

const consoleRed = '\x1b[31m%s\x1b[0m'
const consoleGreen = '\x1b[32m%s\x1b[0m'
const consoleYellow = '\x1b[33m%s\x1b[0m'
const consoleBlue = '\x1b[34m%s\x1b[0m'
const consoleCyan = '\x1b[36m%s\x1b[0m'

module.exports= {
    WORKFLOWS,
    YES_OPTIONS,
    NO_OPTIONS,
    YES_NO_OPTIONS,
    RESERVED_SESSIONS,
    consoleRed,
    consoleGreen,
    consoleYellow,
    consoleBlue,
    consoleCyan
}
