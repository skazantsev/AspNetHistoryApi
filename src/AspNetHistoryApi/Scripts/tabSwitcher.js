window.tabSwitcher = (function () {
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

                var $tabLink = _.has(routeTable, window.location.pathname)
                    ? routeTable[window.location.pathname]
                    : routeTable[options.defaultRoute];


                $tabLink.focus().trigger('click');
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
        history.replaceState({ role: 'tab' }, null, document.location.pathname);
    };

    function navigationSucceeded(tab) {
        var $tab = $(tab),
            $title = $(options.titleSelector),
            tabHref = $tab.attr('href');

        if ($title.length) {
            document.title = $title.val();
        }

        if (!popstateInProgress && document.location.pathname !== tabHref) {
            history.pushState({ role: 'tab' }, null, tabHref);
        }
    };

    function navigationFailed(tab) {
        $(tab).blur();
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