function answer(no){
	var list=document.getElementsByName('answer');
	
	for (var i = 0; i < list.length; i++) {
		var num = i + 1;
		var id = "no" + num;
		console.log(id);
		document.getElementById(id).style.display="none";	
	}
	list[no-1].style.display="block";
}