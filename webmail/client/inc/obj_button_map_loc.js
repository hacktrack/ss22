_me = obj_button_map_loc.prototype;
function obj_button_map_loc(){};

_me._onclick = function(){
	this._disabled(true);

	var tmp, v = this._value();
	if (v && (tmp = MailAddress.splitEmailsAndNames(v)) && (tmp = tmp[0]) && (tmp = tmp.email) && tmp.indexOf('@')>-1){
		var resources_path = dataSet.get('main',['resources_path']);
		if (resources_path){
			var aItemsInfo = {
					aid:sPrimaryAccount,
					fid:resources_path,
					filter:{
						sort:'ITMCLASSIFYAS',
						search: 'category:Room AND email:"' + tmp.replace(/\"/g,"\\\"") + '"'
					},
					values:[
						'ITMCLASSIFYAS',
						'LCTEMAIL1'
						]
				};

			WMItems.list(aItemsInfo,'','','',[this,'__step1']);
			return;
		}
	}
	else
	if (v){
		if (Is.URL(v) || (v.toLowerCase().indexOf('www.') === 0 && (v = 'http://'+v))){
			var win = window.open(v, '_blank');
				win.focus();
		}
		else {
			var match = v.replace(/°/g, '').match(/([NEWS])\s+(\d)+(?:\s+(\d)+(?:\.(\d)+)?)?/g);
			if(match && !(match.length % 2)) {
				var lat = this.__DMToDMS(match[0].split(' '));
				var lon = this.__DMToDMS(match[1].split(' '));
				if(lat && lon) {
					v = lat + ', ' + lon;
				}
			}
			this._showmap(v);
		}
	}

	this._disabled(false);
};

_me.__DMToDMS = function(coord) {
	var gps = 0, dir;
	try {
		coord.filter(function (p) {
			if (p.match(/\d+/)) {
				return true;
			}
			if(dir) {
				throw 'Unsupported format';
			}
			dir = ~['S', 'W'].indexOf(p) ? '-' : '';
		}).forEach(function (p, k) {
			p = p * 1;
			switch (k) {
				case 0:
					return gps += p;
				case 1:
					return gps += p / 60;
				case 2:
					gps += p / 60 / 60;
				default:
					throw 'Unsupported format';
			}
		});
		return dir + gps;
	} catch(e) {
		return null;
	}
};

// get location ID
_me.__step1 = function (aData){
	if (aData)
		for (var i in aData)
			for (var j in aData[i]){
				delete aData[i][j]['/'];
				delete aData[i][j]['#'];
				delete aData[i][j]['$'];
				delete aData[i][j]['@'];

				for (var k in aData[i][j]){

					var aItemsInfo = {
							aid:sPrimaryAccount,
							fid:dataSet.get('main',['resources_path']),
							iid:k
						};

					WMItems.list(aItemsInfo,'','','',[this,'__step2']);
				    return;
				}
			}

	this._disabled(false);
};

// get location address
_me.__step2 = function (aData){
	if (aData){
		var loc;
		for(var aid in aData)
			for (var fid in aData[aid])
				for (var iid in aData[aid][fid])
					if ((loc = aData[aid][fid][iid].LOCATIONS))
						for (var lid in loc)
							if (loc[lid].values && loc[lid].values.LCTSTREET){

								var v = loc[lid].values,
									address = [v.LCTSTREET];

								if (v.LCTZIP || v.LCTCITY)
									address.push((v.LCTZIP || '') +' '+ (v.LCTCITY || '').trim());
								if (v.LCTSTATE)
									address.push(v.LCTSTATE);
								if (v.LCTCOUNTRY)
									address.push(v.LCTCOUNTRY);

								this._showmap(address.join(', '));
								break;
							}
	}

	this._disabled(false);
};
