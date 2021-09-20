/**
 * Horizontal menu object
 *
 * <p item>	is text content of menu
 *			if value is equal to '-' than <hr> tag is used instead of link
 *
 * Input array example:
 * x[<p item>]	[arg] = obj | string
 *				[disabled]
 *				[css] = 'className'
 *				[nodes][<ch item>]	[arg]
 *									[css]
 *									[nodes]
 *
 * This object handles dropdown and submenus on hover, click or context for menu buttons
 **/
_me = obj_hmenu_plus.prototype;
function obj_hmenu_plus(){};

_me.__constructor = function(){
	var me = this;

	this.__ePull = null;
	this.__timeout = null;
	this.__openedNode = [];
	this.__timeoutdelay = 150;

	this._upMenu = false; // show pullUp menu

	// Open dropdown menu for this item
	function openNodes(id,elm,e) {
		var body = document.body;

		//odznacit parent elm
		if (me.__openedNode.length)
			me.__close();

		me.__openedNode.push(id);

		//vytvorit nabidku
		if (!me.__ePull){

			me.__ePull = mkElement('div',{className:'obj_context '+(me._css?' '+me._css+'_plus':'')/*, id:this._pathName + '#' + anchor*/});

			if (window.navigator.msPointerEnabled)
				me.__ePull.onmspointerup = function(e){
					//Extend mouseEvent by arg2 attribute
					if (me.__aData[id]['arg2'])
						e.__arg2 = me.__aData[id]['arg2'];

					me._main.onmspointerup.apply(me, arguments);
				};
			else
				me.__ePull.onclick = function(e){
					//Extend mouseEvent by arg2 attribute
					if (me.__aData[id]['arg2'])
						e.__arg2 = me.__aData[id]['arg2'];

					me._main.onclick.apply(me, arguments);
				};

			me.__ePull.onmousemove = function(e){
				if (me.__timeout){
					window.clearTimeout(me.__timeout);
					me.__timeout = null;
				}
			};

			me.__ePull.onmouseout = function(e){
				if (me.__ignoreMouseOut)
					return;

				if (!me.__timeout)
					me.__timeout = window.setTimeout(function(){
						if (this && this._destructed === false)
							this.__close();
					}.bind(me),
					me.__timeoutdelay);
			};

			body.appendChild(me.__ePull);
		}
		else{
			me.__ePull.style.display = 'block';

			while (me.__ePull.firstChild)
				me.__ePull.removeChild(me.__ePull.firstChild);
		}

		me.__ePull.setAttribute('menu', me.__aData[id]['rel'] || '');

		//position
		var pos = getSize(elm);

		if (me._upMenu){
			addcss(me.__ePull,'bottom');
			me.__ePull.style.bottom = (body.clientHeight - pos.y) + 'px';
		}
		else{
			addcss(me.__ePull,'top');
			me.__ePull.style.top = (pos.y+pos.h)+'px';
		}
		if(me.__ePull.clientHeight > body.clientHeight) {
			addcss(me.__ePull, 'scrollable');
		} else {
			removecss(me.__ePull, 'scrollable');
		}

		//fill
		if (me.__aData[id]['callback']){
			var rows = executeCallbackFunction(me.__aData[id]['callback'], e, id, me.__aData[id]);

			if (rows){
				if (rows instanceof Element)
					me.__ePull.appendChild(rows);
				else
					me.__ePull.appendChild(me.__row(rows, id));
			}
			else
			if (rows === false)
				return;
		}
		else
		if (me.__aData[id]['child'])
			me.__ePull.appendChild(me.__aData[id]['child']);
		else
			me.__ePull.appendChild(me.__row(me.__aData[id].nodes,id));

		var w = window.innerWidth || body.offsetWidth,
			left = (pos.x+pos.w/2) - me.__ePull.offsetWidth/2;
			left = left<0?0:left,
			right = (w-pos.x-pos.w/2 - me.__ePull.offsetWidth/2);

		right = right < 10 ? 10 : right;
		right = right > (window.innerWidth - 10 - me.__ePull.offsetWidth) ? (window.innerWidth - 10 - me.__ePull.offsetWidth) : right;
		if (w < left+me.__ePull.offsetWidth)
			left = w-me.__ePull.offsetWidth;


		if(gui._rtl){
			me.__ePull.style.right = right+'px';
			me.__ePull.style.left = 'auto';
		}else{
			me.__ePull.style.left = left + 'px';
		}

		var pos2 = getSize(me.__ePull);

		//arrow
		if(gui._rtl){
			me.__ePull.appendChild(mkElement('div',{style:{right:(pos2.x + pos2.w - pos.x - pos.w / 2) + 'px', left:'auto'}}));
		}else{
			me.__ePull.appendChild(mkElement('div',{style:{left:(pos.x+pos.w/2-pos2.x) + 'px'}}));
		}

		//oznacit aktualni parent elm
		var prt = document.getElementById(me._pathName+'/'+id);
		if (prt){
			addcss(prt,'active');
			prt = null;
		}
	};

	// Handle opening of new dropdown menu (closing other open etc)
	function handleOpenEvent(e) {
		var elm = e.target || e.srcElement;
		if (e.detail instanceof Element) {
			elm = e.detail;
		}
		// Find if we are within an A element
		if (elm.tagName != 'A')
			elm = Is.Child(elm,'A',me._main);

		if (elm.tagName != 'A'){
			//odznacit parent elm
			if (me.__openedNode.length)
				me.__close();

			return false;
		}

		// We are still inside, clear timeout
		if (me.__timeout){
			window.clearTimeout(me.__timeout);
			me.__timeout = null;
		}

		// Get id from element
		var id = me.__getId(elm.id);

		// Show tooltip if specified
		// 'short' css has origin in obj_hmenu_basic2
		if(me.__aData[id] && e.type=='mousemove' && (me.__aData[id].tooltip || (me.__aData[id].title && hascss(me._main,'short')))) {
			var rect = elm.getBoundingClientRect(),
				place = parseInt(2*document.getElementsByTagName('BODY')[0].offsetWidth/3),
				title = me.__aData[id].text || getLang(me.__aData[id].tooltip || me.__aData[id].title),
				left = rect.left > place ? rect.left-title.length*7 : rect.left;
			gui.tooltip._show(elm,title,{x: left+(elm.offsetWidth/2), y: rect.top+36});
		}

		// If dropdown for this button is already displayed just return
		if (me.__openedNode[me.__openedNode.length-1] == id){
			// Click on same button second time closes dropdown
			if(e.type=='click')
				me.__close();

			return false;
		}

		// Delay staying open longer for clicking
		me.__timeoutdelay = e.type=='click' ? 1500 : 100;

		//OPEN NEW NODES - Check for type (hover, click or context)
		if (me.__aData[id] && !me.__aData[id]['disabled'] && (me.__aData[id]['nodes'] || me.__aData[id]['callback'])){

			var ntype;
			if (Is.Array(me.__aData[id]['nodetype']))
				ntype = me.__aData[id]['nodetype'];
			else
				ntype = [me.__aData[id]['nodetype']];

			if (e.type=='mousemove' && (me.__aData[id]['nodetype'] == undefined || inArray(ntype, 'hover')>-1) || e.type=='contextmenu' && inArray(ntype, 'context')>-1 || e.type=='click' && inArray(ntype, 'click')>-1){
				openNodes(id,elm,e);
				return;
			}
		}
		// try to close old nodes
		else
			me.__close();

	};

	AttachEvent(this._main,'onmousemove', function(e){
		e = e || window.event;
		handleOpenEvent(e);
	});

	AttachEvent(this._main,'onclick', function(e){
		e = e || window.event;
		handleOpenEvent(e);
	});

	AttachEvent(this._main,'oncontextmenu', function(e){
		e = e || window.event;
		handleOpenEvent(e);
		return false;
	});

	AttachEvent(this._main,'onmouseout', function(e){
		if(me.__ignoreMouseOut) {
			return;
		}
		e = e || window.event;

		// Check if we are still within the menu
		var rel = e.relatedTarget || e.toElement,
			inside = Is.Child(rel, me._main),
			elm = e.target || e.srcElement;

		// Close any remaining tooltip if we left the menu
		if(!inside)
			gui.tooltip._hide();

		// Close the tooltip if we left the menu button
		if(elm.nodeName=='A' && (!rel || rel.nodeName!='SPAN'))
			gui.tooltip._hide(elm);

		// Close any remaining open dropdowns
		if (me.__openedNode!=null){
			if (me.__timeout)
				window.clearTimeout(me.__timeout);

			me.__timeout = window.setTimeout(function(){
				if (this && this._destructed === false)
					this.__close();
			}.bind(me),
			me.__timeoutdelay+100);
		}
	});

	// Notice also clicks outside the menu

	gui._obeyEvent('click',[this,'__outsideclick']);

	this._add_destructor('__destruct_menu');
};

// User clicked outside of the menu
_me.__outsideclick = function(e) {
	if (Is.Child(e.target || e.srcElement, this.__ePull) == false && Is.Child(e.target || e.srcElement, this._main) == false)
	 	this.__close();
};

// When destructing, close any open nodes and don't listen for global clicks
_me.__destruct_menu = function(e) {
	this.__close(true);
	gui._disobeyEvent('click',[this,'__outsideclick']);
};

// Close open menu nodes
_me.__close = function(bFully){
	//clear timeout
	if (this.__timeout){
		window.clearTimeout(this.__timeout);
		this.__timeout = null;
	}

	//odznacit parenta
	if (this.__openedNode.length){
		for(var i = this.__openedNode.length-1;i>=0;i--){

			//call callback 2
			if (this.__aData[this.__openedNode[i]] && this.__aData[this.__openedNode[i]].destructor){
				executeCallbackFunction(this.__aData[this.__openedNode[i]].destructor, this.__openedNode[i], this.__aData[this.__openedNode[i]]);
			}

			var elm = document.getElementById(this._pathName+'/'+this.__openedNode[i]);
			if (elm){
			    removecss(elm,'active');
				elm = null;
			}

			this.__openedNode.splice(i,1);
		}
	}

	//close popup
	try{
		if (this.__ePull)
			if (bFully){
				this.__ePull.parentNode.removeChild(this.__ePull);
				this.__ePull = null;
			}
			else
				this.__ePull.style.display = 'none';
	}
	catch(er){gui._REQUEST_VARS.debug && console.log(this._name||false,er)}
};

_me.__getId = function(elmid){
	return elmid.substr(this._pathName.length+1);
};

_me._fill = function (aData){
	this.__close(true);
	this._clear();

	// retrieve data from dataset
	if (!aData && this._listener)
		this.__aData = dataSet.get(this._listener,this._listenerPath);
	else
	if (!(this.__aData = (aData || []).filter(Boolean)).length)
		return;

	this.__row(this.__aData.filter(Boolean),'',true);
};
