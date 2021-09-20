_me = obj_spamqueues_quarantine.prototype;
function obj_spamqueues_quarantine(){};

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
			name:'deliver',
			icon:false,
			onclick:function(){
				me._deliverSelectedItems();
				return false;
			},
			value:'spam_queues::action_deliver'
		},
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
		},
		{
			name:'whitelist',
			icon:false,
			onclick:function(){
				me._whitelistSelectedItems();
				return false;
			},
			value:'spam_queues::action_whitelist'
		}
	];
};

_me._load = function()
{
	var me=this;
	
	me._draw('obj_spamqueues_quarantine','',{});
	
	me._initFilter();
	me._initActions();
	
	/* Init loadable grid */
	this.list._init('obj_spamqueues_quarantine',false,function(linesPerPage,page,callback){
		
		var mask=gui.frm_main._getSearch(true);
		var sender=me.input_filter_sender._value();
		var owner=me.input_filter_owner._value();
		var domain=me.input_filter_domain._value();
		
		com.spamqueues.getQuarantine(mask,sender,owner,domain,linesPerPage,page,[function(aData){
			log.log(['spamques_quarantine-load',aData]);
			
			me.list._setMax(aData.count);
			
			if(aData.items[0]){
				for(var i=0; i<aData.items.length; i++){
					log.log(['spamques_quarantine-load-item',aData.items[i]]);
					var line=me.list._drawItem(aData.items[i]);
					line.onclick=function(){
						var id=this._item.itemid;
						me._openDetail(id);
					}
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
}

_me._openDetail=function(id){
	var me=this;
	var popup=gui._create('popup','obj_popup');
	popup._init({
		name:'detail',
		heading:{
			value:getLang('spam_queues::detail')
		},
		template:'obj_spamqueues_detail',
		fixed:true,
		footer:'default',
		type:'default'
	});
	
	popup.main.btn_save._hide();
	popup.main.btn_cancel._value('form_buttons::close');
	
	com.spamqueues.getDetail(id,function(response){
		popup.main.content._value(response);
	})
}