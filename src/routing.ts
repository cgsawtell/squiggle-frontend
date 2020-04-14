import Navigo from "navigo"
import pubsub from "./pubsub";
import { NetworkErrorChannel } from "./channels";
import DrawingController from "./controllers/DrawingContoller";

const router = new Navigo(location.origin)
const drawingController = new DrawingController();

router.on(
	{
		"drawing/:id": ({ id }) => {
			drawingController.loadDrawing(parseInt(id))
		},
		"drawing": drawingController.newDrawing
	}
)

router
	.notFound(
		() => {
			pubsub.publish(NetworkErrorChannel.NotFound)
		},
		{
			// leave: () => activeUI.hideActiveErrorScreen()
		}
	)

router.resolve()

export default router;