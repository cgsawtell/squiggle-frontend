import { drop } from "./helpers/array"

type Listener<Payload> = (payload:Payload) => void

class PubSub {
	listeners = new Map<Symbol, Listener<any>[]>()
	subscribe<P = undefined>(channel: Symbol, listener: Listener<P>){
		if(!this.listeners.has(channel)){
			this.listeners.set(channel, [listener])
		}else{
			const oldListeners = this.listeners.get(channel) ?? []
			this.listeners.set(channel, [...oldListeners, listener])
		}
	}
	unsubscribe<P = undefined>(channel: Symbol, listener: Listener<P>){
		if (!this.listeners.has(channel)) {
			return
		}
		const listenersForChannel = this.listeners.get(channel) as Listener<P>[]
		const updatedListeners = drop<Listener<P>>(listenersForChannel, listener)
		this.listeners.set(channel, updatedListeners)
	}
	publish<P = undefined>(channel: Symbol, payload?: P){
		const listenersForChannel = this.listeners.get(channel) ?? []
		listenersForChannel.forEach(listener => listener(payload))
	}
}

export default new PubSub()