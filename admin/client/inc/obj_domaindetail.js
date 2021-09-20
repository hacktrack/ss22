_me = obj_domaindetail.prototype;
function obj_domaindetail(){};

/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function(s){
	var me = this;
	var parent=this._parent;
	
	this._leftMenu=[
		{
			isdefault:true,
			name:'userlist',
			icon:'user',
			value:'domaindetail::users',
			callback:function(name){
				me._tabmenuCallback(name);
			}
		},
		{
			name:'settings',
			value:'domaindetail::settings',
			callback:function(name){
				me._tabmenuCallback(name);
			}
		}
	];
	
	
	this._leftMenu.push({
		name:'limits',
		value:'domaindetail::limits',
		callback:function(name){
			me._tabmenuCallback(name);
		}
	});
	
	this._leftMenu.push({
		name:'rules',
		value:'domaindetail::rules',
		callback:function(name){
			me._tabmenuCallback(name);
		}
	});
	this._leftMenu.push({
		name:'mobile_devices',
		icon:'mobile',
		value:'domaindetail::mobile_devices',
		callback:function(name){
			me._tabmenuCallback(name);
		}
	});
	this._leftMenu.push({
		name:'whitelabeling',
		icon:'documents',
		value:'main::white_labeling',
		callback:function(name){
			me._tabmenuCallback(name);
		}
	});
		/*,
		{
			name:'activedirectory',
			icon:'folder',
			value:'domaindetail::active_directory',
			callback:function(name){
				me._tabmenuCallback(name);
			}
		}
		*/

	this._menuHashTemplate='#menu=/MENU/&domain=/DOMAIN/';
};

_me.__onclick = function(e){
	log.log('clicked',e);
};

_me._hash_handler = function(e,aData)
{
	try
	{
	
		var me=this;
		var parent=this._parent;

		gui.frm_main.main._setHeading(punycode.ToUnicode(decodeURIComponent(location.parsed_query.domain)));
		
		log.log('Domain detail should be loaded');
		log.log(e,aData);
		
		try
		{
			gui.frm_main.main._init({
				name:'domaindetail',
				heading:{
					value:punycode.ToUnicode(decodeURIComponent(location.parsed_query.domain)),
					back:{
						onclick:function(){
							gui._globalInfo.ignoreSingleDomain=true;	// do not redirect even if single domain
							location.hash='menu=management';
							return false;
						}
					}
				},
				menu:{
					hashTemplate:this._menuHashTemplate,
					items:this._leftMenu
				}
			});
		}
		catch(e)
		{
			log.error(e,me);
		}
	
	}
	catch(e){
		log.error(e);
	}
	
	//gui.frm_main.main._setHeading(location.parsed_query.domain);
}

_me._tabmenuCallback=function(name)
{
	try
	{
		// clean content to be able to show the same tab for different account
		this._parent._clean('main_content');
		
		switch(name)
		{
			case '':
			case "userlist":
				if(!gui.frm_main.main.userlist){
					log.log('Account list should be loaded');
					gui.frm_main.main._clean('main_content');
					gui.frm_main.main._create('userlist','obj_userlist','main_content');
				}
				gui.frm_main.main.userlist._load(decodeURIComponent(location.parsed_query.domain));
			break;
			case 'mobile_devices':
				gui.frm_main._initSearch(function(string){
					gui.frm_main.main.mobile_devices._onSearch(string);
				});
				if(!gui.frm_main.main.mobile_devices){
					log.log('mobile_devices should be loaded');
					gui.frm_main.main._clean('main_content');
					gui.frm_main.main._create('mobile_devices','obj_accountmobiledevices','main_content');
				}
				gui.frm_main.main.mobile_devices._load(decodeURIComponent(location.parsed_query.domain));
			break;
			case 'settings':
				if(!gui.frm_main.main.settings){
					log.log('settings should be loaded');
					gui.frm_main.main._clean('main_content');
					gui.frm_main.main._create('domainsettings','obj_domainsettings','main_content');
				}
				gui.frm_main.main.domainsettings._load(decodeURIComponent(location.parsed_query.domain));
			break;
			case 'limits':
				com.console.item(function(result){
					
					global._accounts_global_domains_usediskquota=false;
					global._accounts_global_domains_usedomainlimits=false;
					
					var d=result.Array.IQ[0].QUERY[0].RESULT[0].ITEM;
					for(var i=0; i<d.length; i++){
						var v=result.Array.IQ[0].QUERY[0].RESULT[0].ITEM[i].PROPERTYVAL[0];
						var n=result.Array.IQ[0].QUERY[0].RESULT[0].ITEM[i].APIPROPERTY[0];
						
						if(v.VAL && v.VAL[0] && v.VAL[0].VALUE){
							global[n.PROPNAME[0].VALUE.substr(1,n.PROPNAME[0].VALUE.length-1)]=(v.VAL[0].VALUE=='1'?true:false);
						}
					}
					
					if(!gui.frm_main.main.limits){
						log.log('limits should be loaded');
						gui.frm_main.main._clean('main_content');
						gui.frm_main.main._create('domainlimits','obj_domainlimits','main_content');
					}
					
					com.console.global('c_accounts_global_domains_useuserlimits',V_TYPE_BOOLEAN,function(value,b,i,s){
						gui.frm_main.main.domainlimits._load(decodeURIComponent(location.parsed_query.domain));
					});
					
				}).server(['c_accounts_global_domains_usediskquota','c_accounts_global_domains_usedomainlimits','c_accounts_global_domains_useexpiration']);
			break;
			case 'rules':
				if(!gui.frm_main.main.rules){
					log.log('rules should be loaded');
					gui.frm_main.main._clean('main_content');
					gui.frm_main.main._create('rules','obj_rules','main_content');
				}
				gui.frm_main.main.rules._load(decodeURIComponent(location.parsed_query.domain));
			break;
			case "whitelabeling":
				if(!gui.frm_main.whitelabeling){
					gui.frm_main.main._clean('main_content');
					gui.frm_main.main._create('whitelabeling','obj_whitelabeling','main_content');
				}
				gui.frm_main.main.whitelabeling._hash_handler();
			
			break;
			case 'activedirectory':
			break;
			default:
				this.__load_default_view(false,location);
			break;
		}
	}
	catch(e)
	{
		log.error(e);
	}
}

_me._DNSValidation=function(){
	var popup=gui._create('popup','obj_popup');
	popup._init({
		name:'dns_validation',
		heading:{
			value:getLang('domaindetail::dns_validation')
		},
		fixed:false,
		iwattr:{
			height:'full',
			width:'medium'
		},
		footer:'obj_domainsettings_dnsvalidation_footer',
		content:'obj_domainsettings_dnsvalidation'
	});

	popup.content._load(decodeURIComponent(location.parsed_query.domain),true);
}

_me._DKIM=function(){
	var popup=gui._create('popup','obj_popup');
	popup._init({
		name:'dkim',
		heading:{
			value:getLang('domaindetail::dkim')
		},
		fixed:false,
		iwattr:{
			height:'full',
			width:'medium'
		},
		footer:'obj_domainsettings_dkim_footer',
		content:'obj_domainsettings_dkim'
	});

	popup.content._load(decodeURIComponent(location.parsed_query.domain),true);
}

_me.__load_default_view = function(e,aData)
{
	// load userlist as default
	/*
	aData.parsed_query.menu='domaindetail';
	aData.parsed_query.tab='userlist';
	aData.parsed_query.forcedload=true;
*/
	log.info('Ready to load default view (userlist)');
	/*
	if(!this.userlist){
		this._create('userlist','obj_userlist','domaindetail_content');
	}
	*/
	this._hash_handler('');
	
	//
}