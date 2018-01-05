
document.write("<script language=javascript src='js/httprequest.js' charset=\"utf-8\"></script>");
document.write("<script language=javascript src='js/webclient.js' charset=\"utf-8\"></script>");
document.write("<script language=javascript src='js/md5.js' charset=\"utf-8\"></script>");

var option_innerHTML  = "<input type = \"button\" value = \"编辑\" onclick = \"option_modify(this)\"> / <input type = \"button\" value = \"删除\" onclick = \"option_delete(this)\"> ";

var user_list  = [];

var server_tab_node;
var _permissions_array = ["", "Boss", "Admin", "Engineer", "After-sale"];

var user_tab_node;
var use_list_node;
var table_node;
var tab_emlent_limit = 9;
var user_bottom_node;
var add_user_tab_node;

var user_data_current_page_index = 0;
var current_selected_index = 0;
var list_total_id_node ;
var tab_index_id_node;
var modify_user_tab_node;
var delete_user_element_node;

function test_data () {
	if ( 0 == user_list.length) {
	    user_list = [];
	    for (var i = 0; i < 40; ++i) {
	        var node = {"id":i,"username":"Admin","option":"Admin","passwd":"123456"};
	        user_list.push(node);
	    }
	}

    initUserTable();
}

function information_hide(){

    // document.getElementById("user_tab").style.display = "none";
    hiddenTab();
    document.getElementById("server_table").style.display = "block";
    document.getElementById('usermanage').style.backgroundColor="#404a55";
    document.getElementById('service').style.backgroundColor="#ef5122";
}

function get_user_data () {

    user_list = [];
    var urladdr = httpurl + "/php/listinfo.php?adminname="+adminname;
    sendHTTPRequest(urladdr, getinfofunc);
}

function getinfofunc () {
    if (4 == this.readyState && 200 == xmlhttp.status) {
        var str = this.responseText;
        var array = str.split("\r\n");
        for(var i = 0; i < array.length; i++) {
            var line = array[i];
            var array2 = line.split("<br />");
            if(4 == array2.length){ 
                var node = {};
                node.id = array2[0];
                node.username = array2[1];
                node.passwd =  array2[2];
                node.option = array2[3];
                user_list.push(node);
            }  
        }
        initUserTable();
    }

}

function usermanage(){
    //    var  urladdr = httpurl + "/php/listinfo.php?adminname="+adminname;
    //   sendHTTPRequest(urladdr, listinfofunc);
    hiddenTab();

    user_tab_node = document.getElementById("user_tab");
    user_tab_node.style.display = "block";
    document.getElementById('usermanage').style.backgroundColor="#ef5122";
    document.getElementById('service').style.backgroundColor="#404a55";

    var height = document.body.clientHeight - 70 - 41;
    if (height > 768) {
        height = 720 - 41;
    }
    var width = document.body.clientWidth;
    if (width > 1366) {
        width = 1366;
    }

    user_tab_node.style.height = height + "px";
    user_tab_node.style.width =  width + "px";
    use_list_node = document.getElementById("user_list");
    table_node = document.getElementById("user_info_table");
    user_bottom_node = document.getElementById("user_list_bottom");
    document.getElementById("user_list").style.display = "block";
    document.getElementById("user_list_nodata_label").style.display = "none";

    list_total_id_node = document.getElementById("list_total_id");
    tab_index_id_node = document.getElementById("tab_index_id");

    // document.getElementById("normal").style.display="none";

    // var table = document.getElementById('table');
    // while (table.rows.length > 1) { table.deleteRow(table.rows.length -1);}
    
    //test_data();

    get_user_data();

}

function initUserTable () {
    closeUserTable();
    if (user_list.length > 0) {
        use_list_node.style.height = "551px";
        user_data_current_page_index = 0;
        showUserInfo();

    } else {
        use_list_node.style.height = "310px";
        showEmptyInfo();
    }
}

function closeUserTable () {
     user_bottom_node.style.display = "block";
    document.getElementById("user_list_nodata_label").style.display = "none";
    var rows = table_node.rows.length; 
    while(rows > 1) {
        table_node.deleteRow(rows - 1);
        rows--; 
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

        var id_node = newrows.insertCell(0);
        id_node.innerHTML = user_list[data_index].id;

        var user_node = newrows.insertCell(1);
        user_node.innerHTML = user_list[data_index].username;

        var per_node = newrows.insertCell(2);
        per_node.innerHTML = user_list[data_index].option;

        var option_node = newrows.insertCell(3);
        //option_node.innerHTML = user_list[i].option;
        option_node.innerHTML = option_innerHTML;

    }

    if (0 == limit) {
    	prev_page();
    }
}

function option_modify (obj) {

	showUserBg();
    modify_user_tab_node = document.getElementById("modify_user_tab");
    modify_user_tab_node.style.display = "block";
	current_selected_index = obj.parentNode.parentNode.rowIndex;
	var index = (current_selected_index - 1) + user_data_current_page_index * tab_emlent_limit;
	document.getElementById("modify_user_input_username").value = user_list[index].username;
	document.getElementById("modify_user_input_passwd").value = user_list[index].passwd;
	document.getElementById("modify_user_input_select_id").value = user_list[index].option;

    creatOptionByPermissions(document.getElementById("modify_user_input_select_id"));
}

function option_delete (obj) {

	showUserBg();
    delete_user_element_node = document.getElementById("delete_user_element");
    delete_user_element_node.style.display = "block";

    var name_node = document.getElementById("delete_user_name_label");
    var username = obj.parentNode.parentNode.children[1].innerHTML;
    name_node.innerHTML = username;
    current_selected_index = obj.parentNode.parentNode.rowIndex;
}

function delete_user_bt_cancle () {
	hiddenUserBg();
    delete_user_element_node.style.display = "none";
}

function delete_user_bt_confirm () {
	hiddenUserBg();
    delete_user_element_node.style.display = "none";



    var index = (current_selected_index - 1) + user_data_current_page_index * tab_emlent_limit;

    var id = user_list[index].id;
    var urladdr = httpurl + "/php/user_action.php?action=delete&id=" + id + "&random=000";
    
    sendHTTPRequest(urladdr, deletefunc);

}

function deletefunc () {
    if (4 == this.readyState && 200 == xmlhttp.status) {
        var str = xmlhttp.responseText;
        var json_str = JSON.parse(str)
        if ("OK" == json_str.ret) {
            var index = (current_selected_index - 1) + user_data_current_page_index * tab_emlent_limit;
            user_list.splice(index, 1);
            initUserTable();
        } else {

        }
    }

}

function showEmptyInfo () {
    user_bottom_node.style.display = "none";
    document.getElementById("user_list_nodata_label").style.display = "block";
}

function add_new_user () {

	showUserBg();
    add_user_tab_node = document.getElementById("add_user_tab");
    add_user_tab_node.style.display = "block";
    var width = (window.innerWidth - add_user_tab_node.offsetWidth) / 2;
    add_user_tab_node.style.left = width + "px";
    creatOptionByPermissions(document.getElementById("add_user_input_select_id"));
}

function add_user_bt_cancle () {
	hiddenUserBg();

    if (add_user_tab_node) {
        add_user_tab_node.style.display = "none";
    }
    clear_add_user_bt();
}

var add_user_input_username_node;
var add_user_input_passwd_node;
var add_user_select_node;
var add_user_input_department_node;
var add_user_input_truename_node;
var add_user_input_passwd_md5;

function add_user_bt_confirm () {
	 hiddenUserBg();

    if (add_user_tab_node) {
        add_user_tab_node.style.display = "none";
    }

    if (!add_user_input_truename_node) {
        add_user_input_truename_node = document.getElementById("add_user_input_truename");
    }

    if (!add_user_input_username_node) {
    	add_user_input_username_node = document.getElementById("add_user_input_username");
    }

    if (!add_user_input_passwd_node) {
    	add_user_input_passwd_node = document.getElementById("add_user_input_passwd");
        
    }

    if (!add_user_select_node) {
    	add_user_select_node = document.getElementById("add_user_input_select_id");
    }

    if (!add_user_input_department_node) {
        add_user_input_department_node = document.getElementById("add_user_input_department");
    }

    if (add_user_input_truename_node.value=="") {
        var dialog1 = new singledialog("请输入真实姓名",hidediv);
        document.getElementById('singlecontent').innerHTML=dialog1.content;
        document.getElementById('singlebtnok').onclick=dialog1.ok;
        setTimeout(hidediv,2000);
    }

    else if (add_user_input_username_node.value=="") {
        var dialog1 = new singledialog("请输入用户名",hidediv);
        document.getElementById('singlecontent').innerHTML=dialog1.content;
        document.getElementById('singlebtnok').onclick=dialog1.ok;
        setTimeout(hidediv,2000);
    }
    else if(add_user_input_passwd_node.value == ""){
        var dialog1 = new singledialog("请输入密码",hidediv);
        printlog(add_user_input_passwd_node.value);
        document.getElementById('singlecontent').innerHTML=dialog1.content;
        document.getElementById('singlebtnok').onclick=dialog1.ok;
        setTimeout(hidediv,2000);
    }
    else if(add_user_input_passwd_node.value.length < 6 || add_user_input_passwd_node.value.length > 16){
        var dialog1 = new singledialog("请输入6-16位密码",hidediv);
        document.getElementById('singlecontent').innerHTML=dialog1.content;
        document.getElementById('singlebtnok').onclick=dialog1.ok;
        setTimeout(hidediv,2000);
    }
    else{
        add_user_input_passwd_md5 = md5(add_user_input_passwd_node.value);
        var urladdr = httpurl + "/php/user_action.php?action=add&username=" + add_user_input_username_node.value + 
        "&passwd=" + add_user_input_passwd_md5 + "&option=" + add_user_select_node.value + "&truename=" + add_user_input_truename_node.value + "&department=" + add_user_input_department_node.value + "&random=000";
        
        sendHTTPRequest(urladdr, addfunc);

     
    	clear_add_user_bt();
    }
}

function addfunc () {
    if (4 == this.readyState && 200 == xmlhttp.status) {
        var str = this.responseText;
        var json_str = JSON.parse(str)
        if ("OK" == json_str.ret) {
            var node = {};
            printlog(json_str);
            node.id = json_str.data.id;
            node.username = json_str.data.username;
            node.passwd = json_str.data.passwd;
            node.option = json_str.data.option;
            user_list.push(node);
            //showUserInfo();
            initUserTable();
        } else if("ERROR1" == json_str.ret){
            var dialog1 = new singledialog("添加失败：用户名已存在");
            document.getElementById('singlecontent').innerHTML=dialog1.content;
            setTimeout(hidediv,2000);
        }
    }

}

function clear_add_user_bt () {
	document.getElementById("add_user_input_username").value = "";
	document.getElementById("add_user_input_passwd").value = "";
	document.getElementById("add_user_input_select_id").value = "";
}

function modify_user_bt_cancle () {
	hiddenUserBg();

    if (modify_user_tab_node) {
        modify_user_tab_node.style.display = "none";
    }
}

function modify_user_bt_confirm () {
	hiddenUserBg();
    if (modify_user_tab_node) {
        modify_user_tab_node.style.display = "none";
    }

	var index = (current_selected_index - 1) + user_data_current_page_index * tab_emlent_limit;

    var username = document.getElementById("modify_user_input_username").value ;
    var passwd = document.getElementById("modify_user_input_passwd").value;
    var option = document.getElementById("modify_user_input_select_id").value;
    var id = user_list[index].id;
    var passwdmd5 = md5(passwd);
    var urladdr = httpurl + "/php/user_action.php?action=modify&id="+  id +"&username=" + username + "&passwd=" + passwdmd5 +"&option=" + option + "&random=000";

    sendHTTPRequest(urladdr, modifyfunc);

}

function modifyfunc () {
    if (4 == this.readyState && 200 == xmlhttp.status) {
        var str = this.responseText;
        var json_str = JSON.parse(str)
        if ("OK" == json_str.ret) {
            var node = {};

            node.id = json_str.data.id;
            node.username = json_str.data.username;
            node.passwd = json_str.data.passwd;
            node.option = json_str.data.option;
            var index = (current_selected_index - 1) + user_data_current_page_index * tab_emlent_limit;
            user_list[index] = node;
            showUserInfo()
        } else {

        }
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

function current_tab_index_change (value) {
    var index = parseInt(value);
    if (NaN == index) {
        return ;
    }
     var tab_counts = user_list.length / tab_emlent_limit;
    if (Math.ceil(tab_counts) != Math.floor(tab_counts)) {
        tab_counts = Math.ceil(tab_counts);
    }
    user_data_current_page_index = index - 1;
    if (0 > user_data_current_page_index) {
        return;
    }
    if (tab_counts <= user_data_current_page_index) {
       return;
    }
    showUserInfo();

}
function hiddenTab () {

    if (change_user_info_tab_node) {
        if ("block" == change_user_info_tab_node.style.display) {
            change_user_info_tab_node.style.display = "none";
        }
    }

    if (!server_tab_node){ 
        server_tab_node = document.getElementById("server_table");
    }

    server_tab_node.style.display = "none";

    if (user_tab_node && "block" == user_tab_node.style.display) {
        user_tab_node.style.display = "none";
    }
}

var change_user_info_tab_node;
var change_passwd_detail_node;
var change_passwd_action_node;
var change_passwd_success_node;

function change_user_info () {

    change_user_info_tab_node = document.getElementById("change_user_info_tab");
    change_user_info_tab_node.style.display = "block";

    var height = document.body.clientHeight - 70 - 100;
    if (height > 768) {
        height = 720 - 100; 
    }
    change_user_info_tab_node.style.height = height + "px";
    var width = document.body.clientWidth;
    if (width > 1366) {
        width = 1366;
    }
    change_user_info_tab_node.style.width = width + "px";
    document.getElementById("change_passwd_action").style.display = "none";
    document.getElementById("change_passwd_success").style.display = "none";
    document.getElementById("oldpw").value = "";
    document.getElementById("newpw").value = "";
    document.getElementById("ackpw").value = "";
    document.getElementById("change_passwd_detail").style.display = "block";
}

function change_passwd () {
    change_passwd_detail_node = document.getElementById("change_passwd_detail");
    change_passwd_action_node = document.getElementById("change_passwd_action");
    document.getElementById("oldpw").value = "";
    document.getElementById("newpw").value = "";
    document.getElementById("ackpw").value = "";
    change_passwd_detail_node.style.display = "none";
    change_passwd_action_node.style.display = "block";
}

function confirm_change_passwd () {

    // change_passwd_action_node.style.display = "none";

    // change_passwd_success_node = document.getElementById("change_passwd_success");
    // change_passwd_success_node.style.display = "block";
    var oldpw = document.getElementById("oldpw").value;
    var newpw = document.getElementById("newpw").value;
    var ackpw = document.getElementById("ackpw").value;
    var oldpwmd5 = md5(oldpw);
    var newpwmd5 = md5(newpw);
    var ackpwmd5 = md5(ackpw);
    if (oldpw!=""&&newpw!=""&&ackpw!="") {
        if(newpw==ackpw){
            var  urladdr =httpurl + "/php/changepasswd.php?oldpw="+oldpwmd5+"&newpw="+newpwmd5+"&adminname="+adminname;
            printlog("urladdr = " + urladdr); 
            sendHTTPRequest(urladdr,changepasswdfunc);
        }
        else{
            document.getElementById("ackchange").value="新密码不一致！";
            setTimeout("document.getElementById('ackchange').value='确认修改'",2000);
        }
    }
    else{
        document.getElementById("ackchange").value="请输入密码！";
        setTimeout("document.getElementById('ackchange').value='确认修改'",2000);
    }
}

function change_passwd_success () {
    document.getElementById("change_passwd_success").style.display = "none";
    document.getElementById("change_passwd_detail").style.display = "block";
}

function change_infomation () {

    hiddenTab ();

    change_user_info();
    document.getElementById("current_user_name").innerHTML = adminname;
    document.getElementById("current_user_option").innerHTML = _permissions_array[user_permissions];
}

var user_manager_bg_node;

function showUserBg () {

	if (!user_manager_bg_node) {
		user_manager_bg_node = document.getElementById("user_manager_bg");
	}
	user_manager_bg_node.style.display = "block";
}

function hiddenUserBg () {
	if (!user_manager_bg_node) {
		user_manager_bg_node = document.getElementById("user_manager_bg");
	}
	user_manager_bg_node.style.display = "none";
}

// function confirm_change_passwd(){
//     var oldpw = document.getElementById("oldpw").value;
//     var newpw = document.getElementById("newpw").value;
//     var ackpw = document.getElementById("ackpw").value;
//     if (oldpw!=""&&newpw==ackpw&&newpw!="") {
//         var  urladdr =httpurl + "/coocaa/WebClient/changepasswd.php?oldpw="+oldpw+"&newpw="+newpw+"&adminname="+adminname;
//         printlog("urladdr = " + urladdr);
//         //sendHTTPRequest(urladdr, loginfunc);  
//         sendHTTPRequest(urladdr,changepasswdfunc);
//     };
// }

function changepasswdfunc(){
    printlog("this.readyState = " + xmlhttp.readyState);
    if (xmlhttp.readyState == 4) {
        printlog("this.status = " + this.status);
        printlog("this.responseText = " + this.responseText);
        if (xmlhttp.status == 200) //TODO
        {
            var data = this.responseText;
            printlog(data);
            if (data == "OK") // login success
            {
                document.getElementById('change_passwd_success').style.display="block";
                document.getElementById('change_passwd_action').style.display="none";
                setTimeout("change_passwd_success ()",3000);
            } 
            else if(data == "ERROR1")
            {
                document.getElementById('ackchange').value='修改失败';
                setTimeout("document.getElementById('ackchange').value='确认修改'",2000);
            }
            else if (data == "ERROR2") {
                document.getElementById('ackchange').value='原密码输入错误';
                setTimeout("document.getElementById('ackchange').value='确认修改'",2000);
            }
        }
    }
}


function creatOptionByPermissions (select_node) {

    while (select_node.options.length > 0) {
        select_node.options[select_node.options.length - 1] = null;
    }

    if (user_permissions < 2) {
        var node = document.createElement("option");
        node.value = "Admin";
        node.innerHTML = "Admin";
        select_node.appendChild(node);
    }
    var eng = document.createElement("option");
    eng.value = "Engineer";
    eng.innerHTML = "Engineer";
    select_node.appendChild(eng);

    var afsel = document.createElement("option");
    afsel.value = "After-sale";
    afsel.innerHTML = "After-sale";
    select_node.appendChild(afsel);

}