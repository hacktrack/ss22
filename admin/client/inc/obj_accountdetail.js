_me = obj_accountdetail.prototype;
function obj_accountdetail(){};

/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function(s){
	var me = this;
	var parent=this._parent;
	this._boxInitialized=false;
	this._lastType=0;
	
	this._menuHashTemplate='#menu=/MENU/&account=/ACCOUNT/&type=/TYPE/';
};

_me.__onclick = function(e){
};

_me._getMenuDefinition=function(settings,callback){
	var me=this;
	var menu=[];
	var defaultTab='';
	
	var type = settings.type;
	
	if(this._isguestaccount){
		type="0g";
	}
	
	switch(type)
	{
		// group
		case "7":
			var defaultTab='groupinfo';
			var menu=[
				{
					isdefault:true,
					icon:false,
					name:'groupinfo',
					value:'accountdetail::info',
					callback:function(name){
						me._tabmenuCallback(name);
					}
				},
				{
					name:'grouplimits',
					icon: false,
					value:'accountdetail::limits',
					callback:function(name){
						me._tabmenuCallback(name);
					}
				},
				{
					icon:false,
					name:'groupmembers',
					value:'accountdetail::members',
					callback:function(name){
						me._tabmenuCallback(name);
					}
				}
			];
		break;
		// mailing list
		case "1":
			com.console.item(function(result){
				var defaultTab='mailinglistinfo';
				var menu=[
					{
						isdefault:true,
						icon:false,
						name:'mailinglistinfo',
						value:'accountdetail::info',
						callback:function(name){
							me._tabmenuCallback(name);
						}
					}
				];
				
				try
				{
					if(result.Array.IQ[0].QUERY[0].RESULT[0].ITEM[0].PROPERTYVAL[0].VAL[0].VALUE=='0'){
						menu.push({
							icon:false,
							name:'mailinglistmembers',
							value:'accountdetail::members',
							callback:function(name){
								me._tabmenuCallback(name);
							}
						});
					}
				}
				catch(e)
				{
					
				}
				callback(menu,defaultTab);
			}).account('m_sendalllists',location.parsed_query.account);
			return false;
		break;
		// resource
		case "8":
			var defaultTab='resourceinfo';
			var menu=[
				{
					isdefault:true,
					icon:'user',
					name:'resourceinfo',
					value:'accountdetail::info',
					callback:function(name){
						me._tabmenuCallback(name);
					}
				},
				{
					icon:'collaboration',
					name:'resourcemembers',
					value:'accountdetail::members',
					callback:function(name){
						me._tabmenuCallback(name);
					}
				},
				{
					name:'card',
					value:'accountdetail::card',
					callback:function(name){
						me._tabmenuCallback(name);
					}
				},
				{
					name:'rules',
					value:'accountdetail::rules',
					callback:function(name){
						me._tabmenuCallback(name);
					}
				}
			];
		break;
		// guest
		case '0g':
			defaultTab='info';
			menu=[
				{
					isdefault:true,
					name:'info',
					icon:'user',
					value:'accountdetail::info',
					callback:function(name){
						me._tabmenuCallback(name);
					}
				},
				{
					name:'card',
					value:'accountdetail::card',
					callback:function(name){
						me._tabmenuCallback(name);
					}
				}
			];
		break;
		// user
		default:
			defaultTab='info';
			menu=[
				{
					isdefault:true,
					name:'info',
					icon:'user',
					value:'accountdetail::info',
					callback:function(name){
						me._tabmenuCallback(name);
					}
				},
				{
					name:'card',
					value:'accountdetail::card',
					callback:function(name){
						me._tabmenuCallback(name);
					}
				},
				{
					name:'email',
					value:'accountdetail::email',
					callback:function(name){
						me._tabmenuCallback(name);
					}
				},
				{
					name:'limits',
					value:'accountdetail::limits',
					callback:function(name){
						me._tabmenuCallback(name);
					}
				},
				{
					name:'rules',
					value:'accountdetail::rules',
					callback:function(name){
						me._tabmenuCallback(name);
					}
				},
				{
					name:'mobile_devices',
					icon:'mobile',
					value:'accountdetail::mobile_devices',
					callback:function(name){
						me._tabmenuCallback(name);
					}
				}
			];
		break;
	}
	
	callback(menu,defaultTab);
}

_me._hash_handler = function(e,aData)
{
	var me=this;
	var parent=this._parent;
	log.log('Account detail should be loaded');
	
	
	
	try
	{
		if(!location.parsed_query.type){location.parsed_query.type=0;}
		
		if(this._isguestaccount === void 0){
			com.console.item(function(result){
				try
				{
					var items = result.Array.IQ[0].QUERY[0].RESULT[0].ITEM;
					var parsed = {};
					
					for(var i = 0; i < items.length; i++){
						var key = items[i].APIPROPERTY[0].PROPNAME[0].VALUE.toLowerCase();
						var val = (items[i].PROPERTYVAL[0].VAL[0] && items[i].PROPERTYVAL[0].VAL[0].VALUE?items[i].PROPERTYVAL[0].VAL[0].VALUE:void 0);
						parsed[key]=val;
					}
					
					if(parseInt(parsed['u_isguestaccount'])){
						me._isguestaccount = true;
					}else{
						me._isguestaccount = false;
					}
					
					if(parsed['u_mailbox']){
						me._heading=punycode.ToUnicode(parsed['u_mailbox']);
					}
					
					/** */
					me._getMenuDefinition({
						type:location.parsed_query.type
					},function(menuDefinition,defaultTab,callback){
						me._defaultTab=defaultTab;
						var accountdomain=location.parsed_query.account.split('@');
						accountdomain=accountdomain[accountdomain.length-1];
						
						gui.frm_main.main._init({
							name:'accountdetail_'+location.parsed_query.type,
							heading:{
								value:(me._heading?me._heading:punycode.ToUnicode(location.parsed_query.account)),
								back:{
									onclick:function(){
										if(me._isguestaccount){
											location.hash="menu=management&tab_management=guestaccounts";
										}else{
											location.hash="menu=domaindetail&domain="+encodeURIComponent(accountdomain);
										}
										
										return false;
									}
								}
							},
							menu:{
								hashTemplate:me._menuHashTemplate,
								items:menuDefinition
							}
						},function(oBox,oMenu){
							//oMenu.__hash_handler();
							if(callback){callback(oBox,oMenu);}
						});
					});
					/** */
					
				}
				catch(e)
				{
					log.error(["accountdetail-hashhandler",e]);
				}
			}).account(["u_isguestaccount","u_mailbox"],location.parsed_query.account);
		}
	}
	catch(e)
	{
		log.error([e,me]);
	}
}

_me._tabmenuCallback=function(name)
{
	var me=this;
	
	if(!name){name='';}
	log.info('tabmenucallback-accountdetail');
	log.info(['name',name]);

	var parent = this._parent;
	
	// remove heading button
	gui.frm_main.main._setHeadingButton();
	
	// defaults
	if(name==''){name=me._defaultTab;}
	//
	
	// clean content to be able to show the same tab for different account
	parent._clean('main_content');
	
	switch(name)
		{
			case '':
			case "info":
				if(!parent.accountinfo){
					parent._clean('main_content');
					parent._create('accountinfo','obj_accountinfo','main_content');
				}
				parent.accountinfo._load(location.parsed_query.account);
			break;
			case 'card':
				if(!parent.accountcard){
					parent._clean('main_content');
					parent._create('accountcard','obj_accountcard','main_content');
				}
				parent.accountcard._load(location.parsed_query.account);
			break;
			case 'limits':
				if(!parent.accountlimits){
					parent._clean('main_content');
					parent._create('accountlimits','obj_accountlimits','main_content');
				}
				
				com.console.global('c_accounts_global_domains_useuserlimits',V_TYPE_BOOLEAN,function(value,b,i,s){
					parent.accountlimits._load(location.parsed_query.account);
				});
			break;
			case 'grouplimits':
				if(!parent.grouplimits){
					parent._clean('main_content');
					parent._create('grouplimits','obj_grouplimits','main_content');
				}
				parent.grouplimits._load(location.parsed_query.account);
			break;
			case 'email':
				if(!parent.accountemail){
					parent._clean('main_content');
					parent._create('accountemail','obj_accountemail','main_content');
				}
				parent.accountemail._load(location.parsed_query.account);
			break;
			case 'rules':
				if(!parent.accountrules){
					parent._clean('main_content');
					parent._create('accountrules','obj_rules','main_content');
				}
				parent.accountrules._load(location.parsed_query.account);
			break;
			case 'mobile_devices':
				gui.frm_main._initSearch(function(string){
					parent.accountmobiledevices._onSearch(string);
				});
				if(!parent.accountmobiledevices){
					parent._clean('main_content');
					parent._create('accountmobiledevices','obj_accountmobiledevices','main_content');
				}
				parent.accountmobiledevices._load(location.parsed_query.account);
			break;
			case 'mailinglistinfo':
				if(!parent.mailinglistinfo){
					parent._clean('main_content');
					parent._create('mailinglistinfo','obj_mailinglistinfo','main_content');
				}
				parent.mailinglistinfo._load();
			break;
			case 'groupinfo':
				if(!parent.groupinfo){
					parent._clean('main_content');
					parent._create('groupinfo','obj_groupinfo','main_content');
				}
				parent.groupinfo._load();
			break;
			case 'resourceinfo':
				if(!parent.resourceinfo){
					parent._clean('main_content');
					parent._create('resourceinfo','obj_resourceinfo','main_content');
				}
				parent.resourceinfo._load();
			break;
			case 'groupmembers':
				if(!parent.groupmembers){
					parent._clean('main_content');
					parent._create('groupmembers','obj_groupmembers','main_content');
				}
				parent.groupmembers._load();
			break;
			case 'mailinglistmembers':
				if(!parent.mailinglistmembers){
					parent._clean('main_content');
					parent._create('mailinglistmembers','obj_mailinglistmembers','main_content');
				}
				parent.mailinglistmembers._load();
			break;
			case 'resourcemembers':
				if(!parent.resourcemembers){
					parent._clean('main_content');
					parent._create('resourcemembers','obj_resourcemembers','main_content');
				}
				parent.resourcemembers._load();
			break;
			default:
				me.__load_default_view(false,name);
			break;
		}
}

_me.__load_default_view = function(e,name)
{
	this._tabmenuCallback('');
}
