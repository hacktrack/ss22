/** Standalone OnNPSlide function 
*		onnpslide(ELEMENT_OBJECT,CALLBACK_FUNCTION);
*/

function microtime (get_as_float) {
	var now = new Date().getTime() / 1000;
	var s = parseInt(now, 10);
	return (get_as_float) ? now : (Math.round((now - s) * 1000) / 1000) + ' ' + s;
}


function onnpslide(elem,fPrev,fNext)
{
	var onnpslidehandlervar=[];
	var onnpslidehandlertime=[];
	
	elem.ontouchstart=function(e)
	{
		onnpslidehandlertime[e.changedTouches[0].identifier]=microtime(true);
		//e.preventDefault();
		if (e.changedTouches[0]){
			onnpslidehandlervar[e.changedTouches[0].identifier]={'clientX':e.changedTouches[0]['clientX'],'clientY':e.changedTouches[0]['clientY']};
			
			var t='S X:'+e.changedTouches[0]['clientX']+',Y:'+e.changedTouches[0]['clientY']+"\r\n"+$('.replyarea').val();
			$('.replyarea').val(t);
			//alert(print_r(onnpslidehandlervar[e.changedTouches[0].identifier],true))
		}
		
	}
	elem.ontouchmove=function(e)
	{
		var t='M X:'+e.changedTouches[0]['clientX']+',Y:'+e.changedTouches[0]['clientY']+"\r\n"+$('.replyarea').val();
		$('.replyarea').val(t);
	}
	elem.ontouchend=function(e)
	{
		//e.preventDefault();
		
		var t='E X:'+e.changedTouches[0]['clientX']+',Y:'+e.changedTouches[0]['clientY']+"\r\n"+$('.replyarea').val();
		$('.replyarea').val(t);
		
		if (onnpslidehandlervar[e.changedTouches[0].identifier] && onnpslidehandlertime[e.changedTouches[0].identifier] && (microtime(true)-onnpslidehandlertime[e.changedTouches[0].identifier])<0.35)
		{
			var x=e.changedTouches[0]['clientX']-onnpslidehandlervar[e.changedTouches[0].identifier]['clientX'];
			var y=Math.abs(e.changedTouches[0]['clientY']-onnpslidehandlervar[e.changedTouches[0].identifier]['clientY']);
			//alert(e.changedTouches[0]['clientX']+'-'+onnpslidehandlervar[e.changedTouches[0].identifier]['clientX']);
			if(x>0 && Math.abs(x)>y*1.5 && Math.abs(x)>0.45*this.offsetWidth)
			{
				fNext();
			}
			else if(x<0 && Math.abs(x)>y*1.5 && Math.abs(x)>0.45*this.offsetWidth)
			{
				fPrev();
			}
		}
	}
}

/***********/