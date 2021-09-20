_me = obj_domainlist.prototype;
function obj_domainlist(){};

/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function(s){
	var me = this;

	me.page=0;
	me.max_count=0;
	me.loading=false;

	storage.library('wm_domain');

	me._domainTypes={
		'-':getLang('domainlist::all_types'),
		'*0':getLang('domainlist::standard'),
		'*2':getLang('domainlist::domain_alias'),
		'*3':getLang('domainlist::backup_domain'),
		'*4':getLang('domainlist::distributed_domain'),
		'*1':getLang('domainlist::etrn_atrn_queue')
	}
};

_me.__onclick = function(e){
	log.log('clicked',e);
};

_me._onSearch=function(string){
	dataSet.add('domainlist-filter',['search'],string);
	this.list._empty();
	gui.frm_main._setSearchResults(0);
	this.list._load();
}

_me._load = function(e,aData){
	this._hash_handler(e,aData);
}

_me._hash_handler = function(e,aData)
{
	var that=this;
	var me=this;
	var parent=this._parent;
	
	log.log('Domain list should be loaded');
	log.log(e,aData);
	
	/** activate search icon, assign on search callback */
	gui.frm_main._initSearch(function (string) {
		me._onSearch(string);
	});
	
	me._draw('obj_domainlist', '', {}/*{items:items,info:info}*/);
	
	me.list.dropdown_type_filter._onchange=function(){
		dataSet.add('domainlist-filter',['type'],this._value());
		me.list._empty();
		me.list._load();
	}
	me.list.dropdown_type_filter._fill(me._domainTypes);
	
	me._main.onclick=function(e){
		var e = e || window.event,
		elm = e.target || e.srcElement;

		if(elm){
			var ul=Is.Child(elm,'UL',this);
			if(ul && ul.getAttribute('hash')){
				location.hash=ul.getAttribute('hash');
			}
		}
	};
	
	// handle saved filter
	var filter_type=dataSet.get('domainlist-filter',['type']);
	if(typeof filter_type != 'undefined'){
		me.list.dropdown_type_filter._value(filter_type,true);
	}
	if(dataSet.get('domainlist-filter',['search'])){
		log.log(['domainlist-constructor',dataSet.get('domainlist-filter',['search'])]);
		gui.frm_main._setSearchString(dataSet.get('domainlist-filter',['search']));
	}
	//
	
	this.list._init('obj_domainlist',false,function(linesPerPage,page,callback){
		
		try
		{
			var namemask=gui.frm_main._getSearch();
			var typemask=false;
			var type=me.list.dropdown_type_filter._value();
			
			if(type!='-'){
				typemask=type;
			}
			
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
								unpunied:punycode.ToUnicode(itm.NAME[0].VALUE),
								name:itm.NAME[0].VALUE,
								urlencoded:encodeURIComponent(itm.NAME[0].VALUE),
								users:itm.ACCOUNTCOUNT[0].VALUE,
								description:(itm.DESC&&itm.DESC[0]&&itm.DESC[0].VALUE?itm.DESC[0].VALUE:''),
								type:(me._domainTypes['*'+itm.DOMAINTYPE[0].VALUE]?me._domainTypes['*'+itm.DOMAINTYPE[0].VALUE]:0),
								deletable: itm.ACCOUNTCOUNT[0].VALUE==0
							};
							var del = me.list._drawItem(item);

							// Activate delete button if present
							if(del = del.getElementsByClassName('icon-delete-circle')[0]) {
								del.firstChild.onclick = (function(domain) {
									return function(e){
										gui.message.warning(getLang("warning::delete_domain",[domain]),false,[
											{
												value:getLang("generic::cancel"),
												method:'close'
											},
											{
												value:getLang("generic::delete"),
												onclick:function(closeCallback){
													com.domain.deleteDomain(domain,function(result){
														closeCallback();
														if(result) {
															me.list._load();
														} else {
															gui.message.error(getLang('error::domain_delete_failed'));
														}
													});
												},
												type:'text error'
											},
										]);
									}
								}(item.name));
							}

							// if logged in as domain admin with just one domain, open that domain
							if(info.count==1 && gui._globalInfo.admintype==USER_DOMAIN && !gui._globalInfo.ignoreSingleDomain){
								location.hash='#menu=domaindetail&domain='+encodeURIComponent(item.name);
							}
						}
					}

					gui.frm_main._setSearchResults(info.count);
					me.list._setMax(info.count);
					
					gui.frm_main.main.left_menu._setItemValue('domainlist',getLang('management::domainlist')+' ('+info.count+')');
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
