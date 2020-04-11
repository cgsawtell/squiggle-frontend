import wretch from "wretch";
import Drawing from "../drawing";

const drawingAPI = wretch("/api/drawing")

export const get = ( id:number ) => drawingAPI.url(`/${id}`).get().json()
export const post = (drawing: Drawing) => drawingAPI.post(drawing).json()
export const patch = (drawing: Drawing) => drawingAPI.url(`/${drawing.id}`).patch(drawing).json()