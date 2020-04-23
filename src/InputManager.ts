import pubsub from "./pubsub";
import { PenChannel } from "./channels";
import { MouseButtons } from "./helpers/input";
import { Vector2 } from "./interfaces";
import EventDelegator from "./EventDelegator";

export default class InputManager{
	isPointerDown: boolean = false;
	constructor() {
		EventDelegator.addEventListener("touchstart", "#stage", this.handleInputStart)
		EventDelegator.addEventListener("mousedown", "#stage",  this.handleInputStart)

		EventDelegator.addEventListener("touchend", "document", this.handleInputEnd)
		EventDelegator.addEventListener("mouseup", "document", this.handleInputEnd)

		EventDelegator.addEventListener("touchmove", "#stage", this.handleInputMove)
		EventDelegator.addEventListener("mousemove", "#stage", this.handleInputMove)
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