function obj_deviceinfo(){};
var _me = obj_deviceinfo.prototype;
/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function(s){
	var me = this;
	
	storage.library('wm_user');
	storage.library('wm_device');
	
	gui.frm_main.main._setHeadingButton('generic::save',function(){me._save();},'button text success');

	/* observer */
	this._changeObserverID='deviceinfo';
	gui._changeObserver.assignListener(this._changeObserverID,function(callback){
		if(callback){
			close();
			return me._save(false,callback);
		}else{
			return me._save('changed');
		}
	});
	//
	this._add_destructor('__onbeforedestruct');
	/* set onbefore destruct listener */
};

/** obbefore destruct listener */
_me.__onbeforedestruct=function(){
	// unassign observer listener
	gui._changeObserver.clearListener(this._changeObserverID);
}
/** */

_me._load = function(device)
{
	var me=this;
	try
	{
		me._draw('obj_deviceinfo', '', {items:{}});
		
		this.button_activate_device._onclick=function(){
			me.toggle_status._disabled(false);
			me.toggle_status._checked(true);
			me._getAnchor('fi_activate_block').setAttribute('is-hidden',1);
		}
		
		this.button_block_device._onclick=function(){
			me.toggle_status._disabled(false);
			me.toggle_status._checked(false);
			me.toggle_status._onchange(false);
			me._getAnchor('fi_activate_block').setAttribute('is-hidden',1);
		}
		
		this.button_soft_wipe._onclick=function(){
			gui.message.warning(getLang('description::device_soft_wipe'),false,[
				{
					value:getLang("generic::cancel"),
					method:'close'
				},
				{
					value:getLang("mobile_devices::wipe"),
					onclick:function(closeCallback){
						com.device.setSoftWipe(location.parsed_query.device,function(result){
							try
							{
								if(result.Array.IQ[0].QUERY[0].RESULT[0].VALUE==1){
									gui.message.toast(getLang("message::device_soft_wipe_set"));
								}else{
									gui.message.toast(getLang("error::device_set_wipe_failed"));
								}
							}
							catch(e)
							{
								log.error(e);
							}
							closeCallback();
						});
					},
					type:'text error'
				},
			]);
		};
		
		this.button_hard_wipe._onclick=function(){
			gui.message.warning(getLang('description::device_hard_wipe'),false,[
				{
					value:getLang("generic::cancel"),
					method:'close'
				},
				{
					value:getLang("mobile_devices::wipe"),
					onclick:function(closeCallback){
						com.device.setHardWipe(location.parsed_query.device,function(result){
							try
							{
								if(result.Array.IQ[0].QUERY[0].RESULT[0].VALUE==1){
									gui.message.toast(getLang("message::device_hard_wipe_set"));
								}else{
									gui.message.toast(getLang("error::device_set_wipe_failed"));
								}
							}
							catch(e)
							{
								log.error(e);
							}
							closeCallback();
						});
					},
					type:'text error'
				},
			]);
		};
		
		this.toggle_status._onchange=function(){
			com.device.setStatus(location.parsed_query.device,!this._checked(),function(result){
				try
				{
					if(result.Array.IQ[0].QUERY[0].RESULT[0].VALUE==1){
						if(me.toggle_status._checked())
						{
							gui.message.toast(getLang("message::device_allowed"));
						}
						else
						{
							gui.message.toast(getLang("message::device_blocked"));
						}
					}else{
						gui.message.toast(getLang("error::save_unsuccessful"));
					}
				}
				catch(e)
				{
					log.error(e);
				}
			});
		};
		
		com.device.deviceInfo(location.parsed_query.device,function(aResults){
			try
			{
				var items=aResults.Array.IQ[0].QUERY[0].RESULT[0].ITEM;
			}
			catch(e)
			{
				log.error(['e:invalid-data',e]);
			}
			
			try
			{
				for(var i=0; i<items.length; i++)
				{
					var propname=items[i].APIPROPERTY[0].PROPNAME[0].VALUE;
					var propval={};
					if(items[i].PROPERTYVAL && items[i].PROPERTYVAL[0]){
						propval=items[i].PROPERTYVAL[0];
					}
					var bval=false;
					var sval="";
					var ival=0;
					if(propval.VAL && propval.VAL[0] && propval.VAL[0].VALUE){
						sval = propval.VAL[0].VALUE;
						bval = (propval.VAL[0].VALUE=='0'||propval.VAL[0].VALUE==''?false:true);
						ival = parseInt(propval.VAL[0].VALUE);
					}
					
					try
					{
						log.log([propname.toLowerCase(),propval.VAL]);
						switch(propname.toLowerCase())
						{
							case 'device_account':
								me._getAnchor('account').innerHTML=helper.htmlspecialchars(sval);
							break;
							case 'device_os':
								me._getAnchor('os').innerHTML=helper.htmlspecialchars(sval);
							break;
							case 'device_type':
								me._getAnchor('type').innerHTML=helper.htmlspecialchars(sval);
							break;
							case 'device_model':
								me._getAnchor('model').innerHTML=helper.htmlspecialchars(sval);
							break;
							case 'device_registered':
								if(bval){
									me._getAnchor('registered').innerHTML=helper.date(getLang("datetime::php_date")+" "+getLang("datetime::php_time_minutes"),parseInt(helper.htmlspecialchars(sval)));
								}
							break;
							case 'device_lastsync':
								if(bval){
									me._getAnchor('last_sync').innerHTML=helper.date(getLang("datetime::php_date")+" "+getLang("datetime::php_time_minutes"),parseInt(helper.htmlspecialchars(sval)));
								}
							break;
							case 'device_name':
								gui.frm_main.main._setHeading(sval);
								n='input_device_name';
									me[n].__source=items[i];
									me[n]._value(sval);
							break;
							case 'device_status':
							
								// test quarantine
								//ival=3;
								//
							
								n='toggle_status';
									me[n].__source=items[i];
									me[n]._checked((ival==1?true:false),true);
									me[n]._disabled((ival==3?true:false));
									if(ival==3){
										me._getAnchor('fi_activate_block').removeAttribute('is-hidden');
									}else{
										me._getAnchor('fi_activate_block').setAttribute('is-hidden',1);
									}
							break;
							case 'device_remotewipe':
								// unsupported = 0
								// vse = 1
								// (neumi) hard = 2
								// (neumi) soft = 3
								switch(ival)
								{
									case 0:
										me.button_soft_wipe._disabled(true);
										me.button_hard_wipe._disabled(true);
									break;
									case 1:
										me.button_soft_wipe._disabled(false);
										me.button_hard_wipe._disabled(false);
									break;
									case 2:
										me.button_soft_wipe._disabled(false);
										me.button_hard_wipe._disabled(true);
									break;
									case 3:
										me.button_soft_wipe._disabled(true);
										me.button_hard_wipe._disabled(false);
									break;
								}
							break;
						}
					}
					catch(e)
					{
						log.error(e);
					}
				}
			}
			catch(e)
			{
				log.error(e);
			}
		});
		
	}
	catch(e)
	{
		log.error(e);
	}
}

_me._save=function(method,callback){
	var me=this;
	
	/** check changes */
	if(method && method=='changed'){
		var changed = com.user._prepareChanged([
			this.input_device_name
		]);
		log.log(['deviceinfo-save-changed',changed]);
		return changed;
	}
	/** */
	
	com.device.setProperty(location.parsed_query.device,'device_name',this.input_device_name._value(),function(result){
		try
		{
			if(result.Array.IQ[0].QUERY[0].RESULT[0].VALUE==0){
				gui.message.error(getLang("error::save_unsuccessful"));
			}else{
				gui.message.toast(getLang("message::save_successfull"));
				
				// clear all
				com.user._prepareChanged([
					me.input_device_name
				],true);
				// call callback for save and continue
				if(callback){callback();}
			}
		}
		catch(e)
		{
			log.error(e);
		}
	});
}
