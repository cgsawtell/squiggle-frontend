export interface Vector2 {
	x: number;
	y: number;
}

export type Colour = "Black" | "Red" | "Green" | "Blue"

export enum Tool {
	Pencil,
	Eraser
}

export interface Stroke {
	ratio: number;
	colour: Colour;
	mode: Tool;
	segments: Vector2[]
}