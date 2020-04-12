import { Vector2, Stroke, Colour } from "./interfaces";
import Drawing from "./drawing";
import pubsub from "./pubsub";
import { DrawingChannel } from "./channels";

const HexColourPalete: Record<Colour, string> = {
	"Black": "#343030",
	"Red": "#D9392E",
	"Green": "#59D92E",
	"Blue": "#2E7DD9"
}

export default class Renderer {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	#virtualWidth: number = this.clientWidth * window.devicePixelRatio;
	#virtualHeight: number = this.clientHeight * window.devicePixelRatio;
	#activeDrawing: Drawing | null = null;
	constructor( canvas: HTMLCanvasElement ) {
		this.canvas = canvas;
		const canvasContext = canvas.getContext('2d')
		if (canvasContext === null) {
			throw new Error("Unable to find 2d context")
		}
		this.ctx = canvasContext;
		this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
		this.setCanvasScale();

		pubsub.subscribe<Stroke>(DrawingChannel.StrokeUpdated, this.handleStrokeUpdated)
		window.addEventListener("resize", () => {
			this.setCanvasScale()
			this.redraw()
		})
	}
	
	setCanvasScale = () => {
		this.#virtualWidth = this.clientWidth * window.devicePixelRatio
		this.#virtualHeight = this.clientHeight * window.devicePixelRatio
		this.canvas.width = this.#virtualWidth
		this.canvas.height = this.#virtualHeight
		this.canvas.style.width = this.clientWidth + "px"
		this.canvas.style.height = this.clientHeight + "px"
	}
	get clientWidth (){
		return document.documentElement.clientWidth
	}
	get clientHeight (){
		return document.documentElement.clientHeight
	}
	handleStrokeUpdated = (updatedStroke: Stroke) => {
		const strokeSegments = updatedStroke.segments
		const previousPenPosition = strokeSegments[strokeSegments.length - 2]
		const newPenPosition = strokeSegments[strokeSegments.length - 1]
		this.drawLineSegment(previousPenPosition, newPenPosition, updatedStroke.ratio, updatedStroke.colour)
	}

	drawLineSegment(startPosition: Vector2, endPosition: Vector2, ratio: number, colour: Colour){
		const startCoord = this.strokeCoordToPixel(startPosition, ratio)
		const endCoord = this.strokeCoordToPixel(endPosition, ratio)
		this.ctx.strokeStyle = HexColourPalete[colour]
		this.ctx.beginPath();
		this.ctx.moveTo(startCoord[0], startCoord[1]);
		this.ctx.lineTo(endCoord[0], endCoord[1]);
		this.ctx.lineWidth = 3;
		this.ctx.stroke();
	}
	set activeDrawing(drawing: Drawing) {
		this.#activeDrawing = drawing
		this.redraw();
	}
	redraw(){
		if(this.#activeDrawing === null){
			return
		}
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
		this.#activeDrawing.canvas.strokes.forEach((stroke:Stroke) => { this.drawStroke(stroke) })
	}
	drawStroke(stroke: Stroke){
		stroke.segments.forEach((position, i) => {
			if (i < stroke.segments.length - 1) {
				const nextPosition = stroke.segments[i + 1]
				this.drawLineSegment(nextPosition, position, stroke.ratio, stroke.colour)
			}
		})
	}
	strokeCoordToPixel(position: Vector2, strokeRatio: number):[number,number]{
		const midWidth = this.#virtualWidth * .5;
		const midHeight = this.#virtualHeight * .5;

		const x = midWidth * position.x + midWidth
		const y = midWidth * position.y / strokeRatio + midHeight
		
		return [x, y]
	}
}