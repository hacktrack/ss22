_me = frm_video.prototype;
function frm_video(){};

/**
 * License
 */         
_me.__constructor = function(remoteStream, localStream) {

	if (!remoteStream)
		if (localStream){
			this._title("DIAL::LOCALCAM");
			remoteStream = localStream;
			localStream = null;
		}
		else{
			this._destruct();
			return;
		}		
	else
		this._title("DIAL::REMOTECAM");


	var me = this;

	this._defaultSize(-1,-1,450,300);

	this._draw('frm_video', 'main');

	this._create('loader', 'obj_loader');
	
	// Prepare video
	this.__video = remoteStream;
	this.__video.className = 'remote';

	if(this.__video.nodeName=='OBJECT') {
		if (this.loader)
			this.loader._destruct();

		this._getAnchor('video').appendChild(this.__video);

		// Only show own camera if available
		if (localStream) {
			localStream.className = 'local';
			me._getAnchor('video').appendChild(localStream);
		}

		this.__video.width = 640;	// videoTrackWidth
		this.__video.height = 480;	// videoTrackHeight
	} else {
		this.__video.onplaying = function(e){
			this.onplaying = null;

			if (me.loader)
				me.loader._destruct();

			try{
				me._getAnchor('video').appendChild(me.__video);
				me.__video.play();

				// Only show own camera if available
				if (localStream) {
					localStream.className = 'local';
					me._getAnchor('video').appendChild(localStream);
					localStream.play();
				}

				me._onresize();
			}
			catch(r){
				me._destruct();
			}

		};

		if(navigator.browser && navigator.browser.application=='Firefox') {
			// Temporary hack because FF does not set dimensions until after video started playing
			this.__video.ontimeupdate = function(e) {
				if(this.videoWidth) {
					me._onresize();
					this.ontimeupdate = null;
				}
			}
		}

		me._getAnchor('video').appendChild(me.__video);
		me.__video.play();

		// Only show own camera if available
		if (localStream) {
			localStream.className = 'local';
			me._getAnchor('video').appendChild(localStream);
			localStream.play();
		}

	}
	// MUTE
	this.mute._onclick = function(){
		if (gui.frm_main.sip)
			gui.frm_main.sip._mute(!gui.frm_main.sip._mute());
	};

	this.__video.onclick = function() {
		me._fullscreen(me.__video);
	}

	this._listen('sip');
};

_me._onresize = function(e, sType){
	if (!this.__position.max){
		
		var elm = this.__video;

		if (elm && elm.parentNode && elm.parentNode.clientHeight != elm.offsetHeight)
			switch(sType){
				case 't':
				case 'rt':
				case 'b':
					this._place(this.__position.x,this.__position.y,this.__position.w - (elm.parentNode.offsetWidth - ((elm.offsetWidth/elm.offsetHeight)*elm.parentNode.offsetHeight)), this.__position.h);
					break;

				case 'lt':
					this._place(this.__position.x,this.__position.y + elm.parentNode.clientHeight - elm.clientHeight, this.__position.w, this.__position.h - elm.parentNode.clientHeight + elm.clientHeight);
					break;

				default:
					this._place(this.__position.x,this.__position.y,this.__position.w, this.__position.h - elm.parentNode.clientHeight + elm.clientHeight);
			}
	}
};

_me._onclose = function(b){
	var sip = gui.frm_main.sip,
		act = dataSet.get('sip',['activity']);
	if (b && sip && act) {
		if(act == 'Phoning')
			sip._hangup();
		else
		if(act == 'Conference')
			sip._leave();
	} else return true;
};

_me.__update = function (){
	var ds = dataSet.get('sip');

	if (ds.muted)
		addcss(this.mute._main,'active');
	else
		removecss(this.mute._main,'active');

	switch(ds.type){
		case 'CallFinished':
		case 'CallCanceled':
			this._destruct();
			break;
	}
};
