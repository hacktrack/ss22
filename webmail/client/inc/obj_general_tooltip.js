
/*
 * Global tooltip for bigger (multiline) tooltips with template or html content
 *
 * Martin Ekblom, 27/02/2013
 */

_me = obj_general_tooltip.prototype;
function obj_general_tooltip(){};

_me.__constructor = function(){

};

/*	Arguments
 *
  *	content (object): object with text, html or template property as string
 *						for templates optionally also specify values for the
 *						template when parsed
 *	properties (object): possibility to pass rendering details such as distance
 *						from borders, positioning, etc
 */

_me._showTooltip = function(content,properties) {
	var me = this;
	return function(e) {
		var e = e || window.event;

		properties = properties || {};

		var that = this;	// "that" is the element which we are hovering over

		if (that && that.parentNode && gui.generaltooltip && !gui.generaltooltip._destructed && gui.generaltooltip.__eTarget === that && !hascss(gui.generaltooltip._main,'show')) {
			gui.generaltooltip._show();	// tooltip exists but is in process of hiding, so show it again
			return;
		}

		if (me.__tooltipdelay)
			clearTimeout(me.__tooltipdelay);

		// window.event will stop existing in ie8, so we need to save x and y now
		var x = e.clientX,
			y = e.clientY;

		// Show tooltip after a small delay
		me.__tooltipdelay = setTimeout(function(){

			//check parent elm
			if (!that || !document.body.contains(that))
				return;

			// If we are already showing this tooltip return
			if (gui.generaltooltip && !gui.generaltooltip._destructed && gui.generaltooltip.__eTarget === that)
				return;

			if (me.__tooltipinterval)
				clearInterval(me.__tooltipinterval);

			// Otherwise create new tooltip
			gui._create('generaltooltip','obj_info_box','','detail');

			if (content.text)
				gui.generaltooltip._content(content.text.escapeHTML());
			else if(content.html)
				gui.generaltooltip._content(content.html);
			else if(content.template)
				gui.generaltooltip._template(content.template,content.values || {});

			gui.generaltooltip._context({target: that, x: x, y: y}, properties);

			// Hide tooltip if leaving tooltip
			// Actually doesn't work because of disabled mouse events
			AttachEvent(gui.generaltooltip._main,'onmouseout',outhandler);

			gui.generaltooltip._show();

			me.__tooltipinterval = setInterval(function(){
				if (!gui.generaltooltip || gui.generaltooltip.__eTarget !== that || !document.body.contains(that)){
					clearInterval(me.__tooltipinterval);
					if (gui.generaltooltip)
						gui.generaltooltip._hide();
				}
			},1000);

		}, "delay" in properties ? properties.delay : 700);

		AttachEvent(this,'onmouseout',outhandler);	// Hide tooltip if leaving target

		function outhandler(e) {
			var e = e || window.event,
				elm = e.relatedTarget || e.toElement;

			// Discard event if you are inside the tooltip or the target
			if (gui.generaltooltip && (Is.Child(elm, gui.generaltooltip._main) || elm === that || Is.Child(elm, that)))
				return;

			// Clear timeout if leaving
			if (me.__tooltipdelay)
				clearTimeout(me.__tooltipdelay);

			if (me.__tooltipinterval)
				clearInterval(me.__tooltipinterval);

			// If we are displaying info hide it
			if (gui.generaltooltip)
				gui.generaltooltip._hide();
		}

	};
};