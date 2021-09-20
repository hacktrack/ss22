function wm_rules()
{
	this.xmlns='rpc';
}

wm_rules.inherit(wm_generic);
var _me = wm_rules.prototype;

_me.translateConditionClass=function(condition){
	
	if(typeof condition == 'number'){
		condition=this.translateCondition(condition);
	}
	
	var ret='TRuleSomeWordsCondition';
	
	switch(condition){
		case 'priority':
			return 'TRulePriorityCondition';
		case 'spam':
			return 'TRuleIsSpamCondition';
		case 'size':
			return 'TRuleIsSizeCondition';
		case 'hasattach':
			return 'TRuleHasAttachmentCondition';
		case 'senderrecipient':
			return 'TRuleSenderRecipientCondition';
		case 'dnsbl':
			return 'TRuleDNSBLCondition';
		case 'trustedsession':
			return 'TRuleTrustedSessionCondition';
		case 'spamscore':
			return 'TRuleSpamScoreCondition';
		case 'smtpauth':
			return 'TRuleSMTPAuthCondition';
		case 'time':
			return 'TRuleLocalTimeCondition';
		case 'all':
			return 'TRuleAllCondition';
		case 'directmessage': 
			return 'TRuleDirectMessageCondition';
	}
	
	return ret;
}

_me.translateActionClass=function(action){
	
	if(typeof action == 'number'){
		action=this.translateAction(action);
	}
	
	log.log(['wmrules-translateactionclass',action]);
	switch(action){
		case 'sendmessage':
			return 'TRuleSendMessageAction';
		case 'forward':
			return 'TRuleForwardToEmailAction';
		case 'movefolder':
			return 'TRuleMoveToFolderAction';
		case 'copyfolder':
			return 'TRuleCopyToFolderAction';
		case 'encrypt':
			return 'TRuleEncryptAction';
		case 'priority':
			return 'TRulePriorityAction';
		case 'flags':
			return 'TRuleSetFlagsAction';
		case 'header':
			return 'TRuleEditHeaderAction';
		case 'messageaction':
			return 'TRuleMessageActionAction';
		case 'stop':
			return 'TRuleStopAction';
	}
	
	return false;
}

_me.translateCondition=function(condition){

	/*Enum 0=ctNone , 1=ctFrom , 2=ctTo , 3=ctSubject , 4=ctCC , 5=ctReplyTo , 6=ctBcc , 7=ctDate , 8=ctPriority , 9=ctSpam , 10=ctSize , 11=ctBody , 12=ctCustomHeader , 13=ctAnyHeader , 14=ctAttachName , 15=ctStripAttach , 16=ctRenameAttach , 17=ctHasAttach , 18=ctCharset , 19=ctSender , 20=ctRecipient , 21=ctSenderRecipient , 22=ctRemoteHost , 23=ctRFC822 , 24=ctExecution , 25=ctRemoteIP , 26=ctRDNS , 27=ctDNSBL , 28=ctTrustedSession , 29=ctSpamScore , 30=ctBayesSize , 31=ctSMTPAuth , 32=ctAntivirus , 33=ctTime , 34=ctSQL , 35=ctAll , 36=ctAge , 37=ctFolder , 38=ctOwner, 39=ctDirectMessage */

	var types=['none','from','to','subject','cc','replyto','bcc','date','priority','spam','size','body','customheader','anyheader','attachname','stripattach','renameattach','hasattach','charset','sender','recipient','senderrecipient','remotehost','rfc822','execution','remoteip','rdns','dnsbl','trustedsession','spamscore','bayessize','smtpauth','antivirus','time','sql','all','age','folder','owner', 'directmessage'];

	if(typeof condition == 'number'){
		if(types[condition]){return types[condition];}
		log.error(['e:condition_type_undefined',condition]);
		return '';
	}else{
		for(var i=0; i<types.length; i++){
			if(types[i]==condition){
				return i;
			}
		}
		log.error(['e:condition_type_undefined',condition]);
		return false;
	}
}

_me.translateAction=function(action){

	/*Enum 0=atNone , 1=atSendMessage , 2=atForward , 3=atCopyMessage , 4=atMoveFolder , 5=atCopyFolder , 6=atEncrypt , 7=atPriority , 8=atRespond , 9=atFlags , 10=atHeader , 11=atScore , 12=atExecute , 13=atHeaderFooter , 14=atStripAll , 15=atExctract , 16=atSmartAttach , 17=atAppend , 18=atSMTPResponse , 19=atFixRFC822 , 20=atTarpitIP , 21=atDB , 22=atSkipArchive , 23=atMoveToArchive , 24=atCopyToArchive , 25=atMessageAction , 26=atDeleteMessage , 27=atStop */

	var types=['none','sendmessage','forward','copymessage','movefolder','copyfolder','encrypt','priority','respond','flags','header','score','execute','headerfooter','stripall','extract','smartattach','append','smtpresponse','fixrfc822','tarpitip','db','skiparchive','movetoarchive','copytoarchive','messageaction','deletemessage','stop'];

	if(typeof action == 'number'){
		if(types[action]){return types[action];}
		log.error(['e:action_type_undefined',action]);
		return '';
	}else{
		for(var i=0; i<types.length; i++){
			if(types[i]==action){
				return i;
			}
		}
		log.error(['e:action_type_undefined',action]);
		return false;
	}
}

_me.moveRule=function(who,id,type,aHandler){
	if(type=='down'){type=1;}
	if(type=='up'){type=0;}
	var aRequest = {
		commandname:[{VALUE:'moverule'}],
		commandparams:[{
			who:[{VALUE:who}],
			ruleid:[{VALUE:id}],
			movetype:[{VALUE:type}]
		}]
	};
	
	if(!aHandler[0]){aHandler=[aHandler];}
	
	this.create_iq(aRequest,[this,'__response',[aHandler]]);
	return true;
}

_me.deleteRule=function(id,who,aHandler){
	var aRequest = {
		commandname:[{VALUE:'deleterule'}],
		commandparams:[{
			who:[{VALUE:who}],
			ruleid:[{VALUE:id}],
		}]
	};
	
	if(!aHandler[0]){aHandler=[aHandler];}
	
	this.create_iq(aRequest,[this,'__response',[aHandler]]);
	return true;
}

_me.activateRule=function(id,activate,who,aHandler){
	var aRequest = {
		commandname:[{VALUE:'setruleactive'}],
		commandparams:[{
			ruleid:[{VALUE:id}],
			who:[{VALUE:who}],
			state:[{VALUE:activate ? '1' : '0'}]
		}]
	};

	if(!aHandler[0]){aHandler=[aHandler];}

	this.create_iq(aRequest,[this,'__response',[aHandler]],false,'get','123',false,false);
	return true;
}

_me.rule=function(who,id,aHandler){
	var aRequest = {
		commandname:[{VALUE:'getrule'}],
		commandparams:[{
			who:[{VALUE:who}],
			ruleid:[{VALUE:id}],
		}]
	};
	
	if(!aHandler[0]){aHandler=[aHandler];}
	
	var h=[function(data){
		var processed={
			id:false,
			title:''
		};
		var max=0;
		try
		{
			var root=data.Array.IQ[0].QUERY[0].RESULT[0];
			log.log(['rules-rule',root]);
			if(root.RULEID && root.RULEID[0].VALUE){
				processed.id=parseInt(root.RULEID[0].VALUE);
			}
			if(root.TITLE && root.TITLE[0].VALUE){
				processed.title=root.TITLE[0].VALUE;
			}
			if(root.ACTIVE && root.ACTIVE[0].VALUE){
				processed.active=parseInt(root.ACTIVE[0].VALUE);
			}
			// add conditions
			var conditions=[];
			if(root.CONDITIONS[0].ITEM){
				var items=root.CONDITIONS[0].ITEM;
				for(var i=0; i<items.length; i++){
					var condition={};
					for(var key in items[i]){
						if(key!='CLASSNAME'){
							condition[key.toLocaleLowerCase()]=(items[i][key][0].VALUE?items[i][key][0].VALUE:'');
							// parse bool
							if({
								logicalnot:true,
								bracketsleft:true,
								bracketsright:true,
								matchcase:true,
								matchwholewordsonly:true,
								multipleitemsmatch:true,
								notmatch:true,
								operatorand:true,
								parsexml:true,
								weekdays:true,
								monday:true,
								tuesday:true,
								wednesday:true,
								thursday:true,
								friday:true,
								saturday:true,
								sunday:true,
								betweendates:true,
								betweentimes:true
								}[key.toLocaleLowerCase()]){
								condition[key.toLocaleLowerCase()]=(condition[key.toLocaleLowerCase()]=='1'?true:false);
							}
							// parse int
							if({
								conditiontype:true,
								matchfunction:true,
								recipientcondition:true,
								recipientsender:true,
								remotelocal:true,
								comparetype:true,
								size:true,
								}[key.toLocaleLowerCase()]){
								condition[key.toLocaleLowerCase()]=parseInt(condition[key.toLocaleLowerCase()]);
							}
							
						}
					}
					conditions.push(condition);
				}
			}
			log.log(['rules-conditions',conditions]);
			processed.conditions=conditions;
			
			// add actions
			var actions=[];
			if(root.ACTIONS[0].ITEM){
				var items=root.ACTIONS[0].ITEM;
				for(var i=0; i<items.length; i++){
					var action={};
					for(var key in items[i]){
						if(key!='CLASSNAME'){
							action[key.toLocaleLowerCase()]=(items[i][key][0].VALUE?items[i][key][0].VALUE:'');
							// parse headers list
							if(key.toLocaleLowerCase()=='headers'){
								var headers=[];
								for(var h=0; h<items[i][key][0].ITEM.length; h++){
									var item=items[i][key][0].ITEM[h];
									headers.push({
										editheadertype:(item.EDITHEADERTYPE[0].VALUE=='1'?true:false),
										header:item.HEADER[0].VALUE,
										hasregex:(item.HASREGEX[0].VALUE=='1'?true:false),
										regex:(item.REGEX[0]&&item.REGEX[0].VALUE?item.REGEX[0].VALUE:''),
										value:(item.VALUE[0]&&item.VALUE[0].VALUE?item.VALUE[0].VALUE:'')
									});
								}
								action[key.toLocaleLowerCase()]=headers;
							}
							// parse bool
							if({
								//bools here
								flagged:true,
								junk:true,
								notjunk:true,
								seen:true,
								label1:true,
								label2:true,
								label3:true,
								label4:true,
								label5:true,
								label6:true
								
								}[key.toLocaleLowerCase()]){
								action[key.toLocaleLowerCase()]=(action[key.toLocaleLowerCase()]=='1'?true:false);
							}
							// parse int
							if({
								messageactiontype:true,
								actiontype:true
								
								}[key.toLocaleLowerCase()]){
								action[key.toLocaleLowerCase()]=parseInt(action[key.toLocaleLowerCase()]);
							}
						}
					}
					actions.push(action);
				}
			}
			log.log(['rules-actions',actions]);
			processed.actions=actions;
		}
		catch(e)
		{
			log.error([e,data]);
		}
		aHandler[0](processed);
	}];
	
	this.create_iq(aRequest,[this,'__response',[h]]);
	return true;
}

_me.rulesInfoList=function(domain,itemsPerPage,page,aHandler){
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
	
	this.create_iq(aRequest,[this,'__response',[h]]);
	return true;
}

_me.__response = function(aData,aHandler){
	var out = aData;

	executeCallbackFunction(aHandler,out);
};

_me.add=function(who,title,conditions,actions,aHandler){
	this.edit(false,who,title,conditions,actions,aHandler);
}

_me.edit=function(id,who,title,conditions,actions,aHandler){
	log.info(['wmrules-save',id,who,title,conditions,actions]);
	try
	{
		var items_conditions=[];
		for(var i=0; i<conditions.length; i++){
			var item={};
			conditions[i].classname=this.translateConditionClass(conditions[i].conditiontype);
			for(var key in conditions[i]){
				if(!{type:true}[key]){
					item[key]=[{VALUE:(typeof conditions[i][key] == 'boolean'?(conditions[i][key]?'1':'0'):conditions[i][key])}];
				}
			}
			items_conditions.push(item);
		}
		
		var items_actions=[];
		for(var i=0; i<actions.length; i++){
			var item={};
			actions[i].classname=this.translateActionClass(actions[i].actiontype);
			for(var key in actions[i]){
				if(!{type:true,headers:true}[key]){
					item[key]=[{VALUE:(typeof actions[i][key] == 'boolean'?(actions[i][key]?'1':'0'):actions[i][key])}];
				}
				if(key=='headers'){
					item[key]=[];
					var headers=[];
					for(var i2=0; i2<actions[i][key].length; i2++){
						var item2={};
						for(var key2 in actions[i][key][i2]){
							item2[key2]=[{VALUE:(typeof actions[i][key][i2][key2] == 'boolean'?(actions[i][key][i2][key2]?'1':'0'):actions[i][key][i2][key2])}];
						}
						item[key].push({CLASSNAME:[{VALUE:'TRuleEditHeaderList'}],ITEM:[item2]});
					}
				}
			}
			items_actions.push(item);
		}
		
		log.info(['wmrules-save2',id,who,title,items_conditions,items_actions]);
		
		var data_conditions=[{
			classname:[{VALUE:'truleconditions'}],
			item:items_conditions
		}];
		var data_actions=[{
			classname:[{VALUE:'truleactions'}],
			item:items_actions
		}];
		
		var aRequest = {
			commandname:[{VALUE:(id?'editrule':'addrule')}],
			commandparams:[{
				who:[{VALUE:who}],
				rulesettings:[{
					active:[{VALUE:'1'}],
					title:[{VALUE:title}],
					conditions:data_conditions,
					actions:data_actions
				}]
			}]
		};
		
		// edit
		if(id){
			aRequest.commandparams[0].ruleid=[{VALUE:id}];
			aRequest.commandparams[0].rulesettings[0].ruleid=[{VALUE:id}];
		}
		
		
		if(!aHandler[0]){aHandler=[aHandler];}
		
		this.create_iq(aRequest,[this,'__response',[aHandler]]);
		return true;
	}
	catch(e)
	{
		log.error(['wmrules-edit',e]);
	}
}

if(!com){var com={};}
com.rules = new wm_rules();
