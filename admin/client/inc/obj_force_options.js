_me = obj_force_options.prototype;
function obj_force_options(){};

/**
* @brief: CONSTRUCTOR, create input HTML element to __eIN variable
* @date : 20.4.2006 17:24:21
**/
_me.__constructor = function(){
	var me=this;
	
	me.__oDomain=this._create('force_domain','obj_toggle');
	addcss(me.__oDomain._main,'domain');
	
	me.__oUser=this._create('force_user','obj_toggle');
	addcss(me.__oUser._main,'user');
	
	me.__oDomain._onchange=function(checked){
		me.__onchange(checked);
	};
	me.__oUser._onchange=function(checked){
		me.__onchange(checked);
	};
};

_me.__onchange=function(checked){
	var me=this;
	if(me.__oDomain._checked()){
		me.__oUser._checked(true,true);
	}
	
	if(this._onchange){
		this._onchange(this._value());
	}
}

_me._onchange=function(){
	
}

_me._changed=function(clear){
	
}

_me._value=function(data,readonly){
	try
	{
		if(typeof data != 'undefined')
		{
			// handle domain admin
			if(gui._globalInfo.admintype==USER_DOMAIN){
				readonly=READONLY_BOTH;
			}
			//
			
			if(typeof readonly == 'undefined' && typeof data.readonly != 'undefined'){readonly=data.readonly;}
			
			if(readonly && readonly==READONLY_DOMAIN || readonly==READONLY_BOTH){
				this.force_domain._readonly(true);
			}else{
				this.force_domain._readonly(false);
			}
			if(readonly && readonly==READONLY_USER || readonly==READONLY_BOTH){
				this.force_user._readonly(true);
			}else{
				this.force_user._readonly(false);
			}
			
			if(data && typeof data.domainadminaccesslevel != 'undefined' && typeof data.useraccesslevel != 'undefined'){
				if(data.domainadminaccesslevel>=FORCE_HIDDEN){
					data.domainadminaccesslevel=data.domainadminaccesslevel-FORCE_HIDDEN;
					data.domainadminaccesslevel_hidden=true;
					this.force_domain._hide(true);
				}
				if(data.useraccesslevel>=FORCE_HIDDEN){
					data.useraccesslevel=data.useraccesslevel-FORCE_HIDDEN;
					data.useraccesslevel=true;
					this.force_user._hide(true);
				}
				if(data.domainadminaccesslevel==FORCE_UNCHECKED || data.domainadminaccesslevel==FORCE_DEFAULT){
					this.force_domain._checked(false);
				}else if(data.domainadminaccesslevel==FORCE_CHECKED){
					this.force_domain._checked(true);
				}
				
				if(data.useraccesslevel==FORCE_UNCHECKED || data.useraccesslevel==FORCE_DEFAULT){
					this.force_user._checked(false);
				}else if(data.useraccesslevel==FORCE_CHECKED){
					this.force_user._checked(true);
				}
			}else{
				log.error(['forceoptions-value','invalid data',data]);
			}
		}
		
		return {
			domainadminaccesslevel:(this.force_domain._checked()?FORCE_CHECKED:FORCE_UNCHECKED),
			useraccesslevel:(this.force_user._checked()?FORCE_CHECKED:FORCE_UNCHECKED),
		}
	}
	catch(e)
	{
		log.error(['forceoptions-value',e]);
	}
}