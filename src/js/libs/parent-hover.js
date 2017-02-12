import $ from 'jquery';

function createPopup(el, $tree) {
	const $el = $(el);
	if ($el.find('.myhne-parent-container').length > 0) {
		return;
	}

	const $tr = $el.parents('tr.athing'),
		parentId = $tr.attr('parent'),
		$parent = $tree.find('tr.athing#' + parentId);

	if ($parent.length == 0) {
		return;
	}

	const userName = $parent
			.find('a.hnuser')
			.text(),
		age = $parent
			.find('.age a')
			.text(),
		$text = $parent
			.find('div.comment span')
			.contents()
			.clone(),
		container = `	<div class="myhne-parent-container">
							<div class="myhne-parent-header">
								<span class="myhne-parent-header-name">${userName}</span>
								<span class="myhne-parent-header-age">${age}</span>
								<span class="myhne-parent-header-link"><a href="#${parentId}">goto</a></span>
							</div>
							<div class="myhne-parent-content">
							</div>
						</div>
						`,
		$container = $(container);

	$container.find('div.myhne-parent-content').append($text);
	$container.find('div.reply').remove();
	$el.append($container);
}

function showPopup(el) {
	$(el).parent().find('.myhne-parent-container').show();
}

function hidePopup(el) {
	$(el).parent().find('.myhne-parent-container').hide();
}

function wire($tree) {
	const $linkAnchor = $('<a/>')
			.attr('href', 'javascript:void(0)')
			.text('parent')
			.on('mouseenter', function() {
				createPopup(this, $tree);
				showPopup(this);
			})
			.on('mouseleave', function () {
				hidePopup(this);
			}),
		$linkSpan = $('<span/>')
			.addClass('myhne-parent')
			.append($linkAnchor);

	$tree.find('tr.athing:not([level=0]) span.comhead').append($linkSpan);
}

export default {
	wire,
}
