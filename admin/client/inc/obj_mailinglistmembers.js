function obj_mailinglistmembers(){};
var _me = obj_mailinglistmembers.prototype;
/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function(s){
	var me = this;
	storage.library('wa_accountmembers');
	storage.library('obj_accountpicker');
	
	gui.frm_main.main._setHeadingButton('accountdetail::add_members',function(){me._addMembers();},'button text primary');
	
	if(!gui.frm_main.main.actions){
		gui.frm_main.main._cleanHeadingButtonsAnchor();
		gui.frm_main.main._setAlternativeButtons(function(box,target_anchor){
			if(!box._alternativeButtons){
				box._alternativeButtons=[];
			}
			var actionobject = box._create('actions','obj_actionselect',target_anchor);
			actionobject._value('generic::select_action');
			if(target_anchor=='heading_buttons_mobile'){actionobject._addcss('full',true);}
			actionobject.actions._fill([
				{
					name:'rights',
					icon:false,
					onclick:function(){
						me._changeRightsSelectedMembers();
						return false;
					},
					value:'accountdetail::change_rights'
				},
				{
					name:'delete',
					icon:false,
					onclick:function(){
						me._deleteSelectedMembers();
						return false;
					},
					value:'accountdetail::remove'
				}
			]);
			actionobject._disabled(true);
			box._alternativeButtons.push(actionobject);
		});
	}

};

_me._load = function(domain)
{
	var me=this;
	
	me._draw('obj_mailinglistmembers', '', {items:{}});

	try
	{
		this.list._onchange=function(e){

			//handle select all
			if(e && e.text=='select-all'){
				this._selectAll(e.type,true,true);
			}
			//

			if(e && e.text=='select-all' && e.type) {
				for(var i=0; i<gui.frm_main.main._alternativeButtons.length; i++)
				{
					gui.frm_main.main._alternativeButtons[i]._text(getLang("generic::select_action")+" ("+me.list._totalcount+")");
					gui.frm_main.main._alternativeButtons[i]._disabled(false);
				}
			} else
			if(this._getSelectedCount()!=0){
				for(var i=0; i<gui.frm_main.main._alternativeButtons.length; i++)
				{
					gui.frm_main.main._alternativeButtons[i]._text(getLang("generic::select_action")+" ("+me.list._getSelectedCount()+")");
					gui.frm_main.main._alternativeButtons[i]._disabled(false);
				}
			}else{
				for(var i=0; i<gui.frm_main.main._alternativeButtons.length; i++)
				{
					gui.frm_main.main._alternativeButtons[i]._text(getLang("generic::select_action"));
					gui.frm_main.main._alternativeButtons[i]._disabled(true);
				}
			}

			/* prevent default action */
			if(e && e.text=='select-all'){
				return false;
			}
			//

		}

		var group = new Account(location.parsed_query.account);
		var members = this.__members = group.getMemberList();
		this.list._init('obj_groupmembers',false,function(linesPerPage,page,callback){
			members.load(function(result){
				me.list._totalcount = result.total;
				if(result.length){
					for(var i=0; i<result.length; i++) {
						me.list._drawItem(result[i]);
					}
					me.list._refreshed();
				} else if(result.error) {
					gui.message.error(result.error);
				}
			});
		},true);

	}
	catch(e)
	{
		log.error(['e1',e]);
	}
}

_me._changeRightsSelectedMembers = function() {
	var me=this;
	
	var items=this.list._getSelectedList();

	if(items=="all") {
		var list = 'all';
	} else {
		var list=[];
		for(var i=0; i<items.length; i++)
		{
			list.push(items[i]);
		}
	}

	var popup=gui._create('popup','obj_popup');
	popup._init({
		name:'changerights',
		heading:{
			value:getLang('accountdetail::change_rights')
		},
		fixed: false,
		content: "obj_mailinglistmembers_rights",
		footer: 'default',
		refresh: function() {
			me.list._emptySelectedList();
			me.__members.reset();
			me.list._load();
		}
	});

	popup.content._load(location.parsed_query.account,list);
}

_me._deleteSelectedMembers=function(){
	var me=this;
	
	var items=this.list._getSelectedList();
	
	if(items=="all") {
		var list = 'all';
	} else {
		var list=[];
		for(var i=0; i<items.length; i++)
		{
			list.push(items[i].email.toString());
		}
	}
	
	log.info(['mailinglistmembers-delete',list]);

	var finish = function(result){
		if(result.error || result==0){
			gui.message.error(getLang("error::save_unsuccessful"));
		}else{
			gui.message.toast(getLang("message::save_successfull"));
			me.list._emptySelectedList();
			me.__members.reset();
			me.list._load();
		}
	}
	
	if(list.length || this.list._selectAllActivated){
		gui.message.warning(getLang("warning::delete_selected_members", [this.list._selectAllActivated ? this.list._totalcount : this.list._getSelectedCount()]),false,[
			{
				value:getLang("generic::cancel"),
				method:'close'
			},
			{
				value:getLang("generic::delete"),
				type:'text error',
				onclick:function(closeCallback){
					if(me.list._selectAllActivated) {
						com.members.removeAll(location.parsed_query.account,finish);
					} else {
						com.members.remove(location.parsed_query.account,list,finish);
					}
					closeCallback();
				}
			}
		]);
	}
}

_me._addMembers=function(){
	var me=this;
	
	gui.accountpicker(function(items,type){
		
		var list=[];
		for(var i=0; i<items.length; i++)
		{
			if(items[i].type==1){
				list.push("["+items[i].id+']');
			}else{
				list.push(items[i].id);
			}
		}
		
		var items_in_grid=me.list._getItems();
		var old=[];
		for(var key in items_in_grid){
			old.push(items_in_grid[key]._item.email);
		}
		var new_items=helper.array_diff(list,old);
		log.log(['groupmembers-addmembers',old,list,new_items]);
		
		com.members.add(location.parsed_query.account,new_items,function(result){
			if(result.error || result==0){
				gui.message.error(getLang("error::save_unsuccessful"));
			}else{
				gui.message.toast(getLang("message::save_successfull"));

				var popup=gui._create('popup','obj_popup');
				popup._init({
					name:'changerights',
					heading:{
						value:getLang('accountdetail::change_rights')
					},
					fixed: false,
					content: "obj_mailinglistmembers_rights",
					footer: 'default',
					refresh: function() {
						me.list._emptySelectedList();
						me.__members.reset();
						me.list._load();
					}
				});

				popup.content._load(location.parsed_query.account,new_items.map(function(item) {
					return {
						email: item,
						default: 1
					};
				}));
			}
		});
	},{allow_external_accounts:true,exclude:{accounts:[location.parsed_query.account]}});
}
