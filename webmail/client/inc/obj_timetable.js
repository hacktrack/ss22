_me = obj_timetable.prototype;
function obj_timetable(){};

_me.__constructor = function(owner,evnid,bAttendee){

	var me = this;

	//Primary account for organizator
	this.__owner = owner || sPrimaryAccount;
	this.__evnid = evnid || {};
	this.__attendee = bAttendee;

	//WORKING HOURS
	storage.library('gw_others');
	this.__workstart = GWOthers.getItem('CALENDAR_SETTINGS','day_begins')*60;
	this.__workend = GWOthers.getItem('CALENDAR_SETTINGS','day_ends')*60;

	this.__base_position = 10080;
	this.__base_date = (new IcewarpDate()).format('julian'); //2454408(vybrany - 3dny)

	this.__rendered = {}; //contains rendered days

	this.__range = 21600;	//whole date range (15days)  LICHE!
	this.__hop = 4320;      //add days after rich of end (3days)
	this.__hopzone = 1440;

	this.__tzid = '';

	this.__oldMove;
	this.__oldUp;

    this.__data = {};
	this.__users = [];
	this.__timer;

	this.__value = {};

	this._body = this._getAnchor('body');
	this._list = this._getAnchor('list');
	this._heading = this._getAnchor('heading');

	storage.library('wm_freebusy');
	this._freeBusy = new wm_freebusy();

	//prepare timeline
	this._time = mkElement('div', {'className':'timeline'});
	this._time.style.width = this.__range + 'px';
	this._getAnchor('time').appendChild(this._time);

	//Prepare container
	this._container = mkElement('div',{className:'container',unselectable:"on"});
	this._container.style.width = this.__range + 'px';
	this._getAnchor('body').appendChild(this._container);

	this._getAnchor('body').unselectable = "on";

	//Scroll handler
	this._body.onscroll = function(e){
		var scpos = this.scrollLeft;

		me._list.style.marginTop = (this.scrollTop*-1) + 'px';
		me._time.style.marginLeft = (scpos*-1) + 'px';

		var pozice = Math.floor((scpos-me.__base_position)/1440);
		var zobrazeno = Math.ceil(this.clientWidth/1440)+Math.floor(((scpos%1440)+this.clientWidth)/1440);

		for(var i = 0;i<zobrazeno;i++)
			if (typeof me.__rendered[me.__base_date + pozice + i] == 'undefined')
				me._addDay(me.__base_date + pozice + i);

		if (this.__timer)
			window.clearTimeout(this.__timer);
		this.__timer = setTimeout(me._pathName+'.__query('+ (me.__base_date + pozice) +','+ (me.__base_date + pozice + zobrazeno - 1) +')',500);
	};

	this._body.onmousedown = function(e){
		this.__lastScrollLeft = this.scrollLeft;
	};

	//Other Browsers onmouseup handler
	if (currentBrowser().indexOf('MSIE')!==0)
		this._body.onmouseup = function(e){
			var e = e || window.event;
			var elm = e.target || e.srcElement;

			if (elm==this && this.__lastScrollLeft != this.scrollLeft){
				if (this.scrollLeft<me.__hopzone)
					me._scrollPrev();
				else
				if (me._container.clientWidth-this.scrollLeft<me.__hopzone)
					me._scrollNext();
			}
		};

	//Prev Button
	this.rf._onclick = function(){
		me._body.scrollLeft = 0;
		me._scrollPrev();
	};

	//Next Button
	this.ff._onclick = function(){
		me._body.scrollLeft = me._body.scrollWidth;
		me._scrollNext();
	};

	//Today
	this.now._onclick = function () {
		var d = new IcewarpDate();
		me._setDate(d.format(IcewarpDate.JULIAN), d.format(IcewarpDate.JULIAN_TIME));
	};

	var dispatch = function (){
		gui._disobeyEvent('mouseup',[dispatch]);
		gui._disobeyEvent('mousemove',[me,'__move_handler']);

		if (me._onselectend)
        	me._onselectend(me._value());
	};

	/* SELECTION */
	this._container.ondragstart = function(e){ return false; };
	this._container.onmousedown = function(e){
		var e = e || window.event;
		var elm = e.target || e.srcElement;

		var posC = getSize(me._body);

		//resize selection
		if (elm.className && (elm.className == 'LSide' || elm.className == 'RSide')){

			gui._obeyEvent('mouseup',[dispatch]);

			var div  = document.getElementById(me._pathName+'/selection');
			var posX = div.offsetLeft;
			var posD = div.offsetWidth;

			if (elm.className == 'LSide'){

				if (me.__move_handler)
					gui._disobeyEvent('mousemove',[me,'__move_handler']);

				me.__move_handler = function (e){

					var move = e.clientX - posC.x + me._body.scrollLeft;
					var moveX = Math.floor(move/30)*30;
					var move15 = Math.floor(move/15)*15;
					if (move15<=moveX){
						if (posD + posX - moveX<30)
							moveX = posD + posX - 30;

						div.style.width = (posD + (posX-moveX)) + 'px';
						div.style.left = moveX + 'px';

						//SET VALUE
						var a = me.__base_date - (me.__base_position/1440);
						var b = Math.floor(moveX/1440);
                        me.__value.STARTDATE = a + b;
                        me.__value.STARTTIME = moveX - (b*1440);
					}
				};
				gui._obeyEvent('mousemove',[me,'__move_handler']);

			}
			else
			if (elm.className == 'RSide'){

				if (me.__move_handler)
					gui._disobeyEvent('mousemove',[me,'__move_handler']);

				me.__move_handler = function (e){

					var move = e.clientX - posC.x + me._body.scrollLeft;
					var move15 = Math.ceil(move/15)*15;
					var moveX = Math.ceil(move/30)*30;

					if (move15>=moveX){
						if (moveX<=posX)
							posX = moveX - 30;

						div.style.width = (moveX - posX)+'px';

						//SET VALUE
						var a = me.__base_date - (me.__base_position/1440);
						var b = Math.floor(posX/1440);

						me.__value.ENDDATE = a + b;

						var dif,tmp = moveX - (b*1440);
						if (tmp>1440){
							dif = Math.floor(tmp/1440);
							me.__value.ENDDATE += dif;
							me.__value.ENDTIME = tmp - (dif*1440);
						}
						else
                        	me.__value.ENDTIME = tmp;
					}

				};
				gui._obeyEvent('mousemove',[me,'__move_handler']);

			}


    		return;
		}

		var posX = e.clientX - posC.x + me._body.scrollLeft;
			posX = Math.floor(posX/30)*30;

		var a = me.__base_date - (me.__base_position/1440);
		var b = Math.floor(posX/1440);

		me._value({STARTDATE:a + b,STARTTIME: posX-(b*1440),ENDDATE:a + b,ENDTIME:posX-(b*1440)+30},1);

		var div = document.getElementById(me._pathName+'/selection');

		//RESIZE 2
		gui._obeyEvent('mouseup',[dispatch]);
		if (me.__move_handler)
			gui._disobeyEvent('mousemove',[me,'__move_handler']);

		me.__move_handler = function(e){

			var move = e.clientX - posC.x + me._body.scrollLeft;
			var move15 = Math.ceil(move/15)*15;
			var moveX = Math.ceil(move/30)*30;

			var left,width;

			if (move15>posX && move15>=moveX){
				left = posX;
				width = moveX - posX;
			}
			else{
				moveX = Math.floor(move/30)*30;
				move15 = Math.floor(move/15)*15;
				if (move15<posX && move15<=moveX){
					left = moveX;
					width = posX-moveX;
				}
			}

			//SET VALUE
			var b,a = me.__base_date - (me.__base_position/1440);
			if (!Is.Undefined(left)){
				b = Math.floor(left/1440);
                me.__value.STARTDATE = a + b;
                me.__value.STARTTIME = left - (b*1440);

				div.style.left = left + 'px';
			}

			if (!Is.Undefined(width)){
				var b = Math.floor((left+width)/1440);
				me.__value.ENDDATE = a + b;
                me.__value.ENDTIME = (left+width) - (b*1440);

				div.style.width = width + 'px';
			}
		};
		gui._obeyEvent('mousemove',[me,'__move_handler']);

		/*
		//MSIE stupid scroll fix
		if (currentBrowser().indexOf('MSIE') === 0)
			setTimeout(me._pathName+'._body.scrollLeft = '+me._body.scrollLeft,0);
		*/
	};


	//Add BUTTONS
	if (me.__attendee){
		this.add_button._disabled(true);
		this.addr_button._disabled(true);
		this.inp_add._disabled(true);
	}
	else{
		this.add_button._onclick = function() {
			gui._create('address_book', 'frm_addaddress', '', '',[me, '__onAddNewFromAddressbook',['Q']], ['ADDRESS_BOOK::SELECTED_ADDRESSES'],'','',true,undefined,true);
		};
		if (dataSet.get('main',['resources_path'])){
			this.addr_button._disabled(false);
			this.addr_button._onclick = function() {
				var frm = gui._create('address_book', 'frm_addaddress', '', '',[me, '__onAddNewFromAddressbook',['S']], ['ADDRESS_BOOK::SELECTED_ADDRESSES'],'','',true,4);
					frm.select._disabled(true);
			};
		}

		this.inp_add._single = true;
		this.inp_add.__minWidth = 400;

		this.inp_add._disobeyEvent('change',[this.inp_add,'_checksize']);
	    this.inp_add._checksize = function(){};
		this.inp_add._placeholder(getLang('ATTENDEES::QUICK_ADD'));
		this.inp_add._onsubmit = function(){
			if (!this._checkError.length){
				var tmp = MailAddress.splitEmailsAndNames(this._value());
				this._value('');
				if (tmp && tmp[0] && tmp[0].email)
					me.__onAddNewFromAddressbook(true,[[MailAddress.createEmail(tmp[0].name, tmp[0].email)]]);
			}
		};
		this.inp_add._onmouseselect = this.inp_add._onsubmit;
		this.inp_add._restrict([function(v){
			if (v === '') return true;
			var tmp = MailAddress.splitEmailsAndNames(v);
			if (tmp && tmp[0] && tmp[0].email)
				return Is.Email(tmp[0].email);

			return false;
		}]);
	}

	///////////////////////////
	//////// USER LIST ////////
	///////////////////////////
	this._list.__users = [];

	// User roles:
	//   Required='Q', Resource='S', Optional='T', Organizer='G';

	// User status:
	//   Accepted = 'A'; Declined = 'D'; Delegated = 'E'; None = 'N';
	//   Completed = 'M'; NeedsAction = 'B'; Tentative = 'T'; Confirmed = 'C';
	//   Cancelled = 'Q'; InProcess = 'I'; Draft = 'F'; Final = 'L';

	// Clicking email icon will send email to all participants except yourself and resources
	this._heading.onclick = function(e) {
		if((e.offsetX>228 && !gui._rtl || gui._rtl && e.offsetX<22) && me._list.__users.length) {
			var to = [];
			for(var i=0; i<me._list.__users.length; i++) {
				var user = me._list.__users[i];
				if(user.email!=sPrimaryAccount && user.role!='S' && user.email !== '__@@groupchat@@__')
					to.push(MailAddress.createEmail(user.name,user.email));
			}
			if(to.length)
				NewMessage.compose({to:to.join(',')});
		}
	};

	this._list.onclick = function(e){
		var e = e || window.event,
			elm = e.target || e.srcElement,
			bRemove = false;

		if (elm.tagName == 'SPAN') {
			bRemove = true;
			elm = elm.parentNode;
		};

		var id = elm.id.substr((me._pathName+'.list/').length);

		if (this.__users[id] && id>0){

			if (this.__users[id].active && (e.ctrlKey  || e.metaKey)){
				removecss(elm,'active');
				this.__users[id].active = false;
			}
			else{
				if (!e.ctrlKey && !e.metaKey){
					var active = this._getActive();
					var tmp;
					for (var i in active){
						try{
							tmp = document.getElementById(me._pathName+'.list/'+active[i]);
							removecss(tmp,'active');
							this.__users[active[i]].active = false;
						}
						catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}
					}
				}

				addcss(elm,'active');
				this.__users[id].active = true;
			}

			if (bRemove)
				me._list._removeUser();
			else{
				var pos = e.clientX-getSize(elm).x;
				if (pos<40 && !gui._rtl || gui._rtl && pos>205){

					this.oncontextmenu(e);

					e.cancelBubble=true;
					if (e.preventDefault)
						e.preventDefault();
					if (e.stopPropagation)
						e.stopPropagation();

					return false;
				}
			}
		}
	};

	this._list.oncontextmenu = function(e){
		var e = e || window.event,
			elm = e.target || e.srcElement;

		if (elm.tagName == 'SPAN')
			elm = elm.parentNode;

		var id = elm.id.substr((me._pathName+'.list/').length);

		if (this.__users[id] && id>0){
			var aMenu,pos = getSize(elm);

			//Attendee is not able to change STATUS
			if (e.clientX-pos.x<20 && me.__attendee)
				return;

			me.cmenu = gui._create('cmenu','obj_context','','obj_timetable_context');

			me.cmenu._onclick = function(e,elm,id,arg){
				var usr;
                if ((usr = me._list.__users[arg.id])){
                    usr[arg.key] = arg.value;
                    me._list._editUser(usr, arg.id);
				}
			};

			//Status
			if (e.clientX-pos.x<20 && !gui._rtl || gui._rtl && e.clientX-pos.x<228){

				aMenu = [{'title':'ATTENDEES::STATUS_P',css:'bg_status_P','arg':{'id':id,'key':'status',value:''}},
						{'title':'ATTENDEES::STATUS_A',css:'bg_status_A','arg':{'id':id,'key':'status',value:'A'}},
						{'title':'ATTENDEES::STATUS_D',css:'bg_status_D','arg':{'id':id,'key':'status',value:'D'}}];

				me.cmenu._fill(aMenu);
				me.cmenu._place(gui._rtl?pos.x+218:pos.x+10,pos.y+pos.h,150,2);
			}
			//Role
			else{
				aMenu = [{'title':'ATTENDEES::ROLE_Q',css:'bg_role_Q','arg':{'id':id,'key':'role',value:'Q'}},
						{'title':'ATTENDEES::ROLE_S',css:'bg_role_S','arg':{'id':id,'key':'role',value:'S'}},
						{'title':'ATTENDEES::ROLE_T',css:'bg_role_T','arg':{'id':id,'key':'role',value:'T'}}];

				me.cmenu._fill(aMenu);
				me.cmenu._place(gui._rtl?pos.x+236:pos.x+30,pos.y+pos.h,150,2);
			}
		}

		return false;
	};

	this._list.ondblclick = function(e){
		var e = e || window.event,
			elm = e.target || e.srcElement;

		if (elm.id && elm.id.indexOf((me._pathName+'.list/'))==0){
			var active = this._getActive();
			if (active.length){
				var user = this.__users[active[0]];
				gui._create('edit_dialog', 'frm_edit_attendee', '', '', 'frm_edit_attendee', 'ATTENDEES::EDIT_TITLE', [me, '__onEdit'], {CNTEMAIL:user.email,CNTCONTACTNAME:user.name,CNTROLE:user.role,CNTSTATUS:user.status}, active, me.__attendee);
			}
		}
		else
		if (elm.tagName != 'SPAN' && !me.__attendee)
			gui._create('edit_dialog', 'frm_edit_attendee', '', '', 'frm_edit_attendee', 'ATTENDEES::ADD_TITLE', [me, '__onAddNew'],'','',me.__owner != sPrimaryAccount);
	};

	//get all active rows
    this._list._getActive = function(){
		var active = [];
		for(var i in this.__users)
			if (this.__users[i] && this.__users[i].active && this.__users[i].action != 'remove')
                active.push(i);

		return active;
	};

	//fill list
    this._list._fill = function(){
		var c = 0, css, out = mkElement('div');

		var folder = me.__evnid.fid ? dataSet.get('folders', [me.__evnid.aid, me.__evnid.fid.replace(/\\/g, '/')]) : {};

		var bIsOrganizer = !me.__evnid.iid || this.__users.some(function(user) {
			return user.email === sPrimaryAccount && user.role === 'G';
		}) || ~(folder.RIGHTS || '').indexOf('w') || (me.__evnid.owner_id === sPrimaryAccountGWID);
		/*for(var i in dataSet.get('items', [sPrimaryAccount])) {
			var item = dataSet.get('items', [sPrimaryAccount, i, WMItems.__clientID(me.__evnid)]);
			if(item && item.EVNFLAGS & 2) {
				bIsOrganizer = true;
			}
		}*/
		for(var i = 0; i<this.__users.length;i++){

			if (this.__users[i].action == 'remove')
				continue;

            css = '';
			if (this.__users[i].status)
			    css = 'status_'+this.__users[i].status;

			if (this.__users[i].role)
			    css += (css?' ':'') + 'role_'+this.__users[i].role;

			out.appendChild(mkElement('div',{
				id:me._pathName+'.list/'+i,
				className:(this.__users[i].active?'active':'')+(this.__users[i].css?' '+this.__users[i].css:'')+' '+css,
				unselectable:'on',
				title:this.__users[i].email,
				innerHTML:MailAddress.createEmail(this.__users[i].name,this.__users[i].email).escapeHTML() + ((this.__users[i].role!='G' && bIsOrganizer)?'<span></span>':'')
			}));

			c++;
		}

		this.innerHTML = out.innerHTML;
		out = null;

		//set height because of scrollbar
		if (me._container)
			me._container.style.height = (c>8?(c*25)+'px':'100%');
	};

	//add user
	this._list._addUser = function(aInfo,bNoUpdate){
		if (aInfo.email && aInfo.email.indexOf('[') == 0){
			(new wm_tools()).distrib({name:aInfo.email},[this,'_addGroup',[aInfo.role/*,bNoUpdate*/]]);
			return false;
		}
		else{
			for(var i = this.__users.length-1;i>-1;i--)
			    if (this.__users[i].email == aInfo.email && this.__users[i].action != 'remove') //ignore
					return false;

			aInfo.action = 'new';
			this.__users.push(aInfo);
			this._fill();

			if (!bNoUpdate)
				me._update();

			return true;
		}
	};

	//add group of users
	this._list._addGroup = function(aData,sRole,bNoUpdate){

		for(var i in aData){
		    aData[i].role = sRole;
			this._addUser(aData[i],true);
		}

		if (!bNoUpdate)
			me._update();
	};

	//edit user
	this._list._editUser = function(aValues, iid){
		if (Is.Defined(iid) && this.__users[iid]){

			//check email
			for(var i = this.__users.length-1;i>-1;i--)
				if (i!=iid && this.__users[i].email == aValues.email){
					aValues.email = this.__users[iid].email;
					break;
				}

			//check update
			var doUpd = false;
			if (this.__users[iid].email != aValues.email)
                doUpd = true;

			//merge values
			for (var i in aValues)
				this.__users[iid][i] = aValues[i];

			this.__users[iid].action = 'edit';

			this._fill();

			if (doUpd)
				me._update();
		}
		else{
            aValues.checked = true;
			this._addUser(aValues);
		}
	};
	//remove user
	this._list._removeUser = function(){
		var rem = false;
		for(var i in this.__users)
			if (this.__users[i] && this.__users[i].active){
				if (this.__users[i].action == 'new')
				    this.__users.splice(i,1);
				else
					this.__users[i].action = 'remove';

				rem = true;
			}

		if (rem){
			this._fill();
            me.__data = {};
			me._update();
		}
	};

	//list.onmousewheel -> body
	AttachEvent(this._list, "onmousewheel", function(e){
		me._body.scrollTop += e.deltaY*10;
	});


	//INSERT DEFAULT ACCOUNT
    var acc = MailAddress.splitEmailsAndNames(this.__owner)[0];
    	acc.css = 'main_account';
		acc.role = 'G';
		acc.status = 'A';
	//var acc = {css:'main_account',email:this.__owner,role:'G',status:'A'};

	var aAccInfo = dataSet.get('accounts',[this.__owner]);
	if (aAccInfo && aAccInfo['FULLNAME'])
		acc.name = aAccInfo['FULLNAME'];

    this._list._addUser(acc,1);
};


_me._scrollPrev = function(){
	//SMAZAT POSLEDNI DNY ZPRAVA
	var base = this.__base_date + (((this.__range/1440)-1)/2);

	var elm;
	for (var i = (this.__hop/1440)-1;i>=0;i--){
		if (typeof this.__rendered[base-i] != 'undefined'){
            if ((elm = document.getElementById(this._pathName+'/body/'+(base-i)))){
			    elm.parentNode.removeChild(elm);
                elm = null;
            }
            if ((elm = document.getElementById(this._pathName+'/time/'+(base-i)))){
			    elm.parentNode.removeChild(elm);
                elm = null;
            }

            delete this.__rendered[base-i];
		}
	}

	//POSUNOUT ZBYTEK DOPRAVA
	for (var i in this.__rendered){

		this.__rendered[i][0] += this.__hop;

        if((elm = document.getElementById(this._pathName+'/time/'+i))){
			elm.style.left = this.__rendered[i][0] + 'px';
            elm = null;
        }

        if((elm = document.getElementById(this._pathName+'/body/'+i))){
			elm.style.left = this.__rendered[i][0] + 'px';
            elm = null;
        }
	    else
			delete this.__rendered[i];
	}

	//POSUNOUT BASE DOLEVA
	this.__base_date -= this.__hop/1440;

	//POSUNOUT SCROLLBAR
	this._body.scrollLeft += this.__hop;

	//NASTAVIT SELECTION
	this._value(this.__value,1);
};

_me._scrollNext = function(e){
	//SMAZAT POSLEDNI DNY ZLEVA
	var base = this.__base_date - (((this.__range/1440)-1)/2);

	var elm;
	for (var i = (this.__hop/1440)-1;i>=0;i--){
		if (typeof this.__rendered[base+i] != 'undefined'){
            if ((elm = document.getElementById(this._pathName+'/body/'+(base+i)))){
			    elm.parentNode.removeChild(elm);
                elm = null;
            }
            if ((elm = document.getElementById(this._pathName+'/time/'+(base+i)))){
			    elm.parentNode.removeChild(elm);
                elm = null;
            }

            delete this.__rendered[base+i];
		}
	}

	//POSUNOUT ZBYTEK DOLEVA
	for (var i in this.__rendered){
		this.__rendered[i][0] -= this.__hop;

        if((elm = document.getElementById(this._pathName+'/time/'+i))){
			elm.style.left = this.__rendered[i][0] + 'px';
            elm = null;
        }

        if((elm = document.getElementById(this._pathName+'/body/'+i))){
			elm.style.left = this.__rendered[i][0] + 'px';
            elm = null;
        }
	    else
			delete this.__rendered[i];
	}

	//POSUNOUT BASE DOLEVA
	this.__base_date += this.__hop/1440;

	//POSUNOUT SCROLLBAR
	this._body.scrollLeft -= this.__hop;

	//NASTAVIT SELECTION
	this._value(this.__value,1);
};





///////////////////////////
////////// QUERY //////////
///////////////////////////
_me._update = function(){
	var view = this._currentView();
	this.__data = {};
	this.__query(view[0],view[1],true);
};

_me.__query = function(iStart, iEnd, bClean){

	//CHECK CURRENT DATA
	var bHas = false;
	for(var i = iStart;i<=iEnd;i++)
	    if (this.__data[i]){

			if (i == iStart && iStart<iEnd)
				iStart++;
			else
			if (i == iEnd && iEnd>iStart)
			    iEnd--;
			else
				bHas = true;
		}
		else{
			bHas = false;
			break;
		}

	if (bHas) return;

	//REQUEST DATA
    var aData = {users:[]};
	for (var i in this._list.__users)
		if (this._list.__users[i].action != 'remove')
        	aData.users.push(this._list.__users[i].email || this._list.__users[i].name);

	if (aData.users.length){
		aData.from = iStart;
		aData.to = iEnd;
		aData.evnid = this.__evnid.iid;
		aData.tzid = this.__tzid;
		aData.owner = this.__owner;
		this._freeBusy.get(aData,'null','',[this,'_response',[bClean,iStart,iEnd]]);
	}
};

_me._response = function(aData,bClean,iStart,iEnd){
	try{
		//marge data
		for(var i in aData)
			this.__data[i] = aData[i];

		if (bClean)
			for(var day in this.__rendered)
				if (day<iStart || day>iEnd)
					this._removeDay(day);

		for(var i = iStart;i<=iEnd;i++)
			this._addEvents(i);
	}
	catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}
};


_me._addEvents = function(day){

	//vytvor nebo prepis day
	if (typeof this.__rendered[day] == 'undefined' || this.__rendered[day][1])
		this._addDay(day);
	//zapis eventy do dnu
	else{
		if (!this.__data[day]) return;

	    //render events
	    var sum = [], str, email, pos = 0,
			eDay = document.getElementById(this._pathName+'/body/'+day);
			//eDay.innerHTML = '';

	    for(var i in this._list.__users){

			if (this._list.__users[i].action == 'remove')
				continue;

            email = this._list.__users[i].email;

			//vykreslit eventy
			if (this.__data[day][email]){

				//sesortit
				this.__data[day][email].sort(function(a,b){
					if (a.TYPE == b.TYPE)
					    return 0;
					else
					return a.TYPE > b.TYPE?-1:1;
				});

				for(var j in this.__data[day][email]){
					eDay.appendChild(mkElement('div',{
						className:'evn '+this.__data[day][email][j].TYPE,
						style:{top:pos+'px',left:this.__data[day][email][j].STARTTIME+'px',width:(this.__data[day][email][j].ENDTIME-this.__data[day][email][j].STARTTIME)+'px'},
						innerHTML:(this.__data[day][email][j].SUMMARY || '').escapeHTML(),
						title:(this.__data[day][email][j].SUMMARY || '').escapeHTML()
						}));

				    sum.push({STARTTIME:this.__data[day][email][j].STARTTIME,ENDTIME:this.__data[day][email][j].ENDTIME});
				}
			}
			pos +=25;
		}

		//create summary line
		function sorter(a,b){
		    return a.STARTTIME-b.STARTTIME;
		};
		sum.sort(sorter);
		for(var i = 1;i<sum.length;i++){
			if ((sum[i-1].ENDTIME) >= (sum[i].STARTTIME)){
				if (sum[i-1].ENDTIME<sum[i].ENDTIME)
				    sum[i-1].ENDTIME=sum[i].ENDTIME;
				sum.splice(i,1);
				i--;
			}
		}

		str = '';
		for(var i = 0;i<sum.length;i++)
			str += '<div class="busy" style="left: '+ sum[i].STARTTIME +'px;width:'+(sum[i].ENDTIME-sum[i].STARTTIME)+'px"></div>';

		if (str){
			document.getElementById(this._pathName+'/time/'+day).innerHTML += str;
			this.__rendered[day][1] = true;
		}
		else
			this.__rendered[day][1] = false;
	}
};

_me._currentView = function(){
	var scpos = this._body.scrollLeft;
	var pozice = Math.floor((scpos-this.__base_position)/1440);
	var zobrazeno = Math.ceil(this._body.clientWidth/1440)+Math.floor(((scpos%1440)+this._body.clientWidth)/1440);

	var istart = this.__base_date + pozice;
	var iend = istart + zobrazeno - 1;

	//5.5.2011 15:19:01, extended +-7 days
	return [istart-7,iend+7];
};


_me._addDay = function(day){

	//POKUD JIZ EXISTUJE, TAK SMAZAT
	if (typeof this.__rendered[day] != 'undefined' && this.__rendered[day][1])
		this._removeDay(day);

	var x = this.__base_position + ((day - this.__base_date)*1440);

	if (x >= this._container.clientWidth)
		return;

	this.__rendered[day] = [x];

	var d = IcewarpDate.julian(day);

	this._time.innerHTML +=	'<div class="time" id="'+this._pathName+'/time/'+day+'" style="left:'+x+'px">'+
							'<div class="text" unselectable="on">'+ d.format('dddd MMM DD YYYY hh:mm:ss ZZ') +'</div>'+
							(this.__workstart?'<div class="free" style="left: 2px;width: '+this.__workstart+'px"></div>':'')+
							(this.__workend || this.__workend<1440?'<div class="free" style="left: '+this.__workend+'px; width: '+(1440-this.__workend)+'px"></div>':'')+
							'</div>';

	this._container.innerHTML +='<div class="day" id="'+this._pathName+'/body/'+day+'" style="left:'+x+'px">'+
								(this.__workstart?'<div class="free" style="left: 0;width: '+this.__workstart+'px"></div>':'')+
								(this.__workend || this.__workend<1440?'<div class="free" style="left: '+this.__workend+'px; width: '+(1440-this.__workend)+'px"></div>':'')+
								'</div>';

	this._addEvents(day);
};

_me._removeDay = function(day){
	delete this.__rendered[day];
    var elm;
	if((elm = document.getElementById(this._pathName+'/time/'+day)))
        elm.parentNode.removeChild(elm);

	if((elm = document.getElementById(this._pathName+'/body/'+day)))
		elm.parentNode.removeChild(elm);

	elm = null;
};


_me._value = function(aValue,bNoScroll,bForce){

	if (aValue){

		if (Is.Undefined(aValue.STARTDATE) || Is.Undefined(aValue.STARTTIME) || Is.Undefined(aValue.ENDDATE) || Is.Undefined(aValue.ENDTIME))
		    return;

		if (!bNoScroll)
			this._setDate(aValue.STARTDATE,aValue.STARTTIME);

		var a = this.__base_date - (this.__base_position/1440);
		var b = a + (this.__range/1440);

		var str = '<div class="fill"></div>',left,width;

		if (aValue.STARTDATE>a && aValue.STARTDATE<b){
            str += '<div class="LSide"></div>';
            left = (aValue.STARTDATE - a)*1440 + (aValue.STARTTIME || 0);
        }
		else
		    left = 0;

		if (aValue.ENDDATE>a && aValue.ENDDATE<b){
            str += '<div class="RSide"></div>';
            width = (aValue.ENDDATE - a)*1440 + (aValue.ENDTIME || 0) - left;
		}
		else
			width = this.__range - left;

		var div = document.getElementById(this._pathName+'/selection');

		if (!str){
			if (div)
                div.parentNode.removeChild(div);
		}
		else{
			if (!div){
				div = mkElement('div', {id:this._pathName+'/selection','className':'selection'});
				this._container.appendChild(div);
			}

            div.innerHTML = str;
			div.style.left = left + 'px';
			div.style.width = width + 'px';
		}

		this.__value = aValue;
		div = null;
	}
	else
		return this.__value;
};

_me._setDate = function(iDate,iTime){
	this.__base_position = 10080;
	this.__base_date = iDate;

	this._body.scrollLeft = this.__base_position + (iTime || 0);
	this._update();
};










/**
 * Button handlers
 **/
_me.__onEdit = function(aValues, iid){
	var out ={name:aValues.CNTCONTACTNAME,email:aValues.CNTEMAIL,role:aValues.CNTROLE,status:aValues.CNTSTATUS};
	this._list._editUser(out, iid);
};

_me.__onAddNew = function(aValues){
	var out = {};
		out.name = aValues.CNTCONTACTNAME;
		out.email = aValues.CNTEMAIL;
		out.role = aValues.CNTROLE;

		if (aValues.CNTSTATUS!='P')
			out.status = aValues.CNTSTATUS;

	this._list._addUser(out);
};

_me.__onAddNewFromAddressbook = function(bOK, aAddresses,sRole){
    if (bOK && aAddresses[0]){
		var tmp, bUpdate = false;

		for (var i in aAddresses[0]){
			tmp = MailAddress.splitEmailsAndNames(aAddresses[0][i]);

			if (typeof tmp[0] == 'object'){
				tmp[0].role = Is.String(sRole)?sRole:'Q';
				bUpdate = this._list._addUser(tmp[0],true);
			}
		}

		if (bUpdate)
			this._update();
	}
};
