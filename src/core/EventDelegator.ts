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

	#addListenerToType = <K extends keyof DocumentEventMap>(type: DocumentEventMapKey, selector: string, handler: EventListener<DocumentEventMap[K]>) => {
		const eventListenersForType = this.eventMap.get(type) as SelectorHandlerMap<DocumentEventMap[K]>
		if (typeof eventListenersForType === "undefined"){
			return
		}

		const eventListenersForSelector = eventListenersForType.get(selector)
		if (typeof eventListenersForSelector !== "undefined") {
			eventListenersForSelector.push(handler)
		}
		else {
			eventListenersForType.set(selector, [handler])
		}
	}
	addEventListener = <K extends keyof DocumentEventMap>(type: K, selector: string, handler: EventListener<DocumentEventMap[K]>) => {
		if (!this.eventMap.has(type)){
			this.eventMap.set(type, new Map())
			document.addEventListener(type, this.#handleInput)
		}
		this.#addListenerToType(type, selector, handler)
	}
}

export default new EventDelegator();