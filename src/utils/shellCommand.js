const {exec} = require('child_process');

const shellExec = (command) => {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`${stdout}`);
    });
};

module.exports = {
    shellExec
}