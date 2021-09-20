function obj_accountpicker(){};
var _me = obj_accountpicker.prototype;
/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function(s){
	var me = this;
	storage.library('wm_user');
	storage.library('wm_domain');

	this._initialized=false;
	this._domainsLoaded=false;
	this._working=false;
	this._selectedList=[];
	this._settings={};

	me.admintypes={
		'0':getLang('userlist::user'),
		'1':getLang('userlist::admin'),
		'2':getLang('userlist::domain_admin'),
		'3':getLang('userlist::webadmin')
	}

	me.accounttypes={
		'-':getLang('accountdetail::all_types'),
		'*0':getLang('userlist::user'),
		'*1':getLang('userlist::mailing_list'),
		'*2':getLang('userlist::executable'),
		'*3':getLang('userlist::notification'),
		'*4':getLang('userlist::static_route'),
		'*5':getLang('userlist::catalog'),
		'*6':getLang('userlist::list_server'),
		'*7':getLang('userlist::group'),
		'*8':getLang('userlist::resource')
	};

	me._domainTypes={
		'-':getLang('domainlist::all_types'),
		'*0':getLang('domainlist::standard'),
		'*2':getLang('domainlist::domain_alias'),
		'*3':getLang('domainlist::backup_domain'),
		'*4':getLang('domainlist::distributed_domain'),
		'*1':getLang('domainlist::etrn_atrn_queue')
	}
};

_me._openDomainlist=function(){
	var me=this;

	this._parent._setBackButton();
	this._parent._setHeading(getLang('accountpicker::domains'));

	try
	{
		this._parent._initSearch(function(string){
			try
			{
				dataSet.add('accountpicker-filter',['search'],string);
			}
			catch(e)
			{
				log.error(['accountpicker-opendomainlist',e]);
			}
			me.domainlist._load();
		});

		if(dataSet.get('accountpicker-filter',['search'])){
			log.log(['accountpicker-opendomainlist',dataSet.get('accountpicker-filter',['search'])]);
			this._parent._setSearchString(dataSet.get('accountpicker-filter',['search']));
		}
	}
	catch(e)
	{
		log.error(['accountpicker-opendomainlist',e]);
	}

	if(!me._settings || !me._settings.disable_add_domain){
		this._parent.btn_add_domain._show();
	}

	this._parent.btn_add_account._hide();
	this._getAnchor('userlist').setAttribute('is-hidden',1);
	this._getAnchor('domainlist').removeAttribute('is-hidden');

	if(!this.domainlist)
	{
		var domainlist=this._create('domainlist','obj_loadable','domainlist');

		if(me._settings.singledomain){
			domainlist._selectionCounter(false);
		}
		else{
			domainlist._selectionCounter(true);
		}

		domainlist._label('obj_accountpicker_domainlist_header');
		domainlist._value('obj_accountpicker_domainlist_item');

		// apply settings, hide checkboxes
		if(me._settings.singledomain){
			addcss(domainlist._main,'singledomain');
		}

		me._main.onclick=function(e){
			var e = e || window.event,
			elm = e.target || e.srcElement;

			if(elm){
				var li=Is.Child(elm,'LI',this);
				var domain=false;
				if(li && li.getAttribute('domain-id')){
					domain=li.getAttribute('domain-id');

					// apply settings
					if(me._settings.domainpicker){
						//log.log(['accountpicker-li',li.parentElement]);
						li.parentElement._objects[0]._checked(true);
						log.log(['accountpicker-click',me.domainlist._getSelectedList()]);
						if(me._callback){me._callback(me.domainlist._getSelectedList(),0);}
						me._parent._parent._close();
					}else{
						me._openUserlist(domain);
					}
				}
			}
		};

		this.domainlist._onchange=function(){
			if(this._getSelectedCount()>0){
				me._parent.btn_add_domain._disabled(false);
			}else{
				me._parent.btn_add_domain._disabled(true);
			}
		}

		this.domainlist._init('obj_accountpicker',false,function(linesPerPage,page,callback){

			try
			{
				var namemask=me._parent._getSearch();
				var typemask=false;
				//var type=me.list.dropdown_type_filter._value();
				/*
				if(type!='-'){
					typemask=type;
				}
				*/

				com.domain.list(linesPerPage,page,namemask,typemask,[function(aResponse){
					try
					{
						var info={
							count:(aResponse.Array.IQ[0].QUERY[0].RESULT[0].OVERALLCOUNT&&aResponse.Array.IQ[0].QUERY[0].RESULT[0].OVERALLCOUNT[0]&&aResponse.Array.IQ[0].QUERY[0].RESULT[0].OVERALLCOUNT[0].VALUE?aResponse.Array.IQ[0].QUERY[0].RESULT[0].OVERALLCOUNT[0].VALUE:'-')
						};

						if(info.count==0){return false;}

						if(aResponse.Array.IQ[0].QUERY[0].RESULT[0].ITEM)
						{
							for(var i=0; i<aResponse.Array.IQ[0].QUERY[0].RESULT[0].ITEM.length; i++){
								var itm = aResponse.Array.IQ[0].QUERY[0].RESULT[0].ITEM[i];
								var item={
									id:itm.NAME[0].VALUE,
									unpunied:punycode.ToUnicode(itm.NAME[0].VALUE),
									name:itm.NAME[0].VALUE,
									users:itm.ACCOUNTCOUNT[0].VALUE,
									description:(itm.DESC&&itm.DESC[0]&&itm.DESC[0].VALUE?itm.DESC[0].VALUE:''),
									type:(me._domainTypes['*'+itm.DOMAINTYPE[0].VALUE]?me._domainTypes['*'+itm.DOMAINTYPE[0].VALUE]:0)
								};

								log.log(['accountpicker-exclude.',me._settings]);
								if(me._settings.exclude && me._settings.exclude.domains){
									var exclude=false;
									for(var ex=0; ex<me._settings.exclude.domains.length; ex++){
										if(me._settings.exclude.domains[ex]==item.id){
											exclude=true;
										}
										log.log(['accountpicker-exclude',item.id,exclude]);
									}
									if(!exclude){
										var line=me.domainlist._drawItem(item);
									}
								}
								else{
									var line=me.domainlist._drawItem(item);
								}
							}
						}

						me.domainlist._setMax(info.count);
						//gui.frm_main.main._setHeading(getLang('domainlist::domain_list')+" ("+info.count+")");
						if(callback){callback();}
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
		});
	}

	if(this.domainlist._getSelectedCount()>0){
		me._parent.btn_add_domain._disabled(false);
	}else{
		me._parent.btn_add_domain._disabled(true);
	}
}

_me._openUserlist=function(domain){
	var me=this;
	this._initialized=true;
	this._selectedDomain=domain;
	//this._selectionShown=false;

	this._parent._setHeading(punycode.ToUnicode(domain));

	this._parent._setBackButton(function(){
		me._openDomainlist();
	});
	this._parent._initSearch(function(string){
		me.userlist._load();
	});

	this._parent.btn_add_domain._hide();
	this._parent.btn_add_account._show();
	this._getAnchor('domainlist').setAttribute('is-hidden',1);
	this._getAnchor('userlist').removeAttribute('is-hidden');

	log.log(["accountpicker-openuserlist",domain]);

	if(!this.userlist)
	{
		var userlist=this._create('userlist','obj_loadable','userlist');
		userlist._selectionCounter(true);
		userlist._label('obj_accountpicker_userlist_header');
		userlist._value('obj_accountpicker_userlist_item');

		this.userlist.dropdown_userlist_filter._fill(this.accounttypes);

		this.userlist.dropdown_userlist_filter._onchange=function(){
			me.userlist._load();
		}

		this.userlist._onchange=function(){
			if(this._getSelectedCount()>0){
				me._parent.btn_add_account._disabled(false);
			}else{
				me._parent.btn_add_account._disabled(true);
			}
		}

		this.userlist._init('obj_accountpicker',false,function(linesPerPage,page,callback){

			if(me._selectionShown){return false;}

			var namemask=me._parent._getSearch();
			var typemask=false;
			//var domain=me.dropdown_domain._value();

			if(me.userlist.dropdown_userlist_filter._value()!='-'){
				typemask=me.userlist.dropdown_userlist_filter._value();
			}

			if(!me._working){
				me._working=true;
				com.user.list(me._selectedDomain,linesPerPage,page,namemask,typemask,[function(aResponse){
					try
					{
						var items=[];
						me._working=false;

						if(aResponse.Array.IQ[0].QUERY[0].RESULT[0].OVERALLCOUNT[0].VALUE)
						{
							max=parseInt(aResponse.Array.IQ[0].QUERY[0].RESULT[0].OVERALLCOUNT[0].VALUE);
							me.userlist._setMax(max);
							//gui.frm_main.main.left_menu._setItemValue('userlist',getLang('domaindetail::users')+' ('+max+')');
						}

						if(aResponse.Array.IQ[0].QUERY[0].RESULT[0].ITEM)
						{
							for(var i=0; i<aResponse.Array.IQ[0].QUERY[0].RESULT[0].ITEM.length; i++){

								var itm=aResponse.Array.IQ[0].QUERY[0].RESULT[0].ITEM[i];

								var isQuota=false;
								var quota_size='0 B';
								var quota=0;
								var size='0 B';
								if(itm.QUOTA[0].MAILBOXSIZE[0].VALUE && itm.QUOTA[0].MAILBOXQUOTA[0].VALUE)
								{
									var mailboxsize=parseInt(itm.QUOTA[0].MAILBOXSIZE[0].VALUE)*1024;
									var mailboxquota=parseInt(itm.QUOTA[0].MAILBOXQUOTA[0].VALUE)*1024;

									size=helper.bytes2hr(mailboxsize);

									if(mailboxquota>0)
									{
										quota_size=helper.bytes2hr(mailboxquota);
										isQuota=true;
										quota=Math.round((mailboxsize/mailboxquota)*10000)/100;
										log.log(itm,quota);
									}
								}

								var accounttype_str='';
								var accounttype=0;
								var admintype=0;
								var admintype_str='';
								if(itm.ACCOUNTTYPE[0].VALUE){
									accounttype_str=me.accounttypes['*'+itm.ACCOUNTTYPE[0].VALUE];
									accounttype=itm.ACCOUNTTYPE[0].VALUE;

									if(accounttype=='0'){
										admintype_str=me.admintypes[itm.ADMINTYPE[0].VALUE];
										admintype=itm.ADMINTYPE[0].VALUE;
									}

								}

								var item={
									id:itm.EMAIL[0].VALUE,
									unpunied:punycode.ToUnicode(itm.EMAIL[0].VALUE),
									num:i,
									type:accounttype,
									type_str:accounttype_str,
									hasSubtype:(accounttype=='0'),
									subtype:admintype,
									subtype_str:admintype_str,
									isQuota:isQuota,
									quota:quota,
									quotaSize:quota_size,
									size:size,
									name:itm.NAME[0].VALUE,
									email:itm.EMAIL[0].VALUE,
									image:(itm.IMAGE&&itm.IMAGE[0]?'data:'+itm.IMAGE[0].CONTENTTYPE[0].VALUE+';base64,'+itm.IMAGE[0].BASE64DATA[0].VALUE:'')
								};

								log.log(['accountpicker-exclude.',me._settings]);
								if(me._settings.exclude && me._settings.exclude.accounts){
									var exclude=false;
									for(var ex=0; ex<me._settings.exclude.accounts.length; ex++){
										if(me._settings.exclude.accounts[ex]==item.id){
											exclude=true;
										}
										log.log(['accountpicker-exclude',item.id,exclude]);
									}
									if(!exclude){
										var line=me.userlist._drawItem(item);
									}
								}else{
									var line=me.userlist._drawItem(item);
								}

								if(line){
									line.onclick=function(line){
										return function(){
											line._objects[0]._checked(!line._objects[0]._checked());
											return false;
										}
									}(line);
								}
							}
						}
						if(callback){callback();}
					}
					catch(e)
					{
						me._working=false;
						log.error(e);
					}
				}]);
			}
		});
	}
	else
	{
		this.userlist._load();
	}

	if(this.userlist._getSelectedCount()>0){
		me._parent.btn_add_account._disabled(false);
	}else{
		me._parent.btn_add_account._disabled(true);
	}
}

_me._init = function(callback,settings)
{
	var that=this;
	var me=this;
	me._callback=callback;

	if(settings){this._settings=settings;}

	that._draw('obj_accountpicker', '', {items:{}});

	dataSet.add('accountpicker-filter',['search'],'');

	// add external
	this._parent.btn_add_external._hide();
	this._parent.btn_add_external._onclick=function(){
		var popup=gui._create('popup','obj_popup');
			popup._init({
				fixed:false,
				iwattr:{
					height:'auto',
					width:'medium'
				},
				name:'header',
				heading:{
					value:getLang("accountpicker::add_external_members")
				},
				footer:'default'
			});

			var optional={name:me.__name}
				optional[me.__name]=true;
			popup.main._draw('obj_consoledialog_longstring','main_content',optional);

			popup.main.btn_save._value("generic::add");
			popup.main.btn_save._onclick=function(){
				var content=popup.main.textarea._value().replace(/;/g,"\n").replace(/\r\n/g,"\n").replace(/\r/g,"\n").split("\n");
				for(var i=0; i<content.length; i++){
					if(helper.trim(content[i])!='')
					{
						me.userlist._selectedList.push({
							id:helper.trim(content[i]),
							email:helper.trim(content[i]),
							name:'',
							type:'external',
							type_str:getLang('userlist::external'),
							unpunied:punycode.ToUnicode(helper.trim(content[i]))
						});
					}
				}
				me.userlist._selectionInfoRefresh();
				me.userlist._onchange();
				popup._close();
			}
	}
	//

	// add account
	this._parent.btn_add_account._onclick=function(){
		if(callback){callback(me.userlist._getSelectedList(),1);}
		me._parent._parent._close();
	}
	//

	// add domain
	this._parent.btn_add_domain._onclick=function(){
		if(callback){callback(me.domainlist._getSelectedList(),0);}
		me._parent._parent._close();
	}
	//

	// apply settings

	if(me._settings.domainpicker){
		// start picker by opening domainslist
		this._openDomainlist();
		if(me._settings.singledomain){
			me._parent.btn_add_domain._hide();
		}
		this._initComponents();
	}else{
		// start picker by opening active domain's accountlist
		var user = new Account(location.parsed_query.account);
		user.getPropertySet(['U_MasterDomain'], function(result){
			me._openUserlist((result.U_MasterDomain && result.U_MasterDomain.toString()) || gui._activeDomain);
			me._initComponents();
		});
	}
}

_me._initComponents = function() {
	if(this._settings && this._settings.allow_external_accounts){
		this._parent.btn_add_external._show();
	}

	if(this._settings && this._settings.disable_add_domain){
		this._parent.btn_add_domain._hide();
	}

	if(this._settings.type && this._settings.type.value){
		this.userlist.dropdown_userlist_filter._value(this._settings.type.value);
	}

	if(this._settings.type && this._settings.type.force){
		this.userlist.dropdown_userlist_filter._disabled(true);
	}

	if(this._settings.type && this._settings.type.allowed){
		if(typeof this._settings.type.allowed!='object'){
			this._settings.type.allowed=[this._settings.type.allowed];
		}
		var allowed={};
		for(var key in this.accounttypes){
			for(var i=0; i<this._settings.type.allowed.length; i++){
				if(key.replace('*','')==this._settings.type.allowed[i].toString()){
					allowed[key]=this.accounttypes[key];
				}
			}
		}
		this.userlist.dropdown_userlist_filter._fill(allowed);
	}
	if(this._settings.type && this._settings.type.value){
		this.userlist.dropdown_userlist_filter._value(this._settings.type.value);
	}
	if(this._settings.type && typeof this._settings.type.force != 'undefined'){
		this.userlist.dropdown_userlist_filter._disabled(this._settings.type.force);
	}
}

/////////////

gui.accountpicker=function(callback,settings){
	var popup=gui._create('popup','obj_popup');
	popup._init({
		name:'accountpicker',
		fixed:false,
		iwattr:{
			height:'full',
			width:'medium'
		},
		heading:{
			value:getLang('accountdetail::accountpicker')
		},
		footer:'obj_accountpicker_footer',
		content:'obj_accountpicker'
	});

	popup.content._init(callback,settings);
}
