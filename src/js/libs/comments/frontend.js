/*
clicking to collapse:
	* add <coll> to TR
	* recoll()
	* update server

clicking to expand:
	* move <coll> to TR
	* recoll()
	* updateserver

recoll():
	* expand()
	* squish()

squish(TR):
	* add <noshow> to child TRs of TR
	* add <noshow> to TR > .comment
	* add <nosee> to TR > .votelinks
	* TR > .togg *text* set to "[" + TR > .togg.n  + "]"

expand(TR):
	* remove <noshow> on TR
	* remove <noshow> on TR > .comment
	* remove <nosee> on TR > .votelinks
	* TR > .togg *text* set to "[-]"
*/
import $ from 'jquery';
import moment from 'moment';

import inject from '../../utils/inject';

function expand(sel) {
	sel.find('.coll').removeClass('coll');
	sel.find('.noshow').removeClass('noshow');
	sel.find('.nosee').removeClass('nosee');
	sel.find('.togg').text('[-]');
}

function collapse(sel) {
	sel.addClass('coll');
	sel.find('.comment').addClass('noshow')
	sel.find('.votelinks').addClass('nosee');
	sel.find('a.togg').each((i, e) => {
		const children = e.getAttribute('n');
		e.innerText = `[+${children}]`;
	});
}

function massCollapse(entries) {
	if (entries.length == 0) {
		return;
	}

	chrome.runtime.sendMessage(
		{method: 'masscollapse', data:entries},
		() => {}
	);
}

function expandAll() {
	const idsToExpand = $('table.comment-tree tr.athing.coll')
		.removeClass('coll')
		.map((i, entry) => {
			return {
				id: entry.id,
				un: true,
			};
		});

	inject(function() {
		window.recoll();
	});

	massCollapse([...idsToExpand]);
}

function topLevel() {
	const idsToExpand = $('table.comment-tree tr.athing.coll[level=0]')
		.removeClass('coll')
		.map((i, entry) => {
			return {
				id: entry.id,
				un: true,
			};
		});
	const idsToCollapse = $('table.comment-tree tr.athing[level=1]:not(.coll)')
		.addClass('coll')
		.map((i, entry) => {
			return {
				id: entry.id,
				un: false,
			};
		});

	inject(function() {
		window.recoll();
	});

	massCollapse([...idsToExpand, ...idsToCollapse])
}

function getLastComment(storyId) {
	return new Promise((resolve, reject) => {
		chrome.runtime.sendMessage(
			{method: 'getlastcomment', data:storyId},
			function(response) {
				if (response) {
					resolve(response);
				} else {
					reject(response);
				}
			}
		)
	});
}

function getMassLastComment(storyIds) {
	return new Promise((resolve, reject) => {
		chrome.runtime.sendMessage(

		)
	})
}

function setLastComment(storyId, lastId) {
	chrome.runtime.sendMessage(
		{method: 'setlastcomment', data:{storyId, lastId}},
		() => {}
	)
}

function markNewComments($parent, storyId) {
	return new Promise((resolve, reject) => {
		getLastComment(storyId)
			.then((lastId) => {

				let marks = $parent
						.find('tr.athing')
						.filter((i, e) => Number(e.id) > lastId)
						.addClass('myhne-new-comment');

				while(marks.length > 0) {
					marks = marks
								.filter(':not([level=0])')
								.map(function() {
									const parentId = $(this).attr('parent');
									return $(`tr#${parentId}`)[0];
								})
								.filter(':not(.myhne-new-comment)')
								.addClass('myhne-new-parent');
				}

				resolve('');
			})
			.catch(()=> {
				// no entry in storage, first time viewing
				resolve('');
			});
	})

}

export default {
	expandAll,
	topLevel,
	getLastComment,
	setLastComment,
	markNewComments,
}
