/**
 * @Note:
 * This object is strictly determined for use inside obj_barmenu together with obj_tree_folder in frm_main form
 * Uses Drag and Drop avaliable as obj. bellow frm_main!
 *
 * @Date: 10.7.2008 11:16:44
 **/

_me = obj_barmenu_list.prototype;
function obj_barmenu_list(){};

_me.__constructor = function(){
	var me = this;

	this.__body = this._getAnchor('main');
	
    this.__aData = [];
	this.__norefresh = 0;
	this._dragType = 'obj_barmenu_list';


	//CLICK ON FOLDER
	this.__body.onclick = function(e){
		var e = e || window.event;
		var elm = e.target || e.srcElement;

		if (elm.tagName == 'DIV' && elm.id){
			var id = elm.id.substr(me._pathName.length+1);

			if (!me.__aData[id]) return;

			if (me._onclick)
				me._onclick(me.__aData[id]);
		}
	};

	this.__body.oncontextmenu = function (e){
		var e = e || window.event;
		var elm = e.target || e.srcElement;

		if (elm.tagName == 'DIV' && elm.id){
			var id = elm.id.substr(me._pathName.length+1);

			if (me._oncontext)
			    me._oncontext(me.__aData[id]);
		}
		
		return false;
	};


//**** DEBUG ****
 /*
    var aData = [{title:'Inbox',arg:{aid:'admin@merakdemo.com',fid:'INBOX'}},
	    		{title:'cina',arg:{aid:'admin@merakdemo.com',fid:'cina'}},
	            {title:'Calendar',arg:{aid:'admin@merakdemo.com',fid:'Events'}},
	            {title:'Calendar',arg:{aid:'adminsss@merakdemo.com',fid:'Events'}},

        {title:'eeee',arg:{aid:'admin@merakdemo.com',fid:'AAAAAxx/eeee'}}];

	this._fill(aData);
	*/
/**/




	//**** Drag and Drop ****
	this.__dndtimer = '';
	this.___lastdragover;
	this.__body.onmousedown = function(e){

		if (me.__dndtimer)
			window.clearTimeout(me.__dndtimer);

		var e = e || window.event;
		if (e.button>1) return;
		var elm = e.target || e.srcElement;

		if (elm == this || elm.tagName!='DIV' || !elm.id) return;
		
		//fire the event :)
		var id = elm.id.substring(me._pathName.length+1),
			x = e.clientX,
			y = e.clientY;
		me.__dndtimer = setTimeout(function(){
			me.__initdrag(id,x,y);
		},500);
	};


	this.__body.onmouseup = function(e){
        //stop DnD
		if (me.__dndtimer)
			window.clearTimeout(me.__dndtimer);
	};
};

/**
 * aData = [{title:'Inbox',css:'',arg:{aid:'admin@merakdemo.com',fid:'INBOX'}}]
 **/
_me._fill = function(aData){

	// check data
	if (aData) this.__aData = aData;
	if (!Is.Array(this.__aData)) return;
	
	// get datasets
	var str  = '';

	for (var i=0;i<this.__aData.length;i++)
		str += '<div id="'+this._pathName +'/'+ i +'" title="'+ this.__aData[i].title.escapeHTML().replace(/"/g, '&quot;') + (this.__aData[i].css?'" class="'+this.__aData[i].css+'"':'')+'>'+ this.__aData[i].title +'</div>';

	this.__body.innerHTML = str;
	
	if (str)
		this._size(this.__aData.length*this._item_height);
	else
		this._size(0);
};

_me.__update = function (sName,sDPath){

	//refresh is prohibited during drag state
	if (this.__norefresh){
		this.__norefresh++;
		return;
	}

	if (this._listener == sName)
		this._fill(dataSet.get(this._listener,this._listenerPath));
	else
		this._fill();
};

//*** Drag and Drop - Create ***
_me.__initdrag = function(id,x,y){
	if (this.__aData[id])
		gui.frm_main.dnd.create_drag('<div class="drag_barcell'+ (this.__aData[id].css?' '+this.__aData[id].css:'') +'">'+this.__aData[id].title+'</div>', {type:this._dragType,value:[this.__aData[id].arg]}, x, y);
};

//*** Drag and Drop - Catch ***
_me._active_dropzone = function(v){
	if (v)
		this.__norefresh = 1;
	else{
        this._ondragout();
        
		if (this.__norefresh>1){
			if (this._listener){
				this.__norefresh = 0;
			    this.__update(this._listener,this._listenerPath);
			}
		}
		else
			this.__norefresh = 0;
	}
};



_me._ondragover = function(v){

 	if (this.__aData.length>=this.__maxcount) return false;
 	
    var iScroll = this.__body.scrollTop,
		aElm = this.__body.getElementsByTagName('DIV'),
		size,tmp = '';

	for(var i = 0; i<aElm.length; i++){
		size = getSize(aElm[i]);

        if (v.y>=size.y-iScroll && v.y<=size.y+this._item_height-iScroll){

			tmp = (size.y - v.y) > (this._item_height/2)?'b':'t';

			if (this.___lastdragover && (this.___lastdragover != aElm[i] || this.___lastdragpos != tmp)){
				removecss(this.___lastdragover,'dragover_'+this.___lastdragpos);
				this.___lastdragpos = this.___lastdragover = null;
			}
			if (!this.___lastdragpos){
				this.___lastdragover = aElm[i];
				this.___lastdragpos = tmp;

				addcss(aElm[i],'dragover_'+this.___lastdragpos);
			}
		}
	}

	// DRAG over Title
	if (tmp === '' && aElm[0]){

		size = getSize(aElm[0]);
	    if (v.y<size.y+iScroll){
	     	if (this.___lastdragover){
				if (this.___lastdragover != aElm[0] || this.___lastdragpos != 't'){
					removecss(this.___lastdragover,'dragover_'+this.___lastdragpos);

		        	this.___lastdragover = aElm[0];
		        	this.___lastdragpos = 't';
		        	addcss(aElm[0],'dragover_t');
				}
			}
			else{
	        	this.___lastdragover = aElm[0];
	        	this.___lastdragpos = 't';
	        	addcss(aElm[0],'dragover_t');
			}
		}
	}

	return true;
};

_me._ondragout = function(){
	if (this.___lastdragover)
		removecss(this.___lastdragover,'dragover_'+this.___lastdragpos);

	this.___lastdragover = null;
	this.___lastdragpos = null;
};

_me._ondrop = function(v){

	if (this.__maxcount && this.__aData.length>=this.__maxcount) return false;
	
	for(var i = 0; i<this.__aData.length;i++){


	}
};