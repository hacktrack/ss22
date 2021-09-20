_me = obj_tag_color.prototype;
function obj_tag_color(){};

/**
 * @brief: CONSTRUCTOR
 * @date : 29.1.2013
 **/
_me.__constructor = function(){
	this._listen_data('tags');	
};

_me._listen_data = function(sDataSet,aDataPath){
	this._listener_data = sDataSet;
	if (typeof aDataPath == 'object') this._listenerPath_data = aDataPath;
	dataSet.obey(this,'_listener_data',sDataSet);
};

_me.__update = function(sDataSet,sDataPath){

	if (!sDataSet || this._destructed) return;

	// update tag colors
	if (this._listener_data == sDataSet)
		this._value(this._value());
	// update value
	else
	if (this._listener == sDataSet)
		this._value(dataSet.get(this._listener,this._listenerPath));
};

_me._decode = function(v){

	var aTags = dataSet.get(this._listener_data, this._listenerPath_data) || {},
		aIN = v.split(','),
		aOut = [];

	for (var i in aIN)
		if ((aIN[i] = aIN[i].trim())){
			aOut.push({
				tag:aIN[i],
				bgcolor:(aTags[aIN[i]] && aTags[aIN[i]].TAGCOLOR?aTags[aIN[i]].TAGCOLOR:''),
				color:(aTags[aIN[i]] && aTags[aIN[i]].TEXTCOLOR?aTags[aIN[i]].TEXTCOLOR:'')
			});
		}	

	return aOut;
};