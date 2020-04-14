import Drawing from "../drawing";
import * as DrawingAPI from "../api/drawing";
import router from "../routing";
import pubsub from "../pubsub";
import { DrawingChannel, PalleteChannel } from "../channels";
import { Colour } from "../interfaces";

export default class DrawingController {
	activeDrawing: Drawing;
	constructor(){
		this.activeDrawing = new Drawing();
	}
	newDrawing = () => {
		this.activeDrawing = new Drawing();
		pubsub.publish<Drawing>(DrawingChannel.ChangedDrawing, this.activeDrawing)
	}
	loadDrawing = async (id: number) => {
		const loadedDrawing = await DrawingAPI.get(id)
		if (typeof loadedDrawing === "undefined") {
			return
		}

		this.activeDrawing = new Drawing(loadedDrawing.canvas.strokes);
		this.activeDrawing.id = loadedDrawing.id;
		pubsub.publish<Drawing>(DrawingChannel.ChangedDrawing, this.activeDrawing)
	}

	saveDrawing = async () => {
		if (this.activeDrawing.id) {
			DrawingAPI.patch(this.activeDrawing)
		}
		else {
			const { id } = await DrawingAPI.post(this.activeDrawing)
			router.pause();
			router.navigate(`drawing/${id}`);
			router.resume();
		}
	}

	setupUI = () => {
		const saveButton = document.getElementById("save") as HTMLButtonElement
		const blackButton = document.getElementById("black")
		const redButton = document.getElementById("red")
		const greenButton = document.getElementById("green")
		const blueButton = document.getElementById("blue")
		if (blackButton) {
			blackButton.addEventListener("click", () => pubsub.publish<Colour>(PalleteChannel.ColourChange, "Black"))
		}
		if (redButton) {
			redButton.addEventListener("click", () => pubsub.publish<Colour>(PalleteChannel.ColourChange, "Red"))
		}
		if (greenButton) {
			greenButton.addEventListener("click", () => pubsub.publish<Colour>(PalleteChannel.ColourChange, "Green"))
		}
		if (blueButton) {
			blueButton.addEventListener("click", () => pubsub.publish<Colour>(PalleteChannel.ColourChange, "Blue"))
		}


		if (saveButton) {
			saveButton.addEventListener("click", async () => {
				saveButton.disabled = true;
				await this.saveDrawing();
				saveButton.disabled = false;
			})
		}
	}
}