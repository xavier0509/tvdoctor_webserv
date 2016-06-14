document.write("<script language=javascript src='js/webclient.js' charset=\"utf-8\"></script>");
Date.prototype.format = function(format){ 
	var o = { 
		"M+" : this.getMonth()+1, //month 
		"d+" : this.getDate(), //day 
		"h+" : this.getHours(), //hour 
		"m+" : this.getMinutes(), //minute 
		"s+" : this.getSeconds(), //second 
		"q+" : Math.floor((this.getMonth()+3)/3), //quarter 
		"S" : this.getMilliseconds() //millisecond 
	} 

	if(/(y+)/.test(format)) { 
		format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
	} 

	for(var k in o) { 
		if(new RegExp("("+ k +")").test(format)) { 
			format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
		} 
	} 
	return format; 
} 

var time = new Date().format("yyyy-MM-dd");
document.getElementById('selectEnd').value = time;
var node = document.getElementById('selectStart');
node.value = "2016-01-01";
var userName = document.getElementById('selectName');
var activeId = document.getElementById('selectActiveId');
var user_list = [];
var table_node = document.getElementById("user_info_table");
var user_data_current_page_index = 0;
var tab_emlent_limit = 9;


function selectAction(){
    // userName = userName.value;
    // activeId = activeId.value;
    user_list = [];
    var userName = document.getElementById('selectName').value;
    var activeId = document.getElementById('selectActiveId').value;
    var selectStartValue = document.getElementById('selectStart').value;
    var selectStartTime = Math.floor((new Date(selectStartValue.replace(/-/g,   "/"))).getTime() / 1000)+86400;
    var selectEndValue = document.getElementById('selectEnd').value;
    var selectEndTime = Math.floor((new Date(selectEndValue.replace(/-/g,   "/"))).getTime() / 1000)+86400;
    var data = '{"userName":"' + userName + '","activeId": "' + activeId +'","loginTime":"'+selectStartTime+'","logoutTime":"'+selectEndTime+'"}';
    console.log(data);
    var  urladdr = httpurl + "/php/record_action.php?action=query_records&msg=" + data;
    console.log("urladdr = " + urladdr);
    //sendHTTPRequest(urladdr, loginfunc);  
    sendHTTPRequest(urladdr,selectActionfunc);
}

function selectActionfunc(){
	console.log("this.readyState = " + xmlhttp.readyState);
    if (xmlhttp.readyState == 4) {
        console.log("this.status = " + this.status);
        console.log("this.responseText = " + this.responseText);
        if (xmlhttp.status == 200) //TODO
        {
            var data = this.responseText;
            console.log(data);
            var array = data.split("<br />");
        for(var i = 0; i < array.length; i++) {
            var line = array[i];
            var array2 = line.split("<a>");
            if(14 == array2.length){ 
                var node = {};
                node.userName = array2[0];
                node.realName = array2[1];
                node.department = array2[2];
                node.activeId = array2[3];
                node.loginTime = array2[4];
                node.logoutTime = array2[5];
                node.connectRequestTime = array2[6];
                node.connectFlag = array2[7];
                node.connectedTime = array2[8];
                node.disconnectedTime = array2[9];
                node.machineCore = array2[10];
                node.machineType = array2[11];
                node.version = array2[12];
                node.issue = array2[13];
                user_list.push(node);
            }  
        }
        showUserInfo();
        }
    }
}

function showUserInfo () {

    var rows = table_node.rows.length; 
    while(rows > 1) {
        table_node.deleteRow(rows - 1);
        rows--; 
    }
    var data_left = user_list.length - (user_data_current_page_index * tab_emlent_limit);

    var limit = tab_emlent_limit > data_left ? data_left : tab_emlent_limit;

    var data_rows = user_list.length;

    var tab_counts = user_list.length / tab_emlent_limit;

    if (Math.ceil(tab_counts) != Math.floor(tab_counts)) {
        tab_counts = Math.ceil(tab_counts);
    }
    list_total_id_node.innerHTML = data_rows;
    tab_index_id_node.innerHTML = (user_data_current_page_index + 1) + "/" + tab_counts;
    for (var i = 0; i < limit; ++i) {
        var data_index = i + user_data_current_page_index * tab_emlent_limit;
        var newrows = table_node.insertRow(i + 1);
        if (0 == (i + 1) % 2) {
            // /newrows.style.backgroundColor = "#e3e6ea"; //#f7f8fa
            newrows.style.backgroundColor = "#f7f8fa"; //#f7f8fa
            //newrows.style.opacity = 0.27;
        }

        var userName_node = newrows.insertCell(0);
        userName_node.innerHTML = user_list[data_index].userName;

        var realName_node = newrows.insertCell(1);
        realName_node.innerHTML = user_list[data_index].realName;

        var department_node = newrows.insertCell(2);
        department_node.innerHTML = user_list[data_index].department;

        var activeId_node = newrows.insertCell(3);
        //option_node.innerHTML = user_list[i].option;
        activeId_node.innerHTML = user_list[data_index].activeId;

        var loginTime_node = newrows.insertCell(4);
        loginTime_node.innerHTML = user_list[data_index].loginTime;

        var logoutTime_node = newrows.insertCell(5);
        logoutTime_node.innerHTML = user_list[data_index].logoutTime;

        var connectRequestTime_node = newrows.insertCell(6);
        connectRequestTime_node.innerHTML = user_list[data_index].connectRequestTime;

        var connectFlag_node = newrows.insertCell(7);
        connectFlag_node.innerHTML = user_list[data_index].connectFlag;

        var connectedTime_node = newrows.insertCell(8);
        connectedTime_node.innerHTML = user_list[data_index].connectedTime;

        var disconnectedTime_node = newrows.insertCell(9);
        disconnectedTime_node.innerHTML = user_list[data_index].disconnectedTime;

        var machineCore_node = newrows.insertCell(10);
        machineCore_node.innerHTML = user_list[data_index].machineCore;

        var machineType_node = newrows.insertCell(11);
        machineType_node.innerHTML = user_list[data_index].machineType;

        var version_node = newrows.insertCell(12);
        version_node.innerHTML = user_list[data_index].version;

        var issue_node = newrows.insertCell(13);
        issue_node.innerHTML = user_list[data_index].issue;


    }
    if (0 == limit) {
        prev_page();
    }
}
function home_page () {
    user_data_current_page_index = 0;
    showUserInfo();
}

function prev_page () {

    --user_data_current_page_index;
    if (0 > user_data_current_page_index) {
        user_data_current_page_index = 0;
    }
    showUserInfo();
}

function next_page () {
    var tab_counts = user_list.length / tab_emlent_limit;
    if (Math.ceil(tab_counts) != Math.floor(tab_counts)) {
        tab_counts = Math.ceil(tab_counts);
    }
    ++user_data_current_page_index;
    if (tab_counts <= user_data_current_page_index) {
        user_data_current_page_index = tab_counts - 1;
    }
    showUserInfo();
}

function end_page () {
    var tab_counts = user_list.length / tab_emlent_limit;
    if (Math.ceil(tab_counts) != Math.floor(tab_counts)) {
        tab_counts = Math.ceil(tab_counts);
    }
    user_data_current_page_index = tab_counts - 1;
    showUserInfo();
}