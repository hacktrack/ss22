_me = obj_call.prototype;
function obj_call(){};

_me.__constructor = function() {

	this._zindex.zindex = [9000];

	this._listen('sip');
	dataSet.obey(this, '_listener_data', 'xmpp', true);

	this._add_destructor('__destructor');

	this.__placeElement = null;
};

_me._placeElement = function(elm){

	if (elm){
		this.__placeElement = elm;
	}

	if (this.__placeElement){
		var pos = getSize(this.__placeElement);
		this._place(pos.x+pos.w, pos.y+(pos.h/2));
	}
	else
	if (this.__position){
		this.__onGuiResize();
	}
};

_me.__avatar = function(sEmail){

	if (!sPrimaryAccountGW) return;

	var me = this,
		sURL = getAvatarURL(sEmail),
		img = new Image(),
		anchor = me._getAnchor('avatar');

	if (anchor){
		img.onload = function(){

			if (!anchor || !anchor.parentNode)
				return;

			try{
				var tmp, elm;
				if (!(tmp = anchor.getElementsByTagName('b')) || !(elm = tmp[0])){
					elm = mkElement('b');
					anchor.appendChild(elm);
				}
			}
			catch(r){
				return;
			}

			if (elm){
				if (this.height>10 && this.width>10){

					if (currentBrowser() == 'MSIE7'){

						var img = mkElement('img',{src:sURL});
						if (this.width>this.height){
							var r = this.height/elm.clientHeight;
							img.style.height = '100%';

							if ((this.width/r)>elm.clientWidth)
								img.style.right = (((this.width/r)-elm.clientWidth)/2) + 'px';
						}
						else{
							var r = this.width/elm.clientWidth;
							img.style.width = '100%';

							if ((this.height/r)>elm.clientHeight)
								this.style.bottom = (((this.height/r)-elm.clientHeight)/2) + 'px';
						}

						elm.appendChild(img);
						elm.style.backgroundImage = 'none';
					}
					else
						elm.style.backgroundImage = 'url("'+ sURL +'")';

					elm.style.backgroundColor = '#FFFFFF';
				}
				else{
					elm.style.backgroundImage = '';
					elm.style.backgroundColor = '';
				}
			}
		};

		img.src = sURL;
	}
};

_me.__update = function(sDName){

	var ds = dataSet.get('sip'),
		im = false,
		sInfo = '';

	if (!ds) return;

	if (ds.p1){
		switch(dataSet.get('xmpp',['roster',ds.p1,'show'])){
			case 'online':
			case 'away':
			case 'xa':
			case 'dnd':
				im = true;
				break;
		}
	}

	if (sDName && this.__lastActivity && this.__lastActivity==ds.activity+'/'+ds.muted+'/'+(im?'im':''))
		return;

	switch(ds.activity){
		case 'Calling':
			this._fill([
				{anchor:'avatar', css:'avatar', keep:true},
				{title:'DIAL::HANG_UP', css:'big ico hangup color2', arg:'hangup'}
			]);

			sInfo = getLang('DIAL::CALLING');
			break;

		case 'Phoning':
			var time = this.clock && this.clock._value() || '0:00',
				tmp = [{anchor:'avatar', css:'avatar', keep:true}];

			if (this.__dtmf)
				tmp.push({anchor:'keypad', css:'keypad', keep:true});
			else
				tmp.push({title:'DIAL::KEYPAD', css:'big ico dial', arg:'dial', keep:true});

			if (im)
				tmp.push({title:'IM::IM',css:'big ico chat', arg:'im'});

			tmp.push({title:'DIAL::MUTE', css:'big ico mute'+(ds.muted?' active':''), arg: 'mute', keep: true});

			// if(!ds.video)
			// 	tmp.push({title: 'DIAL::ADD_VIDEO', css:'big ico video', arg: 'add_video', keep: true});

			if(!ds.video)
				tmp.push({title: this.__holding?'DIAL::UNHOLD':'DIAL::HOLD', css:'big ico hold'+(ds.onhold?' active':''), arg: 'hold', keep: true});

			tmp.push({title:'DIAL::HANG_UP', css:'big ico hangup color2', arg:'hangup'});

			this._fill(tmp);

			if (this.__dtmf)
				this._create('dtmf','obj_dtmf','keypad');

			this._create('clock','obj_label','avatar','lbl_clock')._value(time);
			this._startTimer();

			sInfo = getLang('DIAL::CALLESTABLISHED');
			break;

		case 'Ringing':
			var tmp = [{anchor:'avatar', css:'avatar',keep:true}];

			tmp.push({title:'DIAL::DECLINE',css:'big ico decline color2',arg:'decline'});
			tmp.push({title:'DIAL::ANSWER', css:'big ico '+(dataSet.get('sip',['remote','video'])?'video':'answer')+' color3x', arg:'answer', keep:true});
			this._fill(tmp);

			sInfo = getLang('DIAL::INCOMINGCALL');
			break;

		default:
			// No phone activity, remove calling dropdown
			this._destruct();

			if (gui.video)
				gui.video._destruct();

			return;
	}

	//refresh info
	var name = dataSet.get('sip',['remote','name']) || dataSet.get('sip',['remote','id']);
	if (name && sInfo && ds.type!='Info') {
		this.__avatar(dataSet.get('sip',['remote','id']));
		this._create('label','obj_label','avatar','lbl_action')._value(sInfo);
		this._create('user','obj_label','avatar','lbl_user')._value(name.indexOf('@')>0?name.substr(0,name.indexOf('@')):name);
	}

	this.__lastActivity = ds.activity+'/'+ds.muted+'/'+(im?'im':'');

	this._placeElement();
};

_me._startTimer = function(){
	if (this.__interval)
		window.clearInterval(this.__interval);

	var me = this;
	this.__interval = window.setInterval(function(){

		var t = new IcewarpDate(dataSet.get('sip',['timer']));

		if (me.clock && t && (t = new IcewarpDate().unix() - t.unix())){

			var h = Math.floor(t/3600),
				m = Math.floor(t%3600/60),
				s = Math.floor(t%60),
				pad = function(v){
					return v<10?'0'+v:v;
				};

			me.clock._value((h?h +':' + pad(m):m) +':'+ pad(s));
		}
	},1000);
};

_me._onclose = function(){
	switch(dataSet.get('sip',['activity'])){
		case 'Calling':
		case 'Ringing':
		case 'Phoning':
			return false;
	}
};

_me._onclick = function(e, elm, id, arg){
	var sip = gui.frm_main.sip;
	if (sip)
		switch(arg){
			case 'im':
				var usr = dataSet.get('sip',['p1']);
				if (usr && gui.frm_main.im)
					gui.frm_main.im._chat(usr);

				break;
			case 'dial':
				this.__dtmf = true;
				this.__update();
				break;
			case 'mute':
				sip._mute(!sip._mute());
				break;
			case 'hold':
				var hold = !sip._hold();
				sip._hold(hold);
				this.__holding = hold;
				this.__update();
				break;
			case 'answer':
				sip._answerCall();
				break;
			case 'answer_video':
				sip._answerCall(true);
				break;
			// case 'add_video':
			// 	sip._addVideo();
			// 	break;
			case 'decline':
				sip._declineCall();

				//open decline dialog

				break;
			case 'hangup':
				sip._hangup();
				break;
		}

};

_me.__destructor = function(){
	if (this.__interval)
		window.clearInterval(this.__interval);
};