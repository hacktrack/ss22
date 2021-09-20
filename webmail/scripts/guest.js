(function () {
	function urlencode(str) {
		str = (str + '').toString();
		return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
	}

	function getData(url, callback, context) {
		var AJAX;
		if (window.XMLHttpRequest) {
			AJAX = new XMLHttpRequest();
		} else {
			AJAX = new ActiveXObject("Microsoft.XMLHTTP");
		}
		if (AJAX) {
			AJAX.open("GET", url, callback ? true : false);
			AJAX.send(null);
			return AJAX.responseText;
		} else {
			return false;
		}
	}

	function validate(rules) {
		var result = rules.map(function (rule) {
			if (typeof rule.nodes !== 'undefined') {
				return rule.func(rule.nodes[0], rule.nodes[1]);
			} else {
				return rule.func(rule.node);
			}
		});
		return result.some(function (r) {
			return !r;
		});
	}

	function login(sKey, form, e) {
		e.preventDefault();
		var validation = [
			{node: document.getElementById('login_password'), func: empty},
			{node: document.getElementById('confirm_login_password'), func: empty},
			{node: document.getElementById('login_login'), func: empty},
			{nodes: [document.getElementById('login_password'), document.getElementById('confirm_login_password')], func: checkPassword}
		];
		if (validate(validation)) {
			return false;
		}
		var dPwd = document.getElementById('login_password'), request = new Request({method: 'POST', url: form.getAttribute('action')});
		request.on('load', function (e) {
			console.log(e.target.response);
			document.getElementById('slide').setAttribute('data-active', 1);
		});

		var time = Math.floor(new Date().getTime() / 1000);
		if (document.getElementById('time')) {
			var newTime = getData('./shortcuts.php?t&' + time);
			if (newTime) {
				time = newTime;
			} else {
				time = document.getElementById('time').value;
			}
		}
		var rPwd = 'p=' + urlencode(document.getElementById('login_password').value) + '&t=' + time;

		var pVal = dPwd.value.split('').map(function () {
			return '*';
		}).join('');

		// uncomment this line to replace PWD with stars
		document.getElementById('confirm_login_password').value = dPwd.value = pVal;

		//Prepare RSA library
		var rsa = new RSAKey();
		rsa.setPublic(sKey, '10001');
		var password_rsa = document.createElement('input');
		password_rsa.type = 'hidden';
		password_rsa.name = 'password_rsa';
		password_rsa.value = rsa.encrypt(rPwd);
		form.appendChild(password_rsa);
		request.send(new FormData(form));
	}

	function findTextNodes(el) {
		var n, a = [], walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
		while (n = walk.nextNode())
			a.push(n);
		return a;
	}

	function replacePlaceholders() {
		var data = [], params, query = decodeURIComponent(window.location.href).split('?');
		query.shift();
		query = query.join('?');
		var regex = /(.*?)=(.*?)(&|$)/g;
		while ((params = regex.exec(query)) !== null) {
			data.push({key: params[1], value: params[2]});
		}
		if (App.sender_name != '' && App.sender_name != 'undefined') {
			data.push({key: 'sender_name', value: App.sender_name});
		}
		findTextNodes(document.body).forEach(function (node) {
			data.forEach(function (variable) {
				node.textContent = node.textContent.replace('{' + variable.key + '}', variable.value);
			});
		});
	}

	function checkPassword(pass1, pass2) {
		var match = pass1.value === pass2.value;
		pass2.parentElement.querySelector('.error-bubble__content').textContent = i18n.t('exceptions.missing_values');
		pass2.parentElement.classList[match ? 'remove' : 'add']('has-error');
		return match;
	}

	function empty(el) {
		var text = el.getAttribute('name') === 'name' ? 'exceptions.account_no_username' : 'exceptions.account_no_password';
		el.parentElement.querySelector('.error-bubble__content').textContent = i18n.t(text);
		el.parentElement.classList[el.value ? 'remove' : 'add']('has-error');
		return el.value;
	}

	window.onload = function () {
		var form = document.getElementById("guest_form");
		form.onsubmit = login.bind(this, form.getAttribute("name"), form);
		i18n.init('./language/' + App.language + '/lang.xml');
		replacePlaceholders();
		var pass = document.getElementById('login_password'), confirm_pass = document.getElementById('confirm_login_password'), name = document.getElementById('login_login');
		name.addEventListener('focusout', empty.bind(this, name));
		pass.addEventListener('focusout', empty.bind(this, pass));
		confirm_pass.addEventListener('focusout', empty.bind(this, confirm_pass));
		confirm_pass.addEventListener('focusout', checkPassword.bind(this, pass, confirm_pass));
	};
})();