_me = obj_popup.prototype;
function obj_popup(){};

/**
 * @brief:
 * @date : 01.12.2014
 **/
var that=false;
_me.__constructor = function(s){
	var me = this;
	that=me;
	
	if(!gui._popupList){gui._popupList=[];}else{
		for(var i=0; i<gui._popupList.length; i++){
			gui._popupList[i]._hide();
		}
	}
	gui._popupList.push(this);
	
	log.log(this.main._setHeadingButton);
	this.main._setHeadingButton('',function(){
		me._refresh = null;
		if(me.content && me.content._data && me.content._data.hasChanged && me.content._data.hasChanged()) {
			me._unsavedChangesFound();	
		} else {
			me._close();
		}
	},'button obj_button icon icon-close _noduplicate');
	
	this._fixed(true);
	
	this._main.onclick=function(){
		var e = e || window.event,
			elm = e.target || e.srcElement;

		if(elm.className=='modal')
		{
			me._refresh = null;
			me._close();
			e.cancelBubble=true;
			e.stopPropagation();
			return false;
		}
	}
	
	addcss(document.getElementsByTagName('body')[0],'has-modal');
	
	//this.main._iwAttr('type','modal');
	
	this._add_destructor('__onbeforedestruct');
	/* set onbefore destruct listener */
};

/** onbefore destruct listener */
_me.__onbeforedestruct=function(){
	if(this._onbeforedestruct){
		this._onbeforedestruct(this);
	}
	if(this.content){
		this.content._destruct();
	}
	if(gui._popupList.length==0){
		removecss(document.getElementsByTagName('body')[0],'has-modal');
	}

	this._refresh && this._refresh();
}
/** */

_me._save=false;

_me._init=function(settings,cb){
	var me=this;
	
	me._type('modal');
	me._iwAttr('name',settings.name);
	
	if(settings.footer=='default'){
		settings.footer='obj_popup_footer';
	}

	if(settings.onsave){
		me._save=settings.onsave;
		delete settings.onsave;
	}

	if(settings.refresh){
		me._refresh=settings.refresh;
		delete settings.refresh;
	}
	
	if(typeof settings.fixed != 'undefined'){
		me._fixed(settings.fixed);
		delete settings.fixed;
	}
	
	if(typeof settings.size != 'undefined'){
		me._size(settings.size);
		delete settings.size;
	}
	
	if(typeof settings.classes != 'undefined'){
		me._addClass(settings.classes);
		delete settings.classes;
	}
	
	if(typeof settings.type != 'undefined' && settings.type != 'default'){
		me._type(settings.type);
		delete settings.type;
	}
	
	if(typeof settings.iwattr != 'undefined'){
		me._iwAttr(settings.iwattr);
		delete settings.iwattr;
	}
	
	this.main._init(settings,function(){
		if(me.main.btn_save)
		{
			me.main.btn_save._onclick=function(){
				if(me._save){
					me._save();
				}else if(me.content._save){
					me.content._save();
				}
			}
		}
		
		if(me.main.btn_cancel)
		{
			me.main.btn_cancel._onclick=function(e){
				me._refresh = null;
				if(me.content && me.content._data && me.content._data.hasChanged && me.content._data.hasChanged()) {
					me._unsavedChangesFound();	
				} else {
					me._close();
				}
			};
		}
		
		if(settings.content){
			if(!me.main[settings.name]){
				me.main._clean('main_content');
				me.main._create(settings.name,settings.content,'main_content');
			}
			me.content=me.main[settings.name];
			// Make close/save/fill available from content object
			me.content._close=function(){
				me._close();
			};
			me.content._saveFeedbackAndClose=function(ok){
				me._saveFeedbackAndClose(ok);
			};
			me.content._fillFieldsWithData=function(data){
				me._fillFieldsWithData(data);
			};
		}
		
		if(settings.template){	
			me.main._clean('main_content');
			me.main._draw(settings.template,'main_content');
		}
		
		if(cb){cb();}
	});
}

_me._hide=function(){
	log.log('should be hidden');
	this._main.setAttribute('is-hidden',1);
}

_me._show=function(){
	this._main.removeAttribute('is-hidden');
}


_me._overlay=function(){
	var me=this;
	return {
		_iwAttr:function(arr,val){
			me._iwAttr(arr,val,me._getAnchor('overlay'));
		}
	}
};

_me._iwAttr=function(arr,val,target){
	if(!target){
		target=this.main._main;
	}
	if(typeof arr != 'object'){
		n={};
		n[arr]=val;
		arr=n;
	}
	for(var key in arr){
		target.setAttribute('iw-'+key,arr[key]);
	}
}

_me._type=function(type){
	this.main._iwAttr('type',type);
}

_me._fixed=function(fixed){
	this.main._isFixed(fixed);
}

_me._size=function(size){
	this.main._size(size);
}

_me._addClass=function(classes){
	this.main._addClass(classes);
}

_me._removeClass=function(classes){
	this.main._removeClass(classes);
}

_me._close=function(){
	if(!gui._popupList){gui._popupList=[];}else{
		var thepopup=0;
		for(var i=0; i<gui._popupList.length; i++){
			if(gui._popupList[i]==this){
				thepopup=i;
			}
		}
		gui._popupList.splice(thepopup,1);
	}
	this._destruct();
	
	if(gui._popupList.length>0){
		gui._popupList[gui._popupList.length-1]._show();
	}
}

_me._fillFieldsWithData = function(data) {
	var mapping = window[this.content._type]._mapping;
	data = data || this.content._data;
	if(mapping && data) {
		// Map fields to actual values from server (or default to null)
		this.content._mapping = {};
		for(var field in mapping) {
			if(data[mapping[field]]) {
				this.content._mapping[field] = data[mapping[field]];
			} else {
				var v = new IWAPI.Value(null,mapping[field]);
				this.content._mapping[field] = v;
				data.addItem(v);
			}
		}
		// Fill inputs in template
		for(var field in this.content._mapping) {
			if(this.content[field]) {
				this.content[field]._setValue(this.content._mapping[field]);
			} else if(this.content._parent[field]) {
				this.content._parent[field]._setValue(this.content._mapping[field]);
			}
		}
	}
}


_me._saveFeedbackAndClose = function(ok) {
	if(ok){
		gui.message.toast(getLang("message::save_successfull"));
		this._close();
	} else {
		gui.message.error(getLang("error::save_unsuccessful"));
	}
}

_me._unsavedChangesFound = function() {
	var me = this;

	gui.message.warning(getLang("warning::changes_found"),false,[
		{
			value:getLang("generic::cancel"),
			type:'text borderless',
			method:'close'
		},{
			value:getLang("generic::do_not_save"),
			type:'text error',
			onclick:function(closeCallback){
				closeCallback();
				me._close();
			}
		},{
			value:getLang("generic::save"),
			type:'success text',
			onclick:function(closeCallback){
				closeCallback();
				if(me.content && me.content._save) {
					me.content._save();
				}
			}
		}
	]);
	
}


/* View */

var PopupWindowView = function(controller) {
	this._control = controller;
}

PopupWindowView.prototype.saveNotification = function(succeeded) {
	var popup = this._control;
	if(succeeded){
		gui.message.toast(getLang("message::save_successfull"));
		this._control._close();
	} else {
		gui.message.error(getLang("error::save_unsuccessful"));
	}
}
