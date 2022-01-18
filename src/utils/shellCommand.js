const { spawnSync, exec } = require("child_process");
const assert = require("assert");

const shellExec = (command) => {
  let cmdOutput = "";
  const executedCommand = spawnSync(command, {
    shell: true,
  });

  if (executedCommand.status !== 0) {
    assert.fail(executedCommand.stderr.toString());
  } else {
    cmdOutput = executedCommand.stdout.toString().trim();
    assert.strictEqual(
      (cmdOutput.includes("FAILED") || []).length,
      0,
      cmdOutput
    );
  }

  return cmdOutput;
};

const runChildProcess = (command) => {
  let child = exec(command);
  child.stdout.on("data", (data) => console.log(data));
};

module.exports = {
  shellExec,
  runChildProcess,
};
