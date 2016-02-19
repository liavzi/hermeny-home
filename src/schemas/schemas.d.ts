declare module "schemas"{
	export interface Image{
		_id :string;
		imageUrl : string;
	}
	
	export interface IContactCustomerRequest{
		customerName : string;
		customerPhone : string;
		customerMail : string;
		content : string;
		submittedDate : Date;
	}
}





