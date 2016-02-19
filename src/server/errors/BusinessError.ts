import IBusinessError = require("../../schemas/errors/IBusinessError");

class BusinessError extends Error implements IBusinessError{
	constructor(message:string){
		super();
		this.name = "BusinessError";
		this.message = message;
	}
} 

export = BusinessError;