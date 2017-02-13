import $ from 'jquery';
import topLevelTemplate from './templates/top-level.mustache';
import mainDropdownTemplate from './templates/main-dropdown.mustache';
import userDropdownTemplate from './templates/user-dropdown.mustache';
import linkTemplate from './templates/_link.mustache';

const MENUS = {
	'top-level': [
		{text: 'top', url: '/news', title: 'Top Stories'},
		{text: 'new', url: '/newest', title: 'Newest Stories'},
		{text: 'submit', url: '/submit', title: 'Submit a Story'},
	],

	'drop-down': [
		{text: 'best', url: '/best', title: 'Best Stories'},
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

export default function main() {
	const $headerTR = $('table#hnmain tr:eq(0)'),
		$userNav = $headerTR.find('span.pagetop:eq(1)'),
		$user = $userNav.find('a').first().remove(),
		$logOut = $userNav.find('a').first().remove();

	$headerTR
		.find('span.pagetop:eq(0)')
		.addClass('myhne-top-nav')
		.html(
			topLevelTemplate.render(
				MENUS,
				{
					'_link': linkTemplate,
					'main': mainDropdownTemplate
				}
			)
		);

	$userNav.html(
		userDropdownTemplate.render(
			{
				'username': $user.text(),
				'karma': $userNav.text().replace(/\D/g, ''),
				'logout': $logOut[0].outerHTML,
				'user-down': MENUS['user-down'],
			},
			{
				'_link': linkTemplate
			}
		)
	);
}
