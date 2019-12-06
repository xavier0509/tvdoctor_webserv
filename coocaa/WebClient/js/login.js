document.write("<script language=javascript src='js/httprequest.js' charset=\"utf-8\"></script>");
document.write("<script language=javascript src='js/crc32.js' charset=\"utf-8\"></script>");
document.write("<script language=javascript src='js/VncDataPackage.js' charset=\"utf-8\"></script>");
document.write("<script language=javascript src='js/jquery-1.7.1.min.js' charset=\"utf-8\"></script>");
document.write("<script language=javascript src='js/ajaxfileupload.js' charset=\"utf-8\"></script>");
document.write("<script language=javascript src='js/md5.js' charset=\"utf-8\"></script>");

var  serverIp = "172.20.154.225";	// 134.175.191.97 / 172.20.154.225

var  httpurl = "";
var  host = "ws://" + serverIp + ":9008";
var  logcatHost ="ws://" + serverIp + ":9005";
var mobileMainUrl="mobileMain.html",  
    mobile = (/mmp|symbian|smartphone|midp|wap|phone|xoom|iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));  
    // if (mobile) {  
    //     window.location = mobileUrl;  
    // }  

var   server_id = 0;
var   tv_id = 0;
var   sourceid =0;
var   telnetStart = false;
var   reciveBuffer ="";
var   isStartTelnetd =false;
var   socket;

var objContent = "";
var objInput = "";
var logcatContent;
var logcatInput = "";
var strCmd = "";
var g_isRunningOutput = true;
var g_cmdsIndex = 0;
var arrCmd = [];
var g_timer = null;
var inputcmd = "";
var inputcmd2 = "";
var timestamp;

var KEYCODE_HOME =27;//102;
var KEYCODE_MENU =26;//139; 
var KEYCODE_DPAD_UP =21;//103;
var KEYCODE_DPAD_DOWN =22;//108;
var KEYCODE_DPAD_LEFT =23;//105;
var KEYCODE_DPAD_RIGHT =24;//106;
var KEYCODE_DPAD_BACK =25;
var KEYCODE_DPAD_CENTER =19;//28;
var KEYCODE_DPAD_VOLUME_UP =15;
var KEYCODE_DPAD_VOLUME_DOWN =16;
var KEYCODE_DPAD_SIGNAL =18;//466

var  subinfo = "";
var  buttonUpload = "";
var  g_isConnectd = false;
var  isStartLogcatSocket = false;
var  isStopScrn = false;//是否已停止截屏

var  interval;
var  loadingTime;
var  downloadfilename = "";
var  controlInterval;

var adminname;
var user_permissions;
var tc_version;
var tc_URL;
var loginId;
var connectId;
var checkbox;


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
        console.log("urladdr = " + urladdr);
        //sendHTTPRequest(urladdr, loginfunc);  
        sendHTTPRequest(urladdr,chkinputfunc);
    }
}

function chkinputfunc(){
    console.log("this.readyState = " + xmlhttp.readyState);
    if (xmlhttp.readyState == 4) {
        console.log("this.status = " + this.status);
        console.log("this.responseText = " + this.responseText);
        if (xmlhttp.status == 200) //TODO
        {
            var data = this.responseText;
            console.log(data);
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

function singledialog(content,func_ok){
    this.content = content;
    this.ok = func_ok;
    document.getElementById('singlebutton').style.display = "block";
    document.getElementById('bg').style.display = "block";
}

function showlogininfo(str){
    var dialog1 = new singledialog(str);
    document.getElementById('singlecontent').innerHTML=dialog1.content;
    setTimeout(hidediv,2000);
}

function hidediv() {
    document.getElementById("bg").style.display ='none';
    document.getElementById("show").style.display ='none';
    document.getElementById("singlebutton").style.display ='none';
}