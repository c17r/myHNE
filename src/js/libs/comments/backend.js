import _ from 'lodash';
import $ from 'jquery';
import moment from 'moment';

function HNCollapse(entries) {
	function recurse() {
		const entry = entries.pop();
		if (entry == undefined) {
			console.log('No more entries, stopping');
			return;
		}

		console.log(`Entry: ${entry.id}, ${entry.un}`);
		const url = `https://news.ycombinator.com/collapse?id=${entry.id}` + (entry.un ? '&un=true': '');
		$.get(url)
			.done(() => {
				setTimeout(recurse, 0);
			})
			.fail(() => {
				entries.push(entry);
				console.log(`Failed, retrying`);
				setTimeout(recurse, 250);
			})
	}
	recurse();
}

function onMassCollapse(entries) {
	HNCollapse(entries);
}

function onGetLastComment(storyId, sendResponse) {
	chrome.storage.sync.get('lc', function(data) {
		const entry = data['lc'][storyId];

		if (entry) {
			sendResponse(entry[0]);
		} else {
			sendResponse(null);
		}
	});
}

function onGetMassLastComment(storyIds, sendResponse) {
	chrome.storage.sync.get('lc', function(data) {
		const rv = _.pickBy(data['lc'], (v, k) => _.find(storyIds, k));
		sendResponse(rv);
	});
}

function onSetLastComment(data) {
	const storyId = Number(data['storyId']),
		lastId = Number(data['lastId']);

	chrome.storage.sync.get('lc', function(data) {
		data['lc'][storyId] = [lastId, Number(moment.utc().format('x'))]
		chrome.storage.sync.set(data);
	});
}

function purgeOldLastComment() {
	const today = moment.utc();

	chrome.storage.sync.get('lc', function(data) {
		let items = data['lc'];
		items = _.pickBy((v, k) => today.diff(moment(v[1]), 'weeks') < 6);
		data['lc'] = items;
		chrome.storage.sync.set(data);
	});

}

export default {
	onMassCollapse,
	onGetLastComment,
	onSetLastComment,
	purgeOldLastComment,
	onGetMassLastComment,
}
