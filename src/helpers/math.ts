export function round(value: number, decimals:number) {
	return Number(Math.round(value + 'e' + decimals as unknown as number) + 'e-' + decimals);
}