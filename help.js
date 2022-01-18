const readline = require("readline-sync");
const packageJSON = require("./package.json");
const { runChildProcess } = require("./src/utils/shellCommand");

const help = () => {
  const availableCommands = Object.keys(packageJSON.scripts);
  let commandToRun = readline.keyInSelect(
    availableCommands,
    "Which command do you wish to run?"
  );
  let commandToExecute = `npm run ${availableCommands[commandToRun]}`;
  runChildProcess(commandToExecute);
};

(async () => {
  await help();
})();
