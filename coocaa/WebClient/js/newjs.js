function window1(){
	document.getElementById('first').style.display="block";
	// document.getElementById('second').style.display="none";
	document.getElementById('third').style.display="none";
}
function window2(){
	document.getElementById('first').style.display="none";
	// document.getElementById('second').style.display="block";
	document.getElementById('third').style.display="block";
}
// function window3(){
// 	document.getElementById('first').style.display="none";
// 	document.getElementById('second').style.display="none";
// 	document.getElementById('third').style.display="block";
// }

var isClick = false;
var isMoveOn = false;
function recovery (str) {
	// body...
	var dest = str;
	if (-1 != dest.indexOf("_click.png")) {
		 dest = dest.replace("_click.png", ".png");
	}

	if (-1 != dest.indexOf("_hover.png")) {
		dest = dest.replace("_hover.png", ".png");
	}
	return dest;
}

function click_img (obj) {
	// body...
	//isClick = true;
	var str = obj.src;
	//str = recovery(str);
	if (-1 != str.indexOf("_hover.png")) {
		str = str.replace("_hover.png", ".png");
		isMoveOn = true;
	}
	obj.src = str.replace(".png", "_click.png");
	// obj.style.color = "red";
	
}

function release_img (obj) {
	// body...
	var str = obj.src;
	str = recovery(str);
	if (isMoveOn) {
		str = str.replace(".png", "_hover.png");
	}
	obj.src = str;
	//obj.src = str.replace("_click.png", ".png");
	// obj.style.color = "white";
}

function mouseOver (obj) {
	// body...
	//isMoveOn = true;
	var str = obj.src;
	str = recovery(str);
	obj.src = str.replace(".png", "_hover.png");
	// obj.style.color = "white";
}

function mouseOut (obj) {
	// body...
	var str = obj.src;
	str = recovery(str);
	obj.src = str;
	//obj.src = str.replace("_hover.png", ".png");
}
