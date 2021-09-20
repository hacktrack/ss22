_me = obj_input_search_next.prototype;
function obj_input_search_next(){};

/**
 * @brief: CONSTRUCTOR,
 * @date : 21.3.2007 13:19:41
 **/
_me.__constructor = function(){
	var me = this;

	this.__setMask({
			'next':['&#xe043;',getLang('COMMON::NEXT')],
			'prev':['&#xe044;',getLang('COMMON::PREVIOUS')],
			'clear':['&#xe036;',getLang('COMMON::CLEAR')]
		},
		[function(id){
			switch(id){
			case 'clear':
		        if (me._onsubmit){
		        	me._value('');
		        	me._onsubmit();
		        }
		        else
		        if (me._onkeyup)
		        	me._onkeyup({keyCode:27});

		        me._focus();
		    	break;

		    case 'next':
				if (me._onnext && me._value())
					me._onnext();
				break;

		    case 'prev':
				if (me._onprev && me._value())
					me._onprev();
			}
		}]
	);

};