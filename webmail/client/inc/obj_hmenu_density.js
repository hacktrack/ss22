_me = obj_hmenu_density.prototype;
function obj_hmenu_density(){};

_me.__constructor = function() {

	this.__uniq = unique_id();
	this.__btncss = {im:''};

	var aMenu = [
		{"text":'', tooltip: 'MAIN_MENU::ITEM_DENSITY', "css":'ico2 img viewsize noarrow', nodetype: ['click'], rel:'view', "callback":[this,'__viewSize'], "destructor":[this,'__viewSizeDestruct']}
	];

	this.__ignoreMouseOut = true;

	this._fill(aMenu);

};

_me.__viewSize = function(e, id){
	if (this.cmenu){
		this.cmenu._destruct();
		delete this.cmenu;
	}

	aMenu = [
		{"title":'MAIN_MENU::ITEM_DENSITY', "caption":true},
		{title:'-'},
		{"anchor":'compact'}
	];

	//hack, render it itself + return false;
	this.__ePull.appendChild(this.__row(aMenu,id));

	this._create('compact', 'obj_slider', 'compact', '', [
		{
			value: 2,
			title: getLang('SETTINGS::COMPACT_LAYOUT')
		},
		{
			value: 1,
			title: getLang('SETTINGS::SMALL_LAYOUT')
		},
		{
			value: 0,
			title: getLang('SETTINGS::DEFAULT_LAYOUT')
		}
	]);

	this.compact._onchange = function(v, bNoSave) {
		if(!bNoSave) {
			GWOthers.setItem('LAYOUT_SETTINGS', 'compact_view', v);
			GWOthers.save([function() {
				gui.frm_main._changeViewSize(v);
			}]);
		}
	};
	this.compact._value(GWOthers.getItem('LAYOUT_SETTINGS', 'compact_view') || "0", true);
};

_me.__viewSizeDestruct = function(){
	this.compact && this.compact._destruct();
};
