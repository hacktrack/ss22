(function () {
	var menu_buttons = [].slice.call(document.querySelectorAll('.o-choose-users__buttons a'));

	function copyToClipboard(el) {
		var clipboard = new Clipboard(el, {
			target: function (trigger) {
				return trigger.previousElementSibling;
			}
		});
		clipboard.on('success', function () {
			var copiedClass = 'copied';

			[].slice.call(document.querySelectorAll('.' + copiedClass)).forEach(function (el) {
				clearTimeout(el.timer);
				el.classList.remove(copiedClass);
			});

			el.classList.add(copiedClass);
			el.timer = setTimeout(function () {
				el.classList.remove(copiedClass);
			}, 2500);
		}).on('error', function () {

		});
	}

	function changeMenu(evt) {
		evt.preventDefault();
		menu_buttons.forEach(function (el) {
			el.classList.remove('is-active');
		});
		evt.target.classList.add('is-active');

		var type = evt.target.getAttribute('data-type');
		var els = {
			win: [].slice.call(document.querySelectorAll('.show-win')),
			mac: [].slice.call(document.querySelectorAll('.show-mac')),
			linux: [].slice.call(document.querySelectorAll('.show-linux'))
		};
		[].concat(els.win, els.mac, els.linux).forEach(function (el) {
			el.setAttribute('hidden', true);
		});
		els[type].forEach(function (el) {
			el.removeAttribute('hidden');
		});
	}

	function bindEvents() {
		[].slice.call(document.querySelectorAll('.copy_email')).forEach(function (el) {
			copyToClipboard(el);
		});
		menu_buttons.forEach(function (el) {
			el.addEventListener('click', changeMenu);
		});
	}

	bindEvents();
})();