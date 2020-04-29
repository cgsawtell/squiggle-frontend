import loginScreenTemplate from "../templates/login-screen.hbs"
import { documentReady } from "../helpers/load";
import { renderTemplateTo } from "../helpers/handlebars";
import EventDelegator from "../core/EventDelegator";
import * as AuthenticationAPI from "../api/authentication";
import router from "../routing";
import { withState } from "../helpers/state";
import { Security } from "../core/Security";

interface LoginScreenState {
	values: Partial<Record<keyof AuthenticationAPI.LocalAuthenticationPayload, string>>,
	message?: string;
}

const initialState: LoginScreenState = {
	values: {},
	message: undefined
}

export default class LoginController {
	state: LoginScreenState;
	constructor(){
		this.state = withState<LoginScreenState>(initialState, this.render)
		documentReady( this.render )
		EventDelegator.addEventListener("submit", "#login-form", this.onFormSubmit)
	}
	render = () => {
		renderTemplateTo<LoginScreenState>(loginScreenTemplate, this.state, "app-root");
	}
	convertFormDataToObject(formData: FormData): AuthenticationAPI.LocalAuthenticationPayload{
		const formDataEntries = formData.entries()
		const formDataAsArray = Array.from(formDataEntries)
		const formDataAsObject = formDataAsArray.reduce((accum, [key, value]) => ({ [key]: value, ...accum }), {}	)
		return formDataAsObject as AuthenticationAPI.LocalAuthenticationPayload
	}
	onFormValidationErrors = ({ message }: AuthenticationAPI.LocalAuthenticationValidationErrorResponse, formValues: AuthenticationAPI.LocalAuthenticationPayload) => {
		this.state.values = formValues
		this.state.message = message
	}
	onFormSubmit = async (e:Event) => {
		e.preventDefault()
		const target = <HTMLFormElement>e.target;
		const loginFromData = new FormData(target);
		const loginFormPayload: AuthenticationAPI.LocalAuthenticationPayload = this.convertFormDataToObject(loginFromData);

		const errorHandlers = {
			422: (errors: AuthenticationAPI.LocalAuthenticationValidationErrorResponse) => this.onFormValidationErrors(errors, loginFormPayload)
		}

		try {
			const loginResponse = await AuthenticationAPI.localLogin(loginFormPayload, errorHandlers);
			if (typeof loginResponse === "undefined"){
				return
			}
			Security.token = loginResponse.token;
			
			router.navigate(`drawing/`);
		} catch (unhandledError) {
			console.log("unhandledError: ", unhandledError);
		}
	}


}