export class UI {
	showSavingIndicator(){
		const savingIndicatorEl = document.getElementsByClassName("saving-indicator")[0] as HTMLElement
		savingIndicatorEl.style.opacity = "1"
	}
	hideSavingIndicator(){
		const savingIndicatorEl = document.getElementsByClassName("saving-indicator")[0] as HTMLElement
		savingIndicatorEl.style.opacity = "0"
	}
}