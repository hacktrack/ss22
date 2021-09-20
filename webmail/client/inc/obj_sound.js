_me = obj_sound.prototype;
function obj_sound(){};

/*
 *	Object to play audio that will be used multiple times
 *	(for example system notification audio)
 *
 *	Audio object will be kept with url
*/

_me.__constructor = function(){
	// this._main.style.position = 'absolute';
	// this._main.style.left = '-100px';
	// this._main.style.top = '-100px';

	// Audio file name definitions
	// Add play name and filename here to add more sounds
	this.__sounds = {
		mail: 'msg.mp3',
		chat: 'chat.mp3',
		im: 'im.mp3',
		im_out: 'im_out.mp3'
	};

	// Holder for audio elements
	this.__audio = {};
};

_me._play = function(sName){
	// Check if we have a file to play for this sound
	if (this.__sounds[sName]) {

		// Create audio element
		if(!this.__audio[sName]) {
			this.__audio[sName] = new Audio();
			this.__audio[sName].__loaded = false;
			this.__audio[sName].src = 'client/inc/sound/'+this.__sounds[sName];
			this.__audio[sName].oncanplaythrough = function(){
				this.__loaded = true;
				try{ this.play() } catch(r){}
			};
			this.__audio[sName].onended = function(){
				delete this.__audio[sName];
			}.bind(this);
		}

		// Play sound
		if (this.__audio[sName] && this.__audio[sName].__loaded && this.__audio[sName].paused){
			try{ this.__audio[sName].play() } catch(r){}
		}
	}
};
