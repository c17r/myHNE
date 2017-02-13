
export default function debug() {
	if (process.env.NODE_ENV !== 'development')
		return;

	for(var i = 0; i < arguments.length; i++)
		console.log(JSON.stringify(arguments[i]));
	console.log('--');
}
