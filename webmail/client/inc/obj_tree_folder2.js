_me = obj_tree_folder2.prototype;
function obj_tree_folder2(){};

_me.__constructor = function(sFilterAccountId, sFilterFolderType, sFilterRights, bSkipVirtual)
{
	this._opt = {privateRootActive:true};

	if (sFilterAccountId)
		this._filter_account(sFilterAccountId);

	if (sFilterFolderType)
		this._filter_folder(sFilterFolderType);

	if (sFilterRights)
		this._filter_rights(sFilterRights);

	if (bSkipVirtual)
		this._sFilterVirtual = true;

	this._listen_data('folders');
};

_me.__prepare_data = function(aData)
{
	var aResult = {},
		aAccounts = dataSet.get('accounts'),
		aCalendars = false,
		sTrashPath = GWOthers.getItem('DEFAULT_FOLDERS', 'trash');

	//Get aCalendars for Calendar view
	if (this._sFilterFolderType && this._sFilterFolderType['E'] && count(this._sFilterFolderType) == 1){
		aCalendars = dataSet.get('folders',[sPrimaryAccount,'__@@VIRTUAL@@__/__@@EVENTS@@__','VIRTUAL','FOLDERS'],true) || {};
		for (var i in aCalendars) {
			aCalendars[i] = [aCalendars[i],getCalendarColor(i)];
		}
	}

	//Sort Accounts
	var accounts = Object.keys(aAccounts).filter(function(sAccId){
		//ACCOUNT filter
		return Is.Defined(aData[sAccId]) && (!this._sFilterAccountId || this._sFilterAccountId == sAccId);
	}, this).sort(function(a,b){
		//Primary on top
		if (aAccounts[a].PRIMARY)
			return -1;
		else
		if (aAccounts[b].PRIMARY)
			return 1;
		//Sort the rest
		else
		if (a == b)
			return 0;
		else
			return a>b?1:-1;
	});

	accounts.forEach(function(sAccId){

		//Account lvl

		if (aAccounts[sAccId].PRIMARY){
			aResult[sAccId] = {
				nodes: [],
				arg: {},
				text: dataSet.get('main',['fullname']),
				ico: 'ico_home',
				liclass: 'skip' //hide primary account node
			};
		}
		else{

			if (!aResult['other']){
				aResult['other'] = {
					nodes: {},
					text: getLang('SETTINGS::OTHER_ACCOUNTS'),
					liclass: 'external',
					id: 'root::other', //Virtual ID
					arg: {
						disabled: true
					}
				};
			}

			aResult['other'].nodes[sAccId] = {
				nodes: [],
				arg: {
					disabled: true
				},
				liclass: 'root_private',
				ico: 'root_private'
			};

			if (aAccounts[sAccId].DESCRIPTION)
				aResult['other'].nodes[sAccId].text = aAccounts[sAccId]['DESCRIPTION'];
		}

		var oFolders = aData[sAccId],
			nodes = {'private':[], 'public':[], 'shared':[], resources:[]};

		for (var fid in oFolders){
			if (oFolders.hasOwnProperty(fid)){

				//VIRTUAL filter
				if ((aCalendars || this._sFilterVirtual) && sAccId == sPrimaryAccount && fid.indexOf('__@@VIRTUAL@@__/') == 0)
					continue;

				//__@@EVENTS@@__ filter
				if (sAccId == sPrimaryAccount && fid == '__@@VIRTUAL@@__/__@@EVENTS@@__')
					continue;

				//TYPE filter
				if (this._sFilterFolderType){

					if (!this._sFilterFolderType['R'] && oFolders[fid].TYPE == 'M' && oFolders[fid].RSS){
						continue;
					}

					if (!this._sFilterFolderType[oFolders[fid].TYPE]){
						if (!this._sFilterFolderType['B'] || oFolders[fid].TYPE != 'M' || !(oFolders[fid].DEFAULT == 'H' || (sAccId+'/'+fid).indexOf(sTrashPath+'/') == 0)){
							continue;
						}
					}
				}

				// TEAMCHAT filter, hide Chat folders in all filters except Y
				if ((oFolders[fid].TYPE == 'Y' ||  oFolders[fid].TYPE == 'I' || oFolders[fid].PRIVATE_ROOT) && (!this._sFilterFolderType || !this._sFilterFolderType['Y']))
				 	continue;

				//RIGHTS filter (regExp.test() doesnt work properly in loop)
				if (this._sFilterRights){
					var bSkip = false,
						sRights = Cookie.get(['rights',sAccId,fid]).join('');

					if (sRights.length){
						for (var r in this._sFilterRights)
							if (sRights.indexOf(this._sFilterRights[r])<0){
								bSkip = true;
								break;
							}

						if (bSkip)
							continue;
					}
				}

				if (this._sFilterRightsOr){
					var bSkip = true,
						sRights = Cookie.get(['rights',sAccId,fid]).join('');

					for (var r in this._sFilterRightsOr)
						if (sRights.indexOf(this._sFilterRightsOr[r])>-1){
							bSkip = false;
							break;
						}

					if (bSkip)
						continue;
				}

				var node_type, root = '';

				//Public & Shared
				if (oFolders[fid].TYPE == 'Y' || (((oFolders[fid].OWNER && oFolders[fid].OWNER!=sPrimaryAccount) || oFolders[fid].SHARED || oFolders[fid].PUBLIC || oFolders[fid].SUBSCRIPTION_TYPE)  && !oFolders[fid].PRIVATE_ROOT)){
					if (oFolders[fid].PUBLIC){
						node_type = 'public';
					}
					else
					if (oFolders[fid].SHARED){
						node_type = 'shared';
					}
					else{
						if (oFolders[fid].RELATIVE_PATH){
							root = 	fid.slice(0,-(oFolders[fid].RELATIVE_PATH.length+1));
						}
						else
						if (oFolders[fid].SUBSCRIPTION_TYPE){
							root =  fid.split('/').shift();
						}
						else{
							root = fid.split('/').slice(0,-1).join('/');
						}

						if (root !== '' && oFolders[root]){
							if (oFolders[root].PRIVATE_ROOT){
								node_type = 'private';
							}
							else
							if (oFolders[root].PUBLIC){
								node_type = 'public';
							}
							else
							if (aCalendars && oFolders[root].RESOURCE){
								node_type = 'resources';
							}
							else{
								node_type = 'shared';
							}
						}
						else{
							node_type = 'public';
						}
					}
				}
				//Private
				else{
					node_type = 'private';

					//Map Resources in Calendar view
					if (aCalendars && oFolders[fid].RELATIVE_PATH){
						root = 	fid.slice(0,-(oFolders[fid].RELATIVE_PATH.length+1));
						if (oFolders[root] && oFolders[root].RESOURCE)
							node_type = 'resources';
					}
				}

				//filter public
				if (this._bFilterPublic && node_type == 'public')
					continue;

				if (this._filterData && this._filterData({aid:sAccId,fid:fid,data:oFolders[fid]}))
					continue;

				nodes[node_type].push({aid:sAccId,fid:fid,data:oFolders[fid]});
			}
		}

		for (var t in nodes){
			if (nodes.hasOwnProperty(t)){
				//fill missing paths by X type folders
				nodes[t] = this.__cleanup(this.__fillIn(nodes[t], sAccId));

				//convert to tree
				var tree = this.__toTree(nodes[t], t, aCalendars);
				nodes[t] = tree.nodes;
				if (tree.group)
					nodes[t].group = tree.group;
			}
		}

		//Construct ROOT node structure

		if (nodes.private.length){
			var private = {
				nodes: this.__privateSort(nodes.private),
				liclass: 'root_private',
				ico: 'root_private',
				group: nodes.private.group,
				arg: {
					disabled: !this._opt.privateRootActive || (this._sFilterFolderType && (this._sFilterFolderType['Y'] || this._sFilterFolderType['E'])),
					aid:sAccId
				}
			};

			if (aAccounts[sAccId].PRIMARY){
				private.text = dataSet.get('accounts',[sPrimaryAccount,'FULLNAME']) ||  dataSet.get('accounts',[sPrimaryAccount,'USERNAME']);
				aResult[sAccId].nodes.push(private);
			}
			//Other Accounts
			else{
				aResult['other'].nodes[sAccId].nodes = private.nodes;
			}
		}

		if (aAccounts[sAccId].PRIMARY){
			if (nodes.public.length){
				aResult[sAccId].nodes.push({nodes:nodes.public, title:'COMMON_FOLDERS::PUBLIC_ROOT', liclass:'root_public', ico:'root_public', arg:{disabled:true}});
			}
			if (nodes.resources.length){
				aResult[sAccId].nodes.push({nodes:nodes.resources, title:'COMMON_FOLDERS::RESOURCES', liclass:'root_resources', ico:'root_resources', arg:{disabled:true}});
			}
			if (nodes.shared.length){
				aResult[sAccId].nodes.push({nodes:nodes.shared, title:'COMMON_FOLDERS::SHARED_ROOT', liclass:'root_shared', ico:'root_shared', arg:{disabled:true}});
			}
		}
		else
		// Clear empty accounts
		if (!aResult['other'].nodes[sAccId].nodes.length){
			delete aResult['other'].nodes[sAccId];
		}

	}.bind(this));

	//Clear empty other accounts
	if (aResult['other'] && Is.Empty(aResult['other'].nodes)){
		delete aResult['other'];
	}

	//Map ID to folder paths
	this.__mapTree(aResult);

	//Always expand default calendar
	if (aCalendars){
		var treeID;
		for (var i in aCalendars) {
			treeID = this._getTreeId(sPrimaryAccount + '/' + i);
			if (aCalendars[i][0] && treeID){
				this.__value = this.__cleanup(this.__value.concat(treeID.split('/').map(function (v, i, a) {
					return a.slice(0, i).concat(v).join('/');
				})));
			}
		}
	}

	return aResult;
};

/**
 * Maps tree data into folder paths
 *
 * @param {*} aData tree data
 * @param {string} sPath optional
 */
_me.__mapTree = function(aData, sPath){
	if (!sPath){
		this.__idTableReal = {};
		this.__idTableTree = {};
		sPath = '';
	}

	for (var id in aData){
		if (aData.hasOwnProperty(id)){
			//Folders
			if (aData[id].arg.aid){
				var tmp = aData[id].arg.aid + (Is.Defined(aData[id].arg.fid)?'/' + aData[id].arg.fid:'');
				this.__idTableReal[tmp] = this.__idTableReal[tmp] || [];
				this.__idTableReal[tmp].push(sPath + id);
				this.__idTableTree[sPath + id] = tmp;
			}
			//Primary nodes
			else{
				var pathId = sPath + (aData[id].id || id);
				this.__idTableTree[pathId] = pathId;
				this.__idTableReal[pathId] = [pathId];
			}
			if (aData[id].nodes){
				this.__mapTree(aData[id].nodes, sPath + id + '/');
			}
		}
	}
};

_me._getTreeId = function(id, bArray){
	return bArray?(this.__idTableReal[id] || []):(this.__idTableReal[id]?this.__idTableReal[id][0]:null);
};

_me._getRealId = function(id){
	return this.__idTableTree[id];
};
/**
 * Filer folder names using this.__filter, used by search
 *
 * @param {object} aData (raw data from dataset)
 * @returns {object}
 */
_me._filter = function (aData){

	var aData2 = {},
		filter = this.__filter,
		sName, aFolders, aKey, bFound, sLast, oOpen = {};

	for(var sDomain in aData){
		sLast = '';

		aFolders = aData[sDomain];
		aKey = Object.keys(aFolders).sort().reverse().filter(function(v){

			sName = (aFolders[v].NAME || Path.basename(v)).toLowerCase();
			bFound = ~sName.indexOf(filter);

			if (v == sLast || bFound){
				sLast = Path.basedir(v);
				oOpen[sDomain + (sLast?'/' + sLast:'')] = true;
				return !!bFound;
			}
		});

		if (aKey.length){
			aData2[sDomain] = {};
			aKey.reverse().forEach(function(v){
				aData2[sDomain][v] = aFolders[v];
			});
		}
	}

	return {
		aData: aData2,
		aOpen: Object.keys(oOpen).sort()
	};
};

/**
 * Fill in all missing folder paths
 *
 * @param {array} arr	folder tree array
 * @returns {array}
 */
_me.__fillIn = function(arr, sAccId){

	var aFolders = dataSet.get('folders', [sAccId]);

	//Quick sort by path
	if (Intl && 'Collator' in Intl){
		var coll = new Intl.Collator();
		arr.sort(function(a,b){
			return coll.compare(a.fid, b.fid);
		});
	}
	else {
		//Quick sort by path
		arr.sort(function(a,b){
			return a.fid.localeCompare(b.fid);
		});
	}

	//fill missing paths
	for(var i = 0, j = arr.length; i<j; i++){

		if (arr[i].fid && ~arr[i].fid.indexOf('/')){
			var prev = arr[i].fid.split('/').slice(0,-1).join('/'),
				data,
				parent = arr.some(function(folder) {
					return folder.fid === prev;
				});

			if (!parent){

				data = {
					TYPE: "X",
					RIGHTS: "rl",
				};

				//special folder names
				switch(prev){
					case '__@@VIRTUAL@@__':
						data.NAME = getLang('COMMON_FOLDERS::VIRTUAL-FOLDERS');
						break;

					case 'SPAM_QUEUE':
						data.NAME = getLang('COMMON_FOLDERS::SPAM_QUEUE');
						break;

					default:
						if (aFolders[prev]){
							if (aFolders[prev].NAME){
								data.NAME = aFolders[prev].NAME;
							}

							if (aFolders[prev].TYPE){
								data.TYPE = aFolders[prev].TYPE;
								data.disabled = true;
							}

							if (aFolders[prev].RESOURCE){
								data.RESOURCE = aFolders[prev].RESOURCE;
							}
						}
				}

				//Add to array
				arr.splice(i, 0, {
					aid: arr[i].aid,
					fid: prev,
					data: data
				});

				i--; //jump back to fill multiple lvls
				j++;
			}
		}
	}

	return arr;
};

_me.__cleanup = function(arr){

	for(var i = arr.length;i--;){
		if (arr[i].data && (arr[i].data.TYPE == 'X' || arr[i].data.TYPE == 'Y')){
			if (!arr[i+1] || arr[i].aid != arr[i+1].aid || arr[i+1].fid.indexOf(arr[i].fid + '/') != 0){
				arr.splice(i, 1);
			}
		}
	}

	return arr;
};

/**
 * Convert folder array into tree
 *
 * @param {array} 2D folder tree
 * @returns {array} tree
 */
_me.__toTree = function(arr, sNodeType, aCalendars){
	var aOut = [],
		tmp = {},
		group = 0;

	arr.forEach(function(f, i){
		var path = f.fid.split('/');


		var	item = {
				arg: {
					aid: f.aid,
					fid: f.fid,
					data: f.data,
					ftype: f.data.TYPE || 'X'
				},
				text: f.data.NAME || Path.basename(f.fid),
				ico: this.__getIcon(f)
			};

		if (sNodeType == 'shared' && ~item.text.indexOf('@')){
			item.text =  '<img src="'+ getAvatarURL(item.text) +'" class="avatar"/>' + item.text;
		}

		//do not draw RESOURCE root in Calendar view
		if (sNodeType == 'resources' && f.data.RESOURCE){
			item.liclass = 'skip';
		}

		//disable all X & filled folders
		if (item.arg.ftype == 'X' || f.data.disabled)
			item.arg.disabled = true;
		else
		//do not draw Y
		if (item.arg.ftype == 'Y'){
			item.liclass = 'skip';
			item.arg.disabled = true;
		}
		else
		//add color to Calendar folders
		if (aCalendars && item.arg.ftype == 'E'){
			item.ico = 'color';
			if (aCalendars[f.fid]){
				if (aCalendars[f.fid][0]){
					item.liclass = 'active';
				}
				item.ico += ' checked' + (aCalendars[f.fid][1]?' '+aCalendars[f.fid][1]:'');
			}
		}
		else
		if (f.data.RECENT>'0' || f.data.COUNT>'0'){
			item.title2 = +f.data.COUNT || +f.data.RECENT;
			if (f.data.TYPE == 'I' && item.title2 > 999) {
				item.title2 = '999+';
			}
			item.itmclass = "recent";
			item.liclass = "unread";
		}

		//Write right
		if (!WMFolders.getRights([f.aid,f.fid],'write')){
			item.ico += ' no-write';
		}

		//to the tree...
		if (path.length === 1){
			aOut.push(item);
		}
		else{
			var parentPath = path.slice(0,-1).join('/');
			if (tmp[parentPath]){

				if (!tmp[parentPath].nodes)
					tmp[parentPath].nodes = [];

				tmp[parentPath].nodes.push(item);

				//Teamchat, Primary
				if (sNodeType == 'private'){
					if (f.data.TYPE == 'Y')
						tmp[parentPath].liclass = 'skip';
				}

				//Teamchat, group unread counts
				if (f.data.TYPE == 'I' && f.data.RECENT>'0'){
					if (sNodeType == 'private'){
						group = group + (+f.data.RECENT);
						if(group > 999) {
							group = '999+';
						}
					}
					else{
						parentPath = path.slice(0,-2).join('/');
						if (parentPath) {
							tmp[parentPath].group = +(tmp[parentPath].group || 0) + (+f.data.RECENT);
							if(tmp[parentPath].group > 999) {
								tmp[parentPath].group = '999+';
							}
						}
					}
				}

			}
		}

		tmp[f.fid] = item;
	}.bind(this));

	return {nodes:aOut, group:group};
};

/**
 * Get proper icon for given folder
 *
 * @param {object} folder
 * @returns {string} css class
 */
_me.__getIcon = function(folder){
	var ico = '';
	if (folder.data){
		switch (folder.data.TYPE){
			case 'M':
				if (folder.data.RSS){
					ico = 'r';
				}
				else
				if (folder.fid === 'INBOX' && folder.aid === sPrimaryAccount){
					ico = 'inbox';
				}
				else
				if (folder.data.SPAM){
					ico = 'spam';
				}
				else
				if (folder.data.ARCHIVE){
					ico = 'archive';
				}
				else
				if (folder.data.DEFAULT){
					ico = ({H:'trash',S:'sent',D:'drafts'})[folder.data.DEFAULT] || 'm';
				}
				else
					ico = 'm';
				break;
			case 'Q':
				ico = 'quarantine';
				break;
			case 'G':
				ico = 'gwtrash';
				break;
			case 'QL':
				ico = folder.fid === 'SPAM_QUEUE/Blacklist'?'black':'white';
				break;
			default:
				if (folder.fid == 'SPAM_QUEUE')
					ico = 'spamqueue';
				else
				if (folder.fid == '__@@VIRTUAL@@__')
					ico = 'virtual';
				else
				if (folder.data.TYPE)
					ico = folder.data.TYPE.toLowerCase();
		}

		ico = (ico?'ico_' + ico:'') + (folder.data.DEFAULT?' default':'');
	}

	return ico;
};


/**
 * Sort privat section
 *
 * @param {node - array} aFolders
 * @returns
 */
_me.__privateSort = function(aFolders){
	var aInbox = [],
		aSent = [],
		aDraft = [],
		aArchive = [],
		aSpam = [],
		aTrash = [],
		aDefaultMail = [],
		aDefaultGW = [];

	var aFilter = aFolders.filter(function(folder, i){
		if (folder.arg.ftype != 'X'){
			if (folder.arg.fid == 'INBOX'){
				aInbox.push(folder);
				return false;
			}

			if (folder.arg.data){
				if (folder.arg.data.ARCHIVE){
					aArchive.push(folder);
					return false;
				}
				if (folder.arg.data.SPAM){
					aSpam.push(folder);
					return false;
				}
				if (folder.arg.data.DEFAULT){
					switch(folder.arg.data.DEFAULT){
						case 'S':
							aSent.push(folder);
							break;
						case 'D':
							aDraft.push(folder);
							break;
						case 'H':
							aTrash.push(folder);
							break;
						case 'P':
							aDefaultMail.push(folder);
							break;
						default:
							aDefaultGW.push(folder);
					}
					return false;
				}
			}
		}

		return true;
	});

	return [].concat(aInbox, aSent, aDraft, aArchive, aSpam, aTrash, aDefaultMail, aDefaultGW, aFilter);
};

_me._listen_cookie = function(sCookieName)
{
	this._treeCookie = sCookieName;

	var aCookieValue = Cookie.get([sCookieName]);
	if (!Is.Array(aCookieValue) || !aCookieValue.length)
	    aCookieValue = [sPrimaryAccount];

	this._value(aCookieValue);
};

////// PUBLIC FILTERS //////
_me._filter_account = function (sFilterAccountId){
	this._sFilterAccountId = sFilterAccountId;
};

_me._filter_folder = function (filterFolderType){
	this._sFilterFolderType = {};

	if (Is.String(filterFolderType)){
		this._sFilterFolderType[filterFolderType] = true;
	}
	else{
		for(var i in filterFolderType){
			if (filterFolderType.hasOwnProperty(i)){
				this._sFilterFolderType[filterFolderType[i]] = true;
			}
		}
	}

    //filter css for icons
	if (Is.Empty(this._sFilterFolderType))
		removecss(this._main,'filter');
	else
		addcss(this._main,'filter');
};

_me._filter_public = function(bFilterPublic) {
	this._bFilterPublic = !!bFilterPublic;
};

_me._filter_rights = function (sFilterRights){
	this._sFilterRights = (sFilterRights || '').split('');
};

_me._filter_rights_or = function (sFilterRightsOr){
	this._sFilterRightsOr = (sFilterRightsOr || '').split('');
};

_me._rename = function(arg){
	if (this.rename) this.rename._onclose();
	this._norefresh = true;

	var sLiId = this._getElmId(this._getTreeId(arg.aid + (arg.fid?'/'+arg.fid:''))),
		hDiv = document.getElementById(sLiId).getElementsByTagName('DIV')[0];

	// hide link
	addcss(hDiv,'edit');

	// create editDiv anchor and ID to hDiv
	var sAnchor = sLiId + '#editDiv';
	this._anchors['editDiv'] = sAnchor;
	hDiv.id = sAnchor;

	// get value
	var nPos = arg.fid.lastIndexOf('/'),
		sParentName = arg.fid.substring(0,nPos),
		sFolderName = dataSet.get("folders", [arg['aid'],arg['fid'], 'NAME']) || arg.fid.substring(nPos + 1);

	// create obj_input in this' editDiv anchor
	var rename = this._create('rename','obj_input','editDiv');
		rename._restrict('![/\\\\:\?\"\<\>\|\~]+','','^.{1,255}$');

		// cancel "onclick" propagation to obj_tree
		rename.__eIN.onclick = function(e){
			var e = e || window.event;
			if (e.preventDefault) e.preventDefault();
			if (e.stopPropagation) e.stopPropagation();
			e.cancelBubble = true;
			return false;
		};

		rename._value(sFolderName);
		rename._setRange(0,sFolderName.length);

		rename._onsubmit = function(e){
			if (this._checkError && this._checkError.length) return;

			var snew = (this._value() || '').trim();
			var sold = sFolderName;

			if (sold == snew){
				this._onclose();
				return;
			}

			var sNewFolderID = (sParentName ? sParentName + '/' : '') + snew;
			obj_context_folder.__moveFolder(arg.aid, arg.fid, sNewFolderID);

			this._onclose();
		};

		rename._onclose = function(e){

			if (this.rename._destructed) return false;

			this.rename._destruct();
			removecss(hDiv,'edit');

			// aby se zase prekresloval tree
			this._norefresh = false;
			if (!e || this._updateBuffer)
				this.__update(this._listener_data);
		}.bind(this);

		//MSIE11, prevent search input focus
		rename._onkeydown = function(e){
			var e = e || window.event;
			if (e.stopPropagation) e.stopPropagation();
			e.cancelBubble = true;
		};

		rename._onblur = rename._onclose;

	// remove anchor immediately (better solution)
	delete this._anchors['editDiv'];
};
_me._filterData = function(aData){
	return (this._sFilterFolderType && this._sFilterFolderType['Y'] && aData.data.TYPE == 'I' && aData.data.SYNC != 1);
};
