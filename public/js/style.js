window.onload = function() {
	var el = document.getElementById('cloud');
	var opacity = el.innerHTML;
	console.log(el);
	el.setAttribute("style", "background-color: rgba(128,128,128,"+opacity+")");

	var fog = document.getElementById('fog');
	var foggy = isFoggy();

	if (foggy) {
		fog.innerHTML = "FOGGY";
	} else if (!foggy) {
		fog.innerHTML = "NOT FOGGY";
	} else {
		fog.innerHTML = "WTF";
	}

	// fog.setAttribute("style", "background-color: rgba(128,")
};