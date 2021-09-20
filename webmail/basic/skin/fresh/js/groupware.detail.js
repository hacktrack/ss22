$(document).ready(function(){
	
	$('.infinite_year').change(function(){
		var html='';
		var year=parseInt($(this).val());
		var selected='';
		for(var i=(year-10); i<=(year+10); i++)
		{
			if (i==year){selected=' selected="selected"';} else {selected='';}
			html+="<option value=\""+i+"\""+selected+">"+i+"</option>";
		}
		$(this).html(html);
	});
	
	
	$('.check_date_first select').addClass('cd_first');
	$('.check_date_second select').addClass('cd_second');
	$('.check_date_first select,.check_date_second select').change(function(){
		var day=$('.check_date_first select.day').val();
		if (day.length==1){day='0'+day;}
		var month=$('.check_date_first select.month').val();
		if (month.length==1){month='0'+month;}
		var year=$('.check_date_first select.year').val();
		if ($('.check_date_first select.minutes').hasClass('minutes'))
		{
			var minutes=$('.check_date_first select.minutes').val();
			if (minutes.length==1){minutes='0'+minutes;}
			var hours=$('.check_date_first select.hours').val();
			if (hours.length==1){hours='0'+hours;}
			var num=parseInt(''+year+month+day+hours+minutes);
		}
		else
		{
			var num=parseInt(''+year+month+day);
		}
		
		var day2=$('.check_date_second select.day').val();
		if(day2)
		{
			if (day2.length==1){day2='0'+day2;}
			var month2=$('.check_date_second select.month').val();
			if (month2.length==1){month2='0'+month2;}
			var year2=$('.check_date_second select.year').val();
			if ($('.check_date_second select.minutes').hasClass('minutes'))
			{
				var minutes2=$('.check_date_second select.minutes').val();
				if (minutes2.length==1){minutes2='0'+minutes2;}
				var hours2=$('.check_date_second select.hours').val();
				if (hours2.length==1){hours2='0'+hours2;}
				var num2=parseInt(''+year2+month2+day2+hours2+minutes2);
			}
			else
			{
				var num2=parseInt(''+year2+month2+day2);
			}
			
			if (num2<num)
			{
				if ($(this).hasClass('cd_first'))
				{
					$('.check_date_second select.day').val($('.check_date_first select.day').val());
					$('.check_date_second select.month').val($('.check_date_first select.month').val());
					$('.check_date_second select.year').val($('.check_date_first select.year').val());
					$('.check_date_second select.hours').val($('.check_date_first select.hours').val());
					$('.check_date_second select.minutes').val($('.check_date_first select.minutes').val());
				}
				else
				{
					$('.check_date_first select.day').val($('.check_date_second select.day').val());
					$('.check_date_first select.month').val($('.check_date_second select.month').val());
					$('.check_date_first select.year').val($('.check_date_second select.year').val());
					$('.check_date_first select.hours').val($('.check_date_second select.hours').val());
					$('.check_date_first select.minutes').val($('.check_date_second select.minutes').val());
				}
			}
		}
	});
});