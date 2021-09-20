_me = obj_dtmf.prototype;
function obj_dtmf(){};

/**
 * DTMF Keypad
 */         
_me.__constructor = function() {

    this._draw('obj_dtmf', 'main');

	// Add and handle dial pad
	this.btn_0._onclick = function(){
		var sip = gui.frm_main.sip,
		v = {btn_0:0,btn_1:1,btn_2:2,btn_3:3,btn_4:4,btn_5:5,btn_6:6,btn_7:7,btn_8:8,btn_9:9,btn_star:'*',btn_sharp:'#'}[this._name];
		if (sip && dataSet.get('sip',['activity'])=="Phoning")
			sip._dtmf(v);
		removecss(this._main, 'focus');
	};
	
	this.btn_1._onclick = this.btn_0._onclick;
	this.btn_2._onclick = this.btn_0._onclick;
	this.btn_3._onclick = this.btn_0._onclick;
	this.btn_4._onclick = this.btn_0._onclick;
	this.btn_5._onclick = this.btn_0._onclick;
	this.btn_6._onclick = this.btn_0._onclick;
	this.btn_7._onclick = this.btn_0._onclick;
	this.btn_8._onclick = this.btn_0._onclick;
	this.btn_9._onclick = this.btn_0._onclick;
	this.btn_star._onclick = this.btn_0._onclick;
	this.btn_sharp._onclick = this.btn_0._onclick;	

	//this._listen('sip');
};
/*
_me.__update = function (sDName){

	var ds = dataSet.get('sip');
	if (ds && ds.state == 'online')
		switch(ds.activity){
			case 'Phoning':
			case 'Conference':
				return;
		}

	this._destruct();		
};
*/
