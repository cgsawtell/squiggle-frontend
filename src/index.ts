import Renderer from "./renderer";
import InputManager from "./InputManager";
import"./routing";
// import { UI } from "./ui";
// let activeUI = new UI()

const init = () => {
	const canvas = document.getElementById("stage") as HTMLCanvasElement
	new Renderer(canvas)
	new InputManager(canvas);
}

document.addEventListener("DOMContentLoaded", init);