import { UserResponse } from "./user";
import { api } from "./base";
import { Security } from "../core/Security";

const authAPI = api.url("authenticate")

export interface LocalAuthenticationPayload {
	email: string;
	password: string;
}

export interface LocalAuthenticationResponse {
	success: true;
	user: UserResponse;
	token: string;
}

export interface LocalAuthenticationValidationErrorResponse {
	success: false;
	message:string
}

export const localLogin = (newUser: LocalAuthenticationPayload, errorHandlers: { 422: (response: LocalAuthenticationValidationErrorResponse)=>void}) => 
	authAPI
		.url("/local")
		.errorType("json")
		.post(newUser)
		.error(422, ({ json }) => errorHandlers[422](json))
		.json() as Promise<LocalAuthenticationResponse | undefined>;

export const logout = () => (
	authAPI
	.url("/logout")
	.options({
		context: {
			token: Security.token
		}
	})
	.post()
	.json()
)