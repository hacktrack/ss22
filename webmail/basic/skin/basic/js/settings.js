$(document).ready(function(){
	$('#s_forwarder_forward_older').change(function(){
		if (!$('#s_forwarder_forward_older').attr('checked'))
		{
			$('#s_forwarder_days').attr('disabled','disabled');
			$('#s_forwarder_forward_older_to').attr('disabled','disabled');
		}
		else
		{
			$('#s_forwarder_days').removeAttr('disabled');
			$('#s_forwarder_forward_older_to').removeAttr('disabled');
		}
	});
	
	if (!$('#s_forwarder_forward_older').attr('checked'))
	{
		$('#s_forwarder_days').attr('disabled','disabled');
		$('#s_forwarder_forward_older_to').attr('disabled','disabled');
	}
	
	if ($('#s_forwarder_forward_to').val()=='')
	{
		$('#s_forwarder_keep_in_inbox').attr('checked','checked');
		$('#s_forwarder_keep_in_inbox').attr('disabled','disabled');
	}
	$('#s_forwarder_forward_to').keyup(function(){
		if (this.value=='')
		{
			$('#s_forwarder_keep_in_inbox').attr('checked','checked');
			$('#s_forwarder_keep_in_inbox').attr('disabled','disabled');
		}
		else {$('#s_forwarder_keep_in_inbox').removeAttr('disabled');}
	});
});