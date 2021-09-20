function obj_accountemail(){};
var _me = obj_accountemail.prototype;
/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function(s){
	var me = this;
	storage.library('wm_user');
	
	gui.frm_main.main._setHeadingButton('generic::save',function(){me._save();},'button text success');
	
	/* observer */
	this._changeObserverID='accountemail';
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

_me._setRight=function(right,element){
	global.setRight(this,right,element);
}

_me._load = function(domain)
{
	log.log('Load list of users for domain '+domain);
	
	var me=this;
	
	me._draw('obj_accountemail', '', {items:{}});
	
	this.btn_responder_message._disabled(true);
	
	this.dropdown_email_mode._fill({
		'0':getLang('accountdetail::disabled'),
		'1':getLang('accountdetail::respond_always'),
		'2':getLang('accountdetail::respond_once'),
		'3':getLang('accountdetail::respond_again_after_period')
	});
	
	this.dropdown_email_reports._fill({
		'0':getLang('accountdetail::disabled'),
		'1':getLang('accountdetail::default'),
		'2':getLang('accountdetail::new_items'),
		'3':getLang('accountdetail::all_items')
	});
	
	this.dropdown_email_folder._fill({
		'0':getLang('accountdetail::default'),
		'1':getLang('accountdetail::do_not_use_spam'),
		'2':getLang('accountdetail::use_spam')
	});
	
	// open message dialog
	this.btn_responder_message._onclick=function(){
		me._message();
	}
	
	this.dropdown_email_mode._onchange=function(){
		if(this._value()=='0'){
			me._disable_responder();
			me.btn_responder_message._disabled(true);
		}else if(this._value()=='1' || this._value()=='2' || this._value()=='3'){
			me._enable_responder();
			me.btn_responder_message._disabled(false);
			if(this._value()=='3'){
				me.input_email_again._disabled(false);
			}else{
				me.input_email_again._disabled(true);
			}
		}else{
			me._enable_responder();
		}
	}
	
	this.input_email_forward._onkeyup=function(){
		if(helper.trim(this._value())!='')
		{
			me.toggle_email_do_not_forward._disabled(false);
		}
		else
		{
			me.toggle_email_do_not_forward._disabled(true);
		}
	}
	this.input_email_forward._onchange=this.input_email_forward._onkeyup;
	
	this.toggle_email_do_not_forward._disabled(true);
	this._disable_responder();
	
	var doit=function(){
		var account='';
		if(location.parsed_query.account){
			account=location.parsed_query.account;
		}
		
		// forwarder
		com.user.forwarder(account,function(aResults){
			try
			{
				var items=aResults.Array.IQ[0].QUERY[0].RESULT[0].ITEM;
			}
			catch(e)
			{
				log.error(['e:invalid-data',e]);
			}
			
			//log.log(items);
			
			try
			{
				for(var i=0; i<items.length; i++)
				{
					var propname=items[i].APIPROPERTY[0].PROPNAME[0].VALUE;
					var propval={};
					if(items[i].PROPERTYVAL && items[i].PROPERTYVAL[0]){
						propval=items[i].PROPERTYVAL[0];
					}
					if(items[i].PROPERTYRIGHT && items[i].PROPERTYRIGHT[0]){
						propright=items[i].PROPERTYRIGHT[0].VALUE;
					}else{propright=2;}
					
					// debug
					//if(propname.toLowerCase()=='u_donotforwardspam'){
					//	propright=2;
					//}
					//
					
					try
					{
						log.log([propname.toLowerCase(),(propval.VAL&&propval.VAL[0]&&propval.VAL[0].VALUE?propval.VAL[0].VALUE:false)]);
						
						switch(propname.toLowerCase())
						{
							case 'u_donotforwardspam':
								me.toggle_email_do_not_forward.__source=items[i];
								me.toggle_email_do_not_forward._checked((propval.VAL&&propval.VAL[0].VALUE=='0'?false:true));
								me._setRight(propright,'toggle_email_do_not_forward');
							break;
							case 'u_forwardto':
								me.input_email_forward.__source=items[i];
								me.input_email_forward._value(propval.VAL&&propval.VAL[0].VALUE);
								me._setRight(propright,'input_email_forward');
							break;
							case 'u_alternateemail':
								me.input_email_alternate.__source=items[i];
								me.input_email_alternate._value(propval.VAL&&propval.VAL[0].VALUE);
								me._setRight(propright,'input_email_alternate');
							break;
							case 'u_mailin':
								me.input_email_incoming.__source=items[i];
								me.input_email_incoming._value(propval.VAL&&propval.VAL[0].VALUE);
								me._setRight(propright,'input_email_incoming');
							break;
							case 'u_mailout':
								me.input_email_outgoing.__source=items[i];
								me.input_email_outgoing._value(propval.VAL&&propval.VAL[0].VALUE);
								me._setRight(propright,'input_email_outgoing');
							break;
							case 'u_quarantinereports':
								me.dropdown_email_reports.__source=items[i];
								me.dropdown_email_reports._value(propval.VAL&&propval.VAL[0].VALUE);
								me._setRight(propright,'dropdown_email_reports');
							break;
							case 'u_spamfolder':
								me.dropdown_email_folder.__source=items[i];
								me.dropdown_email_folder._value(propval.VAL&&propval.VAL[0].VALUE);
								me._setRight(propright,'dropdown_email_folder');
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
		
		// responder
		com.user.responder(account,function(aResponse){
			var items=aResponse.Array.IQ[0];
			log.log(items);
			
			if(items.QUERY[0].RESULT[0].ITEM[0])
			{
				try
				{
				
					var propval = items.QUERY[0].RESULT[0].ITEM[0].PROPERTYVAL[0];
					var propitem = items.QUERY[0].RESULT[0].ITEM[0];
						propitem.PROPERTYVAL[0]={};
					me._responder_source=propitem;
					
					if(items.QUERY[0].RESULT[0].ITEM[0].PROPERTYRIGHT[0]){
						propright=items.QUERY[0].RESULT[0].ITEM[0].PROPERTYRIGHT[0].VALUE;
					}else{propright=2;}
					
					// debug
					//propright=0;
					//
					
					me._setRight(propright,[
						'dropdown_email_mode',
						'input_email_again',
						'input_email_from',
						'input_email_to',
						'toggle_email_respond_to_messages',
						'btn_responder_message'
					]);
					
				
					for(var key in propval)
					{
						var val = '';
						if(propval[key][0] && propval[key][0].VALUE){
							val = propval[key][0].VALUE;
						}
						switch(key.toLowerCase())
						{
							case 'respondertype':
								me.dropdown_email_mode.__key=key;
								me.dropdown_email_mode.__source=propval[key];
								me.dropdown_email_mode._value(val);
							break;
							case 'respondperiod':
								me.input_email_again.__key=key;
								me.input_email_again.__source=propval[key];
								me.input_email_again._value(val);
							break;
							case 'respondbetweenfrom':
								me.input_email_from.__key=key;
								me.input_email_from.__source=propval[key];
								
									me.input_email_from._value(val.replace(/\//g,'-'));
								
								if(parseInt(val)>0){me.__respondfrom_set=true;}
							break;
							case 'respondbetweento':
								me.input_email_to.__key=key;
								me.input_email_to.__source=propval[key];
								
								me.input_email_to._value(val.replace(/\//g,'-'));
								
								if(parseInt(val)>0){me.__respondto_set=true;}
							break;
							case 'respondonlyiftome':
								me.toggle_email_respond_to_messages.__key=key;
								me.toggle_email_respond_to_messages.__source=propval[key];
								me.toggle_email_respond_to_messages._checked((val==1 || val=='1'?true:false));
							break;
							case 'respondermessage':
								log.log(['saved responder message']);
								me._responder_message={};
								me._responder_message.__key=key;
								me._responder_message.__source=propval[key];
							break;
						}
					}
				}
				catch(e){
					log.error(e);
				}
				/*
				// set default time to date inputs
				if(!me.__respondfrom_set){
					var dateObj=new Date();
					var time=Math.floor(dateObj.getTime()/1000)-(86400*7); // 7 days ago
					log.log(['from',time,parseInt(helper.date('Y',time)),parseInt(helper.date('d',time)),parseInt(helper.date('m',time))]);
					me.input_email_from._setDate(parseInt(helper.date('Y',time)),parseInt(helper.date('m',time)),parseInt(helper.date('d',time)));
				}
				if(!me.__respondto_set){
					var dateObj=new Date();
					var time=Math.floor(dateObj.getTime()/1000)+(86400*7); // 7 days ago
					log.log(['to',time,parseInt(helper.date('Y',time)),parseInt(helper.date('d',time)),parseInt(helper.date('m',time))]);
					me.input_email_to._setDate(parseInt(helper.date('Y',time)),parseInt(helper.date('m',time)),parseInt(helper.date('d',time)));
				}
				//
				*/
			}
		});
	}
	
	me._main.onclick=function(e){
		
	};
	
	me.timeout=setInterval(function(){
		if(storage.css_status('obj_accountemail'))
		{
			clearInterval(me.timeout);
			doit();
		}
	},100);
}

_me._disable_responder=function(){
	this.input_email_again._disabled(true);
	this.input_email_from._disabled(true);
	this.input_email_to._disabled(true);
	this.toggle_email_respond_to_messages._disabled(true);
}

_me._enable_responder=function(){
	this.input_email_again._disabled(false);
	this.input_email_from._disabled(false);
	this.input_email_to._disabled(false);
	this.toggle_email_respond_to_messages._disabled(false);
}

_me._message=function(){
	var popup=gui._create('popup','obj_popup');
	popup._init({
		name:'message',
		heading:{
			value:getLang('accountdetail::message')
		},
		fixed:false,
		footer:'default',
		content:"obj_accountemail_message"
	});

	popup.content._load(location.parsed_query.account,this);
}

_me._save=function(method,callback){
	var me=this;
	try
	{
		
		var list=[
		// LIST OF RESPONDER OBJECTS, BECAUSE RESPONDER IS NOT SET OF VARS< BUT OBJECT CONTAINING ALL VARIABLES INSIDE
			me.dropdown_email_mode,
			me.input_email_again,
			{
				__key:me.input_email_from.__key,
				_value:function(){
					var ux=me.input_email_from._getDate();
					if(!ux){return '';}
					return ux.year+'/'+ux.month+'/'+ux.day;
			}},
			{
				__key:me.input_email_to.__key,
				_value:function(){
					var ux=me.input_email_to._getDate();
					if(!ux){return '';}
					return ux.year+'/'+ux.month+'/'+ux.day;
			}},
			me.toggle_email_respond_to_messages
		//
		];
		
		var toSave=[
			me.input_email_forward,
			me.input_email_alternate,
			me.toggle_email_do_not_forward,
			me.input_email_incoming,
			me.input_email_outgoing,
			me.dropdown_email_reports,
			me.dropdown_email_folder,
			{
				__source:me._responder_source,
				_value:function(){
					var ret={};
					
					ret['CLASSNAME']=[{VALUE:'taccountresponder'}];
					for(var i=0; i<list.length; i++){
						if(list[i].__key){
							ret[list[i].__key]=[{'VALUE':list[i]._value()}];
						}else{
							log.error('e:no-key-defined');
						}
					}
					
					return ret;
				}
			}
		];
		
		/** check changes */
		if(method && method=='changed'){
			var changed = com.user._prepareChanged(toSave);
			var changed2 = com.user._prepareChanged(list);
			log.log(['accountemail-save-changed',changed]);
			if(!changed && !changed2){return false;}
			if(!changed){changed=[];}
			if(!changed2){changed2=[];}
			return changed.concat(changed2);
		}
		/** */
		
		var items = com.user._prepareSet(toSave);
		//log.log(['SAVE',items]);
		
		var account='';
		if(location.parsed_query.account){
			account=location.parsed_query.account;
		}
		
		com.user.setData(account,items,[function(result){
			if(result.Array.IQ[0].QUERY[0].RESULT[0].VALUE==0){
				gui.message.error(getLang("error::save_unsuccessful"));
			}else{
				gui.message.toast(getLang("message::save_successfull"));
				
				// clear all
				com.user._prepareChanged(toSave,true);
				com.user._prepareChanged(list,true);
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