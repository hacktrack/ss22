_me = frm_rule.prototype;
function frm_rule(){};

_me.__constructor = function(aValues, aResponse)
{
	var me = this;

	this._size(860,470,true);
	this._modal(true);

  	this._title('FILTERS::RULE');
	this.__sSelectedLine;
	this.__orderOfLines = [];

	this._draw('frm_rule','main',{disable_fw:GWOthers.getItem('RESTRICTIONS', 'disable_forwarder')>0});

	msiebox(this._getAnchor('msiebox'));
	msiebox(this.maintab.filters._getAnchor('msiebox'));

	this.maintab.filters.x_add._onclick = function() {
		me.__addLine(true);
	};

	this.__unselectLine();

	this.maintab.filters.x_delete._onclick = function() {
		me.__deleteLine(me.__sSelectedLine);
	};
	this.maintab.filters.x_up._onclick = function() {
		me.__moveUpLine(me.__sSelectedLine);
	};
	this.maintab.filters.x_down._onclick = function() {
		me.__moveDownLine(me.__sSelectedLine);
	};

	this.x_btn_ok._onclick = function() {
		var aConditions = [];

		for (var i in me.__orderOfLines)
			aConditions.push(me.maintab.filters[me.__orderOfLines[i]]._value());

		if (!count(aValues))
			aValues['ACTIVE'] = [{'VALUE':1}];

		aValues['CONDITION'] = aConditions;

		// Save changes
		if (me.title._value().trim())
			aValues['TITLE'] = [{'VALUE': me.title._value().trim()}];
		else
			delete aValues['TITLE'];

		if (me.maintab && me.maintab.actions && me.maintab.actions._wasActivated)
			arrConcat(aValues, me.maintab.actions.actions._value());

		if (Is.Defined(aResponse)) executeCallbackFunction(aResponse, aValues);
		me._destruct();
	};

	if (Is.Defined(aValues['TITLE']))
		this.title._value(aValues['TITLE'][0]['VALUE']);

	for (var i in aValues['CONDITION']) {
		var oNewLine = this.__addLine();
		if (oNewLine)
			oNewLine._value(aValues['CONDITION'][i]);
	}

	this.maintab.actions._onactive = function (bFirstTime) {
		if (bFirstTime)
			this.actions._value(aValues);
	};
};

_me.__unselectLine = function() {
	this.__sSelectedLine = undefined;

	this.maintab.filters.x_delete._disabled(true);
	this.maintab.filters.x_up._disabled(true);
	this.maintab.filters.x_down._disabled(true);
};

_me.__selectLine = function(sName) {
	if (this.__sSelectedLine)
		removecss(this.maintab.filters[this.__sSelectedLine]._main, 'active');

	addcss(this.maintab.filters[sName]._main, 'active');
	this.__sSelectedLine = sName;
	this.maintab.filters.x_delete._disabled(false);
	this.maintab.filters.x_up._disabled(false);
	this.maintab.filters.x_down._disabled(false);
};

_me.__addLine = function(bUserDefined) {
	if (this.__orderOfLines.length>9)
	    return;

	var me = this;
	this.maintab.filters._anchors['filters'] = this.maintab.filters._pathName + '#filters';
	var aLine = this.maintab.filters._create('filter', 'obj_filter_line', 'filters','', (bUserDefined) ? 'from' : false);
		aLine._main.onclick = function() { me.__selectLine(aLine._name); }

	if (this.__orderOfLines.length == 0)
		aLine._hideLogicalOperators();

	this.__orderOfLines.push(aLine._name);

	return aLine;
};

_me.__deleteLine = function(sName) {
	var index;
	if ((index = this.__findLine(sName)) < 0) return;

	for (var i = index; i < this.__orderOfLines.length-1; i++) {
		this.__orderOfLines[i] = this.__orderOfLines[i+1];
	}
	this.__orderOfLines.pop();

	this.__unselectLine();
	this.maintab.filters[sName]._destruct();

	if (index == 0 && this.__orderOfLines.length > 0)
		this.maintab.filters[this.__orderOfLines[0]]._hideLogicalOperators();
};

_me.__moveUpLine = function(sName) {
	var index;
	if ((index = this.__findLine(sName)) <= 0) return;
	this.__swapLines(index-1, index);

	if (index == 1) {
		this.maintab.filters[this.__orderOfLines[0]]._hideLogicalOperators();
		this.maintab.filters[this.__orderOfLines[1]]._showLogicalOperators();
	}
};

_me.__moveDownLine = function(sName) {
	var index;
	if ((index = this.__findLine(sName)) < 0 || index >= this.__orderOfLines.length-1) return;
	this.__swapLines(index, index+1);

	if (index == 0) {
		this.maintab.filters[this.__orderOfLines[0]]._hideLogicalOperators();
		this.maintab.filters[this.__orderOfLines[1]]._showLogicalOperators();
	}
};

_me.__swapLines = function(i1, i2) {

	//visual move
	var elm1 = this.maintab.filters[this.__orderOfLines[i1]]._main;
	var elm2 = this.maintab.filters[this.__orderOfLines[i2]]._main;
	var elm3 = elm2.nextSibling;
	var parn = elm1.parentNode;

	parn.removeChild(elm2);
	parn.insertBefore(elm2, elm1);
	parn.removeChild(elm1);

	if (elm3)
		parn.insertBefore(elm1, elm3);
	else
		parn.appendChild(elm1);
	elm1 = elm2 = elm3 = parn = null;


	var tmp = this.__orderOfLines[i1];
	this.__orderOfLines[i1] = this.__orderOfLines[i2];
	this.__orderOfLines[i2] = tmp;
};

_me.__findLine = function(sName) {
	for (var i in this.__orderOfLines) {
		if (this.__orderOfLines[i] == sName)
			return parseInt(i);
	}
	return -1;
};
