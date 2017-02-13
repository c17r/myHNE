
function fixUrl(partial) {
	if (/^https?:\/\//.test(partial)) {
		return partial;
	}
	return getBase(partial);
}

function getBase(partial='') {
	const host = window.location.origin;
	if (partial.length) {
		if (!/^\//.test(partial)) {
			partial = '/' + partial;
		}
	}

	return host + partial;
}

export default {
	fixUrl,
	getBase
}
