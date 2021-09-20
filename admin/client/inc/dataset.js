/*********** DataSet *************
 * @brief : Data storage provides binding functions between objects and data
 * @status: final
 * @date  : 6.3.2006 19:09:40
 *
 * pridat DUMP metodu
 **/
function cDataSet(){
	this.aDataSets = {};    // data storage (public)
	this.aListeners = {};   // listeners storage (private)
};

/**
 * @brief: add new data into storage
 * @scope: PUBLIC
 * @param: Data      - array or string data
 *         sDName    - dataset name
 *         aDPath    - array containing path ['folder','subfolder',...] dataset.folder.subfodler
 *         bNoUpdate - do not call update method after change
 *         sUpdater  - name of caller (this object will not be updated)
 *
 * @date : 22.2.2012 16:41:41
 **/
 
cDataSet.prototype.add = function(sDName,aDPath,Data,bNoUpdate,sUpdater) {

	var bChange = false;

	// check if new data are different to originals
	if (!bNoUpdate && !compareObj(this.get(sDName,aDPath),Data,true))
		bChange = true;

	// create array path structure in dataset
	if (Is.Array(aDPath))
		this.aDataSets[sDName] = mkArrayPath(aDPath,this.aDataSets[sDName],Data);
	else
		this.aDataSets[sDName] = Data;
	
	if (bChange)
		this.update(sDName,aDPath,sUpdater);
	else
	if (!bNoUpdate)	
		return false;

	return true;
};

/**
 * @brief: remove data from storage
 * @scope: PUBLIC
 * @date : 26.5.2006 15:15:47
 **/
cDataSet.prototype.remove = function(sDName,aDPath,bNoUpdate,sUpdater) {

	if (typeof this.aDataSets[sDName] == 'undefined')
		return;
	else
	if (!aDPath)
		delete this.aDataSets[sDName];
	else
	if (Is.Array(aDPath))
		try {
            if (typeof arrayPath(this.aDataSets[sDName],aDPath) == 'undefined')
				return;
			else
				eval('delete this.aDataSets["'+ sDName +'"]["' + aDPath.join('"]["')+'"]');
		}
		catch(e){
			return false;
		}

	if (!bNoUpdate)
		this.update(sDName,aDPath,sUpdater);
		
	return true;
};

/**
 * @brief: retrieve data from storage
 * @scope: PUBLIC
 * @data : 20.4.2006 15:08:58
 **/
cDataSet.prototype.get = function (sDName, aDPath, bClone) {
	if (!sDName) return;

	var aData = this.aDataSets[sDName];

	if (Is.Array(aDPath)){

		if (aData){
            aData = arrayPath(aData, aDPath);

			if (bClone && aData)
				return clone(aData,1);
			else
				return aData;
		}

		return;
	}
	else
	if (bClone)
		return clone(aData,1);
	else
		return aData;
};

/**
 * @brief: add object as listener for data storage, Listening obj. must contains __update() method!
 * @scope: PUBLIC
 * @data : 15.4.2006 15:08:58
 **/
cDataSet.prototype.obey = function(oListener,sObjMethod,sDName,bNoUpdate) {
	if (typeof oListener != 'object' || !sDName)
		return false;

	oListener[sObjMethod || '_listener'] = sDName;

	if (!this.aListeners[sDName]) this.aListeners[sDName] = [];
	this.aListeners[sDName].push(oListener);

	if (typeof this.aDataSets[sDName] != 'undefined' && !bNoUpdate)
		oListener.__update(sDName);

	return true;
};

/**
 * @brief: remove object from listeners
 * @scope: PUBLIC
 * @data : 15.4.2006 15:08:58
 **/
cDataSet.prototype.disobey = function(oListener,sProperty) {
	if (!sProperty) sProperty = '_listener';
	if (typeof oListener != 'object' || !oListener[sProperty] || !this.aListeners[oListener[sProperty]]) return false;

	var i = this.aListeners[oListener[sProperty]].length;
	while(i--)
		if(this.aListeners[oListener[sProperty]][i]===oListener)
			this.aListeners[oListener[sProperty]].splice(i,1);

	return true;
};

/**
 * @brief: execute update() method in all binded listeners
 * @scope: PUBLIC
 * @data : 26.6.2006 10:50:34
 **/
cDataSet.prototype.update = function(sName,aDPath,sUpdater) {
	if (!sName || !this.aListeners[sName]) return;
	for(var i in this.aListeners[sName]) {
		try {
			if (sUpdater){
				if (typeof sUpdater == 'string'){
					if (this.aListeners[sName][i]._pathName == sUpdater)
					    continue;
				}
				else
				if (typeof sUpdater == 'object'){
					if (this.aListeners[sName][i]._pathName == sUpdater._pathName)
						continue;
				}
			}

			this.aListeners[sName][i].__update (sName, aDPath);
		}
		catch(e){}
	}
};

//////////// GLOBAL ////////////////
dataSet = new cDataSet();