import Drawing from "../drawing";
import { publishNotFoundEvent, createSecurityOptionsParams } from "./helpers";
import { api } from "./base";
import { Security } from "../core/Security";

const drawingAPI = api.url("drawing")

export const get = ( id:number ) => (
	drawingAPI
		.options({
			context: {
				token: Security.token
			}
		})
		.url(`/${id}`)
		.get()
		.notFound( publishNotFoundEvent )
		.json()
)

export const post = (drawing: Drawing) => (
	drawingAPI
		.options({
			context: {
				token: Security.token
			}
		})
		.post(drawing).json()
)
	
	export const patch = (drawing: Drawing) => (
		drawingAPI
			.options({
				context: {
					token: Security.token
				}
			})
			.url(`/${drawing.id}`)
			.patch(drawing)
			.notFound( publishNotFoundEvent )
			.json()
)