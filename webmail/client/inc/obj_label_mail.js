_me = obj_label_mail.prototype;
function obj_label_mail(){};

_me._onclick = function(e){
	var v = this._value();

	if (v && (v = MailAddress.createEmail('',v)))
		NewMessage.compose({to:v});
};