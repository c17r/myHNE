var myHNE = (function(library) {
    return library(window, document, window.jQuery);
}
(function(window, document, $) {
    return {
        forgroundInit: forgroundInit,
        backgroundInit: backgroundInit,
    }

    function backgroundInit() {

    }

    function forgroundInit() {
        $(document).ready(function() {
            setupIndexPage();
            setupTopLevelNav();

            showPage();
        });
    }

    function showPage() {
        $('body').css('visibility', 'visible');
    }

    function setupTopLevelNav() {
        var $headerTR = $('table#hnmain tr:eq(0)'),
            aHrefTemplate = _.template('<a href="<%= url %>" title="<%= title %>"><%= text %></a>')
            topLevel = [
                {text: 'top', url: '/news', title: 'Top Stories'},
                {text: 'new', url: '/newest', title: 'Newest Stories'},
                {text: 'best', url: '/best', title: 'Best Stories'},
                {text: 'submit', url: '/submit', title: 'Submit a Story'},
            ],
            dropDown = [
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
            userDown = [
                {text: 'profile', url: '/user', title: 'Your Profile and Settings'},
                {text: 'comments', url: '/threads', title: 'Your Comments and Replies'},
                {text: 'submitted', url: '/submitted', title: 'Stories You\'ve Submitted'},
                {text: 'saved', url: '/saved', title: 'Stories you\'ve Voted For'},
            ],
            text = [];

        $headerTR
            .find('b.hnname')
            .remove();
        $headerTR
            .find('td[bgcolor]')
            .removeAttr('bgcolor')
            .addClass('header-row');

        // top level nav
        _.each(topLevel, function(entry) {
            text.push(aHrefTemplate(entry));
            text.push(' | ');
        });

        // drop down nav
        text.push('<div class="dropdown">more<div class="dropdown-content"><ul>');
        _.each(dropDown, function(entry) {
            text.push('<li>' + aHrefTemplate(entry) + '</li>')
        });
        text.push('</ul></div></div>');

        $headerTR
            .find('span.pagetop:eq(0)')
            .addClass('myhne-top-nav')
            .html(text.join(''));

        // user drop down nav
        var $userNav = $headerTR.find('span.pagetop:eq(1)'),
            $user = $userNav.find('a').first().remove(),
            $logOut = $userNav.find('a').first().remove(),
            userName = $user.text(),
            karma = _.chain($userNav.text()).replace(/\D/g, '').value(),
            text = [];

        text.push('<div class="dropdown">' + userName + '<div class="dropdown-content"><ul>');
        _.each(userDown, function(entry) {
            entry.url += '?id=' + userName;
            text.push('<li>' + aHrefTemplate(entry) + '</li>');
        })
        text.push('<li>' + $logOut[0].outerHTML + '</li>');
        text.push('</ul></div></div>');

        text.push(' | ');
        text.push('<span class="myhne-karma">' + karma + '</span>');

        $userNav.html(text.join(''));
        


    }

    function setupIndexPage() {
        var path = window.location.pathname;
        if (
            path !== '/'
            && path !== '/news'
            && path !== '/newest'
            && path !== '/show'
            && path !== '/ask'
        )
        return;

        removeRank();
        processSubText();
    }

    function removeRank() {
        $("span[class=rank]").remove();
    }

    function processSubText() {
        $('td.subtext').each(function() {
            var $subText = $(this),
                $row = $subText.parent().prev(),
                $scoreTD = $row.find('td.title:eq(0)'),
                $titleTD = $row.find('td.title:eq(1)');
            
            //score 
            $subText.find('span.score').remove();

            //comment count
            var $comment = $subText.find('a[href^=item]:eq(-1)'),
                commentText = $comment.text();
                commentCount = 'N/A',
                commentUrl = '';
            if (/discuss/.test(commentText)) {
                commentCount = '0';
                commentUrl = $comment.attr('href');
            }
            else if (/comment/.test(commentText)) {
                commentCount = commentText.split('\xa0')[0];
                commentUrl = $comment.attr('href');                
            }
            if (commentUrl == '') {
                var $newComments = $('<span/>');
            } else {
                var $newComments = $('<a/>').attr('href', commentUrl);
            }
            $newComments.addClass('myhne-comment-count');
            $newComments.append(commentCount);
            $scoreTD.append($newComments);

            //user
            var $user = $subText
                            .find('a.hnuser')
                            .remove();
            var $newUser = $('<span/>')
                                .addClass('myhne-submitter')
                                .append('by ')
                                .append($user);
            $titleTD.append($newUser);

            //time
            var $age = $subText
                            .find('span.age')
                            .remove()
                            .removeClass('age')
                            .addClass('myhne-age');
            $titleTD.append($age);

            //actions
            var $actions = $('<span/>').addClass('myhne-actions').append(
                $subText.find('a[href^=flag]'),
                $subText.find('a[href^=vouch]'),
                $subText.find('a[href^="https://hn.algolia.com/?query="]'),
                $subText.find('a[href^="https://www.google.com/search?q="]')
            );
            $titleTD.append($actions);

            // done, don't need it anymore
            $subText.remove();
        });
    }

}));
