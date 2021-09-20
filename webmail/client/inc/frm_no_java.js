_me = frm_no_java.prototype;
function frm_no_java(){};

_me.__constructor = function(aResponse, sLabel1, sLabel2, aSubstitution, sOKLabel, sCancelLabel, sCancel2Label) {
	var me = this;

	// Restore button css
	removecss(this.x_btn_ok._main,'ok','color1');
	removecss(this.x_btn_cancel._main,'cancel');
	removecss(this.x_btn_cancel2._main,'cancel');

	// Add general Java remarks
	this._draw('frm_no_java','message',{message: this.obj_label._value()});

	// Link button to adminstrator
	this.x_btn_ok._value('ERROR::CONTACTADMIN');
	addcss(this.x_btn_ok._main,'send');
	this.x_btn_ok._onclick = function() {
		window.open('/#support','menubar=no,resizable=yes,status=no,location=no');
		me._destruct();
	}

	// Link button to support page
	this.x_btn_cancel._value('ERROR::TROUBLESHOOT');
	addcss(this.x_btn_cancel._main,'settings');
	this.x_btn_cancel._onclick = function() {
		window.open('http://www.icewarp.com/support/troubleshoot_webphone/?lang='+GWOthers.getItem('LAYOUT_SETTINGS','language'),'menubar=no,resizable=yes,status=no,location=no');
		me._destruct();
	}

	// Second cancel button will act as accept fact
	this.x_btn_cancel2._value('FORM_BUTTONS::OK');
	addcss(this.x_btn_cancel2._main,'ok');

	// Adjust size
	this._size(500,300,-1,-1)

};