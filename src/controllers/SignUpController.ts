import signupScreenTemplate from "../templates/signup-screen.hbs"
import { documentReady } from "../helpers/load";
import { renderTemplateTo } from "../helpers/handlebars";
import EventDelegator from "../core/EventDelegator";
import * as UserAPI from "../api/user";
import router from "../routing";
import { withState } from "../helpers/state";

interface SignupScreenState {
	values: Partial<Record<keyof UserAPI.NewUserPayload, string>>,
	errors: Partial<Record<keyof UserAPI.NewUserPayload, string>>

}

const initialState = {
	values: {},
	errors: {}
}

export default class SignUpController {
	state: SignupScreenState;
	constructor(){
		this.state = withState<SignupScreenState>(initialState, this.render)
		documentReady( this.render )
		EventDelegator.addEventListener("submit", "#signup-form", this.onFormSubmit)
	}
	render = () => {
		renderTemplateTo<SignupScreenState>(signupScreenTemplate, this.state, "app-root");
	}
	convertFormDataToObject(formData: FormData): UserAPI.NewUserPayload{
		const formDataEntries = formData.entries()
		const formDataAsArray = Array.from(formDataEntries)
		const formDataAsObject = formDataAsArray.reduce((accum, [key, value]) => ({ [key]: value, ...accum }), {}	)
		return formDataAsObject as UserAPI.NewUserPayload
	}
	onFormValidationErrors = ({ errors }: UserAPI.NewUserValidationErrorResponse, formValues: UserAPI.NewUserPayload) => {
		this.state.values = formValues
		this.state.errors = errors
	}
	onFormSubmit = async (e:Event) => {
		e.preventDefault()
		const target = <HTMLFormElement>e.target;
		const signupFromData = new FormData(target);
		const signUpFormPayload: UserAPI.NewUserPayload = this.convertFormDataToObject(signupFromData);

		const errorHandlers = {
			422: (errors: UserAPI.NewUserValidationErrorResponse) => this.onFormValidationErrors(errors, signUpFormPayload)
		}

		try {
			const newUserResponse = await UserAPI.post(signUpFormPayload, errorHandlers);
			if (typeof newUserResponse === "undefined"){
				return
			}
			router.navigate(`drawing/`);
		} catch (unhandledError) {
			console.log("unhandledError: ", unhandledError);
		}
	}


}