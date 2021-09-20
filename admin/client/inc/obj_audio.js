_me = obj_audio.prototype;
function obj_audio(){};

_me.__constructor = function(){
	var me=this;
	var elm = mkElement('audio',{"name":this._pathName+'#main',"id":this._pathName+'#main'});
	this._main.appendChild(elm);
	this._main.setAttribute('style','display:none');
	
	this._playing=false;
	this._waiting=false;
	me.__volume=1;
	
	elm.className = this._type == 'obj_audio'?'obj_audio':'obj_audio ' + this._type;

	this._elm=elm;
	
	if(this.__attributes.title){
		//this._title(this.__attributes.title);
	}
	
	this._elm.onended=function(){
		if(me._onended){
			me._onended();
		}
	}
	
	this._types = {
		'mp3': 'audio/mpeg',
		'ogg': 'audio/ogg',
		'wav': 'audio/wav',
		'aac': 'audio/aac',
		'm4a': 'audio/x-m4a'
	}
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

_me._addSource=function(file){
	var me=this;
	var type=file.split('.');
		type=type[type.length-1].toLowerCase();
		
	if(me._types[type]){
		var source = mkElement('source',{"src":file,"type":me._types[type]});
		me._elm.appendChild(source);
	}else{
		log.error(['audio-addsource','unsupported file type "'+type+'"']);
	}
}

_me._stop=function(){
	if(this._waiting){
		clearTimeout(this._waiting);
		this._waiting=false;
	}
	if(this._playing){
		clearTimeout(this._playing);
		this._playing=false;
	}
	this._elm.pause();
	this._elm.currentTime=0;
}

_me._fadeOut=function(time,pause){
	if(!time){time=1000;}
	var me=this;
	me.__fadeout=setInterval(function(){
		me.__volume=me.__volume-25/time;
		if(me.__volume<0){
			me.__volume=0;
			clearInterval(me.__fadeout);
			if(pause){
				me._pause();
			}else{
				me._stop();
			}
			me._elm.volume=1;
			me.__volume=1;
		}else{
			log.log(['volume',me.__volume]);
			me._elm.volume=me.__volume;
		}
	},Math.round((1000/time)/(25/time)));
}

_me._pause=function(){
	if(this._waiting){
		clearTimeout(this._waiting);
		this._waiting=false;
	}
	if(this._playing){
		clearTimeout(this._playing);
		this._playing=false;
	}
	this._elm.pause();
}

_me._play=function(duration,delay,start){
	var me=this;
	me.__volume=1;
	me._elm.volume=1;
	me.__start=start;
	me.__duration=duration;
	
	if(this._waiting){
		clearTimeout(this._waiting);
	}
	
	if(delay){
		me._waiting=setTimeout(function(){
			me._elm.pause();
			if(!me.__continuous && !this.__continuous){
				me._elm.currentTime=0;
			}
			if(start){this._elm.currentTime=start/1000;}
			me._play(duration);
		},delay);
		return;
	}
	
	if(this._playing && !this.__continuous){
		clearTimeout(this._playing);
	}
	
	this._elm.pause();
	if(!me.__continuous){
		this._elm.currentTime=0;
	}
	if(start && !me.__continuous){this._elm.currentTime=start/1000;}
	me._elm.play();
	if(duration){
		me._playing=setTimeout(function(){
			if(me.__continuous){
				me._pause();
			}else{
				me._stop();
			}
		},duration);
	}
}

_me._playContinuous=function(duration,delay,start){
	var me=this;
	me.__continuous=true;
	me._play(duration,delay,start);
}

_me._onended=function(){
	var me=this;
	if(me.__continuous){
		me._playContinuous(me.__duration,false,me.__start);
	}
}

_me._isPlaying=function(){
	return (this._playing?true:false);
}