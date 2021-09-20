function resize(useOffset)
{
	if (!useOffset) {useOffset=false;}
	
	var max=30000,
		min=150;
		
	this.__eFrame = document.getElementById('mailFrame');
	this.__doc = this.__eFrame.contentDocument;
	if (typeof this.__doc == 'undefined' || this.__doc == null)
	{
		this.__doc = this.__eFrame.contentWindow.document;
	}

	var the_height = this.__doc.getElementById('mailBox').scrollHeight;
	var the_oheight = this.__doc.getElementById('mailBox').offsetHeight+50;
	
	
	if (useOffset)
	{
		
		if (!window.iVisible)
		{
			if (the_oheight<the_height) {the_height=the_oheight;}
		}
		else
		{
			if (the_oheight>the_height) {the_height=the_oheight;}
		}
		
	}

	if (!document.all)
	{
		if (the_oheight<the_height) {the_height=the_oheight;}
	}

	if (the_height<max && the_height>min)
		document.getElementById('mailFrame').style.height=(the_height+30)+'px';
	else
	if (the_height<min)
		document.getElementById('mailFrame').style.height=(min+30)+'px';

}

function fPrint(oTgt)
{
	oTgt.focus();
	oTgt.print();
}


$(document).ready(function(){

	$('#showAllHeaders').click(function(){
		$('#allHeaders').toggle();
		return false;
	});
	
	$('#showAllImages').click(function(){
		this.__eFrame = document.getElementById('mailFrame');
		this.__doc = this.__eFrame.contentDocument;
		if (typeof this.__doc == 'undefined' || this.__doc == null)
		{
			this.__doc = this.__eFrame.contentWindow.document;
		}
		//this.__doc.getElementById('allImages').style.display='none';
		if (this.__doc.getElementById('allImages'))
		{
			if ($(this.__doc.getElementById('allImages')).attr('class')=='hidden')
			{
				var images=$(this.__doc.getElementById('allImages')).children('img');
				for(var i=0; i<images.length; i++)
				{
					images[i].src=images[i].alt;
					images[i].alt='';
					//alert(images[i].src);
					$(this.__doc.getElementById('allImages')).removeClass('hidden');
				}
			}
			
			if (!window.iVisible)
			{
				$(this.__doc.getElementById('allImages')).show();
				window.iVisible=true;
			}
			else
			{
				$(this.__doc.getElementById('allImages')).hide();
				window.iVisible=false;
			}
			//setTimeout('resize()',1000);
			resize(true);
		}

		return false;
	});

	$('#printMail').click(function(){
		if ($('#mailFrame'))
		{
			fPrint(mailFrame);
		}
		return false;
	});

	$('.replyarea').focus(function(){
		document.getElementById('frsubmit').style.display='block';
		this.style.height='250px';
		//MSIE
		if (document.selection)
		{
			var r = this.createTextRange();
			r.collapse(true);
			r.moveStart("character", 0);
			r.moveEnd("character", 0);
			r.select();
		}
		// OTHERS
		else
		{
			this.setSelectionRange(0,0);
		}
	});
});
