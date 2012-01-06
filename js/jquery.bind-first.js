(function($) {
	var JQ_VERSION = parseFloat($().version);

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

	$.fn.delegateFirst = function() {
		var $el = $(this);
        var args = $.makeArray(arguments);
        var l = (args[1] || '').split(/\s+/).length;
		$.fn.delegate.apply($el, args);
		
		$el.each(function() {
			var $el = $(this);
			var events = $el.data('events').live;
			events = events.splice(-1 * l, l).concat(events);
			$el.data('events').live = events;
			console.log(events);
		});
		
		return $el;
	};

    $.fn.liveFirst = function() {
        var $el = $(this);
        var args = $.makeArray(arguments);
        args.unshift($el.selector);

        // bind live event(s)
        $.fn.delegateFirst.apply($(document), args);

        return $el;
    };

})(jQuery);