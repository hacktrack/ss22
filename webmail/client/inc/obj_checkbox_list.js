/*****************************************************
 * Extension script: CheckBox form object, supports only boolean values!
 *
 * INHERITS FROM obj_form_generic
 *    _me._disabled
 *    _me.__update
 *
 *****************************************************/
 
_me = obj_checkbox_list.prototype;
function obj_checkbox_list(){};

	/**
	 * @brief: CONSTRUCTOR, create checkbox HTML element to __eIN variable
	 * @date : 20.4.2006 17:46:08
	 **/
	_me.__constructor = function(){

		// boolean switch for langs in title
		this._useslang = false;
		this.__disabled = false;
        
		var me = this;

		this._main.onclick = function(e){
            var e = e || window.event;
			var elm = e.target || e.srcElement;
            
            if (me.__disabled || (elm.tagName != 'INPUT' && elm.tagName != 'LABEL')) return;

			if (me._onclick) me._onclick(e);
			me.__exeEvent('onclick',e,{"owner":me});
		};
	};

	/**
	 * @brief: create list of checkboxes
	 * @date : 20.9.2006 14:20:50
	 **/
	_me._fill = function(aData){

		var elm0,elm1,elm2;
		for(var i=0;i<aData.length;i++){
			elm0 = mkElement('div');
			elm1 = mkElement('input',{"type":'checkbox',"name":this._pathName+'/'+i,"id":this._pathName+'/'+i});

			elm0.appendChild(elm1);

			//title
			if (aData[i]){
				elm2 = mkElement('label',{"for":this._pathName+'/'+i});
				elm2.innerHTML = this._useslang?getLang(aData[i]):aData[i];
				elm0.appendChild(elm2);
			}

            this._main.appendChild(elm0);
			elm1.className = this._type;
			
			// clear memory
			elm0 = elm1 = elm2 = null;
		}
	};
	
	/**
	 * @brief : control elements "checked" status
	 * @param : v - array of checkbox ids
	 * @return: array of checkbox ids;
	 * @date  : 20.4.2006 17:42:24
	 **/
	_me._value = function(v)
	{
		if (typeof v == 'object')
		{
			var bChecked;
			
			for(var i=0;i<this._main.elements.length;i++)
			{
				bChecked = false;

				for(var n in v)
					if (v[n] == i)
					{
						bChecked = true;
						break;
					}
					
				if (bChecked)
					this._main.elements[i].checked = true;
				else
					this._main.elements[i].checked = false;
			}
		}
		else
		{
			v = [];
			for(var i=0;i<this._main.elements.length;i++)
				if (this._main.elements[i].checked)
					v.push(i);

			return v;
		}
	};
	
	_me._disabled = function(b){
		this.__disabled = b = (b==true);
		for(var i=0;i<this._main.elements.length;i++)
			this._main.elements[i].disabled = b;
	};
	
	_me.__update = function (sDataSet){

		if (!sDataSet) return;

		if (this._listener == sDataSet)
			this._value(dataSet.get(this._listener,this._listenerPath));
		else
		if (this._listener_data == sDataSet)
		    this._fill(dataSet.get(this._listener_data,this._listenerPath_data));
	};
