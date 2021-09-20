function htmlspecialchars (string, quote_style, charset, double_encode) {
  var optTemp = 0,
    i = 0,
    noquotes = false;
  if (typeof quote_style === 'undefined' || quote_style === null) {
    quote_style = 2;
  }
  string = string.toString();
  if (double_encode !== false) { // Put this first to avoid double-encoding
    string = string.replace(/&/g, '&amp;');
  }
  string = string.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  var OPTS = {
    'ENT_NOQUOTES': 0,
    'ENT_HTML_QUOTE_SINGLE': 1,
    'ENT_HTML_QUOTE_DOUBLE': 2,
    'ENT_COMPAT': 2,
    'ENT_QUOTES': 3,
    'ENT_IGNORE': 4
  };
  if (quote_style === 0) {
    noquotes = true;
  }
  if (typeof quote_style !== 'number') { // Allow for a single string or an array of string flags
    quote_style = [].concat(quote_style);
    for (i = 0; i < quote_style.length; i++) {
      // Resolve string input to bitwise e.g. 'ENT_IGNORE' becomes 4
      if (OPTS[quote_style[i]] === 0) {
        noquotes = true;
      }
      else if (OPTS[quote_style[i]]) {
        optTemp = optTemp | OPTS[quote_style[i]];
      }
    }
    quote_style = optTemp;
  }
  if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
    string = string.replace(/'/g, '&#039;');
  }
  if (!noquotes) {
    string = string.replace(/"/g, '&quot;');
  }

  return string;
}


function urlencode (str) {
  str = (str + '').toString();
  // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
  return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
  replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
}


function var_dump(arr,fce,num){
	var ap="",out="",tstr="";
	num = num || 0;

	if (typeof(arr) == 'string') {return arr;}

	for (var ii=0; ii<num; ii++) ap += ".";
	for (var i in arr){
		if (typeof arr[i] == 'object'){
			if (arr[i].constructor == Date)
				out += ap+" ["+i+"](date) = " + arr[i].toString()+"\r\n";
			else
			if (arr[i]._name && arr[i]._type)
				out += ap+" ["+i+"]("+ arr[i]._type +") = "+ arr[i]._name +"\r\n";
			else
				out += ap+" ["+i+"]\r\n" + var_dump(arr[i],fce,num+2);
		}
		else{
			if (typeof arr[i] == 'undefined')
				tstr = 'undefined'; //continue;
			else
				tstr = arr[i].toString();

			out += ap+" ["+i+"]("+typeof arr[i] +") = "+tstr+"\r\n";
		}
	}
	return out;
};

/****/
/****/

var iq={};
iq.readCookie=function(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {var c = ca[i];while (c.charAt(0)==' ') c = c.substring(1,c.length);if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);}
	return null;
}
iq.uid=function()
{
	if(document.getElementById('uid')){return htmlspecialchars(document.getElementById('uid').value);}else{return '';}
}
iq.prepare=function(data)
{
	console.log(data);
	return data;
	//return eval("("+data+")");
}
iq.get=function(query,callback)
{
	query=query.replace(/{SID}/g,iq.readCookie('PHPSESSID_BASIC'));
	query=query.replace(/{UID}/g,iq.uid());
	query=query.replace(/{CTZ}/g,(new Date().getTimezoneOffset())*(-1));
	
	/*
	$.ajax({
		url: '../server/webmail.php',
		data: query,
		type: 'POST',
		contentType: "text/xml",
		dataType: "text",
		success : function(data){
			data=iq.prepare(data);
			callback(data);
		},
		error : function (xhr, ajaxOptions, thrownError){
		console.log(xhr.status);
		console.log(thrownError);
		}
	}); 
	*/
	$.post('../server/webmail.php',query,function(data){
		data=iq.prepare(data);
		callback(data);
	});
	
}