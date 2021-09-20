_me = obj_progress.prototype;
function obj_progress(){};

_me.__constructor = function(){
	this.__range = 100;
    this.__value = 0;
    
	this.__eBar = mkElement('div',{className:'bar'});
	this._main.appendChild(this.__eBar);
	
	this.__eText = mkElement('div',{className:'text'});
	this._main.appendChild(this.__eText);

	//Events
	var me = this;
	this._main.onmousemove = function (e){
		var e = e || window.event;
		if (me._onmousemove)
			me._onmousemove(e);
	};

	this._main.onclick = function (e){
		var e = e || window.event;
		if (me._onclick)
			me._onclick(e);
	};	

	this._main.onmousedown = function (e){
		var e = e || window.event;
		if (me._onmousedown)
			me._onmousedown(e);
	};		
	this._main.onmouseup = function (e){
		var e = e || window.event;
		if (me._onmouseup)
			me._onmouseup(e);
	};		
};

_me._range = function(i){
	if (!i) return this.__range;
	
	i = parseInt(i);
	if (i == NaN) i = 1;
	this.__range = i;
};

_me._value = function(i){

	if (!Is.Defined(i)) return this.__value;
	
	i *= 1;
	if (i == NaN) i = 0;
	this.__value = i;

	var no = 0;
	if (i>0){
		no = /*Math.ceil*/(i/(this.__range/100));
		no = no>100?100:no;
	}

	this.__eBar.style.width = no+'%';
	this.__eText.style.left = no+'%';

	for (var css='', i = Math.floor(no/10), j = 1;j<=i;j++)
		css += ' c'+(j*10);

	this.__eBar.className = 'bar' + css;

//	this.__eBar.innerHTML = (no>70)?'<span style="width:'+ ((no-70)/(no/100)) +'%"></span>':'';
};

_me._title = function(s){
	//direct call of innerHTML caused strange error in MSIE8
	try{
		this.__eText.innerHTML = '';
		s && this.__eText.appendChild(mkElement('span',{innerHTML:s}));
	}
	catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}
};
