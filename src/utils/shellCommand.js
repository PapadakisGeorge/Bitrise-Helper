const {spawnSync} = require('child_process');
const assert = require('assert');
const {CONSOLE_RED} = require('../model/model');

const shellExec = (command) => {
    try {
        let cmdOutput = '';
        const executedCommand = spawnSync(command, {
            shell: true
        });

        if (executedCommand.status !== 0) {
            assert.fail(executedCommand.stderr.toString());
        } else {
            cmdOutput = executedCommand.stdout.toString().trim();
            assert.strictEqual((cmdOutput.includes('FAILED') || []).length, 0, cmdOutput);
        }

        return cmdOutput;
    } catch (error){
        console.log(CONSOLE_RED, `Error while executing shell command: ${command}.\nError:`);
        return error;
    }
};

module.exports = {
    shellExec
}