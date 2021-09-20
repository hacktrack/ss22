function obj_accountmobiledevices(){};
var _me = obj_accountmobiledevices.prototype;
/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function(s){
	var me = this;
	storage.library('wm_user');
	storage.library('wm_device');

	me._lastCount=0;
	me._allCount=0;
	me._lastAccount=false;

	gui.frm_main.main._setHeadingButton();

	this._statusStrings={
		'-':getLang('mobile_devices::all_status'),
		'*1':getLang('mobile_devices::allowed'),
		'*2':getLang('mobile_devices::blocked'),
		'*3':getLang('mobile_devices::quarantine')
	};

	this._syncPeriods={
		'*0':getLang('mobile_devices::all_sync'),
		'*24':getLang('mobile_devices::last_24_hours'),
		'*168':getLang('mobile_devices::last_7_days'),
		'*672':getLang('mobile_devices::last_4_weeks')
	};

	if(!gui.frm_main.main.actions){
		gui.frm_main.main._cleanHeadingButtonsAnchor();
		gui.frm_main.main._setAlternativeButtons(function(box,target_anchor){
			if(!box._alternativeButtons){
				box._alternativeButtons=[];
			}
			var actionobject = box._create('actions','obj_actionselect',target_anchor);
			actionobject._value('generic::select_action');
			if(target_anchor=='heading_buttons_mobile'){actionobject._addcss('full',true);}
			actionobject._fill([
				{
					name:'allow',
					icon:false,
					onclick:function(){
						me._allowSelectedDevices();
						return false;
					},
					value:'mobile_devices::allow'
				},
				{
					name:'block',
					icon:false,
					onclick:function(){
						me._blockSelectedDevices();
						return false;
					},
					value:'mobile_devices::block'
				},
				{
					name:'delete',
					icon:false,
					onclick:function(){
						me._deleteSelectedDevices();
						return false;
					},
					value:'mobile_devices::delete'
				}
			]);
			actionobject._disabled(true);
			box._alternativeButtons.push(actionobject);
		});
	}

	var filter_search=dataSet.get('devicelist-filter',['search-'+(location.parsed_query.account?location.parsed_query.account:location.parsed_query.domain)]);
	if(filter_search){
		gui.frm_main._setSearchString(filter_search);
	}

};

_me._onSearch=function(string){
	try
	{
		dataSet.add('devicelist-filter',['search-'+(location.parsed_query.account?location.parsed_query.account:location.parsed_query.domain)],string);
		this.resetListVariables();
		gui.frm_main._setSearchResults(0);
		this.list._load();
	}
	catch(e)
	{
		log.error(['accountmobiledevices-onsearch',e]);
	}
}

_me.resetListVariables=function(){
	this._lastCount=0;
	this._allCount=0;
	this._lastAccount=false;
}

_me._load = function(domain)
{
	var me=this;

	me._draw('obj_accountmobiledevices', '', {items:{}});

	this.list.dropdown_last_sync_filter._onchange=function(){
		dataSet.add('devicelist-filter',['sync-'+(location.parsed_query.account?location.parsed_query.account:location.parsed_query.domain)],this._value());
		me.resetListVariables();
		me.list._load();
	};
	this.list.dropdown_active_filter._onchange=function(){
		dataSet.add('devicelist-filter',['status-'+(location.parsed_query.account?location.parsed_query.account:location.parsed_query.domain)],this._value());
		me.resetListVariables();
		me.list._load();
	};

	this.list._onchange=function(e){
		//handle select all
		if(e && e.text=='select-all'){
			//this._emptySelectedList(true);
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

	this.list.dropdown_active_filter._fill(this._statusStrings);
	this.list.dropdown_last_sync_filter._fill(this._syncPeriods);

	this._main.onclick=function(e){
		var e = e || window.event,
		elm = e.target || e.srcElement;

		if(elm){
			var ul=Is.Child(elm,'UL',this);
			if(ul && ul.getAttribute('hash')){
				location.hash=helper.translateHash(ul.getAttribute('hash'),location.parsed_query);
			}
		}
	};

	var doit=function(callback){
		var account='';
		if(location.parsed_query.account){
			account=location.parsed_query.account;
		}else if(location.parsed_query.domain){
			account=location.parsed_query.domain;
		}

		// handle saved filter
		var filter_status=dataSet.get('devicelist-filter',['status-'+(location.parsed_query.account?location.parsed_query.account:location.parsed_query.domain)]);
		if(typeof filter_status != 'undefined'){
			me.list.dropdown_active_filter._value(filter_status,true);
		}

		var filter_sync=dataSet.get('devicelist-filter',['sync-'+(location.parsed_query.account?location.parsed_query.account:location.parsed_query.domain)]);
		if(typeof filter_sync != 'undefined'){
			me.list.dropdown_last_sync_filter._value(filter_sync,true);
		}
		//

		me.list._init('obj_accountmobiledevices',false,function(linesPerPage,page,callback){

			var item={};

			var lastsyncmask=me.list.dropdown_last_sync_filter._value();
			var statusmask=me.list.dropdown_active_filter._value();
			var namemask=gui.frm_main._getSearch();
			if(statusmask=='-'){statusmask=false;}

			com.device.deviceList(account,linesPerPage,page,namemask,lastsyncmask,statusmask,function(result){
				log.log(['result',result]);
				var items=[];
				try
				{
					if(result.Array.IQ[0].QUERY[0].RESULT[0].ITEM){

						var max=parseInt(result.Array.IQ[0].QUERY[0].RESULT[0].OVERALLCOUNT[0].VALUE);
						me.list._setMax(max);

						items=result.Array.IQ[0].QUERY[0].RESULT[0].ITEM;
						for(var i=0; i<items.length; i++){

							var os='default';
							if(items[i].DEVICETYPE[0]){
								var str=items[i].DEVICETYPE[0].VALUE.toLowerCase();
								if(str.search(/(windows)|(wp)|(outlook)/)>=0){
									os="windows";
								}
								if(str.search(/android/)>=0){
									os="android";
								}
								if(str.search(/blackberry/)>=0){
									os="blackberry";
								}
								if(str.search(/(apple)|(ios)|(ipad)|(iphone)|(ipod)|(watch)/)>=0){
									os="ios";
								}
							}

							var item={
								parsed_query:location.parsed_query,
								deviceid:(items[i].DEVICEID[0]?items[i].DEVICEID[0].VALUE:false),
								account:(items[i].ACCOUNT[0]?items[i].ACCOUNT[0].VALUE:false),
								name:(items[i].NAME[0]?items[i].NAME[0].VALUE:'-'),
								type:(items[i].DEVICETYPE[0]?items[i].DEVICETYPE[0].VALUE:false),
								class:os,
								model:(items[i].MODEL[0]?items[i].MODEL[0].VALUE:false),
								lastsync:(items[i].LASTSYNC[0]?helper.date(getLang("datetime::php_date")+" "+getLang("datetime::php_time_minutes"),items[i].LASTSYNC[0].VALUE):false),
								status:(items[i].STATUS[0]?me._statusStrings['*'+parseInt(items[i].STATUS[0].VALUE)]:false),
								hash:md5((items[i].ACCOUNT[0]?items[i].ACCOUNT[0].VALUE:'')),
								isdevice:true
							}

							if(!me._lastAccount || me._lastAccount!=item.account){
								me.list._drawItem({
									isdevice:false,
									selectable:false,
									name:item.account,
									hash:md5(item.account)
								},function(elm,checked){
									var hash = elm._main.parentElement.getAttribute('group');
									[].slice.apply(me.list._getAnchor('body').getElementsByClassName(hash)).forEach(function(elm){
										var obj = eval(elm.querySelector('form.obj_checkbox').id);
										obj && !obj._destructed && obj._checked(checked);
									});
								});

								if(me._lastAccount){
									me.list._getAnchor('item_'+md5(me._lastAccount)+"_count").innerHTML="("+me._lastCount+")";
								}
								me._lastAccount=item.account;
								me._lastCount=0;
							}

							me._lastCount++;
							me._allCount++;
							me.list._drawItem(item);

							gui.frm_main._setSearchResults(max);

							if(max<=me._allCount){
								log.log(['last',max,linesPerPage,page,me._lastCount]);
								if(me._lastAccount){
									me.list._getAnchor('item_'+md5(me._lastAccount)+"_count").innerHTML="("+me._lastCount+")";
								}
							}
						}
					}
				}
				catch(e)
				{
					log.error(e);
				}
			});

			if(callback){callback();}
		});
	}

	me.timeout=setInterval(function(){
		if(storage.css_status('obj_accountmobiledevices'))
		{
			clearInterval(me.timeout);
			doit();
		}
	},100);
}

_me._allowSelectedDevices=function(){
	var me=this;
	var list=me.list._getSelectedList();
	var devices=[];
	var statuses=[];

	var selected=me.list._getSelectedList();
	if(typeof selected == 'string' && selected=='all')
	{
		// selected all active
		log.info('All is selected');

		var lastsyncmask=me.list.dropdown_last_sync_filter._value();
		var statusmask=me.list.dropdown_active_filter._value();
		var namemask=gui.frm_main._getSearch();
		if(statusmask=='-'){statusmask=false;}

		var who='';
		if(location.parsed_query.account){
			who=location.parsed_query.account;
		}else if(location.parsed_query.domain){
			who=location.parsed_query.domain;
		}

		// 1 means block
		com.device.setAllStatus(who,{
				lastsyncmask:lastsyncmask,
				statusmask:statusmask,
				namemask:namemask
			},0,function(result){
			if(result.Array.IQ[0].QUERY[0].RESULT[0].VALUE==0){
				gui.message.error(getLang("error::save_unsuccessful"));
			}else{
				gui.message.toast(getLang("message::save_successfull"));
				me.list._emptySelectedList();
				me.resetListVariables();
				me.list._load();
			}
		});
	}
	else
	{
		// some selected
		for(var i=0; i<list.length; i++){
			devices.push(list[i].deviceid);
			statuses.push(0); // 1 means block... not my fault
		}
		var statuscheck=0;
		var succeeded=true;
		com.device.setStatus(devices,statuses,function(result){
			if(statuscheck<devices.length)
			{
				statuscheck++;
				if(result.Array.IQ[0].QUERY[0].RESULT[0].VALUE==0){
					succeeded=false;
				}
			}

			if(statuscheck>=devices.length)
			{
				if(!succeeded){
					gui.message.error(getLang("error::save_unsuccessful"));
					me.list._emptySelectedList();
					me.resetListVariables();
					me.list._load();
				}else{
					gui.message.toast(getLang("message::save_successfull"));
					me.list._emptySelectedList();
					me.resetListVariables();
					me.list._load();
				}
			}
		});
	}
}

_me._blockSelectedDevices=function(){
	var me=this;
	var list=me.list._getSelectedList();
	var devices=[];
	var statuses=[];

	var selected=me.list._getSelectedList();
	if(typeof selected == 'string' && selected=='all')
	{
		// selected all active
		log.info('All is selected');

		var lastsyncmask=me.list.dropdown_last_sync_filter._value();
		var statusmask=me.list.dropdown_active_filter._value();
		var namemask=gui.frm_main._getSearch();
		if(statusmask=='-'){statusmask=false;}

		var who='';
		if(location.parsed_query.account){
			who=location.parsed_query.account;
		}else if(location.parsed_query.domain){
			who=location.parsed_query.domain;
		}

		// 1 means block
		com.device.setAllStatus(who,{
				lastsyncmask:lastsyncmask,
				statusmask:statusmask,
				namemask:namemask
			},1,function(result){
			if(result.Array.IQ[0].QUERY[0].RESULT[0].VALUE==0){
				gui.message.error(getLang("error::save_unsuccessful"));
			}else{
				gui.message.toast(getLang("message::save_successfull"));
				me.list._emptySelectedList();
				me.resetListVariables();
				me.list._load();
			}
		});
	}
	else
	{
		// some selected
		for(var i=0; i<list.length; i++){
			devices.push(list[i].deviceid);
			statuses.push(1); // 1 means block... not my fault
		}

		var statuscheck=0;
		var succeeded=true;
		com.device.setStatus(devices,statuses,function(result){
			if(statuscheck<devices.length)
			{
				statuscheck++;
				if(result.Array.IQ[0].QUERY[0].RESULT[0].VALUE==0){
					succeeded=false;
				}
			}

			if(statuscheck>=devices.length)
			{
				if(!succeeded){
					gui.message.error(getLang("error::save_unsuccessful"));
					me.list._emptySelectedList();
					me.resetListVariables();
					me.list._load();
				}else{
					gui.message.toast(getLang("message::save_successfull"));
					me.list._emptySelectedList();
					me.resetListVariables();
					me.list._load();
				}
			}
		});
	}
}

_me._deleteSelectedDevices=function(){
	var me=this;
	var num=0;

	num=this.list._getSelectedCount();

	gui.message.warning(getLang("warning::delete_selected_devices", [num]),false,[
		{
			value:getLang("generic::cancel"),
			method:'close'
		},
		{
			value:getLang("generic::delete"),
			onclick:function(closeCallback){

				var selected=me.list._getSelectedList();

				if(typeof selected == 'string' && selected=='all')
				{
					// selected all active
					log.info('All is selected');

					var lastsyncmask=me.list.dropdown_last_sync_filter._value();
					var statusmask=me.list.dropdown_active_filter._value();
					var namemask=gui.frm_main._getSearch();
					if(statusmask=='-'){statusmask=false;}

					var who='';
					if(location.parsed_query.account){
						who=location.parsed_query.account;
					}else if(location.parsed_query.domain){
						who=location.parsed_query.domain;
					}

					com.device.deleteAllDevices(who,{
						lastsyncmask:lastsyncmask,
						statusmask:statusmask,
						namemask:namemask
					},function(result){
						closeCallback();
						me.list._emptySelectedList();
						me.resetListVariables();
						me.list._load();
					});
				}
				else
				{
					com.device.deleteDevices(selected,function(result){
						closeCallback();
						me.list._emptySelectedList();
						me.resetListVariables();
						me.list._load();
					});
				}
			},
			type:'text error'
		},
	]);
}
