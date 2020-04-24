import pubsub from "../core/pubsub";
import EventDelegator from "../core/EventDelegator";

import Drawing from "../drawing";
import * as DrawingAPI from "../api/drawing";
import router from "../routing";
import { DrawingChannel, PalleteChannel } from "../channels";
import { Colour } from "../interfaces";
import Renderer from "../renderer";
import InputManager from "../InputManager";
import drawingScreenTemplate from "../templates/drawing-screen.hbs"
import { renderTemplateTo } from "../helpers/handlebars";
import { documentReady } from "../helpers/load";

export default class DrawingController {
	activeDrawing: Drawing;
	constructor(){
		this.activeDrawing = new Drawing();
		this.setupUIListeners()

		const renderer = new Renderer()
		new InputManager();

		documentReady(() => {
			renderTemplateTo(drawingScreenTemplate, {}, "app-root")
			renderer.initCanvas()
		});
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

	onSaveClick = async (e: MouseEvent) => {
		const saveButton = <HTMLButtonElement>e.target
		saveButton.disabled = true;
		await this.saveDrawing();
		saveButton.disabled = false;
	}

	setupUIListeners = () => {
		EventDelegator.addEventListener("click", "#black", () => pubsub.publish<Colour>(PalleteChannel.ColourChange, "Black"))
		EventDelegator.addEventListener("click", "#red", () => pubsub.publish<Colour>(PalleteChannel.ColourChange, "Red"))
		EventDelegator.addEventListener("click", "#green", () => pubsub.publish<Colour>(PalleteChannel.ColourChange, "Green"))
		EventDelegator.addEventListener("click", "#blue", () => pubsub.publish<Colour>(PalleteChannel.ColourChange, "Blue"))

		EventDelegator.addEventListener("click", "#save", this.onSaveClick)
	}

	cleanup = () => {

	}
}