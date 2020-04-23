interface EventListener<E extends Event> {
	(evt: E): void;
}
type DocumentEventMapKey = keyof DocumentEventMap
type SelectorHandlerMap = Map<string, EventListener<any>[]>


class EventDelegator {
	eventMap: Map<DocumentEventMapKey, SelectorHandlerMap> = new Map()

	#handleInput = (e: Event) => {
		const eventType = e.type as DocumentEventMapKey //weird typing work around
		const selectorsForEventType = this.eventMap.get(eventType)
		if (e.target instanceof Element && typeof selectorsForEventType !== "undefined"){
			this.#runEventHandlers(e, selectorsForEventType)
		}
	}

	#runEventHandlers = (e: Event, selectorsForEventType: SelectorHandlerMap) => {
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

	#addListenerToType = <E extends Event>(type: DocumentEventMapKey, selector: string, handler: EventListener<E>) => {
		const eventListenersForType = this.eventMap.get(type)
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
	addEventListener = <E extends Event>(type: DocumentEventMapKey, selector: string, handler: EventListener<E>) => {
		if (!this.eventMap.has(type)){
			this.eventMap.set(type, new Map())
			document.addEventListener(type, this.#handleInput)
		}
		this.#addListenerToType(type, selector, handler)
	}
}

export default new EventDelegator();