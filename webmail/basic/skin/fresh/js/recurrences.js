$(document).ready(function(){
	
	var defaults='';
	$('#repeating_table textarea,#repeating_table input[type!=\'hidden\']').each(function(){
		var defaultValue='';
		if ($(this).attr('alt')){defaultValue=$(this).attr('alt');}
		defaults+='<input type="hidden" name="'+this.name+'" value="'+defaultValue+'"/>';
	});
	$('#repeatingDefaults').html(defaults);
	
	$('.defaultItem').each(function(){
		var query='[name=\"'+this.name+'\"]';
		//alert(query);
		var ch=0;
		$(query).each(function(){
			if($(this).is(':checked')){
				ch++;
			}
		});
		if (ch==0)
		{
			$(this).prop('checked',true);
		}
	});
	
	
	$(".liveItem").attr('disabled','disabled');
	$(".liveItem2").attr('disabled','disabled');
	$(".liveBox").hide();
	
	$('.liveRadio').click(function(){
		var rel=$(this).attr('rel');
		$(".liveItem").attr('disabled','disabled');
		$("."+rel).removeAttr('disabled');
	});
	
	$('.liveRadio2').click(function(){
		var rel=$(this).attr('rel');
		$(".liveItem2").attr('disabled','disabled');
		$("."+rel).removeAttr('disabled');
	});
	
	$('.mainRadio').click(function(){
		var rel=$(this).attr('rel');
		$(".liveBox").hide();
		$("."+rel+"_box").show();
		
		$('.liveRadio[disabled!=\'disabled\'],.liveRadio[disabled!=\'disabled\']').each(function(){
			if(!this.disabled && this.checked)
			{
				var rel=$(this).attr('rel');
				if(rel)
				{
					$("."+rel).removeAttr('disabled');
				}
			}
		});
	});
	
	$('.liveRadio[disabled!=\'disabled\'],.liveRadio2[disabled!=\'disabled\']').each(function(){
		if(this.checked)
		{
			var rel=$(this).attr('rel');
			if(rel)
			{
				$("."+rel).removeAttr('disabled');
				$("."+rel+'_box').show();
			}
		}
	});
});