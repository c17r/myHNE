function save_options() {
	settings = {
		openOrder: document.getElementsByName('open_order').value,
		openStyle: document.getElementsByName('open_style').value
	};
	chrome.storage.sync.set(
		settings,
		function() {
			var status = document.getElementById('status');
			status.textContent = 'Options';
			setTimeout(function() {
				status.textContent = '';
			}, 750);
		}
	)
}

function restore_options() {
	chrome.storage.sync.get({
		openOrder: 'story_comments',
		openStyle: 'open_tabs'
	}, function(settings) {
		document.getElementsByName('open_order').value = settings.openOrder;
		document.getElementsByName('open_style').value = settings.openStyle;
	});
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
