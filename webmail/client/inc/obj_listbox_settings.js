_me = obj_listbox_settings.prototype;
function obj_listbox_settings(){};

_me.__constructor = function(sTitleKey,sTitle2Key)
{
	this.__titleKey = sTitleKey;
	this.__title2Key = sTitle2Key;
	this.__values = [];

	this._create('list', 'obj_listbox', 'main', this._css);
};
//Copy methods
_me._disabled = function (b){
	return this.list._disabled(b);
};

_me._add = function(aValues)
{

	//Máme definovanou zobrazitelnou hodnotu?
	if (this.__titleKey){
		var sTitle;

		//Procházíme přidávané položky
		for(var i in aValues)
			//Má přidávaná položka zobrazitelnou hodnotu?
			if ((sTitle = aValues[i][this.__titleKey]))
			{
				var add = false;
				for(var j in this.__values)
					if ((aValues[i].uid && this.__values[j].uid == aValues[i].uid) || (this.__values[j][this.__titleKey] == sTitle)){
						if (this.__values[j].uid)
							aValues[i].uid = this.__values[j].uid;

						this.__values[j] = aValues[i];
						add = true;
						break;
					}

				if (!add)
					this.__values.push(aValues[i]);

			}


		//sort function [optional]
		var tmp = this.__titleKey;
		function sortit(a,b){
			if (a[tmp]>b[tmp])
			    return 1;
			else
			if (a[tmp] == b[tmp])
				return 0;

			return -1;
		};

		this.__values = this.__values.sort(sortit);

		this.__fill();
	}
};

_me.__fill = function(){
	var aNames = [];
	for(var i in this.__values)
		if ((sTitle = this.__values[i][this.__titleKey]))
			if (this.__values[i][this.__title2Key])
				aNames.push(sTitle + ' ('+ (this._ontitle2?this._ontitle2(this.__values[i][this.__title2Key]):this.__values[i][this.__title2Key])+')');
			else
				aNames.push(sTitle);


	this.list._fill(aNames);
};

_me._remove = function(aIndexes)
{

	//Máme definovanou zobrazitelnou hodnotu?
	if (this.__titleKey)
	{
		var aValues = clone(this.__values);
		var sUId,k;

		//Procházíme jednotlivá pořadí vybraných položek
		for(var i in aIndexes)
		{
			k = 0;

			//Procházíme položky a "mažeme" položku odpovídajícího pořadí
			for(var j in aValues)
			{
				//Má položka zobrazitelnou hodnotu?
				if (aValues[j][this.__titleKey])

					//Našli jsme položku odpovídajícího pořadí?
					if (k == aIndexes[i])
					{
						//"Mažeme" položku ze serveru nebo ze seznamu?
						if ((sUId = this.__values[j]['uid']))
							this.__values[j] = {'uid':sUId};
						else
							this.__values.splice(j,1);

						break;
					}
					else
						k++;
			}
		}

		this.__fill();
	}
};

_me._removeSelected = function()
{
	this._remove(this.list._value());
	this.list._value([]);
};

_me._getSelectedValue = function()
{
	//Máme definovanou zobrazitelnou hodnotu?
	if (this.__titleKey)
	{
		//Hledáme položku odpovídajícího pořadí
		var nIndex = this.list._value();
		if ((nIndex = nIndex[0])){
			var k = 0;

			//Pracházíme jednotlivé položky
			for(var i in this.__values)

				//Má položka zobrazitelnou hodnotu?
				if (this.__values[i][this.__titleKey])
					//Našli jsme položku odpovídajícího pořadí?
					if (k == nIndex)
						return clone(this.__values[i]);
					else
						k++;
		}
	}
};

_me._value = function(aValues)
{
	if (Is.Defined(aValues)){
		this._add(aValues);
	}
	else{
		return clone(this.__values);
	}
};