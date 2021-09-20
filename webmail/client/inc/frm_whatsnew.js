_me = frm_whatsnew.prototype;
function frm_whatsnew(){};

/*
	<customize template="customize">
		<title>Customize Layout</title>
		<li_1_h>Resize slider</li_1_h>
		<li_1>We have reduced the spacing between items in the left panel allowing you to see more conversations per page. You can easily adjust this setting by using the resize slider in the menu bar on top of the page.</li_1>
	</customize>
*/

_me.__constructor = function(){
	storage.library('gw_others');

	var me = this;
	this.__lastTab = '';

	this._size(620,715,true);
	this._modal(true);
	this._dockable(false);
	this._resizable(false);

	this._create('loader','obj_loader');

	this._draw('frm_whatsnew','main');

	this.__checkPosition();

	this._create('btn_next','obj_button','footer','color1 simple');
	this.btn_next._value('COMMON::NEXT');
	this.btn_next._onclick = function(){
		var tabs = this._parent.maintab;
		if (tabs._value() == me.__lastTab)
			this._parent._close();
		else
			tabs._next();
	};

	function mkVideo(name) {
		var HiDPI = window.devicePixelRatio > 1;
		var play = mkElement('div', {
			className: 'play',
			textContent: getLang('WHATSNEW::PLAY')
		});
		var video = mkElement('video', {
			loop: false,
			controls: false,
			autoplay: true,
			playbackRate: 0.8
		}, false, [
			mkElement('source', {
				src: 'client/skins/default/videos/whatsnew_' + name + (HiDPI ? '-2x' : '-1x') + '.mp4',
				type: 'video/mp4'
			})
		]);
		video.addEventListener('ended', function() {
			play.classList.remove('hidden');
			play.textContent = getLang('WHATSNEW::REPLAY');
		});
		video.addEventListener('play', function() {
			play.classList.add('hidden');
		});
		play.addEventListener('click', function() {
			video.currentTime = 0;
			video.play();
			play.classList.add('hidden');
		});
		return mkElement('div', {
			className: 'video_container'
		}, false, [ video, play ]);
	}

	this.__video = {
		'COLLABORATION': mkVideo('collaboration'),
		'SEARCH': mkVideo('search')
	};

	this.__opt = {};
	if (sPrimaryAccountGUEST){
		this.__opt.show = ['all', 'guest'];
	}

	var sURL = 'client/languages/'+ GWOthers.getItem('LAYOUT_SETTINGS','language') +'/whatsnew.xml';

	request.get(sURL, [function(aXML){

		aXML = aXML.Array.XML[0];

		for(var i in aXML){

			//Filter Tabs
			if (me.__opt.show && (aXML[i][0].ATTRIBUTES || {}).SHOW && inArray(me.__opt.show, aXML[i][0].ATTRIBUTES.SHOW || '')<0)
				continue;

			if (aXML[i][0].TITLE){

				if (me._tabCreationHandler(i) === false)
					continue;

				me.__lastTab = i;

				//Create TAB
				var tab = me.maintab._create(i, 'obj_tab', '', 'nopadding ' + ((aXML[i][0].ATTRIBUTES || {}).CSS || ''));
					tab._value(aXML[i][0].TITLE[0].VALUE, true);

				//Fill TAB
				tab._onactive = function (bFirstTime) {
					if (bFirstTime){
						var x = aXML[this._name][0];

						if (x.URL){
							this._create("frame", "obj_frame", "main");;
							this.frame._src(x.URL);
						}
						else{

							//Parse data
							var aData = {block:{}, data:{}, css:this._name.toLowerCase()},
								tmp;

							for (var n in x){
								if (n !== 'ATTRIBUTES'){
									//Filter blocks
									if (me.__opt.show && (x[n][0].ATTRIBUTES || {}).SHOW && inArray(me.__opt.show, x[n][0].ATTRIBUTES.SHOW || '')<0)
										continue;

									if (n.indexOf('LI_') === 0){
										tmp = n.split('_');

										aData.block[tmp[1]] = aData.block[tmp[1]] || {css:tmp[0]+'_'+tmp[1]};
										aData.block[tmp[1]][tmp[2]?tmp[2]:'BODY'] = x[n][0].VALUE.replace(/\\n/g, '<br>');
									}
									else
									if (x[n][0].VALUE)
										aData.data[n] = x[n][0].VALUE;
								}
							}

							this._draw(x.ATTRIBUTES && x.ATTRIBUTES.TEMPLATE?'frm_whatsnew_' + x.ATTRIBUTES.TEMPLATE:'frm_whatsnew_body', 'main', aData);

							//Scroll down
							var main = this._getAnchor('main');

							if (main.scrollHeight>main.clientHeight + 20)
								addcss(main, 'show');

							main.appendChild(mkElement('div', {className:'scroller unselectable'}, document, [mkElement('div', {innerHTML:getLang('COMMON::SCROLL_DN')})]));
							main.appendChild(mkElement('div', {className:'mask unselectable'}));

							main.onscroll = function(){
								//Gesign
								if (this.clientHeight + 20 < this.scrollHeight){
									if (this.scrollTop<20){
										addcss(this, 'show');
										return true;
									}
								}

								removecss(this, 'show');
							};

							me._obeyEvent('onresize', [function(){ main.onscroll() }]);
						}
					}

					if (me.__lastTab === this._name){
						me.btn_next._value('WHATSNEW::START');
						removecss(me.btn_next._main, 'ico2');
					}
					else{
						me.btn_next._value('COMMON::NEXT');
						addcss(me.btn_next._main, 'ico2');
					}

					me._tabActivationHandler(this._name, this, bFirstTime);
				};

				tab._onclick = function(e, elm){
					if (hascss(elm, 'link'))
						me._tabClickHandler(this._name, [].slice.apply(elm.classList));
				};
			}
		}

		me.maintab[me.maintab._value()]._onactive(true);

		//One tab only mode
		var tabs = me.maintab._getChildObjects('main','obj_tab');
		if (tabs.length == 1){
			addcss(me.maintab._main, 'notabs');
		}

		me.loader._destruct();

	}],[function(){
		me._destruct();
	}]);

};

_me._onclose = function(){
	window.removeEventListener('message', this._messageHandler);
	var tmp = GWOthers.getItem('LOGIN_SETTINGS', 'version').split('.');
	Cookie.set(['whatsnew'], tmp[0]+'.'+tmp[1]+'.'+tmp[2]);
	return true;
};

_me._tabCreationHandler = function(sTab){
	// switch(sTab){
		
	// }
};

_me._tabActivationHandler = function(sTab, oTab, bFirstTime){
	var video;
	for(var i in this.__video) {
		video = this.__video[i].querySelector('video');
		video.pause();
		try {
			video.currentTime = 0;
		} catch(e) {
			console.log(e);
		}
	}
	switch(sTab){
		case 'COLLABORATION':
		case 'SEARCH':
			if(bFirstTime) {
				oTab._main.querySelector('.block').insertAdjacentElement('afterbegin', this.__video[sTab]);
			}
			try {
				this.__video[sTab].querySelector('video').play();
			} catch(e) {
				// autoplay disabled in browser
			}
		break;
	}
};

_me._tabClickHandler = function(sTab, aProps){
	// switch(sTab){
		
	// }
};
