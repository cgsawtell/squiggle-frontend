//Work around so that we can import the correct version of handlebars for helper registration
declare module 'handlebars/dist/handlebars.runtime' {
	export default Handlebars;
}