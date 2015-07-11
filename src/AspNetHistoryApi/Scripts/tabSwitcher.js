window.tabSwitcher = (function () {
    var location = window.history.location || window.location;

    var popstateInProgress,
        routeTable = {},
        options = { actionLinkSelector: '.js-tab-link', defaultRoute: '/' };

    function init(opts) {
        _.extend(options, opts);
        validateOptions(options);

        $(window).on('popstate', function (e) {
            var state = e.originalEvent.state;
            if (state && state.role === 'tab') {
                popstateInProgress = true;
                navigate(location.pathname);
            }
        });

        buildRouteTable(options.actionLinkSelector);
        initializeHistory();
    };

    function validateOptions(opts) {
        if (!opts.titleSelector)
            throw new Error("Please provide a value for 'titleSelector'");
    };

    function buildRouteTable(actionLinkSelector) {
        _.each($(actionLinkSelector), function (tabLink) {
            var $tabLink = $(tabLink);
            routeTable[$tabLink.attr('href')] = $tabLink;
        });
    };

    function initializeHistory() {
        if (!Modernizr.history) {
            if(location.pathname !== options.defaultRoute) {
                navigate(location.pathname);
            }
        }
        history.replaceState({ role: 'tab' }, null, location.pathname);
    };

    function navigate(path) {
        var $tabLink = _.has(routeTable, path)
                ? routeTable[path]
                : routeTable[options.defaultRoute];
        $tabLink.focus().trigger('click');
    };

    function navigationSucceeded(tabLink) {
        var $tabLink = $(tabLink),
            $title = $(options.titleSelector),
            tabHref = $tabLink.attr('href');

        if ($title.length) {
            document.title = $title.val();
        }

        if (!popstateInProgress && location.pathname !== tabHref) {
            history.pushState({ role: 'tab' }, null, tabHref);
        }
    };

    function navigationFailed(tabLink) {
        $(tabLink).blur();
        alert('Sorry, an error occured!');
    };

    function navigationCompleted() {
        popstateInProgress = false;
    };

    return {
        init: init,
        navigationSucceeded: navigationSucceeded,
        navigationFailed: navigationFailed,
        navigationCompleted: navigationCompleted
    };
})(jQuery);