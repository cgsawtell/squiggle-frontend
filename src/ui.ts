import pubsub from "./pubsub";
import { NetworkErrorChannel } from "./channels";
import errorTemplate from "./templates/error-screen.hbs"

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
		console.log("init ui");
		
		pubsub.subscribe(NetworkErrorChannel.NotFound, () => {console.log("Not found");this.showErrorScreen(ErrorScreen.NotFound)}
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
		const errorHTML = errorTemplate<ErrorScreenProps>(errorScreenPropsLookup[screen])
		const errorScreenRoot = document.getElementById("error-screen-root");
		if(errorScreenRoot){
			errorScreenRoot.innerHTML = errorHTML
		}
	}
	hideActiveErrorScreen() {
		const errorScreenRoot = document.getElementById("error-screen-root");
		if (errorScreenRoot) {
			errorScreenRoot.innerHTML = ""
		}
	}
}