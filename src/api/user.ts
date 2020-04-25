import wretch from "wretch";

const userAPI = wretch("/api/user")

interface UserData {
	firstName: string;
	lastName: string;
	email: string;
}

export interface NewUserPayload extends UserData{
	password: string;
}

export interface UserResponse extends UserData{
	id: number;
}

export interface NewUserValidationErrorResponse {
	errors: Partial<Record<keyof NewUserPayload, string>>
}

export const post = (newUser: NewUserPayload, errorHandlers: { 422: (response: NewUserValidationErrorResponse)=>void}) => 
	userAPI
		.errorType("json")
		.post(newUser)
		.error(422, ({ json }) => errorHandlers[422](json))
		.json() as Promise<UserResponse | undefined>;
