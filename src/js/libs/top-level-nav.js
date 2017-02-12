import $ from 'jquery';

const MENUS = {
	'top-level': [
		{text: 'top', url: '/news', title: 'Top Stories'},
		{text: 'new', url: '/newest', title: 'Newest Stories'},
		{text: 'best', url: '/best', title: 'Best Stories'},
		{text: 'submit', url: '/submit', title: 'Submit a Story'},
	],

	'drop-down': [
		{text: 'show', url: '/show', title: 'Show HN'},
		{text: 'shownew', url: '/shownew', title: 'New Show HN Posts'},
		{text: 'classic', url: '/classic', title: 'Only Count Votes From Accounts Older Than One Year'},
		{text: 'active', url: '/active', title: 'Active Stories'},
		{text: 'ask', url: '/ask', title: 'Ask HN'},
		{text: 'jobs', url: '/jobs', title: 'Sponsored Job Postings'},
		{text: 'bestcomments', url: '/bestcomments', title: 'Best Comments'},
		{text: 'newcomments', url: '/newcomments', title: 'New Comments'},
		{text: 'noobstories', url: '/noobstories', title: 'Stories By New Users'},
		{text: 'noobcomments', url: '/noobcomments', title: 'Comments By New Users'},
	],

	'user-down': [
		{text: 'profile', url: '/user', title: 'Your Profile and Settings'},
		{text: 'comments', url: '/threads', title: 'Your Comments and Replies'},
		{text: 'submitted', url: '/submitted', title: 'Stories You\'ve Submitted'},
		{text: 'saved', url: '/saved', title: 'Stories you\'ve Voted For'},
	]
};

function makeAnchor(entry) {
	return `<a href="${entry.url}" title="${entry.title}">${entry.text}</a>`;
}

export default function main() {

	let $headerTR = $('table#hnmain tr:eq(0)'),
		text = [];

	$headerTR
		.find('b.hname')
		.remove();
	$headerTR
		.find('td[bgcolor]')
		.removeAttr('bgcolor')
		.addClass('header-row');

	// top level nav
	MENUS['top-level'].forEach(entry => {
		text.push(makeAnchor(entry));
		text.push(' | ');
	});

	// drop down nav
	text.push('<div class="dropdown">more<div class="dropdown-content"><ul>');
	MENUS['drop-down'].forEach(entry => {
		text.push('<li>');
		text.push(makeAnchor(entry));
		text.push('</li>');
	});
	text.push('</ul></div></div>');

	$headerTR
		.find('span.pagetop:eq(0)')
		.addClass('myhne-top-nav')
		.html(text.join(''));

	// user drop down nav
	const $userNav = $headerTR.find('span.pagetop:eq(1)'),
		$user = $userNav.find('a').first().remove(),
		$logOut = $userNav.find('a').first().remove(),
		userName = $user.text(),
		karma = $userNav.text().replace(/\D/g, '');
	text = [];

	text.push(`<div class="dropdown">${userName}<div class="dropdown-content"><ul>`);
	MENUS['user-down'].forEach(entry => {
		entry.url += '?id=' + userName;
		text.push('<li>');
		text.push(makeAnchor(entry));
		text.push('</li>');
	});
	text.push('<li>' + $logOut[0].outerHTML + '</li>');
	text.push('</ul></div></div>');

	text.push(' | ');
	text.push('<span class="myhne-karma">' + karma + '</span>');

	$userNav.html(text.join(''));
}
