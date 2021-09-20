function showBranches()
{
	var tagy = ["li"]; // nastaveni kontrolovanych tagu                        
	for (var ii = 0; ii < tagy.length; ii++) 
	{				
        var x = document.getElementsByTagName(tagy[ii]);        
        for (var i = 0; i < x.length; i++) 
		{
        	tridy=x[i].className.split(' ');
	    	if (in_array('plus',tridy) || in_array('minus',tridy))
	    	{	 
	    		var span=x[i].getElementsByTagName('div')[0].getElementsByTagName('span')[0];	    		
	    		var icon=x[i].getElementsByTagName('div')[0].getElementsByTagName('span')[1];
	    		
	    		if (in_array('plus',tridy)) {x[i].status=0;}				
	    		if (in_array('minus',tridy)) {x[i].status=1;}
	    		span.li=x[i];
	    		icon.li=x[i];
				span.onclick=function () 
				{				
					if (this.li.status==0)
					{
						this.li.status=1;
						this.li.className=this.li.className.replace(/plus/g,'minus');
					}
					else
					{
						this.li.status=0;
						this.li.className=this.li.className.replace(/minus/g,'plus');
					}
				}
				
				icon.onclick=function () 
				{				
					if (this.li.status==0)
					{
						this.li.status=1;
						this.li.className=this.li.className.replace(/plus/g,'minus');
					}
					else
					{
						this.li.status=0;
						this.li.className=this.li.className.replace(/minus/g,'plus');
					}
				}
	    	}
	    }
	}
}

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
/** Script zajiĹˇÂťujĂ­cĂ­ obslouĹľenĂ­ vĹˇech oznaĂ¨enĂ˝ch elementĂą */
addOnloadEvent(showBranches);
/** /Script zajiĹˇÂťujĂ­cĂ­ obslouĹľenĂ­ vĹˇech oznaĂ¨enĂ˝ch elementĂą */