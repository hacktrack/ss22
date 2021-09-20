// capture mouse
// Detect if the browser is IE or not.
// If it is not IE, we assume that the browser is NS.
var IE = document.all?true:false

// If NS -- that is, !IE -- then set up for mouse capture
if (!IE) document.captureEvents(Event.MOUSEMOVE)

// Set-up to use getMouseXY function onMouseMove
document.onmousemove = getMouseXY;

// Temporary variables to hold mouse x-y pos.s
var tempX = 0
var tempY = 0

// Main function to retrieve mouse x-y pos.s

function getMouseXY(e) {
  if (IE) { // grab the x-y pos.s if browser is IE
    tempX = event.clientX + document.body.scrollLeft
    tempY = event.clientY + document.body.scrollTop
  } else {  // grab the x-y pos.s if browser is NS
    tempX = e.pageX
    tempY = e.pageY
  }  
  // catch possible negative values in NS4
  if (tempX < 0){tempX = 0}
  if (tempY < 0){tempY = 0}  
  // show the position values in the form named Show
  // in the text fields named MouseX and MouseY
  window.mouseX = tempX
  window.MouseY = tempY
}

//

function nl2br( str ) {
    // Inserts HTML line breaks before all newlines in a string
    // 
    // +    discuss at: http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_nl2br/
    // +       version: 808.2715
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Philip Peterson
    // *     example 1: nl2br('Kevin\nvan\nZonneveld');
    // *     returns 1: 'Kevin<br />\nvan<br />\nZonneveld'

    return str.replace(/([^>])\n/g, '$1<br />\n');
}// }}}

function strankaX(elem) {
    return elem.offsetParent ? elem.offsetLeft + strankaX(elem.offsetParent) : elem.offsetLeft;
}

function strankaY(elem) {
    return elem.offsetParent ? elem.offsetTop + strankaY(elem.offsetParent) : elem.offsetTop;
}

function pridejDo(za, elem) {
    e = vytvor(elem);
    za.appendChild(e);
    return e;
}
function vytvor(elem) {
    return document.createElementNS ? document.createElementNS("http://www.w3.org/1999/xhtml", elem) : document.createElement(elem);
}

function removeElement(divNum) {
  if (document.getElementById(divNum))
  {
   var d = document.getElementById(divNum).parentNode;
   var olddiv = document.getElementById(divNum);
   d.removeChild(olddiv);
  }
}

function getScrollXY() {
  var scrOfX = 0, scrOfY = 0;
  if( typeof( window.pageYOffset ) == 'number' ) {
    //Netscape compliant
    scrOfY = window.pageYOffset;
    scrOfX = window.pageXOffset;
  } else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
    //DOM compliant
    scrOfY = document.body.scrollTop;
    scrOfX = document.body.scrollLeft;
  } else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
    //IE6 standards compliant mode
    scrOfY = document.documentElement.scrollTop;
    scrOfX = document.documentElement.scrollLeft;
  }
  return [ scrOfX, scrOfY ];
}

function in_array(what, where) {
    var a = false;
    for (var i = 0; i < where.length; i++) {
        if (what == where[i]) {
            a = true;
            break;
        }
    }
    return a;
}

function showMenu(id,co)
{
	document.getElementById(id).style.display="block";
	document.getElementById(id).style.top=(strankaY(co)+co.offsetHeight)+'px';
	document.getElementById(id).style.left=(strankaX(co))+'px';
	document.getElementById(id).style.width=(co.offsetWidth)+'px';
}

function hideMenu(id)
{
	if (!document.getElementById(id).active)
	{
		document.getElementById(id).style.display='none';
	}
}

function doHideMenu(id)
{
	if (!document.getElementById(id).active)
	{
		document.getElementById(id).style.display="none";
	}
}

function submenuHandler()
{
	var tagy = ["div","td"]; // nastaveni kontrolovanych tagu
	for (var ii = 0; ii < tagy.length; ii++) {
        var x = document.getElementsByTagName(tagy[ii]);        
        for (var i = 0; i < x.length; i++) {
        	tridy=x[i].className.split(' ');			        	
	    	if (in_array('substrankahlavicka',tridy))
	    	{ 		    		    		
				x[i].className="substrankahlavickaJS";
				x[i].style.paddingLeft='0px';				
				parentMenu=x[i].id.split('-')[1];
				//alert(parentMenu);
				x[i].style.left=(strankaX(document.getElementById(parentMenu)))+'px';
				x[i].style.display="none";
				//var xi=x[i];												
				
				document.getElementById(parentMenu).innerHTML+=" &dArr;";
				document.getElementById(parentMenu).xi=x[i];				
				document.getElementById(parentMenu).onmouseover=function ()
				{
					this.xi.style.display='block';
				}
				//alert(xi.id);
				document.getElementById(parentMenu).onmouseout=function ()
				{															
					setTimeout('hideMenu(\''+this.xi.id+'\');',100);
				}
				x[i].onmouseover=function()
				{							
					this.active=true;					
					
				}
				x[i].onmouseout=function()
				{
					this.active=false;
					setTimeout('hideMenu(\''+this.id+'\');',100);
				}				
			}
			if (in_array('ttl',tridy))
	    	{	    		
///////////////////////////////////////////////////////////////////////////////////////////////////////
				x[i].onmouseover = function ()
					{																
						//napoveda = pridejZa(this.parentNode, "div");
						napoveda = pridejDo(document.getElementsByTagName('body')[0], "div");
						if (this.title.indexOf('|')>0)
						{
						 titulek=this.title.split('|');        			        			
        				 napoveda.innerHTML='<div class="ttlTop">'+titulek[0]+'</div>'+titulek[1].replace(/--/g,"<li>").replace(/-\/-/g,"</li>").replace(/\/CLASS\//g,"\" class=\"").replace(/\/IMG\//g,"<img src=\"").replace(/\/EIMG\//g,"\">");
        				}
        				else
        				{
						 napoveda.innerHTML="<div class=\"ttlBottom\">"+this.title+"</div>";
						}
						napoveda.id=this.id+"_div";        				
						napoveda.title=this.title;
						this.title="";
						/* styl */        			
        				napoveda.className="titulek";
        				/* /styl */
        				
						/* pozicovani */
						napoveda.style.position = "absolute";
						
						xy=getScrollXY();
						// nastaveni pozice vpravo dolu
						napoveda.style.top = eval(strankaY(this)+this.offsetHeight+10) + "px";
                        napoveda.style.left = eval(strankaX(this)+(this.offsetWidth)+10) + "px";
                        ///
                        
                        // kontrola mista dole, pokud neni, nastavi pozici nahoru                        
                        if (eval(strankaY(this)+this.offsetHeight+napoveda.offsetHeight+10)>=document.documentElement.clientHeight+xy[1]) 
						{							
							napoveda.style.top = eval(strankaY(this)-napoveda.offsetHeight-10) + "px";
							// kontrola mista nahore, pokud neni, nastavi pozici 10px od horniho okraje
						    if (eval(strankaY(this)-napoveda.offsetHeight-10-xy[1])<=0) 
							{								
								napoveda.style.top = eval(10+xy[1]) + "px";
							}
							///
						}						
						///
						// kontrola mista vpravo, pokud neni, nastavi pozici vlevo
						if (eval(strankaX(this)+this.offsetWidth+napoveda.offsetWidth+10)>=document.documentElement.clientWidth+xy[0]) 
						{
							napoveda.style.left = eval(strankaX(this)-napoveda.offsetWidth-10) + "px";
							// kontrola mista vlevo, pokud neni, nastavi pozici 10px od leveho okraje
							if (eval(strankaX(this)-napoveda.offsetWidth-10-xy[0])<=0) 
							{
								napoveda.style.left = eval(10+xy[0]) + "px";
							}	
						}
						///																		    												
						/* /pozicovani */        				
					};
					x[i].onmouseout = function () 
					{
						 if (document.getElementById(this.id+"_div"))
						 {
						  this.title=document.getElementById(this.id+"_div").title;
						  removeElement(this.id+"_div");				
						 }
					}
					
					if (!x[i].id) {x[i].id="atitle_"+i;}  // zkontroluje, zda maji kontrolovane tagy ID. Pokud ne, je prideleno 		
///////////////////////////////////////////////////////////////////////////////////////////////////////		
	    	}
		}
	}
}

function resizerMove(e)
{
	target=window.resizer;
	if (target.onmousemove)
	{
		target.onmousemove(e)
	}
}

function resizerFit()
{
	if (document.getElementById('tree') && document.getElementById('resizer'))
	{
		var x=document.getElementById('resizer');
		var rheight=document.getElementById('main_contentInnerBox').offsetHeight;
		var lheight=document.getElementById('tree').offsetHeight;
		if (rheight>lheight) {var height=rheight;} else {var height=lheight;}
		x.style.height=height+'px';
	}
}

function resizer()
{
	if (document.getElementById('tree'))
	{
	var x=document.getElementById('resizer');
	
	    		window.resizer=x;
	    		
		    	var rheight=document.getElementById('main_contentInnerBox').offsetHeight;
	    		var lheight=document.getElementById('tree').offsetHeight;
	    		if (rheight>lheight) {var height=rheight;} else {var height=lheight;}
	    		window.resizer.style.top=strankaY(document.getElementById('main_content'))+'px';
	    		x.style.height=height+'px';
	    		
				x.onmousedown = function (event)
				{
					getMouseXY(event);
					//this.style.backgroundColor="#00ff00";
					this.style.width="215px";
					window.resizerPosition=strankaX(this);
					if (!window.mousePosition){window.mousePosition=window.mouseX;}
					document.getElementById('tree').width=document.getElementById('tree').offsetWidth;
					document.getElementById('main_contentInnerBox').left=document.getElementById('tree').width;
					this.down=true;
					
					this.style.paddingLeft='95px';
					this.style.left=(window.mouseX-100)+'px';
					document.getElementById('resizerInner').className='resizerInner resizerActive';
					
					return false;
				}
				x.onmouseup = function ()
				{
					//this.style.backgroundColor="#ff0000";
					this.down=false;
					document.getElementById('main_contentInnerBox').style.marginLeft=((strankaX(this)+15+85-5))+'px';
					document.getElementById('tree').style.width=((strankaX(this)+85-5))+'px';
					this.style.width="10px";
					this.style.left=(window.mouseX-5)+'px';
					this.style.paddingLeft='0px';
					document.getElementById('resizerInner').className='resizerInner';
				}
				x.onmousemove = function (event)
				{
					if (this.down)
					{
						getMouseXY(event);
						//this.style.backgroundColor="#0000ff";
						this.style.left=(window.mouseX-100)+'px';
					}
				}
				x.ondrag = function ()
				{
					return false;
				}
				x.onselect = function ()
				{
					return false;
				}
	}
	else if(document.getElementById('resizer'))
	{
		document.getElementById('resizer').style.display="none";	
	}
}


/** addonload */
function addOnloadEvent(fnc){
  if ( typeof window.addEventListener != "undefined" )
    window.addEventListener( "load", fnc, false );
  else if ( typeof window.attachEvent != "undefined" ) {
    window.attachEvent( "onload", fnc );
  }
  else {
    if ( window.onload != null ) {
      var oldOnload = window.onload;
      window.onload = function ( e ) {
        oldOnload( e );
        window[fnc]();
      };
    }
    else
      window.onload = fnc;
  }
}

function addOnmousemoveEvent(fnc){
  if ( typeof window.addEventListener != "undefined" )
    window.addEventListener( "mousemove", fnc, false );
  else if ( typeof window.attachEvent != "undefined" ) {
    window.attachEvent( "onmousemove", fnc );
  }
  else {
    if ( window.onmousemove != null ) {
      var oldOnload = window.onmousemove;
      window.onmousemove = function ( e ) {
        oldOnload( e );
        window[fnc]();
      };
    }
    else
      window.onmousemove = fnc;
  }
}
/** Script zajišťující obsloužení všech označených elementů */
addOnloadEvent(submenuHandler);
addOnloadEvent(resizer);
addOnmousemoveEvent(resizerMove);
/** /Script zajišťující obsloužení všech označených elementů */