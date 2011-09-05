(function($) {

    function bindFirst($el, eventName, args) {
        args.unshift(eventName);
        $.fn.bind.apply($el, args);
        var pureEventName = $.trim(eventName).match(/[^\.]+/i)[0];
        var events = $el.data('events')[pureEventName];
        events.unshift(events.pop());
    }

    $.fn.bindFirst = function() {
        var args = $.makeArray(arguments);
        var eventsString = args.shift();
        if (eventsString) {
            $(this).each(function() {
                var $el = $(this);
                var events = eventsString.split(/\s+/);
                for (var i = 0; i < events.length; ++i) {
                    bindFirst($el, events[i], args);
                }
            });
        }

        return $(this);
    };

    $.fn.liveFirst = function() {
        var args = $.makeArray(arguments);
        var $el = $(this);
        var l = args[0].split(/\s+/).length;
        args.unshift($el.selector);

        // bind live event(s)
        $.fn.delegate.apply($(document), args);

        // move them to the top
        var events = $(document).data('events').live;
        events = events.splice(-1 * l, l).concat(events);

        return $el;
    };

})(jQuery);