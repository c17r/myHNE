# Description

Make Y Combinator's Hacker News website just a little friendlier to use.
Like many others, I enjoy the articles and even comments on Hacker News.
Out of all the community sites, their moderators do a great job at keeping
the signal-to-noise ration high.  The downside to Hacker News is the site
feels like it was built in the 90s: the ability to collapse threads was
added only in 2016.

Enhancements added:
* Keyboard navigation of index and item pages
* Additional thread functions (Expand All, Top Level) use Hacker New's built-in
	functions so everything is saved server-side
* Information for our enhancements (comment count, last ID, etc) are stored in
	Chrome's sync storage is everything stays in sync across machines.

Inspiration and bits shamelessly stolen from
* HNES
* Redit Enhancement Suite

# Dev

* Test page: https://news.ycombinator.com/item?id=13240811
* Test page for highlight-op: https://news.ycombinator.com/item?id=13303346
* Test page for parent: https://news.ycombinator.com/item?id=13326792#13326952
* Test page for performance: https://news.ycombinator.com/item?id=13301832

# Features:
* Index pages
	* [X] New style
	* [X] New menu/style to access all pages
	* [X] New comment count
	* [X] Keyboard controls
		* j - next story
		* k - previous story
		* o - open story, according to user preferences
* Story pages
	* [X] Expand All Comments (saved on HN side)
	* [X] Top Level Comments (saved on HN side)
	* [/] Inline commenting
	* [X] Parent hover
	* [X] Highlight comments from poster
	* [X] Mark new comments (stored in Chrome profile)
	* [X] Keyboard controls
		* j - next non-collapsed comment
		* k - previous non-collapsed comment
		* n - next non-collapsed thread
		* u - previous non-collapsed thread
		* h - upvote
		* r - reply

		Future?
		* f - flag     (not enough karma to test)
		* d - downvote (not enough karma to test)
		* t - first non-collapsed comment
		* b - last non-collapsed comment
		* p - show parent
		* ? - next non-collapsed new comment
		* o - open links in the current selected comment
* User Tagging
	* [ ] upvote count for user (stored in Chrome profile)
	* [ ] tag note for user (stored in Chrome profile)
* Settings
	* [X] Opener Behavior: story, comment, story/comment, comment/story
	* [X] Opener Style: new window or new tabs
	* [X] New Comment Count: show/hide zeros

# Future:
* [ ] More than just Chrome
* [ ] Async loading modular system for functionality, like RES
* [ ] Hightlight new stories on homepage?
