/*******************************/
$(document).ready(function(){
	$('#multiple_mail_action_top').change(function(){
		if (this.value=='copy' || this.value=='move')
		{
			$('#select_folder_top').show();
		}
		else
		{
			$('#select_folder_top').hide();
		}
	});
	$('#multiple_mail_action_bottom').change(function(){
		if (this.value=='copy' || this.value=='move')
		{
			$('#select_folder_bottom').show();
		}
		else
		{
			$('#select_folder_bottom').hide();
		}
	});
});

function select(what)
{	
        var x = document.getElementById('tGrid').getElementsByTagName('input');
        for (var i = 0; i < x.length; i++) 
		{
        	var tridy=x[i].parentNode.className.split(' ');
	    	if (x[i].type=='checkbox')
	    	{
	    		x[i].checked=false;
	    		if (what=='all')
	    		{
	    			x[i].checked=true;
				} 
				if (what=='none')
	    		{
	    			x[i].checked=false;
				}
				if (what=='read' && !in_array('unread',tridy))
	    		{
	    			x[i].checked=true;
				}
				if (what=='unread' && in_array('unread',tridy))
	    		{
	    			x[i].checked=true;
				}
	    	}
		}
}
/*******************************/