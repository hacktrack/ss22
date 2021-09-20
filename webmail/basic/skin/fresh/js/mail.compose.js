window.visibleTab='email';

function urlencode (str) {
    str = (str + '').toString();
    return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
    replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
}


function addFileField()
{
	first=document.getElementById('attachments_first');

	div=vytvor('div');

	field=vytvor('input');
	field.type='file';
	field.name="_frm[attachment][]";
	if (first.size)
	{
		field.size=first.size;
	}
	else
	{
		field.size=45;
	}
	pridejElement(div,field);

	var css='';
	if (document.getElementById('addFileField2')){css=document.getElementById('addFileField2').className;}

	button=vytvor('input');
	button.type="button";
	button.className="rem "+css;
	button.value="-";
	button.onclick=function ()
	{
		div=this.parentNode;
		removeElement(div);
		return false;
	}
	pridejElement(div,button);

	pridejElement(document.getElementById('attachments'),div);
}

function removeMainFileField()
{
	document.getElementById('attachments_first').value='';
}

function AttachEvent (obj, eventname, handler) {
	//MSIE
	if (obj.attachEvent)
		obj.attachEvent(eventname, handler);
	//Others
	else
		obj.addEventListener(eventname.substr(2), handler, false);
};

function sfwGetKey(e)
{
	return ((window.event) ? window.event.keyCode : e.which);
}

function showhide(co,tab)
{
	if (window.visibleTab!=co)
	{
		tab.className="tab activeTab";
		document.getElementById(window.visibleTab).style.display="none";
		document.getElementById(co).style.display="block";
		if (!window.activeTab) window.activeTab=document.getElementById('emailtab');
		window.activeTab.className="tab";
		window.visibleTab=co;
		window.activeTab=tab;
	}
}

/**/


function checkWysiwyg(first)
{
	if (!first) {var first=false;}
	
	window.wwstat=false;
	if ($('#selectType').val()=='plain'/* || ((navigator.appVersion.indexOf("Android")!=-1 || navigator.appVersion.indexOf("Mobile")!=-1))*/)
	{
		/*
		if ((navigator.appVersion.indexOf("Android")!=-1 || navigator.appVersion.indexOf("Mobile")!=-1))
		{
			$('#selectType').val('plain');
			$('#selectType').hide();
		}*/
		if (document.getElementById('wysiwygToolbarButtonHTML')) {turnWon('off');}
		return false;
	}
	else
	{
		if (document.getElementById('wysiwygToolbarButtonHTML') && !first) {turnWon('on');}
		return true;
	}
}

/**
* Function : dump()
* Arguments: The data - array,hash(associative array),object
*    The level - OPTIONAL
* Returns  : The textual representation of the array.
* This function was inspired by the print_r function of PHP.
* This will accept some data as the argument and return a
* text that will be a more readable version of the
* array/hash/object that is given.
*/
function dump(arr,level) {
var dumped_text = "";
if(!level) level = 0;

//The padding given at the beginning of the line.
var level_padding = "";
for(var j=0;j<level+1;j++) level_padding += "____";

if(typeof(arr) == 'object') { //Array/Hashes/Objects
 for(var item in arr) {
  var value = arr[item];

  if(typeof(value) == 'object') { //If it is an array,
   dumped_text += level_padding + "'" + item + "' ...<br />";
   if (level<1)
   {
   	dumped_text += dump(value,level+1);
  	}
  } else {
   dumped_text += level_padding + "'" + item + "' => \"" + value + "\"<br />";
  }
 }
} else { //Stings/Chars/Numbers etc.
 dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
}
return dumped_text;
}

function setSelRange(inputEl, selStart, selEnd) {
 if (inputEl.setSelectionRange) {
  inputEl.focus();
  inputEl.setSelectionRange(selStart, selEnd);
 } else if (inputEl.createTextRange) {
  var range = inputEl.createTextRange();
  range.collapse(true);
  range.moveEnd('character', selEnd);
  range.moveStart('character', selStart);
  range.select();
 }
}

function WWonload()
{
	checkWysiwyg(true);

	if (document.getElementById('toField').value!='')
	{
		document.getElementById('toField').blur();
		if (document.getElementById('mainTextareawysiwygIframe'))
		{
			document.getElementById('mainTextareawysiwygIframe').contentWindow.focus();
		}
		else if(document.getElementById('mainTextareawysiwygTextarea'))
		{
			document.getElementById('mainTextareawysiwygTextarea').focus();
			setSelRange(document.getElementById('mainTextareawysiwygTextarea'),0,0)
		}
	}
	else
	{
		if (document.getElementById('mainTextareawysiwygTextarea'))
		{
			document.getElementById('mainTextareawysiwygTextarea').blur();
		}
		document.getElementById('toField').focus();
	}
	

var out_func=function (event)
	{
		if (sfwGetKey(event)==9)
		{
			this.blur();
			if (document.getElementById('bottom_submit'))
			{
				document.getElementById('bottom_submit').focus();
			}
			(arguments[0].preventDefault)? arguments[0].preventDefault(): arguments[0].returnValue = false;
		}
	}

if (document.getElementById('mainTextareawysiwygIframe'))
{
	if (document.getElementById('mainTextareawysiwygIframe').contentWindow.addEventListener)
	{
		document.getElementById('mainTextareawysiwygIframe').contentWindow.addEventListener("keydown",out_func,true);
	}
}



if (document.getElementById('mainTextareawysiwygIframe'))
{
oW=document.getElementById('mainTextareawysiwygIframe').contentWindow;
var d=oW.document;

if (d.body.attachEvent)
{
d.body.attachEvent("onkeydown",function (event)
	{
		//alert(event.keyCode);
		if (event.keyCode==9)
		{
			//this.blur();
			if (document.getElementById('bottom_submit'))
			{
				document.getElementById('bottom_submit').focus();
			}
			(arguments[0].preventDefault)? arguments[0].preventDefault(): arguments[0].returnValue = false;
		}
		else
		{
			
		}
	});
}
}

	$('#mainTextareawysiwygTextarea').keydown(function (event)
	{
		if (sfwGetKey(event)==9)
		{
			this.blur();
			if (document.getElementById('bottom_submit'))
			{
				document.getElementById('bottom_submit').focus();
			}
			return false;
		}
	});

}

function setSelectionRange(input, selectionStart, selectionEnd)
{
	if (input.createTextRange)
	{
		var range = input.createTextRange();
		range.collapse(true);
		range.moveEnd('character', selectionEnd);
		range.moveStart('character', selectionStart);
		range.select();
	}
	else if (input.setSelectionRange)
	{
		input.focus();
		input.setSelectionRange(selectionStart, selectionEnd);
	}
}

$(document).ready(function(){
	
	// extension
	jQuery.fn.extend({
	insertAtCaret: function(myValue,untrim){
	  return this.each(function(i) {
	    if (document.selection) {
	      //For browsers like Internet Explorer
	      this.focus();
	      var sel = document.selection.createRange();
	      sel.text = myValue;
	      this.focus();
	    }
	    else if (this.selectionStart || this.selectionStart == '0') {
	      //For browsers like Firefox and Webkit based
	      var startPos = this.selectionStart;
	      var endPos = this.selectionEnd;
	      var scrollTop = this.scrollTop;
	      
	      if(untrim && startPos>0)
	      {
	      	if(this.value.substring(startPos-1, startPos)!=' ' && this.value.substring(startPos-1, startPos)!="\r" && this.value.substring(startPos-1, startPos)!="\n")
	      	{
	      		myValue=" "+myValue;
	      	}
	      	if(endPos<this.value.length && this.value.substring(endPos, endPos+1)!=' ' && this.value.substring(endPos, endPos+1)!="\r" && this.value.substring(endPos, endPos+1)!="\n")
	      	{
	      		myValue=myValue+" ";
	      	}
	      }
	      
	      this.value = this.value.substring(0, startPos)+myValue+this.value.substring(endPos,this.value.length);
	      this.focus();
	      this.selectionStart = startPos + myValue.length;
	      this.selectionEnd = startPos + myValue.length;
	      this.scrollTop = scrollTop;
	    } else {
	      this.value += myValue;
	      this.focus();
	    }
	  });
	}
	});
	//
	
	var myNav = navigator.userAgent.toLowerCase();
	var IETablet = (myNav.indexOf('trident') != -1 && myNav.indexOf('tablet')!=-1);

	if (IETablet)
	{
		$('#selectType').val('plain');
		$('#selectType').hide();
	}
	
/**** SUGGEST FUNCTIONS ****/
/*******************************/
var suggest={};
suggest.last='';
suggest.pos=0;

suggest.setCaretPos=function(ctrl, pos)
{

	if(ctrl.setSelectionRange)
	{
		ctrl.focus();
		ctrl.setSelectionRange(pos,pos);
	}
	else if (ctrl.createTextRange) {
		var range = ctrl.createTextRange();
		range.collapse(true);
		range.moveEnd('character', pos);
		range.moveStart('character', pos);
		range.select();
	}
};
suggest.sfwGetKey=function(e)
{
	return ((window.event) ? window.event.keyCode : e.which);
}
suggest.getCaretPos = function(that)
{
	// IE
	if (document.selection){
		that.focus();
		var bookmark = "¨";
		var orig = that.value;
		var caretPos = document.selection.createRange();
		var sel = caretPos.text;
		caretPos.text = bookmark;
		var i = that.value.search(bookmark);
		that.value=orig;
		suggest.setCaretPos(that,i);
		return i;
	}
	// OTHERS
	else
	{
		return that.selectionStart;
	}
};
suggest.getSearchText=function(that)
{
	var txt='';
	var ch='';
	var done=false;
	var pos=suggest.getCaretPos(that)-1;
	var val=that.value;
	
	if (val.search(',')>-1)
	{
		var ex=val.split(',');
		var j='';
		for(var i=0; i<ex.length; i++)
		{
			j=j+ex[i]+',';
			if (j.length-2>=pos && !done)
			{
				txt=ex[i];
				done=true;
			}
		}
	}
	else
	{
		txt=val;
	}
	
	return trim(txt.replace(/"/g,'').replace(/</g,'').replace(/>/g,''));
};
suggest.selectNext=function(that)
{
	if($('#suggest a.active').hasClass('active'))
	{
		if ($('#suggest a.active:last-child').hasClass('active'))
		{
			$('#suggest a.active').removeClass('active');
			$('#suggest a:first-child').addClass('active');
		}
		else
		{
			var active=$('#suggest a.active');
			active.next('a').addClass('active');
			active.removeClass('active');
		}
	}
	else
	{
		$('#suggest a:first-child').addClass('active');
	}
}
suggest.selectPrev=function(that)
{
	if($('#suggest a.active').hasClass('active'))
	{
		if ($('#suggest a.active:first-child').hasClass('active'))
		{
			$('#suggest a.active').removeClass('active');
			$('#suggest a:last-child').addClass('active');
		}
		else
		{
			var active=$('#suggest a.active');
			active.prev('a').addClass('active');
			active.removeClass('active');
		}
	}
	else
	{
		$('#suggest a:last-child').addClass('active');
	}
}
suggest.use=function(that)
{
	if (!suggest.shown)
	{
		
		return false;
	}
	
	var txt='';
	var ch='';
	var newpos=0;
	var ret=new Array();
	var done=false;
	var last=false;
	var j='';
	var j2='';
	var val=that.value;
	var pos=suggest.pos;
	var str=$('#suggest a.active').attr('rel');
		if(str)
		{
			str=str.split('|IWSEP|');
			if (str[0]==''){str='<'+str[1]+'>';}
			else {str='"'+str[0]+'" <'+str[1]+'>';}
		}
		else
		{
			return false;
		}
		
	if (val.search(',')>-1)
	{
		var ex=val.split(',');
		for(var i=0; i<ex.length; i++)
		{
			j=j+ex[i]+',';
			if (j.length-1>=pos && !done)
			{
				if (i==0){str=str+' ';}else{str=' '+str+' ';}
				ret.push(str);
				newpos=(j2+str).length;
				if((i+1)==ex.length){last=true;}
				done=true;
			}
			else
			{
				ret.push(ex[i]);
			}
			j2=j2+ex[i]+',';
		}
	}
	else
	{
		ret.push(str);
		last=true;
	}
	txt=ret.join(','); if (last){txt+=', ';}
	$(that).val(txt);
	if(!last){suggest.setCaretPos(that,newpos);}
	suggest.last='';
	suggest.shown=false;
	$('#suggest').slideUp();
	$('#suggest').html('');
}
/**** SUGGEST CODE ****/
$('.suggest').attr('autocomplete','off');
$('.suggest').blur(function(){
	if (document.getElementById('suggest')){suggest.last='';$('#suggest').slideUp();suggest.shown=false;}
	
});
$('.suggest').keydown(function(event){
	if (suggest.sfwGetKey(event)==27)
	{
		suggest.shown=false;
		$('#suggest').slideUp();
		$('#suggest').html('');
		return false;
	}
	else if(suggest.sfwGetKey(event)==38)
	{
		suggest.selectPrev(this);
		return false;
	}
	else if(suggest.sfwGetKey(event)==40)
	{
		suggest.selectNext(this);
		return false;
	}
	else if(suggest.sfwGetKey(event)==13)
	{
		suggest.use(this);
		return false;
	}
});
$('.suggest').keyup(function(event){
	var last='';
	var query='';
	var that=this;
	var search=suggest.getSearchText(this);
	var value=$(this).val()
	suggest.pos=suggest.getCaretPos(that)
	
	if (suggest.sfwGetKey(event)==27 || suggest.sfwGetKey(event)==38 || suggest.sfwGetKey(event)==40 || suggest.sfwGetKey(event)==13)
	{
		return false;
	}

	if (suggest.last!=search)
	{
		suggest.last=search;
		
		if (search.length>=2)
		{
			if (!document.getElementById('suggest')){$('body').append('<div id="suggest"></div>');}
			
			// The old one, maybe not necessary to have here... once the new one will work, delete it
			
			//query='<iq sid="{SID}" uid="0" type="get" format="json"><query xmlns="webmail:iq:items"><account uid="{UID}"><folder uid="__@@ADDRESSBOOK@@__"><item><values><itmtitle> </itmtitle><itmclass> </itmclass><itmclassifyas> </itmclassifyas><itmfirstname> </itmfirstname><itmmiddlename> </itmmiddlename><itmsurname> </itmsurname><itmsuffix> </itmsuffix><lctemail1> </lctemail1><lctemail2> </lctemail2><lctemail3> </lctemail3><lcttype> </lcttype><ctz>{CTZ}</ctz></values><filter><limit>10</limit><order_by>ITMCLASSIFYAS ASC, ITMFIRSTNAME ASC, ITMSURNAME ASC, LCTEMAIL1 ASC, LCTEMAIL2 ASC, LCTEMAIL3 ASC</order_by><sql>((NOT (LCTEMAIL1 = \'\')) OR (NOT (LCTEMAIL2 = \'\')) OR (NOT (LCTEMAIL3 = \'\'))) AND (LCTEMAIL1 LIKE \'%'+search+'%\' OR LCTEMAIL2 LIKE \'%'+search+'%\' OR LCTEMAIL3 LIKE \'%'+search+'%\' OR ITMCLASSIFYAS LIKE \'%'+search+'%\' OR ITMTITLE LIKE \'%'+search+'%\' OR ITMFIRSTNAME LIKE \'%'+search+'%\' OR ITMMIDDLENAME LIKE \'%'+search+'%\' OR ITMSURNAME LIKE \'%'+search+'%\')</sql></filter></item></folder></account></query></iq>';
			
			// propably the same as the old one, but maybe not...
			//search=search.replace(/'/g,'\\\'');
			//query='<iq sid="wm-5090f587ef5ac082893168" uid="{UID}" type="get" format="json"><query xmlns="webmail:iq:items"><account uid="admin@demo.com"><folder uid="__@@ADDRESSBOOK@@__"><item><values><itmtitle> </itmtitle><itmclass> </itmclass><itmclassifyas> </itmclassifyas><itmfirstname> </itmfirstname><itmmiddlename> </itmmiddlename><itmsurname> </itmsurname><itmsuffix> </itmsuffix><lctemail1> </lctemail1><lctemail2> </lctemail2><lctemail3> </lctemail3><lcttype> </lcttype><ctz>60</ctz></values><filter><limit>15</limit><order_by>ITMCLASSIFYAS ASC, ITMFIRSTNAME ASC, ITMSURNAME ASC, LCTEMAIL1 ASC, LCTEMAIL2 ASC, LCTEMAIL3 ASC</order_by><sql>((NOT (LCTEMAIL1 = \'\')) OR (NOT (LCTEMAIL2 = \'\')) OR (NOT (LCTEMAIL3 = \'\'))) AND (LCTEMAIL1 LIKE \'%'+search+'%\' OR LCTEMAIL2 LIKE \'%'+search+'%\' OR LCTEMAIL3 LIKE \'%'+search+'%\' OR ITMCLASSIFYAS LIKE \'%'+search+'%\' OR ITMTITLE LIKE \'%'+search+'%\' OR ITMFIRSTNAME LIKE \'%'+search+'%\' OR ITMMIDDLENAME LIKE \'%'+search+'%\' OR ITMSURNAME LIKE \'%'+search+'%\')</sql></filter></item></folder></account></query></iq>';
			
			// The new one. Once the groupware is fixed, uncomment this and delete all above
			search=htmlspecialchars2(search);
			query='<iq sid="{SID}" uid="0" type="get" format="json"><query xmlns="webmail:iq:items"><account uid="{UID}"><folder uid="__@@ADDRESSBOOK@@__"><item><values><itmtitle> </itmtitle><itmclass> </itmclass><itmclassifyas> </itmclassifyas><itmfirstname> </itmfirstname><itmmiddlename> </itmmiddlename><itmsurname> </itmsurname><itmsuffix> </itmsuffix><lctemail1> </lctemail1><lctemail2> </lctemail2><lctemail3> </lctemail3><lcttype> </lcttype><ctz>60</ctz></values><filter><search>has:email AND (email:'+search+' OR classify:'+search+' OR title:'+search+' OR name:'+search+')</search><sort><on>ITMCLASSIFYAS</on><on>ITMFIRSTNAME</on><on>ITMSURNAME</on><on>LCTEMAIL1</on><on>LCTEMAIL2</on><on>LCTEMAIL3</on></sort><show>15</show></filter></item></folder></account></query></iq>';
			
			iq.get(query,function(data){
				var list={};
				if (data && data.IQ[0].QUERY[0].ACCOUNT[0].FOLDER[0].ITEM)
				{
					data=data.IQ[0].QUERY[0].ACCOUNT[0].FOLDER[0].ITEM;
					for(var i=0; i<data.length; i++)
					{
						
						var name=((data[i].VALUES[0].ITMCLASSIFYAS[0].VALUE)?data[i].VALUES[0].ITMCLASSIFYAS[0].VALUE:'');
						if (data[i].VALUES[0].LCTEMAIL1[0].VALUE)
						{
							if (!list[data[i].VALUES[0].LCTEMAIL1[0].VALUE] || name!='')
							{
								list[data[i].VALUES[0].LCTEMAIL1[0].VALUE]={
									name:name,
									email:data[i].VALUES[0].LCTEMAIL1[0].VALUE
								};
							}
						}
						if (data[i].VALUES[0].LCTEMAIL2[0].VALUE)
						{
							if (!list[data[i].VALUES[0].LCTEMAIL2[0].VALUE] || name!='')
							{
								list[data[i].VALUES[0].LCTEMAIL2[0].VALUE]={
									name:name,
									email:data[i].VALUES[0].LCTEMAIL2[0].VALUE
								};
							}
						}
						if (data[i].VALUES[0].LCTEMAIL3[0].VALUE)
						{
							if (!list[data[i].VALUES[0].LCTEMAIL3[0].VALUE] || name!='')
							{
								list[data[i].VALUES[0].LCTEMAIL3[0].VALUE]={
									name:name,
									email:data[i].VALUES[0].LCTEMAIL3[0].VALUE
								};
							}
						}
						/* distribution list */
						if(data[i].VALUES[0].ITMCLASS[0].VALUE && data[i].VALUES[0].ITMCLASS[0].VALUE=='L')
						{
							//email="%5B"+data[i].VALUES[0].ITMFOLDER[0].VALUE+"%2F"+name+"%5D";
							list[data[i].VALUES[0].LCTEMAIL1[0].VALUE]={
									name:name,
									email:"["+data[i].VALUES[0].ITMFOLDER[0].VALUE.replace(/\\/, "/")+"/"+urlencode(name)+"]",
									dl:true
								};
						}
					}
				}
				var html='';
				for(var i in list)
				{
					nameEscaped=list[i]['name'].replace(/\\/g,'\\\\').replace(/"/g,'\\"');
					if (name.substr(0,1)!='"')
					{
						nameEscaped=nameEscaped.replace(/'/g,"\\'");
					}
					
					if(list[i]['dl'])
					{
						html+='<a href="javascript:;" rel="'+htmlspecialchars2(nameEscaped)+'|IWSEP|'+htmlspecialchars2(list[i]['email'])+'">['+htmlspecialchars2(list[i]['name'])+']</a>';
					}
					else
					{
						html+='<a href="javascript:;" rel="'+htmlspecialchars2(nameEscaped)+'|IWSEP|'+htmlspecialchars2(list[i]['email'])+'">'+htmlspecialchars2(list[i]['name'])+' &lt;'+htmlspecialchars2(list[i]['email'])+'&gt;</a>';
					}
				}
				if (html!='')
				{
					$('#suggest').each(function(){
						var that2=this;
						var position=$(that).offset();
						var dimensions=getDimensions(that);
						$(this).css('top',(position.top+dimensions.height)+'px');
						$(this).css('left',position.left+'px');
						$(this).css('width',dimensions.width+'px');
						$(this).html(html);
						$('#'+this.id+' a').click(function(){
							var stemp=suggest.shown;
							suggest.shown=true;
							suggest.use(that);
							suggest.shown=stemp;
							that.focus();
							return false;
						});
						$('#'+this.id+' a').mouseover(function(event){
							$('#'+that2.id+' a.active').removeClass('active');
							$(this).addClass('active');
						});
						$('#suggest a:first-child').addClass('active');
						$(this).slideDown();
						suggest.shown=true;
					});
				}
				else{$('#suggest').slideUp();suggest.shown=false;}
			});
		}
		else{suggest.last='';$('#suggest').slideUp();suggest.shown=false;}
	}
});
/********/
/********/

	$('a').click(function(){
		if ($(this).attr('target')!='_blank' && this.id!='error' && !$(this).hasClass('attachmentLink'))
		{
			if(!confirm($('#lang_leave_notice').val())){return false;}
		}
	});

	document.getElementById('mainTextarea').name='html';

	$('#submitButon').blur();
	$('#toField').focus();
	$('#submitButon').blur();

	//checkWysiwyg();
	$('#selectType').change(function(){
		checkWysiwyg();
		return false;
	});

	$('input[type="text"]').keypress(function (event)
	{
		if (sfwGetKey(event)==13)
		{
			return false;
		}
	});

	$('#toField').keydown(function (event)
	{
		if (sfwGetKey(event)==9)
		{
			this.blur();
			$('#ccField').focus();
			return false;
		}
	});

	$('#subjectField').keydown(function (event)
	{
		event = event || window.event;
		if (sfwGetKey(event)==9)
		{
			//this.blur();
			if(document.getElementById('mainTextareawysiwygIframe'))
			{
				document.getElementById('mainTextareawysiwygIframe').contentWindow.focus();

			}
			else if (document.getElementById('mainTextareawysiwygTextarea'))
			{
				document.getElementById('mainTextareawysiwygTextarea').focus();
				setSelectionRange(document.getElementById('mainTextareawysiwygTextarea'),0,0)
			}
			return false;
		}
	});

	$('#lastCheck').keydown(function (event)
	{
		if (sfwGetKey(event)==9)
		{
			this.blur();
			if (document.getElementById('toField'))
			{
				document.getElementById('toField').focus();
			}
			return false;
		}
	});

	$('#mainTextareawysiwygTextarea').keydown(function (event)
	{
		if (sfwGetKey(event)==9)
		{
			this.blur();
			if (document.getElementById('bottom_submit'))
			{
				document.getElementById('bottom_submit').focus();
			}
			return false;
		}
	});
	
	$('#smartAttachCheckbox').click(function(){
		if($(this).is(':checked'))
		{
			//alert('checked');
			if($('#selectType').val()!='html')
			{
				$('#selectType').val('html');
				checkWysiwyg();
			}
		}
	});
	
	pad = function (value, length) {
		value = String(value);
		length = parseInt(length) || 2;
		while (value.length < length)
			value = "0" + value;
		return value;
	};
	
	var oDate = new Date();
	$('#timeInput').val(oDate.format('D, d M Y H:i:s ')+(oDate.getTimezoneOffset() > 0 ? "-" : "+") + pad(Math.floor(Math.abs(oDate.getTimezoneOffset()) / 60) * 100 + Math.abs(oDate.getTimezoneOffset()) % 60, 4));
	
	// handle dropbox file chooser
	$('#dropboxAddFiles').click(function(){
		Dropbox.choose({
			// Required. Called when a user selects an item in the Chooser.
			success: function(files) {
				//alert("Here's the file link: " + files[0].link)
				for(var i=0; i<files.length; i++)
				{
					var type=$('#selectType').val();
					if(type=='html')
					{
						//$("#mainTextareawysiwygIframe").contents().find("#iframeBody").insertAtCaret(files[i].link,true);
						document.getElementById("mainTextareawysiwygIframe").contentWindow.document.execCommand("InsertHTML", false, ' <a href="'+files[i].link+'">'+files[i].name+'</a> ');
					}
					else
					{
						$('#mainTextareawysiwygTextarea').insertAtCaret(files[i].link,true);
					}
				}
			},
			
			// Optional. Called when the user closes the dialog without selecting a file
			// and does not include any parameters.
			cancel: function() {
				
			},
			
			// Optional. "preview" (default) is a preview link to the document for sharing,
			// "direct" is an expiring link to download the contents of the file. For more
			// information about link types, see Link types below.
			linkType: "preview", // or "direct"
			
			// Optional. A value of false (default) limits selection to a single file, while
			// true enables multiple file selection.
			multiselect: true, // or true
		});
	});

});