function obj_devicesync(){};
var _me = obj_devicesync.prototype;
/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function(s){
	var me = this;
	
	storage.library('wm_user');
	storage.library('wm_device');
	
	gui.frm_main.main._setHeadingButton('generic::save',function(){me._save();},'button text success');

	me.__dropdown_past_mail_items={
		'*0':getLang('mobile_devices::all_mail_items'),
		'*1':getLang('mobile_devices::one_day'),
		'*2':getLang('mobile_devices::three_days'),
		'*3':getLang('mobile_devices::one_week'),
		'*4':getLang('mobile_devices::two_weeks'),
		'*5':getLang('mobile_devices::one_month')
	};
	
	me.__dropdown_past_calendar_items={
		'*0':getLang('mobile_devices::all_calendar_events'),
		'*1':getLang('mobile_devices::two_weeks'),
		'*2':getLang('mobile_devices::one_month'),
		'*3':getLang('mobile_devices::three_months'),
		'*4':getLang('mobile_devices::six_months')
	};

	/* observer */
	this._changeObserverID='devicesync';
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

_me._soulbound=function(toggle,object){
	var me=this;
	if(!me[toggle]._aSoulbound){
		me[toggle]._aSoulbound=[];
	}
	
	me[toggle]._aSoulbound.push(me[object]);
	
	me[toggle]._onchange=function(){
		for(var i=0; i<this._aSoulbound.length; i++)
		this._aSoulbound[i]._disabled(!this._checked());
	};
}

_me._load = function(device)
{
	var me=this;
	try
	{
		var me=this;
		me._draw('obj_devicesync', '', {items:{}});
		
		/** set toggles */
		this._soulbound('toggle_past_mail_items','dropdown_past_mail_items');
		this._soulbound('toggle_past_calendar_events','dropdown_past_calendar_events');
		//this._soulbound('toggle_sync_tasks_as_calendar_events','dropdown_sync_tasks_as_calendar_events');
		//this._soulbound('toggle_sync_tasks_as_calendar_events','dropdown_tasks_synchronization_type');
		//this._soulbound('toggle_sync_notes_as','dropdown_sync_notes_as');
		//this._soulbound('toggle_sync_notes_as','dropdown_notes_synchronization_type');
		/** */
		
		/** fill dropdowns */
		this.dropdown_notes_synchronization_type._fill({
			'*0':getLang('mobile_devices::new_folders'),
			'*1':getLang('mobile_devices::merge_to_default_folder')
			
		});
		
    this.dropdown_sync_notes_as._fill({
       '*1':getLang('mobile_devices::events'),
       '*2':getLang('mobile_devices::tasks'),
       '*3':getLang('mobile_devices::tasks_and_notes')
    });
    
    this.dropdown_groupware_folders._fill({
        '*0':getLang('devicedetail::default_folders_only'),
        '*1':getLang('devicedetail::all_folders'),
        '*2':getLang('devicedetail::all_with_groupware_as_email')
    });
    
    this.dropdown_mail_folders._fill({
        '*0':getLang('devicedetail::default_folders_only'),
        '*1':getLang('devicedetail::all_folders')
    });
		this.dropdown_past_mail_items._fill(me.__dropdown_past_mail_items);

		this.dropdown_past_calendar_events._fill(me.__dropdown_past_calendar_items);
		
		this.dropdown_sync_tasks_as_calendar_events._fill({
			'*0':getLang('mobile_devices::all_calendar_events'),
			'*1':getLang('mobile_devices::incomplete_tasks_only')
		});
		
		this.dropdown_tasks_synchronization_type._fill({
			'*0':getLang('mobile_devices::new_calendar_folders'),
			'*1':getLang('mobile_devices::merge_to_default_calendar_folder')
		});
		
		this.dropdown_tasks_synchronization_type._fill({
			'*0':getLang('mobile_devices::new_calendar_folders'),
			'*1':getLang('mobile_devices::merge_to_default_calendar_folder')
		});
		/** */
		
		/* SYNC LOGIC*/

    //folders
    /*
    
    //synchronize
    var tab1 = this.maintab.sync;
        tab1['mailfilter']._value(aXML.MAILS[0].ENABLED[0].VALUE);   
        tab1['mailfilter']._onchange = check;
        tab1['mailinterval']._value(aXML.MAILS[0].INTERVAL[0].VALUE);

        tab1['calendarfilter']._value(aXML.EVENTS[0].ENABLED[0].VALUE);
        tab1['calendarfilter']._onchange = check;
        tab1['calendarinterval']._value(aXML.EVENTS[0].INTERVAL[0].VALUE);

        tab1['tasksasevents']._value(aXML.TASKS[0].ENABLED[0].VALUE);
        tab1['tasksasevents']._onchange = check;       
        tab1['taskssynctype']._value(aXML.TASKS[0].MERGE[0].VALUE);
        tab1['taskssynctype']._onchange = check;
        tab1['taskssync']._value(aXML.TASKS[0].INCOMPLETE[0].VALUE);

        tab1['notesaseventsortasks']._value(aXML.NOTES[0].ENABLED[0].VALUE);
        tab1['notesaseventsortasks']._onchange = check;
        tab1['notessync']._value(aXML.NOTES[0].ENABLED[0].VALUE == '0'?'1':aXML.NOTES[0].ENABLED[0].VALUE);
        tab1['notessync']._onchange = check;
        tab1['notessynctype']._value(aXML.NOTES[0].MERGE[0].VALUE);
        tab1['notessynctype']._onchange = check;   

		*/
		/** *** */
		
		com.device.deviceSynchronization(location.parsed_query.device,function(aResults){
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
						bval = (propval.VAL[0].VALUE=='0'?false:true);
						ival=parseInt(propval.VAL[0].VALUE);
					}
					
					try
					{
						log.log(propname.toLowerCase());
						log.log([propname.toLowerCase(),propval.VAL]);
						switch(propname.toLowerCase())
						{
							case 'device_syncmail':
								n='toggle_past_mail_items';
									me[n].__source=items[i];
									me[n]._checked(bval);
							break;
							case 'device_syncmailpast':
								n='dropdown_past_mail_items';
									me[n].__source=items[i];
									me[n]._value(sval);
							break;
							case 'device_syncmailpastmax':
								n='dropdown_past_mail_items';
								var f={};
								for(var key in me.__dropdown_past_mail_items){
									if((parseInt(key.replace('*',''))<=ival && parseInt(key.replace('*',''))>0) || (ival==0)){
										f[key]=me.__dropdown_past_mail_items[key];
									}
								}
								var v=me[n]._value();
									me[n]._fill(f);
									me[n]._value(v);
							break;
							
							case 'device_synccal':
								n='toggle_past_calendar_events';
									me[n].__source=items[i];
									me[n]._checked(bval);
							break;
							case 'device_synccalpast':
								n='dropdown_past_calendar_events';
									me[n].__source=items[i];
									me[n]._value(sval);
							break;
							case 'device_synccalpastmax':
								n='dropdown_past_calendar_events';
								var f={};
								for(var key in me.__dropdown_past_calendar_items){
									if((parseInt(key.replace('*',''))<=ival && parseInt(key.replace('*',''))>0) || (ival==0)){
										f[key]=me.__dropdown_past_calendar_items[key];
									}
								}
								var v=me[n]._value();
									me[n]._fill(f);
									me[n]._value(v);
							break;
							
							case 'device_synctaskas':
								n='toggle_sync_tasks_as_calendar_events';
									me[n].__source=items[i];
									me[n]._checked(bval);
									me[n]._onchange=function(){me._check()};
							break;
							case 'device_synctaskasvalue':
								n='dropdown_sync_tasks_as_calendar_events';
									me[n].__source=items[i];
									me[n]._value(sval);
							break;							
							case 'device_synctaskastype':
								n='dropdown_tasks_synchronization_type';
									me[n].__source=items[i];
									me[n]._value(sval);
							break;
							
							case 'device_syncnotesas':
								n='toggle_sync_notes_as';
									me[n].__source=items[i];
									me[n]._checked(bval);
									me[n]._onchange=function(){me._check()};
							break;							
							case 'device_syncnotesasvalue':
								n='dropdown_sync_notes_as';
									me[n].__source=items[i];
									me[n]._value(sval);
							break;							
							case 'device_syncnotesastype':
								n='dropdown_notes_synchronization_type';
									me[n].__source=items[i];
									me[n]._value(sval);
							break;
							
							case 'device_syncgroupwarefolders':
								n='dropdown_groupware_folders';
									me[n].__source=items[i];
									me[n]._value(sval);
									me[n]._onchange=function(){me._check()};
							break;
							
							case 'device_syncmailfolders':
								n='dropdown_mail_folders';
									me[n].__source=items[i];
									me[n]._value(sval);
									me[n]._onchange=function(){me._check()};
							break;
							
							case 'device_syncsharedfolders':
								n='toggle_shared_folders';
									me[n].__source=items[i];
									me[n]._checked(bval);
							break;
							
							case 'device_syncarchivefolders':
								n='toggle_archive';
									me[n].__source=items[i];
									me[n]._checked(bval);
							break;
							
							case 'device_syncpublicfolders':
								n='toggle_public_folders';
									me[n].__source=items[i];
									me[n]._checked(bval);
							break;
							/* DEMO
							case '-':
								n='toggle_account_quote_enabled';
									me[n].__source=items[i];
									me[n]._value(sval);
							break;
							*/
							/* DEMO
							case '-':
								n='toggle_account_quote_enabled';
									me[n].__source=items[i];
									me[n]._checked(bval);
							break;
							*/
						}
					}
					catch(e)
					{
						log.error(e);
					}
				}
				me._check();
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

_me._check=function(){
	
	var tab0=this;
	var tab1=this;
	
	tab0['dropdown_mail_folders']._disabled(tab0['dropdown_groupware_folders']._value() == 2);
	tab0['toggle_archive']._disabled(tab0['dropdown_groupware_folders']._value() != 2 && tab0['dropdown_mail_folders']._value() != 1);
	tab0['toggle_public_folders']._disabled(tab0['dropdown_groupware_folders']._value() == 0 && tab0['dropdown_mail_folders']._value() != 1);
	tab0['toggle_shared_folders']._disabled(tab0['toggle_public_folders']._disabled());
	
	tab1['dropdown_sync_tasks_as_calendar_events']._disabled(!tab1['toggle_sync_tasks_as_calendar_events']._checked());
	tab1['dropdown_tasks_synchronization_type']._disabled(!tab1['toggle_sync_tasks_as_calendar_events']._checked() || tab0['dropdown_groupware_folders']._value() == 0);
	tab1['dropdown_sync_notes_as']._disabled(!tab1['toggle_sync_notes_as']._checked() || tab1['toggle_sync_tasks_as_calendar_events']._checked());
	tab1['dropdown_notes_synchronization_type']._disabled(!tab1['toggle_sync_notes_as']._checked() || tab0['dropdown_groupware_folders']._value() == 0);
	
	//Force Merge to default folder
	if (tab0['dropdown_groupware_folders']._value() == 0) {
	    if (tab1['toggle_sync_tasks_as_calendar_events']._checked())
	        tab1['dropdown_tasks_synchronization_type']._value(1,true);
	
	    if (tab1['toggle_sync_notes_as']._checked())
	        tab1['dropdown_notes_synchronization_type']._value(1,true);
	}
	
	//Force Notes As Events
	if (tab1['toggle_sync_tasks_as_calendar_events']._checked() && tab1['toggle_sync_notes_as']._checked() && tab1['dropdown_sync_notes_as']._value() == 2)
	    tab1['dropdown_sync_notes_as']._value(1);
	/*
	
	//Limit Mail age filter to Max mail age filter set by provision
	if (tab1['mailfilter']._checked() && aXML.MAILS[0].MAXINTERVAL[0].VALUE>0)
	    if (tab1['mailinterval']._value() == 0 || aXML.MAILS[0].MAXINTERVAL[0].VALUE < tab1['mailinterval']._value())
	            tab1['mailinterval']._value(aXML.MAILS[0].MAXINTERVAL[0].VALUE);
	
	//Limit Event age filter to Max event age filter set by provision
	if (tab1['calendarfilter']._checked() && aXML.EVENTS[0].MAXINTERVAL[0].VALUE>0)
	    if (tab1['calendarinterval']._value() == 0 || aXML.EVENTS[0].MAXINTERVAL[0].VALUE < tab1['calendarinterval']._value())
	            tab1['calendarinterval']._value(aXML.EVENTS[0].MAXINTERVAL[0].VALUE);
	
	
	
	
	    */
}

_me._save=function(method,callback){
	var me=this;
	try
	{
		var toSave=[
			me.toggle_past_mail_items,
			me.dropdown_past_mail_items,
			me.toggle_past_calendar_events,
			me.dropdown_past_calendar_events,
			me.toggle_sync_tasks_as_calendar_events,
			me.dropdown_sync_tasks_as_calendar_events,
			me.dropdown_tasks_synchronization_type,
			me.toggle_sync_notes_as,
			me.dropdown_sync_notes_as,
			me.dropdown_notes_synchronization_type,
			me.dropdown_groupware_folders,
			me.dropdown_mail_folders,
			me.toggle_shared_folders,
			me.toggle_archive,
			me.toggle_public_folders
		];
		
		/** check changes */
		if(method && method=='changed'){
			var changed = com.user._prepareChanged(toSave);
			log.log(['devicesync-save-changed',changed]);
			return changed;
		}
		/** */
		
		var items = com.device._prepareSet(toSave);
		
		var account='';
		if(location.parsed_query.device){
			account=location.parsed_query.device;
		}
		
		com.device.setData(account,items,[function(result){
			if(result.Array.IQ[0].QUERY[0].RESULT[0].VALUE==0){
				gui.message.error(getLang("error::save_unsuccessful"));
			}else{
				gui.message.toast(getLang("message::save_successfull"));
				
				// clear all
				com.user._prepareChanged(toSave,true);
				// call callback for save and continue
				if(callback){callback();}
			}
		}]);
	}
	catch(e)
	{
		log.error(e);
	}
}
