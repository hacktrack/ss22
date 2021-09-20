/*****************************************************
 * Extension script: Radio button form object
 *****************************************************/
 
_me = obj_radio.prototype;
function obj_radio(){};

/**
 * @brief: CONSTRUCTOR
 * @date : 20.4.2006 16:42:39
 **/
_me.__constructor = function(){
   this._listener_data;
   this._listenerPath_data;

   /* store parent FORM element */
   this.__parentFrm = document.forms[this._main.name];
};

   /**
    * @brief: Fill this._main elmement with obj_radio template
    * @param: aData (optional) - array of values as value,value or key:value
    * @date : 20.4.2006 16:42:47
    **/
   _me._fill = function (aData){
      /* if param aData is not set than retrieve data from dataset */

	  if (!aData) {
           if (!this._listener_data) return;
           aData = dataSet.get(this._listener_data,this._listenerPath_data);
      }

      /* create tmpData array of values for obj_radio template */
      var ii=0,rows = [];
      for(var i in aData) rows.push({"value":i,"label":getLang(aData[i]),"key":ii++});
      var tmpData = {"_ins":this._pathName,"row":rows};

      /* print output into _main element */
      this._main.innerHTML = template.exe(storage.template('obj_radio'),tmpData);

	  var me = this;
      var list = this._main.elements;
	  for (var i = list.length-1;i>=0;i--){
		  list[i].onclick = function(e){
			  e = e || window.event;
			  if (me._onchange) me._onchange(e);
			  me.__exeEvent('onchange',e,{"owner":me});
		  };
	  }
   };

   /**
    * @brief: Listen method for radio buttons value and description
    * @date : 20.4.2006 16:49:50
    * @param: sDataSet - name of DataSet
    * @param: sDataSet (optional) - path into current data set structure
    **/
   _me._listen_data = function(sDataSet,aDataPath){
      /* check input variables */
      if(sDataSet) return false;
      
      this._listener_data = sDataSet;
      if (typeof aDataPath == 'object') this._listenerPath_data = aDataPath;
      dataSet.obey(this,'_listener_data',sDataSet);
   };

   /**
    * @brief : Returns value of checked radio button
    *          Set checked property to radio button with given value
    * @param : v (SET mode if presnet) - value of radio button which should be checked
    * @return: value of checked radio button or NULL when r.b. doesn't exists
    * @date  : 20.4.2006 17:02:15
    **/
   _me._value = function (v){

      var elm;
 	  for (var i  = this.__parentFrm.elements.length-1; i>=0;i--){

          elm = this.__parentFrm.elements[i];

		  if (elm.tagName != 'INPUT' || elm.type != 'radio' || this._pathName != elm.name) continue;

          if (v == null){
			  if(elm.checked) return elm.value;
		  }
          else
          if (elm.value == v) {
              elm.checked = true;
              elm.onclick({'target':elm});
              return elm.value;
          }
      }

      return null;
   };

   /**
    * @brief: control html method "disabled" for current radio button array
    * @param: b - boolean parametr
    * @date : 20.4.2006 17:03:37
    **/
   _me._disabled = function(b){
	  var elm;
	  for (var i  = this.__parentFrm.elements.length-1; i>=0;i--){
          elm = this.__parentFrm.elements[i];
          if (elm.tagName != 'INPUT' || elm.type != 'radio' || this._pathName != elm.name) continue;
          elm.disabled = b;
      }
	  elm = null;
   };

   /**
    * @brief: Updata method, keeps data synchronized
    * @param: sDataSet - name of data set which is calling this method
    * @data : 20.4.2006 17:04:02
    **/
   _me.__update = function (sDataSet){
      if (!sDataSet) return;
      if (this._listener_data == sDataSet) this._fill();
      if (this._listener == sDataSet) this._value (dataSet.get(this._listener,this._listenerPath));
   };