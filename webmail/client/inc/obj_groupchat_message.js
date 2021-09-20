_me = obj_groupchat_message.prototype;
function obj_groupchat_message(){};


_me.__constructor = function() {
	if (this.__aData.EVNURL)
		this._init_addon(this.__aData);
};

_me.__update = function(){

	var aItemsInfo = {aid:this.__aData.aid, fid:this.__aData.fid, iid:this.__aData.iid, values:['EVNNOTE','EVN_CREATED', 'EVN_MODIFIED', 'EVNSHARETYPE','EVNLINKEXTRAS','EVN_METADATA','EVNURL','EVNTHUMBNAILID','EVNTHUMBNAILTIME','EVNPROCESSINGQUEUED', 'EVN_ID']};

	WMItems.list(aItemsInfo,'','','',[function(aData){

		if (aData && (aData = aData[this.__aData.aid]) && (aData = aData[this.__aData.fid]) && (aData = aData[this.__aData.iid])){

			//Body
			if (this.__aData.EVNNOTE != aData.EVNNOTE) {
				if(aData.EVNCLASS === 'I') {
					aData.EVNNOTE = aData.EVNNOTE || ' ';
				}
				this._init_body(aData);
			}

			//Link
			if (aData.EVNURL){
				if (this.__aData.EVNURL != aData.EVNURL){
					this._init_addon(aData);
				}
				else
				if (this.__aData.EVNTHUMBNAILTIME != aData.EVNTHUMBNAILTIME)
				{
					this.__destructor();

					if (aData.EVNPROCESSINGQUEUED == '0'){
						if (this._preview_image){
							if (aData.EVNTHUMBNAILTICKET)
								this._preview_image(aData.EVNTHUMBNAILTICKET, this.__dimensions(aData.EVNSIZEINFO));
							else
							if (aData.EVNTHUMBNAILID){
								var src = 'server/download.php?' + buildURL({'sid':dataSet.get('main',['sid']), 'class':'attachment', 'fullpath': [this.__aData.aid, this.__aData.fid, WMItems.__serverID(this.__aData.iid), aData.EVNTHUMBNAILID].join('/'), 't':aData.EVNTHUMBNAILTIME || 0});
								this._preview_image(src, this.__dimensions(aData.EVNSIZEINFO));
							}
						}
					}
					else
					if (!gui.socket && (!Is.Defined(aData.EVNPROCESSINGQUEUED) || aData.EVNPROCESSINGQUEUED == '1'))
						this.__timeout = setTimeout(function(){
							this.__update();
						}.bind(this), 5000);
				}
			}
			else
			if (hascss(this._main, 'obj_groupchat_link')){
				this.__destructor();
				this._getAnchor('addon').innerHTML = '';
				removecss(this._main, 'obj_groupchat_link');
			}

			//Reactions
			this._init_reactions(aData);
		}

	}.bind(this)]);

};

_me._init_addon = function(aData){

	this.__destructor();

	addcss(this._main, 'obj_groupchat_link');

	if (aData.EVNNOTE == aData.EVNURL)
		addcss(this._main, 'nobody');

	var a = mkElement('A',{href:aData.EVNURL}),
		aTmp = {
			title: aData.EVNTITLE,
			desc: aData.EVNLOCATION,
			url: a.hostname
		};

	//Update data
	if (aData.EVN_METADATA){
		this.__aData.EVN_METADATA = aData.EVN_METADATA = parseURL(aData.EVN_METADATA);
		if (aData.EVN_METADATA.core_linkinfo)
			this.__aData.CORE_LINKINFO = aData.CORE_LINKINFO = parseURL(aData.EVN_METADATA.core_linkinfo);
	}
	this.__aData.EVNURL = aData.EVNURL;
	this.__aData.EVNTHUMBNAILID = aData.EVNTHUMBNAILID;
	this.__aData.EVNTHUMBNAILTIME = aData.EVNTHUMBNAILTIME;
	this.__aData.EVNPROCESSINGQUEUED = aData.EVNPROCESSINGQUEUED;

	//Preview image
	if (!aData.EVNTHUMBNAILID)
		aTmp.preview = 'ico';

	//switch between modes
	if (aData.CORE_LINKINFO && aData.CORE_LINKINFO['type'] == 2 && aData.CORE_LINKINFO.videourl && !this.__options.novideo){ // && aData.CORE_LINKINFO.videotype == 'text/html'

		this._draw('obj_groupchat_link_video', 'addon', aTmp);

		this._getAnchor('preview').onclick = function(e){

			//re-parse url
			var url = mkElement('A',{href:aData.CORE_LINKINFO.videourl}),
				search = parseURL(url.search);
			search.autoplay = 1;

			// YOUTUBE https://developers.google.com/youtube/player_parameters
			search.showinfo = 0;
			search.modestbranding = 1;

			// search.enablejsapi = 1;
			// search.origin = document.location.origin;

			// VIMEO https://developer.vimeo.com/player/js-api
			// search.api = 1;

			var attr = {
				src: url.protocol + '//' + url.hostname + '/' + url.pathname + '?' + buildURL(search) + url.hash,
				width: 500,height: 281,
				frameborder: 0, scrolling: 'no'
			};

			// if (currentBrowser() != 'Chrome'){
			// 	attr.webkitallowfullscreen = 'webkitallowfullscreen';
			// 	attr.mozallowfullscreen = 'mozallowfullscreen';
			// 	attr.allowfullscreen = 'allowfullscreen';
			// }

			this.parentNode.replaceChild(mkElement('iframe', attr), this);

			e.cancelBubble=true;
			if (e.stopPropagation)
				e.stopPropagation();
			return false;
		};
	}
	else{

		this._draw('obj_groupchat_link', 'addon', aTmp);

		this._getAnchor('preview').onclick = function(e){
			window.open(aData.EVNURL);

			e.cancelBubble=true;
			if (e.stopPropagation)
				e.stopPropagation();
			return false;
		};
	}

	//Controls
	var tmp = this._getAnchor('title');
	if (tmp)
		tmp.onclick = function(e){
			window.open(aData.EVNURL);

			e.cancelBubble=true;
			if (e.stopPropagation)
				e.stopPropagation();
			return false;
		};

	//Preview Image
	if (aData.EVNTHUMBNAILTICKET){
		this._preview_image(aData.EVNTHUMBNAILTICKET, aData.EVNSIZEINFO);
	}
	else
	if (aData.EVNTHUMBNAILID){
		var src = 'server/download.php?' + buildURL({'sid':dataSet.get('main',['sid']), 'class':'attachment', 'fullpath': [aData.aid, aData.fid, WMItems.__serverID(aData.iid), aData.EVNTHUMBNAILID].join('/'), 't':aData.EVNTHUMBNAILTIME || 0});
		this._preview_image(src, aData.EVNSIZEINFO);
	}
	else
	if (!gui.socket && (!Is.Defined(aData.EVNPROCESSINGQUEUED) || aData.EVNPROCESSINGQUEUED == '1')){

		this.__timeout = setTimeout(function(){
			this.__update();
		}.bind(this), 5000);

		this._add_destructor('__destructor');
	}
};

_me.__dimensions = function(sDim){
	var dim;

	if (sDim){
		var tmp = parseURL(sDim);

		if (tmp.tw>0){
			dim = {w:tmp.tw, h:tmp.th};
		}
		else
		if (tmp.ow>0){
			if (tmp.o>4)
				dim = {w:tmp.oh, h:tmp.ow};
			else
				dim = {w:tmp.ow, h:tmp.oh};
		}
	}

	return dim;
};

_me._preview_image = function(src, aSizeInfo){

	if (!this._destructed && src && this._getAnchor('preview')){

		var bVid = this.__aData.CORE_LINKINFO && this.__aData.CORE_LINKINFO['type'] == 2 && this.__aData.CORE_LINKINFO.videourl && !this.__options.novideo,
			w = bVid?500:150,
			h = bVid?281:600;

		src += '&'+ buildURL({'resize':1, 'width':w, 'height':h});

		if (aSizeInfo){
			var aDim = this.__dimensions(aSizeInfo);
			if (aDim){

				var bScroll = false;
				if (this.__list && this.__list.__body){
					var pos1 = getSize(this.__list.__body),
						pos2 = getSize(this._main),
						bScroll = (pos1.y + pos1.h > pos2.y + pos2.h),
						mh = this._main.offsetHeight;
				}

				if (bVid){
					this._getAnchor('preview').style.height = h + 'px';
					this._getAnchor('preview').style.width = w + 'px';
					//this._getAnchor('preview').style.height = Math.round(aDim.h/(aDim.w/w)) + 'px';
				}
				else
					this._getAnchor('preview').firstElementChild.style.height = Math.round(aDim.h/(aDim.w/w)) + 'px';

				if (bScroll)
					this.__list._scrollBy(Math.abs(this._main.offsetHeight - mh));
			}
		}

		var img = new Image();
		img.onload = function(){
			try{
				if (!this._destructed){

					//Video
					if (bVid){
						this._getAnchor('preview').style.backgroundImage = 'url("'+ img.src +'")';
					}
					//Link
					else{

						//get scroll
						var ePrev = this._getAnchor('preview'),
							bScroll = false,
							bSafari = false,
							h = this._main.offsetHeight;

						if (this.__list && this.__list._scroll){
							var pos1 = getSize(this.__list.__body),
								pos2 = getSize(this._main);

							if ((bScroll = (pos1.y + pos1.h >= pos2.y + pos2.h)))
								bSafari = window.navigator && window.navigator.browser && window.navigator.browser.application && window.navigator.browser.application.toLowerCase() == 'safari';
						}

						if (!this.__preview){
							this.__preview = mkElement('img');
							ePrev.firstElementChild.appendChild(this.__preview);
						}

						removecss(ePrev, 'ico', 'ico');

						if (img.naturalHeight && img.naturalWidth){
							this.__preview.style.maxHeight = img.naturalHeight + 'px';
							this.__preview.style.maxWidth = img.naturalWidth + 'px';
						}

						if (bScroll && bSafari){
							this.__preview.onload = function(){
								try{
									if (!this._destructed){
										ePrev.firstElementChild.style.height = 'auto';

										if (this._main.offsetHeight - h != 0)
											this.__list._scrollBy(Math.abs(this._main.offsetHeight - h));
									}
								}
								catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}
							}.bind(this);
						}

						this.__preview.src = img.src;

						if (!bSafari){
							ePrev.firstElementChild.style.height = 'auto';
							if (bScroll && this._main.offsetHeight - h != 0)
								this.__list._scrollBy(Math.abs(this._main.offsetHeight - h));
						}
					}

				}
			}
			catch(r){
				gui._REQUEST_VARS.debug && console.log(this._name||false,r);
			}
		}.bind(this);

		img.src = src;
	}

};

_me.__destructor = function(){
	if (this.__timeout){
		window.clearTimeout(this.__timeout);
		delete this.__timeout;
	}
};
