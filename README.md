nitips
======

No Image Tooltips - jQuery Tooltip Simple and No Image Plugin


Basic usage:
------------

	<a href="#">basic</a>
	<div class="nitips">Tooltip body here !!!</div>

$('.nitips').nitips();


Advance usage:
--------------

1 - Custom settings:

	<a href="#" class="nitips" title="Tooltip body here !!!">advanced 1</a>

	$('.nitips').nitips({ attribute: 'title', position: 'left', keepAlive: true });

Available settigs are:

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


2 - Unobstrusive settings

	<a id="target" href="#">advanced 2</a>
	<div class="nitips" data-nitips-autoShow data-nitips-permanent>This tip is auto showed and it is permanent (undismissible)</div>
	<div class="nitips" data-nitips-hand="#target" data-nitips-keepAlive data-nitips-position="bottom">this tip is linked to #target, is bottom and is keep alive</div>

	$('.nitips').nitips();