function obj_urlpreview(){};
_me = obj_urlpreview.prototype;
function obj_urlpreview(){};

_me.__constructor = function(aData){

	this.__aData = aData;

	//Images
	this.__imgID = 0;
	this.__images = [];

	if (aData.IMAGES && aData.IMAGES[0].IMAGE){
		for (var id in aData.IMAGES[0].IMAGE)
			if (aData.IMAGES[0].IMAGE[id].PROXYID)
				this.__images.push(document.location.origin + '/.well-known/icewarp-imageproxy/' + aData.IMAGES[0].IMAGE[id].PROXYID[0].VALUE);
			else
			if (aData.IMAGES[0].IMAGE[id].URL)
				this.__images.push(aData.IMAGES[0].IMAGE[id].URL[0].VALUE);
	}

	//base template
	var a = mkElement('A',{href:aData.URL?aData.URL[0].VALUE:''}),
		aOut = {
			title: aData.TITLE[0].VALUE || '',
			desc: aData.DESC[0].VALUE || '',
			url: a.hostname,
			buttons: this.__images.length>1
		};

	this._draw('obj_urlpreview','main', aOut);

	this._getAnchor('close').onclick = function(){

		if (this._onclose)
			this._onclose();

		this._destruct();
	}.bind(this);

	//image
	if (this.__images.length){
		this._getAnchor('image').appendChild(mkElement('img'));
		addcss(this._main, 'images');

		this.__image();

		if (this.__images.length>1){
			this._getAnchor('prev').onclick = function(){
				this.__image(this.__imgID - 1);
			}.bind(this);

			this._getAnchor('next').onclick = function(){
				this.__image(this.__imgID + 1);
			}.bind(this);
		}
	}
};

_me.__image = function(id){

	if (id<0)
		id = this.__images.length-1;
	else
	if (!this.__images[id])
		id = 0;

	this._getAnchor('image').querySelector('img').src = this.__images[id];

	if (this.__images.length>1)
		this._getAnchor('tbn').innerHTML = getLang('CHAT::THUMBNAIL_COUNT', [id+1, this.__images.length]);

	this.__imgID = id;
};

_me._value = function(){
	if (this.__aData)
		try{
			var out = {url:this.__aData.URL[0].VALUE};

			if (this.__aData.TITLE)
				out.title = this.__aData.TITLE[0].VALUE || '';
			if (this.__aData.DESC)
				out.desc = this.__aData.DESC[0].VALUE || '';
			if (this.__aData.IMAGES && this.__aData.IMAGES[0].IMAGE && this.__aData.IMAGES[0].IMAGE[this.__imgID] && this.__aData.IMAGES[0].IMAGE[this.__imgID].PROXYID)
				out.thumbnailimageid = this.__aData.IMAGES[0].IMAGE[this.__imgID].PROXYID[0].VALUE;

			if (this.__aData.TYPE)
				out.type = this.__aData.TYPE[0].VALUE;
			if (this.__aData.VIDEOURL)
				out.videourl = this.__aData.VIDEOURL[0].VALUE;
			if (this.__aData.VIDEOTYPE)
				out.videotype = this.__aData.VIDEOTYPE[0].VALUE;
		}
		catch(r){
			console.log('Error', 'obj_urlpreview', r);
		}

	return out;
};