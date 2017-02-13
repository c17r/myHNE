import $ from 'jquery';
import _ from 'lodash';

import keyboard from '../utils/keyboard';
import url from '../utils/url';

import opener from '../libs/opener/frontend';
import highlighter, {PREV, NEXT} from '../libs/highlighter';
import comments from '../libs/comments/frontend';

const $storyTable = $('table.itemList');
const storyCount = $storyTable.find('tr.athing').length;
const highlightClass = 'myhne-story-highlight'

function rankToCommentCount() {
	const storyIds = $.makeArray($storyTable
									.find('tr.athing')
									.map((i, e) => e.id));

	comments.getMassLastComment(storyIds)
		.then((entries) => {
			$storyTable
				.find('td.subtext')
				.each((i, e) => {
					const $subText = $(e),
						$story = $subText.parent().prev(),
						$comments = $subText.children('a[href^=item]:last').remove(),
						$rank = $story.find('span.rank').empty(),
						storyId = $story.attr('id'),
						entry = _.find(entries, (v, k) => k == storyId);

					let commentText = $comments.text();
					if (/discuss/.test(commentText)) {
						commentText = '0';
					} else if (/comment/.test(commentText)) {
						commentText = commentText.split('\xa0')[0];
					} else {
						commentText = 'N/A';
						$comments = $('<span/>');
					}

					if (entry) {
						if (commentText != 'N/A') {
							const newCount = Number(commentText) - entry['commentCount'];
							if (window.myhne.settings['new_comment_zero'] == 'show_zero' || newCount > 0) {
								commentText = `${newCount}/${commentText}`;
							}
						}
					}

					$comments.text(commentText);
					$rank.append($comments);
				});
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
	rankToCommentCount();
	addKeyboardControls();
};
