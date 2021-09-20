function urlencode (str) {
	str = (str+'').toString()
	return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
}

function initPage() {

	// Make it possible to changing languages
	document.getElementById('languages').onchange = function(e) {
		var sel = this.options.selectedIndex;
		var lang = this.options[sel].value;
		var checker=helper.setCookie('wall',lang,365);
		location.href='?language='+lang;
	}

}
