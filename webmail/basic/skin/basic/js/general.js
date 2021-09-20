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

	button=vytvor('input');
	button.type="button";
	button.className="bfield submitField rem";
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

function sfwGetKey(e)
{
	return ((window.event) ? window.event.keyCode : e.which);
}

function checkDate()
{
	if (parseInt(document.getElementById('js_start_year').value,10)>=parseInt(document.getElementById('js_end_year').value))
	{
		document.getElementById('js_end_year').value=document.getElementById('js_start_year').value;
		if (parseInt(document.getElementById('js_start_month').value,10)>=parseInt(document.getElementById('js_end_month').value))
		{
			document.getElementById('js_end_month').value=document.getElementById('js_start_month').value;
			if (parseInt(document.getElementById('js_start_day').value,10)>=parseInt(document.getElementById('js_end_day').value))
			{
				document.getElementById('js_end_day').value=document.getElementById('js_start_day').value;
				if (document.getElementById('js_start_hour'))
				{
					if (parseInt(document.getElementById('js_start_hour').value,10)>=parseInt(document.getElementById('js_end_hour').value))
					{
						document.getElementById('js_end_hour').value=document.getElementById('js_start_hour').value;
						if (parseInt(document.getElementById('js_start_minute').value,10)>=parseInt(document.getElementById('js_end_minute').value))
						{
							document.getElementById('js_end_minute').value=document.getElementById('js_start_minute').value;
						}
					}
				}
			}
		}
	}

}

$(document).ready(function(){

/*******************************/
$('#simpleTree a[href=\'#\']').addClass('notActive');
/*******************************/

/*********************** FLAGS *************************/
var flags=['Z','1','2','3','5','8','A','Y'];
$('.flags').click(function(){
	var time=Math.floor(new Date().getTime()/1000);
	var val=this.title.split('|');
	var index=flags.indexOf(val[0]);
	var next=parseInt(index+1);

	if (this.lastClick && (time-10)<this.lastClick)
	{
		if (next>=flags.length)
		{
			next=0;
		}
	}
	else
	{
		next=0;
		if (index==0) {next=1;}
	}

	$(this).removeClass('flag'+val[0]);
	$(this).addClass('flag'+flags[next]);
	this.title=flags[next]+'|'+val[1];

	this.lastClick=time;

	var xml='<iq sid="'+$('#sid').val()+'" type="set"><query xmlns="webmail:iq:items"><account uid="'+$('#uid').val()+'"><folder uid="'+$('#fid').val()+'"><item uid="'+val[1]+'" action="edit"><values><color>'+flags[next]+'</color></values></item></folder></account></query></iq>';

	$.post('../server/webmail.php',xml,function(data){});

	return false;
});
/******************************************************/


	if (document.getElementById('js_start_month'))
	{
		$('.js_checkDate').change(
		function()
		{
			checkDate();
		});
	}

	/* tasks - enabling and disabling start and end date, initialitation */
	if (document.getElementById('startTimeCheckbox'))
	{
		var sels=$('.startTimeCheckbox');
		for(var i=0; i<sels.length; i++)
		{
			sels[i].oname=sels[i].name;
		}
		var sels=$('.endTimeCheckbox');
		for(var i=0; i<sels.length; i++)
		{
			sels[i].oname=sels[i].name;
		}
		if (!document.getElementById('startTimeCheckbox').checked)
		{
			$('.startTimeCheckbox').attr('disabled','disabled');
			$('.startTimeCheckbox').attr('name','');
		}
		if (!document.getElementById('endTimeCheckbox').checked)
		{
			$('.endTimeCheckbox').attr('disabled','disabled');
			$('.endTimeCheckbox').attr('name','');
		}
		$('#startTimeCheckbox').change(function(){
			if (this.checked){
				$('.startTimeCheckbox').removeAttr('disabled');
				var sels=$('.startTimeCheckbox');
				for(var i=0; i<sels.length; i++)
				{
					sels[i].name=sels[i].oname;
				}
			}
			else
			{
				$('.startTimeCheckbox').attr('disabled','disabled');
				$('.startTimeCheckbox').attr('name','');
			}
		});
		$('#endTimeCheckbox').change(function(){
			if (this.checked){
				$('.endTimeCheckbox').removeAttr('disabled');
				var sels=$('.endTimeCheckbox');
				for(var i=0; i<sels.length; i++)
				{
					sels[i].name=sels[i].oname;
				}
			}
			else
			{
				$('.endTimeCheckbox').attr('disabled','disabled');
				$('.endTimeCheckbox').attr('name','');
			}
		});
	}
	/**/

	$('.noJSHide').removeClass('noJSHide');
	$('.noJSShow').css('display','none');

	$('[name=\'_a[delete]\']').click(function(){return confirm(this.alt);});
	$('[name=\'_a[contact_delete]\']').click(function(){return confirm(this.alt);});

	$h=$('#sizerWatcher').height();
	if ($h<300)
	{
		$('#sizerWatcher').height(300);
	}

	var adjustYear=function()
	{
		var val=this.value;
		var inn='';
		var f=parseInt(val-10);
		var sel='';
		var pi=0;
		for(var i=0; i<=20; i++)
		{
				sel='';
				pi=parseInt(f+i);
				if (pi==val) {sel=' selected="selected"';}
				inn=inn+"<option value=\""+pi+"\""+sel+">"+pi+"</option>";
		}
		document.getElementById(this.title).innerHTML="<select size=\"1\" class=\"holdSelect js_checkDate\" title=\""+this.title+"\" name="+this.name+" id="+this.id+">"+inn+"</span>";
		$('.holdSelect').change(adjustYear);

 	if (document.getElementById('js_start_month'))
		{
			$('.js_checkDate').change(function(){checkDate();});
		}
	}

	$('.holdSelect').change(adjustYear);

	$('#error').addClass('slide');
	$('#error').click(function(){
		$('#error_details').toggle('slow');
		return false;
	});

	if ($('#message').attr('class')!='noslide')
	{
		$('#message').addClass('slide');
		$('#message').click(function(){
			$('#message_details').toggle('slow');
			return false;
		});
	}

	/********** distribution edit button disable/enable **************/
	$('#distrib_edit_contact').attr('disabled','disabled');
	$('#distrib_delete_contact').attr('disabled','disabled');
	$('.contactGridTD input').click(function(){
		if (this.checked)
		{
			$('#distrib_edit_contact').removeAttr('disabled');
			$('#distrib_delete_contact').removeAttr('disabled');
		}
		else
		{
			$('#distrib_edit_contact').attr('disabled','disabled');
			$('#distrib_delete_contact').attr('disabled','disabled');
		}
	});
	/*****************************************************************/

	/************************** on leave in distribution list *************************/
	if ($('[name=\'_a[cancel_distrib]\']').val() || $('[name=\'_a[cancel_select]\']').val())
	{
		$('#tree a').click(function(){return confirm($('#lang-contact_main-onleave_warning').val());});
		$('#strankahlavicka a').click(function(){
			if (this.id!='address_book' || !document.getElementById('action_EN'))
			{
				return confirm($('#lang-contact_main-onleave_warning').val());
			}
		});
		$('#logout').click(function(){return confirm($('#lang-contact_main-onleave_warning').val());});
	}
	/*****************************************************/

	/************* FM confirm **************/
	$('[name=\'_a[deleteFolder]\']').click(function(){return confirm(this.alt);});
	$('[name=\'_a[emptyFolder]\']').click(function(){return confirm(this.alt);});
	/**************************/
	
	/* groupware restriction */
	$('.restricted').click(function(){alert($('#lang-menu-alert_restricted_access').val()); return false;});
	/**/
});