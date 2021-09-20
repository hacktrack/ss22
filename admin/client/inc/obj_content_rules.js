_me = obj_content_rules.prototype;
function obj_content_rules(){};

/**
 * @brief:
 * @date : 26.10.2014
 **/
_me.__constructor = function(s){
	var me = this;
	var parent=this._parent;
	
	gui.frm_main.main._setHeadingButton('generic::save',function(){me._save();},'button text success');

	this._add_destructor('__onbeforedestruct');
	/* set onbefore destruct listener */
};

/** obbefore destruct listener */
_me.__onbeforedestruct=function(){

}

_me._hash_handler=function(){
	var me=this;

	this._draw('obj_content_rules');

	gui.frm_main.main._init({
		name:'content_rules',
		heading:{
			value:getLang('main::content_rules')
		}
	});

}

/*
// Hash handler for tabbed menu
_me._hash_handler=function(){
	var me=this;
	
	try
	{
		me._getMenuDefinition({},function(menuDefinition,defaultTab){
			me._defaultTab=defaultTab;
			
			gui.frm_main.main._init({
				name:'content_rules',
				heading:{
					value:getLang('main::content_rules')
				},
				menu:{
					hashTemplate:"menu=/MENU/",
					items:menuDefinition
				}
			});
		});
	}
	catch(e)
	{
		log.error([e,me]);
	}

	
}*/