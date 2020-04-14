import pubsub from "../pubsub"
import { NetworkErrorChannel } from "../channels"

export const publishNotFoundEvent = () => pubsub.publish(NetworkErrorChannel.NotFound)