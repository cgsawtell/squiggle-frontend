import pubsub from "./pubsub";
import { PenChannel } from "./channels";
import { MouseButtons, isTouchDevice } from "./helpers/input";
import { Vector2 } from "./interfaces";

export default class InputManager{
	isPointerDown: boolean = false;
	constructor(canvas: HTMLCanvasElement) {
		if(isTouchDevice){
			canvas.addEventListener("touchstart", this.handleInputStart)
			document.addEventListener("touchend", this.handleInputEnd)
			canvas.addEventListener("touchmove", this.handleInputMove)
		}
		else{
			canvas.addEventListener("mousedown", this.handleInputStart)
			document.addEventListener("mouseup", this.handleInputEnd)
			canvas.addEventListener("mousemove", this.handleInputMove)
		}
	}
	handleInputStart = (e:MouseEvent | TouchEvent) => {
		//On desktop we need to make sure the context menu wasn't just opened
		const shouldStartDrawing = "touches" in e ? true : e.button === MouseButtons.Left && !e.ctrlKey
		if (shouldStartDrawing){
			this.isPointerDown = true;
			pubsub.publish<Vector2>(PenChannel.Down, this.createPenPosition(e))
		}

	}
	handleInputEnd = () => { this.isPointerDown=false }
	handleInputMove = (e:MouseEvent | TouchEvent) => {
		if (this.isPointerDown) {
			pubsub.publish<Vector2>(PenChannel.Move, this.createPenPosition(e))
		}
	}
	createPenPosition(e: MouseEvent | TouchEvent): Vector2 {
		const midWidth = window.innerWidth * .5;
		const midHeight = window.innerHeight * .5;
		const clientX = "touches" in e ? e.touches[0].clientX	: e.clientX 
		const clientY = "touches" in e ? e.touches[0].clientY	: e.clientY 

		return (
			{
				x: (clientX - midWidth) / midWidth,
				y: (clientY - midHeight) / midHeight
			}
		)
	}
}