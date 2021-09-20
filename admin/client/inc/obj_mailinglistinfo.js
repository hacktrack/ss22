function obj_mailinglistinfo(){};
var _me = obj_mailinglistinfo.prototype;
/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function(s){
	var me = this;
	storage.library('wm_user');
	storage.library('obj_accountpicker');
	this._headingButton=gui.frm_main.main._setHeadingButton('generic::save',function(){me._save();},'button text success');
	this._headingButton._disabled(true);
	
	this._accountDomain=location.parsed_query.account.split('@');
	this._accountDomain=this._accountDomain[this._accountDomain.length-1];
	
	this._selfHash="#menu=accountdetail&account=/ACCOUNT/&type=/TYPE/";
	
	/* observer */
	this._changeObserverID='mailinglistinfo';
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

_me._load = function(domain)
{
	var me=this;
	
	gui.frm_main.main._setHeading(punycode.ToUnicode(location.parsed_query.account));
	
	me._draw('obj_mailinglistinfo', '', {items:{}});
	
	this.dropdown_source._readonly(true);
	this.input_password._disabled(true);
	this.dropdown_password_protection._onchange=function(){
		if(this._value()==0){
			me.toggle_forward_copy_to_owner._disabled(false);
			me.input_password._disabled(true);
		}else{
			me.toggle_forward_copy_to_owner._disabled(true);
			me.input_password._disabled(false);
		}
	}
	
	this.input_password._onfocus=function(){
		this._setType('text');
		this._selectValue();
	};
	this.input_password._onblur=function(){
		this._setType('password');
	};
	
	/** fill dropdowns */   
	this.dropdown_password_protection._fill({
		'*0':getLang('mailinglist::not_password_protected'),
		'*2':getLang('mailinglist::server_moderated'),
		'*1':getLang('mailinglist::client_moderated')
	});
	 
	this.dropdown_default_rights._fill({
		'*0':getLang('mailinglist::recieve_and_post'),
		'*7':getLang('mailinglist::digest_recieve_and_post'),
		'*1':getLang('mailinglist::recieve_only'),
		'*5':getLang('mailinglist::digest_recieve_only'),
		'*2':getLang('mailinglist::post_only')		
	});
	 
	this.dropdown_source._fill({
		'*0':getLang('mailinglist::members_defined_manually'),
		'*5':getLang('mailinglist::members_from_database'),
		'*1':getLang('mailinglist::all_current_domain_users'),
		'*2':getLang('mailinglist::all_system_users'),
		'*3':getLang('mailinglist::all_system_domain_administrators'),
		'*4':getLang('mailinglist::all_system_administrators')
	});
	
	this.btn_owner._onclick=function(){
		gui.accountpicker(function(items,type){
			
			var val=helper.trim(me.input_owner._value(),';');
			for(var i=0; i<items.length; i++){
				if(type==0){
					val+=';['+items[i].id+']';
				}else{
					val+=';'+items[i].id;
				}
			}
			me.input_owner._value(helper.trim(val,';'));
		
		},{
			disable_add_domain:true
		});
	}
	
	me.button_add_alias._onclick=function(e){
		me._addAlias();
		
		e.stopPropagation();
		e.cancelBubble=true;
		return false;
	}
	
	this._getAnchor('aliases')._changed=function(clear){
		if(me._aliasList){
			var ret=false;
			for(var i=0; i<me._aliasList.length; i++){
				if(me._aliasList[i].object._changed(clear)){
					ret=true;
				}
			}
		}
		return ret;
	}
	// aliases value method
	this._getAnchor('aliases')._getMainAlias=function(asemail){
		var alias=me.alias_0._value();
		if(asemail){
			return alias+"@"+me._accountDomain;
		}
		return alias;
	}
	// aliases value method
	this._getAnchor('aliases')._value=function(itemlist){
		if(itemlist)
		{
			for(var i=0; i<itemlist.length; i++){
				log.log(itemlist[i]);
				me._addAlias(itemlist[i]);
			}
		}
		else
		{
			try
			{
				// remove empty alias
				if(me._aliasList){
					for(var i=me._aliasList.length-1; i>0; i--){
						if(helper.trim(me._aliasList[i].object._value())==''){
							me.removeAlias(me._aliasList[i]);
						}
					}
				}
				//
				var ret=[];
				if(me._aliasList){
					for(var i=0; i<me._aliasList.length; i++){
						ret.push({VALUE:me._aliasList[i].object._value()});
					}
				}
				return {VAL:[{ITEM:ret}]};
			}
			catch(e)
			{
				log.error(e);
			}
		}
	};
	
	com.user.mailingListInfo(location.parsed_query.account,function(aResults){
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
					ival = parseInt(propval.VAL[0].VALUE);
				}
				
				try
				{
					log.log([propname.toLowerCase(),propval.VAL]);
					switch(propname.toLowerCase())
					{
						case 'u_name':
							n='input_description';
								me[n].__source=items[i];
								me[n]._value(sval);
						break;
						
						case 'm_owneraddress':
							n='input_owner';
								me[n].__source=items[i];
								me[n]._value(sval);
						break;
						
						case 'a_aliaslist':
						
							var list=[];
							if(propval.VAL && propval.VAL[0] && propval.VAL[0].ITEM && propval.VAL[0].ITEM[0]){
								var aliases=propval.VAL[0].ITEM;
								var list=[];
								for(var ii=0; ii<aliases.length; ii++){
									list.push(aliases[ii].VALUE);
								}
								propval.VAL[0].ITEM=[];	// remove items from source
							}
							log.log(propval.VAL[0].ITEM[0]);
							me._getAnchor('aliases').__source=items[i];
							me._getAnchor('aliases')._value(list);
						break;
						
						case 'm_listbatch':
							n='input_max_number_of_messages';
								me[n].__source=items[i];
								me[n]._value(sval);
						break;
						
						case 'm_sendalllists':
							n='dropdown_source';
								me[n].__source=items[i];
								me[n]._value(sval);
						break;
						
						case 'm_defaultrights':
							n='dropdown_default_rights';
								me[n].__source=items[i];
								me[n]._value(sval);
						break;
						
						case 'm_moderated':
							n='dropdown_password_protection';
								me[n].__source=items[i];
								me[n]._value(sval);
						break;	
						
						case 'm_sendtosender':
							n='toggle_send_to_sender';
								me[n].__source=items[i];
								me[n]._checked(bval);
						break;
						
						case 'm_copytoowner':
							n='toggle_forward_copy_to_owner';
								me[n].__source=items[i];
								me[n]._checked(bval);
						break;
						
						case 'm_membersonly':
							n='toggle_only_members_can_post';
								me[n].__source=items[i];
								me[n]._checked(bval);
						break;
						
						case 'm_checkmailbox':
							n='toggle_do_not_deliver';
								me[n].__source=items[i];
								me[n]._checked(bval);
						break;
						
						case 'm_removedead':
							n='toggle_remove_failed_email_addresses';
								me[n].__source=items[i];
								me[n]._checked(bval);
						break;
						case 'm_moderatedpassword':
							n='input_password';
								me[n].__source=items[i];
								me[n]._value(sval);
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
		
		// enable save button
		me._headingButton._disabled(false);
		
	});
}

_me.removeAlias=function(alias){
	if(this._aliasList){
		if(this._aliasList.length>1){
			log.log("remove");
			alias.object._destruct();
			alias.box.parentElement.removeChild(alias.box);
			for(var i=0; i<this._aliasList.length; i++){
				if(this._aliasList[i]==alias){
					this._aliasList.splice(i,1);
				}
			}
		}else{
			alias.object._value('');
		}
	}
}

_me._addAlias=function(value){
	if(!this._aliasNum){this._aliasNum=0;}
	if(!this._aliasList){this._aliasList=[];}
	
	var aliasName = 'alias_'+this._aliasNum;
	var alias=this._pathName+'#'+aliasName;
	
	var elm = mkElement('div',{id:alias});
		addcss(elm,'form-row');
	
	this._getAnchor('aliases').appendChild(elm);
	
	this._create(aliasName,'obj_input_text',aliasName);
	this[aliasName]._placeholder('accountdetail::add_alias');
	this[aliasName]._label("@"+punycode.ToUnicode(this._accountDomain),true);
	if(value){this[aliasName]._value(value);}
	
	this._aliasList.push({name:aliasName,object:this[aliasName],box:elm});
	this._aliasNum++;
}

_me._save=function(method,callback){
	var me=this;
	try
	{
		var toSave=[
			me.input_owner,
			me.input_description,
			me._getAnchor('aliases'),
			me.toggle_only_members_can_post,
			me.dropdown_password_protection,
			me.dropdown_default_rights,
			me.input_max_number_of_messages,
			me.toggle_send_to_sender,
			me.toggle_forward_copy_to_owner,
			me.toggle_remove_failed_email_addresses,
			me.toggle_do_not_deliver,
			me.input_password
		];
		
		/** check changes */
		if(method && method=='changed'){
			var changed = com.user._prepareChanged(toSave);
			log.log(['mailinglistinfo-save-changed',changed]);
			return changed;
		}
		/** */
		
		var items = com.user._prepareSet(toSave);
		
		var account='';
		if(location.parsed_query.account){
			account=location.parsed_query.account;
		}
		
		com.user.setData(account,items,[function(result){
			if(result.Array.IQ[0].QUERY[0].RESULT[0].VALUE==0){
				gui.message.error(getLang("error::save_unsuccessful"));
			}else{
				gui.message.toast(getLang("message::save_successfull"));
				// redirect
				var account=me._getAnchor('aliases')._getMainAlias(true);
				location.hash=helper.translateHash(me._selfHash.replace('/ACCOUNT/',encodeURIComponent(account)),location.parsed_query);
				
				// clear all
				com.user._prepareChanged(toSave,true);
				// call callback for save and continue (postpone it to enable refresh)
				if(callback){
					setTimeout(function(){callback();},500);
				}
			}
		}]);
	}
	catch(e)
	{
		log.error(e);
	}
}
