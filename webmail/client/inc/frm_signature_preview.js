_me = frm_signature_preview.prototype;
function frm_signature_preview(){};

_me.__constructor = function(sSignature) {
	var signatureContainer, me = this;


	this._size(450,300,true);
	this._modal(true);
	this._dockable(false);
	this._resizable(true);

	this._title('SIGNATURE::PREVIEW');

	signatureContainer = mkElement('div', {className: 'signature_container'});

	signatureContainer.innerHTML = sSignature;

	this.__eMain.appendChild(signatureContainer);

	this._create('x_btn_ok', 'obj_button', 'footer', 'noborder ok');
	this.x_btn_ok._value('FORM_BUTTONS::CLOSE');
	this.x_btn_ok._onclick = function() {
		me._destruct();
	};

	this.x_btn_ok._focus();
};