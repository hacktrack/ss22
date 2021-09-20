$(document).ready(function(){
	$('table.datagrid td').click(function(event){
		var input = $(this).find('input:first').attr('type');
		if (!input || input!='checkbox')
		{
			var target = $(this).find('a:first').attr('href');
			if (target)
			{
				open(target,'_self');
			}
		}
		else
		{
			//alert(input);
		}
	});
	$('table.datagrid td a,table.datagrid td input').click(function(event) {
		var agent = jQuery.browser;
		if(agent.msie) {
			event.cancelBubble = true;
		} else {
			event.stopPropagation();
		}
	});
});