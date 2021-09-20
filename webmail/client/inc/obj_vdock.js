_me = obj_vdock.prototype;
function obj_vdock(){};
/**
 * dockovane objekty:
 *      _dock = null;
 *      _docked = false;
 *
 *      _ondock()
 *      _onundock()
 *
 * gui bude mit vlastnist _dock, kde bude ulozen DOCK s true v constructoru a ten se bude brat jako default
 *
 **/
_me.__constructor = function(bDefault){
	// set default
	if (bDefault) gui._dock = this;

	this._docked = {};

	this._add_destructor('__unregistr');

	var me = this;

	this._main.onclick = function(e){
		var e = e || window.event,
			elm = e.target || e.srcElement;

		if (elm != this){
			
			var action = (elm.tagName == 'SPAN' && hascss(elm,'close'))?'_close':'_remove';

			if ((elm = Is.Child(elm,'div',this)) && elm.id){
				var obj = me._docked[elm.id.substr(me._pathName.length)];
				if (obj){
					me[action](obj);

					if (obj._type=='collapse'){
						e.cancelBubble = true;
						if (e.stopPropagation) e.stopPropagation();
					}

					return false;
				}		
			}
		}		
	};

	this._main.oncontextmenu = function(e){
		var e = e || window.event;

		e.cancelBubble = true;
		if (e.preventDefault)
			e.preventDefault();
		if (e.stopPropagation)
			e.stopPropagation();

		this.onclick(e);
		
		return false;
	};	

	
	this.__oCollapse = {
		'_docked':false,
		'_type':'collapse',
		'_undock':function(parent,id){
			if (this._cmenu && !this._cmenu._destructed)
				this._cmenu._destruct();
			else{
				var ids = me.__getCollapsed(),
					elm = document.getElementById(parent._pathName+id);
				
				if (elm && (ids = ids.ids)){
					var pos = getSize(elm),
						aMenu = [];
					
					this._cmenu = gui._create("cmenu","obj_context",'','vdock',parent);
					
					for(var i = ids.length-1;i>=0;i--)
						aMenu.push({text:ids[i][1]?(ids[i][1].length>26?ids[i][1].substr(0,24)+'<b>...</b>':ids[i][1]):'', css:'ico2 '+ids[i][2], arg:ids[i][0]});

					this._cmenu._fill(aMenu);
					this._cmenu._place(pos.x+(pos.w/2),pos.y,'',2);
					this._cmenu._onclick = function(e,elm,id,arg){
						me._docked[arg]._undock();
					};
				}
			}	

			return false;
		}
	};

	gui._obeyEvent('resize',[this,'__checkSize']);
};

_me.__checkSize = function(){
	var dock = this._main;

	if (dock.scrollHeight>dock.clientHeight+10){
		var out = this.__getCollapsed(),
			elm = this._add(this.__oCollapse,out.ids.length.toString(),'vdock_collapse');


		if (elm){
			elm.style[gui._rtl?'right':'left'] = out.offset + 'px';
		}	
	}
	else{
		this._remove(this.__oCollapse,true);
	}
};

//clientTop offsetTop 
_me.__getCollapsed = function(){
	var out = {ids:[],offset: 0},
		elm;

	for(var id in this._docked)
		if (this._docked[id]._type != 'collapse' && (elm = document.getElementById(this._pathName + id))){

			//collapsed
			if ((elm.offsetTop || elm.clientTop)>10)
				out.ids.push([id,elm.title,elm.className]); //this._docked[id]._type
			else
			//visible
			if (!gui._rtl && out.offset<elm.offsetLeft+elm.offsetWidth)
				out.offset = elm.offsetLeft+elm.offsetWidth;
			else
			if(gui._rtl)
				out.offset += elm.offsetWidth + 5;
		}

	if(gui._rtl)
		out.offset += 9;

	return out;	
};

/**
 * @brief:	destructor,
 *			removes dock object from gui._dock in case of object is default dock for gui
 **/
_me.__unregistr = function(){
	if (gui._dock === this) delete gui._dock[this._name];
	
	for(var i in this._docked){
		if (this._docked[i]._onundock)
			this._docked[i]._onundock(this,i);
	}
};


_me._close = function(Obj){
	if (Obj._close && Obj._close(true) == true)
		return;

	this._remove(Obj);
};

_me._remove = function(Obj,bForce){
	var id,elm;

	if (typeof Obj != 'object' || (id = inArray(this._docked,Obj))<0 || (!bForce && Obj._undock && Obj._undock(this,id) === false))
		return;

	if ((elm = document.getElementById(this._pathName+(id)))){
		
		var elms = elm.parentNode.getElementsByTagName('div');
		
		// retain last position
		for (var i = 0; i<elms.length; i++)
			if (elms[i] === elm){
				Obj.__lastDockPosition = i;
				break;
			}

		elm.parentNode.removeChild(elm);
		delete this._docked[id];
	}

	if (Obj._type!='collapse')
		this.__checkSize();

	if (this._onchange)
		this._onchange(Is.Empty(this._docked)?false:true);
};

_me._add = function(Obj,sTitle,sClass){
	var id, elm;

	//Already docked
	if ((id = inArray(this._docked,Obj))>-1)
		elm = document.getElementById(this._pathName + id);
	//Add
	else{

		//get first empty index
		for(id = 0;this._docked[id];id++);

		this._docked[id] = Obj;

		elm = mkElement('div',{"id":this._pathName + id});

		// retain last position
		var elms = this._main.getElementsByTagName('div');

		if (Is.Defined(Obj.__lastDockPosition)){
		
			if (Obj.__lastDockPosition<elms.length)
				this._main.insertBefore(elm,elms[Obj.__lastDockPosition]);
			else
				delete Obj.__lastDockPosition;
		}	

		if (!Is.Defined(Obj.__lastDockPosition)){
			Obj.__lastDockPosition = elms.length;
			this._main.appendChild(elm);
		}
	}

	elm.className = 'ico_'+Obj._type + (sClass?' '+sClass:'') + (Obj.__closable?' closable':'');
	elm.title = sTitle;
	elm.innerHTML = (sTitle?(sTitle.length>24?sTitle.substr(0,22).escapeHTML()+'...':sTitle.escapeHTML()):'&nbsp;') + (Obj.__closable?'<span class="close"></span>':'');

	if (Obj._type!='collapse')
		this.__checkSize();

	if (this._onchange)
		this._onchange(Is.Empty(this._docked)?false:true);

	return elm;
};
