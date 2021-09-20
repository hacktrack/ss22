_me = obj_hmenu_notifications.prototype;
function obj_hmenu_notifications(){};

_me.__constructor = function() {

	this.__uniq = unique_id();
	this.__btncss = {im:''};

	var aMenu = [
		{"text":'', tooltip: 'MAIN_MENU::NOTIFICATIONS', "css":'ico2 img notifier noarrow', nodetype: ['click'], rel:'notify', "callback":[this,'__notifyList'], "destructor":[this,'__notifyListDestruct']}
	];

	this.__ignoreMouseOut = true;

	this._fill(aMenu);
};

_me._onclick = function(e,elm,id,arg)
{
	switch(arg) {
		case 'clear_notifications':
			gui.notifier._clear_notifications();
			break;

		default:
			if (Is.Object(arg))
				executeCallbackFunction(arg);
	}
};

_me.__notifyList = function(e, id) {
	if (this.cmenu){
		this.cmenu._destruct();
		delete this.cmenu;
	}
	var count = gui.notifier.__saved.length;

	this.__ePull.appendChild(this.__row([
		{text: getLang('MAIN_MENU::NOTIFICATIONS') + (count ? ' (' + count + ')' : ''), caption: true},
		count && {title: 'MAIN_MENU::CLEAR_ALL', css: 'clear_notifications', arg: 'clear_notifications'},
		{title: '-'},
		count ? {anchor: 'notifications'} : {title: 'MAIN_MENU::NO_NOTIFICATIONS', css: 'no_notifications'}
	].filter(Boolean), id));

	if (count){
		this._create('notifications', 'obj_notifier', 'notifications', '', true);
		gui._obeyEvent('resize', [this,'__notifyListHeight']);
		this.__notifyListHeight();
	}
};
_me.__notifyListHeight = function(){
	if (this.notifications){
		var p = getSize(this.__ePull),
			n = getSize(this._getAnchor('notifications')),
			h = window.innerHeight || window.document.body.clientHeight;

		this.notifications._main.style.maxHeight = (h - n.y - ((p.y+p.h) - (n.y+n.h)) - 50) + 'px';
	}
};
_me.__notifyListDestruct = function(){
	if (this.notifications){
		gui._disobeyEvent('resize', [this,'__notifyListHeight']);
		this.notifications._destruct();
	}
};
