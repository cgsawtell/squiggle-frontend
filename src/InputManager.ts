import pubsub from "./pubsub";
import { PenChannel } from "./channels";
import { MouseButtons } from "./helpers/mouseButtons";
import { Vector2 } from "./interfaces";

export default class InputManager{
	isPointerDown: boolean = false;
	constructor(canvas: HTMLCanvasElement) {
		canvas.addEventListener("mousedown", this.handleMouseDown)
		document.addEventListener("mouseup", this.handleMouseUp)
		canvas.addEventListener("mousemove", this.handleMouseMove)
	}
	handleMouseUp = () => { this.isPointerDown=false }
	handleMouseDown = (e:MouseEvent) => {
		const shouldStartDrawing = e.button === MouseButtons.Left && !e.ctrlKey
		if (shouldStartDrawing){
			this.isPointerDown = true;
			pubsub.publish<Vector2>(PenChannel.Down, this.createPenPosition(e))
		}

	}
	handleMouseMove = (e:MouseEvent) => {
		if (this.isPointerDown) {
			pubsub.publish<Vector2>(PenChannel.Move, this.createPenPosition(e))
		}
	}
	createPenPosition(e: MouseEvent): Vector2 {
		const midWidth = window.innerWidth * .5;
		const midHeight = window.innerHeight * .5;
		return (
			{
				x: (e.clientX - midWidth) / midWidth,
				y: (e.clientY - midHeight) / midHeight
			}
		)
	}
}