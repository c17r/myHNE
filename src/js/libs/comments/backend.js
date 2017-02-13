import _ from 'lodash';
import $ from 'jquery';
import moment from 'moment';

const DEBUG_PRINT = true;

function output() {
	if (!DEBUG_PRINT)
		return;
	for(var i = 0; i < arguments.length; i++)
		console.log(arguments[i]);
	console.log('--');
}

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
			const rv = {
				lastId: entry[0],
				commentCount: entry[1],
			}
			output('onGetLastComment, found', rv);
			sendResponse(rv);
		} else {
			output('onGetLastComment, not found');
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
		lastId = Number(data['itemInfo']['lastId']),
		commentCount = Number(data['itemInfo']['commentCount']);

	output('onSetLastComment, data', data, data['itemInfo']);

	chrome.storage.sync.get('lc', function(data) {
		output('onSetLastComment, BEFORE', data['lc']);
		data['lc'][storyId] = [lastId, commentCount, Number(moment.utc().format('x'))]
		output('onSetLastComment, AFTER', data['lc']);
		chrome.storage.sync.set(data);
	});
}

function purgeOldLastComment() {
	const today = moment.utc();

	chrome.storage.sync.get('lc', function(data) {
		let items = data['lc'];
		output('purgeOldLastComment, BEFORE', items);
		items = _.pickBy(items, (v, k) => today.diff(moment(v[v.length-1], 'x'), 'weeks') < 6);
		output('purgeOldLastComment, AFTER', items);
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
