export const renderTemplateTo = <Props extends {}>(template: TemplateFunction<Props>, props: Props, id: string) => {
	const HTMLToRender = template(props)
	const templateRoot = document.getElementById(id);
	if (templateRoot && templateRoot.innerHTML !== HTMLToRender) {
		templateRoot.innerHTML = HTMLToRender
	}
}