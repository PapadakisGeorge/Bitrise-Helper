const chalk = require("chalk");
const inquirer = require("inquirer");
const { WORKFLOWS } = require("../model/model");

const validator = (answer, type) => {
  const object = {
    number: isNaN(Number(answer)),
    nonEmpty: !answer,
  };
  return object[type];
};

const askQuestionList = async (name, message, choices = ["Yes", "No"]) => {
  const question = {
    name,
    message,
    type: "list",
    choices: [...choices, 'Cancel'],
    loop: false,
  };

  const result = await inquirer.prompt([question]);
  if(result[name] === 'Cancel') {
    console.log(chalk.yellow('Aborting task...'));
    console.log(chalk.green('Task aborted successfully!'));
    process.exit(0);
  }
  return result[name];
};

const askQuestionInput = async (
  name,
  message,
  validateMessage,
  condition = "nonEmpty"
) => {
  const question = {
    name,
    message,
    type: "input",
    validate(answer) {
      if (validator(answer, condition)) {
        return validateMessage;
      }
      return true;
    },
  };

  const result = await inquirer.prompt([question]);
  return result[name];
};

const availableWorkflowsMatrix = Object.values(WORKFLOWS);

const askForWorkflow = async () => {
  return await askQuestionList(
    "workflow",
    "Which workflow do you want to trigger?",
    availableWorkflowsMatrix
  );
};

const askForBranch = async (message) => {
  const MESSAGES = {
    "trigger": "Enter the branch name you want to trigger:\n",
    "watch": "Enter the branch name, or part of it, that you want to watch:\n"
  }
  return await askQuestionInput(
    "branch",
    MESSAGES[message],
    "You need to specify a branch!"
  );
};

module.exports = {
  askQuestionList,
  askQuestionInput,
  askForWorkflow,
  askForBranch,
};
