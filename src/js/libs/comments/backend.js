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

function lcToItem(arr) {
	return {
		lastId: arr[0],
		commentCount: arr[1],

		ts: arr[arr.length-1],
	}
}

function itemToLc(item) {
	return [
		Number(item['lastId']),
		Number(item['commentCount']),

		Number(moment.utc().format('x')),
	]
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
			const rv = lcToItem(entry);
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
		const items = data['lc'],
				rv = _.pickBy(items, (v, k) => storyIds.indexOf(k) != -1);
		sendResponse(_.mapValues(rv, (arr) => lcToItem(arr)));
	});
}

function onSetLastComment(data) {
	const storyId = data['storyId'],
		arr = itemToLc(data['itemInfo']);

	output('onSetLastComment, data', data, data['itemInfo']);

	chrome.storage.sync.get('lc', function(data) {
		output('onSetLastComment, BEFORE', data['lc']);
		data['lc'][storyId] = arr;
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
