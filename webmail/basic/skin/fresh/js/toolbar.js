function select(what)
{
	var ret=true;
	var x = document.getElementById('datagrid').getElementsByTagName('input');
	if (what=='invert'){ret=false;}
	for (var i = 0; i < x.length; i++) 
	{
		var tridy=x[i].parentNode.parentNode.className.split(' ');
		if (x[i].type=='checkbox')
		{
			//x[i].checked=false;
			if (what=='all')
			{
				x[i].checked=true;
			} 
			if (what=='none')
			{
				x[i].checked=false;
				ret=false;
			}
			if (what=='read' && !in_array('recent',tridy))
			{
				x[i].checked=true;
			}
			else if (what=='read' && in_array('recent',tridy))
			{
				x[i].checked=false;
			}
			if (what=='unread' && in_array('recent',tridy))
			{
				x[i].checked=true;
			}
			else if (what=='unread' && !in_array('recent',tridy))
			{
				x[i].checked=false;
			}
			if (what=='invert')
			{
				if (x[i].checked==true){x[i].checked=false;}
				else {x[i].checked=true;ret=true;}
			}
		}
	}
	return ret;
}

/*******************************/
$(document).ready(function(){
	if(!document.getElementById('jscheck_info') || document.getElementById('jscheck_info').value==1)
	{
		$('#action_move_top,#action_copy_top').change(function(){
			document.getElementById('select_folder_top').value=this.value;
			document.getElementById('multiple_mail_action_top').value=this.id.replace('action_','').replace('_top','');
			document.getElementById('multiple_mail_action_top_action').value=1;
			if (document.getElementById('action_more_top')){document.getElementById('action_more_top').name='disabled'};
			document.getElementById('main_form').submit();
		});
		$('#action_move_bottom,#action_copy_bottom').change(function(){
			document.getElementById('select_folder_bottom').value=this.value;
			document.getElementById('multiple_mail_action_bottom').value=this.id.replace('action_','').replace('_bottom','');
			document.getElementById('multiple_mail_action_bottom_action').value=1;
			if (document.getElementById('action_more_bottom')){document.getElementById('action_more_bottom').name='disabled';}
			document.getElementById('main_form').submit();
		});
		$('#action_select_top,#action_select_bottom').change(function(){
			this.parentNode.getElementsByTagName('input')[0].checked=select(this.value);
		});
		
		$('#action_more_top,#action_more_bottom').change(function(){
			$('#'+$(this).attr('id')+'_button').replaceWith('<input type="hidden" name="'+$('#'+$(this).attr('id')+'_button').attr('name')+'" value="1" />');
			document.getElementById('main_form').submit();
		});
	}
});
/*******************************/
