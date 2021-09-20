_me = frm_main_home.prototype;
function frm_main_home(){};

_me.__constructor = function(){
	//Reset Title
	gui.frm_main._title();

	this._create('scrollbar','obj_scrollbar')._scrollbar(this._main);

	var aAccount = dataSet.get('accounts',[sPrimaryAccount]);

	if (sPrimaryAccountGUEST)
		this._draw('frm_main_home', 'main');
	else{
		this._draw('frm_main_home', 'main', {
			enable_quota: (aAccount.MBOX_QUOTA?true:false),
			enable_smsquota: (aAccount.SMS_LIMIT>0?true:false),
			enable_banner: GWOthers.getItem('HOMEPAGE_SETTINGS', 'banner')>0,
			enable_application: GWOthers.getItem('HOMEPAGE_SETTINGS', 'application')>0 && (GWOthers.getItem('RESTRICTIONS', 'disable_licenses') || 0)<1
		});

		//Disk & SMS Quota
		if (aAccount.MBOX_QUOTA || aAccount.SMS_LIMIT>0)
			WMAccounts.list({aid:sPrimaryAccount},'','','',[this,'__quotaupdate']);

		//Banner
		if (GWOthers.getItem('HOMEPAGE_SETTINGS', 'banner')>0){
			var eBanner = this._getAnchor('banner');
			if (eBanner){
				eBanner.style.height = (GWOthers.getItem('HOMEPAGE_SETTINGS', 'banner_height') || 60) + 'px';
				var eFrame = this._create("frame","obj_frame","banner");
					eFrame._sandbox(['allow-forms',	'allow-pointer-lock', 'allow-popups', 'allow-scripts', 'allow-same-origin']);
					eFrame._src(GWOthers.getItem('HOMEPAGE_SETTINGS', 'banner_url') || ('client/skins/'+GWOthers.getItem('LAYOUT_SETTINGS', 'skin')+'/banner.html'));
			}
		}

		//License
		var eLicense = this._getAnchor('license');
		if (eLicense)
			eLicense.onclick = function(e){
				gui._create('license', 'frm_help', void 0, void 0, 'license');
				return false;
			};
	}

	//Info
	this.x_last_ip._value(aAccount['LAST_IP']);
	this.x_current_ip._value(aAccount['CURRENT_IP']);
	if (aAccount['LAST_TIME']){
		this.x_last_time._value(new IcewarpDate(aAccount['LAST_TIME']*1000).format('L LT'));
	}
	if (aAccount['CURRENT_TIME']){
		this.x_current_time._value(new IcewarpDate(aAccount['CURRENT_TIME']*1000).format('L LT'));
	}
};

_me.__quotaupdate = function(aAccount){
	if (aAccount && (aAccount = aAccount[sPrimaryAccount])){

    	if (aAccount.MBOX_QUOTA && this.quota){
			this.x_quota._value(roundTo(aAccount.MBOX_USAGE / 1024, 1) + ' ' + getLang('UNITS::MB') + ' / ' + roundTo(aAccount.MBOX_QUOTA / 1024, 1) + ' ' + getLang('UNITS::MB'));
			this.quota._range(aAccount.MBOX_QUOTA);
			this.quota._value(aAccount.MBOX_USAGE || 0);
			this.quota._title(roundTo(aAccount.MBOX_USAGE / aAccount.MBOX_QUOTA * 100, 1) + '% (' + roundTo(aAccount.MBOX_USAGE / 1024, 1) +' '+ getLang('UNITS::MB') +' / ' + roundTo(aAccount.MBOX_QUOTA / 1024, 1) + ' ' + getLang('UNITS::MB') + ')');
		}

		if (aAccount.SMS_LIMIT && this.smsquota){
			this.x_smsquota._value(aAccount.SMS_SENT +' / ' + aAccount.SMS_LIMIT + ' SMS');

			this.smsquota._range(aAccount.SMS_LIMIT);
			this.smsquota._value(aAccount.SMS_SENT || 0);
			this.smsquota._title(Math.ceil(aAccount.SMS_SENT/(aAccount.SMS_LIMIT/100)) + '% (' + aAccount.SMS_SENT +' / ' + aAccount.SMS_LIMIT + ')');
		}
    }
};
