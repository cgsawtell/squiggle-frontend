import pubsub from "../core/PubSub"
import { NetworkErrorChannel } from "../channels"

export const publishNotFoundEvent = () => pubsub.publish(NetworkErrorChannel.NotFound)