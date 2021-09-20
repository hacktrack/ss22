_me = frm_box.prototype;
function frm_box(){};

/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function(s){
	var me = this;
	
	this.left_menu._clean();
	this.left_menu._hide();
	
	this.btn_search_icon._hide();
	this.btn_search_icon._onclick=function(){
		addcss(me._getAnchor('topbar'),'active');
		me.input_search._focus();
	}
	
	addcss(this._main,'box');
	
	this.btn_heading._hide();
	this.btn_save_2._hide();
	this._getAnchor('heading_button_mobile').setAttribute('is-hidden',1);
	
	this._getAnchor('main_content').setAttribute('scrolltop','onobjectappend');
	
	//set iwtype
	this._iwAttr('type','main');
	
	this._add_destructor('__onbeforedestruct');
	/* set onbefore destruct listener */
};

/** obbefore destruct listener */
_me.__onbeforedestruct=function(){
	
}
/** */

_me._addClass=function(classname){
	addcss(this._main,classname);
}

_me._removeClass=function(classname){
	removecss(this._main,classname);
}

_me._isFixed=function(bool){
	if(bool){
		//iw-height="full" iw-width="large"
		//addcss(this._main,'fixed');
		this._iwAttr('height','full');
		this._iwAttr('width','large');
	}else{
		//removecss(this._main,'fixed');
		this._iwAttr('height','');
		this._iwAttr('width','');
	}
};

_me._size=function(size){
	addcss(this._main,size);
	if(this._lastSize){
		removecss(this._main,this._lastSize);
	}
	this._lastSize=size;
};

////// SEARCH /////
_me._getSearch=function(){
	var str=helper.trim((this.input_search._searchString?this.input_search._searchString:''));
	return ((str!=''&&str!='**')?str:false);
}

_me._setSearchString=function(str,keepopen){
	log.log(['frm_box-setsearchstring',str]);
	this.input_search._value(helper.trim(str));
	this.input_search._searchString=helper.trim(str);
	if(helper.trim(str)!='' || keepopen){
		addcss(this._getAnchor('topbar'),'active');
	}else{
		removecss(this._getAnchor('topbar'),'active');
	}
}

_me._search=function(string)
{
	if(string){
		this._setSearchString(string);
	}
	this.btn_close_search._onclick();
}

_me._initSearch=function(callback,always_on_top,close_search_callback){
	var me=this;
	
	log.log(['frm_box-initsearch','is callback?',callback]);
	
	this.input_search._value('');
	this.input_search._searchString='';
	removecss(this._getAnchor('topbar'),'active');
	this.btn_close_search._onclick=function(){};
	this.btn_search._onclick=function(){};
	
	if(callback){
		if(
			(!always_on_top && !close_search_callback) ||
			(always_on_top && close_search_callback===true)
		)
		{
			this.btn_close_search._onclick=function(){
				me.input_search._value('');
				try
				{
					callback('');
				}
				catch(e)
				{
					this._onclick=function(){};
				}
				removecss(me._getAnchor('topbar'),'active');
				return false;
			};
		}
		else if(always_on_top && !close_search_callback)
		{
			this.btn_close_search._hide();
		}
		else if(typeof close_search_callback == 'function')
		{
			this.btn_close_search._onclick=close_search_callback;
		}
		else
		{
			log.error(['frmbox-initsearch-typeof',typeof close_search_callback]);
		}
	
		
		this.btn_search._onclick=this.input_search._main.parentNode.onsubmit=function(){
			try
			{
				me.input_search._searchString=me.input_search._value();
				callback(me.input_search._value());
			}
			catch(e)
			{
				this._onclick=function(){};
			}
			return false;
		};
		//this.btn_search_icon._disabled(false);
		this.btn_search_icon._show();
	}else{
		//this.btn_search_icon._disabled(true);
		this.btn_search_icon._hide();
	}
	
	// if always on top is set, show search
	if(always_on_top){
		this.btn_search_icon._onclick();
	}
}

///////////////////

_me._setHeadingButton=function(value,callback,classes){
	if(!value && !callback && !classes)
	{
		this.btn_heading._hide();
		this.btn_save_2._hide();
		this._getAnchor('heading_button_mobile').setAttribute('is-hidden',1);
	}
	else
	{
		// standard button
		if(!callback){callback=function(){};}
		this.btn_heading._value(value);
		this.btn_heading._onclick=callback;
		this.btn_heading._show();
		if(classes){
			this.btn_heading._main.className=classes+" button box-main-action";
		}
		this._getAnchor('heading_button_mobile').removeAttribute('is-hidden');
		
		// mobile view button
		this.btn_save_2._value(value);
		this.btn_save_2._onclick=callback;
		this.btn_save_2._show();
		if(classes){
			this.btn_save_2._main.className=classes+" button full";
			if(classes.search('_noduplicate')>=0){
				this._getAnchor('heading_button_mobile').setAttribute('is-hidden',1);
			}else{
				this._getAnchor('heading_button_mobile').removeAttribute('is-hidden');
			}
		}
	}
	return this.btn_heading;
}

_me._setBackButton=function(callback,classes){
	if(!callback)
	{
		this._getAnchor('box_head_back').setAttribute('is-hidden',1);
	}
	else
	{
		this.btn_back._onclick=callback;
		gui._changeObserver.assignTrigger(this.btn_back);	// assign trigger
		this._getAnchor('box_head_back').removeAttribute('is-hidden');
	}
}

_me._setAlternativeButtons=function(callback){
	this._alternativeButtons=[];
	this._getAnchor("heading_buttons_mobile").removeAttribute('is-hidden');
	callback(this,'heading_buttons');
	callback(this,'heading_buttons_mobile');
}

_me._cleanHeadingButtonsAnchor=function(){
	this._clean('heading_buttons');
	this._getAnchor("heading_buttons").innerHTML='';
	this._clean('heading_buttons_mobile');
	this._getAnchor("heading_buttons_mobile").innerHTML='';
	this._getAnchor("heading_buttons_mobile").setAttribute('is-hidden',1);
}

_me._init=function(settings,cb){
	
	try
	{
		var defaultSettings={
			name:'default',
			menu:{
				hashTemplate:'#menu=/MENU/&account=/ACCOUNT/',
				items:false
			},
			heading:{
				value:'',
				button:{
					value:false,
					onclick:function(){},
					class:''
				},
				back:{
					onclick:false,
					class:''
				}
			},
			footer:false
		}
		
		//log.info(['box fill tabmenu',settings]);
		
		settings=helper.mergeDeepArray(defaultSettings,settings);
		//log.log(['SETTINGS',settings]);
		
		this._cleanHeadingButtonsAnchor();
		
		if(!this._leftMenuGenerated || this._leftMenuGenerated!=settings.name || settings.forceload){
			this._leftMenuGenerated=settings.name;
			
			//set name
			this.left_menu._setName(settings.name);
			
			// set hash template
			if(settings.menu.hashTemplate){
				this.left_menu._setHashTemplate(settings.menu.hashTemplate);
			}
			
			// fill menu
			if(settings.menu.items){
				this.left_menu._fill(settings.menu.items);
				this.left_menu._show();
			}else{
				this.left_menu._clean();
				this.left_menu._hide();
			}
			
			// set heading text
			this._setHeading((settings.heading.value?settings.heading.value:''));
			
			// set value and callback for heading main button
			if(settings.heading.button.value && settings.heading.button.onclick){
				this._setHeadingButton(settings.heading.button.value,settings.heading.button.onclick,settings.heading.button.class);
			}
			else{
				//this._setHeadingButton();
			}
			
			// set callback for back button
			if(settings.heading.back.onclick){
				this._setBackButton(settings.heading.back.onclick,settings.heading.back.class);
			}
			else{
				this._setBackButton();
			}
			
			// set footer
			if(settings.footer){
				if(settings.footer=='default'){settings.footer='obj_popup_footer';}
				this._draw(settings.footer, 'foot', {items:{}});
				removecss(this._getAnchor('foot'),'hide');
			}else{
				addcss(this._getAnchor('foot'),'hide');
			}
		}
		//this.left_menu._setActive((location.parsed_query.tab?location.parsed_query.tab:false));
	}
	catch(e)
	{
		log.error(e);
	}
	
	// call menu to handle the hash. Could be moved to callback to provide more controll
	this.left_menu.__hash_handler();
	if(cb){cb(this,this.left_menu);}
}

_me._setHeading=function(text){
	this._getAnchor('heading').innerHTML=helper.htmlspecialchars(text);
}

_me.hideContent=function(){
	this._getAnchor('main_content').style.display='none';
}

_me.showContent=function(){
	this._getAnchor('main_content').style.display='';
}

_me._iwAttr=function(arr,val){
	if(typeof arr != 'object'){
		n={};
		n[arr]=val;
		arr=n;
	}
	for(var key in arr){
		this._main.setAttribute('iw-'+key,arr[key]);
	}
}