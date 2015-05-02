window.onload = function() {
	var el = document.getElementById('cloud');
	var opacity = parseFloat(el.innerHTML) / 100;
	console.log(el);
	el.setAttribute("style", "background-color: rgba(255,255,255,"+opacity+")");

	var fog = document.getElementById('fog');
	var foggy = isFoggy();

	if (foggy) {
		fog.innerHTML = "Yep.";
		fog.setAttribute("style", "opacity: .5");
	} else {
		fog.innerHTML = "Nope.";
		fog.setAttribute("style", "opacity: 1")
	}

	// console.log("["+opacity+"]");
	// console.log(typeof opacity);

	if (opacity === 0) {
		cloudy.innerHTML = "Not cloudy.";
	} else if (opacity > 0 && opacity < .25) {
		cloudy.innerHTML = "A little cloudy.";
	} else if (opacity >= .25 && opacity < .5) {
		cloudy.innerHTML = "Kinda sorta cloudy.";
	} else if (opacity >= .5 && opacity < .75) {
		cloudy.innerHTML = "Totally cloudy.";
	} else if (opacity >= .75 && opacity < 1) {
		cloudy.innerHTML = "Much clouds.";
	} else {
		cloudy.innerHTML = "Too cloudy.";
	}

	// fog.setAttribute("style", "background-color: rgba(128,")
};