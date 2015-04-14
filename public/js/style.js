window.onload = function() {
	var el = document.getElementById('cloud');
	var opacity = el.innerHTML;
	console.log(el);
	el.setAttribute("style", "background-color: rgba(128,128,128,"+opacity+")");
};