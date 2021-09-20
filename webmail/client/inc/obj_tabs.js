_me = obj_tabs.prototype;
function obj_tabs(){};

_me.__constructor = function(){
	this._telemetry = 'off'; //telemetry log

	var me = this;

	this._getAnchor('header').onclick = function(e){
		var e = e || window.event,
			elm = e.target || e.srcElement,
			oTab;

		if (elm != this)
			if (hascss(elm,'prev')){
				me._previous();

				if (sPrimaryTelemetry && oTab)
					gui.telemetry._add({id:me._pathName+'#prev', type: me._type});
			}
			else
			if (hascss(elm,'next')){
				me._next();

				if (sPrimaryTelemetry && oTab)
					gui.telemetry._add({id:me._pathName+'#next', type: me._type});
			}

			if (oTab)
				oTab._active(null, true);

			return false;
	};

	//Scroll list of tabs
	//"this" doesnt work in MSIE

	var header2 = this._getAnchor('header2');
	AttachEvent(header2, "onmousewheel", function(e){

		var e = e || window.event,
			deltaY = e.deltaY,
			deltaX = e.deltaX;

		//Invert axis
		if (!deltaX && deltaY)
			deltaX = deltaY;

		var ul = header2.getElementsByTagName('UL')[0],
			li = ul.getElementsByTagName('LI');

		if (li && (li = li[li.length-1])){
			var	l = parseInt(ul.style.marginLeft || 0, 10);

			if (li.offsetLeft-(deltaX*6)+li.offsetWidth<header2.clientWidth && deltaX>0){
				if (l<0)
					ul.style.marginLeft = (l + (header2.clientWidth - (li.offsetLeft+li.offsetWidth))) + 'px';
			}
			else{
				l -= deltaX*6;
				ul.style.marginLeft = (l>0?0:l) +'px';
			}
		}
		else
			ul.style.marginLeft = '';

		e.cancelBubble = true;
		e.returnValue = false;
		if (e.stopPropagation) e.stopPropagation();
	});


	// activate 1st instance in tabs objekt
	this.__onCreateChild = function(sName,sType,sTarget,sClass){
		if (sName.length && me[sName]._active && (!this.__value || this.__value == sName)){
			me[sName]._active();
			me.__onCreateChild = null;
		}
	};
};

_me._next = function(){
	var i,oTab,tmp = false, obj = this._getChildObjects('main');

	for (i in obj)
		if (obj[i]._name == this.__value)
			tmp = true;
		else
		if (tmp){
			oTab = obj[i];
			break;
		}

	if (oTab)
		oTab._active(null, true);
};

_me._previous = function(){
	var i,oTab, obj = this._getChildObjects('main');

	for (i in obj)
		if (obj[i]._name == this.__value)
			break;
		else
			oTab = obj[i];

	if (oTab)
		oTab._active(null, true);
};


_me._value = function (v){
	if (Is.Defined(v)){
		if (typeof this[v] == 'object')
			this[v]._active();
		else{
			this.__value = v;
			removecss(this._main,'active');

			if (this._onchange)
				this._onchange(v);
			this.__exeEvent('onchange',null,{"value":v,"owner":this});
		}
	}

	return this.__value;
};

_me._scrollHeader = function(eLi){

	var eLink = this._getAnchor('links'),
		iLeft = parseInt(eLi.offsetLeft,10) - parseInt(eLink.style.marginLeft || 0),
		eHead = this._getAnchor('header2');

	if (eHead.clientWidth>0){
		if (currentBrowser().indexOf('MSIE')==0){
			//vlevo
			if (parseInt(eLink.style.marginLeft || 0,10)*-1>parseInt(eLi.offsetLeft,10))
				eLink.style.marginLeft = (parseInt(eLi.offsetLeft,10)*-1) + 'px';
			else
			//vpravo
			if (parseInt(eLi.offsetLeft,10)+parseInt(eLi.offsetWidth,10)>parseInt(eHead.clientWidth,10)+parseInt(eLink.style.marginLeft || 0,10)*-1)
				eLink.style.marginLeft = (parseInt(eHead.clientWidth,10) - (parseInt(eLi.offsetLeft,10) + parseInt(eLi.offsetWidth,10))) + 'px';
		}
		else{
			if (eHead.clientWidth < (iLeft + parseInt(eLi.offsetWidth)) + parseInt(eLink.style.marginLeft || 0)){
				eLink.style.marginLeft =  (parseInt(eHead.clientWidth) - (iLeft + parseInt(Math.min(eHead.clientWidth, eLi.offsetWidth))))+'px';
			}
			else
			if (iLeft + parseInt(eLink.style.marginLeft || 0)<0){
				eLink.style.marginLeft = (iLeft*-1)+'px';
			}
		}
	}
};