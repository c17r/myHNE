import $ from 'jquery';

import nav from './libs/top-level-nav/frontend';
import index from './pages/index';
import item from './pages/item';
import settings from './libs/settings/frontend.js';

const PATHS = {
	'index': [
		'/',

		'/news',
		'/newest',

		'/best',
		'/show',
		'/shownew',
		'/classic',
		'/active',
		'/ask',
		'/noobstories',

		'/submitted',
		'/upvoted',
		'/favorites',
		'/hidden',
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

function updateSettings(s) {
	window.myhne = window.myhne || {};
	window.myhne.settings = s;
}

settings.syncSettings(updateSettings)
	.then((s) => {
		updateSettings(s);
		init();
	});
