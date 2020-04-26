import signupScreenTemplate from "../templates/signup-screen.hbs"
import { documentReady } from "../helpers/load";
import { renderTemplateTo } from "../helpers/handlebars";
import EventDelegator from "../core/EventDelegator";
import * as UserAPI from "../api/user";
import router from "../routing";

interface SignupScreenProps {

}

export default class SignUpController {
	constructor(){
		documentReady(
			() => {
				renderTemplateTo<SignupScreenProps>(signupScreenTemplate, {errors:{}}, "app-root")
			}
		)
		EventDelegator.addEventListener("submit", "#signup-form", this.onFormSubmit)
	}
	convertFormDataToObject(formData: FormData): UserAPI.NewUserPayload{
		const formDataEntries = formData.entries()
		const formDataAsArray = Array.from(formDataEntries)
		const formDataAsObject = formDataAsArray.reduce((accum, [key, value]) => ({ [key]: value, ...accum }), {}	)
		return formDataAsObject as UserAPI.NewUserPayload
	}
	onFormValidationErrors = ({ errors }: UserAPI.NewUserValidationErrorResponse, formValues: UserAPI.NewUserPayload) => {
		console.log(errors);
		renderTemplateTo<SignupScreenProps>(signupScreenTemplate, { errors, values: formValues }, "app-root")
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