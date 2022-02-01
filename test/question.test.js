const { askQuestionList, askQuestionInput } = require("../src/utils/question");
const expect = require("expect");
const {
  ASK_QUESTION_INPUT_GENERIC_INPUTS,
  ASK_QUESTION_LIST_GENERIC_INPUTS,
  STRING_VALID_ANSWER,
  VALIDATION_EMPTY,
  FIRST_DEFAULT_CHOICE,
  SECOND_DEFAULT_CHOICE,
  CHOICES,
  VALIDATION_NUMBER,
} = require("./mocks/question.mocks");
const stdin = require("mock-stdin").stdin();

const userInputSimulation = (input) =>
  process.nextTick(() => stdin.send(`${input}\r`));

describe("The askQuestionInput function works as expected", () => {
  it("The askQuestionList function works when the user inputs a valid message", async () => {
    userInputSimulation(STRING_VALID_ANSWER);
    const result = await askQuestionInput(...ASK_QUESTION_INPUT_GENERIC_INPUTS);
    expect(result).toBe(STRING_VALID_ANSWER);
  });

  it("The askQuestionList function won't work until the user inputs a valid answer (validation = default)", async () => {
    userInputSimulation(VALIDATION_EMPTY.answer);
    userInputSimulation(VALIDATION_EMPTY.validAnswer);
    const result = await askQuestionInput(...ASK_QUESTION_INPUT_GENERIC_INPUTS);
    expect(result).toBe(VALIDATION_EMPTY.validAnswer);
  });

  it("The askQuestionList function won't work until the user inputs a valid answer (validation = nonEmpty)", async () => {
    userInputSimulation(VALIDATION_EMPTY.answer);
    userInputSimulation(VALIDATION_EMPTY.validAnswer);
    const result = await askQuestionInput(
      ...ASK_QUESTION_INPUT_GENERIC_INPUTS,
      VALIDATION_EMPTY.condition
    );
    expect(result).toBe(VALIDATION_EMPTY.validAnswer);
  });

  it("The askQuestionInput function won't work until the user inputs a valid answer (validation = number)", async () => {
    userInputSimulation(VALIDATION_NUMBER.answer);
    userInputSimulation(VALIDATION_NUMBER.validAnswer);
    const result = await askQuestionInput(
      ...ASK_QUESTION_INPUT_GENERIC_INPUTS,
      VALIDATION_NUMBER.condition
    );
    expect(result).toBe(VALIDATION_NUMBER.validAnswer);
  });
});

describe("The askQuestionList function works as expected", () => {
  it("The askQuestionInput function works when the user inputs a valid message", async () => {
    userInputSimulation(STRING_VALID_ANSWER);
    const result = await askQuestionInput(...ASK_QUESTION_INPUT_GENERIC_INPUTS);
    expect(result).toBe(STRING_VALID_ANSWER);
  });

  it("The askQuestionInput function won't work until the user inputs a valid answer (validation = default)", async () => {
    userInputSimulation(VALIDATION_EMPTY.answer);
    userInputSimulation(VALIDATION_EMPTY.validAnswer);
    const result = await askQuestionInput(...ASK_QUESTION_INPUT_GENERIC_INPUTS);
    expect(result).toBe(VALIDATION_EMPTY.validAnswer);
  });

  it("The askQuestionInput function won't work until the user inputs a valid answer (validation = nonEmpty)", async () => {
    userInputSimulation(VALIDATION_EMPTY.answer);
    userInputSimulation(VALIDATION_EMPTY.validAnswer);
    const result = await askQuestionInput(
      ...ASK_QUESTION_INPUT_GENERIC_INPUTS,
      VALIDATION_EMPTY.condition
    );
    expect(result).toBe(VALIDATION_EMPTY.validAnswer);
  });

  it("The askQuestionInput function won't work until the user inputs a valid answer (validation = number)", async () => {
    userInputSimulation(VALIDATION_NUMBER.answer);
    userInputSimulation(VALIDATION_NUMBER.validAnswer);
    const result = await askQuestionInput(
      ...ASK_QUESTION_INPUT_GENERIC_INPUTS,
      VALIDATION_NUMBER.condition
    );
    expect(result).toBe(VALIDATION_NUMBER.validAnswer);
  });
});

describe("The askQuestionList function works as expected", () => {
  it("The askQuestionList function works when the user presses enter (default choices)", async () => {
    userInputSimulation("");
    const result = await askQuestionList(...ASK_QUESTION_LIST_GENERIC_INPUTS);
    expect(result).toBe(FIRST_DEFAULT_CHOICE);
  });

  const up = "\u001b[A";
  const down = "\u001b[B";

  it("The askQuestionList function works when the user presses down (default choices)", async () => {
    userInputSimulation(down);
    const result = await askQuestionList(...ASK_QUESTION_LIST_GENERIC_INPUTS);
    expect(result).toBe(SECOND_DEFAULT_CHOICE);
  });

  it("The askQuestionList function works when the user presses down twice (default choices)", async () => {
    userInputSimulation(`${down}${down}`);
    const result = await askQuestionList(...ASK_QUESTION_LIST_GENERIC_INPUTS);
    expect(result).toBe(FIRST_DEFAULT_CHOICE);
  });

  it("The askQuestionList function works when there are on-default choices (User presses enter)", async () => {
    const input = "";
    userInputSimulation(input);
    const result = await askQuestionList(
      ...ASK_QUESTION_LIST_GENERIC_INPUTS,
      CHOICES
    );
    expect(result).toBe(CHOICES[0]);
  });

  it("The askQuestionList function works when there are on-default choices (User presses down once)", async () => {
    userInputSimulation(down);
    const result = await askQuestionList(
      ...ASK_QUESTION_LIST_GENERIC_INPUTS,
      CHOICES
    );
    expect(result).toBe(CHOICES[1]);
  });

  it("The askQuestionList function works when there are on-default choices (User presses down twice)", async () => {
    userInputSimulation(down.repeat(2));
    const result = await askQuestionList(
      ...ASK_QUESTION_LIST_GENERIC_INPUTS,
      CHOICES
    );
    expect(result).toBe(CHOICES[2]);
  });

  it("The askQuestionList function works when there are on-default choices (User presses down three times)", async () => {
    userInputSimulation(down.repeat(3));
    const result = await askQuestionList(
      ...ASK_QUESTION_LIST_GENERIC_INPUTS,
      CHOICES
    );
    expect(result).toBe(CHOICES[0]);
  });

  it("The askQuestionList function works when there are on-default choices (User presses up once)", async () => {
    userInputSimulation(up);
    const result = await askQuestionList(
      ...ASK_QUESTION_LIST_GENERIC_INPUTS,
      CHOICES
    );
    expect(result).toBe(CHOICES[2]);
  });

  it("The askQuestionList function works when there are on-default choices (User presses up twice)", async () => {
    userInputSimulation(up.repeat(2));
    const result = await askQuestionList(
      ...ASK_QUESTION_LIST_GENERIC_INPUTS,
      CHOICES
    );
    expect(result).toBe(CHOICES[1]);
  });

  it("The askQuestionList function works when there are on-default choices (User presses up three times)", async () => {
    userInputSimulation(up.repeat(3));
    const result = await askQuestionList(
      ...ASK_QUESTION_LIST_GENERIC_INPUTS,
      CHOICES
    );
    expect(result).toBe(CHOICES[0]);
  });
});
