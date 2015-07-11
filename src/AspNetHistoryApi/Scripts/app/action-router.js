window.actionRouter = (function () {
    var location = window.history.location || window.location;

    var popstateInProgress,
        routeTable = {},
        options = {
            actionLinkSelector: '.js-action-link',
            defaultRoute: '/',
            titleSelector: 'js-page-title:first'
        };

    function init(opts) {
        _.extend(options, opts);

        $(window).on('popstate', function (e) {
            var state = e.originalEvent.state;
            if (state && state.role === 'page') {
                popstateInProgress = true;
                navigate(location.pathname);
            }
        });

        buildRouteTable(options.actionLinkSelector);
        initializeHistory();
    };

    function buildRouteTable(actionLinkSelector) {
        _.each($(actionLinkSelector), function (actionLink) {
            var $actionLink = $(actionLink);
            routeTable[$actionLink.attr('href')] = $actionLink;
        });
    };

    function initializeHistory() {
        if (!Modernizr.history) {
            if(location.pathname !== options.defaultRoute) {
                navigate(location.pathname);
            }
        }
        history.replaceState({ role: 'page' }, null, location.pathname);
    };

    function navigate(path) {
        var $actionLink = _.has(routeTable, path)
                ? routeTable[path]
                : routeTable[options.defaultRoute];
        $actionLink.focus().trigger('click');
    };

    function navigationSucceeded(actionLink) {
        var $title = $(options.titleSelector),
            actionPath = $(actionLink).attr('href');

        if ($title.length) {
            document.title = $title.val();
        }

        if (!popstateInProgress && location.pathname !== actionPath) {
            history.pushState({ role: 'page' }, null, actionPath);
        }
    };

    function navigationFailed(actionLink) {
        $(actionLink).blur();
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