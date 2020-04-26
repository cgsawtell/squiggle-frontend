declare module 'diff-dom' {
	class Diff {
		action: string;
		route: number[];
		element?: any;
		value?:string;
	}
	export class DiffDOM {
		diff(a: HTMLElement | string, b: HTMLElement | string): Diff[]
		apply(element: HTMLElement, diff: Diff[]):void
		undo(element: HTMLElement, diff: Diff[]):void
	}
}