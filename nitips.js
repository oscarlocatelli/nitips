(function ($) {
	$.fn.nitips = function (options) {
		var defaults = {
			activation: "hover", // hover, click, focus
			position: "top", // top, right, bottom, left
			showDelay: 0,
			hideDelay: 0,
			fadeIn: 0,
			fadeOut: 0,
			attribute: false, // set an attribute to auto generate tip from a hand attribute
			hand: false, // set hand jQuery object if you don't want it is tip.prev()
			loadUrl: false, // set local or cross site url for deferred load
			autoShow: false,
			keepAlive: false,
			permanent: false,
			edgeOffset: 5,
			arrowSize: 10,
			rounding: 8,
			padding: 8,
			closer: 'x', // text or HTML
			baseCssClass: 'nitips-tip'
		};

		return this.each(function () {
			// local options for each tip
			var opts = $.extend({}, defaults, options);

			// Unobstrusive options
			var tip = $(this);
			var attr = false;
			if (attr = tip.attr('data-nitips-activation')) opts.activation = attr;
			if (attr = tip.attr('data-nitips-position')) opts.position = attr;
			if (attr = tip.attr('data-nitips-showDelay')) opts.showDelay = attr;
			if (attr = tip.attr('data-nitips-hideDelay')) opts.hideDelay = attr;
			if (attr = tip.attr('data-nitips-fadeIn')) opts.fadeIn = attr;
			if (attr = tip.attr('data-nitips-fadeOut')) opts.fadeOut = attr;
			if (attr = tip.attr('data-nitips-attribute')) opts.attribute = attr;
			if (attr = tip.attr('data-nitips-hand')) opts.hand = $(attr);
			if (attr = tip.attr('data-nitips-loadUrl')) opts.loadUrl = attr;
			if (tip.is('[data-nitips-keepAlive]')) opts.keepAlive = true;
			if (tip.is('[data-nitips-autoShow]')) opts.autoShow = true;
			if (tip.is('[data-nitips-permanent]')) opts.permanent = true;
			if (attr = tip.attr('data-nitips-edgeOffset')) opts.edgeOffset = attr;
			if (attr = tip.attr('data-nitips-arrowSize')) opts.arrowSize = attr;
			if (attr = tip.attr('data-nitips-rounding')) opts.rounding = attr;
			if (attr = tip.attr('data-nitips-padding')) opts.padding = attr;
			if (attr = tip.attr('data-nitips-closer')) opts.closer = attr;
			if (attr = tip.attr('data-nitips-baseCssClass')) opts.baseCssClass = attr;

			// Nitips setup
			var hand = opts.hand, isVisible = false, outByTip = true, outByHand = true, showTimeout, hideTimeout, lastPosition = opts.position;;

			if (!opts.attribute) {
				tip = $(this);
				if (!hand) hand = tip.prev(); // Use tip.prev() as default hand object
			} else {
				hand = $(this);
				tip = $('<div>' + hand.attr(opts.attribute) + '</div>');
				hand.after(tip);
			}
			
			// Setup CSS
			tip.hide().addClass(opts.baseCssClass).addClass('nitips-' + opts.position);
			hand.addClass('nitips-hand');
			
			if (opts.keepAlive || opts.permanent) tip.css('z-index', '99980');
			else tip.css('z-index', '99990');

			// AutoShow option
			if (opts.autoShow) { $(window).load(function () { showTip(); resetTopMost(); }); }
			
			// Fix position on resize
			tip.on('resize', function () { setPosition(); });

			if (opts.loadUrl) {
				hand.one('mouseover', function (evt) {
					if (opts.loadUrl.match('^http')) { // cross-site
						var frame = $('<iframe style="border: 0; width: 100%; height: 100%;" src="' + opts.loadUrl + '"></iframe>');
						frame.ready(function () {
							frame.width(tip.width()).height(tip.height());
							tip.html(frame);
						});
					}
					else { // relative
						$.get(opts.loadUrl, function (d) { tip.html(d); showTip(); });
					}
				});
			}

			if (opts.activation === "hover") {
				hand.on('mouseover', function (event) {
					outByHand = false;
					showTip();
				});
				hand.on('mouseout', function (event) {
					outByHand = true;
					if (!opts.keepAlive && !opts.permanent) hideTip(); // hide only if not to keep
					else if (outByHand && outByTip) resetTopMost();
				});
				if (opts.hideDelay > 0) { // if hideDelay == 0 flickering on mouseover
					tip.on('mouseover', function (event) {
						outByTip = false;
						showTip();
					});
					tip.on('mouseout', function (event) {
						outByTip = true;
						if (!opts.keepAlive && !opts.permanent) hideTip(); // hide only if not to keep
						else if (outByHand && outByTip) resetTopMost();
					});
				}
			} else if (opts.activation === 'focus') {
				hand.on('focusin', function () {
					showTip();
				}).on('focusout', function () {
					hideTip();
				});
			} else if (opts.activation === 'click') {
				opts.showDelay = 0; // must open immediately on click
				opts.hideDelay = 0; // must close immediately on click
				hand.on('click', function () {
					if (!isVisible) showTip();
					else if (!opts.permanent) hideTip(); // only if not permanent
					return false;
				});
			}

			if (opts.keepAlive && !opts.permanent) {
				if (opts.activation != 'click') { // redundant if activation is on click
					opts.hideDelay = 0; // must close immediately on click
					tip.on('click', function (event) {
						hideTip();
					});
				}

				// Add closer object
				tip.css('cursor', 'pointer');
				var closer = $('<div class="nitips-close">' + opts.closer + '</div>');
				tip.prepend(closer);
			}

			function showTip() {
				_clearTimeouts();
				if (opts.showDelay != 0) showTimeout = window.setTimeout(function () { console.log('_showTip timeout'); _showTip(); }, opts.showDelay);
				else _showTip();
			}

			function hideTip() {
				_clearTimeouts();
				if (opts.hideDelay != 0) hideTimeout = window.setTimeout(function () { console.log('_hideTip timeout'); _hideTip(); }, opts.hideDelay);
				else _hideTip();
			}

			function _clearTimeouts() {
				if (showTimeout) { window.clearTimeout(showTimeout); showTimeout = false; }
				if (hideTimeout) { window.clearTimeout(hideTimeout); hideTimeout = false; }
			}

			function _showTip() {
				if (!isVisible) {
					isVisible = true;
					console.log('showTip');
					setPosition();
					setTopMost();
					if (opts.fadeIn > 0) tip.fadeIn(opts.fadeIn);
					else tip.show();
				}
			}

			function _hideTip() {
				if (isVisible) {
					isVisible = false;
					console.log('hideTip');
					if (opts.fadeOut > 0) tip.fadeOut(opts.fadeOut);
					else tip.hide();
					resetTopMost();
				}
			}

			function setTopMost() {
				tip.css('z-index', '99999');
			}

			function resetTopMost() {
				if (opts.keepAlive || opts.permanent) tip.css('z-index', '99980');
				else tip.css('z-index', '99990');
			}

			function setPosition() {
				var pos = hand.position(),
					tT = pos.top + parseInt(hand.css("marginTop")), tL = pos.left + parseInt(hand.css("marginLeft")),
					tW = hand.outerWidth(), tH = hand.outerHeight(),
					eW = tip.outerWidth(), eH = tip.outerHeight(),
					currPosition = opts.position;
				
				//console.log('tT: ' + tT + ' tL: ' + tL + ' tW: ' + tW + ' tH: ' + tH + ' eW: ' + eW + ' eH: ' + eH);

				var win = $(window);
				var h = win.height(), w = win.width(), sT = win.scrollTop(), sL = win.scrollLeft();

				if (opts.position === "top") {
					if (hand.offset().top - eH - opts.arrowSize - opts.edgeOffset - sT < 0) {
						currPosition = 'bottom';
					}
				} else if (opts.position === "bottom") {
					if (hand.offset().top + tH + opts.arrowSize + opts.edgeOffset + eH - sT > h) {
						currPosition = 'top';
					}
				} else if (opts.position === "left") {
					if (hand.offset().left - eW - opts.arrowSize - opts.edgeOffset - sL < 0) {
						currPosition = 'right';
					}
				} else { // right
					if (hand.offset().left + tW + opts.arrowSize + opts.edgeOffset + eW - sL > w) {
						currPosition = 'left';
					}
				}

				if (currPosition != lastPosition)
					tip.removeClass('nitips-' + lastPosition).addClass('nitips-' + currPosition);

				lastPosition = currPosition;

				if (currPosition === "top") {
					tip.css('top', tT - eH - opts.arrowSize - opts.edgeOffset).css('left', tL + tW / 2 - opts.arrowSize * 2);
				} else if (currPosition === "bottom") {
					tip.css('top', tT + tH + opts.arrowSize + opts.edgeOffset).css('left', tL + tW / 2 - opts.arrowSize * 2);
				} else if (currPosition === "left") {
					tip.css('top', tT + tH / 2 - eH / 2).css('left', tL - eW - opts.arrowSize - opts.edgeOffset);
				} else { // right
					tip.css('top', tT + tH / 2 - eH / 2).css('left', tL + tW + opts.arrowSize + opts.edgeOffset);
				}
			}
		});
	}
})(jQuery);