import $ from 'jquery';
import _ from 'lodash';

import keyboard from '../utils/keyboard';
import url from '../utils/url';

import opener from '../libs/opener/frontend';
import highlighter, {PREV, NEXT} from '../libs/highlighter';

const $storyTable = $('table.itemList');
const storyCount = $storyTable.find('tr.athing').length - 1;
const highlightClass = 'myhne-story-highlight'

function removeRank() {
	$storyTable
		.find('span[class=rank]')
		.remove();
};

function removeScore($parent) {
	$parent
		.find('span.score')
		.remove();
}

function commentCount($parent) {
	const $comment = $parent.find('a[href^=item]:eq(-1)'),
		commentText = $comment.text();

	let commentCount = 'N/A',
		commentUrl = '';

	if (/discuss/.test(commentText)) {
		commentCount = '0';
		commentUrl = $comment.attr('href');
	}
	else if (/comment/.test(commentText)) {
		commentCount = commentText.split('\xa0')[0];
		commentUrl = $comment.attr('href');
	}

	let $newComments = undefined;
	if (commentUrl == '') {
		$newComments = $('<span/>');
	} else {
		$newComments = $('<a/>').attr('href', commentUrl);
	}

	$newComments.addClass('myhne-comment-count');
	$newComments.append(commentCount);

	$parent
		.parent()
		.prev()
		.find('td.title:eq(0)')
		.append($newComments)

}

function moveUser($parent) {
	const $user = $parent
					.find('a.hnuser')
					.remove();

	const $newUser = $('<span/>')
						.addClass('myhne-submitter')
						.append('by ')
						.append($user);

	$parent
		.parent()
		.prev()
		.find('td.title:eq(1)')
		.append($newUser);
}

function moveTime($parent) {
	const $age = $subText
					.find('span.age')
					.remove()
					.removeClass('age')
					.addClass('myhne-age');

	$parent
		.parent()
		.prev()
		.find('td.title:eq(1)')
		.append($age);
}

function addActions($parent) {
	const $actions = $('<span/>')
						.addClass('myhne-actions')
						.append(
							$parent.find('a[href^=flag]'),
							$parent.find('a[href^=vouch]'),
							$parent.find('a[href^="https://hn.algolia.com/?query="]'),
							$parent.find('a[href^="https://www.google.com/search?q="]')
						);
	$parent
		.parent()
		.prev()
		.find('td.title:eq(1)')
		.append($actions)
}

function reDoSubText() {
	$storyTable
		.find('td.subtext')
		.each(function() {
			const $subText = $(this);

			removeScore($subText);

			commentCount($subText);

			moveUser($subText);

			addActions($subText);

			$subText.remove();
		});
};

function openLinks(rowNum) {
	const $current = $storyTable.find('tr.athing.' + highlightClass);
	if ($current.length == 0) {
		return;
	}

	const storyHref = url.fixUrl($current
									.find('a.storyLink')
									.attr('href')
								),
		commentHref = url.fixUrl($current
									.find('a[href^=item]')
									.attr('href')
								),
		urls = opener.urlOrderBySettings(storyHref, commentHref)

		urls = _.uniq(urls);
		opener.openBySettings(...urls);
}

function addKeyboardControls() {

	keyboard.wire(
		{
			keys: ['k', 'K'],
			action: () => highlighter.row($storyTable, highlightClass, 'tr.athing', PREV)
		},

		{
			keys: ['j', 'J'],
			action: () => highlighter.row($storyTable, highlightClass, 'tr.athing', NEXT)
		},

		{
			keys: ['o', 'O'],
			action: () => openLinks()
		}
	)
}

export default function main() {

	removeRank();
	reDoSubText();
	addKeyboardControls();
};
