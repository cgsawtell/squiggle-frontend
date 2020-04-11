export interface Vector2 {
	x: number;
	y: number;
}

export type Colour = "Black" | "Red" | "Green" | "Blue"

export interface Stroke {
	ratio: number;
	colour: Colour;
	segments: Vector2[]
}