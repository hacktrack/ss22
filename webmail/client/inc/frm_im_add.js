_me = frm_im_add.prototype;
function frm_im_add(){};

/**
 * @brief
 *
 * @see  IM/new group
 */
_me.__constructor = function(xmpp, sGroup, sJID, sName, sTab) {

	this._size(490,400,true);
	this._resizable(false);

	this._title('FORM_BUTTONS::ADD');

	this._draw('frm_im_add','main');

	this.__gateways = [];

    //Load Gateways
	if (xmpp){
		//Remove Prefix if any
		if (sJID && sJID.toLowerCase().indexOf('xmpp:') == 0)
			sJID = sJID.substr(5);

       	this.__xmpp = xmpp;
		this.__xmpp._gateway_list(dataSet.get('main',['domain']),[this,'_refresh',[sGroup, sJID, sName, sTab]]);
	}
	else
	    this._destruct();
};

_me.__constructor2 = function(sGroup, sJID, sName,sTab) {

	var me = this;

	this.maintab.user._onactive = function (bFirstTime){

		if (GWOthers.getItem('RESTRICTIONS','DISABLE_IM_CONTACT_MANAGEMENT')==1){

			this.gateway._disabled(true);
			this.jid._disabled(true);
			this.nick._disabled(true);
			this.group._disabled(true);

			me.x_btn_ok._disabled(true);
		}
		else{

			if (bFirstTime){
				if (sJID)
					this.jid._value(sJID);

				if (sName)
					this.nick._value(sName);

				var	aGroups = {'*':getLang('IM::OTHER')},
					aRoster = dataSet.get('xmpp', ['roster']);

				if (aRoster)
					for(var i in aRoster)
						if (aRoster[i].group && !aGroups[aRoster[i].group])
							aGroups[aRoster[i].group] = aRoster[i].group;

				this.group._fill(aGroups);
				this.group._value(sGroup || '*');

				var aGW = {'*':getLang('SETTINGS::DEFAULT')};
				for(var i in me.__gateways)
					if (me.__gateways[i].check)
						aGW[me.__gateways[i].id] = me.__gateways[i].data.name + ' ('+me.__gateways[i].data.jid+')';

				this.gateway._fill(aGW);
				this.gateway._value('*');
				this.gateway._onchange = function(){
					if (aGW[this._parent.group._value()])
						this._parent.group._value(this._value());
				};

				this.group._onsubmit = this.nick._onsubmit = this.jid._onsubmit = function (){me.x_btn_ok._onclick();}
				this.group._onclose = this.nick._onclose = this.jid._onclose = function (){me.x_btn_cancel._onclick();}
			}

			me.x_btn_ok._onclick = function(){
				var jid = me.maintab.user.jid._value();
				if (jid){
					if (me.maintab.user.gateway._value() != '*')
						jid = jid.replace('@','%')+'@'+me.maintab.user.gateway._value();

					executeCallbackFunction([me.__xmpp,'_user_add'],jid,me.maintab.user.nick._value(),me.maintab.user.group._value());
					me._destruct();
				}
			};
		}

		me.x_btn_ok._value('FORM_BUTTONS::OK');
	};

	this.maintab.gateway._onactive = function (bFirstTime){
		if (bFirstTime){
			this.grid.__sortColumn = 'name';
			this.grid._addColumns({
                'check':{width:20,arg:{sort:'asc'},'css':'ico check',"type":'static',"text":'&nbsp;'},
                'ico':{width:20,'css':'ico gw',"type":'static',"text":'&nbsp;'},
				'name':{title:"DATAGRID_ITEMS_VIEW::NAME",width:50,mode:'%',arg:{sort:'asc'}},
				'jid':{title:"IM::JABBER_ID",width:50,mode:'%',arg:{sort:'asc'}},
				'type':{title:"DATAGRID_ITEMS_VIEW::TYPE",width:80,arg:{sort:'asc'}}
			});

			this.grid._onclick = function(e,elm,arg,id,col){

				var gwid;
				if (col == 'check' && this._aData[id] && (gwid = this._aData[id].id)){
					for(var i in me.__gateways)
						if (me.__gateways[i].id == gwid){
							if (me.__gateways[i].check){
								if (me.__gateways[i].data && me.__gateways[i].data.jid){
									Cookie.set(['im','queue',me.__gateways[i].data.jid]);
									me.__xmpp._user_remove([me.__gateways[i].data.jid]);
								}
							}
							else
								this._ondblclick();

							break;
						}
				}
			};

			this.grid._ondblclick = function(){
				me.x_btn_ok._onclick();
			};

	        this.add._disabled(true);
			this.add._onclick = function(){
				var v = this._parent.gateway._value();
				if (v){
					gui._create('addgtw','frm_im_addgtw','','',me.__xmpp,v,sGroup);
                    this._parent.gateway._value('');
				}
			};
            this.gateway._onkeyup = function(){
               	this._parent.add._disabled(this._value()?false:true);
			};
			this.gateway._onsubmit = function(){
				this._parent.add._onclick();
			};

			this.grid._serverSort(me.__gateways);
		}

		me.x_btn_ok._value('IM::REGISTR');
		me.x_btn_ok._onclick = function (){
			var v = me.maintab.gateway.grid._value();
			if (v && v[0] && me.maintab.gateway.grid._aData[v[0]])
				gui._create('addgtw','frm_im_addgtw','','',me.__xmpp,me.maintab.gateway.grid._aData[v[0]].id,sGroup);
		};
		me.x_btn_ok._disabled(false);
	};

	if (sTab == 'gateway')
        this.maintab._value('gateway');
	else
		this.maintab.user._onactive(true);
};

_me._refresh = function(aResponse, sGroup, sJID, sName, sTab){

/*
 [QUERY]
.. [0]
.... [ITEM]
...... [0]
........ [ATTRIBUTES]
.......... [JID](string) = 007guard.com
.......... [CATEGORY](string) = gateway
.......... [TYPE](string) = icq
.......... [NAME](string) = 007guard.com
.... [ATTRIBUTES]
...... [XMLNS](string) = http://jabber.org/protocol/disco#items
 [ATTRIBUTES]
.. [TYPE](string) = result
.. [ID](string) = 7806114882435644001244646523706
.. [FROM](string) = merakdemo.com
.. [TO](string) = admin@merakdemo.com/Webmail
*/

	if (Is.Empty(aResponse))
		this.__constructor2(sGroup, sJID, sName, sTab);
	else{
		var aData = [];

		for (var i in aResponse)
			if (aResponse[i].CATEGORY == 'gateway')
				aData.push({
					id:aResponse[i].JID,
					data:{
						'name':aResponse[i].NAME,
						'jid':aResponse[i].JID,
						'type':aResponse[i].TYPE || ''
					}
				});

		this.__gateways = aData;

		this.__constructor2(sGroup, sJID, sName, sTab);

		this._listen('xmpp', ['roster']);
	}
};

_me.__update = function(sName, aDPath){

	var aGW = {'*':getLang('SETTINGS::DEFAULT')};

	if (this.__gateways.length){
		var aRoster = dataSet.get('xmpp', ['roster']);
		if (aRoster){
			this.__gateways.map(function(g){
				g.css = 'ico_' + g.data.type.replace(' ','-');

				if (aRoster[g.id]){
					g.css += ' check';
					aGW[g.id] = g.data.name + ' ('+ g.data.jid+')';
				}
				return g;
			});
		}
	}

	if (this.maintab.gateway && this.maintab.gateway.grid)
		this.maintab.gateway.grid._serverSort(this.__gateways);

	if (this.maintab.user && this.maintab.user.gateway){
		this.maintab.user.gateway._fill(aGW);

		if (!aGW[this.maintab.user.gateway._value()])
			this.maintab.user.gateway._value('*');
	}
};