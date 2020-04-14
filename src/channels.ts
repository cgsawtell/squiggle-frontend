
export class PenChannel {
	static readonly Move = Symbol("Pen:Move");
	static readonly Down = Symbol("Pen:Down");
}

export class DrawingChannel {
	static readonly StrokeUpdated = Symbol("Drawing:StrokeUpdated");
}

export class NetworkErrorChannel {
	static readonly NotFound = Symbol("NetworkError:NotFound");
	static readonly ServerError = Symbol("NetworkError:ServerError");
}

export class PalleteChannel {
	static readonly ColourChange = Symbol("Pallete:ColourChange");
}
