function getCookie(name)
{
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1){
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }else{
        begin += 2;
    }
    var end = document.cookie.indexOf(";", begin);
    if (end == -1){
        end = dc.length;
    }
    return unescape(dc.substring(begin + prefix.length, end));
}

function CheckAll(name,state,formname){
  var dFrm = document.forms[formname];
  var dElms = dFrm.elements;
  var iLength = dElms.length;
  var dElm;
  for (var i = 0;i < iLength;i++){
    dElm = dElms[i];
    if(dElm.name==name){
      dElm.checked = state;
    }
  }

  return true;
}

function Login(sKey,form,b)
{
	var dPwd = form.password;
	var sPwd = dPwd.value;
	//if(form.cipher.checked){
		//Prepare RSA library
		var rsa = new RSAKey();
		rsa.setPublic(sKey, '10001');
		var password_rsa = document.createElement('input');
		password_rsa.type = 'hidden';
		password_rsa.name = 'password_rsa';
		password_rsa.value = rsa.encrypt(sPwd);
		form.appendChild(password_rsa);
		form.password.value = '*****';
	//}
	return true;
}

function urlencode( str ) {
    // http://kevin.vanzonneveld.net
    // +   original by: Philip Peterson
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: AJ
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // %          note: info on what encoding functions to use from: http://xkr.us/articles/javascript/encode-compare/
    // *     example 1: urlencode('Kevin van Zonneveld!');
    // *     returns 1: 'Kevin+van+Zonneveld%21'
    // *     example 2: urlencode('http://kevin.vanzonneveld.net/');
    // *     returns 2: 'http%3A%2F%2Fkevin.vanzonneveld.net%2F'
    // *     example 3: urlencode('http://www.google.nl/search?q=php.js&ie=utf-8&oe=utf-8&aq=t&rls=com.ubuntu:en-US:unofficial&client=firefox-a');
    // *     returns 3: 'http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3Dphp.js%26ie%3Dutf-8%26oe%3Dutf-8%26aq%3Dt%26rls%3Dcom.ubuntu%3Aen-US%3Aunofficial%26client%3Dfirefox-a'

    var histogram = {}, histogram_r = {}, code = 0, tmp_arr = [];
    var ret = str.toString();

    // The histogram is identical to the one in urldecode.
    histogram['!']   = '%21';
    histogram['%20'] = '+';

    // Begin with encodeURIComponent, which most resembles PHP's encoding functions
    ret = encodeURIComponent(ret);

    for (search in histogram) {
        replace = histogram[search];
        tmp_arr = ret.split(search); // Custom replace
        ret = tmp_arr.join(replace);
    }

    // Uppercase for full PHP compatibility
    return ret.replace(/(\%([a-z0-9]{2}))/g, function(full, m1, m2) {
        return "%"+m2.toUpperCase();
    });

    return ret;
}

/**/

window.visibleTab='loginfulltab';

function showhide(co,tab)
{
	if (window.visibleTab!=co)
	{
		tab.className="tab activeTab";
		document.getElementById(window.visibleTab).style.display="none";
		document.getElementById(co).style.display="block";
		if (!window.activeTab) window.activeTab=document.getElementById('logintab');
		window.activeTab.className="tab";
		window.visibleTab=co;
		window.activeTab=tab;
	}
}