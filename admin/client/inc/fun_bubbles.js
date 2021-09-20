function fun_bubbles() {};
_me = fun_bubbles.prototype;

_me.__constructor = function () {};

_me._init = function () {
	var bubblesScore = document.createElement('div');
	bubblesScore.setAttribute('id', 'bubblesScore');
	bubblesScore.classList.add('bubbles_element');
	document.body.appendChild(bubblesScore);
	this._bubblesScore = bubblesScore;

	this._score = 0;
	this._maxScore = 0;

	this._create('kaboom', 'obj_audio');
	this.kaboom._addSource('client/skins/default/sound/kaboom6.mp3');
	this.kaboom._addSource('client/skins/default/sound/kaboom6.ogg');

	// Hotlinking from this site has been disabled. We're sorry for the inconvenience.
	// me._create('f1','obj_audio');
	// me.f1._addSource('http://www.newgrounds.com/audio/download/532036/?.mp3');
}

_me._setScore = function (score, plus) {
	if (plus) {
		score += this._score;
	}
	if (score > this._maxScore) {
		this._maxScore = score;
	} else if (this._maxScore - score > this._maxScore * 0.08) {
		this._end();
	}
	this._bubblesScore.textContent = this._score = score;
}

_me._end = function () {
	var bubblesResult = document.createElement('div');
	bubblesResult.setAttribute('id', 'bubbles_result');
	bubblesResult.classList.add('bubbles_element');
	bubblesResult.textContent = this._maxScore;
	document.body.appendChild(bubblesResult);

	this._drawTimeout && clearTimeout(this._drawTimeout);
	this._sparkInterval && clearInterval(this._sparkInterval);

	this._bubblesScore.parentNode.removeChild(this._bubblesScore);

	// this.f1._fadeOut(2000);

	[].forEach.call(document.querySelectorAll('.spark'), function (spark) {
		spark.classList.add('end');
	});

	setTimeout(function () {
		[].forEach.call(document.querySelectorAll('.spark'), function (spark) {
			spark.classList.add('end');
		});
	}, 100);

	setTimeout(function () {
		bubblesResult.style.opacity = 0.5;
		bubblesResult.style.cursor = 'pointer';
		bubblesResult.addEventListener('click', function (event) {
			event.preventDefault();
			[].forEach.call(document.querySelectorAll('.bubbles_element'), function (element) {
				element.parentNode.removeChild(element);
			});
		});
	}, 2000);
}

_me._play = function () {
	if (this._sparkInterval) {
		return;
	}
	if (this._score === void 0) {
		this._init();
	}

	// me.f1._playContinuous();

	this._sparkInterval = setInterval(function () {
		var ra = Math.floor(Math.random() * 3000 - (this._score * 10) + 5000);
		if (ra < 3000) {
			ra = 3000;
		}

		var size = Math.floor(Math.random() * 5 + 1);
		var opacity = Math.max(.15, Math.random() - .4);
		var points = Math.round((((8000 - ra) * (7 - size)) * (2 - opacity)) / 1000) + 1;

		var spark = document.createElement('div');
		spark.classList.add('spark');
		spark.classList.add('bubbles_element');
		spark.textContent = points;

		spark.style.opacity = opacity;
		spark.style.lineHeight = '50px';
		spark.style.transform = 'scale(' + size + ')';
		spark.style.transition = 'opacity ' + (ra / 1000) + 's linear, transform ' + (ra / 1000) + 's linear';

		spark.addEventListener('mousedown', this._pop.bind(this));
		spark.addEventListener('touchstart', this._pop.bind(this));
		document.body.appendChild(spark);

		this._setScore(Math.round(-this._score / 50), true);

		this._drawTimeout = setTimeout(function () {
			spark.style.bottom = '-100px';
			spark.style.left = (Math.random() * 100) + '%';
			spark.style.transform = 'translateY(-2000px)';
		}, 200);

		setTimeout(function () {
			spark.remove()
		}, ra);
	}.bind(this), 800);
}

_me._pop = function (event) {
	var target = event.target;
	var points = +target.textContent;
	event.preventDefault;
	this._setScore(points, true);
	this.kaboom._play();

	target.style.backgroundColor = 'red';
	target.style.transform = 'scale(4)';
	target.style.opacity = 0;
	target.style.transitionDuration = '0.5s';
	target.style.pointerEvents = 'none';
	console.log(points, this._score);
};
