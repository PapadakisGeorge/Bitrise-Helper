const packageJSON = require("./package.json");
const { runChildProcess } = require("./src/utils/shellCommand");
const { askQuestionList } = require("./src/utils/question");

const help = async () => {
  const availableCommands = Object.keys(packageJSON.scripts);
  let commandToRun = await askQuestionList(
    "search-list",
    "Which command do you wish to run?",
    availableCommands
  );

  let commandToExecute = `npm run ${commandToRun}`;
  runChildProcess(commandToExecute);
};

(async () => {
  await help();
})();
