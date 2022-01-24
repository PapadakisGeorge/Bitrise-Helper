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
    choices,
  };

  const result = await inquirer.prompt([question]);
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

const askForBranch = async () => {
  return await askQuestionInput(
    "branch",
    "Enter the branch name, or part of it, that you want to watch:\n",
    "You need to specify a branch!"
  );
};

module.exports = {
  askQuestionList,
  askQuestionInput,
  askForWorkflow,
  askForBranch,
};
