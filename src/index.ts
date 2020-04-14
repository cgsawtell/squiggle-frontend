import Renderer from "./renderer";
import Drawing from "./drawing";
import InputManager from "./InputManager";
import Navigo from "navigo"
import * as DrawingAPI from "./api/drawing";
import pubsub from "./pubsub";
import { PalleteChannel, NetworkErrorChannel } from "./channels";
import { Colour } from "./interfaces";
import { UI } from "./ui";

let activeDrawing: Drawing;
let activeRender: Renderer;
let router: Navigo;
let activeUI = new UI()

const init = () => {
	router = new Navigo(location.origin)
	const canvas = document.getElementById("stage") as HTMLCanvasElement
	activeRender = new Renderer(canvas)
	new InputManager(canvas);
	setupUI();
	
	router.on({
		"drawing/:id": ({ id }) => {
				loadDrawing(parseInt(id))
		},
		"drawing": () => {
			activeDrawing = new Drawing();
			activeRender.activeDrawing = activeDrawing;
		}
	})
	
	router
		.notFound(
			() => {
				pubsub.publish(NetworkErrorChannel.NotFound)
			},
			{
				leave: () => activeUI.hideActiveErrorScreen()
			}
		)

	router.resolve()
}

const loadDrawing = async (id: number) => {
	const loadedDrawing = await DrawingAPI.get(id)
	if (typeof loadedDrawing === "undefined"){
		return
	}

	activeDrawing = new Drawing(loadedDrawing.canvas.strokes);
	activeDrawing.id = loadedDrawing.id
	activeRender.activeDrawing = activeDrawing;
}

const saveDrawing = async () => {
	if(activeDrawing.id){
		DrawingAPI.patch(activeDrawing)
	}
	else{
		const { id } = await DrawingAPI.post(activeDrawing)
		router.pause();
		router.navigate(`drawing/${id}`);
		router.resume();
	}
}

const setupUI = () => {
	const saveButton = document.getElementById("save") as HTMLButtonElement
	const blackButton = document.getElementById("black")
	const redButton = document.getElementById("red")
	const greenButton = document.getElementById("green")
	const blueButton = document.getElementById("blue")
	if (blackButton){
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


	if(saveButton){
		saveButton.addEventListener("click", async () => {
			activeUI.showSavingIndicator();
			saveButton.disabled = true;
			await saveDrawing()
			saveButton.disabled = false;
			activeUI.hideSavingIndicator();
		})
	}
}

document.addEventListener("DOMContentLoaded", init);