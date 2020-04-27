
export class PenChannel {
	static readonly Move = Symbol("Pen:Move");
	static readonly Down = Symbol("Pen:Down");
}

export class DrawingChannel {
	static readonly ChangedDrawing = Symbol("Drawing:ChangedDrawing");
	static readonly StrokeUpdated = Symbol("Drawing:StrokeUpdated");
	static readonly ToolChanged = Symbol("Drawing:ToolChanged");
	static readonly ColourChange = Symbol("Drawing:ColourChange");
}

export class NetworkErrorChannel {
	static readonly NotFound = Symbol("NetworkError:NotFound");
	static readonly ServerError = Symbol("NetworkError:ServerError");
}
