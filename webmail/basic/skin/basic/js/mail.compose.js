window.visibleTab='email';

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
	if ($('#selectType').val()=='plain' || ((navigator.appVersion.indexOf("Mac")!=-1 && navigator.appVersion.indexOf("Mobile")!=-1)))
	{
		if ((navigator.appVersion.indexOf("Mac")!=-1 && navigator.appVersion.indexOf("Mobile")!=-1))
		{
			$('#selectType').val('plain');
			$('#selectType').hide();
		}
		//alert('aa');
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
	
	/*
	document.getElementById('mainTextareawysiwygIframe').contentWindow.addEventListener("keydown", return function(e){
		if (e.keyCode==9){document.getElementById('bottom_submit').focus();return false;}
	}, true);
	*/
/*
	AttachEvent (document.getElementById('mainTextareawysiwygIframe').contentWindow, "keydown", function (event)
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
	});
*/

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

/*
else if (document.getElementById('mainTextareawysiwygIframe').contentWindow.attachEvent)
{
	document.getElementById('mainTextareawysiwygIframe').contentWindow.document.getElementsByTagName('body')[0].attachEvent("keydown",function (event)
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
	});
}
*/
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

/********/

/********/

$('a').click(function(){
	if ($(this).attr('target')!='_blank' && this.id!='error' && !$(this).hasClass('attachmentLink'))
	{
		if(!confirm($('#lang_leave_notice').val())){return false;}
	}
});

	document.getElementById('mainTextarea').name='html';

	$('.into-bottom-line').addClass('jsActive');
	$('.into-bottom-line-right').addClass('jsActive');

	$('#submitButon').blur();
	$('#toField').focus();
	$('#submitButon').blur();

	//checkWysiwyg();
	$('#selectType').change(function(){
		checkWysiwyg();
		return false;
	});

	$('input[type="text"]').keydown(function (event)
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
	

});