var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera",
			versionSearch: "Version"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			   string: navigator.userAgent,
			   subString: "iPhone",
			   identity: "iPhone/iPod"
	    },
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};
BrowserDetect.init();

/** */

function isEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
} 

function urlencode (str) {
	str = (str+'').toString()
	return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
}

function rgbToHsl(r, g, b){
	r /= 255, g /= 255, b /= 255;
	var max = Math.max(r, g, b), min = Math.min(r, g, b);
	var h, s, l = (max + min) / 2;
	
	if(max == min){
		h = s = 0; // achromatic
	}else{
		var d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch(max){
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}
	h /= 6;
	}
	
	return [h, s, l];
}
function hslToRgb(h, s, l){
	var r, g, b;
	
	if(s == 0){
		r = g = b = l; // achromatic
	}else{
		function hue2rgb(p, q, t){
			if(t < 0) t += 1;
			if(t > 1) t -= 1;
			if(t < 1/6) return p + (q - p) * 6 * t;
			if(t < 1/2) return q;
			if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
			return p;
		}
		
		var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		var p = 2 * l - q;
		r = hue2rgb(p, q, h + 1/3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1/3);
	}
	
return [r * 255, g * 255, b * 255];
}
function getData(url) {
	if (window.XMLHttpRequest) {AJAX=new XMLHttpRequest();}
	else {AJAX=new ActiveXObject("Microsoft.XMLHTTP");}
	if (AJAX) {
		AJAX.open("GET", url, false);
		AJAX.send(null);
		return AJAX.responseText;
	} else {return false;}
}
function login(sKey,form,b)
{
	if(document.getElementById('inputPassword'))
	{
		var dPwd = document.getElementById('inputPassword');
		var sPwd = dPwd.value;
		
		var time=Math.floor(new Date().getTime()/1000);
		if (document.getElementById('time'))
		{
			var newTime=getData(document.getElementById('baseMorseCode').value+'server/login/shortcuts.php?t&'+time);
			if(newTime){time=newTime;}
			else{time=document.getElementById('time').value;}
		}
		var rPwd=document.getElementById('inputPassword').value='p='+urlencode(document.getElementById('inputPassword').value)+'&t='+time;
		
		//Prepare RSA library
		var rsa = new RSAKey();
		rsa.setPublic(sKey, '10001');
		var password_rsa = document.createElement('input');
		password_rsa.type = 'hidden';
		password_rsa.name = 'password_rsa';
		password_rsa.value = rsa.encrypt(rPwd);
		form.appendChild(password_rsa);
		var pVal='';
		for(var i=0; i<sPwd.length; i++)
		{
			pVal=pVal+'*';
		}
		//this will empty the PWD input. It's because of browser's save password feature
		dPwd.value = '';
		// uncomment this line to replace PWD with stars
		//dPwd.value = pVal;
		
		if (document.getElementById('inputPasswordNew'))
		{
			document.getElementById('inputPasswordNew').value=rsa.encrypt(document.getElementById('inputPasswordNew').value);
		}
		
		if (document.getElementById('inputPasswordCheck'))
		{
			document.getElementById('inputPasswordCheck').value=rsa.encrypt(document.getElementById('inputPasswordCheck').value);
		}
	}
	return true;
}


$(document).ready(function(){
/* select propper interface*/
if(document.getElementById('to') && document.getElementById('ri_js')){document.getElementById('to').value=document.getElementById('ri_js').value;}
/**/
/* focus */
if (document.getElementById('usernameSet')) {if(document.getElementById('inputPassword')){document.getElementById('inputPassword').focus();}}
else if(document.getElementById('inputUsername')){document.getElementById('inputUsername').focus();}
/**/
/** JS control **/
if(document.getElementById('jscontrol')){
	if (!(BrowserDetect.browser=='Explorer' && (BrowserDetect.version=='6.0')))
	{
		document.getElementById('jscontrol').value=1;
	}
}
/**/

/* keep security timestamp updated */
if (document.getElementById('time')){setInterval(function(){document.getElementById('time').value=parseInt(document.getElementById('time').value)+10;},10000);}
/* set client's' timezone */
if(document.getElementById('ctz')){document.getElementById('ctz').value=(new Date().getTimezoneOffset())*(-1);}
/* let user delete it's username from cookies */
if(document.getElementById('usernameDelete'))
{
	document.getElementById('usernameDelete').onclick=function()
	{
		document.getElementById('saveFrame').src=document.getElementById('baseMorseCode').value+"server/login/shortcuts.php?d&"+Math.floor(new Date().getTime()/1000);
		document.getElementById('inputUsername').value="";
		this.style.display="none";
		document.getElementById('inputUsername').focus();
		return false;
	}
}
/**/

/* RSA login */
$('#loginForm').submit(function(){
	if(document.getElementById('inputForgotPassword'))
	{
		$('#inputForgotPassword').removeClass('error');
		if(!isEmail($('#inputForgotPassword').val()))
		{
			$('#inputForgotPassword').addClass('error').select().focus();
			return false;
		}
	}
	login($(this).attr('name'),this);
});
/**/

/* handle language change */
if (document.getElementById('selectLanguage'))
{
	document.getElementById('selectLanguage').onchange=function()
	{
		var lHref=(location.href+'?-').split('?');lHref=lHref[0];
		var add='';
		if(document.getElementById('autoLoginCheckbox') && document.getElementById('autoLoginCheckbox').checked) {add=add+'autoLogin=1&';}
		if (document.getElementById('selectLanguage')){add=add+'language='+encodeURIComponent(document.getElementById('selectLanguage').value)+'&';}
		if(document.getElementById('to')){add=add+'interface='+encodeURIComponent(document.getElementById('to').value)+'&';}
		if(document.getElementById('inputUsername')){add=add+'username='+encodeURIComponent(document.getElementById('inputUsername').value);}
		location.href=lHref+'?'+add;
	}
}
/**/

/* PLACEHOLDER */
if(!Modernizr.input.placeholder){
	$('[placeholder]').focus(function() {
		var input = $(this);
		if (input.val() == input.attr('placeholder')) {
			input.val('');
			input.removeClass('placeholder');
		}
	}).blur(function() {
		var input = $(this);
		if (input.val() == '' || input.val() == input.attr('placeholder')) {
			input.addClass('placeholder');
			input.val(input.attr('placeholder'));
		}
	}).blur();
	$('[placeholder]').parents('form').submit(function() {
		$(this).find('[placeholder]').each(function() {
			var input = $(this);
			if (input.val() == input.attr('placeholder')) {
				input.val('');
			}
		})
	});
}

if (!(BrowserDetect.browser=='Explorer' && (BrowserDetect.version=='6.0')))
{
	$('.btn_select').each(function(){
		var that=this;
		$(this).find('select').change(function(){
			$(that).find('label').html($(this).find('option[value=\''+$(this).val().replace('\'','\\\'')+'\']').html());
		});
	})
}

});
/***/
function logIt(text)
{
	//$('#log').append('<li>'+text+'</li>');
}


$(document).ready(function(){
	/*ee*/
	if ($.cookies.get("iw_ee_color_bg"))
	{
		if(!$('body').hasClass('stripe'))
		{
			$('body').css('background-color',$.cookies.get("iw_ee_color_bg"));
		}
		$('#footer').css('background-color',$.cookies.get("iw_ee_color_bg2"));
	}
	if ($.cookies.get("iw_ee_color_sb")){$('#submitLogin').css('background-color',$.cookies.get("iw_ee_color_sb"));}
	
	$('#ee,#eer').click(function(e){
		if (!window.ee)
		{
			window.ee=e.pageY;
			if ($(this).attr('id')=='eer')
			{
				var rgbcolor=$('body').css('background-color').replace('rgb(','').replace(')','').split(',');
				var rgbcolor2=$('#footer').css('background-color').replace('rgb(','').replace(')','').split(',');
				r2=rgbcolor2[0];
				g2=rgbcolor2[1];
				b2=rgbcolor2[2];
				window.ee2 = rgbToHsl(r2, g2, b2);
			}
			else
			{
				var rgbcolor=$('#submitLogin').css('background-color').replace('rgb(','').replace(')','').split(',');
			}
			r=rgbcolor[0];
			g=rgbcolor[1];
			b=rgbcolor[2];
			window.ee = rgbToHsl(r, g, b);
			window.eec = e.pageY;

		}
		else
		{
			$.cookies.set("iw_ee_color_bg", $('body').css('background-color'));
			$.cookies.set("iw_ee_color_bg2", $('#footer').css('background-color'));
			$.cookies.set("iw_ee_color_sb", $('#submitLogin').css('background-color'));
			window.ee=false;
		}
	}).mousemove(function(e){
		if (window.ee)
		{
			hsl=window.ee;
			if(window.ee2){hsl2=window.ee2;}
			var num=Math.round((hsl[0]*360)+((e.pageY-hsl[0]-window.eec)/3));
			
			if (num<0)
			{
				while(num<0)
				{
					num=360+num;
				}
			}
			if (num>360)
			{
				while(num>360)
				{
					num=num-360;
				}
			}
			
			var rgb=hslToRgb(num/360,hsl[1],hsl[2]);
			if(window.ee2){var rgb2=hslToRgb(num/360,hsl2[1],hsl2[2]);}
			if ($(this).attr('id')=='eer')
			{
				if(!$('body').hasClass('stripe'))
				{
					$('body').css('background-color','rgb('+Math.round(rgb[0])+','+Math.round(rgb[1])+','+Math.round(rgb[2])+')');
				}
				if(rgb2){$('#footer').css('background-color','rgb('+Math.round(rgb2[0])+','+Math.round(rgb2[1])+','+Math.round(rgb2[2])+')');}
			}
			else
			{
				$('#submitLogin').css('background-color','rgb('+Math.round(rgb[0])+','+Math.round(rgb[1])+','+Math.round(rgb[2])+')');
			}
		}
		/**/
	}).mouseover(function(){
		if($.cookies.get("iw_ee_color_bg") || $.cookies.get("iw_ee_color_sb"))
		{
			$(".eexbtn",this).fadeIn();
		}
	}).mouseout(function(){
		if($.cookies.get("iw_ee_color_bg") || $.cookies.get("iw_ee_color_sb"))
		{
			$(".eexbtn",this).fadeOut();
		}
	});
	$('#ee .eexbtn').click(function(){
		$.cookies.del("iw_ee_color_sb");
		location.reload();
	});
	$('#eer .eexbtn').click(function(){
		$.cookies.del("iw_ee_color_bg");
		$.cookies.del("iw_ee_color_bg2");
		location.reload();
	});
	/*end of ee*/
	/**/
	
	/* prepare selects to be enhanced */
	$('.btn_select').each(function(){
		
		var userAgent = navigator.userAgent.toLowerCase();
		var userPlatform = navigator.platform.toLowerCase();
		$.browser = {
			version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [0,'0'])[1],
			safari: /webkit/.test( userAgent ),
			opera: /opera/.test( userAgent ),
			msie: /msie/.test( userAgent ) && !/opera/.test( userAgent ),
			mozilla: /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent ),
			mobile: /android/.test( userAgent ) || 
					/ipad/.test( userAgent ) || 
					/iphone/.test( userAgent ) || 
					/ipod/.test( userAgent ) || 
					/silk/.test( userAgent ) || 
					/mobile/.test( userAgent ) ||
					/arm/.test( userPlatform ) ||
					/transformer/.test( userAgent )
		};
		
		// only if its desired (not for IE7- and mobile devices if set so)
		if (!($.browser.msie && ($.browser.version=='6.0' || $.browser.version=='7.0')) && !$(this).hasClass('pure') && !($(this).hasClass('pure_mobile') && $.browser.mobile))
		{
			$(this).wrap('<span class="bubbleInfo selectBubble"></span>').addClass('trigger');
		}
		
		var options=$('select option',this);
		if(!$('label',this).attr('alt'))
		{
			if ($('i label',this).length==0)
			{
				$('i',this).append('<label></label>');
			}
			if(options[0])
			{
				$('label',this).html(options[0].innerHTML);
			}
			for(var i=0; i<options.length; i++)
			{
				if(options[i].selected)
				{
					$('label',this).html(options[i].innerHTML);
				}
			}
		}
	});
	/**/
	$('.bubbleInfo select').hide();
	/* prepare custom buttons to be enhanced */
	$('.btn_custom').each(function(){
		var userAgent = navigator.userAgent.toLowerCase();
		var userPlatform = navigator.platform.toLowerCase();
		$.browser = {
			version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [0,'0'])[1],
			safari: /webkit/.test( userAgent ),
			opera: /opera/.test( userAgent ),
			msie: /msie/.test( userAgent ) && !/opera/.test( userAgent ),
			mozilla: /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent ),
			mobile: /android/.test( userAgent ) || 
					/ipad/.test( userAgent ) || 
					/iphone/.test( userAgent ) || 
					/ipod/.test( userAgent ) || 
					/silk/.test( userAgent ) || 
					/mobile/.test( userAgent ) ||
					/arm/.test( userPlatform ) ||
					/transformer/.test( userAgent )
		};
		
		// only if its desired (not for IE7- and mobile devices if set so)
		if (!($.browser.msie && ($.browser.version=='6.0' || $.browser.version=='7.0')) && !$(this).hasClass('pure') && !($(this).hasClass('pure_mobile') && $.browser.mobile))
		{
			$(this).wrap('<span class="bubbleInfo customBubble"></span>').addClass('trigger');
		}
	});
	$('.bubbleInfo.customBubble').each(function(){;
		var content='<div class="popup"><div class="popup_box">'+$('div:first',this).html()+'</div></div>';
		$('div:first',this).html('');
		$(this).append(content);
		$('span[href]',this).each(function(){
			$(this).wrap('<a href="'+$(this).attr('href')+'"></a>');
			$(this).removeAttr('href');
		});
	});
	/**/
	$('.bubbleInfo.selectBubble').each(function(){
		var options=$('select option',this);
		var li='';
		
		$('label',this).attr('alt','-'); // must be done, adding possibility to find the lable later
		
		for(var i=0; i<options.length; i++)
		{
			var css=''
			var img='';
			if ($(options[i]).attr('class')){css="class=\""+$(options[i]).attr('class')+"\"";}
			if ($(options[i]).attr('src')){img='style="background-image:url(\''+$(options[i]).attr('src')+'\');"';}
			
			li+='<li alt="'+options[i].value+'" '+img+' '+css+'>'+options[i].innerHTML+'</li>';
			
			if(options[i].selected)
			{
				$('label',this).html(options[i].innerHTML);
			}
		}
		
		var content='<div class="popup"><div class="popup_box"><ul>'+li+'</ul></div></div>';
		
		$(this).append(content);
	});
	/** main part */
	
	/** Bubbles */
	$(function () {
		$('.bubbleInfo').each(function () {
			// options
			var distance = 30;
			var time = 100;
			var hideDelay = 0;
			var correction=20;
	
			var hideDelayTimer = null;
			
			// tracker
			var beingShown = false;
			var shown = false;
			
			if($(this).hasClass('selectBubble'))
			{
				var w=$('.popup', this).width();
				if (w<$('.trigger', this).width()){w=$('.trigger', this).width();}
			
				$('.popup', this).width(w);
				$('.popup li', this).width(w);
			}
			
			var trigger = $('.trigger', this);
			var popup = $('.popup', this).css('opacity', 0);
			var that=this;
			
			if($(trigger).hasClass('left_align'))
			{
				$(popup).addClass('left_align');
			}
			
			$('li',that).click(function(){
				$('select',that).val($(this).attr('alt'));
				try{$('select',that).change();}catch(e){}
				$('label',that).html($(this).html());
				$('.popup',that).hide();
				shown=false;
				beingShown=false;
			});
			
			// set the mouseover and mouseout on both element
			$([trigger.get(0)]).click(function () {
				
				/** close all */
				
				if($('.popup',$(this).parent()).css('display')=='block')
				{
					$('.popup',$(this).parent()).hide();
					beingShown = false;
					shown = false;
				}
				else
				{
					$('.popup').each(function(){
						var popup=$(this);
						if ($(this).css('display')=='block')
						{
							$(this).hide();
							beingShown = false;
							shown = false;
						}
					});
					
					/**/
					
					// stops the hide event if we move from the trigger to the popup element
					if (hideDelayTimer)
					{
						clearTimeout(hideDelayTimer);
					}
		
		
					// don't trigger the animation again if we're being shown, or already visible
	
					if (popup.css('display')!='none')
					{
						shown=true;
					}
					else
					{
						shown=false;
					}
					
					if (beingShown || shown) {
						logIt('shown/being');
						if(beingShown){logIt('being');}
						if(shown){logIt('shown');}
						return false;
					}
					else
					{
						logIt('start');
						
						beingShown = true;
						
						var top=($('.popup', that).height()*(-1))-distance-correction;
						
						if($(that).hasClass('selectBubble'))
						{
							$('.popup li',that).css('float','none');
							$('.popup',that).height('auto');
							$('.popup',that).width('auto');
							var w=$('.popup',that).width();
							var topAbsolute=$(that).offset().top-$('.popup',that).height();
							
							$('.popup li',that).css('float','left');
						
							var borders=parseInt($('.popup',that).css('border-left-width').replace('px',''))+parseInt($('.popup',that).css('border-right-width').replace('px',''));
							$('.popup',that).width($('li',that).width()*Math.ceil($('.popup',that).height()/($('.popup',that).height()+topAbsolute-distance))+borders);
						}
						
						var leftAbsolute=$('.trigger',that).offset().left+$('.popup',that).width();
						/**/
						if (leftAbsolute>($(document).width()-correction*2))
						{
							left=($(document).width()-leftAbsolute)-correction*2;
						}
						else
						{
							left='0';
						}
						/**/
						
						top=($('.popup', that).height()*(-1))-distance-correction;
						//left=$('.trigger',that).offset().left+$('.trigger',that).width()-$('.popup',that).width();
						//alert($('.trigger',that).offset().left+'+'+$('.trigger',that).width()+'-'+$('.popup',that).width());
						if($(popup).hasClass('left_align'))
						{
							left=$('.trigger',that).width()-$('.popup',that).width();
						}
						// reset position of popup box
						popup.css({
							top: top+distance,
							left: left,
							opacity:1
						}).show();
					}
					
					logIt('finished');
					
				}
				
				return false;
			});
			$([popup.get(0)]).outerClick(function () {
				
				logIt('mouseout popup/trigger '+'['+this.nodeName+']');
				
				if (beingShown || shown)
				{
					logIt('mouseout being/shown '+'['+this.nodeName+']');
					
					// reset the timer if we get fired again - avoids double animations
					if (hideDelayTimer) clearTimeout(hideDelayTimer);
					
					// store the timer so that it can be cleared in the mouseover if required
					hideDelayTimer = setTimeout(function () {
						hideDelayTimer = null;
						popup.hide();
						beingShown = false;
						shown = false;
					}, hideDelay);
					
				}
			});
			// set the mouseover and mouseout on both element
	
		$([popup.get(0)]).mouseover(function () {
			
			logIt('mouseover popup');
			
			// stops the hide event if we move from the trigger to the popup element
			if (hideDelayTimer) clearTimeout(hideDelayTimer);
	
			// don't trigger the animation again if we're being shown, or already visible
			if (popup.css('display')!='none'){shown=true;}else{shown=false;}
			if (beingShown || shown) {
				return;
			} else {
				beingShown = true;
				// reset position of popup box
				popup.css({
					top: -100,
					left: -0,
					display: 'block' // brings the popup back in to view
				})
			// (we're using chaining on the popup) now animate it's opacity and position
			.animate({
				top: '+=' + distance + 'px',
				opacity: 1
				}, time, 'swing', function() {
					// once the animation is complete, set the tracker variables
					beingShown = false;
					shown = true;
				});
			}
			return false;
		});
		});
	});
	/** END of bubbles */
	
	/* utilities */
	var d=new Date();
	$('#date_day').html(d.getDate());
	$('.u_item').click(function(){
		var that=this;
		if($(this).hasClass('active'))
		{
			$('#u_list').animate({width:340},'fast','',function(){
				$('.u_item').removeClass('active');
			});
		}
		else
		{
			$('.u_description_item').hide();
			$('#'+$(that).attr('id')+'_description').show();
			$('.u_item').removeClass('active');
			$(that).addClass('active');
			$('#u_list').animate({width:60},'fast');
		}
	});
	$('#u_description .text').focus(function(){
		var that=this;
		setTimeout(function(){$(that).select();},50);
		setTimeout(function(){$(that).select();},150);
	});
	/**/
});

/*****/
