var toast=function(text,longer)
{
	var timeout=2000;
	var longer_timeout=4000;
	var code='<div id="toast_message" style="display:none;position: fixed; width: 100%; text-align: center; height: 0px; bottom: 40px;"><div style="display: inline-block; background-color: rgb(0, 0, 0); color: rgb(255, 255, 255); font-family: Helvetica; border-radius: 6px; opacity: 0.7; box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.3); font-size: 16px; padding: 5px 12px;"></div></div>';
	if(!document.getElementById('toast_message')){
		$('body').append(code);
	}
	
	$('#toast_message>div').text(text);
	
	if($('#toast_message').data('timeout')){
		clearTimeout($('#toast_message').data('timeout'));
	}
	if($('#toast_message').data('fade')){
		$($('#toast_message').data('fade')).stop();
		$('#toast_message').css('opacity',1);
	}
	
	$('#toast_message').show().data('timeout',setTimeout(function(){
		$('#toast_message').data('timeout',false);
		$('#toast_message').data('fade',$('#toast_message').fadeOut('slow',function(){
			$('#toast_message').data('fade',false);
		}));
	},timeout));
}


// add PHP like date function. Usage: dateObj.format(FORMAT_STRING);

Date.prototype.format=function(e){var t="";var n=Date.replaceChars;for(var r=0;r<e.length;r++){var i=e.charAt(r);if(r-1>=0&&e.charAt(r-1)=="\\"){t+=i}else if(n[i]){t+=n[i].call(this)}else if(i!="\\"){t+=i}}return t};Date.replaceChars={shortMonths:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],longMonths:["January","February","March","April","May","June","July","August","September","October","November","December"],shortDays:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],longDays:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],d:function(){return(this.getDate()<10?"0":"")+this.getDate()},D:function(){return Date.replaceChars.shortDays[this.getDay()]},j:function(){return this.getDate()},l:function(){return Date.replaceChars.longDays[this.getDay()]},N:function(){return this.getDay()+1},S:function(){return this.getDate()%10==1&&this.getDate()!=11?"st":this.getDate()%10==2&&this.getDate()!=12?"nd":this.getDate()%10==3&&this.getDate()!=13?"rd":"th"},w:function(){return this.getDay()},z:function(){var e=new Date(this.getFullYear(),0,1);return Math.ceil((this-e)/864e5)},W:function(){var e=new Date(this.getFullYear(),0,1);return Math.ceil(((this-e)/864e5+e.getDay()+1)/7)},F:function(){return Date.replaceChars.longMonths[this.getMonth()]},m:function(){return(this.getMonth()<9?"0":"")+(this.getMonth()+1)},M:function(){return Date.replaceChars.shortMonths[this.getMonth()]},n:function(){return this.getMonth()+1},t:function(){var e=new Date;return(new Date(e.getFullYear(),e.getMonth(),0)).getDate()},L:function(){var e=this.getFullYear();return e%400==0||e%100!=0&&e%4==0},o:function(){var e=new Date(this.valueOf());e.setDate(e.getDate()-(this.getDay()+6)%7+3);return e.getFullYear()},Y:function(){return this.getFullYear()},y:function(){return(""+this.getFullYear()).substr(2)},a:function(){return this.getHours()<12?"am":"pm"},A:function(){return this.getHours()<12?"AM":"PM"},B:function(){return Math.floor(((this.getUTCHours()+1)%24+this.getUTCMinutes()/60+this.getUTCSeconds()/3600)*1e3/24)},g:function(){return this.getHours()%12||12},G:function(){return this.getHours()},h:function(){return((this.getHours()%12||12)<10?"0":"")+(this.getHours()%12||12)},H:function(){return(this.getHours()<10?"0":"")+this.getHours()},i:function(){return(this.getMinutes()<10?"0":"")+this.getMinutes()},s:function(){return(this.getSeconds()<10?"0":"")+this.getSeconds()},u:function(){var e=this.getMilliseconds();return(e<10?"00":e<100?"0":"")+e},e:function(){return"Not Yet Supported"},I:function(){var e=null;for(var t=0;t<12;++t){var n=new Date(this.getFullYear(),t,1);var r=n.getTimezoneOffset();if(e===null)e=r;else if(r<e){e=r;break}else if(r>e)break}return this.getTimezoneOffset()==e|0},O:function(){return(-this.getTimezoneOffset()<0?"-":"+")+(Math.abs(this.getTimezoneOffset()/60)<10?"0":"")+Math.abs(this.getTimezoneOffset()/60)+"00"},P:function(){return(-this.getTimezoneOffset()<0?"-":"+")+(Math.abs(this.getTimezoneOffset()/60)<10?"0":"")+Math.abs(this.getTimezoneOffset()/60)+":00"},T:function(){var e=this.getMonth();this.setMonth(0);var t=this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/,"$1");this.setMonth(e);return t},Z:function(){return-this.getTimezoneOffset()*60},c:function(){return this.format("Y-m-d\\TH:i:sP")},r:function(){return this.toString()},U:function(){return this.getTime()/1e3}}

function chr (codePt) {
	if (codePt > 0xFFFF)
	{
		codePt -= 0x10000;
		return String.fromCharCode(0xD800 + (codePt >> 10), 0xDC00 + (codePt & 0x3FF));
	}
	return String.fromCharCode(codePt);
}


function getDimensions(that)
{
	var height=$(that).height();
	height=parseInt($(that).css('padding-top').replace('px',''))+height;
	height=parseInt($(that).css('padding-bottom').replace('px',''))+height;
	height=parseInt($(that).css('border-top-width').replace('px',''))+height;
	height=parseInt($(that).css('border-bottom-width').replace('px',''))+height;
	var width=$(that).width();
	width=parseInt($(that).css('padding-left').replace('px',''))+width;
	width=parseInt($(that).css('padding-right').replace('px',''))+width;
	width=parseInt($(that).css('border-top-width').replace('px',''))+width;
	width=parseInt($(that).css('border-bottom-width').replace('px',''))+width;
	return {width:width,height:height};
}

function htmlspecialchars2 (string, quote_style, charset, double_encode) {
    var optTemp = 0,
        i = 0,
        noquotes = false;
    if (typeof quote_style === 'undefined' || quote_style === null) {
        quote_style = 2;
    }
    string = string.toString();
    if (double_encode !== false) { // Put this first to avoid double-encoding
        string = string.replace(/&/g, '&amp;');
    }
    string = string.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    var OPTS = {
        'ENT_NOQUOTES': 0,
        'ENT_HTML_QUOTE_SINGLE': 1,
        'ENT_HTML_QUOTE_DOUBLE': 2,
        'ENT_COMPAT': 2,
        'ENT_QUOTES': 3,
        'ENT_IGNORE': 4
    };
    if (quote_style === 0) {
        noquotes = true;
    }
    if (typeof quote_style !== 'number') { // Allow for a single string or an array of string flags
        quote_style = [].concat(quote_style);
        for (i = 0; i < quote_style.length; i++) {
            // Resolve string input to bitwise e.g. 'ENT_IGNORE' becomes 4
            if (OPTS[quote_style[i]] === 0) {
                noquotes = true;
            }
            else if (OPTS[quote_style[i]]) {
                optTemp = optTemp | OPTS[quote_style[i]];
            }
        }
        quote_style = optTemp;
    }
    if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
        string = string.replace(/'/g, '&#039;');
    }
    if (!noquotes) {
        string = string.replace(/"/g, '&quot;');
    }

    return string;
}


function print_r (array, return_val) {
    var output = '',
        pad_char = ' ',
        pad_val = 4,
        d = this.window.document,
        getFuncName = function (fn) {
            var name = (/\W*function\s+([\w\$]+)\s*\(/).exec(fn);
            if (!name) {
                return '(Anonymous)';
            }
            return name[1];
        },
        repeat_char = function (len, pad_char) {
            var str = '';
            for (var i = 0; i < len; i++) {
                str += pad_char;
            }
            return str;
        },
        formatArray = function (obj, cur_depth, pad_val, pad_char) {
            if (cur_depth > 0) {
                cur_depth++;
            }

            var base_pad = repeat_char(pad_val * cur_depth, pad_char);
            var thick_pad = repeat_char(pad_val * (cur_depth + 1), pad_char);
            var str = '';

            if (typeof obj === 'object' && obj !== null && obj.constructor && getFuncName(obj.constructor) !== 'PHPJS_Resource') {
                str += 'Array\n' + base_pad + '(\n';
                for (var key in obj) {
                    if (Object.prototype.toString.call(obj[key]) === '[object Array]') {
                        str += thick_pad + '[' + key + '] => ' + formatArray(obj[key], cur_depth + 1, pad_val, pad_char);
                    }
                    else {
                        str += thick_pad + '[' + key + '] => ' + obj[key] + '\n';
                    }
                }
                str += base_pad + ')\n';
            }
            else if (obj === null || obj === undefined) {
                str = '';
            }
            else { // for our "resource" class
                str = obj.toString();
            }

            return str;
        };

    output = formatArray(array, 0, pad_val, pad_char);

    if (return_val !== true) {
        if (d.body) {
            this.echo(output);
        }
        else {
            try {
                d = XULDocument; // We're in XUL, so appending as plain text won't work; trigger an error out of XUL
                this.echo('<pre xmlns="http://www.w3.org/1999/xhtml" style="white-space:pre;">' + output + '</pre>');
            } catch (e) {
                this.echo(output); // Outputting as plain text may work in some plain XML
            }
        }
        return true;
    }
    return output;
}

/** Standalone OnNPSlide function 
*		onnpslide(ELEMENT_OBJECT,CALLBACK_FUNCTION);
*/

function microtime (get_as_float) {
	var now = new Date().getTime() / 1000;
	var s = parseInt(now, 10);
	return (get_as_float) ? now : (Math.round((now - s) * 1000) / 1000) + ' ' + s;
}


function onnpslide(elem,fNext,fPrev,prefix,prevent)
{
	var devel=false;
	if(!prevent){prevent=false;}
	if(!prefix){prefix='';}
	var length=0.23; // percent of width
	var precission=60; // pixels
	var android_horizontal_precission=40;
	var speed=0.65; //seconds
	var onnpslidehandlervar=[];
	var onnpslidehandlertime=[];
	var drawtimeout=false;
	
	if(devel){
		$('body').append("<canvas id=\"paper\" width=\""+$('body').width()+"\" height=\""+$(document).outerHeight()+"\" style=\"display:none;position:absolute; top:0; left:0; z-index:10000;\"></canvas>");
	}

	elem.ontouchstart=function(e)
	{
		if(drawtimeout){clearTimeout(drawtimeout);}
		
		onnpslidehandlertime[e.changedTouches[0].identifier]=microtime(true);
		if(prevent){e.preventDefault();}
		if (e.changedTouches[0]){
			onnpslidehandlervar[e.changedTouches[0].identifier]={
				'clientX':e.changedTouches[0]['clientX'],
				'clientY':e.changedTouches[0]['clientY'],
				'pageX':e.changedTouches[0]['pageX'],
				'pageY':e.changedTouches[0]['pageY']
			};
			//var t=prefix+'S X:'+e.changedTouches[0]['clientX']+',Y:'+e.changedTouches[0]['clientY']+"\r\n"+$('.replyarea').val();$('.replyarea').val(t);
		}
		//$('#start').css({top:e.changedTouches[0]['pageY'],left:e.changedTouches[0]['pageX']});
		if(devel){
			toast('start');
		}
	}
	elem.ontouchmove=function(e)
	{
		//var t=prefix+'M X:'+e.changedTouches[0]['clientX']+',Y:'+e.changedTouches[0]['clientY']+"\r\n"+$('.replyarea').val();$('.replyarea').val(t);
		//$('#move').css({top:e.changedTouches[0]['pageY'],left:e.changedTouches[0]['pageX']});
		if(devel){
			toast('move');
		}
		//e.preventDefault();
		//return false;
	}
	
	elem.ontouchend=function(e)
	{
		if(prevent){e.preventDefault();}
		//var t=prefix+'E X:'+e.changedTouches[0]['clientX']+',Y:'+e.changedTouches[0]['clientY']+"\r\n"+$('.replyarea').val();$('.replyarea').val(t);
		
		if (onnpslidehandlervar[e.changedTouches[0].identifier] && onnpslidehandlertime[e.changedTouches[0].identifier] && (microtime(true)-onnpslidehandlertime[e.changedTouches[0].identifier])<speed)
		{
			var x=e.changedTouches[0]['clientX']-onnpslidehandlervar[e.changedTouches[0].identifier]['clientX'];
			var y=Math.abs(e.changedTouches[0]['clientY']-onnpslidehandlervar[e.changedTouches[0].identifier]['clientY']);
			if(x>0 && y<=precission && Math.abs(x)>length*this.offsetWidth)
			{
				fPrev();
			}
			else if(x<0 && y<=precission && Math.abs(x)>length*this.offsetWidth)
			{
				fNext();
			}
		}
		
		//$('#devel').css({top:e.changedTouches[0]['pageY'],left:e.changedTouches[0]['pageX']});
		if(devel){
			/**/
			$('#paper').show().width($('#paper').outerWidth()).height($('#paper').outerHeight());
			drawtimeout=setTimeout(function(){
				$('#paper').fadeOut();
			},1000);
			
			var canvas = $("#paper")[0];
			var c = canvas.getContext("2d");
			
			var startX = onnpslidehandlervar[e.changedTouches[0].identifier]['pageX'];
			var startY = onnpslidehandlervar[e.changedTouches[0].identifier]['pageY'];
			var endX = e.changedTouches[0]['pageX'];
			var endY = e.changedTouches[0]['pageY'];
			c.beginPath();
			c.clearRect(0, 0, canvas.width, canvas.height);
			c.lineCap = "round";
			c.strokeStyle = "red";
			c.moveTo(startX, startY);
			c.lineTo(endX,endY);
			c.lineWidth = 5;
			c.stroke();
			/***/
			
			toast('end');
		
		}
	}
	
	elem.ontouchcancel=function(e)
	{
		if (onnpslidehandlervar[e.changedTouches[0].identifier] && onnpslidehandlertime[e.changedTouches[0].identifier])
		{
			var x=e.changedTouches[0]['clientX']-onnpslidehandlervar[e.changedTouches[0].identifier]['clientX'];
			var y=Math.abs(e.changedTouches[0]['clientY']-onnpslidehandlervar[e.changedTouches[0].identifier]['clientY']);
			if(x>0 && y<=precission && Math.abs(x)>=android_horizontal_precission)
			{
				fPrev();
			}
			else if(x<0 && y<=precission && Math.abs(x)>=android_horizontal_precission)
			{
				fNext();
			}
		}
		
		if(devel){
			$('#devel').css({top:e.changedTouches[0]['pageY'],left:e.changedTouches[0]['pageX']});
			
			/**/
			/**/
			$('#paper').show().width($('#paper').outerWidth()).height($('#paper').outerHeight());
			drawtimeout=setTimeout(function(){
				$('#paper').fadeOut();
			},1000);
			
			var canvas = $("#paper")[0];
			var c = canvas.getContext("2d");
			
			var startX = onnpslidehandlervar[e.changedTouches[0].identifier]['pageX'];
			var startY = onnpslidehandlervar[e.changedTouches[0].identifier]['pageY'];
			var endX = e.changedTouches[0]['pageX'];
			var endY = e.changedTouches[0]['pageY'];
			c.beginPath();
			c.clearRect(0, 0, canvas.width, canvas.height);
			c.lineCap = "round";
			c.strokeStyle = "red";
			c.moveTo(startX, startY);
			c.lineTo(endX,endY);
			c.lineWidth = 5;
			c.stroke();
			/***/
			/***/
			
			toast('cancel');
		}
	}
}
/***********/

function in_array (needle, haystack, argStrict)
{
	var key = '', strict = !!argStrict;
	if (strict) {
	for (key in haystack)
	{
		if (haystack[key] === needle)
		{
			return true;
		}
	}
	} else {
	for (key in haystack) {
		if (haystack[key] == needle) {
		return true;
	}
	}
	}

	return false;
}

function pridejElement(kam,e)
{
	kam.appendChild(e);
}

function vytvor(elem)
{
	return document.createElementNS ? document.createElementNS("http://www.w3.org/1999/xhtml", elem) : document.createElement(elem);
}

function removeElement(div)
{
	if (div)
	{
		var d = div.parentNode;
		d.removeChild(div);
	}
}

$(document).ready(function(){
	var win=window;
	var doc=document;
	
	if($('#search').val()!='')
	{
		$('#search').select();
	}
	
	if(!document.getElementById('jscheck_info') || document.getElementById('jscheck_info').value==1)
	{
		$('.noJSHide').removeClass('noJSHide');
		$('.noJSShow').css('display','none');
	}
	
	$('#menu_portrait').change(function(){
		location.href=this.value;
	});
	
	$('[name=\'_a[delete]\'],[name=\'_a[contact_delete]\'],[name=\'_a[deleteFolder]\'],[name=\'_a[emptyFolder]\']').click(function()
	{
		var title=$('#ondeletewarning').val();
		if (this.alt){title=this.alt;}
		return confirm(title);
	});
	
	np_next=function(){
		//NEXT
		var items=$('a.onNext,input.onNext');
		if (items.length>0)
		{
			$('#mainBox').addClass('cropView');
			$('#waitingOverlayText').html($(items[0]).attr('rel'));
			$('#waitingOverlay').show();
			$('a.onNext,input.onNext').each(function(){
				var that=this;
				if (this.nodeName=='A' || this.nodeName=='a')
				{
					setTimeout(function(){open($(that).attr('href'),'_self')},100);
				}
				else
				{
					setTimeout(function(){that.click();},100);
				}
			});
		}
	};
	
	np_prev=function(){
		//PREV
		var items=$('a.onPrev,input.onPrev');
		if (items.length>0)
		{
			$('#mainBox').addClass('cropView');
			$('#waitingOverlayText').html($(items[0]).attr('rel'));
			$('#waitingOverlay').show();
			$('a.onPrev,input.onPrev').each(function(){
				if (this.nodeName=='A' || this.nodeName=='a')
				{
					open($(this).attr('href'),'_self');
				}
				else
				{
					this.click();
				}
			});
		}
	}
	
	/* handle on slide event */
	if($('body').attr('swipe')){
		onnpslide(document.getElementsByTagName('html')[0],np_next,np_prev,'O',false);
		onnpslide(document.getElementById('mainBox'),np_next,np_prev,'O');
		onnpslide(document.getElementsByTagName('html')[0],np_next,np_prev,'O',false);
	}
	/* */
	scrollTo(0,0);
	
	/** BIND SHORTCUTS */
	var keysStorage=[];
	remapKeys=function(where)
	{
		for(var i=0; i<keysStorage.length; i++)
		{
			mapKey(keysStorage[i].key,keysStorage[i].callback,where);
		}
	}
	
	mapKey=function(key,cb,elm)
	{
		var cb=cb;
		if(elm){
			$(elm).bind(key, function (evt){cb(); return false; });
		}else{
			$(document).bind(key, function (evt){cb(); return false; });
			$('input,textarea').bind(key, function (evt){cb(); return false; });
			keysStorage.push({key:key,callback:cb});
		}
	}
	
	if(!document.getElementById('disableshortcuts') || document.getElementById('disableshortcuts').value=='0' || document.getElementById('disableshortcuts').value==''){
		// top menu
		mapKey('keydown.Alt_Ctrl_m',function(){win.location.href=$('#at_mails',doc).attr('href');});
		mapKey('keydown.Alt_Ctrl_c',function(){win.location.href=$('#at_contacts',doc).attr('href');});
		mapKey('keydown.Alt_Ctrl_e',function(){win.location.href=$('#at_events',doc).attr('href');});
		mapKey('keydown.Alt_Ctrl_t',function(){win.location.href=$('#at_tasks',doc).attr('href');});
		mapKey('keydown.Alt_Ctrl_n',function(){win.location.href=$('#at_notes',doc).attr('href');});
		mapKey('keydown.Alt_Ctrl_f',function(){win.location.href=$('#at_files',doc).attr('href');});
		// new [whatever]
		mapKey('keydown.Ctrl_n',function(){
			var href=$('.box .top a',doc).first().attr('href');
			console.log(href);
			win.location.href=href;
		});
		// folder management
		mapKey('keydown.Ctrl_d',function(){
			var href=$('.box .bottom a',doc).last().attr('href');
			console.log(href);
			win.location.href=href;
		});
		// settings
		mapKey('keydown.Alt_Ctrl_s',function(){win.location.href=$('#at_settings',doc).attr('href');});
		// logout
		mapKey('keydown.Alt_Ctrl_Shift_q',function(){win.location.href=$('#at_logout',doc).attr('href');});
		// compose
		mapKey('keydown.Ctrl_Shift_t',function(){$('#toField',doc).focus();});
		mapKey('keydown.Ctrl_Shift_c',function(){$('#ccField',doc).focus();});
		mapKey('keydown.Ctrl_Shift_b',function(){$('#bccField',doc).focus();});
		mapKey('keydown.Ctrl_Shift_s',function(){$('#subjectField',doc).focus();});
		mapKey('keydown.Ctrl_Shift_m',function(){
			if($('#selectType',doc).val()=='plain')
			{
				$('#mainTextareawysiwygTextarea',doc).focus();
			}
			else
			{
				if(document.getElementById('mainTextareawysiwygIframe',doc))
				{
					document.getElementById('mainTextareawysiwygIframe',doc).contentWindow.focus();
	
				}
			}
		});
		// save (send)
		mapKey('keydown.Ctrl_return',function(){$('.ctrl_enter',doc).click();});
		// save
		mapKey('keydown.Ctrl_s',function(){$('.ctrl_s',doc).click();});
		/** */
	}
});

/***/

// copy and paste with small changes due to quick solution (from /admin/old/script.js)
function addTokenParam() {
	var
		token = getCookie('PHPSESSID_BASIC'),
		form, input, i;

	if (token && document.forms && document.forms[0]) {
		for (i = 0; i < document.forms.length; i++) {
			form = document.forms[i];
			input = document.createElement('input');
			input.type = 'hidden';
			input.name = 'token';
			input.value = token;
			form.appendChild(input);
		}
	}
}

function getCookie(name) {
	var
		dc = document.cookie,
		prefix = name + '=',
		begin = dc.indexOf('; ' + prefix),
		end;

	if (begin === -1) {
		begin = dc.indexOf(prefix);
		if (begin !== 0) {
			return '';
		};
	}
	else {
		begin += 2;
	}

	end = dc.indexOf(';', begin);
	if (end === -1) {
		end = dc.length;
	}

	return unescape(dc.substring(begin + prefix.length, end));
}
