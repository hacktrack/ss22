function obj_accountcard(){};
var _me = obj_accountcard.prototype;
/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function(s){
	var me = this;
	storage.library('wm_user');
	
	this._phoneList=[];
	this._emailList=[];
	
	this._phoneTypes={
		'hometelephonenumber':getLang("vcard::home1"),
		'home2telephonenumber':getLang("vcard::home2"),
		'assistnametelephonenumber':getLang("vcard::assistant"),
		'businesstelephonenumber':getLang("vcard::work1"),
		'business2telephonenumber':getLang("vcard::work2"),
		'homefaxnumber':getLang("vcard::fax_home"),
		'businessfaxnumber':getLang("vcard::fax_work"),
		'callbacktelephonenumber':getLang("vcard::callback"),
		'companymaintelephonenumber':getLang("vcard::company"),
		'cartelephonenumber':getLang("vcard::car"),
		'isdnnumber':getLang("vcard::isdn"),
		'mobiletelephonenumber':getLang("vcard::mobile"),
		'otherfaxnumber':getLang("vcard::other_fax"),
		'pagernumber':getLang("vcard::pager"),
		'primarytelephonenumber':getLang("vcard::primary"),
		'radiotelephonenumber':getLang("vcard::radio"),
		'telexnumber':getLang("vcard::telex"),
		'hearingnumber':getLang("vcard::hearing"),
		'othernumber':getLang("vcard::sip")
	};
	
	this._emailTypes={
		'email1address':getLang('vcard::email1'),
		'email2address':getLang('vcard::email2'),
		'email3address':getLang('vcard::email3'),
		'imaddress':getLang('vcard::imaddress')
	};
	
	gui.frm_main.main._setHeadingButton('generic::save',function(){me._save();},'button text success');
	
	/* observer */
	this._changeObserverID='accountcard';
	gui._changeObserver.assignListener(this._changeObserverID,function(callback,close){
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
	me._draw('obj_accountcard', '', {items:{}});
	
	this.button_add_phone._onclick=function(){
		var type=me.dropdown_phone_type._value();
		me._addPhone(me.input_card_phone._value(),type,function(elm){
			var sutype=type.toUpperCase();
			if(me._card_source.PROPERTYVAL[0][sutype]){
				elm.__key=sutype;
				elm.__source=me._card_source.PROPERTYVAL[0][sutype];
			}else{
				log.error('type "'+type+'" not supported');
			}
		},true);
		me.input_card_phone._value('');
	}
	
	this.button_add_email._onclick=function(){
		me._addEmail(me.input_card_email._value(),me.dropdown_email_type._value(),function(elm){
			var type=me.dropdown_email_type._value();
			var sutype=type.toUpperCase();
			if(type!='')
			{
				if(me._card_source.PROPERTYVAL[0][sutype]){
					log.log(['sutype exists',sutype]);
					elm.__key=sutype;
					elm.__source=me._card_source.PROPERTYVAL[0][sutype];
				}else{
					log.error('type "'+type+'" not supported');
				}
			}
			me.input_card_email._value('');
		},true);
	}
	
	this.dropdown_card_gender._fill({
		'*0':getLang('vcard::unknown'),
		'*2':getLang('vcard::male'),
		'*1':getLang('vcard::female')
	});
	
	this.dropdown_phone_type._fill(this._phoneTypes);
	
	this.dropdown_email_type._fill(this._emailTypes);
	
	var account='';
	if(location.parsed_query.account){
		account=location.parsed_query.account;
	}
	com.user.card(account,function(result){
		var items=[];
		try
		{
			var items=result.Array.IQ[0].QUERY[0].RESULT[0].ITEM[0].PROPERTYVAL[0];
			me._card_source=result.Array.IQ[0].QUERY[0].RESULT[0].ITEM[0];
			
			if(result.Array.IQ[0].QUERY[0].RESULT[0].ITEM[0].PROPERTYRIGHT[0]){
				propright=result.Array.IQ[0].QUERY[0].RESULT[0].ITEM[0].PROPERTYRIGHT[0].VALUE;
			}else{propright=2;}
			
			// debug
			//propright=0;

			
			// phones and emails not done
			me._setRight(propright,[
				'input_card_name',
				'input_card_surname',
				'input_card_birthday',
				'dropdown_card_gender',
				'input_card_anniversary',
				'input_card_company',
				'input_card_department',
				'input_card_job',
				'input_card_manager',
				'input_card_assistant',
				{element:'input_card_website1',wrapper:'fi_card_website'},
				{element:'input_card_website2',wrapper:'fi_card_website'},
				'textarea_card_note',
				'input_card_work_street',
				'input_card_work_city',
				'input_card_work_zip',
				'input_card_work_state_county',
				'input_card_work_country',
				'input_card_home_street',
				'input_card_home_city',
				'input_card_home_zip',
				'input_card_home_state_county',
				'input_card_home_country',
			]);
		}
		catch(e)
		{
			log.error(['e:invalid-data',e]);
			return false;
		}
		
		try
		{
			for(var key in items){
				log.log([key,items[key]]);
				var bval=false;
				var sval='';
				var ival=0;
				if(items[key][0]&&items[key][0].VALUE){
					bval=(items[key][0].VALUE?true:false);
					sval=items[key][0].VALUE;
					ival=parseInt(items[key][0].VALUE);
				}
				
				var lkey=key.toLowerCase();
				
				switch(lkey){
					case 'firstname':
						n='input_card_name';
						me[n].__key=key;
						me[n].__source=items[key];
						me[n]._value(sval);
					break;
					case 'lastname':
						n='input_card_surname';
						me[n].__key=key;
						me[n].__source=items[key];
						me[n]._value(sval);
					break;
					case 'companyname':
						n='input_card_company';
						me[n].__key=key;
						me[n].__source=items[key];
						me[n]._value(sval);
					break;
					case 'department':
						n='input_card_department';
						me[n].__key=key;
						me[n].__source=items[key];
						me[n]._value(sval);
					break;
					case 'jobtitle':
						n='input_card_job';
						me[n].__key=key;
						me[n].__source=items[key];
						me[n]._value(sval);
					break;
					case 'managername':
						n='input_card_manager';
						me[n].__key=key;
						me[n].__source=items[key];
						me[n]._value(sval);
					break;
					case 'assistantname':
						n='input_card_assistant';
						me[n].__key=key;
						me[n].__source=items[key];
						me[n]._value(sval);
					break;
					case 'gender':
						n='dropdown_card_gender';
						me[n].__key=key;
						me[n].__source=items[key];
						me[n]._value(sval);
					break;
					case 'webpage':
						n='input_card_website1';
						me[n].__key=key;
						me[n].__source=items[key];
						me[n]._value(sval);
					break;
					case 'homepage':
						n='input_card_website2';
						me[n].__key=key;
						me[n].__source=items[key];
						me[n]._value(sval);
					break;
					/*
					case 'homepage2':
						n='input_card_website2';
						me[n].__key=key;
						me[n].__source=items[key];
						me[n]._value(sval);
					break;
					*/
					case 'body':
						n='textarea_card_note';
						me[n].__key=key;
						me[n].__source=items[key];
						me[n]._value(sval);
					break;
					case 'businessaddressstreet':
						n='input_card_work_street';
						me[n].__key=key;
						me[n].__source=items[key];
						me[n]._value(sval);
					break;
					case 'businessaddresscity':
						n='input_card_work_city';
						me[n].__key=key;
						me[n].__source=items[key];
						me[n]._value(sval);
					break;
					case 'businessaddresspostalcode':
						n='input_card_work_zip';
						me[n].__key=key;
						me[n].__source=items[key];
						me[n]._value(sval);
					break;
					case 'businessaddressstate':
						n='input_card_work_state_county';
						me[n].__key=key;
						me[n].__source=items[key];
						me[n]._value(sval);
					break;
					case 'businessaddresscountry':
						n='input_card_work_country';
						me[n].__key=key;
						me[n].__source=items[key];
						me[n]._value(sval);
					break;
					case 'homeaddressstreet':
						n='input_card_home_street';
						me[n].__key=key;
						me[n].__source=items[key];
						me[n]._value(sval);
					break;
					case 'homeaddresscity':
						n='input_card_home_city';
						me[n].__key=key;
						me[n].__source=items[key];
						me[n]._value(sval);
					break;
					case 'homeaddresspostalcode':
						n='input_card_home_zip';
						me[n].__key=key;
						me[n].__source=items[key];
						me[n]._value(sval);
					break;
					case 'birthday':
						n='input_card_birthday';
						me[n].__key=key;
						me[n].__source=items[key];
						if(sval)
							me[n]._setUTC(sval);
					break;
					case 'anniversary':
						n='input_card_anniversary';
						me[n].__key=key;
						me[n].__source=items[key];
						if(sval)
							me[n]._setUTC(sval);
					break;
					case 'homeaddressstate':
						n='input_card_home_state_county';
						me[n].__key=key;
						me[n].__source=items[key];
						me[n]._value(sval);
					break;
					case 'homeaddresscountry':
						n='input_card_home_country';
						me[n].__key=key;
						me[n].__source=items[key];
						me[n]._value(sval);
					break;
					default:
						if(helper.trim(sval)!='' && me._phoneTypes[lkey]){
							me._addPhone(sval,lkey,function(elm){
								elm.__key=key;
								elm.__source=items[key];
							});
						}else if(helper.trim(sval)!='' && me._emailTypes[lkey]){
							me._addEmail(sval,lkey,function(elm){
								elm.__key=key;
								elm.__source=items[key];
							});
						}
					break;
				}
			}
		}
		catch(e)
		{
			log.error(['e:invalid-data',e]);
		}
	});

	
	me._main.onclick=function(e){
		
	};
}

_me._refreshPhonesDropdown=function(donotempty){
	var me=this;
	
	if(!this.dropdown_phone_type._used){
		this.dropdown_phone_type._used=[];
	}
	var allowed={};
	var used=this.dropdown_phone_type._used;
	
	var i=0;
	for(var key in this._phoneTypes){
		if(used.indexOf(key)<0){
			i++;
			allowed[key]=this._phoneTypes[key];
		}
	}
	
	if(i==0){
		this._getAnchor('phones_select').setAttribute('is-hidden',1);
		this.button_add_phone._hide();
	}else{
		this._getAnchor('phones_select').removeAttribute('is-hidden');
		this.button_add_phone._show();
	}
	
	this.dropdown_phone_type._fill(allowed);
	
	if(i==1 && !donotempty){
		var type=me.dropdown_phone_type._value();
		this._addPhone('',this.dropdown_phone_type._value(),function(elm){
			var sutype=type.toUpperCase();
			if(me._card_source.PROPERTYVAL[0][sutype]){
				elm.__key=sutype;
				elm.__source=me._card_source.PROPERTYVAL[0][sutype];
			}else{
				log.error('type "'+type+'" not supported');
			}
		});
	}
}

_me._removeEmptyPhones=function(){
	if(!this._phoneList){this._phoneList=[];}
	try
	{
		var l=this._phoneList.length;
		for(var i=l-1; i>=0; i--){
			if(helper.trim(this._phoneList[i].object._value())==''){
				this._removePhone(this._phoneList[i]);
			}
		}
		this._refreshPhonesDropdown();
	}
	catch(e)
	{
		log.error(e);
	}
}

_me._removePhone=function(phone){
	if(!this._phoneList){this._phoneList=[];}
	
	for(var i=0; i<this._phoneList.length; i++){
		if(this._phoneList[i]==phone){
			this._phoneList.splice(i,1);
		}
	}
	
	for(var i=0; i<this.dropdown_phone_type._used.length; i++){
		if(this.dropdown_phone_type._used[i]==phone.type){
			this.dropdown_phone_type._used.splice(i,1);
		}
	}
	
	phone.object._destruct();
	phone.box.parentElement.removeChild(phone.box);
	this._refreshPhonesDropdown(true);
}

_me._addPhone=function(value,type,callback,donotclear){
	if(!this._phonesNum){this._phonesNum=0;}
	if(!this._phoneList){this._phoneList=[];}
	if(!this.dropdown_phone_type._used){
		this.dropdown_phone_type._used=[];
	}
	
	var phoneName = 'phone_'+type;
	var phone=this._pathName+'#'+phoneName;
	
	if(!this[phoneName])
	{
		log.log(['accountcard-phonename',phoneName]);
		
		var elm = mkElement('div',{id:phone});
			addcss(elm,'form-row');
		
		this._getAnchor('phones_values').appendChild(elm);
		
		this._create(phoneName,'obj_input_text',phoneName);
		this.dropdown_phone_type._used.push(type);
		this[phoneName]._label(this._phoneTypes[type],true);
		this[phoneName]._placeholder(this.input_card_phone._placeholder(),true);
		
		this._phoneList.push({name:phoneName,object:this[phoneName],box:elm,type:type});
		this._phonesNum++;
		
		
		if(callback){
			callback(this[phoneName]);
		}
		
		this._refreshPhonesDropdown();
	}
	
	if(value){this[phoneName]._value(value,donotclear);}
}

_me._refreshEmailsDropdown=function(donotempty){
	var me=this;
	
	if(!this.dropdown_email_type._used){
		this.dropdown_email_type._used=[];
	}
	var allowed={};
	var used=this.dropdown_email_type._used;
	
	var i=0;
	for(var key in this._emailTypes){
		if(used.indexOf(key)<0){
			i++;
			allowed[key]=this._emailTypes[key];
		}
	}
	
	if(i==0){
		this._getAnchor('emails_select').setAttribute('is-hidden',1);
		this.button_add_email._hide();
	}else{
		this._getAnchor('emails_select').removeAttribute('is-hidden');
		this.button_add_email._show();
	}
	
	this.dropdown_email_type._fill(allowed);
	
	if(i==1 && !donotempty){
		var type=me.dropdown_email_type._value();
		this._addEmail('',this.dropdown_email_type._value(),function(elm){
			var sutype=type.toUpperCase();
			if(me._card_source.PROPERTYVAL[0][sutype]){
				log.log(['sutype exists',sutype]);
				elm.__key=sutype;
				elm.__source=me._card_source.PROPERTYVAL[0][sutype];
			}else{
				log.error('type "'+type+'" not supported');
			}
		});
	}
}

_me._removeEmptyEmails=function(){
	if(!this._emailList){this._emailList=[];}
	try
	{
		var l=this._emailList.length;
		for(var i=l-1; i>=0; i--){
			log.log(i);
			if(helper.trim(this._emailList[i].object._value())==''){
				this._removeEmail(this._emailList[i]);
			}
		}
		this._refreshEmailsDropdown();
	}
	catch(e)
	{
		log.error(e);
	}
}

_me._removeEmail=function(email){
	if(!this._emailList){this._emailList=[];}
	
	for(var i=0; i<this._emailList.length; i++){
		if(this._emailList[i]==email){
			this._emailList.splice(i,1);
		}
	}
	
	for(var i=0; i<this.dropdown_email_type._used.length; i++){
		if(this.dropdown_email_type._used[i]==email.type){
			this.dropdown_email_type._used.splice(i,1);
		}
	}
	
	email.object._destruct();
	email.box.parentElement.removeChild(email.box);
	
	this._refreshEmailsDropdown(true);
}

_me._addEmail=function(value,type,callback,donotclear){
	
	try
	{
		if(!this._emailsNum){this._emailsNum=0;}
		if(!this._emailList){this._emailList=[];}
		if(!this.dropdown_email_type._used){
			this.dropdown_email_type._used=[];
		}
		
		var emailName = 'email_'+type;
		var email=this._pathName+'#'+emailName;
		
		if(!this[emailName])
		{
			var elm = mkElement('div',{id:email});
				addcss(elm,'form-row');
			this._getAnchor('emails_values').appendChild(elm);
			this._create(emailName,'obj_input_text',emailName);
			this.dropdown_email_type._used.push(type);
			this[emailName]._placeholder(this.input_card_email._placeholder(),true);
			this[emailName]._label(this._emailTypes[type],true);
			
			this._emailList.push({name:emailName,object:this[emailName],box:elm,type:type});
			this._emailsNum++;
			
			if(callback){
				callback(this[emailName]);
			}
			
			this._refreshEmailsDropdown();
		}
		
		if(value){this[emailName]._value(value,donotclear);}
	}
	catch(e)
	{
		log.error(e);
	}
}

_me._save=function(method,callback){
	var me=this;
	
	if(helper.trim(this.input_card_phone._value())!=''){
		this.button_add_phone._onclick();
	}
	if(helper.trim(this.input_card_email._value())!=''){
		this.button_add_email._onclick();
	}
	
	try
	{
		
		var list=[
			me.input_card_name,
			me.input_card_surname,
			me.input_card_company,
			me.input_card_department,
			me.input_card_job,
			me.dropdown_card_gender,
			me.input_card_manager,
			me.input_card_assistant,
			me.input_card_website1,
			me.input_card_website2,
			me.textarea_card_note,
			{
				__key:me.input_card_birthday.__key,
				__source:me.input_card_birthday.__source,
				_value:function(){
					return me.input_card_birthday._getUTC();
				},
				_changed:function(x){return me.input_card_birthday._changed(x);}
			},
			{
				__key:me.input_card_anniversary.__key,
				__source:me.input_card_anniversary.__source,
				_value:function(){
					return me.input_card_anniversary._getUTC();
				},
				_changed:function(x){return me.input_card_anniversary._changed(x);}
			},
			me.input_card_work_street,
			me.input_card_work_state_county,
			me.input_card_work_country,
			me.input_card_work_city,
			me.input_card_work_zip,
			me.input_card_home_street,
			me.input_card_home_state_county,
			me.input_card_home_country,
			me.input_card_home_city,
			me.input_card_home_zip
		//
		];
		
		// add phones
		for(var key in me._phoneList){
			list.push(me._phoneList[key].object);
		}
		//
		
		// add emails
		for(var key in me._emailList){
			list.push(me._emailList[key].object);
		}
		//
		
		var toSave=[
			{
				__source:me._card_source,
				_value:function(){
					var ret={};
					
					for(var i=0; i<list.length; i++){
						if(list[i]){
							if(list[i].__key){
								ret[list[i].__key]=[{'VALUE':list[i]._value()}];
							}else{
								log.error(['e:no-key-defined',list[i]]);
							}
						}
						else{
							log.error(['e:item-not-found',{message:'m:item-number: '+i}]);
						}
					}
					
					return ret;
				}
			}
		];
		
		/** check changes */
		if(method && method=='changed'){
			var changed = com.user._prepareChanged(list);
			log.log(['accountcard-save-changed',changed]);
			return changed;
		}
		/** */
		
		var items = com.user._prepareSet(toSave);
		log.log(['SAVE',items]);
		
		var account='';
		if(location.parsed_query.account){
			account=location.parsed_query.account;
		}
		
		com.user.setData(account,items,[function(aResponse){
			try
			{
				if(aResponse.Array.IQ[0].QUERY[0].RESULT[0].VALUE==0){
					gui.message.error(getLang("error::save_unsuccessful"));
				}else{
					me._removeEmptyPhones();
					me._removeEmptyEmails();
					gui.message.toast(getLang("message::save_successfull"));
					
					// clear all
					com.user._prepareChanged(list,true);
					// call callback for save and continue
					if(callback){callback();}
				}
			}
			catch(e)
			{
				log.error(e);
			}
		}]);
		
	}
	catch(e)
	{
		log.error(e);
	}
}