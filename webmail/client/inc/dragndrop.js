/***
 *
 *	!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 *
 *	WE SHOULD USE elementFromPoint TO DETERMINATE Z-INDEX OF PROP:
 *		var element = document.elementFromPoint(x, y);
 *
 ***/

function cDnD(){
	storage.css('dragndrop');
	this.value;     	//draged data
	this.droper = {};   //drop target object stock

	this.startX;
	this.startY;
	this.addoffset = 5;

	this.old_docmove;
    this.old_docup;
    this.old_keydown;
    this.old_keyup;
    
    //this._lastObj;		//last object with dragover (used for dragout)

};

/*
Main object methods:
 	_dragstart()
	_ondragend()

Target Object methods:
	_ondragover()
	_ondrop()
	_active_dropzone()


Drop data:
	type
    value
	originator
*/



/**
 * Registr drop objects
 **/
cDnD.prototype.registr_drop = function(obj, aType){
	if (typeof obj !='object' || !aType) return false;

	this.droper[obj._pathName] = aType;
	
	return true;
};

/**
 * @params:
 *	sHTML	- html content of draged block
 *	aData	- {type,arg,css,obj}
 *  x,y     - mouse coordinates
 **/
cDnD.prototype.create_drag = function (sHtml,aData,x,y,bCtrl){

	var me = this;

	if (typeof aData.type != 'string') return;

	aData.x = x;
    aData.y = y;

	//create
	if (!this.eDiv)
		this.eDiv = mkElement('div',{id:'dnd_element'});

	this.eDiv.innerHTML = '<div class="dnd_ico">&nbsp;</div><div class="dnd_body">'+sHtml+'</div>';

	if (x || gui.__X) this.eDiv.style.left = ((gui.__X || x) + this.addoffset)+'px';
	if (y || gui.__Y) this.eDiv.style.top = ((gui.__Y || y) + this.addoffset)+'px';

	this.value = aData;

	//Call object functions
	if (aData.obj){
		if (aData.obj._ondragstart)
			aData.obj._ondragstart(this.value);

		if (aData.obj._ondragover)
			aData.obj._ondragover(this.value);
	}

	if (!document.getElementById('dnd_element'))
		document.getElementsByTagName('body')[0].appendChild(this.eDiv);					//radeji GUI?

	if (bCtrl){
		this.__forceCtrl = true;
		addcss(this.eDiv,'ctrl');
	}
	else{
		this.__forceCtrl = false;

		//EVENT HANDLERS
		this.__keydown = function (e){
			var e = e || window.event;

			if (me.eDiv && e.ctrlKey)
				addcss(me.eDiv,'ctrl');

			me.value.ctrl = me.__forceCtrl || e.ctrlKey;
		};
		gui._obeyEvent('keydown',[this,'__keydown']);

		this.__keyup = function (e){
			var e = e || window.event;

			if (me.eDiv && !e.ctrlKey)
				removecss(me.eDiv,'ctrl');

			me.value.ctrl = me.__forceCtrl || e.ctrlKey;
		};
		gui._obeyEvent('keyup',[this,'__keyup']);
	}

	//MOUSEMOVE
	this.__mousemove = function(e){

		//Remove selections
		if (window.getSelection)
			window.getSelection().removeAllRanges();
		else
		if (document.selection)
			document.selection.empty();

		me.value.x = e.clientX;
		me.value.y = e.clientY;
		me.value.ctrl = me.__forceCtrl || e.ctrlKey;

		me.eDiv.style.left = (e.clientX + me.addoffset)+'px';
		me.eDiv.style.top = (e.clientY + me.addoffset)+'px';
	};
	gui._obeyEvent('mousemove',[this,'__mousemove']);


	//MOUSEUP
	this.__mouseup = function(e){
		me.value.x = e.clientX;
		me.value.y = e.clientY;
		me.value.ctrl = me.__forceCtrl || e.ctrlKey;

		me.remove_drag();
	};
	gui._obeyEvent('mouseup',[this,'__mouseup']);

	this.active_drop(1);
};

/**
 * Activate dropzones if defined in drop objects
 * @option: b - true for Active, false for Deactive
 **/
cDnD.prototype.active_drop = function (b){
	
	//Clear old mask divs
	this.remove_masks();

    var me = this;

	//Create dropping targets
	for (var i in this.droper){
		if (inArray(this.droper[i], this.value.type)>-1){
			try{
				var mask = '',
					obj = window;
				i.split('.').forEach(function(part) {
					obj = obj[part];
				});

				// active_dropzone returns mask div or its created automatically inside _main element
				// _main element must be positioned relative|absolute
				if (obj._active_dropzone && (mask = obj._active_dropzone(b?this.value:undefined)) === false)
					continue;

				if (b){

					if (!mask || !mask.parentNode){
						mask = mkElement('div',{className:'dropzone'}); 
						obj._main.appendChild(mask);
					}

					this.__aMaskDivs.push(mask);

					mask.obj = obj;

					//Mask div handlers
					mask.onmouseout = function(e){
						if (this.obj._ondragout)
							this.obj._ondragout(me.value);
					};
					mask.onmousemove = function(e){
						if (this.obj._ondragover)
							this.style.cursor = this.obj._ondragover(me.value) == false?'not-allowed':'';
					};

					mask.onmouseup = function(e){
						me.value.target = this.obj;

						//call drop on target
						if (this.obj._ondrop)
							this.obj._ondrop(me.value);

						if (this.obj._ondragout)
							this.obj._ondragout(me.value);
					};
				}
			}
			catch(e){
                delete this.droper[i];
			}
		}
	}
};

/**
 * Remove draged element, disable drop zones
 **/

cDnD.prototype.remove_drag = function (){

	if (this.eDiv){

		gui._disobeyEvent('mousemove',[this,'__mousemove']);
		gui._disobeyEvent('mouseup',[this,'__mouseup']);
		gui._disobeyEvent('keydown',[this,'__keydown']);
		gui._disobeyEvent('keyup',[this,'__keyup']);

		//remove child
		try{
			this.eDiv.parentNode.removeChild(this.eDiv);
		}
		catch(er){gui._REQUEST_VARS.debug && console.log(this._name||false,er);}

		//disable dropzones
		this.active_drop();
		
		if (this.value && this.value.obj && this.value.obj._ondragend) {
			this.value.obj._ondragend(this.value);
		}
			
		this.value = '';
	}

	this.eDiv = null;
	//this._lastObj = null;
};

cDnD.prototype.remove_masks = function(){
	if (this.__aMaskDivs && this.__aMaskDivs.length)
		for(var i = this.__aMaskDivs.length-1; i>=0; i--)
			if (this.__aMaskDivs[i] && this.__aMaskDivs[i].parentNode)
				this.__aMaskDivs[i].parentNode.removeChild(this.__aMaskDivs[i]);

    this.__aMaskDivs = [];
};
