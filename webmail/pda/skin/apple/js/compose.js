window.onload=function(){
	var cc_bcc=false;

	if(document.getElementById('cc_field') && document.getElementById('cc_field').value!=''){
		document.getElementById('cc').style.display="";
		document.getElementById('bcc').style.display="";
		cc_bcc=true;
	}
	
	if(document.getElementById('cc_bcc'))
	{
		document.getElementById('cc_bcc').onclick=function(){
			if(cc_bcc)
			{
				document.getElementById('cc').style.display="none";
				document.getElementById('bcc').style.display="none";
				cc_bcc=false;
			}
			else
			{
				document.getElementById('cc').style.display="";
				document.getElementById('bcc').style.display="";
				cc_bcc=true;
			}
		};
	}

	// call there because the onload attribute in BODY tag is overloaded by "window.onload" definition
	addTokenParam();
}