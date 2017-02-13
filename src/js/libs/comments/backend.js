import _ from 'lodash';
import $ from 'jquery';
import moment from 'moment';

import debug from '../../utils/debug'

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
			debug('HNCollapse', 'No more entries, stopping');
			return;
		}

		debug('HNCollapse', `Entry: ${entry.id}, ${entry.un}`);
		const url = `https://news.ycombinator.com/collapse?id=${entry.id}` + (entry.un ? '&un=true': '');
		$.get(url)
			.done(() => {
				setTimeout(recurse, 0);
			})
			.fail(() => {
				entries.push(entry);
				debug('HNCollapse', `Failed, retrying`);
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
			debug('onGetLastComment, found', rv);
			sendResponse(rv);
		} else {
			debug('onGetLastComment, not found');
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

	debug('onSetLastComment, data', data, data['itemInfo']);

	chrome.storage.sync.get('lc', function(data) {
		debug('onSetLastComment, BEFORE', data['lc']);
		data['lc'][storyId] = arr;
		debug('onSetLastComment, AFTER', data['lc']);
		chrome.storage.sync.set(data);
	});
}

function purgeOldLastComment() {
	const today = moment.utc();

	chrome.storage.sync.get('lc', function(data) {
		let items = data['lc'];
		debug('purgeOldLastComment, BEFORE', items);
		items = _.pickBy(items, (v, k) => today.diff(moment(v[v.length-1], 'x'), 'weeks') < 6);
		debug('purgeOldLastComment, AFTER', items);
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
