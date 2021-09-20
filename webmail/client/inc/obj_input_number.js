_me = obj_input_number.prototype;
function obj_input_number(){};

_me.__constructor = function(){
	var me = this;

	this.__range = [];

	this.__setMask({
			'sub':['&#xe043;','',2],
			'add':['&#xe044;','',2]
		},
		[function(id){
			if (!me._disabled()){

				var i = parseInt(me._value(),10) || 0;

				switch(id){
				case 'add':
					if (!Is.Number(me.__range[1]) || i<me.__range[1])
						me._value(i + 1);
					break;

				case 'sub':
					if (!Is.Number(me.__range[0]) || i>me.__range[0])
						me._value(i - 1);
				}
				if(!me.__check()) {
					me._value(i);
				}
			}
		}],
		true
	);

	this._obeyEvent('onkeyup',[function(e){
		var v = me.__eIN.value.replace(/[^0-9]/g,'') || 0;

		if (Is.Number(me.__range[0]))
			if (v < me.__range[0]) v = me.__range[0];

		if (Is.Number(me.__range[1]))
			if (v > me.__range[1]) v = me.__range[1];

		me.__eIN.value = v;
	}]);
};

_me._range = function(a,b){
	this.__range = [a,b];
};
