_me = frm_send_message.prototype;
function frm_send_message(){};

_me.__constructor = function(aValues) {
	var me = this;
	this._size(400,330,true);
	this._modal(true);

	this._title('FILTERS::MESSAGE');
	this._draw('frm_send_message', 'main');

	var aTransformedValues = {};
	for (var i in aValues)
		aTransformedValues[i] = aValues[i][0]['VALUE'];

	loadDataIntoForm(this, aTransformedValues);

	this.x_btn_ok._onclick = function() {
		var aTransformedValues = {};
		storeDataFromForm(me, aTransformedValues);
		if (aTransformedValues['SENDTYPE'] == '0') aTransformedValues['SENDTYPE'] = '';

		for (var i in aTransformedValues)
			if (aTransformedValues[i] != '')
				aValues[i] = [{'VALUE': aTransformedValues[i]}];
			else
				delete aValues[i];

		me._destruct();
	};
	this.FROM._focus();
};
