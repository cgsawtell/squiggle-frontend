type TemplateFunction<P = {}> = (param?: P) => string;
declare module "*.hbs" {
	const templateFunction: <P>(param?: P) => string;
	export default templateFunction;
}

declare module "*.handlebars" {
	const templateFunction: <P>(param?: P) => string;
	export default templateFunction;
}

declare module '*.svg' {
	const assetURL: string
	export default assetURL
}
