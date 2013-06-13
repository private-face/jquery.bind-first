(function($) {
	var splitVersion = $.fn.jquery.split(".");
	var major = parseInt(splitVersion[0]);
	var minor = parseInt(splitVersion[1]);

	var JQ_LT_17 = (major < 1) || (major == 1 && minor < 7);
	
	function eventsData($el) {
		return JQ_LT_17 ? $el.data('events') : $._data($el[0]).events;
	}
	
	function moveHandlerToTop($el, eventName, isDelegated) {
		var data = eventsData($el);
		var events = data[eventName];

		if (!JQ_LT_17) {
			var handler = isDelegated ? events.splice(events.delegateCount - 1, 1)[0] : events.pop();
			events.splice(isDelegated ? 0 : (events.delegateCount || 0), 0, handler);

			return;
		}

		if (isDelegated) {
			data.live.unshift(data.live.pop());
		} else {
			events.unshift(events.pop());
		}
	}
	
	function moveEventHandlers($elems, eventsString, isDelegate) {
		var events = eventsString.split(/\s+/);
		$elems.each(function() {
			for (var i = 0; i < events.length; ++i) {
				var pureEventName = $.trim(events[i]).match(/[^\.]+/i)[0];
				moveHandlerToTop($(this), pureEventName, isDelegate);
			}
		});
	}
	
	$.fn.bindFirst = function() {
		var args = $.makeArray(arguments);
		var eventsString = args.shift();

		if (eventsString) {
			$.fn.bind.apply(this, arguments);
			moveEventHandlers(this, eventsString);
		}

		return this;
	};

	$.fn.delegateFirst = function() {
		var args = $.makeArray(arguments);
		var eventsString = args[1];
		
		if (eventsString) {
			args.splice(0, 2);
			$.fn.delegate.apply(this, arguments);
			moveEventHandlers(this, eventsString, true);
		}

		return this;
	};

	$.fn.liveFirst = function() {
		var args = $.makeArray(arguments);

		// live = delegate to document
		args.unshift(this.selector);
		$.fn.delegateFirst.apply($(document), args);

		return this;
	};
	
	if (!JQ_LT_17) {
		$.fn.onFirst = function(types, selector) {
			var $el = $(this);
			var isDelegated = typeof selector === 'string';

			$.fn.on.apply($el, arguments);

			// events map
			if (typeof types === 'object') {
				for (type in types)
					if (types.hasOwnProperty(type)) {
						moveEventHandlers($el, type, isDelegated);
					}
			} else if (typeof types === 'string') {
				moveEventHandlers($el, types, isDelegated);
			}

			return $el;
		};
	}

})(jQuery);
