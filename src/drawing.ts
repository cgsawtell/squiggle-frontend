import {Stroke, Vector2, Colour, Tool} from "./interfaces";
import pubsub from "./core/PubSub";
import { PenChannel, DrawingChannel } from "./channels";
import { round } from "./helpers/math";

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
		pubsub.subscribe<Colour>(DrawingChannel.ColourChange, this.handleColourChange)
		pubsub.subscribe<Tool>(DrawingChannel.ToolChanged, this.handleToolChange)
	}
	compressStrokes = () => {
		const floatingPointPersision = 4
		const compressedStrokes = this.canvas.strokes.map((stroke)=>{
			const compressedSegments = stroke.segments
			.map(pos => (
					{
						x: round(pos.x, floatingPointPersision),
						y: round(pos.y, floatingPointPersision)
					}
				)
			)
			.filter((pos, i, arr) => {
				if(i !== arr.length - 1){
					const nextPos = arr[i+1]
					return !(pos.x === nextPos.x && pos.y === nextPos.y)
				}
				return true
			})
			return {...stroke,ratio:round(stroke.ratio, 2), segments: compressedSegments}
		})
		this.canvas.strokes = compressedStrokes
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