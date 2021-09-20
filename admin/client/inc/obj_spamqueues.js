_me = obj_spamqueues.prototype;
function obj_spamqueues(){};

/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function(s){
	var me = this;
	var parent=this._parent;
	
	this._menuHashTemplate='#menu=/MENU/';
	
	storage.library('wm_server');
};

_me._getMenuDefinition=function(settings,callback){
	var me=this;
	var menu=[];
	var defaultTab='';
	
	defaultTab='quarantine';
	menu=[
		{
			isdefault:true,
			name:'quarantine',
			icon:'none',
			value:'spam_queues::quarantine',
			callback:function(name){
				me._tabmenuCallback(name);
			}
		},
		{
			name:'whitelist',
			icon:'none',
			value:'spam_queues::whitelist',
			callback:function(name){
				me._tabmenuCallback(name);
			}
		},
		{
			name:'blacklist',
			icon:'none',
			value:'spam_queues::blacklist',
			callback:function(name){
				me._tabmenuCallback(name);
			}
		}
	];
	
	callback(menu,defaultTab);
}

_me._hash_handler = function(e,aData)
{
	var me=this;
	var parent=this._parent;
	
	try
	{
		me._getMenuDefinition({},function(menuDefinition,defaultTab){
			me._defaultTab=defaultTab;
			
			gui.frm_main.main._init({
				name:'spamqueues',
				heading:{
					value:getLang('main::spam_queues')
				},
				menu:{
					hashTemplate:me._menuHashTemplate,
					items:menuDefinition
				}
			});
		});
	}
	catch(e)
	{
		log.error([e,me]);
	}
}

_me._tabmenuCallback=function(name)
{
	var me=this;
	var parent=this._parent;
	
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
	
	log.info('Menu with ID "'+name+'" selected');
	
	switch(name)
	{
		case '':
		case "quarantine":
			if(!parent.quarantine){
				parent._create('quarantine','obj_spamqueues_quarantine','main_content');
			}
			parent.quarantine._load();
		break;
		case 'whitelist':
			if(!parent.whitelist){
				parent._create('whitelist','obj_spamqueues_whitelist','main_content');
			}
			parent.whitelist._load();
		break;
		case 'blacklist':
			if(!parent.blacklist){
				parent._create('blacklist','obj_spamqueues_blacklist','main_content');
			}
			parent.blacklist._load();
		break;
	}
}

_me.__load_default_view = function(e,name)
{
	this._tabmenuCallback('');
}