interface ISingleValidationError{
    type :string;
    message:string;
}

interface IValidationError extends Error {
    errors:ISingleValidationError[];
}

export = IValidationError;


