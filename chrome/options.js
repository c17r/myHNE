import $ from 'jquery';

import settings from '../src/js/libs/settings/frontend.js';

function save_options() {
	const $tbody = $('#main tbody'),
		$status = $('#status');

	$status.text('Saving...');
	settings.saveOptions($tbody)
		.then(() => {
			setTimeout(() => {
				$status.text('');
			}, 750);
		});
}

function restore_options() {
	settings.getAllSettings()
		.then((userSettings) => {
			const $tbody = $('#main tbody');
			settings.createOptions($tbody, userSettings);
		});
}

$('document').ready(() => {
	restore_options();
	$('#save').click(save_options);
});
