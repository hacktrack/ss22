function obj_subscriber(){};

obj_subscriber.prototype = {
	__constructor:function(){

		//Auto re-subscribe on disconnect
		var relogin = false;
		gui.socket.api._obeyEvent('onstatechange', [function(iState){
			if (iState == 0){
				relogin = true;
			}
			else
			if (iState == 2 && relogin){
				relogin = false;
				this.__subscribe();
			}
		}.bind(this)]);

		this.__subscribe();
	},
	__subscribe: function(){
		gui.socket.api._subscribe('ALL');
	}
};