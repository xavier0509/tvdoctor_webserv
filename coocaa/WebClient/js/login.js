document.write("<script language=javascript src='js/httprequest.js' charset=\"utf-8\"></script>");
document.write("<script language=javascript src='js/crc32.js' charset=\"utf-8\"></script>");
document.write("<script language=javascript src='js/VncDataPackage.js' charset=\"utf-8\"></script>");
document.write("<script language=javascript src='js/jquery-1.7.1.min.js' charset=\"utf-8\"></script>");
document.write("<script language=javascript src='js/ajaxfileupload.js' charset=\"utf-8\"></script>");
document.write("<script language=javascript src='js/md5.js' charset=\"utf-8\"></script>");
function onEnterDown(){
    if(window.event.keyCode == 13 || window.event.which == 13){ 
        chkinput(); 
    }    
}


function chkinput(){
    var username1 = document.getElementById("username1").value;
    var password = document.getElementById("password1").value;
    if (username1=="") {
        var dialog1 = new singledialog("请输入用户名");
        document.getElementById('singlecontent').innerHTML=dialog1.content;
        setTimeout(hidediv,2000);
    }
    else if(password == ""){
        var dialog1 = new singledialog("请输入密码");
        document.getElementById('singlecontent').innerHTML=dialog1.content;
        setTimeout(hidediv,2000);
    }
    else{
        var password1 = md5(password);  
        var  urladdr =httpurl + "/php/login.php?username1="+username1+"&password1="+password1 + "&random=100";
        printlog("urladdr = " + urladdr);
        //sendHTTPRequest(urladdr, loginfunc);  
        sendHTTPRequest(urladdr,chkinputfunc);
    }
}

function chkinputfunc(){
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
                if (mobile) {  
                    document.location.href = mobileMainUrl;  
                }
                else{document.location.href="inputService.html";}     
                
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


            //getPermissonsByUseName(adminname);
        }
    }
}