/*****************************************************
 * Extension script: TextArea form object
 *
 * INHERITS FROM obj_form_generic
 *    _me._value
 *    _me._disabled
 *    _me.__update
 *
 *****************************************************/

_me = obj_button_play.prototype;
function obj_button_play(){};

/**
* @brief: CONSTRUCTOR, create button HTML element to __eIN variable
* @date : 20.4.2006 17:24:21
**/
_me.__constructor = function(){
	this.__media = [];

	this._disabled(true);

	this._add_destructor('__destructor');		
};

_me._src = function(sSrc, sTitle){
	if (Is.String(sSrc)){

		this.__media = sSrc;
		
		if (sTitle)
			this._title(sTitle);

		this._disabled(false);

		gui.audio._obeyEvent('player', [this,'__update'], this.__media);
	}
};

_me._seek = function(iPercent){
	if (this.__check())
		gui.audio._seek(iPercent);
};

_me._pause = function(){
	if (this.__check())
		gui.audio._pause();
};

_me._play = function(){
	if (this.__check())
		gui.audio._play();
};


_me._onclick = function(){
	if (this.__media){
		if (this.__check())
			gui.audio._playpause();
		else
			gui.audio._value(this.__media, (this._title() || getLang('AUDIO::PLAYER'))/*, [this,'__update']*/);
	}
};

///////////////////////////////////

_me.__check = function(){
	return gui.audio._value() == this.__media;
	//return gui.audio.__handler && gui.audio.__handler[0] && getCallbackFunction(gui.audio.__handler[0]) === this.__update && gui.audio.__handler[1] == this.__media;
};

_me.__update = function (aData){
	if (aData){
		if (aData.src != this.__media)
			aData.action = 'ended';

		switch(aData.action){
			case 'play':
				addcss(this._main,'pause');
				break;
			case 'ended':
			case 'pause':
				removecss(this._main,'pause');
				break;
		}

		if (this._onupdate)
			this._onupdate(aData);
	}
};

_me.__destructor = function(){
	if (this.__media)
		gui.audio._disobeyEvent('player', [this,'__update']);		
};