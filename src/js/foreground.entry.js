import $ from 'jquery';

import nav from './libs/top-level-nav/frontend';
import index from './pages/index';
import item from './pages/item';

const PATHS = {
	'index': [
		'/',
		'/news',
		'/newest',
		'/show',
		'/ask',
	],

	'item': [
		'/item',
	],
};

function init() {
	let path = window.location.pathname;

	nav();

	if (PATHS['index'].indexOf(path) !== -1) {
		index();
	} else if (PATHS['item'].indexOf(path) !== -1) {
		item();
	}

	$('body').css('visibility', 'visible');
}

chrome.storage.sync.get({
	openOrder: 'story_comments',
	openStyle: 'open_tabs'
}, function(settings) {
	window.myhne = window.myhne || {};
	window.myhne.settings = window.myhne.settings || settings;
	init();
});
