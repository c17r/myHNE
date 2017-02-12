import $ from 'jquery';

export default function loggedIn() {
	return $('span.pagetop a[href^=logout]').length > 0;
};
