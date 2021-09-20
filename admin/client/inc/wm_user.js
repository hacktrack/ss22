function wm_user()
{
	this.xmlns='rpc';
}

wm_user.inherit(wm_generic);
var _me = wm_user.prototype;

_me.getAPI=function(perPage,page,mask,cb,clear,account){
	com.console.getAPI(perPage,page,mask,cb,clear,'account',account);
}

_me.rulesInfoList=function(domain,itemsPerPage,page,aHandler,eHandler){
	var aRequest = {
		commandname:[{VALUE:'getrulesinfolist'}],
		commandparams:[{
			who:[{VALUE:domain}],
			offset:[{VALUE:(itemsPerPage*page)}],
			count:[{VALUE:(itemsPerPage)}]
		}]
	};
	
	if(!aHandler[0]){aHandler=[aHandler];}
	
	var h=[function(data){
		var processed=[];
		var max=0;
		try
		{
			if(data.Array.IQ[0].QUERY[0].RESULT[0].OVERALLCOUNT && data.Array.IQ[0].QUERY[0].RESULT[0].OVERALLCOUNT[0].VALUE){
				max=parseInt(data.Array.IQ[0].QUERY[0].RESULT[0].OVERALLCOUNT[0].VALUE);
			}
			var items=data.Array.IQ[0].QUERY[0].RESULT[0].ITEM;
			if(items){
				for(var i=0; i<items.length; i++){
					processed.push({
						action:parseInt(items[i].ACTIONTYPE[0].VALUE),
						active:(items[i].ACTIVE[0].VALUE=='1'?true:false),
						condition:items[i].CONDITION[0],
						id:parseInt(items[i].RULEID[0].VALUE),
						title:items[i].TITLE[0].VALUE
					});
				}
			}
		}
		catch(e)
		{
			log.error([e,data]);
		}
		aHandler[0]({items:processed,overallcount:max});
	}];
	
	h=[this.__attachErrorHandler(h[0],eHandler)];
	
	this.create_iq(aRequest,[this,'__response',[h]]);
	return true;
}

_me.list = function(domain,itemsPerPage,page,namemask,typemask,aHandler,eHandler)
{
	aHandler=[this.__attachErrorHandler(aHandler[0],eHandler)];
	
	log.log(['wmuser-list','#1']);
	var masks={
		namemask:[{VALUE:'*'}]
	};
	log.log(['wmuser-list','#2']);
	if(namemask){
		masks.namemask[0].VALUE=namemask;
	}
	log.log(['wmuser-list','#3']);
	if(typemask){
		masks.typemask=[{VALUE:typemask}];
	}
	log.log(['wmuser-list','#4']);
	
	var aRequest = {
		commandname:[{VALUE:'getaccountsinfolist'}],
		commandparams:[{
			domainstr:[{VALUE:domain}],
			filter:[masks],
			offset:[{VALUE:(itemsPerPage*page)}],
			count:[{VALUE:(itemsPerPage)}]
		}]
	};
	
	log.log(['wmuser-list','#5']);

	
	this.create_iq(aRequest,[this,'__response',[aHandler]]);
	
	log.log(['wmuser-list','#6']);
	
	return true;
}

_me.setData = function(account,items,aHandler)
{
	var aRequest = {
		commandname:[{VALUE:'setaccountproperties'}],
		commandparams:[{
			accountemail:[{VALUE:account}],
			propertyvaluelist:[{
				item:items
			}],
		}]
	};

	log.log(items);

	if(!aHandler[0]){aHandler=[aHandler];}
	
	this.create_iq(aRequest,[this,'__response',[aHandler]]);
	return true;
}

_me.folderList=function(account,onlydefault,aHandler){
	var params={
		accountemail:[{VALUE:account}],
		onlydefault:[{VALUE:0}]
	};
	
	if(onlydefault){
		params.onlydefault=[{VALUE:1}];
	}
	
	var aRequest = {
		commandname:[{VALUE:'getaccountfolderlist'}],
		commandparams:[params]
	};
	
	if(!aHandler[0]){aHandler=[aHandler];}
	
	this.create_iq(aRequest,[this,'__response',[aHandler]]);
	return true;
}

_me.setResponderMessage=function(account,from,subject,text,aHandler){
	var aRequest = {
		commandname:[{VALUE:'setaccountproperties'}],
		commandparams:[{
			accountemail:[{VALUE:account}],
			propertyvaluelist:[{
				item:[{
					apiproperty:[{
						propname:[{VALUE:'a_respondermessage'}]
					}],
					propertyval:[{
						classname:[{VALUE:'taccountrespondermessage'}],
						from:[{VALUE:from}],
						subject:[{VALUE:subject}],
						text:[{VALUE:text}]
					}]
				}]
			}]
		}]
	};
	
	if(!aHandler[0]){aHandler=[aHandler];}
	this.create_iq(aRequest,[this,'__response',[aHandler]]);
	
	return true;
}

_me.getResponderMessage=function(account,aHandler){
	com.console.item(aHandler).account('a_respondermessage',account);
}

_me.getFolderPermissions=function(account,folder,aHandler){
	var aRequest = {
		commandname:[{VALUE:'getaccountfolderpermissions'}],
		commandparams:[{
			accountemail:[{VALUE:account}],
			folderid:[{VALUE:folder}]
		}]
	};
	
	if(!aHandler[0]){aHandler=[aHandler];}
	
	this.create_iq(aRequest,[this,'__response',[aHandler]]);
	return true;
}

_me.setFolderPermissions=function(account,folder,items,aHandler){
	var aRequest = {
		commandname:[{VALUE:'setaccountfolderpermissions'}],
		commandparams:[{
			accountemail:[{VALUE:account}],
			folderid:[{VALUE:folder}],
			permissions:[{item:items}]
		}]
	};
	
	if(!aHandler[0]){aHandler=[aHandler];}
	
	this.create_iq(aRequest,[this,'__response',[aHandler]]);
	return true;
}

_me.inheritFolderPermissions=function(account,folder,aHandler){
	var aRequest = {
		commandname:[{VALUE:'inheritaccountfolderpermissions'}],
		commandparams:[{
			accountemail:[{VALUE:account}],
			folderid:[{VALUE:folder}]
		}]
	};
	
	if(!aHandler[0]){aHandler=[aHandler];}
	
	this.create_iq(aRequest,[this,'__response',[aHandler]]);
	return true;
}

_me.mailingListInfo = function(account,aHandler)
{
	com.console.combi(aHandler).account('1',[
		'u_name',
		'u_alias',
		'A_AliasList',
		'm_owneraddress',
		'm_sendalllists',
		'm_defaultrights',
		'm_listbatch',
		'm_sendtosender',
		'm_copytoowner',
		'm_listsubject',
		'm_personalized',
		'm_removedead',
		'm_moderated',
		'm_checkmailbox',
		'm_membersonly',
		'm_moderatedpassword'
	],account);
	return true;
}

_me.groupInfo = function(account,aHandler)
{
	com.console.combi(aHandler).account('1',[
		'g_groupwarehabfolder',
		'g_name',
		'g_description',
		'u_alias',
		'A_AliasList',
		'g_groupwaremaildelivery',
		'g_listbatch',
		'g_checkmailbox',
		'g_groupwareallowgalexport',
		'g_groupwarecreateteamchat',
		'g_groupwarehab',
		'g_groupwaremembers',
		'a_passwordprotection',
		'm_membersonly',
		'g_groupwareshared',
		'm_moderatedpassword'
	],account);
	return true;
}

_me.info = function(account,aHandler,eHandler)
{
	com.console.combi(aHandler,eHandler).account('1',['u_name','u_comment','u_description','u_spamadmin'],account);
	return true;
}

_me.resource = function(account,aHandler,eHandler)
{
	com.console.combi(aHandler,eHandler).account('1',['u_name','s_unavailable','s_allowconflicts','s_notificationtomanager','s_manager','u_alias','s_type'],account);
	return true;
}

_me.responder = function(account,aHandler,eHandler)
{
	com.console.item(aHandler,eHandler).account('a_responder',account);
	return true;
}

_me.forwarder = function(account,aHandler,eHandler)
{
	com.console.combi(aHandler,eHandler).account(3,['u_donotforwardspam'],account);
	return true;
}

_me.rules = function(account,aHandler,eHandler)
{
	aHandler=this.__attachErrorHandler(aHandler,eHandler);
	
	var aRequest = {
		commandname:[{VALUE:'getaccountrules'}],
		commandparams:[{
			accountemail:[{VALUE:account}],
			accountpropertylist:[{
				item:[{
					propname:[{VALUE:'u_name'}]
				}]
			}],
		}]
	};

	
	this.create_iq(aRequest,[this,'__response',[aHandler]]);
	return true;
}

_me.licenses = function(account,aHandler)
{
	var aRequest = {
		commandname:[{VALUE:'getaccountlicenses'}],
		commandparams:[{
			accountemail:[{VALUE:account}],
			accountpropertylist:[{
				item:[{
					propname:[{VALUE:'u_name'}]
				}]
			}],
		}]
	};

	
	this.create_iq(aRequest,[this,'__response',[aHandler]]);
	return true;
}

_me.mobile_devices = function(account,aHandler)
{
	var aRequest = {
		commandname:[{VALUE:'getaccountmobiledevices'}],
		commandparams:[{
			accountemail:[{VALUE:account}],
			accountpropertylist:[{
				item:[{
					propname:[{VALUE:'u_name'}]
				}]
			}],
		}]
	};

	
	this.create_iq(aRequest,[this,'__response',[aHandler]]);
	return true;
}

_me.password_policy = function(aHandler)
{
	com.console.item(aHandler).server([
		'C_Accounts_Policies_Pass_Enable',
		'C_Accounts_Policies_Pass_MinLength',
		'C_Accounts_Policies_Pass_Digits',
		'C_Accounts_Policies_Pass_NonAlphaNum',
		'C_Accounts_Policies_Pass_UserAlias',
		'C_Accounts_Policies_Pass_Alpha',
		'C_Accounts_Policies_Pass_UpperAlpha',
		'C_Accounts_Policies_Pass_Expiration'
	]);
	return true;
}

_me.change_password=function(account,pwd,ignorePasswordPolicy,cb){
	var cb=cb;
	var aRequest = {
		commandname:[{VALUE:'setaccountpassword'}],
		commandparams:[{
			accountemail:[{VALUE:account}],
			ignorepolicy:[{VALUE:(ignorePasswordPolicy?'1':'0')}],
			password:[{VALUE:pwd}]
		}]
	};
	
	this.create_iq(aRequest,[this,'__response',[[function(aResponse){
		//log.info(['change',aResponse]);
		try
		{
			cb(aResponse);
		}
		catch(e)
		{
			log.error(e);
		}
	}]]]);
	return true;
}

_me.change_user_password = function(account, pwd, old_pwd, cb) {
	var aRequest = {
		commandname: [{VALUE:'changepassword'}],
		commandparams: [{
			email: [{VALUE: account}],
			oldpassword: [{VALUE: old_pwd}],
			newpassword: [{VALUE: pwd}]
		}]
	};
	
	this.create_iq(aRequest, [this, '__response',[[function(aResponse) {
		try {
			cb(aResponse);
		} catch(e) {
			log.error(e);
		}
	}]]]);
	return true;
}

_me.expire_password=function(account,cb){
	var cb=cb;
	var aRequest = {
		commandname:[{VALUE:'expireaccountpassword'}],
		commandparams:[{
			accountemail:[{VALUE:account}],
		}]
	};
	
	this.create_iq(aRequest,[this,'__response',[[function(aResponse){
		//log.info(['expire',aResponse]);
		try
		{
			var res=aResponse.Array.IQ[0].QUERY[0].RESULT[0].VALUE;
			cb(parseInt(res));
		}
		catch(e)
		{
			log.error(e);
		}
	}]]]);
	return true;
}

// Desktop and Outlook
_me.generate_license=function(account,data,aHandler){
	this.manage_license(account,'GenerateAccountActivationKey',data,aHandler);
}
_me.send_license=function(account,data,aHandler){
	this.manage_license(account,'SendAccountActivationKey',data,aHandler);
}
_me.manage_license=function(account,type,data,aHandler){
	var details = data['A_ActivationKeyOutlook'] || data['A_ActivationKeyDesktop'];
	var request = this.createCommand(type,{
		accountemail: account,
		keytype: details.keytype.value,
		description: details.description.value,
		count: details.count.value
	});
	this.setValues(request,aHandler);
}

_me.features=function(account,cb){
	var cb=cb;	
	com.console.item(function(result){
		log.log(result);
		var ret={};
				
		try
		{
			var items=result.Array.IQ[0].QUERY[0].RESULT[0].ITEM;
		}
		catch(e)
		{
			log.error(['e:invalid-data',e]);
			return false;
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
				
				try
				{
					log.log(propname.toLowerCase());

					switch(propname.toLowerCase())
					{
						case 'u_smtp':
							n='smtp';
							if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
							ret[n].value=parseInt(propval.VAL[0].VALUE);
						break;
						case 'u_pop3imap':
							n='pop3imap';
							if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
							ret[n].value=parseInt(propval.VAL[0].VALUE);
						break;
						case 'u_webmail':
							n='webmail';
							if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
							ret[n].value=parseInt(propval.VAL[0].VALUE);
						break;
						case 'u_avscan':
							n='avscan';
							if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
							ret[n].value=parseInt(propval.VAL[0].VALUE);
						break;
						case 'u_aveditable':
							n='avscan';
							if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
							ret[n].editable=(parseInt(propval.VAL[0].VALUE)==0?false:true);
						break;
						case 'u_as':
							n='as';
							if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
							ret[n].value=parseInt(propval.VAL[0].VALUE);
						break;
						case 'u_aseditable':
							n='as';
							if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
							ret[n].editable=(parseInt(propval.VAL[0].VALUE)==0?false:true);
						break;
						case 'u_quarantine':
							n='quarantine';
							if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
							ret[n].value=parseInt(propval.VAL[0].VALUE);
						break;
						case 'u_quarantineeditable':
							n='quarantine';
							if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
							ret[n].editable=(parseInt(propval.VAL[0].VALUE)==0?false:true);
						break;
						case 'u_im':
							n='im';
							if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
							ret[n].value=parseInt(propval.VAL[0].VALUE);
						break;
						case 'u_imeditable':
							n='im';
							if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
							ret[n].editable=(parseInt(propval.VAL[0].VALUE)==0?false:true);
						break;
						case 'u_teamchat':
							n='teamchat';
							if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
							ret[n].value=parseInt(propval.VAL[0].VALUE);
						break;
						case 'u_teamchateditable':
							n='teamchat';
							if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
							ret[n].editable=(parseInt(propval.VAL[0].VALUE)==0?false:true);
						break;
						case 'u_teamchatsupport':
							n='teamchat';
							if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
							ret[n].support=(parseInt(propval.VAL[0].VALUE)==0?false:true);
						break;
						case 'u_webdocuments':
							n='webdocuments';
							if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
							ret[n].value=parseInt(propval.VAL[0].VALUE);
						break;
						case 'u_webdocumentseditable':
							n='webdocuments';
							if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
							ret[n].editable=(parseInt(propval.VAL[0].VALUE)==0?false:true);
						break;
						case 'u_webdocumentssupport':
							n='webdocuments';
							if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
							ret[n].support=(parseInt(propval.VAL[0].VALUE)==0?false:true);
						break;
						case 'u_gw':
							n='gw';
							if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
							ret[n].value=parseInt(propval.VAL[0].VALUE);
						break;
						case 'u_gweditable':
							n='gw';
							if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
							ret[n].editable=(parseInt(propval.VAL[0].VALUE)==0?false:true);
						break;
						case 'u_sip':
							n='sip';
							if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
							ret[n].value=parseInt(propval.VAL[0].VALUE);
						break;
						case 'u_sipeditable':
							n='sip';
							if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
							ret[n].editable=(parseInt(propval.VAL[0].VALUE)==0?false:true);
						break;
						// case 'u_syncml':
						// 	n='syncml';
						// 	if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
						// 	ret[n].value=parseInt(propval.VAL[0].VALUE);
						// break;
						// case 'u_syncmleditable':
						// 	n='syncml';
						// 	if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
						// 	ret[n].editable=(parseInt(propval.VAL[0].VALUE)==0?false:true);
						// break;
						case 'u_ftp':
							n='ftp';
							if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
							ret[n].value=parseInt(propval.VAL[0].VALUE);
						break;
						case 'u_ftpeditable':
							n='ftp';
							if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
							ret[n].editable=(parseInt(propval.VAL[0].VALUE)==0?false:true);
						break;
						case 'u_sms':
							n='sms';
							if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
							ret[n].value=parseInt(propval.VAL[0].VALUE);
						break;
						case 'u_smseditable':
							n='sms';
							if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
							ret[n].editable=(parseInt(propval.VAL[0].VALUE)==0?false:true);
						break;
						case 'u_activesync':
							n='activesync';
							if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
							ret[n].value=parseInt(propval.VAL[0].VALUE);
						break;
						case 'u_activesynceditable':
							n='activesync';
							if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
							ret[n].editable=(parseInt(propval.VAL[0].VALUE)==0?false:true);
						break;
						case 'u_webdav':
							n='webdav';
							if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
							ret[n].value=parseInt(propval.VAL[0].VALUE);
						break;
						case 'u_webdaveditable':
							n='webdav';
							if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
							ret[n].editable=(parseInt(propval.VAL[0].VALUE)==0?false:true);
						break;
						case 'u_archive':
							n='archive';
							if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
							ret[n].value=parseInt(propval.VAL[0].VALUE);
						break;
						case 'u_archiveeditable':
							n='archive';
							if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
							ret[n].editable=(parseInt(propval.VAL[0].VALUE)==0?false:true);
						break;
						case 'u_meeting':
							n='meeting';
							if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
							ret[n].value=parseInt(propval.VAL[0].VALUE);
						break;
						case 'u_meetingeditable':
							n='meeting';
							if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
							ret[n].editable=(parseInt(propval.VAL[0].VALUE)==0?false:true);
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
			return false;
		}
		cb(ret);
	}).account([
		"u_smtp",
		"u_pop3imap",
		"u_webmail",
		"u_avscan",
		"u_aveditable",
		"u_as",
		"u_aseditable",
		"u_quarantine",
		"u_quarantineeditable",
		"u_im",
		"u_imeditable",
		"u_teamchat",
		"u_teamchatsupport",
		"u_teamchateditable",
		"u_webdocuments",
		"u_webdocumentssupport",
		"u_webdocumentseditable",
		"u_gw",
		"u_gweditable",
		"u_sip",
		"u_sipeditable",
		// "u_syncml",
		// "u_syncmleditable",
		"u_ftp",
		"u_ftpeditable",
		"u_sms",
		"u_smseditable",
		"u_activesync",
		"u_activesynceditable",
		"u_webdav",
		"u_webdaveditable",
		"u_archive",
		"u_archiveeditable",
		"u_meeting",
		"u_meetingeditable"
	],account);
}

_me.card=function(account,cb){
	com.console.item(cb).account('a_vcard',account);
}

_me.addToGroup=function(groups,accounts,aHandler){
	if(typeof accounts != 'object'){
		accounts=[accounts];
	}
	if(typeof groups != 'object'){
		groups=[groups];
	}
	
	var group='';
	
	for(var g=0; g<groups.length; g++)
	{
	
		var items=[];
		
		for(var i=0; i<accounts.length; i++)
		{
			items.push({
				classname:[{VALUE:'tpropertymember'}],
				val:[{VALUE:accounts[i]}]
			});
		}
		
		var aRequest = {
			commandname:[{VALUE:'addaccountmembers'}],
			commandparams:[{
				accountemail:[{VALUE:groups[g]}],
				members:[{
					classname:[{VALUE:'tpropertymembers'}],
					val:[{
						item:items
					}]
				}]
			}]
		};
		
		this.create_iq(aRequest,[this,'__response',[[aHandler]]]);
	}
	
	return true;
}

_me.addAllToGroup=function(groups,domain,filter,aHandler){
	
	var masks={
		namemask:[{VALUE:'*'}]
	};
	if(filter.namemask){
		masks.namemask[0].VALUE=filter.namemask;
	}
	if(filter.typemask){
		masks.typemask=[{VALUE:filter.typemask}];
	}
	
	if(typeof groups != 'object'){
		groups=[groups];
	}
	
	var group='';
	
	for(var g=0; g<groups.length; g++)
	{
		var aRequest = {
			commandname:[{VALUE:'addallaccountmembers'}],
			commandparams:[{
				accountemail:[{VALUE:groups[g]}],
				domainstr:[{VALUE:domain}],
				filter:[masks]
			}]
		};
		
		this.create_iq(aRequest,[this,'__response',[[aHandler]]]);
	}
	
	return true;
}

_me.__response = function(aData,aHandler){
	try
	{
		executeCallbackFunction(aHandler,aData);
	}
	catch(e){
		log.error(['wmuser-response',e]);
	}
};

if(!com){var com={};}
com.user = new wm_user();
