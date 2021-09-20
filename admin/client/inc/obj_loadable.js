_me = obj_loadable.prototype;
function obj_loadable(){};

/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function(s){
	var me = this;

	me._rowHeight=0;
	me._linesPerPageMin=20;
	me.page=0;
	me._max_count=0; // -1 or false means "do not try to load more, all is loaded with first request"
	me._loading=false;
	me._count=1;
	me._exist=true;
	this._selectedList=[];
	this.__list={};
	me.__scrollableObject=false;

	this._getAnchor('selection_info_toggle').onclick=function(){
		if(!me._selectionShown){
			me._showSelectedList();
		}else{
			me._load();
		}
	}
};

_me._table=function(){
	var me=this;
	return {
		_addcss:function(classes){
			addcss(me._main,classes);
		},
		_removecss:function(classes){
			removecss(me._main,classes);
		}
	};
};

_me._showSelectedList=function(){
	var me=this;
	try
	{
		if(!this._selectionShown){

			var toggle=this._getAnchor('selection_info_toggle');
			toggle.innerHTML=toggle.getAttribute('selection-shown');

			this._selectionShown=true;
			//this.userlist.dropdown_userlist_filter._disabled(true);

			this._empty();
			this._setMax(-1);
			var list=this._getSelectedList();

			for(var i=0; i<list.length; i++){
				me._drawItem(list[i],function(checkbox){
					log.log(['loadable-showselectedlist-checkbox',checkbox]);
					me._itemSelected(checkbox);
				},true,false);
			}
		}
	}
	catch(e)
	{
		log.error(e);
	}
}

_me._selectionInfoRefresh=function(){
	var count=this._getSelectedCount();

	this._getAnchor('selection_info_count').innerHTML=count;
}

_me._selectionCounter=function(enabled){
	if(enabled){
		this._getAnchor('selection_info').removeAttribute('is-hidden');
	}else{
		this._getAnchor('selection_info').setAttribute('is-hidden',1);
	}
}

_me._emptySelectedList=function(silent,simple){
	this._selectedList=[];
	if(!simple){this._selectAll(false,(silent?false:true));}
	this.checkbox_0._checked(false,true);
	this._onchange({type:2,text:'selected-list-emptied'});
}

_me._inList=function(item){
	for(var i=0; i<this._selectedList.length; i++){
		if(item._id==this._selectedList[i]._id){
			return true;
		}
	}
	return false;
}

_me._getSelectedList=function(){
	if(this._selectAllActivated && this._max_count>=0){
		return 'all';
	}
	return this._selectedList;
}

_me._getSelectedCount=function(){
	if(this._selectAllActivated && this._max_count>=0){
		return this._max_count;
	}
	return this._selectedList.length;
}

_me._itemSelected=function(checkbox){
	var data=checkbox.__source;
	var checked=checkbox._checked();
	var me=this;

	log.log(['loadable-itemselected']);

	if(checked){

		var row=helper.getParentByClassName(checkbox._main,'_item-row');
		if(row){
			addcss(row,'is-selected');
		}

		if(!this._inList(data)){
			this._selectedList.push(data);
			me._selectionInfoRefresh();
			me._onchange({type:0,text:'item-added-to-list'});
		}
	}else{

		var row=helper.getParentByClassName(checkbox._main,'_item-row');
		if(row){
			removecss(row,'is-selected');
		}

		for(var i=0; i<this._selectedList.length; i++){
			if(data._id==this._selectedList[i]._id){
				this._selectedList.splice(i,1);
				me._selectionInfoRefresh();
				me._onchange({type:1,text:'item-removed-from-list'});
			}
		}
	}
}

_me._redrawItem=function(target,item,callback,checked,disabled){
	if(target._parent.__list[target._uid]){
		delete target._parent.__list[target._uid];
	}
	var line=this._drawItem(item,callback,checked,disabled);
	target.parentNode.replaceChild(line,target);
	return line;
}

_me._drawItem=function(item,callback,checked,disabled){
	if(!item){item={};}
	var me=this;
	var line=this._draw(this._itemTemplate, 'body', {item:item},true);
		line._item=item;
	if(this._selectAllActivated && this._max_count>=0){checked=true;disabled=true;}


	var elm=this['checkbox_'+this._count];
	if(!checked){checked=false;}
	if(!disabled){disabled=false;}
	if(elm){
		if(!item.id){item._id=JSON.stringify(item);}else{item._id=item.id;}
		elm.__source=item;
		elm._onclick=function(e){

			log.log(['loadable-drawitem-onclick'])

			if(elm._onchange){
				elm._onchange(e);
			}

			e.stopPropagation();
			e.cancelBubble=true;
			return false;
		}
		elm._onchange=function(e){

			if(this.__source.selectable || typeof this.__source.selectable == 'undefined')
			{
				me._itemSelected(elm);
			}
			if(callback){
				callback(elm,elm._checked());
			}
		}

		log.log(['loadable-drawitem-inlist',me._inList(item)]);
		elm._checked(checked?true:me._inList(item));
		elm._disabled(disabled);
	}

	this._loading=false;

	this._count++;

	if(line && line.getElementsByTagName){
		line._objects=[];
		var tags=line.getElementsByTagName('*');
		for(var i=0; i<tags.length; i++){
			if(tags[i].id && tags[i].id.search('gui.')==0 && tags[i].id.search('#')<0){
				eval("var obj="+tags[i].id);
				line._objects.push(obj);
			}
		}

		// save line to list and set destruct
		var uid=helper.uniqid('loadable_item_',true);
		line._parent=me;
		line._uid=uid;
		line._addObject=function(line){
			return function(obj){
				me._addObject(line,obj);
			}
		}(line);
		line._destruct=function(line){
			return function(){
				line.parentNode.removeChild(line);
				if(line._parent.__list[line._uid]){
					delete line._parent.__list[line._uid];
				}
			}
		}(line);
		me.__list[uid]=line;
		//

		if(!line){
			log.error(['loadable-drawItem','line does not exist but should',line]);
		}

		return line;
	}
	else
	{
		log.error(['loadable-drawItem','line does not exist',line]);
		return false;
	}
}

_me._getItems=function(){
	return this.__list;
}

_me._destruct=function(){
	this._exist=false;
}

_me._setMax=function(max){
	if(max===false){
		max=-1;
	}
	this._max_count=max;
}

_me._setMin=function(min){
	if(min===false){
		min=-1;
	}
	this._linesPerPageMin=min;
}

_me._loadItems=function(callback){

	if(!this._loading)
	{
		this._loading=true;
		var row_height=this.rowHeight;
		var domainDetail_height=this.__scrollableObject.offsetHeight;
		var linesPerPage=Math.ceil(domainDetail_height/row_height);
		if (linesPerPage<this._linesPerPageMin){
			linesPerPage=this._linesPerPageMin;
		}

		if(this.page*linesPerPage<=this._max_count || this._max_count==0)
		{
			if(this.__showprogress) {
				addcss(this._getAnchor('loader'),'is-visible');
			}

			this._loadFunction(linesPerPage,this.page,callback);

			this.page++;
		}
	}
}

_me._refreshed = function() {
	removecss(this._getAnchor('loader'),'is-visible');
}

_me._content = function(items) {
	if(items!=undefined) {
		removecss(this._getAnchor('loader'),'is-visible');

		items.removeItem('offset');

		this._totalcount = +items.getItem('overallcount');
		items.removeItem('overallcount');

		if(!this.__content) {
			this.__content = new IWAPI.List('items');
		}

		for(var i=0, l=items.length; i<l; i++) {
			this.__content.addItem(items[i]);
		}

		this._currentcount = this.__content.length;
	} else {
		return this.__content;
	}
}

_me._init=function(cssFileDependency,scrollableObject,func,progress){
	var me=this;

	if(!scrollableObject){
		scrollableObject=this._getAnchor('body_wrapper');
	}

	me.__scrollableObject=scrollableObject;
	me.__showprogress = progress;

	me._loadFunction=func;

	me.timeout=setInterval(function(){

		if(storage.css_status(cssFileDependency))
		{
			clearInterval(me.timeout);
			try
			{
				me._loadItems(function(){
				 	me._loadItems();
				});
			}
			catch(e)
			{
				log.error(e);
			}
		}
	},100);

	scrollableObject.onscroll=function(e){
		if(me._exist)
		{
			// ee -for fun
			if(gui.__sound_on){
				if(!gui.frm_main.scrape.__playingContinuousLoadable){
					gui.frm_main.scrape._playContinuous();
					log.log('scrape play');
					gui.frm_main.scrape.__playingContinuousLoadable=setTimeout(function(){
						gui.frm_main.scrape._fadeOut(50,true);
						log.log('scrape pause');
						gui.frm_main.scrape.__playingContinuousLoadable=false;
					},200);
				}else{
					log.log('scrape clear');
					clearTimeout(gui.frm_main.scrape.__playingContinuousLoadable);
					gui.frm_main.scrape.__playingContinuousLoadable=setTimeout(function(){
						gui.frm_main.scrape._fadeOut(50,true);
						log.log('scrape pause');
						gui.frm_main.scrape.__playingContinuousLoadable=false;
					},200);
				}
			}
			//

			var bottom=this.scrollHeight-(this.scrollTop+this.offsetHeight)-this.offsetHeight;
			if(!me._loading && bottom<0){
				me._loadItems();
			}
		}
	}
	scrollableObject.ontouchmove=scrollableObject.onscroll;
	window.onresize=scrollableObject.onscroll;


	window.addEventListener('resize',function(){
		if(me){
			scrollableObject.onscroll();
		}
	} , true);
}

_me._addObject=function(line,obj){
	line._objects.push(obj);
	log.log(['loadable-addobject',line,line._objects,obj]);
}

_me._empty=function(){
	try
	{
		this.page=0;
		this._loading=false;

		for(var i=1; i<this._count; i++){
			if(this['checkbox_'+i]){
				this['checkbox_'+i]._destruct();
			}
		}

		for(var key in this.__list)
		{
			if(this.__list[key]._objects)
			{
				for(var ii=0; ii<this.__list[key]._objects.length; ii++){
					if(this.__list[key]._objects[ii]._destruct){
						this.__list[key]._objects[ii]._destruct();
					}
				}
			}
		}

		this.__list={};

		this._getAnchor('body').innerHTML='';
		this._count=1;

		this._onempty && this._onempty();
	}
	catch(e)
	{
		log.error(['loadable-empty',e]);
	}
}

_me._load=function(callback){
	try
	{
		var toggle=this._getAnchor('selection_info_toggle');
		toggle.innerHTML=toggle.getAttribute('selection-hidden');
		this._selectionShown=false;

		this._max_count=0;
		this._empty();
		this._loadItems(callback);
		this._onchange();
	}
	catch(e)
	{
		log.error(['loadable-load',e]);
	}
}

_me._selectAll=function(activated,activateCallback,disableSelected){
	var me=this;

	me._selectAllActivated=activated;
	for(var i=1; i<me._count; i++){
		me['checkbox_'+i]._checked(activated,!activateCallback);
		if(disableSelected){
			me['checkbox_'+i]._disabled(activated);
		}
	}
	this.checkbox._checked(activated,true);
	if(!activated){me._emptySelectedList(false,true)};
}

_me._label=function(label){
	var me=this;
	if(label){
		this._draw(label, 'head', {});
		if(this.checkbox_0){
			this.checkbox_0._onchange=function(){

				log.info(['loadable-label','changed']);

				var ischecked=me.checkbox_0._checked();

				var ret=me._onchange({type:ischecked,text:'select-all'});
				if(ret===false){
					return false;
				}

				me._selectAll(ischecked,true);
				return false;
			}
		}
	}
}

_me._value=function(value){
	this._itemTemplate=value;
	/** draw dummy */
	this._draw(value, 'dummy', {});
	this._getAnchor('dummy').removeAttribute('is-hidden');
	this.rowHeight=this._getAnchor('dummy').offsetHeight;
	this._getAnchor('dummy').setAttribute('is-hidden',1);
	/** */

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


_me._onchange=function(){

}