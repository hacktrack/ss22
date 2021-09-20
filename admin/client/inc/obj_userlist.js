function obj_userlist(){};
var _me = obj_userlist.prototype;
/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function(s){
	var me = this;
	storage.library('wm_domain');
	storage.library('wm_user');
	storage.library('obj_accountpicker');

	me.page=0;
	me.max_count=0;
	me.loading=false;

	me.accounttypes={
		'-':getLang('accountdetail::all_types'),
		'*0':getLang('userlist::user'),
		'*1':getLang('userlist::mailing_list'),
		//'*2':getLang('userlist::executable'),
		//'*3':getLang('userlist::notification'),
		//'*4':getLang('userlist::static_route'),
		//'*5':getLang('userlist::catalog'),
		//'*6':getLang('userlist::list_server'),
		'*7':getLang('userlist::group'),
		'*8':getLang('userlist::resource')
	};

	me.admintypes={
		'0':getLang('userlist::user'),
		'1':getLang('userlist::admin'),
		'2':getLang('userlist::domain_admin'),
		'3':getLang('userlist::webadmin')
	}

	if(!gui.frm_main.main.actions){
		gui.frm_main.main._cleanHeadingButtonsAnchor();
		gui.frm_main.main._setAlternativeButtons(function(box,target_anchor){
			if(!box._alternativeButtons){
				box._alternativeButtons=[];
			}
			var actionobject = box._create('actions','obj_actionselect',target_anchor);
			actionobject._value('generic::select_action');
			if(target_anchor=='heading_buttons_mobile'){actionobject._addcss('full',true);}

			var options = [];
			if(location.parsed_query.tab_management!="guestaccounts") {
				options.push({
					name:'group',
					icon:false,
					onclick:function(){
						me._groupSelectedAccounts();
						return false;
					},
					value:'accountdetail::add_to_group'
				},{
					name:'move',
					icon:false,
					onclick:function(){
						me._showMoveDialog();
						return false;
					},
					value:'accountdetail::move'
				});

			}
			options.push({
				name:'delete',
				icon:false,
				onclick:function(){
					me._deleteSelectedAccounts();
					return false;
				},
				value:'accountdetail::delete'
			});
			actionobject._fill(options);

			actionobject._disabled(true);

			box._alternativeButtons.push(actionobject);
		});
	}
};

_me._onSearch=function(string){
	dataSet.add('accountlist-filter',['search-'+location.parsed_query.domain],string);
	//log.log(['accountlist-onsearch',string,dataSet.get('accountlist-filter',['search'])]);
	this.list._empty();
	this.list._load();
}

_me._load = function(settings)
{
	var me=this;

	/** activate search icon, assign on search callback */
	gui.frm_main._initSearch(function (string) {
		me._onSearch(string);
	});

	this._draw('obj_userlist' + (settings && settings.subTemplate?"_" + settings.subTemplate:""), '', {items:{}});

	if(settings){
		if(settings.domain){location.parsed_query.domain=settings.domain;}
	}

	// open dns info
	if(location.parsed_query.showdomaininfo){
		me._parent.domaindetail._DNSValidation();
	}
	//

	if(this.list.dropdown_userlist_filter){
		this.list.dropdown_userlist_filter._fill(me.accounttypes);
		this.list.dropdown_userlist_filter._value('0');	// set default filter type (user)

		this.list.dropdown_userlist_filter._onchange=function(e){
			var val=this._value();
			dataSet.add('accountlist-filter',['type-'+location.parsed_query.domain],val);
			me.list._emptySelectedList();
			me.list._empty();
			me.list._load();
		};
	}

	this.list._onchange=function(e){
		try
		{
			//handle select all
			if(e && e.text=='select-all'){
				this._selectAll(e.type,true,true);
			}
			//

			if(me.list._getSelectedCount()==0){
				for(var i=0; i<gui.frm_main.main._alternativeButtons.length; i++)
				{
					gui.frm_main.main._alternativeButtons[i]._text(getLang("generic::select_action"));
					gui.frm_main.main._alternativeButtons[i]._disabled(true);
				}
			}else{
				for(var i=0; i<gui.frm_main.main._alternativeButtons.length; i++)
				{
					gui.frm_main.main._alternativeButtons[i]._text(getLang("generic::select_action")+" ("+me.list._getSelectedCount()+")");
					gui.frm_main.main._alternativeButtons[i]._disabled(false);
				}
			}

			/* prevent default action */
			if(e && e.text=='select-all'){
				return false;
			}
			//
		}
		catch(err){
			log.error(['userlist-onchange',e,err]);
		}
	}

	// handle saved filter
	var filter_type=dataSet.get('accountlist-filter',['type-'+location.parsed_query.domain]);
	if(typeof filter_type != 'undefined'){
		if(me.list.dropdown_userlist_filter){
			me.list.dropdown_userlist_filter._value(filter_type,true);
		}
	}
	var filter_search=dataSet.get('accountlist-filter',['search-'+location.parsed_query.domain]);
	if(filter_search){
		log.log(['accountlist-constructor',filter_search]);
		gui.frm_main._setSearchString(filter_search);
	}

	//
	var domain = new Domain(location.parsed_query.domain);
	var list = domain.getAccountList({type: Account.USER});

	this.list._init('obj_userlist',false,function(linesPerPage,page,callback){

		var search = gui.frm_main._getSearch(true);
		list.filter(search);

		var type = me.list.dropdown_userlist_filter;
		if(!type) {
			type = 0;
		} else if (type._value()!='-') {
			type = type._value();
		} else {
			type = undefined;
		}

		list.type(type);
		list.load(function(items){

			gui.frm_main._setSearchResults(items.total);
			me.list._setMax(items.total);
			gui.frm_main.main.left_menu._setItemValue('userlist',getLang('domaindetail::users')+' ('+items.total+')');

			for(var i=0, l=items.length; i<l; i++) {
				var size = +items[i].quota.mailboxsize.value;
				var max = +items[i].quota.mailboxquota.value;
				var item = {
					id: items[i].email.value,
					name: items[i].name.value,
					unpunied: punycode.ToUnicode(items[i].email.value),
					image: items[i].image ? 'data:' + items[i].image.contenttype.value + ';base64,' + items[i].image.base64data.value : '',
					type: items[i].accounttype.value,
					type_str: me.accounttypes['*'+items[i].accounttype.value],
					hasSubtype: items[i].accounttype.value==0,
					subtype: items[i].admintype.value || 0,
					subtype_str: me.admintypes[items[i].admintype.value || 0],
					size: relativeByteSize(size,2,1),
					disabled: +((items[i].accountstate || {}).state || {}).value
				};
				if(max) {
					item.isQuota = true;
					item.quota = (size/max*100).toFixed(2);
					item.quotaSize = relativeByteSize(max,2,1);
				}
				me.list._drawItem(item);
			}

			callback && callback();

		},{chunk: linesPerPage});
	});

	this.list._onempty = function(){
		list.reset();
	};

	this._main.onclick=function(e){

		var e = e || window.event,
		elm = e.target || e.srcElement;

		if(elm)
		{
			var ul=Is.Child(elm,'UL',this);
			if(ul && ul.getAttribute('hash')){
				location.hash=ul.getAttribute('hash');
			}
		}
	};
}

_me._groupSelectedAccounts=function(){
	var me=this;

	gui.accountpicker(function(items,type){
		// what to do on accounts picked?
		var groups=[];
		for(var i=0; i<items.length; i++){
			groups.push(items[i].id);
		}

		var accounts=[];
		var selected=me.list._getSelectedList();

		if(typeof selected == 'string' && selected=='all')
		{
			// if selected all is active
			log.info('All is selected');

			var namemask=gui.frm_main._getSearch(true);
			var typemask=false;
			var type=0;
			if(me.list.dropdown_userlist_filter){
				type = me.list.dropdown_userlist_filter._value();
			}

			if(type!='-'){
				typemask=type;
			}

			com.user.addAllToGroup(groups,location.parsed_query.domain,{
				namemask:namemask,
				typemask:typemask
			},function(result){
				if(!result.Array.IQ[0].QUERY[0].RESULT || result.Array.IQ[0].QUERY[0].RESULT[0].VALUE==0){
					gui.message.error(getLang("error::save_unsuccessful"));
					if(result.Array.IQ[0].QUERY[0].ERROR){
						log.error('e:cannot_add_member_to_itself',result.Array.IQ[0].QUERY[0].ERROR);
					}
				}else{
					gui.message.toast(getLang("message::save_successfull"));
					me.list._emptySelectedList();
				}
			});
		}
		else
		{
			// if only some are selected
			for(var i=0; i<selected.length; i++){
				accounts.push(selected[i].id);
			}

			com.user.addToGroup(groups,accounts,function(result){
				if(!result.Array.IQ[0].QUERY[0].RESULT || result.Array.IQ[0].QUERY[0].RESULT[0].VALUE==0){
					gui.message.error(getLang("error::save_unsuccessful"));
					if(result.Array.IQ[0].QUERY[0].ERROR){
						log.error('e:cannot_add_member_to_itself',result.Array.IQ[0].QUERY[0].ERROR);
					}
				}else{
					gui.message.toast(getLang("message::save_successfull"));
					me.list._emptySelectedList();
				}
			});
		}
		//
	},{
		// some cool settings defining the accountPicker's behavior
		type:{force:true,value:7},
		disable_add_domain:true
	});
}

_me._showMoveDialog=function(){
	var me=this;

	gui.accountpicker(function(items,type){
		var domain = items[0].id;
		var selected = me.list._getSelectedList();

		var accounts = [];
		for(var i=0; i<selected.length; i++){
			accounts.push(selected[i].email || selected[i].id);
		}

		gui.message.warning(
			getLang("warning::move_selected_accounts", [selected.length, domain]),
			false,
			[
				{
					value:getLang("accountdetail::move"),
					onclick:function(closeCallback) {
						closeCallback();
						me._moveUser(domain, accounts);
					}
				},
				{
					value:getLang("generic::cancel"),
					type:'text borderless',
					onclick: function(closeCallback) {
						closeCallback();
						me._showMoveDialog();
					}
				}
			]
		);
	},{
		domainpicker: true,
		singledomain: true,
		disable_add_domain: true,
		exclude:{domains:[location.parsed_query.domain]}
	});
};

_me._moveUser=function(domain, accounts) {
	var me = this;

	com.domain.moveAccounts(domain,accounts,function(result){
		if(result.error) {
			gui.message.error(getLang("error::save_unsuccessful"));
		} else {
			gui.message.toast(getLang("message::save_successfull"));
			me.list._emptySelectedList();
			me.list._load();
		}
	});
};

_me._deleteSelectedAccounts=function(){
	var me = this;
	var num = this.list._getSelectedCount();
	var selected=me.list._getSelectedList();

	// check for deleting superior account
	var superior = false;
	var mytype = gui._globalInfo.admintype;
	for(var i in selected)
		if (mytype==USER_DOMAIN && selected[i].subtype==USER_ADMIN){
			superior = true;
			break;
		}

	if(superior || mytype==USER_USER) {
		gui.message.error(getLang('error::insufficient_rights'));
		return;
	}

	var prompt = gui.message.warning([getLang("warning::delete_selected_items", [num]), getLang('warning::operation_may_take_long_time')],false,[
		{
			value:getLang("generic::cancel"),
			method:'close'
		},
		{
			value:getLang("generic::delete"),
			onclick:function(closeCallback){
				prompt.main.btn_custom_0._disabled(true);
				prompt.main.btn_custom_1._disabled(true);

				if(typeof selected == 'string' && selected=='all')
				{
					// selected all active
					log.info('All is selected');
					filter={};

					var namemask=gui.frm_main._getSearch(true);
					var typemask=false;
					var type=0;
					if(me.list.dropdown_userlist_filter){
						type = me.list.dropdown_userlist_filter._value();
					}

					if(type!='-'){
						typemask=type;
					}

					filter.namemask=namemask;
					filter.typemask=typemask;

					com.domain.deleteAllAccounts(location.parsed_query.domain,filter,function(result){
						closeCallback();
						me.list._emptySelectedList();
						me.list._load();
					});
				}
				else
				{
					// only some are selected
					com.domain.deleteAccounts(location.parsed_query.domain,selected,function(result){
						closeCallback();
						me.list._emptySelectedList();
						me.list._load();
					},function(error){
						if(error=='account_permission'){error='insufficient_rights';}
						closeCallback();
						me.list._emptySelectedList();
						gui.message.error(getLang('error::'+error));
					});
				}
			},
			type:'text error'
		},
	]);
}
