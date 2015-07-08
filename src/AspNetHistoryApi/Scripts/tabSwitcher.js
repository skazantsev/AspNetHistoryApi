window.tabSwitcher = (function () {
    var popstateInProgress,
        options = {};

    function init(opts) {
        _.extend(options, opts);
        validateOptions(options);

        $(window).on('popstate', function (e) {
            var state = e.originalEvent.state;
            if (state && state.role === 'tab') {
                popstateInProgress = true;

                $('#' + state.linkId)
                    .focus()
                    .trigger('click');
            }
        });
    };

    function validateOptions(opts) {
        if (!opts.titleSelector)
            throw new Error("Please provide a value for 'titleSelector'");
    };

    function navigationSucceeded(tab) {
        var $tab = $(tab),
            $title = $(options.titleSelector),
            tabHref = $tab.attr('href');

        if ($title.length) {
            document.title = $title.val();
        }

        if (!popstateInProgress && document.location.pathname !== tabHref) {
            history.pushState({ role: 'tab', linkId: $tab.attr('id') }, null, tabHref);
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