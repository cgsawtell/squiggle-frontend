import pubsub from "../core/PubSub";
import EventDelegator from "../core/EventDelegator";
import Drawing from "../drawing";
import * as DrawingAPI from "../api/drawing";
import router from "../routing";
import { withState } from "../helpers/state"
import { DrawingChannel } from "../channels";
import { Colour, Tool } from "../interfaces";
import Renderer from "../renderer";
import InputManager from "../InputManager";
import drawingScreenTemplate from "../templates/drawing-screen.hbs"
import { renderTemplateTo } from "../helpers/handlebars";
import { documentReady } from "../helpers/load";
import eraser from "../../assets/eraser.svg"
import pencil from "../../assets/pencil.svg"

interface DrawingControllerState {
	activeTool: Tool,
	activeColour: Colour,
	icons:Record<string, string>
}

const initialState: DrawingControllerState = {
	activeTool: Tool.Pencil,
	activeColour: "Black",
	icons: { eraser, pencil }
}

export default class DrawingController {
	activeDrawing: Drawing;
	state: DrawingControllerState;
	renderer: Renderer;
	constructor(){
		this.state = withState(initialState, this.rerender)
		this.activeDrawing = new Drawing();
		this.setupUIListeners()
		new InputManager();
		
		this.renderer = new Renderer()
		documentReady(this.render);
	}
	render = () => {
		renderTemplateTo(drawingScreenTemplate, this.state, "app-root");
		this.renderer.initCanvas();
	}
	rerender = () => {
		renderTemplateTo(drawingScreenTemplate, this.state, "app-root");
		this.renderer.initCanvas();
		this.renderer.redraw();
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
	handleToolChangePencil = () => {
		this.state.activeTool = Tool.Pencil
		pubsub.publish<Tool>(DrawingChannel.ToolChanged, this.state.activeTool )
	}
	handleToolChangeEraser = () => {
		this.state.activeTool = Tool.Eraser
		pubsub.publish<Tool>(DrawingChannel.ToolChanged, this.state.activeTool )
	}
	setupUIListeners = () => {
		EventDelegator.addEventListener("click", "#tool-pencil", this.handleToolChangePencil)
		EventDelegator.addEventListener("click", "#tool-eraser", this.handleToolChangeEraser)

		EventDelegator.addEventListener("click", "#black", () => pubsub.publish<Colour>(DrawingChannel.ColourChange, "Black"))
		EventDelegator.addEventListener("click", "#red", () => pubsub.publish<Colour>(DrawingChannel.ColourChange, "Red"))
		EventDelegator.addEventListener("click", "#green", () => pubsub.publish<Colour>(DrawingChannel.ColourChange, "Green"))
		EventDelegator.addEventListener("click", "#blue", () => pubsub.publish<Colour>(DrawingChannel.ColourChange, "Blue"))

		EventDelegator.addEventListener("click", "#save", this.onSaveClick)
	}

	cleanup = () => {
		EventDelegator.removeEventListener("click", "#save", this.onSaveClick)
	}
}