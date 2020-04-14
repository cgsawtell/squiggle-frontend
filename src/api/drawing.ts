import wretch from "wretch";
import Drawing from "../drawing";
import { publishNotFoundEvent } from "./helpers";

const drawingAPI = wretch("/api/drawing")

export const get = ( id:number ) => (
	drawingAPI
		.url(`/${id}`)
		.get()
		.notFound( publishNotFoundEvent )
		.json()
)

export const post = (drawing: Drawing) => drawingAPI.post(drawing).json()

export const patch = (drawing: Drawing) => (
	drawingAPI
		.url(`/${drawing.id}`)
		.patch(drawing)
		.notFound( publishNotFoundEvent )
		.json()
)