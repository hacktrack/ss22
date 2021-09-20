_me = obj_rulecard.prototype;
function obj_rulecard(){};

/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function(s){
	var me = this;
	me.__title='';
	me.__expanded=true;
	addcss(this._main,'rulecard is-active');

	me.__name='undefined';
	me.__type='undefined';

	me.__source={};
	me.__storage={};

	this._add_destructor('__onbeforedestruct');
	/* set onbefore destruct listener */
};

/** obbefore destruct listener */
_me.__onbeforedestruct=function(){
	if(this._onbeforedestruct){
		this._onbeforedestruct(this);
	}
}

_me._expand=function(expand){
	if(expand){
		this.__expanded=true;
		addcss(this._main,'is-active');
	}else{
		this.__expanded=false;
		removecss(this._main,'is-active');
	}
}

/** */
_me._load = function(name,type,emptycontent,expand)
{
	var me=this;
	if(typeof expand == 'undefined'){
		expand=true;
	}

	me.__name=name;
	me.__type=type;
	if(me.__type=='condition'){
		me.__source={
			bracketsleft:false,
			bracketsright:false,
			conditiontype:com.rules.translateCondition(name),
			logicalnot:false,
			operatorand:true,
			type:name
		};
	}else{
		me.__source={
			actiontype:com.rules.translateAction(name),
			type:name
		};
	}
	this.__storage=helper.clone(me.__source);

	try
	{
		var card_name={};
		if(name){
			card_name[type+'_'+name]=true;
		}
		me._draw('obj_rulecard','',card_name);

		// activate objects
		me.button_delete._onclick=function(){
			me._destruct();
		}
		
		me.expand._onclick=function(){
			me._expand(!me.__expanded);
		}
		me._expand(expand);
		
		me.button_not._checked=function(status){
			if(typeof status != 'undefined')
			{
				if(status){
					this._removecss('grey');
					this._addcss('primary');
				}else{
					this._addcss('grey');
					this._removecss('primary');
				}
				this.__checked=status;
			}

			if(!status && me.actionselect_logic_gate._value().search('not')>=0){
				me.actionselect_logic_gate._value(me.actionselect_logic_gate._value().replace('not',''),true);
			}else if(status && me.actionselect_logic_gate._value().search('not')<0){
				me.actionselect_logic_gate._value(me.actionselect_logic_gate._value()+'not',true);
			}

			return (this.__checked?true:false);
		}
		me.button_not._onclick=function(){
			if(this._checked()){
				this._checked(false);
			}else{
				this._checked(true);
			}
		}
		me.actionselect_logic_gate._fill(
			[
				{
					name:'and',
					icon:false,
					onclick:function(){return false;},
					value:'rules::and'
				},
				{
					name:'or',
					icon:false,
					onclick:function(){return false;},
					value:'rules::or'
				},
				{
					name:'andnot',
					icon:false,
					onclick:function(){return false;},
					value:'rules::and_not'
				},
				{
					name:'ornot',
					icon:false,
					onclick:function(){return false;},
					value:'rules::or_not'
				}

			]
		);
		me.actionselect_logic_gate._onchange=function(){
			if(this._value().search('not')>=0){
				me.button_not._checked(true);
			}else{
				me.button_not._checked(false);
			}
		}
		//

		if(type){
			me._iwAttr('type',type);
		}

		// empty content
		if(emptycontent){
			removecss(me._main,'is-active');
			me.expand._disabled(true);
		}
		//
	}
	catch(e)
	{
		log.error(['rulecard-load',e]);
	}

	if(type=='condition'){
		me.__activateConditionCard();
	}else{
		me.__activateActionCard();
	}
}

_me._getLogic=function(){
	if(this.actionselect_logic_gate){
		var val=this.actionselect_logic_gate._value();
		return {
			not:(val.search('not')>=0),
			and:(val.search('and')>=0),
			or:(val.search('or')>=0)
		};
	}
	return false;
}

_me.__logicGate=function(and,not){
	try
	{
		this.actionselect_logic_gate._value(
			(and?'and':'or')+(not?'not':'')
		);
		this.button_not._checked(not);
	}
	catch(e)
	{
		log.error(['rulecard-logicgate',e]);
	}
}

_me._iwAttr=function(arr,val){
	if(typeof arr != 'object'){
		n={};
		n[arr]=val;
		arr=n;
	}
	for(var key in arr){
		this._main.setAttribute('iw-'+key,arr[key]);
	}
}

_me._title=function(title,returnasstring){
	var me=this;
	me.__title=title;
	log.log(['rulecard-title',title]);
	if(typeof title == 'object'){
		if(title[1]){
			if(returnasstring){return title[1]+': '+title[0];}
			me._getAnchor('title_regular').innerHTML=helper.htmlspecialchars(title[0]);
			me._getAnchor('title_bold').innerHTML=helper.htmlspecialchars(title[1])+': ';
		}
	}else{
		if(returnasstring){return title;}
		me._getAnchor('title_regular').innerHTML=helper.htmlspecialchars(title);
	}
}

_me._set=function(data){

	this.__source=data;
	this.__storage=helper.clone(data);//function(data){var ret={}; for(var key in data){ret[key]=data[key];} return ret;}(data);

	this.__logicGate(
		(data.operatorand?true:false),
		(data.logicalnot?true:false)
	);

	if(this.__type=='condition'){
		this.__setCondition(data);
	}else{
		this.__setAction(data);
	}
}

_me._get=function(){

	this._updateStorage();
	return this.__storage;
	/*
	if(this.__type=='condition'){
		return this.__getCondition();
	}else{
		return this.__getAction();
	}
	*/
}


_me.__activateConditionCard=function(){
	try
	{
		var me=this;
		var name=me.__name;

		log.log(['rulecard-activateconditioncard',name]);
		switch(name){
			case 'dummy':
				//card.dropdown_string_condition_function._fill(['some','some2']);
			break;
			case 'cc':
			case 'replyto':
			case 'from':
			case 'to':
			case 'subject':
			case 'date':
			case 'body':
			case 'customheader':
			case 'attachname':
			case 'anyheader':
			case 'sender':
			case 'recipient':
			case 'remoteip':
			case 'rdns':
				me.dropdown_string_condition_function._fill({
					'*2':getLang("rules::function_contains_value_from_list"),	// Contains a value from a list (semi-colon separated)
					'*3':getLang("rules::function_matches_regex"),				// Matches (RegEx)
					'*4':getLang("rules::function_starts_with"),				// Starts with
					'*5':getLang("rules::function_ends_with"),					// Ends with
					'*6':getLang("rules::function_equals"),						// Equals
					'*7':getLang("rules::function_contains_value_from_file")	// Contains a value from a file or pattern
				});
				me.button_string_condition_string._onclick=function(){
					log.log(['rulecard-activateconditioncard-replyto','clicked']);
					gui.accountpicker(function(picked){
						log.log(['rulecard-activateconditioncard-replyto',picked]);
						var ids=[];
						for(var i=0; i<picked.length; i++){
							ids.push(picked[i]._id);
						}
						me.input_string_condition_string._value(ids.join(';'));
					});
				}
			break;
			case 'senderrecipient':
				me.button_member_of._onclick=function(){
					log.log(['rulecard-activateconditioncard-replyto','clicked']);
					gui.accountpicker(function(picked){
						log.log(['rulecard-activateconditioncard-replyto',picked]);
						var ids=[];
						for(var i=0; i<picked.length; i++){
							ids.push(picked[i]._id);
						}
						me.input_member_of._value(ids.join(';'));
					});
				}
			break;
			case 'priority':
				me.dropdown_message_priority._fill({
					'*1':getLang("rules::priority_highest"),	// Highest
					'*2':getLang("rules::priority_high"),		// High
					'*3':getLang("rules::priority_normal"),		// Normal
					'*4':getLang("rules::priority_low"),		// Low
					'*5':getLang("rules::priority_lowest"),		// Lowest
				});
			break;
			case 'dnsbl':
				// Where senders IP address is listed on DNSBL
			break;
			case 'spamscore':
				this.dropdown_spam_score._fill({
					'*0':getLang('rules::lower'),
					'*1':getLang('rules::greater')
				});
			break;
			case 'size':
				this.dropdown_message_size._fill({
					'*0':getLang('rules::lower'),
					'*1':getLang('rules::greater')
				});
				this.dropdown_message_size_than._fill({
					'*0':getLang('generic::size_kb'),
					'*1':getLang('generic::size_mb'),
					'*2':getLang('generic::size_gb')
				});
			break;
			case 'directmessage':
				this.checkbox_checkuserinto._checked(true);
				this.checkbox_checkuserincc._checked(true);
				this.checkbox_userisonlyrecipient._onchange = function(e) {
					if(!e || !e.target.checked) {
						return;
					}
					me.checkbox_checkuserinto._checked(false);
					me.checkbox_checkuserincc._checked(false);
					me.checkbox_checkuserinbcc._checked(false);
				}
				this.checkbox_checkuserinto._onchange = this.checkbox_checkuserincc._onchange = this.checkbox_checkuserinbcc._onchange = function(e) {
					if(e && e.target.checked) {
						me.checkbox_userisonlyrecipient._checked(false);
					}
				}
			break;
		}
	}
	catch(e)
	{
		log.error(['rulecard-activateconditioncard',e]);
	}
}

_me.__activateActionCard=function(){
	try
	{
		var me=this;
		var name=me.__name;

		log.info(['rulecard-activateactioncard',name]);
		switch(name){
			case 'dummy':
			break;
			case 'priority':
				me.dropdown_message_priority._fill({
					'*1':getLang("rules::priority_highest"),	// Highest
					'*2':getLang("rules::priority_high"),		// High
					'*3':getLang("rules::priority_normal"),	// Normal
					'*4':getLang("rules::priority_low"),		// Low
					'*5':getLang("rules::priority_lowest"),		// Lowest
				});
			break;
			case 'forward':
				me.button_email_address._onclick=function(){
					gui.accountpicker(function(picked){
						log.log(['rulecard-activateconditioncard-replyto',picked]);
						var ids=[];
						for(var i=0; i<picked.length; i++){
							ids.push(picked[i]._id);
						}
						me.input_email_address._value(ids.join(';'));
					});
				}
			break;
			case 'header':
			case 'sendmessage':
				this.button_settings._onclick=function(){

					// set empty function instead of updateStorage because of empty content in standard card. updateStorage will be handled on popup save
					me._updateStorage=function(){};

					var popup=gui._create('popup','obj_popup');
					popup._init({
						fixed:false,
						iwattr:{
							height:'full',
							width:'medium'
						},
						name:'header',
						heading:{
							value:me._title(me.__title,true)
						},
						footer:'default'
					});

					var optional={name:me.__name}
						optional[me.__name]=true;
					popup.main._draw('obj_rulepopup','main_content',optional);

					if(name=='sendmessage')
					{
						popup.main.button_from._onclick=function(){
							gui.accountpicker(function(picked){
								var ids=[];
								for(var i=0; i<picked.length; i++){
									ids.push(picked[i]._id);
								}
								popup.main.input_from._value(ids.join(';'));
							});
						}
						popup.main.button_to._onclick=function(){
							gui.accountpicker(function(picked){
								var ids=[];
								for(var i=0; i<picked.length; i++){
									ids.push(picked[i]._id);
								}
								popup.main.input_to._value(ids.join(';'));
							});
						}

						popup.main.input_from._value(me.__storage.messagefrom);
						popup.main.input_to._value(me.__storage.messageto);
						popup.main.input_subject._value(me.__storage.messagesubject);
						popup.main.textarea_text._value(me.__storage.messagetext);

						// handle storage update
						popup.main.btn_save._onclick=function(){
							me.__storage.messagefrom=popup.main.input_from._value();
							me.__storage.messageto=popup.main.input_to._value();
							me.__storage.messagesubject=popup.main.input_subject._value();
							me.__storage.messagetext=popup.main.textarea_text._value();
							popup._close();
						}
						//
					}
					// header
					else
					{
						if(!me.__storage.headers){me.__storage.headers=[];}

						// save
						popup.main.btn_save._onclick=function(){
							// update content of "edit message header card"
							var items=popup.main.list._getItems();
							log.log(['rulecard-activateactioncard-save',items]);
							for(var key in items){
								me.__storage.headers.push(items[key]._item);
							}
							popup._close();
						}

						// add
						popup.main.btn_add._onclick=function(edit){
							var popup2=gui._create('popup','obj_popup');
							popup2._init({
								fixed:false,
								iwattr:{
									height:'full',
									width:'medium'
								},
								name:'header_add',
								heading:{
									value:me._title(getLang('rulecard::add'),true)
								},
								footer:'default'
							});
							popup2.main._draw('obj_rulepopup','main_content',{header_add:true});
							popup2.main.btn_save._onclick=function(){
								log.log('rulecard-activateactioncard-add-save');
								var line=popup.main.list._drawItem({
									editheadertype:(popup2.main.dropdown_action._value()=='delete'?true:false),
									header:popup2.main.input_header._value(),
									value:popup2.main.input_value._value(),
									hasregex:popup2.main.toggle_regex._checked(),
									regex:popup2.main.input_regex._value()
								});
								me._activateItem(popup,line);

								popup2._close();
							}

							popup2.main.dropdown_action._fill({
								'add':getLang('rulepopup::add_edit'),
								'delete':getLang('rulepopup::delete')
							});

							return popup2;
						}
						//

						for(var i=0; i<me.__storage.headers.length; i++){
							var line=popup.main.list._drawItem(me.__storage.headers[i]);
							me._activateItem(popup,line);
						}
					}
				}
			break;
			case 'copyfolder':
			case 'movefolder':
				if(!location.parsed_query.account){
					this.button_folderpicker._disabled(true);
					me[(name=='copyfolder'?'input_copy_to_folder':'input_move_to_folder')]._value('INBOX');
				}
				this.button_folderpicker._onclick=function(){
					gui.folderpicker(function(data){
						try
						{
							var id=data.id;
								id=id.substr(1,id.length-1);
								id=helper.base64_decode(id);
							me[(name=='copyfolder'?'input_copy_to_folder':'input_move_to_folder')]._value(id);
						}
						catch(e)
						{
							log.error(['rulecard-activateactioncard-movefolder',name,data,e])
						}
					});
				}
			break;
		}
	}
	catch(e)
	{
		log.error(['rulecard-activateconditioncard',e]);
	}
}

_me._activateItem=function(popup,line){
	// define edit. it will be the same as add, except it should use replaceChild to replace item in loadable with edited data
	// edit
	var me=this;
	line._objects[0]._onclick=function(line){return function(){
		//line._destruct();
		var popup2=popup.main.btn_add._onclick(true);
		popup2.main.dropdown_action._value((line._item.editheadertype=='1'?'delete':'add'));
		popup2.main.input_header._value(line._item.header);
		popup2.main.input_value._value(line._item.value);
		popup2.main.input_regex._value(line._item.regex);
		popup2.main.toggle_regex._checked(line._item.hasregex);
		log.log(['rulecard-activateitem-edit',line]);
		popup2.main.btn_save._onclick=function(line){return function(){
			log.log(['rulecard-activateitem-edit-save',line]);
			var nline=popup.main.list._redrawItem(line,{
				editheadertype:(popup2.main.dropdown_action._value()=='delete'?true:false),
				header:popup2.main.input_header._value(),
				value:popup2.main.input_value._value(),
				hasregex:popup2.main.toggle_regex._checked(),
				regex:popup2.main.input_regex._value()
			});
			me._activateItem(popup,nline);
			popup2._close();
		}}(line);

	}}(line);
	// delete
	line._objects[1]._onclick=function(line){return function(){
		line._destruct();
	}}(line);
}

_me.__setCondition=function(data){
	var me=this;

	log.log(['rulecard-setcondition-name',this.__name]);
	switch(this.__name){
		case 'from':
		case 'subject':
		case 'body':
		case 'cc':
		case 'name':
		case 'replyto':
		case 'to':
		case 'date':
		case 'customheader':
		case 'attachname':
		case 'anyheader':
		case 'sender':
		case 'recipient':
		case 'remoteip':
		case 'rdns':
		case 'dnsbl':
			if(this.checkbox_match_case){this.checkbox_match_case._checked((data.matchcase?true:false));}
			if(this.checkbox_whole_word){this.checkbox_whole_word._checked((data.matchwholewordsonly?true:false));}
			if(this.dropdown_string_condition_function){this.dropdown_string_condition_function._value(data.matchfunction);}
			if(this.input_string_condition_string){this.input_string_condition_string._value(data.matchvalue);}
		break;
		case 'senderrecipient':
			// Where sender / recipient is local / remote
			/*
			recipientcondition	"0"
			recipientsender		"0"
			remotelocal			"1"
			*/
			if(data.recipientsender == 0){
				this.radio_sender._checked(true);
			}else{
				this.radio_recipient._checked(true);
			}

			if(data.remotelocal == 0){
				this.radio_remote._checked(true);
			}else{
				this.radio_local._checked(true);
			}

			if(data.recipientcondition == 0){
				this.radio_ignore._checked(true);
			}else if(data.recipientcondition == 1){
				this.radio_user_exists._checked(true);
			}else{
				this.radio_user_doesnt_exists._checked(true);
			}

			if(data.account) {
				this.input_member_of._value(data.account);
			}

		break;
		case 'size':
			// size
			//log.info(['rulecard-setcondition-size',data]);
			this.dropdown_message_size._value(data.comparetype);
			var size=helper.bytes2hr(data.size/1024,true,[
				getLang('generic::size_kb'),
				getLang('generic::size_mb'),
				getLang('generic::size_gb')
			]);
			this.input_message_size_than._value(size.size);
			this.dropdown_message_size_than._value(size.unit);
		break;
		case 'priority':
			//log.info(['rulecard-setcondition-priority',data]);
			// priority
			this.dropdown_message_priority._value(data.priority);
		break;
		case 'spamscore':
			// spamscore
			//log.info(['rulecard-setcondition-spamscore',data]);
			this.dropdown_spam_score._value(data.comparetype);
			this.input_spam_score_than._value(data.spamscore);
		break;
		case 'time':
			// local time meets

			/**
			betweendates "1"
			betweentimes "1"
			bracketsleft false
			bracketsright false
			conditiontype 33
			friday false
			fromdate "2015/07/31"
			fromtime "0:00:00"
			logicalnot false
			monday true
			operatorand false
			saturday false
			sunday false
			thursday false
			todate "2015/08/09"
			totime "0:30:00"
			tuesday false
			type "time"
			wednesday true
			weekdays true
			*/

			//log.info(['rulecard-setcondition-time',data]);
			if(data.weekdays){
				this.toggle_weekdays._checked(true);
				var day='monday'; this['checkbox_'+day]._checked(data[day]);
				var day='tuesday'; this['checkbox_'+day]._checked(data[day]);
				var day='wednesday'; this['checkbox_'+day]._checked(data[day]);
				var day='thursday'; this['checkbox_'+day]._checked(data[day]);
				var day='friday'; this['checkbox_'+day]._checked(data[day]);
				var day='saturday'; this['checkbox_'+day]._checked(data[day]);
				var day='sunday'; this['checkbox_'+day]._checked(data[day]);
			}
			if(data.fromtime!=''){
				this.toggle_between_times._checked(true);
				var time=data.fromtime.split(':');
					time=(parseInt(time[0])<10?'0'+parseInt(time[0]):parseInt(time[0]))+':'+(parseInt(time[1])<10?'0'+parseInt(time[1]):parseInt(time[1]))
				this.input_time_from._value(time);
			}
			if(data.fromdate!=''){
				this.toggle_between_dates._checked(true);
				var date=data.fromdate.split('/');
				this.input_date_from._setDate(date[0],date[1],date[2]);
			}
			if(data.totime!=''){
				this.toggle_between_times._checked(true);
				var time=data.totime.split(':');
					time=(parseInt(time[0])<10?'0'+parseInt(time[0]):parseInt(time[0]))+':'+(parseInt(time[1])<10?'0'+parseInt(time[1]):parseInt(time[1]))
				this.input_time_to._value(time);
			}
			if(data.todate!=''){
				this.toggle_between_dates._checked(true);
				var date=data.todate.split('/');
				this.input_date_to._setDate(date[0],date[1],date[2]);
			}
		break;
		case 'directmessage':
			this.checkbox_checkuserinto._checked(!!+data.checkuserinto);
			this.checkbox_checkuserincc._checked(!!+data.checkuserincc);
			this.checkbox_checkuserinbcc._checked(!!+data.checkuserinbcc);
			this.checkbox_userisonlyrecipient._checked(!!+data.userisonlyrecipient)
		break;
	}
}

_me.__setAction=function(data){
	var me=this;

	log.info(['rulecard-setaction',this.__name,data]);
	switch(this.__name){
		case 'messageaction':
			this['radio_'+['accept','delete','reject','spam','quarantine'][data.messageactiontype]]._checked(true);
		break;
		case 'forward':
			this.input_email_address._value(data.email);
			this.forward_as_attachment._checked(data.forwardasattachment == 1);
		break;
		case 'priority':
			this.dropdown_message_priority._value(data.priority);
		break;
		case 'movefolder':
			this.input_move_to_folder._value(data.folder);
		break;
		case 'copyfolder':
			this.input_copy_to_folder._value(data.folder);
		break;
		case 'header':
		case 'sendmessage':
			//
		break;
		case 'flags':
			this.checkbox_flagged._checked(data.flagged);
			this.checkbox_seen._checked(data.seen);
			this.checkbox_junk._checked(data.junk);
			this.checkbox_non_junk._checked(data.notjunk);
			this.checkbox_label_1._checked(data.label1);
			this.checkbox_label_2._checked(data.label2);
			this.checkbox_label_3._checked(data.label3);
			this.checkbox_label_4._checked(data.label4);
			this.checkbox_label_5._checked(data.label5);
			this.checkbox_label_6._checked(data.label6);
			this.input_custom_flags._value(data.customflags);
		break;
	}
}
/*
_me.__getCondition=function(){
	var ret={};
	switch(this.__name){

	}

	return ret;
}

_me.__getAction=function(){
	switch(this.__name){

	}
}
*/
_me._setValue=function(key,val){
	this.__storage[key]=val;
}

_me._updateStorage=function(){
	try
	{
		if(typeof this.__storage.logicalnot != 'undefined' && this._getLogic()){
			this.__storage.logicalnot=this._getLogic().not;
		}
		if(typeof this.__storage.operatorand != 'undefined' && this._getLogic()){
			this.__storage.operatorand=(this._getLogic().and?true:false);
		}

		if(this.__type=='condition'){
			// conditions
			switch(this.__name){
				case 'priority':
					this.__storage.priority=this.dropdown_message_priority._value();
				break;
				case 'from':
				case 'to':
				case 'subject':
				case 'cc':
				case 'replyto':
				case 'date':
				case 'body':
				case 'customheader':
				case 'anyheader':
				case 'attachname':
				case 'sender':
				case 'recipient':
				case 'remoteip':
				case 'rdns':
				case 'dnsbl':
				case 'name':
					if(this.checkbox_match_case){this._setValue('matchcase',this.checkbox_match_case._checked());}
					if(this.dropdown_string_condition_function){this._setValue('matchfunction',this.dropdown_string_condition_function._value());}
					if(this.input_string_condition_string){this._setValue('matchvalue',this.input_string_condition_string._value());}
					if(this.checkbox_whole_word){this._setValue('matchwholewordsonly',this.checkbox_whole_word._checked());}
					if(this.checkbox_parse_xml){this._setValue('parsexml',this.checkbox_parse_xml._value());}
					//this.__storage.multipleitemsmatch=
					//this.__storage.notmatch=
				break;
				case 'size':
					if(this.input_message_size_than._value()==''){
						this.input_message_size_than._value(0);
					}
					var size=Math.round(parseFloat(this.input_message_size_than._value().replace(',','.'))*Math.pow(1024,parseInt(this.dropdown_message_size_than._value())+1));
					this._setValue('size',size);
					this._setValue('comparetype',parseInt(this.dropdown_message_size._value()));
				break;
				case 'senderrecipient':
					this._setValue('recipientsender',(this.radio_sender._checked()?0:1));
					this._setValue('remotelocal',(this.radio_local._checked()?1:0));
					this._setValue('recipientcondition',(this.radio_ignore._checked()?0:(this.radio_user_exists._checked()?1:2)));
					this._setValue('account',this.input_member_of._value());
				break;
				case 'spamscore':
					if(this.input_spam_score_than._value()==''){
						this.input_spam_score_than._value(0);
					}
					this._setValue('spamscore',this.input_spam_score_than._value().replace(',','.'));
					this._setValue('comparetype',parseInt(this.dropdown_spam_score._value()));
				break;
				case 'time':
					this._setValue('betweendates',this.toggle_between_dates._checked());
					this._setValue('betweentimes',this.toggle_between_times._checked());
					this._setValue('friday',this.checkbox_friday._checked());
					this._setValue('fromdate',(this.input_date_from._getDate()?this.input_date_from._getDate().day+'/'+this.input_date_from._getDate().month+'/'+this.input_date_from._getDate().year:0));
					this._setValue('fromtime',this.input_time_from._value());
					this._setValue('monday',this.checkbox_monday._checked());
					this._setValue('saturday',this.checkbox_saturday._checked());
					this._setValue('sunday',this.checkbox_sunday._checked());
					this._setValue('thursday',this.checkbox_thursday._checked());
					this._setValue('todate',(this.input_date_to._getDate()?this.input_date_to._getDate().day+'/'+this.input_date_to._getDate().month+'/'+this.input_date_to._getDate().year:0));
					this._setValue('totime',this.input_time_to._value());
					this._setValue('tuesday',this.checkbox_tuesday._checked());
					this._setValue('wednesday',this.checkbox_wednesday._checked());
					this._setValue('weekdays',this.toggle_weekdays._checked());
				break;
				case 'directmessage':
					this._setValue('userisonlyrecipient', this.checkbox_userisonlyrecipient._checked());
					this._setValue('checkuserinto', this.checkbox_checkuserinto._checked());
					this._setValue('checkuserincc', this.checkbox_checkuserincc._checked());
					this._setValue('checkuserinbcc', this.checkbox_checkuserinbcc._checked());
				break;
			}

		}else{
			// actions
			switch(this.__name){
				case 'messageaction':
					var radio=['accept','delete','reject','spam','quarantine'];
					for(var i=0; i<radio.length; i++){
						if(this['radio_'+radio[i]]._checked()){
							this._setValue('messageactiontype',i);
						}
					}
				break;
				case 'priority':
					this._setValue('priority',this.dropdown_message_priority._value());
				break;
				case 'forward':
					this._setValue('email',this.input_email_address._value())
					this._setValue('forwardasattachment',this.forward_as_attachment._checked())
				break;
				case 'movefolder':
					this._setValue('folder',this.input_move_to_folder._value());
				break;
				case 'copyfolder':
					this._setValue('folder',this.input_copy_to_folder._value());
				break;
				case 'flags':
					this._setValue('flagged',this.checkbox_flagged._checked());
					this._setValue('junk',this.checkbox_junk._checked());
					this._setValue('notjunk',this.checkbox_non_junk._checked());
					this._setValue('seen',this.checkbox_seen._checked());
					this._setValue('label1',this.checkbox_label_1._checked());
					this._setValue('label2',this.checkbox_label_2._checked());
					this._setValue('label3',this.checkbox_label_3._checked());
					this._setValue('label4',this.checkbox_label_4._checked());
					this._setValue('label5',this.checkbox_label_5._checked());
					this._setValue('label6',this.checkbox_label_6._checked());
					this._setValue('customflags',this.input_custom_flags._value());
				break;
			}

		}
	}
	catch(e)
	{
		log.error(['rulecard-updatestorage',e]);
	}

	return this.__storage;
}
