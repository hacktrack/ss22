/**
 * Page Title management object
 **/
_me = obj_title.prototype;
function obj_title(){};

_me.__constructor = function() {
	this.__buffer = [[document.title]];
	this._add_destructor('__destructor');

	gui._obeyEvent('blur',[this,'_reset']);
};

/**
 * @params:	sTitle	- title text
 *			iTime   - number of seconds
 *			bForce	- always remove
 **/
_me._add = function(sTitle,iTime,bForce){
	if (iTime){
		var id = unique_id();
		document.title = sTitle;
		this.__buffer.push([sTitle, id, iTime, setTimeout('try{'+this._pathName+'._remove('+ id +','+ (bForce?'true':'false') +');}catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}', iTime*1000)]);
		return id;
	}
	else{
		this.__buffer[0] = [sTitle];
		if (this.__buffer.length == 1)
			document.title = sTitle;

		return 0;
	}
};

_me._reset = function(){
	if (this.__buffer[0]){
		this.__buffer = this.__buffer.splice(0,1);
		this._refresh();
	}
};

_me._remove = function(id, bForce){

	if (typeof id != 'undefined')
		for(var i = 1; i<this.__buffer.length; i++)
			if (this.__buffer[i][1] == id){

				clearTimeout(this.__buffer[i][3]);

				if (bForce || gui.__focus)
	 				this.__buffer.splice(i,1);
				else
					this.__buffer[i][3] = setTimeout('try{'+this._pathName+'._remove('+ id +');}catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}', (this.__buffer[i][2])*1000);

				break;
			}

	this._refresh();
};

_me._refresh = function(bForce){
	//has to be different to work from onpopstate()
	if (bForce)
		document.title = '';

	document.title = this.__buffer[this.__buffer.length-1][0];
};

_me.__destructor = function(){
	gui._disobeyEvent('blur',[this,'_reset']);
	document.title = this.__buffer[0][0];
};