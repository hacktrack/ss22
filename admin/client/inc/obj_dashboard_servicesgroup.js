_me = obj_dashboard_servicesgroup.prototype;
function obj_dashboard_servicesgroup(){};

/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function(){
	var me = this;
	me.__status=-1;
	me.__itemsOn={};
	me.__itemsOff={};
	me.__items={};
	me._load();
};

_me._load = function()
{
	var that=this;
	var me=this;
	var parent=this._parent;
	
	me._draw('obj_dashboard_servicesgroup', '', {});
	addcss(me._main,'service-group');
	log.log(['servicesgroup-load',me.expand]);
	me.expand._onclick=function(){
		if(!me.__expanded){
			addcss(me._main,'is-active');
			me.__expanded=true;
		}else{
			removecss(me._main,'is-active');
			me.__expanded=false;
		}
	}
	me._getAnchor('header').onclick=function(){me.expand._onclick();};
}

_me._updateStatus=function(){
	var sf=false;
	var st=true;
	for(var key in this.__items){
		if(typeof this.__items[key].__status !=='undefined'){
			if(this.__items[key].__status){
				sf=true;
			}else{
				st=false;
			}
		}
	}
	if(sf && st){
		this._setStatus(1);
	}else if(!sf && !st){
		this._setStatus(-1);
	}else{
		this._setStatus(0);
	}
}

_me._setStatus=function(status){
	var sStatus='both';
	if(status<0){sStatus='off';}
	if(status>0){sStatus='on';}
	removecss(this._main,'status-on');
	removecss(this._main,'status-off');
	removecss(this._main,'status-both');
	addcss(this._main,'status-'+sStatus);
}

_me._addItem=function(id,data){
	try
	{
		var me=this;
		var status=0;
		
		if(data.data.status != 'undefined'){
			if(me.__itemsOn[id]){delete me.__itemsOn[id];}
			if(me.__itemsOff[id]){delete me.__itemsOff[id];}
			
			if(data.data.status){
				me.__itemsOn[id]=true;
			}else{
				me.__itemsOff[id]=true;
			}
		}
		
		if(helper.associativeArrayLength(me.__itemsOn)>0){
			status++;
		}
		if(helper.associativeArrayLength(me.__itemsOff)>0){
			status--;
		}
		
		me._setStatus(status);
		
			if(!me.__items[id]){
				me.__items[id]=this._create(id,'obj_dashboard_servicesitem','items');
			}
			me.__items[id]._label(data.label);
			me.__items[id]._hide(data.hide);
			me.__items[id]._deny(data.deny);
			me.__items[id]._refresh(data.data);
	}
	catch(e)
	{
		log.error(e);
	}
}

_me._label= function(string){
	this._getAnchor('label').innerHTML=helper.htmlspecialchars(getLang(string));
}