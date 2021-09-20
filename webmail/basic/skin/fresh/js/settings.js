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
	
	$('form.rsa').each(function(){
		var sKey=$(this).attr('rsa');
		var that=this;
		$(this).submit(function(){
			var rsa = new RSAKey();
			rsa.setPublic(sKey, '10001');
			$('.rsa',that).each(function(){
				if($(this).val()!='')
				{
					$(this).val(rsa.encrypt($(this).val()));
				}
			});
		});
	});
});