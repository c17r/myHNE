import comments from '../src/js/libs/comments/backend';
import opener from '../src/js/libs/opener/backend';
import debug from '../src/js/utils/debug';

const FUNCS = {
	masscollapse: comments.onMassCollapse,
	openwindows: opener.onOpenWindows,
	opentabs: opener.onOpenTabs,
	getlastcomment: comments.onGetLastComment,
	setlastcomment: comments.onSetLastComment,
	getmasslastcomment: comments.onGetMassLastComment,
}

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		const method = request.method.toLowerCase();
		const data = request.data;

		debug('method call:', method, data);

		FUNCS[method](data, sendResponse);
		return true;
	}
);

function clean() {
	comments.purgeOldLastComment();

	// always last line
	setTimeout(clean, 1000*60*30);
}
clean();
