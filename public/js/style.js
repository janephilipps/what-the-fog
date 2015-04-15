window.onload = function() {
	var el = document.getElementById('cloud');
	var opacity = el.innerHTML;
	console.log(el);
	el.setAttribute("style", "background-color: rgba(128,128,128,"+opacity+")");

	var fog = document.getElementById('fog');
	var foggy = isFoggy();

	if (foggy) {
		fog.innerHTML = "Yep.";
		fog.setAttribute("style", "opacity: .5");
	} else {
		fog.innerHTML = "Nope.";
		fog.setAttribute("style", "opacity: 1")
	}

	if (opacity >= 0 && opacity < .25) {
		cloudy.innerHTML = "A little."
	} else if (opacity >= .25 && opacity < .5) {
		cloudy.innerHTML = "Kinda sorta."
	} else if (opacity >= .5 && opacity < .75) {
		cloudy.innerHTML = "Totally."
	} else {
		cloudy.innerHTML = "Much clouds."
	}

	// fog.setAttribute("style", "background-color: rgba(128,")
};