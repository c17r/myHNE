import $ from 'jquery';

function row($tree, highlightClass, selector, direction) {
	const firstSelector = selector + ':first',
		$current = $tree.find('tr.athing.' + highlightClass);
	let $new;

	if ($current.length == 0) {
		$new = $tree.find(firstSelector);
	} else {
		if (direction == NEXT) {
			$new = $current.nextAll(firstSelector)
		} else {
			$new = $current.prevAll(firstSelector);
		}
	}

	if ($new.length == 0) {
		return;
	}
	$current.removeClass(highlightClass);
	$new.addClass(highlightClass);
	scrollToView($new);
}

function scrollToView($el) {
	const $window = $(window),
		viewportHeight = $(window).outerHeight(),
		elementTop = $el.offset().top,
		elementHeight = $el.outerHeight(),
		scroll = elementTop - ((viewportHeight - elementHeight) / 2);

	$window.scrollTop(scroll);
}

function op($tree) {
	const op = $('td.subtext a.hnuser').text();

	$tree
		.find(`a.hnuser:contains(${op})`)
		.each(function() {
			const $commenter = $(this),
				commenterName = $commenter.text();

			/*
				we do this check in case the op's username
				is something short and is contained inside
				someone else's longer username.  The odds
				of this happening on a single thread are
				small, but might as well check anyway.
			 */
			if (commenterName != op) {
				return;
			}

			$commenter.addClass('myhne-highlight-op');
		});

}

export default {
	row,
	op
}

export const PREV = -1;
export const NEXT = 1;
