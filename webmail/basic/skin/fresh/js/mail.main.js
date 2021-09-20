/*******************************/
$(document).ready(function(){
/*********************** FLAGS *************************/
var flags=['Z','1','2','3','5','8','A','Y'];
$('.flags').click(function(){
	var time=Math.floor(new Date().getTime()/1000);
	var val=this.title.split('|');
	var index=0;
	for(var i=0; i<flags.length; i++)
	{
		if(flags[i]==val[0])
		{
			index=i;
		}
	}
	var next=parseInt(index+1);

	if (this.lastClick && (time-5)<this.lastClick)
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
/*******************************/
});