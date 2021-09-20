/*
 +	nejak si to pamatuje total i kdyz se skoci na jinej folder
	mel by se mazat uz v _serverSort, je-li jinej folder

 +	cisteni copntaineru, zustavaj sloupce a nekdy i jejich obsah
	repro:  z events list JUMP to Journal

 -	__update, if count(item) != subcount -> serversort();

 - pri zmene folderu promazat "me.__cursor"

*/
_me = obj_datagrid2.prototype;
function obj_datagrid2(){};

_me.__constructor = function(bDontListen){
	var me = this;

	this._cookiesEnabled = true;

	//data vars
	this._aFolder = null;   	//set in serverSort
	this._aFolderLast = null;   //set in Update

	this.__total = 0;
	this.__offset = 0;
	this.__preload = 20;

	this.__limit = [0,0];

	//view vars
	this.__row_count = 0;
	this.__row_offset = 0;

	//Listen to items dataset
	if (!bDontListen)
		this._listen_data('items','',true); //listen but do not update immediately


	//*** SCROLLING
	this.__iScroll_left = 0;
	this.__iScroll_top = -1;
	this.__eContainer2.onscroll = function(e){
		if (me.__iScroll_left != this.scrollLeft){
			me.__iScroll_left = this.scrollLeft;

			if(gui._rtl && this.scrollRight)
				me.__eHeader.style.marginRight = -this.scrollRight+'px';
			else
				me.__eHeader.style.marginLeft = -me.__iScroll_left+'px';
		}

		//LIMIT
		var pre1 = me.__preload,pre2 = me.__preload,r = me.__getRange();
		if (me.__limit[1]<=me.__limit[0] || (r[0]+r[1]>me.__limit[1]-10 && me.__limit[1]<me.__total) || (r[0]<me.__limit[0]+10 && me.__limit[0]>0)){

			// add another +10 items to scroll end
			if (me.__iScroll_top>-1){
				if (me.__iScroll_top > this.scrollTop)
					pre1 += 10;
				else
					pre2 += 10;
			}

			me.__limit[0] = r[0]>pre1?r[0]-pre1:0;
			me.__limit[1] = r[0] + r[1] + pre2;

			me.__offset = me.__limit[0];

			if (me.__scrolltime)
				clearTimeout(me.__scrolltime);

			me.__scrolltime = setTimeout(me._pathName+'._serverSort()',300);
		}
		else
		if (me.__scrolltime && me.__iScroll_top>-1 && (me.__iScroll_top != this.scrollTop)){
			clearTimeout(me.__scrolltime);
			me.__scrolltime = setTimeout(me._pathName+'._serverSort()',300);
		}
		else
		if (me.__selectByPosition)
			me._selectPosition();

		if (me.__iScroll_top != this.scrollTop)
			me.__iScroll_top = this.scrollTop;
	};
};

/**
 * Load reast of values when datagrid height extended
 **/
_me.__check_size = function(){
	var h = this.__eContainer2.offsetHeight;
	if (this.__lastHaight && this.__lastHaight != h)
		this.__eContainer2.onscroll();

	this.__lastHaight = h;
};

_me._default_values = function (sFolType){
	return WMItems.default_values(sFolType);
};

_me._default_columns = function (sFolType){
	var aDefaultColumns;

	var CV = +GWOthers.getItem('LAYOUT_SETTINGS','compact_view');
	var rows = 2.8;
	switch(CV) {
		case 1:
			rows = 2;
			break;
		case 2:
			rows = 1;
			break;
	}
	var aFolder = this._getFolder();
	var view = Cookie.get(['views', aFolder.aid, aFolder.fid, 'view']) || 'wide';
	var size = ~view.indexOf('wide') ? 2500 : 500;

	switch(sFolType){
		case 'C':
			aDefaultColumns = {
				'AVATAR':{'width':18,'css':'avatar',"type":'static','display':'small'},
				'ITMCLASS':{'width':20,'arg':{'sort':'asc'},'css':'ico contact',"type":'static',"text":'&nbsp;',encode:true},
				'ITMCLASSIFYAS':{'width':40,mode:'%','arg':{'sort':'asc'},'display':'all'},
				'ITMCOMPANY':{'width':30,mode:'%','arg':{'sort':'asc'},encode:true,'display':'all', hideColumnFor: ['small']},
				'CONTACT_EMAIL':{'width':30,mode:'%','arg':{'sort':'asc'},encode:true,'display':'all'},
				'ITMSURNAME':{'arg':{'sort':'asc'},'display':'all', hideColumnFor: ['small', 'all']},
				'PHONE':{'width':190,'arg':{'sort':'asc'},encode:true,'display':'all'},
				'ITMCATEGORY':{'width':200,css:'tags','arg':{'sort':'asc'}},
				'DELETE':{'width':18,'css':'ico delete',"type":'static','display':'small'}
			};

			//if (this._small) this._small();

			if (this._small)
				this._small({size: size, rows:rows, sorting:true});

			break;

		case 'G':
			aDefaultColumns = {
				'ITMCLASS':{'width':20,'arg':{'sort':'asc'},'css':'ico gw',"type":'static',"text":'&nbsp;'},
				'ITMTITLE':{'width':100,mode:'%',css:'title','arg':{'sort':'asc'},encode:true},
				'ITMORIGINALFOLDER':{'width':300,'arg':{'sort':'asc'},encode:true},
				'ITM_DELETED':{'width':100,'arg':{'sort':'desc'}}
			};

			if (this._small) this._small({size: size});
			break;

		case 'E':

			if (this._aFolder.aid == sPrimaryAccount && this._aFolder.fid == '__@@VIRTUAL@@__/__@@EVENTS@@__')
				aDefaultColumns = {
					'EVNFOLDER':{'width':4,'arg':{'sort':'asc'},'css':'evnfolder',"type":'static',"text":'&nbsp;',encode:true,'display':'all'},
					'EVNTITLE':{'width':75,mode:'%',css:'indent title','arg':{'sort':'asc'},'display':'all'},
					'REMINDER':{'width':20,'css':'ico reminder','arg':{'sort':'desc'},"text":'&nbsp;', display: 'all'},
					'EVNLOCATION':{'width':25,mode:'%','arg':{'sort':'asc'},encode:true,'display':'all'},
					'EVNTYPE':{'width':200,'css':'tags','html':true,'arg':{'sort':'asc'}},
					'RECCURENCE':{'width':20,'css':'ico recurrence','arg':{'sort':'desc'},"text":'&nbsp;'},
					'CONFERENCE':{'width':20,'css':'ico conference','arg':{'sort':'desc'},"text":'&nbsp;'},
					'EVENT_STARTDATE':{'width':120,'arg':{'sort':'desc'},'display':'all'},
					'EVENT_ENDDATE':{'width':120,'arg':{'sort':'desc'},'display':'all'},
					'DELETE':{'width':18,'css':'ico delete',"type":'static','display':'small'}
				};
			else
				aDefaultColumns = {
					'EVNTITLE':{'width':75,mode:'%',css:'title','arg':{'sort':'asc'},'display':'all'},
					'EVNLOCATION':{'width':25,mode:'%','arg':{'sort':'asc'},encode:true,'display':'all'},
					'REMINDER':{'width':20,'css':'ico reminder','arg':{'sort':'desc'},"text":'&nbsp;'},
					'RECCURENCE':{'width':20,'css':'ico recurrence','arg':{'sort':'desc'},"text":'&nbsp;'},
					'EVENT_STARTDATE':{'width':120,'arg':{'sort':'desc'},'display':'all'},
					'EVENT_ENDDATE':{'width':120,'arg':{'sort':'desc'},'display':'all'},
					'EVNTYPE':{'width':200,'css':'tags','html':true,'arg':{'sort':'asc'}},
					'DELETE':{'width':18,'css':'ico delete',"type":'static','display':'small'}
				};

			if (this._small)
				this._small({size: size, rows:rows, sorting:true});

			break;

		case 'J':
			aDefaultColumns = {
				'EVNTITLE':{'width':100,mode:'%',css:'title','arg':{'sort':'asc'},'display':'all'},
				'EVENT_STARTDATE':{'width':120,'arg':{'sort':'desc'},'display':'all'},
				'EVENT_ENDDATE':{'width':120,'arg':{'sort':'desc'},'display':'all'},
				'EVNTYPE':{'width':200,'css':'tags','html':true,'arg':{'sort':'asc'}},
				'DELETE':{'width':18,'css':'ico delete',"type":'static','display':'small'}
			};

			if (this._small)
				this._small({size: size, rows:rows, sorting:true});

			break;

		case 'F':
		case 'K':
		case 'I':
			aDefaultColumns = {
				'ico':{width:20, type:'static', title:'',css:'file_type','display':'all'},
				'EVNFILENAME':{'width':60,mode:'%','arg':{'sort':'asc'},'display':'all',bidi: false},
				'LOCK':{width:20, type:'static', title:'',css:'ico lock','display':'all'},
				'EVNNOTE':{'width':40,mode:'%','arg':{'sort':'asc'},encode:true},
				'EVN_MODIFIED':{'width':120,'arg':{'sort':'desc'},'display':'all'},
				'EVNFILESIZE':{'width':70,'arg':{'sort':'asc'},'css':'right','display':'all'},
				'EVNTYPE':{'width':200,'css':'tags','html':true,'arg':{'sort':'asc'}},
				'DELETE':{'width':18,'css':'ico delete',"type":'static','display':'small'}
			};

			if (this._small)
				this._small({size: size, rows:rows, sorting:true, css:'task'});
			break;


		case 'M':
			var aFolder = dataSet.get('folders',[this._aFolder.aid,this._aFolder.fid]) || {};
			var bSentArchive = (this._aFolder.aid+"/"+this._aFolder.fid).indexOf(dataSet.get('main',['archive_path'])+"/Sent/")===0;

			if (aFolder.RSS)
				aDefaultColumns = {
					'FLAGS':{'width':21,'arg':{'sort':'asc'},'css':'ico msg',"type":'static',"text":'&nbsp;','display':'all'},
					'SUBJECT':{'width':75,mode:'%','arg':{'sort':'asc'},'display':'all', css:'subject'},
					'FROM':{'width':25,mode:'%','arg':{'sort':'asc'},encode:true,'display':'all', css:'from'},
					'DATE':{'width':120,'arg':{'sort':'desc'},'css':'right light','display':'all'},
					'COLOR':{'width':18,'arg':{'sort':'asc'},'css':'ico flags',"type":'static',"text":'&nbsp;','display':'all'},
					'DELETE':{'width':18,'css':'ico delete',"type":'static',"text":'&nbsp;','display':'small'}};
			else
			// if (this._aFolder.fid == 'INBOX')
			// 	aDefaultColumns = {
			// 		'PRIORITY':{'width':4,'arg':{'sort':'desc'},'css':'priority',"type":'static','text':''},
			// 		'HAS_ATTACHMENT':{'width':18,'arg':{'sort':'desc'},'css':'ico attachment',"type":'static','display':'all','text':''},
			// 		'FLAGS':{'width':21,'arg':{'sort':'asc'},'css':'ico msg',"type":'static','display':'all','text':''},
			// 		'FROM':{'width':160,'arg':{'sort':'asc'},encode:true,'display':'all', css:'from'},
			// 		'SUBJECT':{'width':400,'arg':{'sort':'asc'},'display':'all', css:'subject'},
			// 		'TO':{'width':140,'arg':{'sort':'asc'},encode:true},
			// 		'DATE':{'width':120,'arg':{'sort':'desc'},'css':'right light','display':'all'},
			// 		'SIZE':{'width':60,'arg':{'sort':'desc'},'css':'right light', 'display':'all', hideColumnFor: ['small']},
			// 		'COLOR':{'width':18,'arg':{'sort':'asc'},'css':'ico flags','type':'static','display':'all','text':''},
			// 		'DELETE':{'width':18,'css':'ico delete',"type":'static','display':'small'}};
			// else
			// if (aFolder.DEFAULT === 'S' || aFolder.DEFAULT === 'D' || aFolder.DEFAULT === 'P' || bSentArchive || this.__isInSentFolder())
			// 	aDefaultColumns = {
			// 		'PRIORITY':{'width':4,'arg':{'sort':'desc'},'css':'priority',"type":'static',"text":'&nbsp;'},
			// 		'HAS_ATTACHMENT':{'width':18,'arg':{'sort':'desc'},'css':'ico attachment',"type":'static',"text":'&nbsp;','display':'all'},
			// 		'FLAGS':{'width':21,'arg':{'sort':'asc'},'css':'ico msg',"type":'static',"text":'&nbsp;','display':'all'},
			// 		'TO':{'width':140,'arg':{'sort':'asc'},encode:true,'display':'all', css:'from'},
			// 		'SUBJECT':{'width':300,'arg':{'sort':'asc'},'display':'all', css:'subject'},
			// 		'FROM':{'width':160,'arg':{'sort':'asc'},encode:true,'display':'all', css:'from'},
			// 		'DATE':{'width':120,'arg':{'sort':'desc'},'css':'right light','display':'all'},
			// 		'SIZE':{'width':60,'arg':{'sort':'desc'},'css':'right light', css:'subject','display':'all', hideColumnFor: ['small']},
			// 		'COLOR':{'width':18,'arg':{'sort':'asc'},'css':'ico flags',"type":'static',"text":'&nbsp;','display':'all'},
			// 		'DELETE':{'width':18,'css':'ico delete',"type":'static',"text":'&nbsp;','display':'small'}};
			// else
			if (aFolder.DEFAULT == 'H')
				aDefaultColumns = {
					'PRIORITY':{'width':4,'arg':{'sort':'desc'},'css':'priority',"type":'static',"text":'&nbsp;','title':'SETTINGS::PRIORITY','display':'all', hideColumnFor: ['small']},
					'HAS_ATTACHMENT':{'width':18,'arg':{'sort':'desc'},'css':'ico attachment',"type":'static',"text":'&nbsp;','display':'all'},
					'FLAGS':{'width':21,'arg':{'sort':'asc'},'css':'ico msg',"type":'static',"text":'&nbsp;','display':'all'},
					'FROM':{'width':25,mode:'%','arg':{'sort':'asc'},encode:true,'display':'all', css:'from'},
					'SUBJECT':{'width':50,mode:'%','arg':{'sort':'asc'},'display':'all', css:'subject'},
					'TO':{'width':25,mode:'%','arg':{'sort':'asc'},encode:true},
					'DATE':{'width':100,'arg':{'sort':'desc'},'css':'right light','display':'all'},
					'ITEM_MOVED':{'width':100,'arg':{'sort':'desc'},'css':'right light'},
					'SIZE':{'width':60,'arg':{'sort':'desc'},'css':'right light','display':'all', hideColumnFor: ['small']},
					'COLOR':{'width':18,'arg':{'sort':'asc'},'css':'ico flags',"type":'static',"text":'&nbsp;','display':'all'},
					'DELETE':{'width':18,'css':'ico delete',"type":'static',"text":'&nbsp;','display':'small'}};
			else
			if (aFolder.DEFAULT === 'S' || aFolder.DEFAULT === 'D' || aFolder.DEFAULT === 'P' || bSentArchive || this.__isInSentFolder())
				aDefaultColumns = {
					'PRIORITY':{'width':4,'arg':{'sort':'desc'},'css':'priority',"type":'static',"text":'&nbsp;','title':'SETTINGS::PRIORITY','display':'all', hideColumnFor: ['small']},
					'HAS_ATTACHMENT':{'width':18,'arg':{'sort':'desc'},'css':'ico attachment',"type":'static',"text":'&nbsp;','display':'all'},
					'FLAGS':{'width':21,'arg':{'sort':'asc'},'css':'ico msg',"type":'static',"text":'&nbsp;','display':'all'},
					'FROM':{'width':25,mode:'%','arg':{'sort':'asc'},encode:true, css:'from'},
					'SUBJECT':{'width':50,mode:'%','arg':{'sort':'asc'},'display':'all', css:'subject'},
					'TO':{'width':25,mode:'%','arg':{'sort':'asc'},encode:true,'display':'all'},
					'DATE':{'width':100,'arg':{'sort':'desc'},'css':'right light','display':'all'},
					'SIZE':{'width':60,'arg':{'sort':'desc'},'css':'right light','display':'all', hideColumnFor: ['small']},
					'COLOR':{'width':18,'arg':{'sort':'asc'},'css':'ico flags',"type":'static',"text":'&nbsp;','display':'all'},
					'DELETE':{'width':18,'css':'ico delete',"type":'static',"text":'&nbsp;','display':'small'}};
			else
				aDefaultColumns = {
					'PRIORITY':{'width':4,'arg':{'sort':'desc'},'css':'priority',"type":'static',"text":'&nbsp;','title':'SETTINGS::PRIORITY','display':'all', hideColumnFor: ['small']},
					'HAS_ATTACHMENT':{'width':18,'arg':{'sort':'desc'},'css':'ico attachment',"type":'static',"text":'&nbsp;','display':'all'},
					'FLAGS':{'width':21,'arg':{'sort':'asc'},'css':'ico msg',"type":'static',"text":'&nbsp;','display':'all'},
					'FROM':{'width':25,mode:'%','arg':{'sort':'asc'},encode:true,'display':'all', css:'from'},
					'SUBJECT':{'width':50,mode:'%','arg':{'sort':'asc'},'display':'all', css:'subject'},
					'TO':{'width':25,mode:'%','arg':{'sort':'asc'},encode:true},
					'DATE':{'width':100,'arg':{'sort':'desc'},'css':'right light','display':'all'},
					'SIZE':{'width':60,'arg':{'sort':'desc'},'css':'right light','display':'all', hideColumnFor: ['small']},
					'COLOR':{'width':18,'arg':{'sort':'asc'},'css':'ico flags',"type":'static',"text":'&nbsp;','display':'all'},
					'DELETE':{'width':18,'css':'ico delete',"type":'static',"text":'&nbsp;','display':'small'}};

			if (this._small)
				this._small({size: size, rows:rows, sorting:true, filters:[{search:'',text:'COMMON::ALL'},{search:'is:unread',text:'MESSAGE::UNREAD'}]/*,sort:'DATE',sorttype:'desc'*/});

			break;

		case 'T':
			aDefaultColumns = {
				'EVNPRIORITY':{'width':4,"type":'static',"text":'&nbsp;','css':'priority','display':'all'},
				'CHECK':{'width':26,"type":'static',"text":'&nbsp;','css':'check','display':'all'},
				'EVNSTATUS':{'width':50,'arg':{'sort':'asc'},"type":'static',"text":'&nbsp;','css':'ico status','display':'all'},
				'EVNCOMPLETE':{'width':50,"type":'static',"text":'&nbsp;','display':'small'},
				'EVNTITLE':{'width':100,mode:'%','arg':{'sort':'asc'},'css':'title','display':'all'},
				'REMINDER':{'width':20,'css':'ico reminder','arg':{'sort':'desc'},"text":'&nbsp;'},
				'RECCURENCE':{'width':20,'css':'ico recurrence','arg':{'sort':'desc'},"type":'static',"text":'&nbsp;'},
				'TASK_ENDDATE':{'width':100,'arg':{'sort':'desc'},'display':'all'},		// Date DUE
				'TASK_STARTDATE':{'width':100,'arg':{'sort':'desc'},'display':'all'},	// From date
				'EVNTYPE':{'width':200,'css':'tags','html':true,'arg':{'sort':'asc'}},
				'DELETE':{'width':18,'css':'ico delete',"type":'static',"text":'&nbsp;','display':'small'}};

			if (this._small)
				this._small({size: size, rows:rows, sorting:true});
			break;

		case 'N':
			aDefaultColumns = {
				'EVNTITLE':{'width':100,mode:'%',css:'indent title','arg':{'sort':'asc'},'display':'all'},
				'EVN_MODIFIED':{'width':120,'arg':{'sort':'desc'},'display':'all'},
				'EVNTYPE':{'width':200,'css':'tags','html':true,'arg':{'sort':'asc'}},
				'DELETE':{'width':18,'css':'ico delete',"type":'static',"text":'&nbsp;','display':'small'}};

			if (this._small)
				this._small({size: size, rows:rows, sorting:true});
			break;

		case 'Q':
			aDefaultColumns = {
				'SNDEMAIL':{'width':25,mode:'%','arg':{'sort':'asc'}, 'display':'all', css:'from', encode:true},
				'SNDSUBJECT':{'width':75,mode:'%','arg':{'sort':'asc'}, 'display':'all', css:'subject', encode:true},
				'QDATE':{'width':110,'arg':{'sort':'desc'}, 'display':'all', css:'right light'},
				'SNDOWNER':{'width':100,'arg':{'sort':'asc'}, encode:true},
				'SNDDOMAIN':{'width':80,'arg':{'sort':'asc'}, encode:true}
			};
            this.__dragtype = ''; // No Drag & Drop

			if (this._small) this._small({size: size, rows:rows, sorting:true});
			break;

		case 'QL':
			aDefaultColumns = {
				'SNDEMAIL':{'width':160,'arg':{'sort':'asc'}, 'display':'all', encode:true},
				'SNDOWNER':{'width':160,'arg':{'sort':'asc'}, encode:true},
				'SNDDOMAIN':{'width':160,'arg':{'sort':'asc'}, 'display':'all', encode:true},
				'QDATE':{'width':110,'arg':{'sort':'desc'}, 'display':'all', css:'right light'}
			};
			this.__dragtype = ''; // No Drag & Drop

			if (this._small) this._small({size: size, rows:rows, sorting:true});
			break;
	}
	return aDefaultColumns;
};

_me.__isInSentFolder = function(sFolder, sAccount){
	sFolder = (sFolder || this._aFolder.fid).split('/');
	sAccount = sAccount || this._aFolder.aid;
	for(var i = 0; i < sFolder.length; i++) {
		if(dataSet.get('folders',[sAccount, sFolder.slice(0, i), 'DEFAULT']) === 'S') {
			return true;
		}
	}
};

_me._serverSort = function(aFolder,sColumn,sSortType,aHandler,aFilter){

	if (this.__scrolltime){
		clearTimeout(this.__scrolltime);
		this.__scrolltime = '';
	}

	//switch folder => scroll DG to the TOP
	if (aFolder && this._aFolder != null && (this._aFolder.aid!=aFolder.aid || this._aFolder.fid!=aFolder.fid)){
		if (this.__eContainer2.scrollTop>0){
			this.__iScroll_top = 0; // to avoid refresh
			this.__eContainer2.scrollTop = 0;
		}

		this.__total = 0;
		this.__limit = [0,0];

		this._value([]);
	}
	else
	if (!(aFolder = aFolder || this._aFolder))
		return false;

	this._aFolder = aFolder;

	//LIMIT
	var r = this.__getRange();

	if (this.__limit[1]<=this.__limit[0]){
		if ((r[0]+r[1]>this.__limit[1]-10 && (this.__limit[1]<this.__total || this.__total==0)) || (r[0]<this.__limit[0]+10 && this.__limit[0]>0)){
			this.__limit[0] = r[0]>this.__preload?r[0]-this.__preload:0;
			this.__limit[1] = r[0] + r[1] + this.__preload;
			this.__offset = this.__limit[0];
		}
	}
	//Vzdy se ptej na pohledovy Limit
	else
	if (this.__limit[1]<r[0]+r[1]+this.__preload)
		this.__limit[1] = r[0]+r[1]+this.__preload;

	aFilter = aFilter || {};
	aFilter.limit = this.__limit[1]-this.__limit[0];
	aFilter.offset = this.__limit[0];

	var sFolType = WMFolders.getType(aFolder),
		aValues = this._default_values(sFolType),
		aDefaultColumns = this._default_columns(sFolType);

	//SORT
	if (sSortType)
		sSortType = sSortType == 'desc'?1:0;

	//sort in small view can be fixed
	/*
	if (this.__small && this.__smallOptions.sort){
		sColumn = this.__smallOptions.sort;
		sSortType = this.__smallOptions.sorttype || 'desc';
	}
	else
	*/
	//get sort from cookies
	if (this._cookiesEnabled){
		var bSave = true;

		if (!sColumn){
			var aSort = Cookie.get(['views',aFolder.aid,aFolder.fid,'sort']);
			if (aSort){
				sColumn = aSort.column;
				sSortType = aSort['type'] == 'desc'?1:0;
			}
			aSort = null;
		}

		//check
		if (sColumn && aDefaultColumns){
            if (!aDefaultColumns[sColumn] || (this.__small && (!aDefaultColumns[sColumn]['display'] || aDefaultColumns[sColumn]['text'] === ''))){
            	if (this.__small && this.__smallOptions.sort){
					sColumn = this.__smallOptions.sort;
					sSortType = this.__smallOptions.sorttype || 'desc';

					bSave = false;
            	}
            	else{
					var srt = (Cookie.__defaultViews[sFolType] || {}).sort || {};
					sColumn = srt.column;
					sSortType = srt.type;
				}
			}

			if (bSave)
				Cookie.set(['views',aFolder['aid'],aFolder['fid'],'sort'],{column:sColumn,type:sSortType?'desc':'asc'});
		}

		//Get filter from Cookie
		if (this.__small){
			var	f = Cookie.get(['views',aFolder['aid'],aFolder['fid'],'filter']) || '';
			if (this.__smallOptions && this.__smallOptions.filters)
				for (var i = this.__smallOptions.filters.length-1;i>=0;i--)
					if (this.__smallOptions.filters[i].search == f){
						this._smallfilter = f;
						break;
					}
		}
	}
	//not used at this time
	else{
        sColumn = typeof sColumn == 'undefined'?this.__sortColumn:sColumn;
		sSortType = typeof sSortType == 'undefined'?this.__sortType:sSortType;
        //check
		if (aDefaultColumns && !aDefaultColumns[sColumn]){
			sColumn = '';
			sSortType = '';
		}
	}

	this.__sortColumn = sColumn;
	this.__sortType = sSortType;


	//ORDER
	var sOrder = this._serverOrder(sColumn,sSortType);
	if (sOrder)
		aFilter.sort = sOrder;

	//SQL FILTER
	if (this._SQLsearch_last != this._SQLsearch){
		this._value([]);
		this._SQLsearch_last = this._SQLsearch;
	}

	if (this._defaultfilter || this._SQLsearch || (this.__small && this._smallfilter)){

		aFilter['search'] = this.__small && this._smallfilter?this._smallfilter:'';

		if (this._defaultfilter)
			aFilter['search'] += aFilter['search']?' AND ('+ this._defaultfilter +')':this._defaultfilter;

		if (this._SQLsearch)
			aFilter['search'] += aFilter['search']?' AND ('+ this._SQLsearch +')':this._SQLsearch;
	}

	//FULLTEXT SEARCH
	if (this._SQLfulltext_last != this._SQLfulltext){
		this._value([]);

		this._SQLfulltext_last = this._SQLfulltext;
	}
	if (this._SQLfulltext)
		aFilter['fulltext'] = this._SQLfulltext;

	this.__filter = aFilter;

	//Hide No Items
	this._getAnchor('noitems').style.display = 'none';

	WMItems.list({'aid':aFolder['aid'],'fid':aFolder['fid'],'spam':aFolder['spam'],'values':aValues,'filter':aFilter},this._listener_data,this._listenerPath_data,'',aHandler);
};


_me._serverOrder = function(sColumn,iType){

	var sOrderBy = '',
		sSortType = iType?'desc':'asc';

	switch(sColumn)
	{
		//Contacts
		case 'ITMCLASSIFYAS':
			if (GWOthers.getItem('RESTRICTIONS','sortstring') == '1')
				sOrderBy = 'ITMSORTSTRING ' + sSortType + ','+ sColumn + ' ' + sSortType;
			else
				sOrderBy = sColumn + ' ' + sSortType;

		case 'CONTACT_EMAIL':
			var aContactEmailParts = ['LCTEMAIL1','LCTEMAIL2','LCTEMAIL3'];

			for (var n in aContactEmailParts){
				if (sOrderBy)
					sOrderBy += ',';

				sOrderBy += aContactEmailParts[n] + ' ' + sSortType;
			}
			break;

		case 'PHONE':
			sOrderBy = 'LCTPHONE ' + sSortType;
			break;

		//Events
		case 'EVENT_ENDDATE':
			sOrderBy = 'EVNENDDATE ' + sSortType + ',EVNENDTIME ' + sSortType;
			break;

		case 'EVENT_STARTDATE':
			sOrderBy = 'EVNSTARTDATE ' + sSortType + ',EVNSTARTTIME ' + sSortType;
			break;

		case 'EVNFILESIZE':
			sOrderBy = 'EVNCOMPLETE ' + sSortType;
			break;

		case 'EVNFILENAME':
			sOrderBy = 'EVNLOCATION ' + sSortType;
			break;

		//Mails
		case 'FROM':
			sOrderBy = 'HEADER_FROM ' + sSortType;
			break;

		case 'TO':
			sOrderBy = 'HEADER_TO ' + sSortType;
			break;
		//Tasks
		case 'TASK_STARTDATE':
			sOrderBy = 'EVNENDDATE ' + sSortType;
			break;

		case 'TASK_ENDDATE':
			sOrderBy = 'EVNSTARTDATE ' + sSortType;
			break;

		case 'RECCURENCE':
			sOrderBy = 'EVNRCR_ID ' + sSortType;
			break;

		case 'ITMCOMPANY':
			sOrderBy = 'ITMCOMPANY ' + sSortType +', ITMDEPARTMENT ' + sSortType;
			break;

		case 'REMINDER':
			sOrderBy = 'RMNTIME ' + sSortType;
			break;

		default:
			if (sColumn)
				sOrderBy = sColumn + ' ' + sSortType;
	}

	//Order also by item_id, some DB doesn't do so automaticaly
	var f = this._getFolder();
	if (dataSet.get('folders',[f.aid,f.fid,'TYPE'])=='M')
		sOrderBy += (sOrderBy?', ':'') + 'item_id ' + sSortType;

	return sOrderBy;
};

//return actual visible range
_me.__getRange = function(){
	var a = Math.floor(this.__eContainer2.scrollTop/this._row_height) || 0,
		view = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

	//Browsers sometime return 0 at first time
	if (this.__eContainer2.clientHeight == 0)
		h = view;
	else
		h = Math.min(this.__eContainer2.offsetHeight, view);

	//Minimal height 300px
	h = Math.max(h, 300);

	return [a, Math.floor(h/this._row_height)];
};

_me._listen_data = function(sDataSet,aDataPath,bNoUpdate){
	this._listener_data = sDataSet;
	if (typeof aDataPath == 'object') this._listenerPath_data = aDataPath;

	dataSet.obey(this,'_listener_data',sDataSet,bNoUpdate);
};

_me.__update = function(sName,aDPath){

	// columns  - do budoucna pro vyreseni optional columns
	if (sName && sName == this._listener){
		this._addColumns(dataSet.get(this._listener,this._listenerPath));
		return;
	}
	else
	// data
	if (sName != this._listener_data)
		return;

	var aItems = dataSet.get(this._listener_data,this._listenerPath_data);

	//clear DG if no data response
	if (!aItems || !this._aFolder){
		//this._addColumns([]);      //pokud se tohle odkomentuje, tak se smaze obsah DG pri prazdym response (stava se na spatny connection + FF)
		return;
	}

	//check for proper folder response
	for(var sAccId in aItems){
		for(var sFolId in aItems[sAccId])
			break;
		break;
	}

	//check if data are from latest request
	if (sAccId != this._aFolder.aid || sFolId != this._aFolder.fid)
		return;

	//Check if folder is the same or new
	var bNewFolder = true;
	if (this._aFolderLast && this._aFolderLast.aid == this._aFolder.aid && this._aFolderLast.fid == this._aFolder.fid && !Is.Empty(this._aCols))
		bNewFolder = false;

	var sFolType = WMFolders.getType(this._aFolder);

/*	Edit just one row value (Part 1)
	if value in column with is same as sort	column is changed than whole list is refreshed
	if column name (aDPath[3]) is undefined then only row's CSS is changed */
	if (aDPath && aDPath[2] && aItems[aDPath[0]][aDPath[1]][aDPath[2]] && (!aDPath[3] || (aDPath[3] && this.__sortColumn!=aDPath[3]))){

		var tmp,rowOffset = -1;

		if (this.__small){
			if ((tmp = this.__getElement([aDPath[2], '*']))){
				if ((rowOffset = parseInt(tmp.style.top))<0)
					return;

				tmp.parentNode.removeChild(tmp);
				tmp = null;
			}
		}
		else
			for(var sCol in this._aCols){
				if ((tmp = this.__getElement([aDPath[2], sCol]))){
					if (rowOffset<0 && (rowOffset = parseInt(tmp.style.top))<0)
						return;

					tmp.parentNode.removeChild(tmp);
					tmp = null;
				}
			}

		if (rowOffset<0)
			return;

		try{
			var aTmp = {};
				aTmp[aDPath[2]] = clone(aItems[aDPath[0]][aDPath[1]][aDPath[2]],true);

			aItems = aTmp;
		}
		catch(e){
			return;
		}
	}
	else{

		aItems = clone(aItems[sAccId][sFolId],true);

		//ATTRIBUTES
		delete aItems['@'];

		//TOTAL
		if (typeof aItems['/'] != 'undefined' && aItems['/'] >= 0){
			if (!(this.__total = aItems['/']*1))
				this._value([]);
		}
		else
		    this.__total = count(aItems);

		delete aItems['/'];


		//SUBTOTAL
		if (typeof aItems['#'] != 'undefined' && aItems['#']>=0){
			this.__subtotal = aItems['#']*1;
			this.__limit[1] = Math.min(this.__limit[1],this.__total);
		}
		delete aItems['#'];

		//OFFSET
		if (typeof aItems['$'] != 'undefined' && aItems['$']>=0){
			if (this.__offset!= aItems['$']*1)
				return;
			else
				this.__offset = aItems['$']*1;
		}
		delete aItems['$'];


		//LOAD NEW DATA IF COUNT DOESNT CORESPOND WITH SUBTOTAL
		if (count(aItems) != this.__subtotal){
			this._serverSort();
			return;
		}

		if (bNewFolder){

			this.__dragtype = 'item';

			///////////////////////
			///// FILL HEADER /////
			///////////////////////
			var aDefaultColumns = this._default_columns(sFolType),
				aColumns = {};

			//cookies
			if (this._cookiesEnabled)
			{
				var aCookieColumns = Cookie.get(['views',sAccId,sFolId,'columns',screen.width+'x'+screen.height]),
					aSort = Cookie.get(['views',sAccId,sFolId,'sort']),
					bRepair = false;

				if (aCookieColumns)
				{
					//compare columns default vs cookie
					for(var sColumn in aDefaultColumns)
						if (typeof aCookieColumns[sColumn] == 'undefined'){
							bRepair = true;
							break;
						}

					if (!bRepair)
						for(var sColumn in aCookieColumns)
							if (typeof aDefaultColumns[sColumn] == 'undefined'){
								bRepair = true;
								break;
							}

					//fix cookie
					if (bRepair){
						aColumns = aDefaultColumns;
						Cookie.set(['views',sAccId,sFolId,'columns',screen.width+'x'+screen.height]);
					}
					//set column order & width from cookie
					else
					for(var sColumn in aCookieColumns)
					{
						aColumns[sColumn] = aDefaultColumns[sColumn];
						if (aColumns[sColumn].type != 'static')
							aColumns[sColumn]['width'] = aCookieColumns[sColumn];
					}
				}
				else
					aColumns = aDefaultColumns;

				if (aSort && aSort.column && aColumns[aSort.column]){
					this.__sortColumn = aSort.column;
					this.__sortType = aSort.type == 'desc'?1:0;
				}
			}
			else
				aColumns = aDefaultColumns;


			var aHeaders = {};
			for(var sTitle in aColumns){

				aHeaders[sTitle] = {};
				if (typeof aColumns[sTitle].text == 'undefined')
					aHeaders[sTitle]['title'] = 'DATAGRID_ITEMS_VIEW::' + sTitle;

				for(var sProperty in aColumns[sTitle])
					aHeaders[sTitle][sProperty] = aColumns[sTitle][sProperty];
			}

			this._addColumns(aHeaders);
			this._select_all = false;
		}
	}


	if (this.info){
		if (this.__value.length>this.__total)
			this._value([]);

		this.info._value(this.__value.length,this.__total);
	}

	/////////////////////
	///// FILL BODY /////
	/////////////////////

	// Refill whole body
	this._fill(this._prepareBody(aItems, sFolType),rowOffset);

	this._aFolderLast = this._aFolder;
};

/**
 *	Naplnění pole pro datagrid
 **/
_me._prepareBody = function (aItems, sFolType){

	var me = this,
		aResult = {},aRow,scss,
		aColors =  {'1':'red','2':'blue','3':'green','4':'gray','5':'orange','6':'cyan','7':'brown','8':'purple','9':'light_blue','A':'yellow','Y':'complete'},
		aCFolder = false,
		contactName,
		companyName;

		aTags = dataSet.get('tags') || {};

	var aRights = WMFolders.getRights(this._aFolder),
		aAccess = WMFolders.getAccess(this._aFolder),
		sFolderType = WMFolders.getType(this._aFolder);

	if (aAccess.modify)
		addcss(this._main,'modify');
	else
		removecss(this._main,'modify');

	if (this._aFolder.aid == sPrimaryAccount && this._aFolder.fid == '__@@VIRTUAL@@__/__@@EVENTS@@__'){
		aCFolder = {};

		var aColors = getCalendarColor();
		for (var c in aColors)
			if (aColors[c])
				aCFolder[aColors[c].str_replace('/','\\')] = c;
	}

	// if ('AVATAR' in this._aCols)
	// 	var skin = GWOthers.getItem('LAYOUT_SETTINGS', 'skin');

	//Print tags Private function
	function tags(sData, bRight){
		if (sData){
			var out = '<p class="tag'+ (bRight?' right':'') +'">',
				arr = sData.split(',');

			for (var sTag in arr)
				if ((arr[sTag] = arr[sTag].trim()))
					out += '<span' + (aTags && aTags[arr[sTag]] && aTags[arr[sTag]].TAGCOLOR?' style="background-color: '+ aTags[arr[sTag]].TAGCOLOR +'; color: '+ aTags[arr[sTag]].TEXTCOLOR +'"':'')+ (me.__small?' title="'+ arr[sTag].escapeHTML().replace(/"/g, '&quot;') +'"':'') +'>'+ (me.__small?'':arr[sTag].escapeHTML()) +'</span>';

			return out + '</p>';
		}
		return '';
	};

	var tmp, tags_html;
	for(var sItId in aItems)
	{
		aRow = {};

		scss = ['CLASS_' + (aItems[sItId]['ITMCLASS'] || aItems[sItId]['EVNCLASS'] || sFolderType)];

		for(var sTitle in this._aCols)
		{
			tags_html = '';

			switch(sTitle)
			{

				//Contacts
				case 'AVATAR':
					if (this.__small && aItems[sItId]['ITMCLASS'] == 'C'){
						aRow[sTitle] = '<div style="background-image: url(\''+getContactAvatarURL(sItId) + '\')"></div>';
					}
					break;

				case 'CONTACT_EMAIL':
					var sContactEmail = '';

					//Nezobrazujeme maily pro distribuční seznam
					if (aItems[sItId]['ITMCLASS'] == 'C') {
						var aContactEmailParts = ['LCTEMAIL1','LCTEMAIL2','LCTEMAIL3'];

						for (var n in aContactEmailParts)
							if (aItems[sItId][aContactEmailParts[n]]){
								if (sContactEmail)
									sContactEmail += ', ';

								sContactEmail += aItems[sItId][aContactEmailParts[n]];
							}
					}
					aRow[sTitle] = sContactEmail;
					break;

				case 'ITMCOMPANY':
					tmp = aItems[sItId][sTitle] || '';
					if (aItems[sItId].ITMDEPARTMENT)
						tmp += (tmp?' - ':'') + aItems[sItId].ITMDEPARTMENT;

					aRow[sTitle] = [tmp,tmp];
					break;

				case 'PHONE':

					tmp = [];
					if (aItems[sItId]['LCTPHNMOBILE'])
						tmp.push(aItems[sItId]['LCTPHNMOBILE']);
					if (aItems[sItId]['LCTPHNWORK1'])
						tmp.push(aItems[sItId]['LCTPHNWORK1']);
					if (aItems[sItId]['LCTPHNFAXWORK'])
						tmp.push(aItems[sItId]['LCTPHNFAXWORK']);
					if (aItems[sItId]['LCTPHNHOME1'])
						tmp.push(aItems[sItId]['LCTPHNHOME1']);

					aRow[sTitle] = tmp.join(', ');

					break;

				case 'ITMCLASS':
					if (sFolType == 'G')
                        scss.push('ico_type_' + aItems[sItId].ITMCLASS);
					else
					if (aItems[sItId].ITMCLASS == 'L')
						scss.push('distrib');

					break;

				case 'ITMCLASSIFYAS':
					contactName = aItems[sItId][sTitle];

					companyName = '';
					if (this.__small && aItems[sItId].ITMCOMPANY) {
						companyName = '<span class="contactCompany">, ' + aItems[sItId].ITMCOMPANY.escapeHTML() + '</span>';
					}

					if (contactName){
						if (this.__small){
							tags_html = tags(aItems[sItId].ITMCATEGORY, true);

							if (tags_html)
								scss.push('tags');
						}

						if (Is.String(contactName)){
							if (aItems[sItId].ITMCLASS == 'L')
								aRow[sTitle] = ['['+contactName.escapeHTML()+']' + tags_html, contactName];
							else
								aRow[sTitle] = [contactName.escapeHTML() + companyName + tags_html, contactName];
						}
						else {
							aRow[sTitle] = contactName.escapeHTML() + tags_html;
						}
					}

					break;
				// Events
				case 'EVNFOLDER':
					if (aCFolder){
						aRow[sTitle] = ['','',aItems[sItId].EVNFOLDER];
						scss.push(aCFolder[aItems[sItId].EVNFOLDER]);
					}

					break;

				case 'ITMCATEGORY':
				case 'EVNTYPE':
					if (aItems[sItId][sTitle]){
						aRow[sTitle] = [tags(aItems[sItId][sTitle]),'',aItems[sItId][sTitle]];
						scss.push('tags');
					}
					break;

				case 'EVENT_ENDDATE':
					aRow[sTitle] = [(this.__small?tags(aItems[sItId]['EVNTYPE']):'') + this.__parseGwTime(aItems[sItId]['EVNENDDATE'],aItems[sItId]['EVNENDTIME'],true),parseInt(aItems[sItId]['EVNENDDATE'])*10000 + parseInt(aItems[sItId]['EVNENDTIME'])];
					break;

				case 'EVN_MODIFIED':
					if (this.__small){
						tags_html = tags(aItems[sItId].EVNTYPE, true);
						if (tags_html)
							scss.push('tags');
					}

					aRow[sTitle] = CalendarFormatting.normalWithTime(new IcewarpDate(aItems[sItId]['EVN_MODIFIED'], {format: 'X'})) + tags_html;
					break;

				case 'EVENT_STARTDATE':
					aRow[sTitle] = [this.__parseGwTime(aItems[sItId]['EVNSTARTDATE'], aItems[sItId]['EVNSTARTTIME']), parseInt(aItems[sItId]['EVNSTARTDATE']) * 10000 + parseInt(aItems[sItId]['EVNSTARTTIME'])];
					break;

				case 'RECCURENCE':
					// Display recurrence icon, but not for tasks that are finished (EVNSTATUS only for tasks)
					if (aItems[sItId]['EVNRCR_ID'] && (aItems[sItId]['EVNSTATUS']!='M' || !aItems[sItId]['EVNSTATUS'])) {
						scss.push('recurrence');
						aRow[sTitle] = ['',1];
					} else
						aRow[sTitle] = ['',0];
					break;

				case 'CONFERENCE':
					if (aItems[sItId]['EVNMEETINGID']) {
						scss.push('conference');
						aRow[sTitle] = ['',1];
					} else
						aRow[sTitle] = ['',0];
					break;

				case 'REMINDER':
					if (aItems[sItId]['RMNEVN_ID']) {
						scss.push('reminder');
						aRow[sTitle] = ['',1];
					} else
						aRow[sTitle] = ['',0];
					break;

				case 'EVNFILENAME':
					aRow[sTitle] = Is.String(aItems[sItId]['EVNLOCATION'])?aItems[sItId]['EVNLOCATION'].escapeHTML():'';

					//set ico
					if (aRow[sTitle] && aRow[sTitle].indexOf('.')>-1)
						aRow['ico'] = ['','','','ico_'+ (Path.extension(aRow[sTitle]))];

					break;

				case 'EVNSTATUS':
					var txt = '';
					switch (aItems[sItId][sTitle]) {
						case 'B':
							scss.push('not_started');
							txt = getLang('TASK::NOT_STARTED');
							break;
						case 'I':
							scss.push('in_progress');
							txt = getLang('TASK::IN_PROGRESS');
							break;

						case 'M':
							scss.push('completed');
							txt = getLang('TASK::COMPLETED');
							break;
						case 'Q':
							scss.push('deferred');
							txt = getLang('TASK::DEFERRED');
							break;
						case 'N':
							scss.push('waiting');
							txt = getLang('TASK::WAITING');
							break;
					}
					aRow[sTitle] = ['', aItems[sItId][sTitle], txt];
					break;
				//Tasks
				case 'EVNCOMPLETE':
					if (aItems[sItId][sTitle]>0)
						switch(aItems[sItId].EVNSTATUS){
							case 'I':
							case 'Q':
							case 'N':
								if (this.__small)
									aRow[sTitle] = aItems[sItId][sTitle] + '%';
								else
									aRow.EVNSTATUS = aItems[sItId][sTitle] + '%';
						}

					break;

				case 'EVNPRIORITY':
					switch (aItems[sItId]['EVNPRIORITY']) {
						case '1':
							scss.push('priority_high');
							break;
						case '9':
							scss.push('priority_low');
							break;
					}
					break;

				case 'TASK_STARTDATE':
					aRow[sTitle] = [this.__parseGwTime(aItems[sItId]['EVNENDDATE']),parseInt(aItems[sItId]['EVNENDDATE'])];
					break;

				case 'TASK_ENDDATE':
					if (this.__small){
						tags_html = tags(aItems[sItId].EVNTYPE);
						if (tags_html) {
							scss.push('tags');
						}
					}

					aRow[sTitle] = [tags_html + this.__parseGwTime(aItems[sItId]['EVNSTARTDATE']), parseInt(aItems[sItId]['EVNSTARTDATE'])];
					break;

				case 'EVNTITLE':

					if (!this.__small || sFolType === 'N'){
						tags_html = tags(aItems[sItId].EVNTYPE);
						if (tags_html) {
							scss.push('tags');
						}
					}

					aRow[sTitle] = [(aItems[sItId][sTitle] || '').escapeHTML() + tags_html, '', aItems[sItId][sTitle]];
					break;

				//Mails
				case 'SUBJECT':

					var tmp = aItems[sItId][sTitle]?aItems[sItId][sTitle].escapeHTML():'&nbsp;';
/*
					if (aItems[sItId]['TAGS']){
						tmp += '<p class="tag">';

						var arr = aItems[sItId]['TAGS'].split(',');
						for (var sTag in arr)
							if ((arr[sTag] = arr[sTag].trim()))
								tmp += '<span' + (aTags && aTags[arr[sTag]] && aTags[arr[sTag]].TAGCOLOR?' style="background-color: '+ aTags[arr[sTag]].TAGCOLOR +'; color: '+ aTags[arr[sTag]].TEXTCOLOR +'"':'')+ (this.__small?' title="'+ arr[sTag].escapeHTML().replace(/"/g, '&quot;') +'"':'') +'>'+ (this.__small?'':arr[sTag].escapeHTML()) +'</span>';

						tmp += '</p>';
					}
*/
					var tags_html = tags(aItems[sItId]['TAGS'], true);
					if (tags_html) {
						tmp += tags_html;
						scss.push('tags');
					}

					aRow[sTitle] = [tmp, '', aItems[sItId][sTitle]];
					break;

				case 'ITEM_MOVED':
				case 'ITM_DELETED':	//GW TRASH
				case 'DATE':	//EMAIL
				case 'QDATE':	//Quarantine
					aRow[sTitle] = this.__parseTime(aItems[sItId][sTitle]),parseInt(aItems[sItId][sTitle]);
					break;

				case 'PRIORITY':
					if(Is.Defined(aItems[sItId]['PRIORITY'])) {
						switch (aItems[sItId]['PRIORITY'].toString()) {
							case '1':
							case '2':
								scss.push('priority_high');
								aRow[sTitle] = ['',2];
								break;

							case '4':
							case '5':
								scss.push('priority_low');
								aRow[sTitle] = ['',0];
								break;

							default:
								aRow[sTitle] = ['',1];
						}
					}
					break;

				case 'COLOR':
					if (aItems[sItId].COLOR && Is.Defined(aColors[aItems[sItId].COLOR]))
						scss.push('bg_' + aColors[aItems[sItId].COLOR]);

					aRow[sTitle] = ['', aItems[sItId].COLOR];
					break;

				case 'LOCK':
					if (aItems[sItId].EVNLOCKOWN_ID){
						scss.push((aRights.owner || aItems[sItId].EVNLOCKOWN_ID == sPrimaryAccountGWID) && aAccess.modify?' lock':' lock2');
						aRow[sTitle] = ['', '', aItems[sItId].EVNLOCKOWN_ID == sPrimaryAccountGWID ? getLang('FILE::LOCKED_BY_ME') : (aItems[sItId].EVNLOCKOWN_EMAIL ? getLang('FILE::LOCKED_BY', [aItems[sItId].EVNLOCKOWN_EMAIL]) : getLang('FILE::LOCKED'))];
					}
					break;

				case 'FLAGS':
					var nFlags = aItems[sItId]['FLAGS'],
						aFlag = [];

					if (!WMItems.hasFlag(nFlags, 'SEEN'))
						aFlag.push('unread');
					// else
					if (WMItems.hasFlag(nFlags, 'ANSWERED')) {
						if (WMItems.hasFlag(nFlags, 'FORWARDED'))
							aFlag.push('replied_and_forwarded');
						else
							aFlag.push('replied');
					}
					else
					if (WMItems.hasFlag(nFlags, 'FORWARDED'))
						aFlag.push('forwarded');

					aRow[sTitle] = ['',nFlags];

					switch(parseInt(aItems[sItId]['SMIME_STATUS'])){
						case 2: aFlag.push('serror'); break;
						case 3: aFlag.push('smime'); break;
						case 4: aFlag.push('sign'); break;
						case 5: aFlag.push('ssmime'); break;
					}

					if (aFlag.length)
						scss.push(aFlag.join(' '));

					break;

				case 'HAS_ATTACHMENT':
					if (aItems[sItId]['HAS_ATTACHMENT']=='true') {
						scss.push('attachment');
						aRow[sTitle] = ['',1];
					}
					else
						aRow[sTitle] = ['',0];
					break;

				case 'FROM':
				case 'TO':
					aRow[sTitle] = MailAddress.splitNames(aItems[sItId][sTitle]);
					if (sTitle == 'TO' && aItems[sItId]['SMS'])
						aRow[sTitle] += (aRow[sTitle]?', ':'') + MailAddress.splitNames(aItems[sItId]['SMS']);

					break;

				case 'SMS':
					break;

				case 'SIZE':
					aRow[sTitle] = [parseFileSize(aItems[sItId][sTitle]),parseInt(aItems[sItId][sTitle])];
					break;

				case 'EVNFILESIZE':
					var sSize = aItems[sItId]['EVNCOMPLETE'];
					if (!Is.Defined(sSize))
						sSize = 0;

					if (this.__small){
						tags_html = tags(aItems[sItId].EVNTYPE);
						if (tags_html) {
							scss.push('tags');
						}
					}

					aRow[sTitle] = [tags_html + parseFileSize(sSize), parseInt(sSize)];
					break;

				case 'EVNNOTE':
					if (aItems[sItId]['EVNDESCFORMAT'] == 'text/html' && aItems[sItId][sTitle]){
						aRow[sTitle] = [aItems[sItId][sTitle].removeTags(), aItems[sItId][sTitle]];
						break;
					}
				// Recovery items
				case 'ITMTITLE':
					// For teamchat posts replace title with description (message text is stored in description field) to avoid empty lines
					if ('G' === sFolType &&  'I' === aItems[sItId]['ITMCLASS']) {
						aItems[sItId][sTitle] = aItems[sItId]['ITMDESCRIPTION'];
					}

				default:
					if (Is.String(aItems[sItId][sTitle]))
						aRow[sTitle] = [aItems[sItId][sTitle],aItems[sItId][sTitle]];
					else
						aRow[sTitle] = aItems[sItId][sTitle];

					break;
			}
		}

		aResult[sItId] = {"id":sItId,"css":scss.join(' '),"data":aRow,"arg":{'aid':this._aFolder.aid,'fid':this._aFolder.fid,'iid':sItId}};
	}

	return aResult;
};

// FUNCTION(s) FOR PARSING DATA
_me.__parseTime = function(nUTime)
{
	if (!nUTime){ return '';}
	var oDate = new IcewarpDate(nUTime * 1000);
	return [CalendarFormatting.simplified(oDate), '', oDate.format("L LT")];
};

_me.__parseGwTime = function(sDate,sTime,bEnd){
	if (typeof sTime == 'undefined') {
		if (typeof sDate == 'undefined' || sDate == 0) {
			return '';
		}
	}
	var oDate = new IcewarpDate(sDate, {format: IcewarpDate.JULIAN});
	oDate.setTime(sTime > 0 ? sTime : 0, true);

	if (bEnd && sTime < 0) {
		oDate.date(oDate.date() - 1);
	}
	return CalendarFormatting.normalWithTime(oDate);
};

/**
 * store column cookies
 **/
_me._onresizeend = function(aColumns)
{
	if (this._cookiesEnabled && this._getFolder)
	{
		var oFolder = this._getFolder();
		if (!oFolder)
			return;

		var aNewColumns = {};
		for(var sColumn in aColumns)
			aNewColumns[sColumn] = aColumns[sColumn]['width'];

		Cookie.set(['views',oFolder['aid'],oFolder['fid'],'columns',screen.width+'x'+screen.height],aNewColumns,true);
	}
};

/**
 * historical reasons, it can be called from outside
 **/
_me._getFolder = function(){
	return this._aFolder;
};
