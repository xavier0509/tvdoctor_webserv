document.write("<script language=javascript src='js/webclient.js' charset=\"utf-8\"></script>");

function adminlogin(){
    var username = document.getElementById("adminName").value;
    var password = document.getElementById("adminPassword").value;
    if (username=="") {
        var dialog1 = new singledialog("请输入用户名");
        document.getElementById('singlecontent').innerHTML=dialog1.content;
        setTimeout(hidediv,2000);
    }
    else if(password==""){
        var dialog1 = new singledialog("请输入密码");
        document.getElementById('singlecontent').innerHTML=dialog1.content;
        setTimeout(hidediv,2000);
    }
    else{
        var password1 = md5(password);
        var  urladdr =httpurl + "/php/adminlogin.php?username1="+username+"&password1="+password1 + "&random=100";
        printlog("urladdr = " + urladdr);
        //sendHTTPRequest(urladdr, loginfunc);  
        sendHTTPRequest(urladdr,adminloginfunc);
    }
}

function adminloginfunc(){
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
                document.location.href="select.html" ;
            } 

            else if (data == "ERR_NOUSER") // login success
            {
                showlogininfo("用户名不存在");
            }
            else if (data == "ERR_PWDERR")
            {
                showlogininfo("密码错误");
            }
            else if (data == "ERR_LOG_FAIL")
            {
                showlogininfo("登录失败");
            }
            else if (data == "ERR_ONLINE")
            {
                showlogininfo("用户已登录");
            }


            getPermissonsByUseName(adminname);
        }
    }
}

function EnterDown(){
    if(window.event.keyCode == 13){ 
        adminlogin(); 
    }    
}