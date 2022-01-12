const {spawnSync} = require('child_process');
const assert = require('assert');

const shellExec = (command) => {
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
};

module.exports = {
    shellExec
}