/******************************************************************************
**    CONFIGURATION VARIABLES
******************************************************************************/
window.wysiwygOn=false;
/* Location of stylesheet file for editor content */
var wysiwygStylesheet = "skin/basic/css/wysiwyg.content.css";
window.submittingWW=false;

/* Items to appear in toolbar. */
var wysiwygToolbarItems = [
	'blockformat',
	'left',
	'center',
	'right',
	'justify',
	'unorderedlist',
	'orderedlist',
	'indent',
	'outdent',
	'fontformat',
	'fontsize',
	'bold',
	'italic',
	'underline',
	'hyperlink',
	'image',
	'htmlsource'
];

/* Options on block format select element. Consists of string pairs (option value, option label) */
var wysiwygSelectBlockOptions = [
	"", "Block Type",
	"<h1>", "Heading 1",
	"<h2>", "Heading 2",
	"<h3>", "Heading 3",
	"<h4>", "Heading 4",
	"<h5>", "Heading 5",
	"<h6>", "Heading 6",
	"<p>", "Paragraph"
];

var wysiwygSelectFontOptions = [
	'','Font',
	'Arial,Helvetica','Arial',
	'Verdana,Arial,Helvetica','Verdana',
	'Times New Roman,Times,Serif','Times',
	'Comic Sans MS','Comic',
	'Courier New,Courier,Monospace','Courier',
	'Trebuchet MS,Arial,Helvetica','Trebuchet',
	'MS Sans Serif,sans-serif','Sans Serif',
	'Cursive','Cursive',
	'Fantasy','Fantasy'
];

/* Reading font names and families from hidden fields in the template with class .fonts */
$(document).ready(function(){
	if ($('.fonts'))
	{
		var fonts=$('.fonts');
		var fontsArray=['',document.getElementById('lang-mail_compose-font').value];
		for(var i=0; i<fonts.length; i++)
		{
			var parts=fonts[i].value.split('|');
			fontsArray.push(parts[1],parts[0]);
		}
		wysiwygSelectFontOptions=fontsArray;
	}
});
/*********************/

var wysiwygFontSizeOptions = [
	'0','Size',
	'1','1',
	'2','2',
	'3','3',
	'4','4',
	'5','5',
	'6','6',
	'7','7'
];

/* If wysiwygInsertParagraphs = true, when content is submitted paragraphs will be
** inserted around text without a parent element. Mozilla does not
** automatically do this, so if this is set to false you will end up with some
** plain text blocks. Uses a double <br /> as a pargraph marker.
*/

var wysiwygInsertParagraphs = false;

/* If wysiwygAutoClean = true, when content is pasted into the WYSIWYG view, it
** will automatically be cleaned. If wysiwygAutoClean = false, the user will be
** prompted as to whether they wish to clean the content.
*/

var wysiwygAutoClean = false;

var textareaHeight = 405;

/*************** default style ***************/

var default_style='';
var default_direction='ltr';
/******************************************************************************
 **    END CONFIGURATION
 ******************************************************************************/


run();

function br2nl (str) {
    return str.replace(/[\r\n]/g, "").replace(/<br[ \/]*>/ig, "\r\n");
}

function nl2br (str, is_xhtml) {
    var breakTag = '';
    breakTag = '<br />';
    if (typeof is_xhtml != 'undefined' && !is_xhtml) {
        breakTag = '<br>';
    }

    return (str + '').replace(/([^>]?)\n/g, '$1'+ breakTag +'\n');
}

function run()
{
	var oldOnload = window.onload;

	if (typeof(window.onload) != "function")
		window.onload = wysiwygInit;
	else
	window.onload = function()
	{
			oldOnload();
			wysiwygInit();
	}
}




function wysiwygInit()
{
	var status=true;

	/**************/
	wysiwygSelectBlockOptions = [
	"", document.getElementById('lang-mail_compose-block_type').value,
	"<h1>", document.getElementById('lang-mail_compose-heading').value+" 1",
	"<h2>", document.getElementById('lang-mail_compose-heading').value+" 2",
	"<h3>", document.getElementById('lang-mail_compose-heading').value+" 3",
	"<h4>", document.getElementById('lang-mail_compose-heading').value+" 4",
	"<h5>", document.getElementById('lang-mail_compose-heading').value+" 5",
	"<h6>", document.getElementById('lang-mail_compose-heading').value+" 6",
	"<p>", document.getElementById('lang-mail_compose-paragraph').value
	];

	wysiwygToolbarItems = [
	'blockformat',
	'left',
	'center',
	'right',
	'justify',
	'unorderedlist',
	'orderedlist',
	'indent',
	'outdent',
	'fontformat',
	'fontsize',
	'bold',
	'italic',
	'underline',
	'hyperlink',
	'image',
	'htmlsource'
	];
/*
	wysiwygToolbarItems = [
	document.getElementById('lang-mail_compose-blockformat').value,
	document.getElementById('lang-mail_compose-left').value,
	document.getElementById('lang-mail_compose-center').value,
	document.getElementById('lang-mail_compose-right').value,
	document.getElementById('lang-mail_compose-justify').value,
	document.getElementById('lang-mail_compose-unorderedlist').value,
	document.getElementById('lang-mail_compose-orderedlist').value,
	document.getElementById('lang-mail_compose-indent').value,
	document.getElementById('lang-mail_compose-outdent').value,
	document.getElementById('lang-mail_compose-fontformat').value,
	document.getElementById('lang-mail_compose-fontsize').value,
	document.getElementById('lang-mail_compose-bold').value,
	document.getElementById('lang-mail_compose-italic').value,
	document.getElementById('lang-mail_compose-underline').value,
	document.getElementById('lang-mail_compose-hyperlink').value,
	document.getElementById('lang-mail_compose-image').value,
	document.getElementById('lang-mail_compose-htmlsource').value
	];
*/
	wysiwygFontSizeOptions = [
	'0',document.getElementById('lang-mail_compose-size').value,
	'1','1',
	'2','2',
	'3','3',
	'4','4',
	'5','5',
	'6','6',
	'7','7'
	];
	/*
	wysiwygSelectFontOptions = [
	'',document.getElementById('lang-mail_compose-font').value,
	'Arial,Helvetica','Arial',
	'Verdana,Arial,Helvetica','Verdana',
	'Times New Roman,Times,Serif','Times',
	'Comic Sans MS','Comic',
	'Courier New,Courier,Monospace','Courier',
	'Trebuchet MS,Arial,Helvetica','Trebuchet',
	'MS Sans Serif,sans-serif','Sans Serif',
	'Cursive','Cursive',
	'Fantasy','Fantasy'
];
*/
	/**************/

	/**** default style *****/
	if (document.getElementById('settings-font_family') && document.getElementById('settings-font_family').value!='')
	{
		default_style+='font-family:'+document.getElementById('settings-font_family').value+'; ';
	}
	if (document.getElementById('settings-font_size') && document.getElementById('settings-font_size').value!='')
	{
		default_style+='font-size:'+document.getElementById('settings-font_size').value+'; ';
	}
	if (document.getElementById('settings-text_direction') && document.getElementById('settings-text_direction').value!='')
	{
		default_direction=document.getElementById('settings-text_direction').value;
	}
	/*******/

	/********* webmail basaic control ***********/
	if (window['checkWysiwyg'])
	{
		//status=checkWysiwyg();
	}
	/*********************************************/

	/* Detects if designMode is available, and also if browser is IE or Mozilla (excludes Safari) */
	//if (typeof(document.designMode) == "string" && (document.all || document.designMode == "off") && !((navigator.appVersion.indexOf("Mac")!=-1 && navigator.appVersion.indexOf("Mobile")!=-1)) && 1!=1)
	if (typeof(document.designMode) == "string" && (document.all || document.designMode == "off"))
	{
		//alert('DM OK - '+typeof(document.designMode));
		var theTextareas = document.getElementsByTagName("textarea");

		for (var i = 0; i < theTextareas.length; i++)
		{
			var theTextarea = theTextareas[i];

			if (theTextarea.className.classExists("wysiwyg"))
			{
				if (theTextarea.id == "")
				{
					theTextarea.id = theTextarea.name;
				}



				setTimeout("window.generated=new wysiwygEditor('" + theTextarea.id + "')", 500 * (i));
			}
		}
	}
	else
	{
		//document.getElementById('selectType').value="plain";
		//checkWysiwyg();
		//document.getElementById('selectType').style.display="none";
		//alert('DM NOK');
		return false;
	}

	return true;
}




function wysiwygEditor(replacedTextareaID)
{
	var iHTML=document.getElementById('itemHTML').innerHTML;
	var iTEXT=document.getElementById('mainTextarea').innerHTML.replace(/\r\n/g,'\n').replace(/\n/g,'<br />');
	var iTEXTv=document.getElementById('mainTextarea').value;
	document.getElementById(replacedTextareaID).innerHTML=iHTML;

	var self = this;

	this.theTextarea = document.getElementById(replacedTextareaID);
	this.theContainer = document.createElement("div");
	this.theIframe = document.createElement("iframe");
	this.theInput = document.createElement("input");
	this.theExtraInput = document.createElement("input");
	this.IE = document.all?true:false;
	this.Safari = navigator.userAgent.toUpperCase().indexOf('WEBKIT')>-1;
	this.locked = true;
	this.pasteCache = "";
	this.wysiwyg = true;
	window.wysiwygOn=true;

	if (this.theTextarea.id == null)
		this.theTextarea.id = this.theTextarea.name;

	this.theTextarea.style.visibility = "hidden";

	/* Modify DOM objects for editor */
	this.theContainer.id = this.theTextarea.id + "wysiwygContainer";
	this.theContainer.className = "wysiwygContainer";

	this.theToolbar = new wysiwygToolbar(this);

	this.theIframe.id = this.theTextarea.id + "wysiwygIframe";
	this.theIframe.className = "wysiwygIframe";

	this.theInput.type = "hidden";
	this.theInput.id = this.theTextarea.id;
	this.theInput.name = this.theTextarea.name;
	
	if (this.Safari)
	{
		/* The Safari problem */
		//alert('aa');
		//this.theInput.value = this.theTextarea.innerHTML;
		this.theInput.value = this.theTextarea.value;
		//this.theInput.value = iHTML;
	}
	else
	{
		this.theInput.value = this.theTextarea.value;
		//this.theInput.value = this.theTextarea.innerHTML;
		//this.theInput.value=iHTML;
	}
	this.theIframe.setAttribute('frameborder',0);
	this.theIframe.setAttribute('marginwidth',0);
	this.theIframe.setAttribute('marginheight',0);

	/* An extra input to determine if the submitted data is from the normal textarea or from the wysiwygEditor */
	this.theExtraInput.type = "hidden";
	this.theExtraInput.id = this.theTextarea.id + "wysiwygEditor";
	this.theExtraInput.name = this.theTextarea.name + "wysiwygEditor";
	this.theExtraInput.value = "true";

	this.theTextarea.id += "wysiwygTextarea";
	this.theTextarea.name += "wysiwygTextarea";

	this.theContainer.appendChild(this.theToolbar.theList);
	this.theContainer.appendChild(this.theIframe);
	this.theContainer.appendChild(this.theInput);
	this.theContainer.appendChild(this.theExtraInput);
	this.theContainer.style.visibility = "hidden";

	this.theInput.wysiwygEditorObject = this;

	this.theTextarea.parentNode.replaceChild(this.theContainer, this.theTextarea);

	/* Fill editor with old textarea content */
	this.writeDocument(this.theInput.value);

	/* Make editor editable */
	this.initEdit();

	/* Attach onsubmit to parent form */
	this.modifyFormSubmit();

	if (window['WWonload'])
		setTimeout('WWonload();',100);

	return true;
}




/* Clean pasted content */
wysiwygEditor.prototype.cleanPaste = function()
{
	if (wysiwygAutoClean || confirm("Do you wish to clean the HTML source of the content you just pasted?"))
	{
		var matchedHead = "";
		var matchedTail = "";
		var newContent = this.theIframe.contentWindow.document.getElementsByTagName("body")[0].innerHTML;
		var newContentStart = 0;
		var newContentFinish = 0;
		var newSnippet = "";
		var tempNode = document.createElement("div");

		/* Find start of both strings that matches */
		for (newContentStart = 0; newContent.charAt(newContentStart) == this.pasteCache.charAt(newContentStart); newContentStart++)
		{
			matchedHead += this.pasteCache.charAt(newContentStart);
		}

		/* If newContentStart is inside a HTML tag, move to opening brace of tag */
		for (var i = newContentStart; i >= 0; i--)
		{
			if (this.pasteCache.charAt(i) == "<")
			{
				newContentStart = i;
				matchedHead = this.pasteCache.substring(0, newContentStart);

				break;
			}
			else if(this.pasteCache.charAt(i) == ">")
			{
				break;
			}
		}

		newContent = newContent.reverse();
		this.pasteCache = this.pasteCache.reverse();

		/* Find end of both strings that matches */
		for (newContentFinish = 0; newContent.charAt(newContentFinish) == this.pasteCache.charAt(newContentFinish); newContentFinish++)
		{
			matchedTail += this.pasteCache.charAt(newContentFinish);
		}

		/* If newContentFinish is inside a HTML tag, move to closing brace of tag */
		for (var i = newContentFinish; i >= 0; i--)
		{
			if (this.pasteCache.charAt(i) == ">")
			{
				newContentFinish = i;
				matchedTail = this.pasteCache.substring(0, newContentFinish);

				break;
			}
			else if(this.pasteCache.charAt(i) == "<")
			{
				break;
			}
		}

		matchedTail = matchedTail.reverse();

		/* If there's no difference in pasted content */
		if (newContentStart == newContent.length - newContentFinish)
		{
			return false;
		}

		newContent = newContent.reverse();
		newSnippet = newContent.substring(newContentStart, newContent.length - newContentFinish);
		newSnippet = newSnippet.validTags();

		/* Replace opening bold tags with strong */
		newSnippet = newSnippet.replace(/<b(\s+|>)/g, "<strong$1");
		/* Replace closing bold tags with closing strong */
		newSnippet = newSnippet.replace(/<\/b(\s+|>)/g, "</strong$1");

		/* Replace italic tags with em */
		newSnippet = newSnippet.replace(/<i(\s+|>)/g, "<em$1");
		/* Replace closing italic tags with closing em */
		newSnippet = newSnippet.replace(/<\/i(\s+|>)/g, "</em$1");

		/* Strip out unaccepted attributes */
		newSnippet = newSnippet.replace(/<[^>]*>/g, function(match)
			{
				match = match.replace(/ ([^=]+)="[^"]*"/g, function(match2, attributeName)
					{
						if (attributeName == "alt" || attributeName == "href" || attributeName == "src" || attributeName == "title" || attributeName == "style")
						{
							return match2;
						}

						return "";
					});

				return match;
			}
			);

		newSnippet = newSnippet.replace(/&lt;!--/g, "<!--");
		newSnippet = newSnippet.replace(/--&gt;/g, "-->");
		newSnippet = newSnippet.replace(/<!--[^>]*-->/g, "");

		tempNode.innerHTML = newSnippet;

		acceptableChildren(tempNode);

		this.theInput.value = matchedHead + tempNode.innerHTML + matchedTail;

		/* Final cleanout for MS Word cruft */
		this.theInput.value = this.theInput.value.replace(/<\?xml[^>]*>/g, "");
		this.theInput.value = this.theInput.value.replace(/<[^ >]+:[^>]*>/g, "");
		this.theInput.value = this.theInput.value.replace(/<\/[^ >]+:[^>]*>/g, "");

		this.refreshDisplay();

		/* Convert semantics to spans in Mozilla */
		if (!this.IE)
		{
			this.convertSPANs();
		}
	}

	return true;
}




/* Clean the HTML code of the content area */
wysiwygEditor.prototype.cleanSource = function()
{
	var theHTML = "";

	if (this.wysiwyg)
	{
		theHTML = this.theIframe.contentWindow.document.getElementsByTagName("body")[0].innerHTML;
	}
	else
	{
		theHTML = this.theTextarea.value;
	}

	//theHTML = theHTML.validTags();

	/* Remove leading and trailing whitespace */
	//theHTML = theHTML.replace(/^\s+/, "");
	//theHTML = theHTML.replace(/\s+$/, "");

	/* Remove style attribute inside any tag */
	//theHTML = theHTML.replace(/ style="[^"]*"/g, "");

	/* Replace improper BRs */
	//theHTML = theHTML.replace(/<br>/g, "<br />");

	/* Remove BRs right before the end of blocks */
	//theHTML = theHTML.replace(/<br \/>\s*<\/(h1|h2|h3|h4|h5|h6|li|p)/g, "</$1");

	/* Replace improper IMGs */
	//theHTML = theHTML.replace(/(<img [^>]+[^\/])>/g, "$1 />");

	/* Remove empty tags */
	//theHTML = theHTML.replace(/(<[^\/]>|<[^\/][^>]*[^\/]>)\s*<\/[^>]*>/g, "");

	if (theHTML=='<br />') {theHTML='';}

	if (this.wysiwyg)
	{
		this.theIframe.contentWindow.document.getElementsByTagName("body")[0].innerHTML = theHTML;
	}
	else
	{
		this.theTextarea.value = theHTML;
	}

	this.theInput.value = theHTML;
	return true;
}




wysiwygEditor.prototype.convertSPANs = function(theSwitch)
{
	if (theSwitch)
	{

		/* Replace styled spans with their semantic equivalent */
		var theSPANs = this.theIframe.contentWindow.document.getElementsByTagName("span");

		while(theSPANs.length > 0)
		{
			var theChildren = new Array();
			var theReplacementElement = null;
			var theParentElement = null;

			for (var j = 0; j < theSPANs[0].childNodes.length; j++)
				theChildren.push(theSPANs[0].childNodes[j].cloneNode(true));

			/* Detect type of span style */
            var bold,italic,underline,
				inhs = '',inhe = '',main = '';
			if (theSPANs[0].getAttribute("style")){
				bold = theSPANs[0].getAttribute("style").indexOf('bold');
				italic = theSPANs[0].getAttribute("style").indexOf('italic');
				underline = theSPANs[0].getAttribute("style").indexOf('underline');
			}

			if (bold>=0)
			{
				if (main=='') {main='strong';}
				else
				{
					inhs='<strong>'+inhs;
					inhe=inhe+'</strong>';
				}
			}
			if (italic>=0)
			{
				if (main=='') {main='em';}
				else
				{
					inhs='<em>'+inhs;
					inhe=inhe+'</em>';
				}
			}
			if (underline>=0)
			{
				if (main=='') {main='u';}
				else
				{
					inhs='<u>'+inhs;
					inhe=inhe+'</u>';
				}
			}

			if (main!='')
			{
				theReplacementElement = this.theIframe.contentWindow.document.createElement(main);
				theReplacementElement.innerHTML=inhs+theSPANs[0].innerHTML+inhe;
				//theParentElement = theReplacementElement;
			}
			else
			{
				replaceNodeWithChildren(theSPANs[0]);
			}

			if (theReplacementElement != null)
			{
				theSPANs[0].parentNode.replaceChild(theReplacementElement, theSPANs[0]);
				/*
				for (var j = 0; j < theChildren.length; j++)
				{
					theParentElement.appendChild(theChildren[j]);
				}

				theSPANs[0].parentNode.replaceChild(theReplacementElement, theSPANs[0]);
				*/
			}

			theSPANs = this.theIframe.contentWindow.document.getElementsByTagName("span");
		}
	}
	else
	{
		/* Replace em and strong tags with styled spans */
		var theEMs = this.theIframe.contentWindow.document.getElementsByTagName("em");

		while(theEMs.length > 0)
		{
			var theChildren = new Array();
			var theSpan = this.theIframe.contentWindow.document.createElement("span");

			theSpan.setAttribute("style", "font-style: italic;");

			for (var j = 0; j < theEMs[0].childNodes.length; j++)
			{
				theChildren.push(theEMs[0].childNodes[j].cloneNode(true));
			}

			for (var j = 0; j < theChildren.length; j++)
			{
				theSpan.appendChild(theChildren[j]);
			}

			theEMs[0].parentNode.replaceChild(theSpan, theEMs[0]);
			theEMs = this.theIframe.contentWindow.document.getElementsByTagName("em");
		}

		var theSTRONGs = this.theIframe.contentWindow.document.getElementsByTagName("strong");

		while(theSTRONGs.length > 0)
		{
			var theChildren = new Array();
			var theSpan = this.theIframe.contentWindow.document.createElement("span");

			theSpan.setAttribute("style", "font-weight: bold;");

			for (var j = 0; j < theSTRONGs[0].childNodes.length; j++)
			{
				theChildren.push(theSTRONGs[0].childNodes[j].cloneNode(true));
			}

			for (var j = 0; j < theChildren.length; j++)
			{
				theSpan.appendChild(theChildren[j]);
			}

			theSTRONGs[0].parentNode.replaceChild(theSpan, theSTRONGs[0]);
			theSTRONGs = this.theIframe.contentWindow.document.getElementsByTagName("strong");
		}

		var theUs = this.theIframe.contentWindow.document.getElementsByTagName("u");

		while(theUs.length > 0)
		{
			var theChildren = new Array();
			var theSpan = this.theIframe.contentWindow.document.createElement("span");

			theSpan.setAttribute("style", "text-decoration: underline;");

			for (var j = 0; j < theUs[0].childNodes.length; j++)
			{
				theChildren.push(theUs[0].childNodes[j].cloneNode(true));
			}

			for (var j = 0; j < theChildren.length; j++)
			{
				theSpan.appendChild(theChildren[j]);
			}

			theUs[0].parentNode.replaceChild(theSpan, theUs[0]);
			theUs = this.theIframe.contentWindow.document.getElementsByTagName("u");
		}
	}

	return true;
}




/* Check for pasted content */
wysiwygEditor.prototype.detectPaste = function(e)
{
	var keyPressed = null;
	var theEvent = null;

	if (e)
	{
		theEvent = e;
	}
	else
	{
		theEvent = event;
	}

	if (theEvent.ctrlKey && theEvent.keyCode == 86 && this.wysiwyg)
	{
		var self = this;

		this.pasteCache = this.theIframe.contentWindow.document.getElementsByTagName("body")[0].innerHTML;

		/* Because Mozilla can't access the clipboard directly, must rely on timeout to check pasted differences in main content */
		setTimeout(function(){self.cleanPaste(); return true;}, 100);
	}

	return true;
}




/* Turn on document editing */
wysiwygEditor.prototype.initEdit = function()
{
	window.activeWysiwyg=this;
	var self = this;

	try
	{
		this.theIframe.contentWindow.document.designMode = "on";
	}
	catch (e)
	{
		/* setTimeout needed to counteract Mozilla bug whereby you can't immediately change designMode on newly created iframes */
		setTimeout(function(){self.initEdit()}, 250);

		return false;
	}

	if (!this.IE)
	{
		this.convertSPANs(false);
	}

	this.theContainer.style.visibility = "visible";
	this.theTextarea.style.visibility = "visible";

	/* Mozilla event capturing */
	if (typeof document.addEventListener == "function")
	{
		this.theIframe.contentWindow.document.addEventListener("mouseup", function(){try{ wysiwygToolbarCheckState(self); }catch(e){} return true;}, false);
		this.theIframe.contentWindow.document.addEventListener("keyup", function(){try{
			if (self.theToolbar.__skipUp)
				self.theToolbar.__skipUp = false;
			else
				wysiwygToolbarCheckState(self);
		}
		catch(e){} return true;}, false);

		//disable mozilla UI shortcuts
		this.theIframe.contentWindow.document.addEventListener("keydown", function(e){
            var e = e || win.event;
			if (e.ctrlKey && !e.altKey && !window.opera){
				var ret = false;
				switch(e.keyCode){
				case 66:	//B
					var theButton = document.getElementById(self.theToolbar.theList.id + "ButtonBold");
					if (theButton != null && (theButton = theButton.getElementsByTagName('a')[0])){
						theButton.onclick();
						ret = true;
					}
					break;

				case 85:	//U
					var theButton = document.getElementById(self.theToolbar.theList.id + "ButtonUnderline");
					if (theButton != null && (theButton = theButton.getElementsByTagName('a')[0])){
						theButton.onclick();
						ret = true;
					}
					break;

				case 73:	//I
					var theButton = document.getElementById(self.theToolbar.theList.id + "ButtonItalic");
					if (theButton != null && (theButton = theButton.getElementsByTagName('a')[0])){
						theButton.onclick(null,true);
						ret = true;
					}
					break;

				}
			    if (ret){
                    self.theToolbar.__skipUp = true;

					e.cancelBubble = true;
					if (e.preventDefault) e.preventDefault();
					if (e.stopPropagation) e.stopPropagation();
					return false;
				}
			}
		}, false);
	}
	/* IE event capturing */
	else
	{
		this.theIframe.contentWindow.document.attachEvent("onmouseup", function(){ try{ wysiwygToolbarCheckState(self); }catch(e){} return true;});
		this.theIframe.contentWindow.document.attachEvent("onkeyup", function(){ try{ wysiwygToolbarCheckState(self); }catch(e){} return true;});
		//this.theIframe.contentWindow.document.attachEvent("onkeydown", function(e){self.detectPaste(e); return true;}, false);
	}

	this.locked = false;

	//self.theToolbar.setState("SelectFont",'Arial,Helvetica');
	//self.theToolbar.setState("SelectSize", 4);

	return true;
}




/* Add elements to a paragraph and inserts the paragraph before a given element in the body */
wysiwygEditor.prototype.insertNewParagraph = function(elementArray, succeedingElement)
{

	var theBody = this.theIframe.contentWindow.document.getElementsByTagName("body")[0];
	var theParagraph = this.theIframe.contentWindow.document.createElement("p");

	for (var i = 0; i < elementArray.length; i++)
	{
		theParagraph.appendChild(elementArray[i]);
	}

	if (typeof(succeedingElement) != "undefined")
	{
		theBody.insertBefore(theParagraph, succeedingElement);
	}
	else
	{
		theBody.appendChild(theParagraph);
	}

	return true;
}




/* Add submit listener to parent form */
wysiwygEditor.prototype.modifyFormSubmit = function()
{
	var self = this;
	var theForm = this.theContainer.parentNode;
	var oldOnsubmit = null;

	/* Find the parent form element */
	while (theForm.nodeName.toLowerCase() != "form")
	{
		theForm = theForm.parentNode;
	}

	/* Add onsubmit without overwriting existing function calls */
	oldOnsubmit = theForm.onsubmit;
	theForm.onsubmit = function()
	{
		window.submittingWW=true;
		self.updatewysiwygInput();
		//document.getElementById('html').value = htmlspecialchars_decode(self.theInput.value);
		document.getElementById('html').value = self.theInput.value;
	
		
		if(window.wysiwygOn)
		{
			// clean up
			var ready=document.getElementById('html').value;
			ready=ready.replace(/<p/gi,'<div');
			ready=ready.replace(/<\/p>/gi,'</div>');
			ready=ready.replace(/<br>/gi,'<br />');
			//add default font
			if (ready.search(/<\/body>/)==-1)
			{
				ready="<div dir=\""+default_direction+"\" style=\""+default_style+"\">"+ready+"</div>";
			}
			else
			{
				ready=ready.replace(/<body([^.>]*)>/gi,"<body$1><div dir=\""+default_direction+"\" style=\""+default_style+"\">");
				ready=ready.replace(/<\/body>/gi,"</div></body>");
			}
			//alert(ready);
			document.getElementById('html').value=ready;
		}
	
		return oldOnsubmit?oldOnsubmit():true;
	}

	return true;
}




/* Format the HTML with paragraphs. Any parentless text is enclosed in a paragraph, double breaks are paragraph markers */
wysiwygEditor.prototype.paragraphise = function()
{
	if (wysiwygInsertParagraphs && this.wysiwyg)
	{
		var theBody = this.theIframe.contentWindow.document.getElementsByTagName("body")[0];

		/* Remove all text nodes containing just whitespace */
		for (var i = 0; i < theBody.childNodes.length; i++)
		{
			if (theBody.childNodes[i].nodeName.toLowerCase() == "#text" &&
				theBody.childNodes[i].data.search(/^\s*$/) != -1)
			{
				theBody.removeChild(theBody.childNodes[i]);

				i--;
			}
		}

		var removedElements = new Array();

		for (var i = 0; i < theBody.childNodes.length; i++)
		{
			if (theBody.childNodes[i].nodeName.isInlineName())
			{
				removedElements.push(theBody.childNodes[i].cloneNode(true));

				theBody.removeChild(theBody.childNodes[i]);

				i--;
			}
			else if (theBody.childNodes[i].nodeName.toLowerCase() == "br")
			{
				if (i + 1 < theBody.childNodes.length)
				{
					/* If the current break tag is followed by another break tag */
					if (theBody.childNodes[i + 1].nodeName.toLowerCase() == "br")
					{
						/* Remove consecutive break tags */
						while (i < theBody.childNodes.length && theBody.childNodes[i].nodeName.toLowerCase() == "br")
						{
							theBody.removeChild(theBody.childNodes[i]);
						}

						if (removedElements.length > 0)
						{
							this.insertNewParagraph(removedElements, theBody.childNodes[i]);

							removedElements = new Array();
						}
					}
					/* If the break tag appears before a block element */
					else if (!theBody.childNodes[i + 1].nodeName.isInlineName())
					{
						theBody.removeChild(theBody.childNodes[i]);
					}
					else if (removedElements.length > 0)
					{
						removedElements.push(theBody.childNodes[i].cloneNode(true));

						theBody.removeChild(theBody.childNodes[i]);
					}
					else
					{
						theBody.removeChild(theBody.childNodes[i]);
					}

					i--;
				}
				else
				{
					theBody.removeChild(theBody.childNodes[i]);
				}
			}
			else if (removedElements.length > 0)
			{
				this.insertNewParagraph(removedElements, theBody.childNodes[i]);

				removedElements = new Array();
			}
		}

		if (removedElements.length > 0)
		{
			this.insertNewParagraph(removedElements);
		}
	}

	return true;
}


/* Update hidden input to reflect editor contents, for submission */
wysiwygEditor.prototype.refreshDisplay = function()
{
	if (this.wysiwyg)
	{
		this.theIframe.contentWindow.document.getElementsByTagName("body")[0].innerHTML	= this.theInput.value;
	}
	else
	{
		this.theTextarea.value = this.theInput.value;
	}

	return true;
}

/* Switch between WYSIWYG and HTML source */
wysiwygEditor.prototype.switchMode = function()
{
	if (!this.locked)
	{
		this.locked = true;

		// Switch to WYSIWYG
		if (this.wysiwyg)
		{
			this.updatewysiwygInput();

			/**
			 *	REPLACE FUNCTION SHOULD BE EXTENDED TO REPLACE BLOCK TAGS WITH CRLF !!!!!!!!!!!!!!!!!!!!!!!!
			 **/

			//remove STYLE tag
			var elm = document.createElement('div'),elms;
            elm.innerHTML = this.theInput.value;

            elms = elm.getElementsByTagName('style');
            for (var i = elms.length-1;i>=0;i--)
				elms[i].parentNode.removeChild(elms[i]);

            this.theInput.value = elm.innerHTML;
			if (this.theInput.value=='<br>') {this.theInput.value='';}
			this.theTextarea.value = htmlspecialchars_decode(br2nl(this.theInput.value).replace(/<[\/]?([a-zA-Z0-9]+)[^>^<]*>/gm,''),'HTML_ENTITIES');
			this.theContainer.replaceChild(this.theTextarea, this.theIframe);
			this.theToolbar.disable();
			this.wysiwyg = false;
			this.locked = false;
			window.wysiwygOn=false;
		}
		// Switch to HTML source
		else
		{
			this.updatewysiwygInput();

			this.theContainer.replaceChild(this.theIframe, this.theTextarea);
			//if ()
			var val=this.theInput.value;
			val=nl2br(val);
			this.writeDocument(val);
			this.theToolbar.enable();
			this.initEdit();
			this.wysiwyg = true;
			window.wysiwygOn=true;
		}
	}

	return true;
}



function htmlspecialchars (string, quote_style) {
    // Convert special characters to HTML entities
    //
    // version: 907.503
    // discuss at: http://phpjs.org/functions/htmlspecialchars
    // +   original by: Mirek Slugen
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Nathan
    // +   bugfixed by: Arno
    // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +    bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +      input by: Ratheous
    // -    depends on: get_html_translation_table
    // *     example 1: htmlspecialchars("<a href='test'>Test</a>", 'ENT_QUOTES');
    // *     returns 1: '&lt;a href=&#039;test&#039;&gt;Test&lt;/a&gt;'

    var hash_map = {}, symbol = '', tmp_str = '', entity = '';
    tmp_str = string.toString();

    if (false === (hash_map = this.get_html_translation_table('HTML_SPECIALCHARS', quote_style))) {
        return false;
    }

    hash_map["'"] = '&#039;';
    for (symbol in hash_map) {
        entity = hash_map[symbol];
        tmp_str = tmp_str.split(symbol).join(entity);
    }

    return tmp_str;
}

function htmlspecialchars_decode(string, quote_style) {
    // Convert special HTML entities back to characters
    //
    // version: 907.503
    // discuss at: http://phpjs.org/functions/htmlspecialchars_decode
    // +   original by: Mirek Slugen
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Mateusz "loonquawl" Zalega
    // +      input by: ReverseSyntax
    // +      input by: Slawomir Kaniecki
    // +      input by: Scott Cariss
    // +      input by: Francois
    // +   bugfixed by: Onno Marsman
    // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +    bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +      input by: Ratheous
    // -    depends on: get_html_translation_table
    // *     example 1: htmlspecialchars_decode("<p>this -&gt; &quot;</p>", 'ENT_NOQUOTES');
    // *     returns 1: '<p>this -> &quot;</p>'

    var hash_map = {}, symbol = '', tmp_str = '', entity = '';
    tmp_str = string.toString();

    if (false === (hash_map = this.get_html_translation_table('HTML_SPECIALCHARS', quote_style))) {
        return false;
    }

    for (symbol in hash_map) {
        entity = hash_map[symbol];
        tmp_str = tmp_str.split(entity).join(symbol);
    }
    tmp_str = tmp_str.split('&#039;').join("'");

    return tmp_str;
}

function get_html_translation_table(table, quote_style) {
    // Returns the internal translation table used by htmlspecialchars and htmlentities
    //
    // version: 907.503
    // discuss at: http://phpjs.org/functions/get_html_translation_table
    // +   original by: Philip Peterson
    // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: noname
    // +   bugfixed by: Alex
    // +   bugfixed by: Marco
    // +   bugfixed by: madipta
    // +   improved by: KELAN
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +      input by: Frank Forte
    // +   bugfixed by: T.Wild
    // +      input by: Ratheous
    // %          note: It has been decided that we're not going to add global
    // %          note: dependencies to php.js, meaning the constants are not
    // %          note: real constants, but strings instead. Integers are also supported if someone
    // %          note: chooses to create the constants themselves.
    // *     example 1: get_html_translation_table('HTML_SPECIALCHARS');
    // *     returns 1: {'"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;'}

    var entities = {}, hash_map = {}, decimal = 0, symbol = '';
    var constMappingTable = {}, constMappingQuoteStyle = {};
    var useTable = {}, useQuoteStyle = {};

    // Translate arguments
    constMappingTable[0]      = 'HTML_SPECIALCHARS';
    constMappingTable[1]      = 'HTML_ENTITIES';
    constMappingQuoteStyle[0] = 'ENT_NOQUOTES';
    constMappingQuoteStyle[2] = 'ENT_COMPAT';
    constMappingQuoteStyle[3] = 'ENT_QUOTES';

    useTable       = !isNaN(table) ? constMappingTable[table] : table ? table.toUpperCase() : 'HTML_SPECIALCHARS';
    useQuoteStyle = !isNaN(quote_style) ? constMappingQuoteStyle[quote_style] : quote_style ? quote_style.toUpperCase() : 'ENT_COMPAT';

    if (useTable !== 'HTML_SPECIALCHARS' && useTable !== 'HTML_ENTITIES')
        throw new Error("Table: "+useTable+' not supported');

    entities['38'] = '&amp;';
    if (useTable === 'HTML_ENTITIES') {
        entities['160'] = '&nbsp;';
        entities['161'] = '&iexcl;';
        entities['162'] = '&cent;';
        entities['163'] = '&pound;';
        entities['164'] = '&curren;';
        entities['165'] = '&yen;';
        entities['166'] = '&brvbar;';
        entities['167'] = '&sect;';
        entities['168'] = '&uml;';
        entities['169'] = '&copy;';
        entities['170'] = '&ordf;';
        entities['171'] = '&laquo;';
        entities['172'] = '&not;';
        entities['173'] = '&shy;';
        entities['174'] = '&reg;';
        entities['175'] = '&macr;';
        entities['176'] = '&deg;';
        entities['177'] = '&plusmn;';
        entities['178'] = '&sup2;';
        entities['179'] = '&sup3;';
        entities['180'] = '&acute;';
        entities['181'] = '&micro;';
        entities['182'] = '&para;';
        entities['183'] = '&middot;';
        entities['184'] = '&cedil;';
        entities['185'] = '&sup1;';
        entities['186'] = '&ordm;';
        entities['187'] = '&raquo;';
        entities['188'] = '&frac14;';
        entities['189'] = '&frac12;';
        entities['190'] = '&frac34;';
        entities['191'] = '&iquest;';
        entities['192'] = '&Agrave;';
        entities['193'] = '&Aacute;';
        entities['194'] = '&Acirc;';
        entities['195'] = '&Atilde;';
        entities['196'] = '&Auml;';
        entities['197'] = '&Aring;';
        entities['198'] = '&AElig;';
        entities['199'] = '&Ccedil;';
        entities['200'] = '&Egrave;';
        entities['201'] = '&Eacute;';
        entities['202'] = '&Ecirc;';
        entities['203'] = '&Euml;';
        entities['204'] = '&Igrave;';
        entities['205'] = '&Iacute;';
        entities['206'] = '&Icirc;';
        entities['207'] = '&Iuml;';
        entities['208'] = '&ETH;';
        entities['209'] = '&Ntilde;';
        entities['210'] = '&Ograve;';
        entities['211'] = '&Oacute;';
        entities['212'] = '&Ocirc;';
        entities['213'] = '&Otilde;';
        entities['214'] = '&Ouml;';
        entities['215'] = '&times;';
        entities['216'] = '&Oslash;';
        entities['217'] = '&Ugrave;';
        entities['218'] = '&Uacute;';
        entities['219'] = '&Ucirc;';
        entities['220'] = '&Uuml;';
        entities['221'] = '&Yacute;';
        entities['222'] = '&THORN;';
        entities['223'] = '&szlig;';
        entities['224'] = '&agrave;';
        entities['225'] = '&aacute;';
        entities['226'] = '&acirc;';
        entities['227'] = '&atilde;';
        entities['228'] = '&auml;';
        entities['229'] = '&aring;';
        entities['230'] = '&aelig;';
        entities['231'] = '&ccedil;';
        entities['232'] = '&egrave;';
        entities['233'] = '&eacute;';
        entities['234'] = '&ecirc;';
        entities['235'] = '&euml;';
        entities['236'] = '&igrave;';
        entities['237'] = '&iacute;';
        entities['238'] = '&icirc;';
        entities['239'] = '&iuml;';
        entities['240'] = '&eth;';
        entities['241'] = '&ntilde;';
        entities['242'] = '&ograve;';
        entities['243'] = '&oacute;';
        entities['244'] = '&ocirc;';
        entities['245'] = '&otilde;';
        entities['246'] = '&ouml;';
        entities['247'] = '&divide;';
        entities['248'] = '&oslash;';
        entities['249'] = '&ugrave;';
        entities['250'] = '&uacute;';
        entities['251'] = '&ucirc;';
        entities['252'] = '&uuml;';
        entities['253'] = '&yacute;';
        entities['254'] = '&thorn;';
        entities['255'] = '&yuml;';
    }
	else
	if (useTable === 'HTML_SPECIALCHARS')
	    entities['160'] = '&nbsp;';

    if (useQuoteStyle !== 'ENT_NOQUOTES') {
        //entities['34'] = '&quot;';
    }
    if (useQuoteStyle === 'ENT_QUOTES') {
        entities['39'] = '&#39;';
    }
    entities['60'] = '&lt;';
    entities['62'] = '&gt;';


    // ascii decimals to real symbols
    for (decimal in entities) {
        symbol = String.fromCharCode(decimal);
        hash_map[symbol] = entities[decimal];
    }

    return hash_map;
}

/*
function htmlspecialchars (str) {
	var div = document.createElement('div');
		div.appendChild(document.createTextNode(str));

	var out = div.innerHTML;
    //Safari 2 & KHTML fix
	if (out.indexOf('>')>-1)
		return out.replace(/>/gm,'&gt;');
	else
		return out;
};

function htmlspecialchars_decode (str) {
	if (str.indexOf('&')<0) return str.toString();

	var div = document.createElement('div');
		div.innerHTML = str.toString();

 	return div.childNodes[0].nodeValue;
};
*/

function trim (str, charlist) {
    // Strips whitespace from the beginning and end of a string
    //
    // version: 909.322
    // discuss at: http://phpjs.org/functions/trim    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: mdsjack (http://www.mdsjack.bo.it)
    // +   improved by: Alexander Ermolaev (http://snippets.dzone.com/user/AlexanderErmolaev)
    // +      input by: Erkekjetter
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)    // +      input by: DxGx
    // +   improved by: Steven Levithan (http://blog.stevenlevithan.com)
    // +    tweaked by: Jack
    // +   bugfixed by: Onno Marsman
    // *     example 1: trim('    Kevin van Zonneveld    ');    // *     returns 1: 'Kevin van Zonneveld'
    // *     example 2: trim('Hello World', 'Hdle');
    // *     returns 2: 'o Wor'
    // *     example 3: trim(16, 1);
    // *     returns 3: 6    var whitespace, l = 0, i = 0;
    str += '';

    if (!charlist) {
        whitespace = " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
    } else {
        // preg_quote custom list
        charlist += '';
        whitespace = charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');    }

    l = str.length;
    for (i = 0; i < l; i++) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {            str = str.substring(i);
            break;
        }
    }
        l = str.length;
    for (i = l - 1; i >= 0; i--) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(0, i + 1);
            break;        }
    }

    return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
}

/* Update hidden input to reflect editor contents, for submission */
wysiwygEditor.prototype.updatewysiwygInput = function()
{
	if (this.wysiwyg)
	{
		// Convert spans to semantics in Mozilla
		if (this.IE){
			var xtmp = this.theIframe.contentWindow.document.getElementsByTagName("body")[0];
			var arr = xtmp.getElementsByTagName('P');
			for(var i = arr.length-1; i>-1;i--)
				if (!arr[i].hasChildNodes())
					arr[i].parentNode.replaceChild(this.theIframe.contentWindow.document.createElement('BR'),arr[i]);
		}
		else{

			//alert(this.theIframe.contentWindow.document.getElementsByTagName("body")[0].innerHTML);

			//seventh size fix
			var fixed=this.theIframe.contentWindow.document.getElementsByTagName("body")[0].innerHTML.replace(/-webkit-xxx-large/g,'48px');
			if (trim(fixed)=='') {fixed='';}
			
			this.theIframe.contentWindow.document.getElementsByTagName("body")[0].innerHTML=fixed;
			//alert(fixed);

			//this.convertSPANs(true);

			if (this.Safari){
				var xtmp = this.theIframe.contentWindow.document.getElementsByTagName("body")[0];
				var arr = xtmp.getElementsByTagName('BR');
				for(var i = arr.length-1; i>-1;i--)
					if (arr[i].parentNode.tagName == 'DIV' && arr[i].parentNode.childNodes.length == 1)
						arr[i].parentNode.parentNode.replaceChild(arr[i],arr[i].parentNode);
			}
		}

		this.paragraphise();
		this.cleanSource();
	}
	else
	{
		if (window.submittingWW)
		{
			this.theInput.value = this.theTextarea.value;//this.theTextarea.innerHTML;
		}
		else
		{
			this.theInput.value = htmlspecialchars(this.theTextarea.value);//this.theTextarea.innerHTML;
		}
		//alert(this.theInput.value);
	}
	return true;
}

wysiwygEditor.prototype.writeDocument = function(documentContent)
{

	var documentTemplate = '<html><head>INSERT:STYLESHEET:END<style type="text/css">p{margin:0;padding:0;}</style></head><body id="iframeBody" style="'+default_style+'" dir="'+default_direction+'"" >INSERT:CONTENT:END</body></html>';


	if (typeof document.all != "undefined")
	{
		documentTemplate = documentTemplate.replace(/INSERT:STYLESHEET:END/, '<link rel="stylesheet" type="text/css" href="' + wysiwygStylesheet + '"></link>');
	}

	else
	{
		documentTemplate = documentTemplate.replace(/INSERT:STYLESHEET:END/, "");
	}

	documentTemplate = documentTemplate.replace(/INSERT:CONTENT:END/, documentContent);

	this.theIframe.contentWindow.document.open();
	this.theIframe.contentWindow.document.write(documentTemplate);
	this.theIframe.contentWindow.document.close();


	if (typeof document.all == "undefined")
	{
		var stylesheet = this.theIframe.contentWindow.document.createElement("link");
		stylesheet.setAttribute("rel", "stylesheet");
		stylesheet.setAttribute("type", "text/css");
		stylesheet.setAttribute("href", wysiwygStylesheet);
		this.theIframe.contentWindow.document.getElementsByTagName("head")[0].appendChild(stylesheet);
	}
	/*
	var stylep = this.theIframe.contentWindow.document.createElement("style");
	stylep.setAttribute("type", "text/css");
	this.theIframe.contentWindow.document.getElementsByTagName("head")[0].appendChild(stylep);
	stylep.innerHTML='p{margin:0;padding:0;}';
*/
	return true;
}




/* Toolbar items */
function wysiwygToolbar(theEditor)
{
	var self = this;

	this.wysiwygEditorObject = theEditor;

	/* Create toolbar ul element */
	this.theList = document.createElement("ul");
	this.theList.id = this.wysiwygEditorObject.theInput.id + "wysiwygToolbar";
	this.theList.className = "wysiwygToolbar";
	this.theList.wysiwygToolbarObject = this;

	/* Create toolbar items */
	for (var i = 0; i < wysiwygToolbarItems.length; i++)
	{
		switch (wysiwygToolbarItems[i])
		{
			case "bold":
				this.addButton(this.theList.id + "ButtonBold", "wysiwygButtonBold", document.getElementById('lang-mail_compose-bold').value, "bold");
				break;

			case "italic":
				this.addButton(this.theList.id + "ButtonItalic", "wysiwygButtonItalic", document.getElementById('lang-mail_compose-italic').value, "italic");
				break;

			case "underline":
				this.addButton(this.theList.id + "ButtonUnderline", "wysiwygButtonUnderline", document.getElementById('lang-mail_compose-underline').value, "underline");
				break;

			case "hyperlink":
				this.addButton(this.theList.id + "ButtonLink", "wysiwygButtonLink", document.getElementById('lang-mail_compose-hyperlink').value, "link");
				break;

			case "unorderedlist":
				this.addButton(this.theList.id + "ButtonUnordered", "wysiwygButtonUnordered", document.getElementById('lang-mail_compose-unorderedlist').value, "insertunorderedlist");
				break;

			case "orderedlist":
				this.addButton(this.theList.id + "ButtonOrdered", "wysiwygButtonOrdered", document.getElementById('lang-mail_compose-orderedlist').value, "insertorderedlist");
				break;

			case "image":
				this.addButton(this.theList.id + "ButtonImage", "wysiwygButtonImage", document.getElementById('lang-mail_compose-image').value, "image");
				break;

			case "htmlsource":
				this.addButton(this.theList.id + "ButtonHTML", "wysiwygButtonHTML", document.getElementById('lang-mail_compose-htmlsource').value, "html");
				break;

			case "left":
				this.addButton(this.theList.id + "ButtonLeft", "wysiwygButtonLeft", document.getElementById('lang-mail_compose-left').value, "justifyleft");
				break;

			case "center":
				this.addButton(this.theList.id + "ButtonCenter", "wysiwygButtonCenter", document.getElementById('lang-mail_compose-center').value, "justifycenter");
				break;

			case "indent":
				this.addButton(this.theList.id + "ButtonIndent", "wysiwygButtonIndent", document.getElementById('lang-mail_compose-indent').value, "indent");
				break;

			case "outdent":
				this.addButton(this.theList.id + "ButtonOutdent", "wysiwygButtonOutdent", document.getElementById('lang-mail_compose-outdent').value, "outdent");
				break;

			case "right":
				this.addButton(this.theList.id + "ButtonRight", "wysiwygButtonRight", document.getElementById('lang-mail_compose-right').value, "justifyright");
				break;

			case "justify":
				this.addButton(this.theList.id + "ButtonJustify", "wysiwygButtonJustify", document.getElementById('lang-mail_compose-justify').value, "justifyfull");
				break;

			case "blockformat":
				this.addSelect(this.theList.id + "SelectBlock", "wysiwygSelectBlock", wysiwygSelectBlockOptions, "formatblock");
	   			break;

			case "fontformat":
				this.addSelect(this.theList.id + "SelectFont", "wysiwygSelectFont", wysiwygSelectFontOptions, "fontname");
				break;

			case "fontsize":
				this.addSelect(this.theList.id + "SelectSize", "wysiwygSelectSize", wysiwygFontSizeOptions, "fontsize");
				break;

		}
	}

	return true;
}





/* Add button to toolbar */
wysiwygToolbar.prototype.addButton = function(theID, theClass, theLabel, theAction)
{
	var menuItem = document.createElement("li");
	var theLink = document.createElement("a");
	var theText = document.createTextNode(theLabel);

	menuItem.id = theID;
	menuItem.className = "wysiwygEditButton";

	theLink.href = "#";
	theLink.title = theLabel;
	theLink.className = theClass;
	theLink.action = theAction;
	theLink.onclick = wysiwygToolbarAction;
	theLink.onmouseover = wysiwygToolbarMouseover;
	theLink.appendChild(theText);
	if (theAction=='html') {theLink.id=theID+'_html';}

	menuItem.appendChild(theLink);
	this.theList.appendChild(menuItem);

	return true;
}




/* Add select box to toolbar. theContentArray is an array of string pairs (option value, option label) */
wysiwygToolbar.prototype.addSelect = function(theID, theClass, theContentArray, theAction)
{
	var menuItem = document.createElement("li");
	var theSelect = document.createElement("select");

	menuItem.className = "wysiwygEditSelect";

	theSelect.id = theID;
	theSelect.name = theID;
	theSelect.className = theClass;
	theSelect.action = theAction;
	theSelect.onchange = wysiwygToolbarAction;

	for (var i = 0; i < theContentArray.length; i += 2)
	{
		var theOption = document.createElement("option");
		var theText = document.createTextNode(theContentArray[i + 1]);

		theOption.value = theContentArray[i];

		theOption.appendChild(theText);
		theSelect.appendChild(theOption);
	}

	menuItem.appendChild(theSelect);
	this.theList.appendChild(menuItem);

	return true;
}




/* Turn off toolbar items */
wysiwygToolbar.prototype.disable = function()
{
	/* Change class to disable buttons using CSS */
	this.theList.className += " wysiwygSource";

	/* Loop through lis */
	for (var i = 0; i < this.theList.childNodes.length; i++)
	{
		var theChild = this.theList.childNodes[i];

		if (theChild.nodeName.toLowerCase() == "li" && theChild.className == "wysiwygEditSelect")
		{
			/* Loop through li children to find select */
			for (j = 0; j < theChild.childNodes.length; j++)
			{
				if (theChild.childNodes[j].nodeName.toLowerCase() == "select")
				{
					theChild.childNodes[j].disabled = "disabled";

					break;
				}
			}
		}
	}

	return true;
}




/* Turn on toolbar items */
wysiwygToolbar.prototype.enable = function()
{
	/* Change class to enable buttons using CSS */
	this.theList.className = this.theList.className.replace(/ wysiwygSource/, "");

	/* Loop through lis */
	for (var i = 0; i < this.theList.childNodes.length; i++)
	{
		var theChild = this.theList.childNodes[i];

		if (theChild.nodeName.toLowerCase() == "li" && theChild.className == "wysiwygEditSelect")
		{
			/* Loop through li children to find select */
			for (j = 0; j < theChild.childNodes.length; j++)
			{
				if (theChild.childNodes[j].nodeName.toLowerCase() == "select")
				{
					theChild.childNodes[j].disabled = "";

					break;
				}
			}
		}
	}

	return true;
}

function turnWon(stat)
{
	if ((stat=='off') || (stat=='on'))
	{
		if (!window.wwstat)
		{
			window.wwstat=true;
		}
		else
		{
			window.wwstat=false;
		}
		document.getElementById('wysiwygToolbarButtonHTML_html').onclick();
	}
}

/* Change the status of the selected toolbar item */
wysiwygToolbar.prototype.setState = function(theState, theStatus)
{
	if (theState == "SelectBlock" || theState == "SelectFont" || theState == "SelectSize")
	{
		var theSelect = document.getElementById(this.theList.id + theState);
		if (theSelect != null)
		{
			theSelect.value = "";
			theSelect.value = theStatus;
		}
	}
	else
	{
		var theButton = document.getElementById(this.theList.id + "Button" + theState);

		if (theButton != null)
			if (theStatus == "on")
				theButton.className = theButton.className.addClass("on");
			else
				theButton.className = theButton.className.removeClass("on");
	}

	return true;
}





/* Action taken when toolbar item activated */
function wysiwygToolbarAction()
{
	var theToolbar = this.parentNode.parentNode.wysiwygToolbarObject;
	var thewysiwygEditor = theToolbar.wysiwygEditorObject;
	var theIframe = thewysiwygEditor.theIframe;
	var theSelection = "";

	/* If somehow a button other than "HTML source" is clicked while viewing HTML source, ignore click */
	if (!thewysiwygEditor.wysiwyg && this.action != "html")
		return false;

	switch (this.action)
	{
		case "formatblock":
            if (this.value)
				theIframe.contentWindow.document.execCommand(this.action, false, this.value);
			else
				theIframe.contentWindow.document.execCommand('removeFormat', false);

			thewysiwygEditor.theToolbar.setState("SelectBlock", this.value);

			break;

		case "fontname":
		case "fontsize":
			theIframe.contentWindow.document.execCommand(this.action, false, this.value);
			thewysiwygEditor.theToolbar.setState(this.action=='fontname'?"SelectFont":"SelectSize", this.value);

			break;

		case "html":
			thewysiwygEditor.switchMode();

			break;

		case "link":
			if (this.parentNode.className.classExists("on"))
			{
				theIframe.contentWindow.document.execCommand("Unlink", false, null);
				thewysiwygEditor.theToolbar.setState("Link", "off");
			}
			else
			{
				if (theIframe.contentWindow.document.selection)
				{
					theSelection = theIframe.contentWindow.document.selection.createRange().text;

					if (theSelection == "")
					{
						alert("Please select the text you wish to hyperlink.");
						break;
					}
				}
				else
				{
					theSelection = theIframe.contentWindow.getSelection();

					if (theSelection == "")
					{
						alert("Please select the text you wish to hyperlink.");

						break;
					}
				}

				var theURL = prompt("Enter the URL for this link:", "http://");

				if (theURL != null)
				{
					theIframe.contentWindow.document.execCommand("CreateLink", false, theURL);
					thewysiwygEditor.theToolbar.setState("Link", "on");
				}
			}

			break;

		case "image":
			var theImage = prompt(document.getElementById('lang-mail_compose-image_location').value, "");

			if (theImage != null && theImage != "")
			{
				var theAlt = prompt(document.getElementById('lang-mail_compose-image_alt').value, "");
				var theSelection = null;
				var theRange = null;

				/* IE selections */
				if (theIframe.contentWindow.document.selection)
				{
					/* Escape quotes in alt text */
					theAlt = theAlt.replace(/"/g, "'");

					theSelection = theIframe.contentWindow.document.selection;
					theRange = theSelection.createRange();
					theRange.collapse(false);
					theRange.pasteHTML("<img alt=\"" + theAlt + "\" src=\"" + theImage + "\" />");

					break;
				}
				/* Mozilla selections */
				else
				{
					try
					{
						theSelection = theIframe.contentWindow.getSelection();
					}
					catch (e)
					{
						return false;
					}

					theRange = theSelection.getRangeAt(0);
					theRange.collapse(false);

					var theImageNode = theIframe.contentWindow.document.createElement("img");

					theImageNode.src = theImage;
					theImageNode.alt = theAlt;

					theRange.insertNode(theImageNode);

					break;
				}
			}
			else
			{
				return false;
			}

		default:
			theIframe.contentWindow.document.execCommand(this.action, false, null);

			var theAction = this.action.replace(/^./, function(match){return match.toUpperCase();});

			/* Turn off unordered toolbar item if ordered toolbar item was activated */
			if (this.action == "insertorderedlist")
			{
				theAction = "Ordered";
				thewysiwygEditor.theToolbar.setState("Unordered", "off");
			}

			/* Turn off ordered toolbar item if unordered toolbar item was activated */
			if (this.action == "insertunorderedlist")
			{
				theAction = "Unordered";
				thewysiwygEditor.theToolbar.setState("Ordered", "off");
			}

			/* If toolbar item was turned on */
			if (theIframe.contentWindow.document.queryCommandState(this.action, false, null))
			{
				thewysiwygEditor.theToolbar.setState(theAction, "on");
			}
			else
			{
				thewysiwygEditor.theToolbar.setState(theAction, "off");
			}
	}

	if (thewysiwygEditor.wysiwyg == true)
	{
		theIframe.contentWindow.focus();
	}
	else
	{
		thewysiwygEditor.theTextarea.focus();
	}

	return false;
}




/* Check the nesting of the current cursor position/selection */
function wysiwygToolbarCheckState(thewysiwygEditor, resubmit)
{
	if (!resubmit)
	{
		/* Allow browser to update selection before using the selection */
		setTimeout(function(){if (wysiwygToolbarCheckState) wysiwygToolbarCheckState(thewysiwygEditor, true); return true;}, 500);
	}

	var theSelection = null;
	var theRange = null;
	var theParentNode = null;
	var theLevel = 0;

	/* Turn off all the buttons */
    thewysiwygEditor.theToolbar.setState("SelectBlock",'');
    thewysiwygEditor.theToolbar.setState("SelectFont",'');
    thewysiwygEditor.theToolbar.setState("SelectSize",0);

	var menuListItems = thewysiwygEditor.theToolbar.theList.childNodes;
	for (var i = 0; i < menuListItems.length; i++)
		menuListItems[i].className = menuListItems[i].className.removeClass("on");



	/* IE selections */
	if (thewysiwygEditor.theIframe.contentWindow.document.selection)
	{
		theSelection = thewysiwygEditor.theIframe.contentWindow.document.selection;
		theRange = theSelection.createRange();
		try
		{
			theParentNode = theRange.parentElement();
		}
		catch (e)
		{
			return false;
		}
	}
	/* Mozilla selections */
	else
	{
		try
		{
			theSelection = thewysiwygEditor.theIframe.contentWindow.getSelection();
		}
		catch (e)
		{
			return false;
		}

		theRange = theSelection.getRangeAt(0);
		theParentNode = theRange.commonAncestorContainer;
	}

	function setFontFace(styl){
	    styl = styl.toLowerCase();
		//test font
		var f = '';
		if (styl.indexOf('verdana')>-1)
			f = 'Verdana,Arial,Helvetica';
		else
	    if (styl.indexOf('times')>-1)
	        f = 'Times New Roman,Times,Serif';
	    else
	    if (styl.indexOf('trebuchet')>-1)
	        f = 'Trebuchet MS,Arial,Helvetica';
	    else
		if (styl.indexOf('serif')>-1)
		    f = 'MS Sans Serif,sans-serif';
		else
		if (styl.indexOf('comic')>-1)
		    f = 'Comic Sans MS';
		else
		if (styl.indexOf('arial')>-1 || styl.indexOf('helvetica')>-1)
			f = 'Arial,Helvetica';
		else
		if (styl.indexOf('courier')>-1 || styl.indexOf('monospace')>-1)
		    f = 'Courier New,Courier,Monospace';
		else
		if (styl.indexOf('cursive')>-1)
		    f = 'Cursive';
		else
		if (styl.indexOf('fantasy')>-1)
		    f = 'Fantasy';

		if (f)
			thewysiwygEditor.theToolbar.setState("SelectFont",f);
	}

	while (theParentNode.nodeType == 3)
		theParentNode = theParentNode.parentNode;

	while (theParentNode.nodeName.toLowerCase() != "body")
	{
		switch (theParentNode.nodeName.toLowerCase())
		{
			case "a":
				thewysiwygEditor.theToolbar.setState("Link", "on");

				break;

			case "em":
				thewysiwygEditor.theToolbar.setState("Italic", "on");

				break;

			case "u":
				thewysiwygEditor.theToolbar.setState("Underline", "on");

				break;

			case "i":
				thewysiwygEditor.theToolbar.setState("italic", "on");

				break;

			case "b":
				thewysiwygEditor.theToolbar.setState("Bold", "on");

				break;

			case "li":

				break;

			case "ol":
				thewysiwygEditor.theToolbar.setState("Ordered", "on");
				thewysiwygEditor.theToolbar.setState("Unordered", "off");

				break;

			case "span":
				var styl = theParentNode.style;

				if (styl.textDecoration.indexOf('underline')>=0)
					thewysiwygEditor.theToolbar.setState("Underline", "on");

				if (styl.fontWeight == 'bold')
					thewysiwygEditor.theToolbar.setState("Bold", "on");

				if (styl.fontStyle == 'italic')
					thewysiwygEditor.theToolbar.setState("Italic", "on");

				setFontFace(styl.fontFamily);
				break;

			case "font":
				if (theParentNode.getAttribute("size"))
					thewysiwygEditor.theToolbar.setState("SelectSize",theParentNode.getAttribute("size"));

                if (theParentNode.getAttribute("face"))
					setFontFace(theParentNode.getAttribute("face"));
				break;

			case "strong":
				thewysiwygEditor.theToolbar.setState("Bold", "on");
				break;

			case "ul":
				thewysiwygEditor.theToolbar.setState("Unordered", "on");
				thewysiwygEditor.theToolbar.setState("Ordered", "off");
				break;

			default:
				thewysiwygEditor.theToolbar.setState("SelectBlock", "<" + theParentNode.nodeName.toLowerCase() + ">");
				break;
		}

		theParentNode = theParentNode.parentNode;
		theLevel++;
	}

	return true;
}




/* Turn off browser status display for toolbar items */
function wysiwygToolbarMouseover()
{
	window.status = "";
	return true;
}




function acceptableChildren(theNode)
{
	var theChildren = theNode.childNodes;

	for (var i = 0; i < theChildren.length; i++)
	{
		if (!theChildren[i].nodeName.isAcceptedElementName())
		{
			if (!theChildren[i].nodeName.isInlineName())
			{
				if (theNode.nodeName.toLowerCase() == "p")
				{
					acceptableChildren(replaceNodeWithChildren(theNode));

					return true;
				}

				changeNodeType(theChildren[i], "p");
			}
			else
			{
				replaceNodeWithChildren(theChildren[i]);
			}

			i = -1;
		}
	}

	for (var i = 0; i < theChildren.length; i++)
	{
		acceptableChildren(theChildren[i]);
	}

	return true;
}




/* Change the type of a node, e.g. h3 to p */
function changeNodeType(theNode, nodeType)
{
	var theChildren = new Array();
	var theNewNode = document.createElement(nodeType);
	var theParent = theNode.parentNode;

	if (theParent != null)
	{
		for (var i = 0; i < theNode.childNodes.length; i++)
		{
			theChildren.push(theNode.childNodes[i].cloneNode(true));
		}

		for (var i = 0; i < theChildren.length; i++)
		{
			theNewNode.appendChild(theChildren[i]);
		}

		theParent.replaceChild(theNewNode, theNode);
	}

	return true;
}




/* Replace a node with its children -- delete the item and move its children up one level in the hierarchy */
function replaceNodeWithChildren(theNode)
{
	var theChildren = new Array();
	var theParent = theNode.parentNode;

	if (theParent != null)
	{
		for (var i = 0; i < theNode.childNodes.length; i++)
		{
			theChildren.push(theNode.childNodes[i].cloneNode(true));
		}

		for (var i = 0; i < theChildren.length; i++)
		{
			theParent.insertBefore(theChildren[i], theNode);
		}

		theParent.removeChild(theNode);

		return theParent;
	}

	return true;
}




/* Add a class to a string */
String.prototype.addClass = function(theClass)
{
	if (this != "")
	{
		if (!this.classExists(theClass))
		{
			return this + " " + theClass;
		}
	}
	else
	{
		return theClass;
	}

	return this;
}




/* Check if a class exists in a string */
String.prototype.classExists = function(theClass)
{
	var regString = "(^| )" + theClass + "\W*";
	var regExpression = new RegExp(regString);

	if (regExpression.test(this))
	{
		return true;
	}

	return false;
}




/* Check if a string is the nodeName of an accepted element */
String.prototype.isAcceptedElementName = function()
{
	var elementList = new Array("#text", "a", "em", "h1", "h2", "h3", "h4", "h5", "h6", "img", "li", "ol", "p", "strong", "ul","font");
	var theName = this.toLowerCase();

	for (var i = 0; i < elementList.length; i++)
	{
		if (theName == elementList[i])
		{
			return true;
		}
	}

	return false;
}




/* Check if a string is the nodeName of an inline element */
String.prototype.isInlineName = function()
{
	var inlineList = new Array("#text", "a", "em", "font", "span", "strong", "u");
	var theName = this.toLowerCase();

	for (var i = 0; i < inlineList.length; i++)
	{
		if (theName == inlineList[i])
		{
			return true;
		}
	}

	return false;
}




/* Remove a class from a string */
String.prototype.removeClass = function(theClass)
{
	var regString = "(^| )" + theClass + "\W*";
	var regExpression = new RegExp(regString);

	return this.replace(regExpression, "");
}




/* Reverse a string */
String.prototype.reverse = function()
{
	var theString = "";

	for (var i = this.length - 1; i >= 0; i--)
	{
		theString += this.charAt(i);
	}

	return theString;
}




/* Make tags valid by converting uppercase element and attribute names to lowercase and quoting attributes */
String.prototype.validTags = function()
{
	var theString = this;

	/* Replace uppercase element names with lowercase */
	theString = theString.replace(/<[^> ]*/g, function(match){return match.toLowerCase();});

	/* Replace uppercase attribute names with lowercase */
	theString = theString.replace(/<[^>]*>/g, function(match)
		{
			match = match.replace(/ [^=]+=/g, function(match2){return match2.toLowerCase();});

			return match;
		});

	/* Put quotes around unquoted attributes */
	theString = theString.replace(/<[^>]*>/g, function(match)
		{
			match = match.replace(/( [^=]+=)([^"][^ >]*)/g, "$1\"$2\"");

			return match;
		});

	return theString;
}