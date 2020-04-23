import Drawing from "../drawing";
import * as DrawingAPI from "../api/drawing";
import router from "../routing";
import pubsub from "../pubsub";
import { DrawingChannel, PalleteChannel } from "../channels";
import { Colour } from "../interfaces";
import Renderer from "../renderer";
import InputManager from "../InputManager";
import EventDelegator from "../EventDelegator";

export default class DrawingController {
	activeDrawing: Drawing;
	constructor(){
		this.activeDrawing = new Drawing();
		this.setupUIListeners()
		this.initRendererAndInput()
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
	
	initRendererAndInput = () => {
		new Renderer()
		new InputManager();
	}

	setupUIListeners = () => {
		EventDelegator.addEventListener("click", "#black", () => pubsub.publish<Colour>(PalleteChannel.ColourChange, "Black"))
		EventDelegator.addEventListener("click", "#red", () => pubsub.publish<Colour>(PalleteChannel.ColourChange, "Red"))
		EventDelegator.addEventListener("click", "#green", () => pubsub.publish<Colour>(PalleteChannel.ColourChange, "Green"))
		EventDelegator.addEventListener("click", "#blue", () => pubsub.publish<Colour>(PalleteChannel.ColourChange, "Blue"))

		EventDelegator.addEventListener("click", "#save", async (e: MouseEvent) => {
			const saveButton = <HTMLButtonElement>e.target
			saveButton.disabled = true;
			await this.saveDrawing();
			saveButton.disabled = false;
		})
	}
}