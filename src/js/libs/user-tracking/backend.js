import pickBy from 'lodash/pickBy';
import find from 'lodash/find';

function onUserTagsLookup(hnNames, sendResponse) {
	chrome.storage.sync.get('ut', function(data) {
		const rv = pickBy(data['ut'], (v, k) => find(hnNames, k));
		sendResponse(rv);
	});
}

function onAddUserTag(data) {
	chrome.storage.sync.get('ut', function(data) {
		data['ut'][name] = tag;
		chrome.storage.sync.set(data);
	});
}

function onRemoveUserTag(data) {
	chrome.storage.sync.get('ut', function(data) {
		let items = data['ut'];
		items = pickBy((v, k) => k !== name);
		data['ut'] = items;
		chrome.storage.sync.set(items);
	});
}

export default {
	onUserTagsLookup,
}
