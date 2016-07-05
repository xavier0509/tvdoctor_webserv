document.write("<script language=javascript src='js/webclient.js' charset=\"utf-8\"></script>");

function answer(questionId){
	var list=document.getElementsByName('answer');
	
	for (var i = 0; i < list.length; i++) {
		var num = i;
		var id = "no" + num;
		printlog(id);
		document.getElementById(id).style.display="none";	
	}
	printlog(questionId);
	showId = "no" + questionId;
	document.getElementById(showId).style.display="block";
}