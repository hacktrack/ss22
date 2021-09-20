_me = obj_player.prototype;
function obj_player(){};

_me.__constructor = function() {

	this.__seekable	= false;

	this.btn_play._onupdate = function (aData){

		switch(aData.action){


		case 'timerupdate':
			if (aData.value){
				var st = IcewarpDate.unix(Math.ceil(aData.value.currentTime)).format('mm:ss');
				if (!this._parent.timeline.__mousedn)
					this._parent.timeline._value(aData.value.currentTime); //Math.ceil(aData.value.currentTime)

				this._parent.lbl_time._value(st);
			}

		case 'durationchange':
			if (aData.value){
				this._parent.timeline._range(Math.floor(aData.value.duration));
				this._parent.__seekable = true;
			}

			break;


		case 'ended':
			// default values
			this._parent.lbl_time._value('00:00');
			this._parent.timeline._value(0);

			// play next...

			break;
		}
	};

	var cursor = mkElement('div',{className:'text'});
	this.timeline._main.appendChild(cursor);

	this.timeline._onmousemove = function(e){
		var r = this._range();

		if (this._parent.__seekable && r>1){

			// marker
			var pos = getSize(this._main);
			if (e.clientX>=pos.x && e.clientX<=pos.x+pos.w){

				var st = IcewarpDate.unix(Math.round(r*((e.clientX - pos.x)/(pos.w)))).format('mm:ss');

				cursor.style.left = (e.clientX - pos.x) + 'px';
				cursor.innerHTML = '<span>'+ st +'</span>';

				// seek time
				this.__seekto = (e.clientX - pos.x)/(pos.w/100);

				if (this.__mousedn)
					this._parent.timeline._value(/*Math.round*/(r*((e.clientX - pos.x)/(pos.w))));
			}
		}
		else
			cursor.innerHTML = '';
	};

	this.timeline._onmousedown = function(e){
		if (this._parent.__seekable){
			var pos = getSize(this._main);
			if (e.clientX>=pos.x && e.clientX<=pos.x+pos.w){

				this._parent.btn_play._pause();

				this.__mousedn = true;
				this._onmousemove(e);

				gui._obeyEvent('mouseup', [this._parent,'__dispatch']);
			}
		}
	};
};

_me.__dispatch = function(){

	this.timeline.__mousedn = false;

	if (this.__seekable)
		this.btn_play._seek(this.timeline.__seekto);

	return false;
};

_me._disabled = function(b){
	return this.btn_play._disabled(b);
};

_me._value = function(aData){
	if (Is.Array(aData)){
		this.btn_play._src(aData[0].src, aData[0].title);
		this.lbl_title._value(aData[0].title);
	}
};

_me._src = function(s){
	return this.btn_play._src(s);
}
_me._title = function(s){
	this.lbl_title._value(s);
	return this.btn_play._title(s);
};
