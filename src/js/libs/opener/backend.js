
function onOpenWindows(urls) {
	open(chrome.windows, urls, {
		focused: false,
	})
}

function onOpenTabs(urls) {
	chrome.windows.getCurrent({populate: true, windowTypes: ['normal']}, function(w) {
		w.tabs.forEach((t) => {
			if (t.highlighted) {
				open(
					chrome.tabs,
					urls.reverse(),
					{
						active: false,
						index: t.index + 1,
					}
				);
				return;
			}
		});
	});
}

function open(style, urls, options) {
	for(const url of urls) {
		style.create({
			url: url,
			...options
		});
	}
}

export default {
	onOpenWindows,
	onOpenTabs
}
