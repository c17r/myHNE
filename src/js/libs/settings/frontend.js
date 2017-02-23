import each from 'lodash/each';
import find from 'lodash/find';

import settingsTemplate from './templates/settings.mustache';

const SETTINGS_OPTIONS = [
	{
		name: 'open_order',
		description: '\'O\'pen Behavior',
		options: [
			{name: 'Do Nothing', value: 'do_nothing'},
			{name: 'Story Links Only', value: 'story_only'},
			{name: 'Comments Only', value: 'comments_only'},
			{name: 'Story then Comments', value: 'story_comments'},
			{name: 'Comments then Story', value: 'comments_story'},
		],
		default: 'story_comments'
	},

	{
		name: 'open_style',
		description: 'Open Link Style',
		options: [
			{name: 'Open Tabs', value:'open_tabs'},
			{name: 'Open Windows', value:'open_windows'},
		],
		default: 'open_tabs'
	},

	{
		name: 'new_comment_zero',
		description: 'Show/Hide Zero When No New Comments',
		options: [
			{name: 'Show Zero', value:'show_zero'},
			{name: 'Hide Zero', value:'hide_zero'},
		],
		default: 'show_zero'
	}
];

function getSetting(name) {
	return getAllSettings()
		.then((settings) => {
			if (settings[name])
				return Promise.resolve(settings[name]);
			else
				return Promise.reject('Invalid Setting Name');
		});
}

function getAllSettings() {
	return new Promise((resolve, reject) => {
		chrome.storage.sync.get('settings', function(data) {
			let settings = data['settings'];
			if (!settings)
				settings = {}

			each(SETTINGS_OPTIONS, (setting) => {
				const name = setting['name'],
					options = setting['options'],
					option_default = setting['default'];

				if (!settings[name])
				{
					settings[name] = option_default;
				} else {
					const val = find(options, (v) => v['value'] == settings[name]);
					if (!val) {
						settings[name] = option_default;
					}
				}
			})

			resolve(settings);
		});
	});
}

function saveSetting(name, value) {
	const item = find(SETTINGS_OPTIONS, (v) => v['name'] == name);
	if (!item) {
		alert('unknown setting');
		return;
	}
	const item_value = find(item['options'], (v) => v['value'] == value);
	if (!item_value) {
		alert('unknown setting value');
		return;
	}

	chrome.storage.sync.get('settings', function(data) {
		data['settings'][name] = value;
		chrome.storage.sync.set(data);
	})

}

function createOptions($parent, currentSettings) {
	$parent.prepend(settingsTemplate.render({settings:SETTINGS_OPTIONS}));

	each(currentSettings, (v, k) => {
		$parent.find(`#${k} option[value='${v}']`).attr('selected', true);
	});
}

function saveOptions($parent) {
	return new Promise((resolve, reject) => {
		let newSettings = {};

		each(SETTINGS_OPTIONS, (item) => {
			const name = item['name'];
			newSettings[item['name']] = item['default'];

			const $option = $parent.find(`#${name}`);
			if ($option.length == 1) {
				newSettings[item['name']] = $option.val();
			}
		});



		chrome.storage.sync.set({settings: newSettings}, function() {
			resolve();
		});
	});
}

function syncSettings(callback) {
	chrome.storage.onChanged.addListener(function(changes, area) {
		if (area != 'sync' || !changes['settings']) {
			return;
		}
		callback(changes['settings']['newValue']);
	});
	return 	getAllSettings();
}

export default {
	getSetting,
	getAllSettings,
	createOptions,
	saveOptions,
	syncSettings
}
