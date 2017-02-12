import $ from 'jquery';

import loggedIn from '../utils/logged-in';
import url from '../utils/url';

function createForm(el) {
	const $div = $(el).parents('div.reply');

	$div.find('p').hide();
	if ($div.find('div.myhne-ir-container').show().length == 0) {
		$div.append(`
			<div class="myhne-ir-container">
				<span class="myhne-ir-error"></span>
				<textarea></textarea>
				<div>
					<button type="submit" class="myhne-ir-submit">Reply</button>
					<button type="button" class="myhne-ir-cancel">Cancel</button>
				</div>
			</div>
		`);
	}

	const $errorSpan = $div.find('span.myhne-ir-error'),
		$textArea = $div.find('div.myhne-ir-container textarea');

	if (!loggedIn()) {
		$errorSpan.html('Please Log In');
		$textArea.attr('disabled', 'disabled');
		return;
	}

	$errorSpan.html('');
	$textArea.removeAttr('disabled');
	$textArea.focus();
}

function handleSubmit(el) {
	const $div = $(el).parents('div.reply'),
		$textArea = $div.find('div.myhne-ir-container textarea'),
		text = $textArea.val();

	if (text.length == 0) {
		return;
	}

	postBegin($div);

	postComment($div, text);
}

function disableForm($parent) {
	$parent.find('button,textarea').attr('disabled', 'disabled');
}

function enableForm($parent) {
	$parent.find('button,textarea').removeAttr('disabled');
}

function postBegin($parent) {
	const $submit = $div.find('button.myhne-ir-submit');

	$submit.attr('value', 'Posting...');
	disableForm($parent);
}

function postComment($parent, text) {
	const $replyAnchor = $div.find('a[href^=reply]'),
		urlFull = url.fixUrl($replyAnchor.attr('href'));

	$.ajax({
		accepts: 'text/html',
		url: urlFull
	})
		.done(function(html) {
			const $html = $(html),
				$form = $html.find('form[action=comment]');

			$form.find('textarea').val(text);
			const data = $form.serialize();

			$.post(url.getBase('/comments'), data)
				.done(function(html) {
					postEndSuccess($parent);
				})
				.fail(function(jqXHR, text) {
					postEndError(text);
				});
		})
		.fail(function(jqXHR, text) {
			postEndError(text);
		});
}

function postEndSuccess($parent) {
	const $textArea = $div.find('div.myhne-ir-container textarea'),
		$cancel = $div.find('button.myhne-ir-cancel'),
		$submit = $div.find('button.myhne-ir-submit'),
		$errorSpan = $div.find('span.myhne-ir-error');

	$submit.attr('value', 'Reply');

	$errorSpan.html('');
	$textArea.val('');

	enableForm($parent);

	$div.find('div.myhne-ir-container').hide();
	$div.find('p').show();
}

function postEndError($parent, errorMsg) {
	const $submit = $div.find('button.myhne-ir-submit'),
		$errorSpan = $div.find('span.myhne-ir-error');

	$submit.attr('value', 'Reply');
	$errorSpan.html(errorMsg);

	enableForm($parent);
}

function handleCancel(el) {
	const $div = $(el).parents('div.reply');

	$div.find('div.myhne-ir-container').hide();
	$div.find('p').show();
}

function wire(sel) {

	sel.on('click', 'a[href^=reply]', function(e) {
		e.preventDefault();
		createForm(this);
	});

	sel.on('click', 'button.myhne-ir-submit', function(e) {
		e.preventDefault();
		handleSubmit(this);
	});

	sel.on('click', 'button.myhne-ir-cancel', function(e) {
		e.preventDefault();
		handleCancel(this);
	});

}

export default {
	wire,
}
