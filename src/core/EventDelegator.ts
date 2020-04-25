import { drop } from "../helpers/array";

interface EventListener<E> {
	(evt: E): void;
}
type DocumentEventMapKey = keyof DocumentEventMap
type SelectorHandlerMap<E> = Map<string, EventListener<E>[]>


class EventDelegator {
	eventMap: Map<DocumentEventMapKey, SelectorHandlerMap<Event>> = new Map()

	#handleInput = <K extends keyof DocumentEventMap>(e: DocumentEventMap[K]) => {
		const eventType = e.type as DocumentEventMapKey //weird typing work around
		const selectorsForEventType = this.eventMap.get(eventType)
		if (e.target instanceof Element && typeof selectorsForEventType !== "undefined"){
			this.#runEventHandlers<K>(e, selectorsForEventType)
		}
	}

	#runEventHandlers = <K extends keyof DocumentEventMap>(e: DocumentEventMap[K], selectorsForEventType: SelectorHandlerMap<DocumentEventMap[K]>) => {
		const targetElement = e.target as Element
		selectorsForEventType.forEach((eventHandlers, selector) => {
			if (targetElement.matches(selector)) {
				eventHandlers.forEach(eventHandler => eventHandler(e))
			}
		})
		if (selectorsForEventType.has("document")){
			selectorsForEventType
				.get("document")
				?.forEach(eventHandler => eventHandler(e))
		}
		
	}

	#addListenerForType = <K extends keyof DocumentEventMap>(type: DocumentEventMapKey, selector: string, handler: EventListener<DocumentEventMap[K]>) => {
		const eventListenersForType = this.eventMap.get(type) as SelectorHandlerMap<DocumentEventMap[K]> | undefined
		const eventListenersForSelector = eventListenersForType?.get(selector)

		if (typeof eventListenersForSelector !== "undefined") {
			eventListenersForSelector.push(handler)
		}
		else {
			eventListenersForType?.set(selector, [handler])
		}
	}

	#removeListenerForType = <K extends keyof DocumentEventMap>(type: DocumentEventMapKey, selector: string, handler: EventListener<DocumentEventMap[K]>) => {
		const eventListenersForType = this.eventMap.get(type) as SelectorHandlerMap<DocumentEventMap[K]> | undefined
		const eventListenersForSelector = eventListenersForType?.get(selector)
		if (typeof eventListenersForSelector === "undefined"){
			return
		}

		eventListenersForType?.set(selector, drop(eventListenersForSelector, handler))
		
	}

	addEventListener = <K extends keyof DocumentEventMap>(type: K, selector: string, handler: EventListener<DocumentEventMap[K]>) => {
		if (!this.eventMap.has(type)){
			this.eventMap.set(type, new Map())
			document.addEventListener(type, this.#handleInput)
		}
		this.#addListenerForType(type, selector, handler)
	}

	removeEventListener = <K extends keyof DocumentEventMap>(type: K, selector: string, handler: EventListener<DocumentEventMap[K]>) => {
		if (!this.eventMap.has(type)) {
			return
		}

		this.#removeListenerForType(type, selector, handler)
		const isListenersForTypeEmpty = this.eventMap.get(type)?.size === 0
		const isSelectorListenersEmpty = this.eventMap.get(type)?.get(selector)?.length === 0

		if (isSelectorListenersEmpty && isListenersForTypeEmpty){
			this.eventMap.delete(type)
		}

		if (isSelectorListenersEmpty){
			this.eventMap.get(type)?.delete(selector)
		}

	}
}

export default new EventDelegator();