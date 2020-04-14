import pubsub from "./pubsub";
import { NetworkErrorChannel } from "./channels";

export enum ErrorScreen {
	NotFound,
	ServerError,
	Forbidden
}

const errorScreenIds:Record<ErrorScreen, string> = {
	[ErrorScreen.NotFound]: "404-screen",
	[ErrorScreen.ServerError]: "500-screen",
	[ErrorScreen.Forbidden]: "403-screen",
}

export class UI {
	activeErrorScreen?: ErrorScreen;
	constructor(){
		pubsub.subscribe(NetworkErrorChannel.NotFound, 
			() => this.showErrorScreen(ErrorScreen.NotFound)
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
		const errorScreenEl = document.getElementById(errorScreenIds[screen])
		if(errorScreenEl){
			this.activeErrorScreen = screen;
			errorScreenEl.style.display = ""
		}
	}
	hideActiveErrorScreen() {
		if(typeof this.activeErrorScreen === "undefined"){
			return
		}
	
		const errorScreenEl = document.getElementById(errorScreenIds[this.activeErrorScreen])
		if (errorScreenEl) {
			errorScreenEl.style.display = "none"
		}
	}
}