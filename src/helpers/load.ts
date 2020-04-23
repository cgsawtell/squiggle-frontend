export const documentReady = (onDocumentReady: () => void) => {
	if (document.readyState !== "loading") {
		onDocumentReady()
	}
	else {
		document.addEventListener("DOMContentLoaded", onDocumentReady);
	}
}