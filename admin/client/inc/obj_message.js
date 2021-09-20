function obj_message(){};
var _me = obj_message.prototype;
/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function(s){
	var me = this;

	this._draw('obj_message', '', {items:{}});
};

_me._init = function(popup,box,main,type,message,buttons){
	message = (Array.isArray(message) ? message : [message]).map(function(message) {
		return helper.htmlspecialchars(message);
	}).join('<br>');
	this._getAnchor('message').innerHTML = message;

	addcss(popup.main._main,'type_'+type);

	if(!buttons){
		main._create('btn_cancel','obj_button','buttons');
		main.btn_cancel._value("generic::continue");
		main.btn_cancel._addcss('text primary');
		main.btn_cancel._onclick=function(){
			popup._close();
		}
	}else{
		for(var i=0; i<buttons.length; i++){
			var btnname='btn_custom_'+i;
			main._create(btnname,'obj_button','buttons');
			var obtn=main[btnname];
			var button=buttons[i];

			obtn._text((button.value?button.value:''));
			obtn._addcss((button.type?button.type:'text primary'));

			if(button.onclick){
				obtn._onclick=function(){this.onclick(function(){popup._close();})}.bind(button);
			}else{
				if(button.method){
					switch(button.method){
						case 'close':
							obtn._onclick=function(){
								popup._close();
							};
						break;
					}
				}
			}
		}
	}

	switch(type){
		case 'error':

		break;
		case 'warning':

		break;
		case 'success':

		break;
	}

};

/////////////

gui.message={};
gui.message._init=function(settings){
	try
	{
		if(!settings.unique){settings.unique=false;}
		if(!settings.type){settings.type="success";}
		if(!settings.message){settings.message="";}

		switch(settings.type){
			case '0':
				settings.type="success";
			break;
			case '1':
				settings.type="warning";
			break;
			case '2':
				settings.type="error";
			break;
		}
		
		if(settings.type == 'error' && navigator && navigator.vibrate){
			navigator.vibrate(200);
		}

		if(gui._popupList)
		{
			for(var i=0; i<gui._popupList.length; i++){
				if(gui._popupList[i]._message && gui._popupList[i]._message.type==settings.type && gui._popupList[i]._message.unique){
					gui._popupList[i]._destruct();
				}
			}
		}

		var popup = gui._create('popup','obj_popup');

		popup._message=settings;

		popup._init({
			fixed:false,
			iwattr:{
				subtype:'message',
				width:'small'
			},
			name:'message',
			heading:{
				value:(settings.heading?settings.heading:'')
			},
			footer:'obj_message_footer',
			content:'obj_message'
		});

		popup.content._init(popup,popup.main._getAnchor('box'),popup.main,settings.type,settings.message,(settings.buttons?settings.buttons:false));

		return popup;
	}
	catch(e)
	{
		log.error(e);
	}
}
gui.message.error=function(text,heading,buttons,notunique){
	var popup = gui.message._init({
		type:'error',
		heading:(heading?heading:getLang('generic::message_error_heading')),
		message:text,
		buttons:buttons,
		unique:(notunique?false:true)
	});
	
	// ee -for fun
	if(gui.__sound_on){
		gui.frm_main.kaboom._play();
	}

	return popup;
}

gui.message.warning=function(text,heading,buttons,notunique){
	var popup = gui.message._init({
		type:'warning',
		heading:(heading?heading:getLang('generic::message_warning_heading')),
		message:text,
		buttons:buttons,
		unique:(notunique?false:true)
	});
	
	// ee -for fun
	if(gui.__sound_on){
		gui.frm_main.win._play();
	}

	return popup;
}

gui.message.success=function(text,heading,buttons,notunique){
	gui.message._init({
		type:'success',
		heading:(heading?heading:getLang('generic::message_success_heading')),
		message:text,
		buttons:buttons,
		unique:(notunique?false:true)
	});
}

gui.message.toast=function(text){
	var toast=gui.frm_main._getAnchor('toast');
	var toast_text=gui.frm_main._getAnchor('toast_text');
	var toast_close=gui.frm_main._getAnchor('toast_close');

	// ee -for fun
	if(gui.__sound_on){
		gui.frm_main.scrape._play(400,false,Math.random()*3300);
	}
	//

	toast.onclick=function(){
		//if(toast._timeout){clearTimeout(toast._timeout);}
		//toast.setAttribute('is-hidden',1);
		removecss(toast,'active');
		return false;
	};

	toast_text.innerHTML=helper.htmlspecialchars(text);
	//toast.setAttribute('is-hidden',1);
	addcss(toast,'active');
	toast._timeout=setTimeout(function(){
		//toast.removeAttribute('is-hidden');
		removecss(toast,'active');
		
		// ee -for fun
		if(gui.__sound_on){
			gui.frm_main.scrape._play(400,false,Math.random()*3300);
		}
		//
		
	},3000);

}
