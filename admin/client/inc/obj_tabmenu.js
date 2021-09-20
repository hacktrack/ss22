_me = obj_tabmenu.prototype;
function obj_tabmenu(){};

/**
 * @brief:
 * @date : 01.12.2014
 **/

_me.__constructor = function(s){
	var me = this;
	
	this.__itemsSource=[];
	
	this._hashTemplate='#menu=/MENU/&account=/ACCOUNT/';
	
	var elm = mkElement('div',{"id":this._pathName+'#main'});
		addcss(elm,'menu-wrap');
	
	this._main.appendChild(elm);
	
	this._elm=elm;
	
	this._default=false;
	
	this._active=false;
	
	this._main.onclick=function(e){
		return me.__onclick(e);
	}
	
	gui._changeObserver.assignTrigger(this._main);	// assign trigger
	
	// let tabmenu to handle hashchange alone
	//gui.hashhandler._obeyEvent('onchange', [this,'__hash_handler']);
};

_me._addcss=function(css){
	addcss(this._main,css);
}

_me._removecss=function(css){
	removecss(this._main,css);
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

_me.__hash_handler=function(e,aData){
	log.log(['tabmenu-hash handler',e,this]);
	this._active=false;
	this._setActive();
}

_me._setHashTemplate=function(template){
	this._hashTemplate=template;
}

_me._inactivate=function(){
	removecss(helper.getElementsByClassName(this._main,'active')[0],'active');
	this._active=false;
}

_me._setActive=function(name,silent){
	try
	{
		if(!name){
			if(location.parsed_query['tab_'+this._name]){
				name=location.parsed_query['tab_'+this._name];
			}else{
				name=this._default;
			}
		}
		
		log.info(['tabmenu-setactive',this._active,name]);
		if(this._active!=name && name!='' && name!=false)
		{
			this._active=name;
			var elm=helper.getElementsByClassName(this._main,'_'+name)[0];
			if(!elm){
				name=this._default;
				elm=helper.getElementsByClassName(this._main,'_'+name)[0];
			}
			
			if(elm)
			{
				removecss(helper.getElementsByClassName(this._main,'active')[0],'active');
				addcss(elm,'active');
				if(!silent){elm._callback(name);}
			}

			removecss(this._main,'is-open');
			this._isopen=false;
		}
	}
	catch(e){
		log.error(e);
	}
}

_me._clean=function(){
	this._elm.innerHTML='';
}

_me._setName=function(name){
	this._name=name;
}

_me._removeTab=function(name){
	var tabs=[];
	var active=this._active;
	
	for(var i=0; i<this.__itemsSource.length; i++){
		if(name!=this.__itemsSource[i].name){
			tabs.push(this.__itemsSource[i]);
		}
	}
	
	this._fill(tabs);
	this._setActive(active,true);
}

_me._disableTab=function(name){
	if(this._getAnchor("tabmenu-"+name)){
		addcss(this._getAnchor("tabmenu-"+name),'is-disabled');
		this._getAnchor("tabmenu-"+name)._disabled=true;
	}else{
		log.log(["tabmenu-disabletab","name \""+name+"\" not found"]);
	}
}

_me._enableTab=function(name){
	if(this._getAnchor("tabmenu-"+name)){
		removecss(this._getAnchor("tabmenu-"+name),'is-disabled');
		this._getAnchor("tabmenu-"+name)._disabled=false;
	}else{
		log.error(["tabmenu-disabletab","name \""+name+"\" not found"]);
	}
}

_me._fill=function(items){
	try
	{
		this._active=false;
		this._elm.innerHTML='';
		this.__itemsSource=items;
		
		for(var i=0; i<items.length; i++){
			
			if(!items[i].ignore)	// ignore menu items with "ignore==true". Used because of permissions
			{
				if(!items[i].icon && items[i].icon!=''){items[i].icon=items[i].name;}
				
				if(items[i].isdefault){
					this._default=items[i].name;
					// Default item has a show property, use hide and show mode navigation
					if(items[i].show) {
						gui._changeObserver.clearTrigger(this._main);
						this._currentlyVisible = items[i].show;
					}
				}

				var box_span_icon = mkElement('span',{'className':'icon-'+(items[i].icon?items[i].icon:'none')});
				var box_span_value = mkElement('span',{});
				var box_a = mkElement('a',{'className':'menu-item _'+items[i].name+" "+(items[i].type?items[i].type:''),"id":this._pathName+'#tabmenu-'+items[i].name,"name":items[i].name});
					box_a.appendChild(box_span_icon);
					box_a.appendChild(box_span_value);
					box_a._valueSpan=box_span_value;
					box_a._value=function(value){
						this._valueSpan.innerHTML=value;
					}
					
					if(items[i].href){box_a.href=items[i].href; box_a.target="_blank";}
					if(items[i].onclick){box_a._onclick=items[i].onclick}else{box_a._onclick=function(){};};
					if(items[i].callback){box_a._callback=items[i].callback}else{box_a._callback=function(){};};
					
					if(items[i].isdefault){
						box_a._hash=this._hashTemplate;
						items[i]._hash=box_a._hash;
					}else{
						box_a._hash=this._hashTemplate+'&tab_'+this._name+'=/TAB/';
						items[i]._hash=box_a._hash;
					}
				//var box_li = mkElement('li',{'className':'menu-item'});
				//	box_li.appendChild(box_a);
				
				box_span_value.innerHTML=helper.htmlspecialchars(getLang(items[i].value));
				//this._elm.appendChild(box_li);
				this._elm.appendChild(box_a);
			}
		}
		
		this._tabs=items;
		//this._setActive();
	}
	catch(e)
	{
		log.error(e);
	}
}

_me._setItemValue=function(name,value){
	try
	{
		var elm=helper.getElementsByClassName(this._main,'_'+name);
		if(elm && elm[0]){
			elm=elm[0];
			elm._value(helper.htmlspecialchars(value));
		}
	}
	catch(e)
	{
		log.error(e);
	}
}

_me.__onclick = function(e){
	var e = e || window.event,
	elm = e.target || e.srcElement;

	if(elm._hash || elm.parentElement._hash){
		
		if(!elm.name){
			elm=elm.parentElement;
		}
		
		name=elm.name;
		
		// ee -for fun
		if(gui.__sound_on){
			gui.frm_main.bubble._play(400,false,1600);
		}
		//
		
		this._go(name);
	}
	
	return false;
};


_me._go=function(tabname){
	var tab=false;
	for(var i=0; i<this._tabs.length; i++){
		if(this._tabs[i].name==tabname){
			tab=this._tabs[i];
		}
	}
	
	if(tab && this._getAnchor("tabmenu-"+tabname) && !this._getAnchor("tabmenu-"+tabname)._disabled){
		
		// is-open handling (need to handle onclick menu like in features!!!)
		if(this._isopen){
			this._isopen=false;
			removecss(this._main,'is-open');
		}else{
			this._isopen=true;
			addcss(this._main,'is-open');
		}
		//
		
		href=tab._hash;

		if(tab.onclick){
			var ret=tab.onclick(false,tabname);
			this._setActive(tabname);
			if(ret===false){
				return false;
			}
		}

		// Use hiding and showing to navigate
		if(this._currentlyVisible) {
			addcss(this._currentlyVisible,'hide');
			removecss(tab.show,'hide');
			this._parent._getAnchor('main_content').scrollTop = 0;
			this._currentlyVisible=tab.show;
			// Mark current tab in list
			this._setActive(tabname);
		}
		// Use url to navigate
 		else {
			href=href.replace(/\/tab\//gi,tabname);
			try
			{
				for(var key in location.parsed_query){
					href=href.replace('/'+key+'/',encodeURIComponent(location.parsed_query[key])).replace('/'+key.toUpperCase()+'/',encodeURIComponent(location.parsed_query[key]));
				}
			}
			catch(e){
				log.error(e);
			}
			
			location.hash=href;
		}
	}
}

_me._hide = function(){
	addcss(this._parent._getAnchor('tab_menu'),'hide');
}

_me._show = function(){
	removecss(this._parent._getAnchor('tab_menu'),'hide');
}
