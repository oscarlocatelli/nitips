(function ($, window, document) {
	"use strict";
	$.fn.nitips = function (options) {
		var defaults = {
			activation: "hover", // hover, click, focus
			position: "top", // top, right, bottom, left
			showDelay: 0, // delay before show tip
			hideDelay: 0, // delay before hide tip
			fadeIn: 0, // fade in time
			fadeOut: 0, // fade out time
			attribute: false, // set an attribute to auto generate tip from a hand attribute
			hand: false, // set hand jQuery object if you don't want it is tip.prev()
			loadUrl: false, // set local or cross site url for deferred load
			autoShow: false, // auto show tip when nitips() is called
			keepAlive: false, // not auto hide tip when mouseout, click it for dismiss, it also add a tip closer
			permanent: false, // tip is undismissible
			edgeOffset: 5, // distance from target
			arrowSize: 10, // size of arrow
			rounding: 8, // size of tip rounding
			padding: 8, // size of content padding
			closer: 'x', // text or HTML for tip closer content
			baseCssClass: 'nitips-tip' // base CSS class, change it for style only this tips context
		};

		return this.each(function () {

			// local options for each tip
			var opts = $.extend({}, defaults, options),
				tip = $(this),
				hand = false,
				isVisible = false,
				outByTip = true,
				outByHand = true,
				lastPosition = false,
				showTimeout,
				hideTimeout,
				closer;

			function setTopMost() {
				tip.css('z-index', '99999');
			}

			function resetTopMost() {
				if (opts.keepAlive || opts.permanent) { tip.css('z-index', '99980'); } else { tip.css('z-index', '99990'); }
			}

			function setPosition() {
				var win = $(window),
					pos = hand.position(),
					currPosition = opts.position,
					tT = pos.top + parseInt(hand.css("marginTop"), 10),
					tL = pos.left + parseInt(hand.css("marginLeft"), 10),
					tW = hand.outerWidth(),
					tH = hand.outerHeight(),
					eW = tip.outerWidth(),
					eH = tip.outerHeight(),
					h = win.height(),
					w = win.width(),
					sT = win.scrollTop(),
					sL = win.scrollLeft();

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

				if (currPosition !== lastPosition) { tip.removeClass('nitips-' + lastPosition).addClass('nitips-' + currPosition); }

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

			function innerClearTimeouts() {
				if (showTimeout) { window.clearTimeout(showTimeout); showTimeout = false; }
				if (hideTimeout) { window.clearTimeout(hideTimeout); hideTimeout = false; }
			}

			function innerShowTip() {
				if (!isVisible) {
					isVisible = true;
					setPosition();
					setTopMost();
					if (opts.fadeIn > 0) { tip.fadeIn(opts.fadeIn); } else { tip.show(); }
				}
			}

			function innerHideTip() {
				if (isVisible) {
					isVisible = false;
					if (opts.fadeOut > 0) { tip.fadeOut(opts.fadeOut); } else { tip.hide(); }
					resetTopMost();
				}
			}

			function showTip() {
				innerClearTimeouts();
				if (opts.showDelay !== 0) { showTimeout = window.setTimeout(function () { innerShowTip(); }, opts.showDelay); } else { innerShowTip(); }
			}

			function hideTip() {
				innerClearTimeouts();
				if (opts.hideDelay !== 0) { hideTimeout = window.setTimeout(function () { innerHideTip(); }, opts.hideDelay); } else { innerHideTip(); }
			}

			// Unobstrusive options
			if (tip.is('[data-nitips-activation]')) { opts.activation = tip.attr('data-nitips-activation'); }
			if (tip.is('[data-nitips-position]')) { opts.position = tip.attr('data-nitips-position'); }
			if (tip.is('[data-nitips-showDelay]')) { opts.showDelay = tip.attr('data-nitips-showDelay'); }
			if (tip.is('[data-nitips-hideDelay]')) { opts.hideDelay = tip.attr('data-nitips-hideDelay'); }
			if (tip.is('[data-nitips-fadeIn]')) { opts.fadeIn = tip.attr('data-nitips-fadeIn'); }
			if (tip.is('[data-nitips-fadeOut]')) { opts.fadeOut = tip.attr('data-nitips-fadeOut'); }
			if (tip.is('[data-nitips-attribute]')) { opts.attribute = tip.attr('data-nitips-attribute'); }
			if (tip.is('[data-nitips-hand]')) { opts.hand = $(tip.attr('data-nitips-hand')); }
			if (tip.is('[data-nitips-loadUrl]')) { opts.loadUrl = tip.attr('data-nitips-loadUrl'); }
			if (tip.is('[data-nitips-keepAlive]')) { opts.keepAlive = true; }
			if (tip.is('[data-nitips-autoShow]')) { opts.autoShow = true; }
			if (tip.is('[data-nitips-permanent]')) { opts.permanent = true; }
			if (tip.is('[data-nitips-edgeOffset]')) { opts.edgeOffset = tip.attr('data-nitips-edgeOffset'); }
			if (tip.is('[data-nitips-arrowSize]')) { opts.arrowSize = tip.attr('data-nitips-arrowSize'); }
			if (tip.is('[data-nitips-rounding]')) { opts.rounding = tip.attr('data-nitips-rounding'); }
			if (tip.is('[data-nitips-padding]')) { opts.padding = tip.attr('data-nitips-padding'); }
			if (tip.is('[data-nitips-closer]')) { opts.closer = tip.attr('data-nitips-closer'); }
			if (tip.is('[data-nitips-baseCssClass]')) { opts.baseCssClass = tip.attr('data-nitips-baseCssClass'); }

			// Set local variables
			hand = opts.hand;
			lastPosition = opts.position;

			// Nitips setup
			if (!opts.attribute) {
				tip = $(this);
				if (!hand) { hand = tip.prev(); } // Use tip.prev() as default hand object
			} else {
				hand = $(this);
				tip = $('<div>' + hand.attr(opts.attribute) + '</div>');
				hand.after(tip);
			}

			// Setup CSS
			tip.hide().addClass(opts.baseCssClass).addClass('nitips-' + opts.position);
			hand.addClass('nitips-hand');

			// Keep alive option (permanent include keep alive)
			if (opts.keepAlive || opts.permanent) { tip.css('z-index', '99980'); } else { tip.css('z-index', '99990'); }

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
					} else { $.get(opts.loadUrl, function (d) { tip.html(d); showTip(); }); } // relative
				});
			}

			if (opts.activation === "hover") {
				hand.on('mouseover', function (event) {
					outByHand = false;
					showTip();
				});
				hand.on('mouseout', function (event) {
					outByHand = true;
					if (!opts.keepAlive && !opts.permanent) {
						hideTip();
					} else if (outByHand && outByTip) {
						resetTopMost();
					}
				});
				if (opts.hideDelay > 0) { // if hideDelay == 0 flickering on mouseover
					tip.on('mouseover', function (event) {
						outByTip = false;
						showTip();
					});
					tip.on('mouseout', function (event) {
						outByTip = true;
						if (!opts.keepAlive && !opts.permanent) {
							hideTip(); // hide only if not to keep
						} else if (outByHand && outByTip) {
							resetTopMost();
						}
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
					if (!isVisible) {
						showTip();
					} else if (!opts.permanent) {
						hideTip(); // only if not permanent
					}
					return false;
				});
			}

			if (opts.keepAlive && !opts.permanent) {
				if (opts.activation !== 'click') { // redundant if activation is on click
					opts.hideDelay = 0; // must close immediately on click
					tip.on('click', function (event) {
						hideTip();
					});
				}

				// Add closer object
				tip.css('cursor', 'pointer');
				closer = $('<div class="nitips-close">' + opts.closer + '</div>');
				tip.prepend(closer);
			}
		});
	};
}(jQuery, window, document));