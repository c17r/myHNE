
export default function inject(func, ...args) {
	let actualCode = '(' + func + ')(' + JSON.stringify(args) + ')',
		script = document.createElement('script');

	script.textContent = actualCode;
	(document.head || document.documentElement).appendChild(script);
	script.remove();
}
