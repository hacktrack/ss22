_me = frm_smilebox.prototype;
function frm_smilebox() {}

_me.__constructor = function (aResponse, x, y) {

	if (Is.Defined(x) && Is.Defined(y)) {
		x = gui._rtl ? x - 34 : x - 406;
		if(y > 255) {
			y -= 255;
		} else {
			y += 40;
			this._main.classList.add('arrow_top');
		}
		this._place(x, y, 410, 252);
	}

	this._create('emoji', 'obj_smilebox', 'main', '', aResponse);
};
