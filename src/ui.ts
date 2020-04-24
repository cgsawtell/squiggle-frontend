import pubsub from "./pubsub";
import { NetworkErrorChannel } from "./channels";
import errorTemplate from "./templates/error-screen.hbs"
import { renderTemplateTo } from "./helpers/handlebars";

interface ErrorScreenProps {
	emoji: string,
	title: string,
	buttonText: string
}

export enum ErrorScreen {
	NotFound,
	ServerError,
	Forbidden
}

const errorScreenPropsLookup: Record<ErrorScreen, ErrorScreenProps> = {
	[ErrorScreen.NotFound]: {
		emoji: "😿",
		title: "Sorry, you're a bit lost.",
		buttonText: "New squiggle"
	},
	[ErrorScreen.ServerError]: {
		emoji: "🙀",
		title: "Something went wrong.",
		buttonText: "Try Again"
	},
	[ErrorScreen.Forbidden]: {
		emoji: "😾",
		title: "You’re not supposed to be here.",
		buttonText: "Go home"
	},
}

export class UI {
	activeErrorScreen?: ErrorScreen;
	constructor(){
		pubsub.subscribe(NetworkErrorChannel.NotFound, () => {this.showErrorScreen(ErrorScreen.NotFound)}
		)
	}
	showSavingIndicator(){
		const savingIndicatorEl = document.getElementsByClassName("saving-indicator")[0] as HTMLElement
		savingIndicatorEl.style.opacity = "1"
	}
	hideSavingIndicator(){
		const savingIndicatorEl = document.getElementsByClassName("saving-indicator")[0] as HTMLElement
		savingIndicatorEl.style.opacity = "0"
	}
	showErrorScreen(screen: ErrorScreen){
		renderTemplateTo(errorTemplate, errorScreenPropsLookup[screen], "error-screen-root")
	}
	hideActiveErrorScreen() {
		const errorScreenRoot = document.getElementById("error-screen-root");
		if (errorScreenRoot) {
			errorScreenRoot.innerHTML = ""
		}
	}
}