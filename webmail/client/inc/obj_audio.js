_me = obj_audio.prototype;
function obj_audio(){};

_me.__constructor = function() {

	this.__dockable = true;
	this.__closable = true;

	var me = this;

	// HTML5 <audio> tag is supported in Internet Explorer 9+, Firefox, Opera, Chrome, and Safari
	this.__audio = mkElement('audio') || null;

	//IE9 Server 2008 fix
	try{
		if (this.__audio && this.__audio.canPlayType && this.__audio.canPlayType('audio/mpeg;').replace(/no/, '')){
		    this.__audio.loadedPercent = 100;
		    this.__audio.duration = 0;

		    this.__audio.skipTo = function(percent) {
				if (percent > this.loadedPercent) return;
				this.currentTime = this.duration * (percent/100);
			};

			this.__audio.setVolume = function(percent) {
				this.volume = percent;
			};
		}
		else
			this.__audio = null;
	}
	catch(r){
		this.__audio = null;
		return;
	}

	if (this.__audio){

		this.__audio.onplay = function(){
			this.__skip_playing = false;
			this.__skip_docking = false;
			me._dock();
			me._exe('play', {duration:this.duration, currentTime:this.currentTime});
		};

		this.__audio.onpause = function(){
			if (me._docked)
				me._dock();

			me._exe('pause', {duration:this.duration, currentTime:this.currentTime});
		};

		// show in dock
		this.__audio.oncanplay = function(){
			me._dock();
			me._exe('canplay');
		};

		// ready to play, start playing automatically
		this.__audio.oncanplaythrough = function(){
			if (this.__skip_playing || !this.src)
				return;

			if (me._docked)
				me._dock();

			this.loadedPercent = 100;

			me._exe('canplaythrough');
			setTimeout(function(){ me._play() }, 0);
		};

		this.__audio.ontimeupdate = function(){
			me._docktimer();
			me._exe('timerupdate', {duration:this.duration, currentTime:this.currentTime});
		};

		this.__audio.ondurationchange = function(){
			me._docktimer();

			me._exe('durationchange', {duration:this.duration, currentTime:this.currentTime});
		};

		this.__audio.onended = function(){

			if (me.__dockable){
				me._docked = false;

				var dock = me._mydock || gui._dock;
				if (dock)
					dock._remove(me,true);
			}

			me._exe('ended');

			//Clear SRC, Chrome fix
			this.removeAttribute('src');
		};

		this.__audio.onvolumechange = function(){};
		this.__audio.onseeked = function(){
			me._exe('seeked', {duration:this.duration, currentTime:this.currentTime});
		};
	}
	else
		console.log('No <audio> support');

	// Destructor
	this._add_destructor('__destructor');
};

_me._value = function(src, sTitle, aHandler){
	if (this.__audio)
		if (Is.Defined(src)){

			if (this.__audio.src){
				this._pause();
				this.__audio.onended();
			}

			//bind controler
			if (aHandler)
				this._obeyEvent('player', aHandler, src);

			this.__audio.title = sTitle;

			if (src){
				this.__audio.setAttribute('autoplay',true);
				this.__audio.setAttribute('src', src);
				this.__audio.load();
			}
		}
		else
			return this.__audio.getAttribute('src') || '';

	return '';
};
_me._seek = function(i){
	if (this.__audio && this.__audio.src)
		this.__audio.skipTo(i || 0);
};
_me._play = function(){
	if (this.__audio && this.__audio.src)
		this.__audio.play();
};
_me._pause = function(){
	if (this.__audio)
		this.__audio.pause();
};
_me._playing = function(){
	return this.__audio && this.__audio.paused == false;
};

_me._playpause = function(){
	if (this.__audio){
		if (this.__audio.paused)
			this._play();
		else
			this._pause();
	}
};

_me._exe = function (action, value){
	var src = this._value();
	if (this._events && this._events['player'])
		for (var j in this._events['player'])
			if (!src || !this._events['player'][j][1] || this._events['player'][j][1] == src)
				if (!this._events['player'][j] || !Is.Object(this._events['player'][j][0]) || executeCallbackFunction(this._events['player'][j][0], {src:src, action:action, value:value}) === false)
					this._events['player'].splice(j, 1);
};

_me._dock = function (){
	var dock = this._mydock || gui._dock;

	if (this.__audio && !this.__audio.__skip_docking && this.__dockable && dock){

		var sTitle = this.__audio.title || getLang('AUDIO::PLAYER'),
			aCSS = [this._playing()?'pause':'play'];

		this._docked = true;
		this.__docktimer = dock._add(this,sTitle,aCSS.join(' '));

		this._docktimer();

		return true;
	}
};

_me._undock = function (){
	if (this.__dockable){
		if (this.__skipundock){
			this.__skipundock = false;
			this._docked = false;
			return true;
		}

		if (this.__audio){
			this._playpause();
			this._dock();
			return false;
		}
	}
};

_me._docktimer = function(){
	if (this.__docktimer)
		if (this.__docktimer.parentNode){
			var elm = this.__docktimer.getElementsByTagName('EM'),
				tim = this.__docktimer.getElementsByTagName('TIME');

			if (!elm || !(elm = elm[0])){
				elm = mkElement('EM');
				this.__docktimer.appendChild(elm);
			}

			if (!tim || !(tim = tim[0])){
				tim = mkElement('TIME');
				this.__docktimer.appendChild(tim);
			}

			elm.style.width = (this.__audio.duration>this.__audio.currentTime?Math.ceil(this.__audio.currentTime/(this.__audio.duration/100)):100) + '%';

			tim.innerHTML = IcewarpDate.unix(Math.ceil(this.__audio.currentTime)).format('mm:ss');
		}
		else
			this.__docktimer = null;
};

_me._close = function(){
	this.__skipundock = true;
	this.__audio.__skip_docking = true;
	this.__audio.__skip_playing = true;
	this._seek();
	this._pause();
};

_me.__destructor = function (){
	if (this.__audio){
		this._pause();
		this.__audio = null;
	}
	return true;
};