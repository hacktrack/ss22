_me = obj_rulesdialog.prototype;
function obj_rulesdialog(){};

/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function(s){
	var me = this;
	var parent=this._parent;
	
	this.__id=false;
	this.__who='';

	storage.library('wm_rules');
	storage.library('obj_accountpicker');

	// list of actions without body
	me.__emptyactions={
		sendmessage:true,
		header:true,
		encrypt:true
	};
	me.__emptyconditions={
		all:true,
		hasattach:true,
		spam:true,
		trustedsession:true,
		smtpauth:true,
		stop:true
	};
	//

	me.__actions={
		standard:{
			messageaction:getLang('rules::action_accept_reject_delete_spam_quarantine'),
			forward:getLang('rules::action_forward_to_email'),
			copyfolder:getLang('rules::action_copy_to_folder'),
			movefolder:getLang('rules::action_move_to_folder'),
			encrypt:getLang('rules::action_encrypt_message')
		},
		extra:{
			sendmessage:getLang('rules::action_send_new_message'),
			header:getLang('rules::action_edit_message_header'),
			priority:getLang('rules::action_set_message_priority_to'),
			flags:getLang('rules::action_set_message_flags_to'),
			stop:getLang('rules::action_stop_processing_more_rules'),
		}
	}

	me.__conditions={
		basic:{
			all:getLang('rules::condition_all_messages'),
			from:[getLang('rules::condition_where_from'),getLang('rules::condition_message_header_matches')],
			subject:[getLang('rules::condition_where_subject'),getLang('rules::condition_message_header_matches')],
			body:getLang('rules::condition_where_message_body_matches'),
			hasattach:getLang('rules::condition_where_message_contains_attachment'),
			attachname:getLang('rules::condition_where_attachment_name_matches'),
			priority:getLang('rules::condition_where_message_priority_is'),
			size:getLang('rules::condition_where_message_size_is'),
			spam:getLang('rules::condition_where_message_is_spam')
		},
		headers:{
			to:[getLang('rules::condition_where_to'),getLang('rules::condition_message_header_matches')],
			cc:[getLang('rules::condition_where_cc'),getLang('rules::condition_message_header_matches')],
			replyto:[getLang('rules::condition_where_replyto'),getLang('rules::condition_message_header_matches')],
			date:[getLang('rules::condition_where_date'),getLang('rules::condition_message_header_matches')],
			customheader:getLang('rules::condition_where_custom_message_header_matches'),
			anyheader:getLang('rules::condition_where_any_message_header_matches'),
			directmessage:getLang('rules::condition_where_message_direct_to_user')
		},
		advanced:{
			sender:getLang('rules::condition_where_sender_matches'),
			recipient:getLang('rules::condition_where_recipient_matches'),
			senderrecipient:getLang('rules::condition_where_sender_recipient_is_local_remote'),
			spamscore:getLang('rules::condition_where_spam_score_is'),
			time:getLang('rules::condition_where_local_time_meets'),
			rdns:getLang('rules::condition_where_rdns_matches'),
			remoteip:getLang('rules::condition_where_senders_ip_address_matches'),
			dnsbl:getLang('rules::condition_where_senders_ip_address_is_listed_on_dnsbl'),
			trustedsession:getLang('rules::condition_where_session_is_trusted'),
			smtpauth:getLang('rules::condition_where_smtp_auth'),
		}
	};
	
	
	this._parent.btn_save._onclick=function(){
		me._parent.btn_save._disabled(true);
		me._save();
	}
};

_me._setCallback=function(callback){
	this.__callback=callback;
}

_me.__onclick = function(e){
	log.log('clicked',e);
};

_me.__listOf=function(type,returnlist){
	try
	{
		type=type.replace('s','');
		var me=this;
		if(typeof me['__listof'+type+'s'] == 'undefined'){me['__listof'+type+'s']={};}
		
		var list=[];
		for(var key in me['__listof'+type+'s']){
			list.push(me['__listof'+type+'s'][key]);
		}
		
		if(returnlist){
			return list;
		}else{
			return {
				add:function(card){
					var id = card._name.match(/\d+$/);
					card._onbeforedestruct=me.__listOf(type).remove;
					me['__listof'+type+'s'][card.__name + id]=card;
				},
				remove:function(card){
					var id = card._name.match(/\d+$/);
					if(card._addButton){card._addButton._disabled(false);}
					delete me['__listof'+type+'s'][card.__name + id];
				},
				list:list
			}
		}
	}
	catch(e)
	{
		log.error(['rulesdialog-listof',type,returnlist]);
	}
}

_me._listOfConditions=function(returnlist){
	return this.__listOf('condition',returnlist);
}

_me._listOfActions=function(returnlist){
	return this.__listOf('action',returnlist);
}

_me._fillConditionsTab=function(id,addCallback){
	var me=this;
	var list=me.tabs_conditions._create(id+'_list','obj_loadable',me.tabs_conditions._getTab(id).contentAnchor);
		list._value('obj_rulesdialog_conditions_item');
		list._iwAttr('type','compact');
		addcss(list._main,'noanchor');

		for(var key in me.__conditions[id])
		{
			// draw conditions
			var item={key:key};
			item.title=me.__conditions[id][key];
			if(typeof me.__conditions[id][key] == 'object'){
				item.val=me.__conditions[id][key][0];
				item.val2=me.__conditions[id][key][1];
			}else{
				item.val=me.__conditions[id][key];
			}
			var line=list._drawItem(item);
			var add=line._objects[0];
				add._item=line._item;
				add._onclick=function(){
					//log.log(['rulesdialog-fillconditionstab-add',this._item.key]);
					if(addCallback){addCallback(this._item);}
				}
			//
		}

		return list;
}

_me._fillActionsTab=function(id,addCallback){
	var me=this;
	var list=me.tabs_actions._create(id+'_list','obj_loadable',me.tabs_actions._getTab(id).contentAnchor);
		list._value('obj_rulesdialog_conditions_item');
		list._iwAttr('type','compact');
		addcss(list._main,'noanchor');

		for(var key in me.__actions[id])
		{
			// draw actions
			var item={key:key};

			item.title=me.__actions[id][key];
			if(typeof me.__actions[id][key] == 'object'){
				item.val=me.__actions[id][key][0];
				item.val2=me.__actions[id][key][1];
			}else{
				item.val=me.__actions[id][key];
			}
			var line=list._drawItem(item);
			var add=line._objects[0];
				add._item=line._item;
				add._onclick=function(){
					//log.log(['rulesdialog-fillactionstab-add',this._item.key]);
					if(addCallback){
						var card=addCallback(this._item);
						this._disabled(true);
						card._addButton=this;
					}
				}
			//
		}

		return list;
}

_me._getConditionTitle=function(type){
	var me=this;
	for(var key in me.__conditions){
		if(me.__conditions[key][type]){
			return me.__conditions[key][type];
		}
	}
	log.error(['rulesdialog-getconditiontitle','type "'+type+'" undefined']);
	return '';
}

_me._getActionTitle=function(type){
	var me=this;
	for(var key in me.__actions){
		if(me.__actions[key][type]){
			return me.__actions[key][type];
		}
	}
	log.error(['rulesdialog-getactiontitle','type "'+type+'" undefined']);
	return '';
}

_me._load = function(who,rule)
{
	this.__id=rule;
	this.__who=who;
	
	var domain=false;
	var account=false;
	if(who.search('@')<0){
		domain=who;
	}else{
		account=who;
	}

	log.log(['rulesdialog-load',account,domain,rule]);

	try
	{
		var me=this;
		var parent=this._parent;

		log.log('Rules dialog should be loaded');

		me._draw('obj_rulesdialog', '', {});

		// get data for rule from server
		if(rule){
			com.rules.rule(who,rule,function(data){
				me.input_title._value(data.title);
				for(var i=0; i<data.conditions.length; i++){
					data.conditions[i].type=com.rules.translateCondition(parseInt(data.conditions[i].conditiontype));
					log.log(['rulesdialog-conditionsloop',data.conditions[i]]);
					var card=me._addConditionCard(data.conditions[i].type,me._getConditionTitle(data.conditions[i].type));
					card._set(data.conditions[i]);
				}
	
				for(var i=0; i<data.actions.length; i++){
					try
					{
						data.actions[i].type=com.rules.translateAction(parseInt(data.actions[i].actiontype));
						log.log(['rulesdialog-actionsloop',data.actions[i]]);
						var card=me._addActionCard(data.actions[i].type,me._getActionTitle(data.actions[i].type));
						card._set(data.actions[i]);
					}
					catch(e)
					{
						log.error(['rulesdialog-load-actionsloop',e]);
					}
				}
				
				me._collapseAllConditionCards();
				me._collapseAllActionCards();
			});
		}
		//

		me.tabs_conditions._fill([
			{
				id:'basic',
				label:getLang('rules::basic')
			},
			{
				id:'headers',
				label:getLang('rules::headers'),
			},
			{
				id:'advanced',
				label:getLang('rules::advanced')
			}
		]);

		me.tabs_actions._fill([
			{
				id:'standard',
				label:getLang('rules::standard')
			},
			{
				id:'extra',
				label:getLang('rules::extra')
			}
		]);

		// conditions - basic
		var list=me._fillConditionsTab('basic',function(data){
			me._addConditionCard(data.key,data.title);
		});
		// conditions - headers
		var list=me._fillConditionsTab('headers',function(data){
			me._addConditionCard(data.key,data.title);
		});
		// conditions - advanced
		var list=me._fillConditionsTab('advanced',function(data){
			me._addConditionCard(data.key,data.title);
		});

		// actions - basic
		var list=me._fillActionsTab('standard',function(data){
			return me._addActionCard(data.key,data.title);
		});
		// actions - headers
		var list=me._fillActionsTab('extra',function(data){
			return me._addActionCard(data.key,data.title);
		});

		// load dummy card
		//me._addConditionCard('dummy','Some title');

	}
	catch(e){
		log.error(e);
	}
}

_me._collapseAllConditionCards=function(){
	var list=this._listOfConditions().list;
	for(var i=0; i<list.length; i++){
		list[i]._expand(false);
	}
}

_me._addConditionCard=function(key,title){
	var me=this;
	var i=0;
	var objid='card_condition_'+key;
	while(me[objid]){
		i++;
		objid='card_condition_'+key+i;
	}
	log.log(['rulesdialog-addconditioncard','add card with optional "'+key+'"',title]);
	var card=me._create(objid,'obj_rulecard','rules_result_conditions');
	me._collapseAllConditionCards();
	
	card._load(key,'condition',(me.__emptyconditions[key]));
	card._title(title);
	
	me._listOfConditions().add(card);

	return card;
}

_me._collapseAllActionCards=function(){
	var list=this._listOfActions().list;
	for(var i=0; i<list.length; i++){
		list[i]._expand(false);
	}
}

_me._addActionCard=function(key,title){
	var me=this;
	var i=0;
	var objid='card_action_'+key;
	while(me[objid]){
		i++;
		objid='card_action_'+key+i;
	}
	log.log(['rulesdialog-addactioncard','add card with optional "'+key+'"',title]);
	var card=me._create(objid,'obj_rulecard','rules_result_actions');
	me._collapseAllActionCards();
	
	card._load(key,'action',(me.__emptyactions[key]));
	card._title(title);

	me._listOfActions().add(card);

	return card;
}

_me._save=function(){
	var me=this;
	var conditions=this.__listOf('condition').list;
	var actions=this.__listOf('action').list;
	
	var data_conditions=[];
	for(var i=0; i<conditions.length; i++){
		conditions[i]._updateStorage();
		data_conditions.push(conditions[i].__storage);
	}
	
	var data_actions=[];
	for(var i=0; i<actions.length; i++){
		actions[i]._updateStorage();
		data_actions.push(actions[i].__storage);
	}
	
	var callback=function(data){
		me._parent.btn_save._disabled(false);
		try
		{
			if(data.Array.IQ[0].QUERY[0].ERROR){
				log.error('e:'+data.Array.IQ[0].QUERY[0].ERROR[0].ATTRIBUTES.UID);
			}
			else
			{
				if(data.Array.IQ[0].QUERY[0].RESULT[0].VALUE==0){
					gui.message.error(getLang("error::rule_save_unsuccessful"));
				}else{
					gui.message.toast(getLang("message::rule_save_successfull"));
					if(me.__callback){me.__callback();}
				}
			}
		}
		catch(e)
		{
			log.error(e);
		}
	}
	
	if(this.__id){
		com.rules.edit(this.__id,this.__who,this.input_title._value(),data_conditions,data_actions,callback);
	}else{
		com.rules.add(this.__who,this.input_title._value(),data_conditions,data_actions,callback);
	}
}
