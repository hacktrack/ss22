_me = obj_address.prototype;
function obj_address() {};

_me.__constructor = function(){
	var me = this;

	if (GWOthers.getItem('EXTERNAL_SETTINGS', 'google_maps_api_key') && ((GWOthers.getItem('RESTRICTIONS','disable_gmaps') || 0)<1))
		this.X_MAP._onclick = function(){
			var v = me._value().values;
			if (v && v.LCTCITY && v.LCTSTREET){

				var str = [];
				if (v.LCTSTREET)
					str.push(v.LCTSTREET);
				if (v.LCTCITY)
					str.push((v.LCTZIP?v.LCTZIP+' ':'') + v.LCTCITY);

				if (v.LCTSTATE)
					str.push(v.LCTSTATE);
				if (v.LCTCOUNTRY)
					str.push(v.LCTCOUNTRY);
				str = str.join(', ');

				gui._create('map', 'frm_gmap','','',str);
			}
			else{
				if (!v.LCTCITY)
					addcss(me.LCTCITY._main,'error');

				if (!v.LCTSTREET)
					addcss(me.LCTSTREET._main,'error');

				setTimeout(function(){
					try{
						removecss(me.LCTCITY._main,'error');
						removecss(me.LCTSTREET._main,'error');
					}
					catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e);}
				},1000);
			}
		};
	else
		this.X_MAP._disabled(1);
};

_me._value = function(aValues) {
	if (aValues) {
		loadDataIntoForm(this, aValues['values']);
		this._id = aValues['values']['LCT_ID'];
	} else {
		var aResult = {'values': []};
		storeDataFromForm(this, aResult['values']);
		if (Is.Defined(this._id)) aResult['uid'] = this._id;

		return aResult;
	}
};

_me._title = function(sTitle){
	this._getAnchor('title').innerHTML = sTitle;
};

_me._readonly = function(b){
	this.LCTSTREET._readonly(b);
	this.LCTCITY._readonly(b);
	this.LCTSTATE._readonly(b);
	this.LCTZIP._readonly(b);
	this.LCTCOUNTRY._readonly(b);
};
_me._disabled = function(b){
	this.LCTSTREET._disabled(b);
	this.LCTCITY._disabled(b);
	this.LCTSTATE._disabled(b);
	this.LCTZIP._disabled(b);
	this.LCTCOUNTRY._disabled(b);
};

//Pass tabindexes to nasted objects
_me._tabIndex = function(sContainer,i,oDock){
	this.LCTSTREET._tabIndex(sContainer,i,oDock);
	this.LCTCITY._tabIndex(sContainer,i?++i:i,oDock);
	this.LCTSTATE._tabIndex(sContainer,i?++i:i,oDock);
	this.LCTZIP._tabIndex(sContainer,i?++i:i,oDock);
	this.LCTCOUNTRY._tabIndex(sContainer,i?++i:i,oDock);
};
_me._focus = function (b){
	return this.LCTSTREET._focus(b);
};