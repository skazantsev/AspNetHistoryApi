window.tabSwitcher = (function () {
    var popstateInProgress,
        routeTable = {},
        options = { tabsSelector: '.js-tab', defaultRoute: '/' };

    function init(opts) {
        _.extend(options, opts);
        validateOptions(options);

        $(window).on('popstate', function (e) {
            var state = e.originalEvent.state;
            if (state && state.role === 'tab') {
                popstateInProgress = true;

                var linkId = _.has(routeTable, window.location.pathname)
                    ? routeTable[window.location.pathname]
                    : routeTable[options.defaultRoute];


                $('#' + linkId).focus().trigger('click');
            }
        });

        buildRouteTable(options.tabsSelector);
        initializeHistory();
    };

    function validateOptions(opts) {
        if (!opts.titleSelector)
            throw new Error("Please provide a value for 'titleSelector'");
    };

    function buildRouteTable(tabsSelector) {
        _.each($(tabsSelector), function (tab) {
            var $tab = $(tab);
            routeTable[$tab.attr('href')] = $tab.attr('id'); // check that id exists or use another way to track links
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