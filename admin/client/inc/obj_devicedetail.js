_me = obj_devicedetail.prototype;
function obj_devicedetail(){};

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
			name:'deviceinfo',
			icon:false,
			value:'devicedetail::info',
			callback:function(name){
				me._tabmenuCallback(name);
			}
		},
		{
			name:'devicesync',
			icon:false,
			value:'devicedetail::synchronization',
			callback:function(name){
				me._tabmenuCallback(name);
			}
		}/*,
		{
			name:'settings',
			value:'devicedetail::settings',
			callback:function(name){
				me._tabmenuCallback(name);
			}
		},
		{
			name:'security',
			value:'devicedetail::security_and_limits',
			callback:function(name){
				me._tabmenuCallback(name);
			}
		},
		{
			name:'activedirectory',
			icon:'folder',
			value:'devicedetail::active_directory',
			callback:function(name){
				me._tabmenuCallback(name);
			}
		}
		*/
	];
	
	if(location.parsed_query.account){
		this._menuHashTemplate='#menu=/MENU/&account=/ACCOUNT/&device=/DEVICE/';
	}else{
		this._menuHashTemplate='#menu=/MENU/&domain=/DOMAIN/&device=/DEVICE/';
	}
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
		
		log.log('Device detail should be loaded');
		//log.log(e,aData);
		
		try
		{
			gui.frm_main.main._init({
				name:'devicedetail',
				heading:{
					value:'',
					back:{
						onclick:function(){
							if(location.parsed_query.account){
								location.hash=helper.translateHash('menu=accountdetail&account=/ACCOUNT/&tab_accountdetail=mobile_devices');
							}else{
								location.hash=helper.translateHash('menu=domaindetail&domain=/DOMAIN/&tab_domaindetail=mobile_devices');
							}
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
}

_me._tabmenuCallback=function(name)
{
	try
	{
		// clean content to be able to show the same tab for different account
		this._parent._clean('main_content');
		
		if(!name){name='';}
		switch(name)
		{
			case '':
			case "deviceinfo":
				if(!gui.frm_main.main.deviceinfo){
					log.log('Device info should be loaded');
					gui.frm_main.main._clean('main_content');
					gui.frm_main.main._create('deviceinfo','obj_deviceinfo','main_content');
				}
				gui.frm_main.main.deviceinfo._load(location.parsed_query.device);
			break;
			case 'devicesync':
				if(!gui.frm_main.main.devicesync){
					log.log('Device info should be loaded');
					gui.frm_main.main._clean('main_content');
					gui.frm_main.main._create('devicesync','obj_devicesync','main_content');
				}
				gui.frm_main.main.devicesync._load(location.parsed_query.device);
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

_me.__load_default_view = function(e,aData)
{
	
}