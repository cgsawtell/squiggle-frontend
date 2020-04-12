export const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)

export enum MouseButtons {
	Left = 0,
	Middle = 1,
	Right = 2
}
