_me = obj_dayview.prototype;
function obj_dayview(){};

_me.__constructor = function(owner){
	this._closeOnContext = false;

	this._create('day', 'obj_evnview');

	//hardlink to frm_main_calendar
	if (owner){
		this.day._onchange = function(aValues){
			owner._onchange(aValues,true);
		};
		this.day._onadd = function(aValues){
			owner._onadd(aValues);
		};
		this.day._onremove = function(id){
			owner._onremove(id);
		};
		this.day._ondblclick = function(e,elm,arg){
			owner._ondblclick(e,elm,arg);
		};
		this.day._oncontext = function(e,elm,arg){
			owner._oncontext(e,elm,arg);
		};
	}
};

_me._setRange = function(r){
	this.day._range(r,r,GWOthers.getItem('CALENDAR_SETTINGS','day_begins'),GWOthers.getItem('CALENDAR_SETTINGS','day_ends'));
};

_me._listen_data = function(sDataSet,aDataPath){
	this.day._listen_data(sDataSet,aDataPath);
};