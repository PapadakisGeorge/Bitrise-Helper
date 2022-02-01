const ASK_QUESTION_INPUT_GENERIC_INPUTS = [
  "name",
  "message",
  "Validate Message",
];
const ASK_QUESTION_LIST_GENERIC_INPUTS = ["name", "message"];
const STRING_VALID_ANSWER = "This is a valid answer!";
const FIRST_DEFAULT_CHOICE = "Yes";
const SECOND_DEFAULT_CHOICE = "No";
const CHOICES = ["First", "Second", "Third"];

const VALIDATION_EMPTY = {
  condition: "nonEmpty",
  answer: "",
  validAnswer: STRING_VALID_ANSWER,
};
const VALIDATION_NUMBER = {
  condition: "number",
  answer: "This is not a number",
  validAnswer: "1",
};

module.exports = {
  ASK_QUESTION_INPUT_GENERIC_INPUTS,
  ASK_QUESTION_LIST_GENERIC_INPUTS,
  CHOICES,
  FIRST_DEFAULT_CHOICE,
  SECOND_DEFAULT_CHOICE,
  STRING_VALID_ANSWER,
  VALIDATION_EMPTY,
  VALIDATION_NUMBER,
};
