
function open(style, urls) {
	if (urls.length == 0) {
		return;
	}

	chrome.runtime.sendMessage(
		{method: style, data:urls},
		() => {}
	);
}

function openWindows(...urls) {
	open('openwindows', urls);
}

function openTabs(...urls) {
	open('opentabs', urls);
}

function openBySettings(...urls) {
	const openStyle = window.myhne.settings.openStyle;

	(openStyle == 'open_tabs' ? openTabs : openWindows)(...urls);
}

function urlOrderBySettings(story, comment) {
	const openOrder = window.myhne.settings.openOrder;

	switch(openOrder) {
		case 'do_nothing':
			return [];
		case 'story_only':
			return [story];
		case 'comments_only':
			return [comment];
		case 'story_comments':
			return [story, comment];
		case 'comments_story':
			return [comment, story];
	}
}



export default {
	openWindows,
	openTabs,
	openBySettings,
	urlOrderBySettings
}
