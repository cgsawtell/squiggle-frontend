export function drop<T>(arrayToManipulate: Array<T>, itemToDrop: T){
	const itemToDropIndex = arrayToManipulate.indexOf(itemToDrop)
	return [...arrayToManipulate.slice(0, itemToDropIndex - 1), ...arrayToManipulate.slice(itemToDropIndex + 1, arrayToManipulate.length - 1)]
}