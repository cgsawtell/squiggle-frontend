import {Stroke, Vector2, Colour, Tool} from "./interfaces";
import pubsub from "./core/pubsub";
import { PenChannel, DrawingChannel, PalleteChannel } from "./channels";

interface DrawingCanvas {
	strokes: Stroke[];
}

export default class Drawing {
	id?:number;
	canvas: DrawingCanvas = {
		strokes:[]
	};
	#activeColour: Colour = "Black";
	#activeTool: Tool = Tool.Pencil;
	constructor(strokes: Stroke[] = []) {
		this.canvas.strokes = strokes;
		pubsub.subscribe<Vector2>(PenChannel.Move, this.handlePenMove);
		pubsub.subscribe<Vector2>(PenChannel.Down, this.handlePenDown);
		pubsub.subscribe<Colour>(PalleteChannel.ColourChange, this.handleColourChange)
		pubsub.subscribe<Tool>(DrawingChannel.ToolChanged, this.handleToolChange)
	}
	
	handleColourChange = (newColour: Colour) => {
		this.#activeColour = newColour
	}
	
	handleToolChange = (newTool: Tool) => {
		this.#activeTool = newTool
	}
	
	handlePenDown = (penPosition: Vector2) => {
		const newStroke = this.buildStroke(penPosition)
		this.addStroke(newStroke)
	}
	handlePenMove = (newPenPosition: Vector2) => {
		this.activeStroke.segments.push(newPenPosition)
		pubsub.publish(DrawingChannel.StrokeUpdated, this.activeStroke)
	}
	buildStroke(penPosition: Vector2): Stroke{
		return {
			colour: this.#activeColour,
			mode: this.#activeTool,
			ratio: window.innerWidth / window.innerHeight,
			segments: [penPosition],
		}
	}
	addStroke(stroke: Stroke){
		this.canvas.strokes.push(stroke);
	}
	get activeStroke(){
		return this.canvas.strokes[this.canvas.strokes.length - 1]
	}
}