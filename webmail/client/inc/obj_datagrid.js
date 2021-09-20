_me = obj_datagrid.prototype;
function obj_datagrid(){};

_me.__constructor = function(bDontListen){
	//to disable neverending functionality
	this.__offset = 0;
	this.__reizeInterval = 1;
};

/**
 * In this case its client sort ;)
 **/
_me._serverSort = function (aData, sColumn, sType){

	if (aData)
		this._aData = aData;

	if (!sColumn){
		if (!this.__sortColumn)
			return;
		else
			sColumn = this.__sortColumn;
	}
	else
		this.__sortColumn = sColumn;

	if (!sType && this.__sortType)
		sType = (this.__sortType == 1?'desc':'asc');
	else
		this.__sortType = (sType == 'desc'?1:0);

	// Remove selection to avoid that same row but different item is selected
	if (Is.Array(this._aData))
		this._value([]);

	function mySort(a,b){
		if (a[1]>b[1])
		    return 1;
		else
		if (a[1]<b[1])
		    return -1;
		else
		    return 0;
	};

	var aTmp = [], tmp;
	for (var i in this._aData){
		tmp = this._aData[i].data[sColumn];
		aTmp.push([i,typeof tmp == 'object'?tmp[1]:tmp]);
	}

	aTmp.sort(mySort);
	if (sType == 'desc')
	    aTmp.reverse();

	var aSortedData = {};
	for (var i in aTmp)
		aSortedData[aTmp[i][0]] = this._aData[aTmp[i][0]];

	this._fill(aSortedData);
};