_me = obj_frame_control.prototype;
function obj_frame_control(){};

_me.__constructor = function(){
	var me = this;
	this._getAnchor('header').onclick = function(e){
		var e = e || window.event;
		var elm = e.target || e.srcElement;

		if (elm.tagName != 'A' || !elm.id) return;

		//Nak to nefunguje, ovlada to main window
		switch(elm.id.substr(me._pathName.length+1)){
		case 'home':
		    if (me._homepage)
		        me._src(me._homepage);
		    break;
		case 'back':
				//inspect(me.__doc,1);
				me.__eFrame.contentWindow.history.back();
			break;
		case 'next':
				me.__eFrame.contentWindow.history.forward();
			break;
		}
	};
};