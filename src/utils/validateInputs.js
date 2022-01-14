class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}

const validateInput = (input, desiredType) => {
    let isItValid;
    if (desiredType === 'array') isItValid = Array.isArray(input);
    else isItValid = typeof input === desiredType
    if (!isItValid) throw new ValidationError(`\nInput: ${input}\nType: not ${desiredType}`);
}

const validateInputs = (inputs) => {
    for (const element of inputs) {
        validateInput(element.value, element.desiredType)
    }
}

module.exports = {
    ValidationError,
    validateInputs
}