import Navigo from "navigo"
import pubsub from "./core/pubsub";
import { NetworkErrorChannel } from "./channels";
import DrawingController from "./controllers/DrawingController";

const router = new Navigo(location.origin)

const initRouting = () => {
	router.on(
		{
			"drawing/:id": ({ id }) => {
				const drawingController = new DrawingController();
				drawingController.loadDrawing(parseInt(id))
			},
			"drawing": () => {
				const drawingController = new DrawingController();
				drawingController.newDrawing()
			}
		}
	)
	
	router
		.notFound(
			() => {
				console.log("404");
				pubsub.publish(NetworkErrorChannel.NotFound)
			}
		)
	
	router.resolve()
}

document.addEventListener("DOMContentLoaded", initRouting);

export default router;