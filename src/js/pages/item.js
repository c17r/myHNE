import $ from 'jquery';

import loggedIn from '../utils/logged-in';
import keyboard from '../utils/keyboard';
import inject from '../utils/inject';

import inLineReply from '../libs/inline-reply';
import parentHover from '../libs/parent-hover';
import comments from '../libs/comments/frontend';
import userTracking from '../libs/user-tracking/frontend';
import highlighter, {PREV, NEXT} from '../libs/highlighter';

const $commentTable = $('table.comment-tree');
const commentCount = $commentTable.find('tr.athing').length;
const highlightClass = 'myhne-comment-highlight'

function addAttributes() {
	let prevLevel = undefined,
		prevId = undefined,
		root = undefined,
		highestId = -1,
		parents = [];

	$commentTable.find('tr.athing').each(function() {

		const $this = $(this),
			id = Number($this.attr('id')),
			width = $this.find('td.ind img[src="s.gif"]')[0].width,
			level = width/40;

		if (id > highestId) {
			highestId = id;
		}

		if (level == 0) {
			root = id;
			parents = []
		}
		else if (level > prevLevel) {
			parents.push(prevId);
		}
		else if (level < prevLevel) {
			parents.splice(-(prevLevel - level));
		}

		$this
			.attr('level', level)
			.attr('root', root)
			.attr('parent', parents[parents.length - 1]);

		if ($this.find('td.votelinks img[src="s.gif"]').length > 0) {
			$this.attr('dead', 'dead');
		}

		prevLevel = level;
		prevId = id;
	});

	return highestId;
}

function addLinks() {
	/*
		Since saves happen on the server, We can't
		do anything unless they are logged in.
	*/
	if (!loggedIn()) {
		return;
	}

	const $subText = $('td.subtext');
	if ($subText.length == 0) {
		return;
	}

	// Expand All
	const $expandAnchor = $('<a/>')
			.text('expand all comments')
			.attr('href', 'javascript:void(0)')
			.on('click', (e) => {
				e.preventDefault();
				comments.expandAll();
			}),
		$expandSpan = $('<span/>')
			.text(' | ')
			.append($expandAnchor);

	$subText.append($expandSpan);

	// Top Level Comments
	const $topLevelAnchor = $('<a/>')
			.text('top level comments')
			.attr('href', 'javascript:void(0)')
			.on('click', (e) => {
				e.preventDefault();
				comments.topLevel();
			}),
		$topLevelSpan= $('<span/>')
			.text(' | ')
			.append($topLevelAnchor);

	$subText.append($topLevelSpan);

}

function getCurrent() {
	return new Promise((resolve, reject) => {
		const $current = $commentTable.find('tr.athing.' + highlightClass);
		if ($current.length > 0) {
			resolve($current);
		} else {
			reject('');
		}
	});
}

function upVote() {
	getCurrent()
		.then(($current) => {
			const id = $current.attr('id');

			inject((id) => {

				function my$(id) {
					return document.getElementById(id);
				}

				var unvote = my$('un_' + id);
				if (unvote) {
					unvote.click();
					return;
				}

				my$('up_' + id).click();

			}, id);
		});
}

function reply() {
	getCurrent()
		.then(($current) => {
			$current.find('a[href^=reply]').click();
		});
}

function addKeyboardControls() {
	const items = 'tr.athing:not(.coll,.noshow)',
		threads = 'tr.athing:not(.coll,.noshow)[level=0]';

	keyboard.wire(
		{
			keys: ['u', 'U'],
			action: () => highlighter.row($commentTable, highlightClass, threads, PREV)
		},
		{
			keys: ['k', 'K'],
			action: () => highlighter.row($commentTable, highlightClass, items, PREV)
		},

		{
			keys: ['j', 'J'],
			action: () => highlighter.row($commentTable, highlightClass, items, NEXT)
		},
		{
			keys: ['n', 'N'],
			action: () => highlighter.row($commentTable, highlightClass, threads, NEXT)
		},

		{
			keys: ['h', 'H'],
			action: () => upVote()
		},
		{
			keys: ['r', 'R'],
			action: () => reply()
		}
	)
}

function getStoryId() {
	return window.location.search.split('=')[1];
}

export default function main() {
	const storyId = getStoryId();

	const lastId = addAttributes();

	addLinks();
	inLineReply.wire($commentTable);
	parentHover.wire($commentTable);
	highlighter.op($commentTable);
	addKeyboardControls();

	comments.markNewComments($commentTable, storyId)
		.then(() => {
			comments.setLastComment(storyId, lastId, commentCount);
		});
};
