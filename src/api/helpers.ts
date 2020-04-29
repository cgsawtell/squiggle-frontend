import pubsub from "../core/PubSub"
import { NetworkErrorChannel } from "../channels"
import { Security } from "../core/Security";

export const publishNotFoundEvent = () => pubsub.publish(NetworkErrorChannel.NotFound)

export const createSecurityOptionsParams = () => (
	[
		{
			context: {
				token: Security.token
			}
		},
		true
	]
)