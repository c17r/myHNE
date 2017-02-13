import $ from 'jquery';


/*
	actions - {
		keys: ['a', 'A'],
		action: () => {
			alert('You pressed "A"');
		}
	}
 */
const IGNORE = ['INPUT', 'TEXTAREA']

function wire( ...actions) {

	$(document).on('keydown', function(e) {
		const key = String.fromCharCode(e.which);

		if (e.target) {
			if (IGNORE.indexOf(e.target.tagName) !== -1)
			return;
		}
		if (e.metaKey || e.ctrlKey || e.altKey) {
			return;
		}

		for(let action of actions) {
			if (action.keys.indexOf(key) !== -1) {
				e.preventDefault();
				action.action(e);
				return;
			}
		}
	});

}

export default {
	wire
}
