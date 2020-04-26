import Handlebars from "handlebars/dist/handlebars.runtime"
import { HelperOptions } from "handlebars"
import { DiffDOM } from "diff-dom";

export const renderTemplateTo = <Props extends {}>(template: TemplateFunction<Props>, props: Props, id: string) => {
	const HTMLToRender = template(props)
	const templateRoot = document.getElementById(id);
	if (templateRoot !== null && templateRoot.innerHTML !== HTMLToRender) {
		applyDOMChanges(templateRoot, id, HTMLToRender)
	}
}

function applyDOMChanges(templateRoot:HTMLElement, id: string, HTMLToRender:string){
	const dd = new DiffDOM();
	const tempRoot = document.createElement("div");
	tempRoot.id = id;
	tempRoot.innerHTML = HTMLToRender;
	const diff = dd.diff(templateRoot, tempRoot);
	dd.apply(templateRoot, diff)
}

function isEqHelper (this: any, value1: any, value2: any, options: HelperOptions) {
	return value1 === value2
		? options.fn(this)
		: options.inverse(this);
}

export const initialiseHandleBarsHelpers = () => {
	Handlebars.registerHelper('isEq', isEqHelper);
}
