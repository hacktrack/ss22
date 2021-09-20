/*
function clone(myObj)
{
        if(typeof(myObj) != 'object') return myObj;
        if(myObj == null) return myObj;
        var myNewObj = new Object();
        for(var i in myObj) myNewObj[i] = clone(myObj[i]);
        return myNewObj;
}
function inarray(arr,elm){
        for(var i in arr){
           if(arr[i]==elm) return i;
        }
        return -1;
}
*/
/*****************************/
/*
function fTree(){
  this.targetID;
  this.doc = document;
  this.fTdata;
  this.fTopen;
  this.dvdr="/";
  this.count='';
  this.imagePath ='';
}
   fTree.prototype.addRow = function(it){
      var elm1,elm2,elm3,elm4,elm5;
      
      elm1 = this.doc.createElement("li");
      elm1.className = 'none'+ (it[4]?' '+it[4]:'');

      elm2 = this.doc.createElement("div");
      elm3 = this.doc.createElement("span");
      elm3.innerHTML = "&nbsp;";
      elm4 = this.doc.createElement("span");
      elm4.className = 'nobg';
      elm4.innerHTML = it[1]?it[1]:'&nbsp;';
			if (typeof it[2] == 'object'){
         for (var i in it[2]){
             try{
                if (i=='href')
                   elm4[i] = it[2][i];
                else
                   elm4[i] = function(){eval(it[2][i]);};
             }
             catch(e){}
         }
      }
      else
        elm4.href = it[2]?it[2]:'javascript: void(0);';

      if(it[5]) elm4.target = it[5];

      elm2.appendChild(elm3);
      if(it[3]){
        elm5 = this.doc.createElement("span");
        elm5.className='ico';
        elm5.style.background = 'url("'+this.imagePath+it[3]+'")';
        elm5.innerHTML='&nbsp;';
        elm2.appendChild(elm5);
      }
      elm4.id = it[0];
      elm4.tabIndex = this.count++;
      elm2.appendChild(elm4);
      elm1.appendChild(elm2);
      return elm1;
   }
   fTree.prototype.openUp = function(elm){
       while(1 && elm!=null){
         if(elm.className.indexOf('plus')>-1)
           elm.className = elm.className.replace('plus','minus');
         else
           elm.className = 'minus';

         elm = elm.parentNode.parentNode;
         if(elm.id==this.targetID) return;
       }

   }

   fTree.prototype.fillBody = function(){
      if(!this.targetID || !this.doc.getElementById(this.targetID) || typeof this.fTdata != "object") return;
      //make a copy of array (dodelat duplicate)
      var fTdata = this.fTdata.slice(0,this.fTdata.length);
      var fTtarget = this.doc.getElementById(this.targetID);

      var ul,li,serch = new Array(),elm=[],it;

      //main UL
      ul = this.doc.createElement('ul');
      ul.className = 'fTree';
      fTtarget.appendChild(ul);

      var ii=0,tmpElm,RegEXP="";

      while(1){

         for(i=0;i<fTdata.length;){
            if(typeof fTdata[i] != 'object'){ fTdata.splice(i,1); continue;}

            //1st level
            if(!serch.length){
              if(fTdata[i][0].indexOf(this.dvdr)>-1){ i++; continue;}
            }
            //deeper levels
            else{
              RegEXP = new RegExp('^('+serch[serch.length-1]+this.dvdr+')([a-ž0-9_& ;,:#\\\"\'\.\-]+)$',"i");

              if (!fTdata[i][0].match(RegEXP)) {
                 i++; continue;
              }
            }

            it = fTdata.splice(i,1);
            i = 0;
            serch.push(it[0][0]);
            li = this.addRow(it[0]);

              if(elm.length){

                if(elm[elm.length-1].tagName=='LI') {
                   tmpElm = this.doc.createElement('ul');
                   elm[elm.length-1].appendChild(tmpElm);
                   //minus ico
                   if(inarray(this.fTopen,urlencode(serch[serch.length-2]))>-1)
                      this.openUp(elm[elm.length-1]);
                   //plus ico
                   else
                      elm[elm.length-1].className="plus";
                   //add collapse
                   elm[elm.length-1].getElementsByTagName("span")[0].onclick = function(){
                            var pli = this.parentNode.parentNode;
                            //Get node id
                            var nodeid = pli.getElementsByTagName("a")[0].parentNode.id;
                            var urlnodeid = urlencode(nodeid);
                            //Get opened ids
                            var opened = getCookie('openednodes');
                            var oArr = Array();
                            if (opened!=null)  if (opened!="") oArr = opened.split('|');
                           
                            if(pli.className.indexOf('plus')>-1){
                               pli.className = pli.className.replace('plus','minus');
                               //Add cookie to opened nodes
                               if (inarray(oArr,urlnodeid)==-1) oArr[oArr.length] = urlnodeid;
                            }
                            else{
                               pli.className = pli.className.replace('minus','plus');
                               //Remove from cookie opened nodes
                               var pos = inarray(oArr,urlnodeid);
                               delete(oArr[pos]);
                            }
                            //Prepare to save
                            var openednodes="";
                            for (oi = 0; oi< oArr.length;oi++)
                              if(oArr[oi]!=null) openednodes+= urlencode(oArr[oi])+"|";
                            //Remove last separator
                            if (openednodes.substring(openednodes.length-1,openednodes.length)=="|") 
                              openednodes = openednodes.substring(0,openednodes.length-1);
                           
                           //Save opened nodes
                           document.cookie = 'openednodes='+openednodes+';expires=Fri, 31 Dec 2099 23:59:59 GMT;';
                           return false;
                   }
                   elm[elm.length-1] = tmpElm;
                }
                elm[elm.length-1].appendChild(li);

              }
              else{
                ul.appendChild(li);
              }

              elm.push(li);
         }

         var lastSrch = serch.pop();
         var lastElm = elm.pop();
         if (typeof lastElm !='object') return;
        
         lastElm.lastChild.className+=" end";
      }
   }
*/

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