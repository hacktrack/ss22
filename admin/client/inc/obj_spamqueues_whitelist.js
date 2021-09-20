_me = obj_spamqueues_whitelist.prototype;
function obj_spamqueues_whitelist(){};

/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function(s){
	var me = this;
	var parent=this._parent;
	storage.library('wm_spamqueues');
	this.__actions=[
		{
			name:'delete',
			icon:false,
			onclick:function(){
				me._deleteSelectedItems();
				return false;
			},
			value:'spam_queues::action_delete'
		},
		{
			name:'blacklist',
			icon:false,
			onclick:function(){
				me._blacklistSelectedItems();
				return false;
			},
			value:'spam_queues::action_blacklist'
		}
	];
};

_me._load = function()
{
	var me=this;

	me._draw('obj_spamqueues_blackwhitelist','',{});
	
	gui.frm_main.main._setHeadingButton('generic::add',function(){me._addItem();},'button text success');
	
	me._initFilter();
	me._initActions();
	
	/* Init loadable grid */
	this.list._init('obj_spamqueues_blackwhitelist',false,function(linesPerPage,page,callback){
		
		var mask=gui.frm_main._getSearch(true);
		var sender=me.input_filter_sender._value();
		var owner=me.input_filter_owner._value();
		var domain=me.input_filter_domain._value();
		
		com.spamqueues.getWhitelist(mask,sender,owner,domain,linesPerPage,page,[function(aData){
			log.log(['spamques_whitelist-load',aData]);
			
			me.list._setMax(aData.count);
			
			if(aData.items[0]){
				for(var i=0; i<aData.items.length; i++){
					log.log(['spamques_whitelist-load-item',aData.items[i]]);
					me.list._drawItem(aData.items[i]);
				}
			}
		}]);
	});
	
	this.list._onchange=function(e){
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
	}
	/** */
	
	/** open detail on click */
	/*
	that._main.onclick=function(e){
		
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
	*/
	/**/
}

_me._addItem=function(){
	var me=this;
	var popup=gui._create('popup','obj_popup');
	popup._init({
		name:'add',
		heading:{
			value:getLang('spam_queues::add_item')
		},
		template:'obj_spamqueues_add',
		fixed:false,
		footer:'default',
		type:'default'
	});
	
	
	popup.main.input_owner._value(gui._globalInfo.email);

	if(gui._globalInfo.admintype==USER_USER){
		popup.main.button_filter_domain._hide(true);
		popup.main.input_owner._readonly(true);
	}
	
	popup.main.button_filter_domain._onclick=function(){
		gui.accountpicker(function(data){
			if(data[0]){
				popup.main.input_owner._value(data[0].email);
			}
		},{
			// some cool settings defining the accountPicker's behavior
			disable_add_domain:true
		});
	}
	
	popup.main.btn_save._onclick=function(){
		if(popup.main.input_sender._value()==''){
			popup.main.input_sender._error(getLang("error::sender_must_be_filled"));
			return false;
		}
		popup.main.btn_save._disabled(true);
		com.spamqueues.addWhitelist(popup.main.input_sender._value(),popup.main.input_owner._value(),function(success){
			popup.main.btn_save._disabled(false);
			if(success){
				gui.message.toast(getLang("message::item_saved_successfully"));
				popup._close();
				me.list._load();
			}else{
				popup.main.input_owner._error(getLang("error::save_failed"),'top');
			}
		});
	}
}
