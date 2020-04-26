import { Vector2, Stroke, Colour, Tool } from "./interfaces";
import Drawing from "./drawing";
import pubsub from "./core/pubsub";
import { DrawingChannel } from "./channels";

const HexColourPalete: Record<Colour, string> = {
	"Black": "#343030",
	"Red": "#D9392E",
	"Green": "#59D92E",
	"Blue": "#2E7DD9"
}

export default class Renderer {
	canvas: HTMLCanvasElement | null = null;
	ctx: CanvasRenderingContext2D | null = null;
	#activeDrawing: Drawing | null = null;
	#virtualWidth: number = this.clientWidth * window.devicePixelRatio;
	#virtualHeight: number = this.clientHeight * window.devicePixelRatio;
	constructor() {
		pubsub.subscribe<Drawing>(DrawingChannel.ChangedDrawing, this.updateActiveDrawing)
		pubsub.subscribe<Stroke>(DrawingChannel.StrokeUpdated, this.handleStrokeUpdated)

		window.addEventListener("resize", this.onWindowResize)
	}

	onWindowResize = () => {
		this.setCanvasScale()
		this.redraw()
	}

	initCanvas = () => {
		this.canvas = document.getElementById("stage") as HTMLCanvasElement;
		const canvasContext = this.canvas.getContext('2d')
		if (canvasContext === null) {
			throw new Error("Unable to find 2d context")
		}
		this.ctx = canvasContext;
		this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
		this.setCanvasScale();
	}
	setCanvasScale = () => {
		if(this.canvas === null){
			return
		}

		this.#virtualWidth = this.clientWidth * window.devicePixelRatio
		this.#virtualHeight = this.clientHeight * window.devicePixelRatio
		this.canvas.width = this.#virtualWidth
		this.canvas.height = this.#virtualHeight
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
		this.drawLineSegment(previousPenPosition, newPenPosition, updatedStroke)
	}

	drawLineSegment(startPosition: Vector2, endPosition: Vector2, stroke: Stroke){
		if(this.ctx === null){
			return
		}
		const startCoord = this.strokeCoordToPixel(startPosition, stroke.ratio)
		const endCoord = this.strokeCoordToPixel(endPosition, stroke.ratio)

		if(stroke.mode === Tool.Pencil){
			this.ctx.strokeStyle = HexColourPalete[stroke.colour]
			this.ctx.lineWidth = 3;
		}

		if(stroke.mode === Tool.Eraser){
			this.ctx.strokeStyle = "#FFFFFC";
			this.ctx.lineWidth = 10;

		}

		this.ctx.beginPath();
		this.ctx.moveTo(startCoord[0], startCoord[1]);
		this.ctx.lineTo(endCoord[0], endCoord[1]);
		this.ctx.stroke();
	}
	updateActiveDrawing = (drawing: Drawing) => {
		this.#activeDrawing = drawing;
		this.redraw();
	}
	redraw(){
		if (this.#activeDrawing === null || this.canvas === null || this.ctx === null){
			console.log(this.#activeDrawing, this.canvas, this.ctx );
			
			return
		}
		
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
		this.#activeDrawing.canvas.strokes.forEach((stroke:Stroke) => { this.drawStroke(stroke) })
	}
	drawStroke(stroke: Stroke){
		stroke.segments.forEach((position, i) => {
			if (i < stroke.segments.length - 1) {
				const nextPosition = stroke.segments[i + 1]
				this.drawLineSegment(nextPosition, position, stroke)
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