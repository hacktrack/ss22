_me = obj_spamqueues_global.prototype;
function obj_spamqueues_global(){};

/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function(s){
	var me = this;
	var parent=this._parent;
	storage.library('wm_spamqueues');
	this.__actions=[];
};

_me._filter=function(){
	this.list._load();
}

_me._initActions=function(){
	var me=this;
	/* set actionmenu actions for selected items */
	if(!gui.frm_main.main.actions){
		gui.frm_main.main._cleanHeadingButtonsAnchor();
			gui.frm_main.main._setAlternativeButtons(function(box,target_anchor){
				if(!box._alternativeButtons){
					box._alternativeButtons=[];
				}
				var actionobject = box._create('actions','obj_actionselect',target_anchor);
				actionobject._value('generic::select_action');
				if(target_anchor=='heading_buttons_mobile'){actionobject._addcss('full',true);}
				
				actionobject._fill(me.__actions);
			actionobject._disabled(true);
			
			box._alternativeButtons.push(actionobject);
		});
	}
}

_me._initFilter=function(){
	var me=this;
	/* set on methods */
	me.button_filter_owner._onclick=function(){
		gui.accountpicker(function(data){
			log.log(['spamqueues-quarantine-load-accountpicker',data]);
			if(data[0]){
				me.input_filter_owner._value(data[0].email);
				me._filter();
			}
		},{
			// some cool settings defining the accountPicker's behavior
			disable_add_domain:true,
			singledomain:true
		});
	}
	
	me.button_filter_domain._onclick=function(){
		gui.accountpicker(function(data){
			log.log(['spamqueues-quarantine-load-accountpicker',data]);
			if(data[0]){
				me.input_filter_domain._value(data[0].unpunied);
				me._filter();
			}
		},{
			// some cool settings defining the accountPicker's behavior
			domainpicker:true,
			singledomain:true
		});
	}
	
	me.input_filter_sender._onsubmit=function(){
		me._filter();
	}
	
	me.input_filter_owner._onsubmit=function(){
		me._filter();
	}
	
	me.input_filter_domain._onsubmit=function(){
		me._filter();
	}
	
	me.button_filter._onclick=function(){me._filter()};
	/**/
}

_me._deliverSelectedItems=function(){
	var me=this;
	me.__itemsToAction=me.list._getSelectedList();
	var go=function(){
		var item=me.__itemsToAction.pop();
		if(item){
			com.spamqueues.deliverItem(item.itemid,function(success,error){
				me._handleBooleanResponse(go,success,error,getLang("message::items_delivered_successfully"),getLang("error::items_deliver_failed"));
			});
		}
	}
	if(me.__itemsToAction[0]){
		go();
	}
}

_me._deleteSelectedItems=function(){
	var me=this;
	me.__itemsToAction=me.list._getSelectedList();
	var go=function(){
		var item=me.__itemsToAction.pop();
		if(item){
			com.spamqueues.deleteItem(item.itemid,function(success,error){
				me._handleBooleanResponse(go,success,error,getLang("message::items_deleted_successfully"),getLang("error::items_delete_failed"));
			});
		}
	}
	if(me.__itemsToAction[0]){
		go();
	}
}

_me._blacklistSelectedItems=function(){
	var me=this;
	me.__itemsToAction=me.list._getSelectedList();
	var go=function(){
		var item=me.__itemsToAction.pop();
		if(item){
			com.spamqueues.blacklistItem(item.itemid,function(success,error){
				me._handleBooleanResponse(go,success,error,getLang("message::items_blacklisted_successfully"),getLang("error::items_blacklist_failed"));
			});
		}
	}
	if(me.__itemsToAction[0]){
		go();
	}
}

_me._whitelistSelectedItems=function(){
	var me=this;
	me.__itemsToAction=me.list._getSelectedList();
	var go=function(){
		var item=me.__itemsToAction.pop();
		if(item){
			com.spamqueues.whitelistItem(item.itemid,function(success,error){
				me._handleBooleanResponse(go,success,error,getLang("message::items_whitelisted_successfully"),getLang("error::items_whitelist_failed"));
			});
		}
	}
	if(me.__itemsToAction[0]){
		go();
	}
}

_me._handleBooleanResponse=function(go,success,error,sSuccess,sError){
	var me=this;
	try
	{
		if(me.__itemsToAction[0] && success){
			go();
		}else if(!me.__itemsToAction[0] && success){
			//success
			gui.message.toast(sSuccess);
			me.list._load();
		}else{
			// fail
			if(error){
				gui.message.error(getLang("error::"+error));
			}else{
				gui.message.error(sError);
			}
			me.list._load();
		}
	}
	catch(e)
	{
		log.error(['spamqueues-global-handleBooleanResponse',e]);
	}
}