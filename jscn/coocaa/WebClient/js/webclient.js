document.write("<script language=javascript src='js/httprequest.js' charset=\"utf-8\"></script>");
document.write("<script language=javascript src='js/crc32.js' charset=\"utf-8\"></script>");
document.write("<script language=javascript src='js/VncDataPackage.js' charset=\"utf-8\"></script>");
document.write("<script language=javascript src='js/jquery-1.7.1.min.js' charset=\"utf-8\"></script>");
document.write("<script language=javascript src='js/ajaxfileupload.js' charset=\"utf-8\"></script>");
document.write("<script language=javascript src='js/md5.js' charset=\"utf-8\"></script>");

var  httpurl = "/jscn";//"http://120.27.147.96";
var  host = "ws://172.16.34.222:9008";
var  logcatHost ="ws://172.16.34.222:9005";
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

function inputServiceOnload ()
{
    inputcmd = document.getElementById('inputcmd');
    inputcmd2 = document.getElementById('inputcmd2');
    objContent = document.getElementById("divContent");
    objInput = document.getElementById("divInput"); 
    logcatContent = document.getElementById("divContent2");
    logcatInput = document.getElementById("divInput2");
    subinfo =document.getElementById('span1');
    buttonUpload =document.getElementById('buttonUpload');
    tvinfo = document.getElementById('tvinfo');
    // altRows('inforTable');
}

function connect()
{
    try
    {
        socket = new WebSocket(host);
        OutputLog('Socket Status: '+socket.readyState);
        socket.onopen = function()
        {
            sourceid = Math.random()*1000+"1"; 
            sourceid =crc32_hash(sourceid);       
            OutputLog("sourceid ="+sourceid);
            setTargetAndSource(sourceid,0x00000000);
            setCommandId(CMD_REG_PC,0);//向服务器注册 
            var msg1 = getTVId;
            // var msg = msg1.toLocaleUpperCase();
            var msg = msg1;
            setStringParam(msg);/*"c539a58d1c092d0cb90317fd8cc64a97"*/
            socket.send(assemblingProtocol());
        }
        socket.onmessage = function(msg)
        {
            var str = "";
            str = msg.data;
            var   len = str.size;
            OutputLog("message len="+len);
            var reader = new FileReader();
            reader.readAsBinaryString(str);
            reader.onload = function()
            {
                var   text =reader.result;
                var  packpagelen =(text.charCodeAt(0) << 24 ) | (text.charCodeAt(1) <<16  ) | (text.charCodeAt(2) << 8) |text.charCodeAt(3);
                OutputLog("len ="+len+", packpagelen ="+packpagelen);	
                if (packpagelen >= len )
                {
                    var  buffer = text.substr(4,(packpagelen-4));
                    decodeProtocol(buffer);

                    if (CMD_TELLME_SRV_ID ==getCommand()) 
                    {          
                        server_id = getBuferParam();
                        OutputLog("server  id ="+server_id);
                    } 
                    else if (CMD_TELLME_TV_ID == getCommand()) 
                    {//解决有可能收不到TVid的时候 还继续在发命令
                        g_isConnectd = true;
                        clearInterval(interval);
                        timestamp = Math.floor(new Date().getTime()/1000);
                        subinfo.innerHTML="连接成功";
                        setTimeout("subinfo.innerHTML =''",5000);
                        // controlInterval =  setInterval("controling()",800);
                        document.getElementById('main').style.display="block";
                        document.getElementById('import').style.display="none";
                        tv_id = getBuferParam();
                        OutputLog("TV  id ="+tv_id);
                        getTvinfo();
                    }
                    else if (CMD_USER_REFUSED ==  getCommand())
                    {
                        //用户拒绝请求
                        subinfo.innerHTML="<font color='red'>用户已拒绝接受请求！</font>";
                        disconnect();
                    }
                    else if (CMD_TELNET_DATA == getCommand())
                    {
                        var  data = getBuferParam();
                        if (!telnetStart)
                        {
                            var index = text.indexOf('#');    //text.indexOf('\r\r\n');     
                            if (index >= 0)
                            {
                                telnetStart =true;  
                                strCmd = data;//text;
                                //  arrCmd.push(data);
                                exeCmd();
                                setInnerText(logcatInput, "");
                            } 
                            else
                            {


                            }
                        }
                        else   
                        {
                            strCmd = data;
                            //arrCmd.push(data);
                            exeCmd();
                            setInnerText(logcatInput, "");
                        }     

                    }
                    else if (RET_SNATCH_LOG == getCommand()) 
                    {
                        var   result = getBuferParam();
                        OutputLog("snatch  log  status ="+result);
                        if (result != 0) 
                        {
                            OutputLog("setTimeout============");
                            // document.getElementById('achieve').innerHTML = "日志文件获取失败!";
                            var  t1 =setTimeout(showlogcatResultInfo,5000);                  
                        }
                    }
                    else if (CMD_NOTIFY_DOWNLOADLOGFILE == getCommand())//下载日志文件
                    {
                        // document.getElementById('achieve').innerHTML = "";
                        var   url = getBuferParam();
                        url = url.replace(/\//g,"@");
                        OutputLog("download  logcat  file ="+url);

                        window.open(httpurl+"/php/downloaddeal.php?filepath="+url+"&filename="); 
                    }
                    else if (CMD_NOTIFY_DOWNLOADFILE == getCommand() ) //下载普通文件
                    {
                        var   url = getBuferParam();
                        url = url.replace(/\//g,"@");
                        OutputLog("download  file ="+url);
                        window.open(httpurl+"/php/downloaddeal.php?filepath="+url+"&filename="+downloadfilename); 
                    }
                    else if (CMD_ANOTHER_PC_CTRL == getCommand()) //新PC登录，通知旧PC退出
                    {
                        g_isConnectd =false;
                        subinfo.innerHTML="<font color='red'>用户接受新PC连接，您被迫下线</font>";
                        document.getElementById('import').style.display="block";
                        document.getElementById('main').style.display="none";
                        setTimeout(subinfo.innerHTML='',5000);
                    }
                    else if (CMD_NOTIFY_SHOWPHOTO == getCommand())  //显示截取的图片
                    {
                        if (loadingTime != undefined)
                        {
                            clearTimeout(loadingTime);
                        }
                        if (isStopScrn)
                        {
                            OutputLog(" isStopScrn is  stop");
                            return ;
                        }
                        var   url = getBuferParam();
                        OutputLog("photo path="+url);
                        url =url.replace("/usr/share/nginx/html","");///var/www/
                        OutputLog("photo path= ="+url);
                        document.getElementById('tvscrn').src =url;
                    }
                    else if (CMD_NOTIFY_TV_OFFLINE == getCommand())  //tv已和服务器断开
                    {	
                        g_isConnectd =false;
                    	
                        clearInterval(controlInterval);
                        tvbreakself();
                        tvinfo.innerHTML="";
                    }
                    else if(RET_REMOTE_PUSH_FILE == getCommand()) //文件是否上传成功
                    {
                        var   result = getBuferParam();
                        if ( result  == 0 ) //成功
                        {
                            buttonUpload.innerHTML = "上传到TV成功";
                        } 
                        else if (-1 == result)//权限错误
                        {
                            buttonUpload.innerHTML = "上传到TV失败，权限不够";
                        }
                        else if (-2 == result) //空间不足
                        {
                            buttonUpload.innerHTML = "上传到TV失败，空间不足";
                        }
                        else// (-3 == result) //其他错误
                        {
                            buttonUpload.innerHTML = "上传到TV失败,错误码是"+result;
                        }
                        setTimeout("buttonUpload.innerHTML='开始上传'",10000);
                    }
                    else if (RET_REMOTE_PULL_FILE == getCommand()) 
                    {
                        var   result = getBuferParam();
                        if (0 == result )
                        {
                            document.getElementById('buttonDown').innerHTML ="请求完成";
                            setTimeout("document.getElementById('buttonDown').innerHTML ='下载'",10000);
                        }
                        else
                        {
                            document.getElementById('buttonDown').innerHTML ="您要下载的文件出错了,错误码是："+result;
                            setTimeout("document.getElementById('buttonDown').innerHTML ='下载'",10000);
                        }
                    }
                    else if (RET_LOGCAT_START_SNATCH == getCommand()) 
                    {
                        var   result = getBuferParam();//连接是否OK
                        OutputLog("TV  connnect logcat  status="+result);
                    }
                    else if(RET_GET_TV_INFO == getCommand())
                    {
                        var result = getBuferParam();
                        OutputLog("TV info:"+result);
                        var node = JSON.parse(result);
                        actionModel = node.model;
                        actionType = node.type;
                        actionVersion = node.version;
                        var size = node.size;
                        actionId = document.getElementById('pushid').value;
                        tvinfo.innerHTML="<font face='微软雅黑'>本机信息：<br/>ID:"+actionId+";　机芯："+actionModel+";　机型:"+actionType+";　版本:"+actionVersion+";　屏幕尺寸:"+size+"</font>"; 
                        var timestamp = Math.floor(new Date().getTime()/1000);
                        var data = '{"connectId" : "'+connectId+'" ,"connectedTime" : ' + timestamp + ',"machineCore" : "'+actionModel+'", "machineType" : "'+actionType+'", "version":"'+actionVersion+'"}'
                        var urladdr = httpurl + "/php/record_action.php?action=update_connect_records_begin&msg=" + data;
                        sendHTTPRequest(urladdr, connnect_ok);
                        printlog(urladdr);
                    }
                    else 
                    {

                    }
                } 
                else 
                {

                }

            }    							
        }

        socket.onclose = function()
        {
            logcatContent.innerHTML="";
            // g_isConnectd =false;
            // isStartLogcatSocket =false;
            // subinfo.innerHTML = "<font color='red'>PC与和服务器断开链接！</font>";
            clearInterval(controlInterval);
            clearInterval(interval);
            // subinfo.innerHTML = "<font color='red'>WebSocket与服务器断开！</font>"
            document.getElementById('tvscrn').src="images/screenbg.jpg";
            document.getElementById('linkTV').innerHTML="连接电视";
        	// document.getElementById('link').style.display="none";
            tvinfo.innerHTML="";
            document.getElementById('first').style.display="block";
            document.getElementById('third').style.display="none";
            document.getElementById('import').style.display="block";
            document.getElementById('main').style.display="none";
            
            OutputLog('Socket Status111111: '+socket.readyState+' (Closed)');
        }	
        socket.onerror =function(event)
        {
            g_isConnectd =false;
            isStartLogcatSocket =false;
            subinfo.innerHTML = "<font color='red'>WebSocket连接出错！</font>";
            setTimeout("subinfo.innerHTML=''",5000);
            OutputLog('WebSocket Status:: Error was reported');
            document.getElementById('import').style.display="block";
            document.getElementById('main').style.display="none";
        }		

    } 
    catch(exception)
    {
        g_isConnectd =false;
        isStartLogcatSocket =false;
        OutputLog('Error'+exception);
    }			
}

function connnect_ok(){

}
function  showlogcatResultInfo()
{
    OutputLog("===============");
    // document.getElementById('achieve').innerHTML = "";
}
function disconnect()
{
    //  $("#break").toggle();
    // $("#link").toggle();
    //-------------------------------------问题描述框，暂时不显示，界面优化后再说
    // document.getElementById('issue').style.display="block";
    // document.getElementById('bg').style.display="block";
    // document.getElementById('show').style.display="none";
    setTargetAndSource(sourceid,0x00000000);
    printlog("pc break by self");
    setCommandId(CMD_PC_NEED_EXIT,0);
    socket.send(assemblingProtocol());
    finishAndEnd();
    issue();
    
}
function issue(){
    var issuetext = document.getElementById('issuetext').value;
    var timestamp = Math.floor(new Date().getTime()/1000);
    var data = '{"connectId" : "'+connectId+'" ,"disconnectedTime" : ' + timestamp + ',"issue" : "'+issuetext+'"}'
    var urladdr = httpurl + "/php/record_action.php?action=update_connect_records_end&msg=" + data;
    sendHTTPRequest(urladdr, issuefunc);
    printlog(urladdr);
}

function issuefunc(){
    printlog("this.readyState = " + xmlhttp.readyState);
    if (xmlhttp.readyState == 4) {
        printlog("this.status = " + this.status);
        printlog("this.responseText = " + this.responseText);
        if (xmlhttp.status == 200) //TODO
        {
            
        }
    }
}

function finishAndEnd()
{
    logcatContent.innerHTML="";
    clearInterval(controlInterval);
    clearInterval(interval);
    document.getElementById('tvscrn').src="images/screenbg.jpg";
    document.getElementById('upload').style.display="none";
    document.getElementById('download').style.display="none";
    document.getElementById('issue').style.display="none";
    hidediv();
    document.getElementById('main').style.display="none";
    document.getElementById('import').style.display="block";
    subinfo.innerHTML="";
    document.getElementById('linkTV').innerHTML="连接电视";
    g_isConnectd = false;
    isStartLogcatSocket =false;
    isStartTelnetd = false;
    if (logcatsocket !=undefined) 
    {
        logcatsocket.close();
    }
    socket.onerror=null;
    socket.onclose=null; 
    socket.close();
    finishAction();
}
//解决需要右键才能获取cmd输入框的bug
function consolefocus()
{
    console.log("右击开始telnet");
    // inputcmd.style.display="none";
    if (!isStartTelnetd)
    {
        isStartTelnetd = true;
        setTargetAndSource(sourceid,tv_id);
        printlog("telnetStartBefore");
        setCommandId(CMD_START_TELNETD,0);
        printlog("telnetStartAfter");
        socket.send(assemblingProtocol());

    }
    //objInput.focus();
    // logcatconsolefocus();
}

//---------------------------cmd窗口----------------------------
//--------------------------------------------------------------
function exeCmd()
{
    if(g_isRunningOutput)
    {
        println(strCmd);//"skyworth:#" + 
    }
}

function println(str) 
{
    var objDIV = document.createElement("div");
    if (objDIV.innerText != null)
        objDIV.innerText = str;
    else
        objDIV.textContent = str;
    logcatContent.appendChild(objDIV);
    logcatContent.scrollTop = logcatContent.scrollHeight;
}

// function validate(e)
function cmdfunc()
{
    var theEvent = window.event || e;
    var keycode=theEvent.which;
    if(keycode == "13") //回车
    {
        console.log("start cmd");
        g_isRunningOutput = true;
        var  data= getInnerText(logcatInput);
        data = trim(data);
        // if (/*(data.length == 6) && */(data.substr(0,6) == "logcat")) 
        // {
        //     //alert("请输入过滤条件,如logcat |grep ***");
        //     //alert("如果想输入logcat请切换到日志窗口");
        //     // strCmd = "如果想输入logcat请切换到日志窗口";
        //     // // arrCmd.push(strCmd);
        //     // exeCmd();
        //     // setInnerText(objInput, "");
        //     // return ;
        //     // // logcatconsolefocus();
        //     // logcatstart();
        // }

        if (data.length == 0)
        {
            if (!isStartTelnetd)
            {
                isStartTelnetd = true;
                setTargetAndSource(sourceid,tv_id);
                setCommandId(CMD_START_TELNETD,0);
                socket.send(assemblingProtocol());
            }
            else
            {
                exeCmd();
               // return;
            }
            return;
        }
        arrCmd.push(data);
        // strCmd = data;  
        //exeCmd();
        data +="\r\n";      

        setTargetAndSource(sourceid,tv_id);//发送telnet命令
        setCommandId(CMD_TELNET_DATA,0);
        setStringParam(data);
        socket.send(assemblingProtocol());	

        // //-------------------------------------------------------
        // logcatarrCmd.push(data);
        // logcatprintln(data);
        //     setTargetAndSource(sourceid,tv_id);
        // setCommandId(CMD_LOGCAT_PARAM_SCREEN,0);
        // setStringParam(data);
        // socket.send(assemblingProtocol());
        // //--------------------------------------------------------

        setInnerText(logcatInput, "");
        return false;
    }
    else if(keycode == "38" || keycode == "40") //上下键
    {
        var len = parseInt(arrCmd.length);
        if(g_cmdsIndex < len)
        {
            setInnerText(logcatInput, "");
            setInnerText(logcatInput, arrCmd[g_cmdsIndex]);
            g_cmdsIndex++;
        }
        else
        {
            g_cmdsIndex = 0;
        }

    }
    else if (theEvent.ctrlKey && keycode=="67") //ctrl+C   "67"
    {
        strCmd = "终端已停止输入,按回车键重新获取终端输入";
        // arrCmd.push(strCmd);
        exeCmd();
        setInnerText(logcatInput, "");
        setTargetAndSource(sourceid,tv_id);
        setCommandId(CMD_STOP_TELNETD,0);

        //-------------------------------------------------------
        // setInnerText(objInput, "");
        // setTargetAndSource(sourceid,tv_id);
        // setCommandId(CMD_LOGCAT_PARAM_SCREEN,0);
        // setStringParam("pause");
        // //-------------------------------------------------------

        socket.send(assemblingProtocol());
        isStartTelnetd = false;
    }
    // //-------------------------------------------------------------------
    // else if (event.ctrlKey && keycode=="90") //ctrl+Z  断开连接
    // {
    //   isStartLogcatSocket = false;
    //   var  strCmd = "logat连接已断开";
    //   //logcatarrCmd.push(strCmd);
    //   exeCmd();
    //   setInnerText(objInput, "");
    //   //给TV断开的命令
    //   setTargetAndSource(sourceid,tv_id);
    //   setCommandId(CMD_LOGCAT_STOP_SCREEN,0);
    //   socket.send(assemblingProtocol());
    //   //主动跟服务器断开连接
    //   logcatsocket.close();
    //  }//--------------------------------------------------------------
     ;
}

function getInnerText(element) 
{
    return (typeof element.value == "string") ? element.value : element.innerText;
}

function setInnerText(element, text) 
{   
    element.innerText = "";
    // if (typeof element.textContent == "string") 
    // {
    //     element.textContent = text;
    // } 
    // else
    // {
    //     element.innerText = text;
    // }
}
//setInnerText(objInput, "");

function OutputLog(msg)
{
    printlog(msg);
}
function trim(str)
{
    str = str.replace(/^(\s|\u00A0)+/,'');
    var len = str.length -1;
    for (var i = len; i >= 0;  i--) 
    {
        if(/\S/.test(str.charAt(i)))
        {   
            str = str.substring(0,i+1);
            break;
        }
    }
    return str;
}


//------------------------------截屏----------------------
//--------------------------------------------------------
function scrn(x)
{

    if (!g_isConnectd)
    {
        subinfo.innerHTML="<font color='red'>请连接TV后操作</font>";
        return ;
    }
    isStopScrn = false;
    if (loadingTime  != undefined) 
    {
        clearTimeout(loadingTime);
    }  
    loadingTime =setTimeout("hiddenLoading()",60000);
    document.getElementById('tvscrn').src="images/loading.gif";
    setTargetAndSource(sourceid,tv_id);
    var  tag = Date.parse(new Date());
    if ("scrn2"  == x) 
    {
        setCommandId(CMD_PRINTE_CONTINUE_SCREEN,tag);
        var time = document.getElementById('ccdd').value;
        OutputLog("scrn   time ="+time);
        setIntegerParam(time);
    }
    else if ("scrn1" == x) 
    { 
        setCommandId(CMD_PRINTE_SCREEN,tag);   
    }
    socket.send(assemblingProtocol());
}

function hiddenLoading()
{
    document.getElementById('tvscrn').src="images/fail.jpg";
    setTimeout("document.getElementById('tvscrn').src='images/screenbg.jpg'",3000)
}

function stopscrn()
{
    isStopScrn = true;
    document.getElementById('tvscrn').src="images/screenbg.jpg";
    setTargetAndSource(sourceid,tv_id);
    setCommandId(CMD_STOP_SCREEN,0);
    socket.send(assemblingProtocol());
}

function getTvinfo(){
    setTargetAndSource(sourceid,tv_id);
    setCommandId(CMD_GET_TV_INFO,0);
    socket.send(assemblingProtocol())
}

function logcat()
{
    if (!g_isConnectd) 
    {
        subinfo.innerHTML="<font color='red'>请连接TV后操作</font>";
        return ;
    };
    $("#logcatButton").toggle();
    $("#stopButton").toggle();
    // $("#logLoading").toggle();
    // $("#logTimeButton").toggle();
    // $("#logTime").toggle();
    // document.getElementById('achieve').style.display="none";
    setTargetAndSource(sourceid,tv_id);
    setCommandId(CMD_START_SNATCH_LOG,0);
    // setCommandId(CMD_SNATCH_LOG,0);
    // setIntegerParam(50);//抓取的时间s
    socket.send(assemblingProtocol());
    subinfo.innerHTML="日志抓取中";
}

function sendUpdate()
{
    // $("#logLoading").toggle();
    // $("#logTimeButton").toggle();
    // $("#logTime").toggle();
    // document.getElementById('achieve').style.display="none";
    setTargetAndSource(sourceid,tv_id);
    setCommandId(T2P_CMD_LOCAL_UPGRADE_CHECK,0);
    // setCommandId(CMD_SNATCH_LOG,0);
    // setIntegerParam(50);//抓取的时间s
    socket.send(assemblingProtocol());
    updateList();
}

function hiddenloadingLogcat()
{
    $("#logLoading").toggle();
    $("#logcatButton").toggle();
    $("#logTimeButton").toggle();
    $("#logTime").toggle();
}

function logcatTimeButton()
{
    if (!g_isConnectd) 
    {
        subinfo.innerHTML="<font color='red'>请连接TV后操作</font>";
        return ;
    };
    // $("#logcatButton").toggle();
    //$("#stopButton").toggle();
    // $("#logLoading").toggle();
    // $("#logTimeButton").toggle();
    // $("#logTime").toggle();
    //  $("#stopButton").toggle();
    // document.getElementById('stopButton').style.display='none';
    var  time =document.getElementById('cd').value;
    OutputLog("select time ="+time);
    // document.getElementById('achieve').style.display="none";
    //setTimeout(hiddenloadingLogcat,time*1000);

    setTargetAndSource(sourceid,tv_id);
    setCommandId(CMD_SNATCH_LOG,0);

    setIntegerParam(time);//抓取的时间s
    socket.send(assemblingProtocol());
}

function stoplogcat()
{
    $("#logcatButton").toggle();
    $("#stopButton").toggle();
    // $("#logLoading").toggle();
    // $("#logTimeButton").toggle();
    // $("#logTime").toggle();
    // document.getElementById('achieve').style.display="block";
    setTargetAndSource(sourceid,tv_id);
    setCommandId(CMD_STOP_SNATCH_LOG,0);
    socket.send(assemblingProtocol());
    subinfo.innerHTML="";
}

function keyBack()
{
    if (!g_isConnectd)
    {
        subinfo.innerHTML="<font color='red'>请连接TV后操作</font>";
        return ;
    }
    // document.getElementById('light').style.background="red";
    // setTimeout("$('#light').toggle()",70);
    // setTimeout("$('#light').toggle();document.getElementById('light').style.background='#660000';",80);
    setTargetAndSource(sourceid,tv_id);
    setCommandId( CMD_SEND_VIRKEY,0);
    setIntegerParam(KEYCODE_DPAD_BACK);//键值码   keycode
    socket.send(assemblingProtocol());
}

function keyHome()
{
    if (!g_isConnectd)
    {
        subinfo.innerHTML="<font color='red'>请连接TV后操作</font>";
        return ;
    }
    // document.getElementById('light').style.background="red";
    // setTimeout("$('#light').toggle()",70);
    // setTimeout("$('#light').toggle();document.getElementById('light').style.background='#660000';",80);
    setTargetAndSource(sourceid,tv_id);
    setCommandId( CMD_SEND_VIRKEY,0);
    setIntegerParam(KEYCODE_HOME);//键值码   keycode
    socket.send(assemblingProtocol());
}

function keyMeun()
{
    if (!g_isConnectd)
    {
        subinfo.innerHTML="<font color='red'>请连接TV后操作</font>";
        return ;
    }
    // document.getElementById('light').style.background="red";
    // setTimeout("$('#light').toggle()",70);
    // setTimeout("$('#light').toggle();document.getElementById('light').style.background='#660000';",80);
    setTargetAndSource(sourceid,tv_id);
    setCommandId( CMD_SEND_VIRKEY,0);
    setIntegerParam(KEYCODE_MENU);//键值码   keycode
    socket.send(assemblingProtocol());
}

function keyDown()
{
    if (!g_isConnectd)
    {
        subinfo.innerHTML="<font color='red'>请连接TV后操作</font>";
        return ;
    }
    // document.getElementById('light').style.background="red";
    // setTimeout("$('#light').toggle()",70);
    // setTimeout("$('#light').toggle();document.getElementById('light').style.background='#660000';",80);
    setTargetAndSource(sourceid,tv_id);
    setCommandId( CMD_SEND_VIRKEY,0);
    setIntegerParam(KEYCODE_DPAD_DOWN);//键值码   keycode
    socket.send(assemblingProtocol());
}

function keyRight()
{
    if (!g_isConnectd)
    {
        subinfo.innerHTML="<font color='red'>请连接TV后操作</font>";
        return ;
    }
    // document.getElementById('light').style.background="red";
    // setTimeout("$('#light').toggle()",70);
    // setTimeout("$('#light').toggle();document.getElementById('light').style.background='#660000';",80);
    setTargetAndSource(sourceid,tv_id);
    setCommandId( CMD_SEND_VIRKEY,0);
    setIntegerParam(KEYCODE_DPAD_RIGHT);//键值码   keycode
    console.log("keycode=="+KEYCODE_DPAD_RIGHT);
    socket.send(assemblingProtocol());
}

function keyOk()
{
    if (!g_isConnectd)
    {
        subinfo.innerHTML="<font color='red'>请连接TV后操作</font>";
        return ;
    }
    // document.getElementById('light').style.background="red";
    // setTimeout("$('#light').toggle()",70);
    // setTimeout("$('#light').toggle();document.getElementById('light').style.background='#660000';",80);
    setTargetAndSource(sourceid,tv_id);
    setCommandId( CMD_SEND_VIRKEY,0);
    setIntegerParam(KEYCODE_DPAD_CENTER);//键值码   keycode
    console.log("keycode=="+KEYCODE_DPAD_CENTER);
    socket.send(assemblingProtocol());
}

function keyLeft()
{
    if (!g_isConnectd)
    {
        subinfo.innerHTML="<font color='red'>请连接TV后操作</font>";
        return ;
    }
    // document.getElementById('light').style.background="red";
    // setTimeout("$('#light').toggle()",70);
    // setTimeout("$('#light').toggle();document.getElementById('light').style.background='#660000';",80);
    setTargetAndSource(sourceid,tv_id);
    setCommandId( CMD_SEND_VIRKEY,0);
    setIntegerParam(KEYCODE_DPAD_LEFT);//键值码   keycode
    console.log("keycode=="+KEYCODE_DPAD_LEFT);
    socket.send(assemblingProtocol());
}

function  keyUp()
{
    if (!g_isConnectd)
    {
        subinfo.innerHTML="<font color='red'>请连接TV后操作</font>";
        return ;
    }
    // document.getElementById('light').style.background="red";
    // setTimeout("$('#light').toggle()",70);
    // setTimeout("$('#light').toggle();document.getElementById('light').style.background='#660000';",80);
    setTargetAndSource(sourceid,tv_id);
    setCommandId( CMD_SEND_VIRKEY,0);
    setIntegerParam(KEYCODE_DPAD_UP);//键值码   keycode
    console.log("keycode=="+KEYCODE_DPAD_UP);
    socket.send(assemblingProtocol());
}

function  keyVolumeDown()
{
    if (!g_isConnectd)
    {
        subinfo.innerHTML="<font color='red'>请连接TV后操作</font>";
        return ;
    }
    // document.getElementById('light').style.background="red";
    // setTimeout("$('#light').toggle()",70);
    // setTimeout("$('#light').toggle();document.getElementById('light').style.background='#660000';",80);
    setTargetAndSource(sourceid,tv_id);
    setCommandId( CMD_SEND_VIRKEY,0);
    setIntegerParam(KEYCODE_DPAD_VOLUME_DOWN);//键值码   keycode
    console.log("keycode=="+KEYCODE_DPAD_VOLUME_DOWN);
    socket.send(assemblingProtocol());
}

function keyVolumeUp()
{
    if (!g_isConnectd)
    {
        subinfo.innerHTML="<font color='red'>请连接TV后操作</font>";
        return ;
    }
    // document.getElementById('light').style.background="red";
    // setTimeout("$('#light').toggle()",70);
    // setTimeout("$('#light').toggle();document.getElementById('light').style.background='#660000';",80);
    setTargetAndSource(sourceid,tv_id);
    setCommandId( CMD_SEND_VIRKEY,0);
    setIntegerParam(KEYCODE_DPAD_VOLUME_UP);//键值码   keycode
    console.log("keycode=="+KEYCODE_DPAD_VOLUME_UP);
    socket.send(assemblingProtocol());
}

function keysignal()
{
    if (!g_isConnectd)
    {
        subinfo.innerHTML="<font color='red'>请连接TV后操作</font>";
        return ;
    }
    setTargetAndSource(sourceid,tv_id);
    setCommandId( CMD_SEND_VIRKEY,0);
    setIntegerParam(KEYCODE_DPAD_SIGNAL);//键值码   keycode
    console.log("keycode=="+KEYCODE_DPAD_SIGNAL);
    socket.send(assemblingProtocol());
}

function downloadfile()
{
    if (!g_isConnectd)
    {
        document.getElementById('buttonDown').innerHTML ="请先连上TV";
        return ;
    }
    var  path = document.getElementById('pullfiletvpath').value;
    var   dd =  path.substr((path.lastIndexOf('/')),path.length) ;
    OutputLog("dd="+dd);
    if ( dd== '/') 
    {
        document.getElementById('buttonDown').innerHTML ="请输入要下载的文件名称";
        return ;
    }
    downloadfilename =path.substr((path.lastIndexOf('/')+1),path.length) ;
    OutputLog("TV path ="+path);
    document.getElementById('buttonDown').innerHTML ="正在请求中";
    setTargetAndSource(sourceid,tv_id);
    setCommandId( CMD_REMOTE_PULL_FILE,0);  
    setStringParam(path);
    socket.send(assemblingProtocol());
}


function disp_prompt()
{
    var pushid2 = document.getElementById("pushid").value;
    var pushid3 = pushid2.replace(/\s+/g,"");
    // var pushid = pushid3.toLocaleUpperCase();
    var pushid = pushid3;
    if(pushid!=""&&pushid!=null)
    {   
        document.getElementById('linkTV').setAttribute("disabled","");
        document.getElementById('linkTV').setAttribute("class","linkTV");

	document.getElementById('linkTV').setAttribute("style","cursor:wait");




        // subinfo.innerHTML="正在连接中";
        clearInterval(interval);
        interval=setInterval("linking()",800); 

        var timestamp = Math.floor(new Date().getTime()/1000);
        var activeId = document.getElementById('pushid').value;
        var data = '{"loginId" : "'+loginId+'" ,"connectRequestTime" : ' + timestamp + ',"connectFlag" : 1, "activeId":"'+activeId+'"}'
        var urladdr = httpurl + "/php/record_action.php?action=insert_connect_records&msg=" + data;
        printlog("urladdr = " + urladdr);
        //sendHTTPRequest(urladdr, loginfunc);  
        sendHTTPRequest(urladdr,disp_promptOK);

        
        //document.getElementById("span1").style.display="block";
    }
    else
    {
        subinfo.innerHTML="<font color='red'>请输入激活ID</font>";
        setTimeout("document.getElementById('span1').innerHTML=''",5000);

        // alert("服务ID为空，请重新输入");
    }
}

function disp_promptOK(){
    printlog("this.readyState = " + xmlhttp.readyState);
    if (xmlhttp.readyState == 4) {
        printlog("this.status = " + this.status);
        printlog("this.responseText = " + this.responseText);
        if (xmlhttp.status == 200) //TODO
        {
            var data = JSON.parse(this.responseText);
            connectId = data.data;
            printlog(connectId);
            sendrequset();
        }
    }

}

var push_flag=0;
var push_value=["&nbsp&nbsp&nbsp",".&nbsp&nbsp","..&nbsp","..."];
function linking()
{
    document.getElementById('linkTV').innerHTML="正在连接中"+push_value[push_flag];
    if((push_flag+1)<push_value.length)
    {
        push_flag++
    }
    else
    {
        push_flag=0;
    }
}
var c_flag=0;
var c_value=["",".","..","..."];
function controling()
{
    clearInterval(interval);
    subinfo.innerHTML="正在远程控制TV"+c_value[c_flag];
    if((c_flag+1)<c_value.length)
    {
        c_flag++
    }
    else
    {
        c_flag=0;
    }
}

function downshow()
{
    document.getElementById('upload').style.display="none";
    //document.getElementById('grablog').style.display="none";
    document.getElementById('listimg22').style.display="none";
    document.getElementById('listimg32').style.display="none";
    document.getElementById('listimg2').style.display="block";
    document.getElementById('listimg3').style.display="block";
    $("#download").toggle();
    $("#listimg1").toggle();
    $("#listimg12").toggle();

}

function upshow()
{
    // if (!g_isConnectd) 
    //   {
    //     subinfo.innerHTML="<font color='red'>请连接TV后操作</font>";
    //     return ;
    //   };
    document.getElementById('download').style.display="none";
    //document.getElementById('grablog').style.display="none";
    document.getElementById('listimg12').style.display="none";
    document.getElementById('listimg32').style.display="none";
    document.getElementById('listimg1').style.display="block";
    document.getElementById('listimg3').style.display="block";
    $("#listimg2").toggle();
    $("#listimg22").toggle();
    $("#upload").toggle();
}

function grablog()
{
    // if (!g_isConnectd) 
    //   {
    //     subinfo.innerHTML="<font color='red'>请连接TV后操作</font>";
    //     return ;
    //   };
    document.getElementById('download').style.display="none";
    document.getElementById('upload').style.display="none";
    document.getElementById('listimg22').style.display="none";
    document.getElementById('listimg12').style.display="none";
    document.getElementById('listimg2').style.display="block";
    document.getElementById('listimg1').style.display="block";

    $("#listimg3").toggle();
    $("#listimg32").toggle();
    $("#grablog").toggle();
}


function pagesecond()
{
    document.getElementById('first').style.display="none";
    document.getElementById('second').style.display="block";

}

function pagefirst()
{
    document.getElementById('first').style.display="block";
    document.getElementById('second').style.display="none";

}

function chkinput(){
    var username1 = document.getElementById("username1").value;
    var password = document.getElementById("password1").value;
    if (username1=="") {
        var dialog1 = new singledialog("请输入用户名");
        document.getElementById('singlecontent').innerHTML=dialog1.content;
        setTimeout(hidediv,3000);
    }
    else if(password == ""){
        var dialog1 = new singledialog("请输入密码");
        document.getElementById('singlecontent').innerHTML=dialog1.content;
        setTimeout(hidediv,3000);
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

function insert_login_data () {
    var timestamp = Math.floor(new Date().getTime()/1000);
    // var inserName = document.getElementById('username1').value;
    var data = '{"userName" : "'+ adminname +'" ,"loginTime" : "' + timestamp + '"}';
    var  urladdr =httpurl + "/php/record_action.php?action=insert_login_records&msg="+data;
    printlog("urladdr = " + urladdr);
    //sendHTTPRequest(urladdr, loginfunc);  
    sendHTTPRequest(urladdr,insertOK);
}

function insertOK(){
    printlog("this.readyState = " + this.readyState);
    if (this.readyState == 4) {
        printlog("this.status = " + this.status);
        printlog("this.responseText = " + this.responseText);
        if (this.status == 200) //TODO
        {
            var data = JSON.parse(this.responseText);
            loginId = data.data;
            printlog(loginId);
            
        }
    }
}

function showlogininfo(str){
    var dialog1 = new singledialog(str);
    document.getElementById('singlecontent').innerHTML=dialog1.content;
    setTimeout(hidediv,3000);
}

function loginfunc() {
    //printlog(this.readyState); 
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
                window.location.href='inputService.html'; 
            } else { // passwd error
                //alert("fff");
            }
        }
    }
}

function FileUpload()
{
    // if (!g_isConnectd)
    // {
    //   buttonUpload.innerHTML ="请先连上TV";
    //   return ;
    // }

    var name =document.getElementById('file').value;
    if (name.length == 0) 
    {
        buttonUpload.innerHTML = "请选择要上传的文件！";
        return  ;
    }
    var tvpath =document.getElementById('pushfiletvpath').value;
    if (tvpath.length == 0) 
    {
        buttonUpload.innerHTML = "请选择要上传到TV的路径！";
        return  ;
    }
    var dialog2 = new dialog("确定上传文件到电视？",hidediv,fileupload_ok);
    document.getElementById('content').innerHTML=dialog2.content;
    document.getElementById('btnclose').onclick=dialog2.cancle;
    document.getElementById('btnok').onclick=dialog2.ok;
     
}

function ConvUtf(obj) {
    r = obj.replace(/[^\u0000-\u00FF]/g, function ($0) { return escape($0).replace(/(%u)(\w{4})/gi, "&#x$2;") });
    return r;
}


function EncodeUtf8(s1)
{
      var s = escape(s1);
      var sa = s.split("%");
      var retV ="";
      if(sa[0] != "")
      {
         retV = sa[0];
      }
      for(var i = 1; i < sa.length; i ++)
      {
           if(sa[i].substring(0,1) == "u")
           {
               retV += Hex2Utf8(Str2Hex(sa[i].substring(1,5)));
               if (sa[i].length > 5) { 
                retV += sa[i].substring(5, sa[i].length);
               }
              
           }
           else retV += "%" + sa[i];
      }
     
      return retV;
}
function Str2Hex(s)
{
      var c = "";
      var n;
      var ss = "0123456789ABCDEF";
      var digS = "";
      for(var i = 0; i < s.length; i ++)
      {
         c = s.charAt(i);
         n = ss.indexOf(c);
         digS += Dec2Dig(eval(n));
          
      }
      //return value;
      return digS;
}
function Dec2Dig(n1)
{
      var s = "";
      var n2 = 0;
      for(var i = 0; i < 4; i++)
      {
         n2 = Math.pow(2,3 - i);
         if(n1 >= n2)
         {
            s += '1';
            n1 = n1 - n2;
          }
         else
          s += '0';
         
      }
      return s;
     
}
function Dig2Dec(s)
{
      var retV = 0;
      if(s.length == 4)
      {
          for(var i = 0; i < 4; i ++)
          {
              retV += eval(s.charAt(i)) * Math.pow(2, 3 - i);
          }
          return retV;
      }
      return -1;
}
function Hex2Utf8(s)
{
     var retS = "";
     var tempS = "";
     var ss = "";
     if(s.length == 16)
     {
         tempS = "1110" + s.substring(0, 4);
         tempS += "10" + s.substring(4, 10);
         tempS += "10" + s.substring(10,16);
         var sss = "0123456789ABCDEF";
         for(var i = 0; i < 3; i ++)
         {
            retS += "%";
            ss = tempS.substring(i * 8, (eval(i)+1)*8);
           
           
           
            retS += sss.charAt(Dig2Dec(ss.substring(0,4)));
            retS += sss.charAt(Dig2Dec(ss.substring(4,8)));
         }
         return retS;
     }
     return "";
} 


function fileupload_ok(){
    var name =document.getElementById('file').value;
    var tvpath =document.getElementById('pushfiletvpath').value;
    name = name.substring((name.lastIndexOf('\\')+1),name.length);//取上传的文件名
    OutputLog("uploadfile ===========file name="+name);    
    $.ajaxFileUpload (
   {
     url:'/php/doajaxfileupload.php', //你处理上传文件的服务端
     type:'post',
     secureuri:false, 
     fileElementId:'file',//与页面处理代码中file相对应的ID值
     dataType: 'json', //返回数据类型:text，xml，json，html,scritp,jsonp五种
    success: function (data,status) 
    {
      OutputLog("uploadfile after===========data.file_result=" + data.file_result);
      if (typeof (data.file_result) != 'undefined')
      {    
        if (data.file_result == 'ok') 
         {               
            OutputLog("uploadfile upload ok===========data.file_path=" + data.file_path + ", data.file_size = " + data.file_size);
          
           if(tvpath.substr((tvpath.length -1),1) != '/')
            {
                tvpath+='\/';
            }
           // var  vvname =data.file_path.substring((data.file_path.indexOf('_')+1),data.file_path.length);
             tvpath +=name;
             var decToHex = function(str) {
                var res=[];
                for(var i=0;i < str.length;i++)
                    res[i]=("00"+str.charCodeAt(i).toString(16)).slice(-4);
                return "\\u"+res.join("\\u");
            }
            console.log("tvpath编码前："+tvpath);
            var tvpathAfter = decToHex(tvpath);
            console.log("tvpath编码后："+tvpathAfter);
            var filestring = EncodeUtf8(data.file_path);
            OutputLog("编码后： ="+filestring); 
            // var  array ={"server-url":filestring,"tv-path":tvpathAfter,"file-size":data.file_size};
            // var  jsstring =JSON.stringify(array);
            var  jsstring ='{"server-url":"'+filestring+'","tv-path":"'+tvpathAfter+'","file-size":'+data.file_size+'}';
            OutputLog("encode json ="+jsstring); 
            setTargetAndSource(sourceid,tv_id);
            setCommandId(CMD_REMOTE_PUSH_FILE,0);
            
            setKeyValueParam(jsstring);
            buttonUpload.innerHTML = "上传到服务器成功";
            socket.send(assemblingProtocol());
         }
         else
         {  //上传失败
           buttonUpload.innerHTML = "上传到服务器失败";
           OutputLog("uploadfile upload error===========data.file_error = "+ data.file_error + ", data.file_path = " + data.file_path);
         }  
       }
  },
   error: function(data, status, e)
   { 
     OutputLog("uploadfile upload error===========e"+e);
     //上传失败
     buttonUpload.innerHTML = "上传到服务器失败,错误码是:"+e;
     OutputLog("uploadfile upload error===========data.file_error="+data.file_error+"data.file_path="+data.file_path);
     // alert(e);
    }

 });
buttonUpload.innerHTML = "正在上传中";
hidediv();
}


function hidden()
{
    document.getElementById('printTime').style.display='none';
    document.getElementById('print4to15').style.display='none'
}

function startscrn()
{
    if (!g_isConnectd) 
    {
        subinfo.innerHTML="<font color='red'>请连接TV后操作</font>";
        return ;
    };
    var howlong=document.getElementById('ccdd').value;
    var time=parseInt(howlong);
    //alert(time);
    if (howlong=="") {
        document.getElementById('printTime').style.display="block";
        document.getElementById('print4to15').style.display="none";
        setTimeout("hidden()",4000);
    }
    else
    {
        if (time>3 && time<16) 
        {
            document.getElementById('printTime').style.display="none";
            document.getElementById('print4to15').style.display="none";
            scrn('scrn2');
        }
        else
        {
            document.getElementById('print4to15').style.display="block";
            document.getElementById('printTime').style.display="none";
            setTimeout("hidden()",4000);
        }
    }
}


//--------------------定义弹出框-------------------------
function dialog(content,func_cancle,func_ok){
    this.content = content;
    this.cancle = func_cancle;
    this.ok = func_ok;
    document.getElementById('bg').style.display = "block";
    document.getElementById('show').style.display = "block";
}

//--------------------定义单按钮弹出框-------------------------
function singledialog(content,func_ok){
    this.content = content;
    this.ok = func_ok;
    document.getElementById('singlebutton').style.display = "block";
    document.getElementById('bg').style.display = "block";
}

//-------------------弹出框点取消------------------------
function hidediv() {
    document.getElementById("bg").style.display ='none';
    document.getElementById("show").style.display ='none';
    document.getElementById("singlebutton").style.display ='none';
}


//-------------------电视主动断开------------------------
function tvbreakself(){
    // divContent.innerHTML="";
    logcatContent.innerHTML="";
    document.getElementById('first').style.display="block";
    document.getElementById('main').style.display="none";
    document.getElementById('third').style.display="none";
    document.getElementById('show').style.display="none";
    document.getElementById('import').style.display="block";    
    var dialog1 = new singledialog("远程TV主动断开控制",tvbreakselffun);
    document.getElementById('singlecontent').innerHTML=dialog1.content;
    document.getElementById('singlebtnok').onclick=dialog1.ok;
    
}
function tvbreakselffun(){
    // document.getElementById('tvscrn').src="images/screenbg.jpg";
    document.getElementById('import').style.display="block";
    document.getElementById('main').style.display="none";
    hidediv();
    disconnect();
    // subinfo.innerHTML="<font color='red'>远程TV主动断开控制！</font>";
}


//-------------------点击页面断开------------------------
function cancle1(){
    var dialog1 = new dialog("确定要断开当前连接吗",hidediv,disconnect)
    document.getElementById('content').innerHTML=dialog1.content;
    document.getElementById('btnclose').onclick=dialog1.cancle;
    document.getElementById('btnok').onclick=dialog1.ok;
}

//--------------session----------------

function forsession(){
  var  urladdr =httpurl + "/php/session.php";
  printlog("urladdr = " + urladdr);
  //sendHTTPRequest(urladdr, loginfunc);  
  sendHTTPRequest(urladdr,sessionfunc);
}

function sessionfunc() {
    //printlog(this.readyState); 
    printlog("this.readyState = " + xmlhttp.readyState);
    if (xmlhttp.readyState == 4) {
        printlog("this.status = " + this.status);
        printlog("this.responseText = " + this.responseText);
        if (xmlhttp.status == 200) //TODO
        {
            var data = this.responseText;
            printlog(data);
            if (data == "ERROR") // login success
            {
                window.location.href='index.html'; 
            } else { // passwd error
                //alert("fff");
               document.getElementById('session').innerHTML=data;
	           adminname = data;
               showOrHide();
               inputServiceOnload();
               
               
            }
        }
    }
}

function getPermissonsByUseName(username) {
    var url = "/jscn/php/getInfo.php?action=permissions&username=" + username;
    sendHTTPRequest(url, getPermissonsFunc);
}

function getPermissonsFunc () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var str = xmlhttp.responseText;
        var json_str = JSON.parse(str);
        if ("OK" == json_str.ret) {
          user_permissions = json_str.data.permissions;
          insert_login_data(); 
        }
    }
}
//--------------退出登录，并在此时更改数据库内容----------------

function logout(){
    // divContent.innerHTML="";
    logcatContent.innerHTML="";
    var  urladdr =httpurl + "/php/logout.php";
    printlog("urladdr = " + urladdr);
    printlog(loginId);
    
    //sendHTTPRequest(urladdr, loginfunc);  
    sendHTTPRequest(urladdr,logoutfunc);
}

function logoutfunc() {
    //printlog(this.readyState); 
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
                // window.location.href='index.html';
                var timestamp = Math.floor(new Date().getTime()/1000);
                var data = '{"loginId" : "'+ loginId +'" ,"logoutTime" : "' + timestamp + '"}';
                var  urladdr =httpurl + "/php/record_action.php?action=update_login_records&msg="+data;
                printlog("urladdr = " + urladdr);
                //sendHTTPRequest(urladdr, loginfunc);  
                sendHTTPRequest(urladdr,update_loginOK); 
            } 
        }
    }
}

function update_loginOK(){
    printlog("this.readyState = " + this.readyState);
    if (this.readyState == 4) {
        printlog("this.status = " + this.status);
        printlog("this.responseText = " + this.responseText);
        if (this.status == 200) //TODO
        {
            document.location.href="index.html";
        }
    }
}
//--------------判断登录的角色，对UI显示做区分----------------
function showOrHide(){
    var  urladdr =httpurl + "/php/showOrHide.php?adminname="+adminname;
    printlog("urladdr = " + urladdr);
    //sendHTTPRequest(urladdr, loginfunc);  
    sendHTTPRequest(urladdr,showOrHidefunc);
}
function showOrHidefunc() {
    //printlog(this.readyState); 
    printlog("this.readyState = " + xmlhttp.readyState);
    if (xmlhttp.readyState == 4) {
        printlog("this.status = " + this.status);
        printlog("this.responseText = " + this.responseText);
        if (xmlhttp.status == 200) //TODO
        {
            var data = this.responseText;
            printlog(data);
            if (data == "3") // login success
            {
                document.getElementById('usermanage').style.display="none";
                
            } 
            else if(data == "1"){
                var records = document.getElementById('records');
                if(records){
                    records.style.display="block";
                }
                
            }

            else if (data == "4") // login success
            {
                document.getElementById('usermanage').style.display="none"; 
                document.getElementById('window1').style.display="none";
                document.getElementById('window2').style.display="none";
                
            }

            getPermissonsByUseName(adminname);
        }
    }
}
//--------------获取回车键值----------------
function onEnterDown(){
    if(window.event.keyCode == 13 || window.event.which == 13){ 
        chkinput(); 
    }    
}
//--------------本机信息----------------
function finishAction(){
    document.getElementById('actionUserName').value = adminname;
    document.getElementById('actionId').value = actionId;
    document.getElementById('actionChip').value = actionModel;
    document.getElementById('actionModel').value = actionType;
    document.getElementById('actionVersion').value = actionVersion;
}
//--------------插入数据（管理界面数据）----------------
function actionOk(){
    // var timestamp = Math.floor(new Date().getTime()/1000);
    var problem = document.getElementById('actionProblem').value;
    var data = '{"userId" : 1,"login_time" : ' + timestamp + ',"active_id" : "' + actionId + '","machine_core" :"' + actionModel + '","machine_type" : "' + actionType + '","version" :"' + actionVersion + '","issuer" :"' + problem +'"}'
    var  urladdr =httpurl + "/php/record_action.php?action=insert&msg=" + data;
    printlog("urladdr = " + urladdr);
    //sendHTTPRequest(urladdr, loginfunc);  
    sendHTTPRequest(urladdr,actionOkfunc);
}
function actionOkfunc(){
    //printlog(this.readyState); 
    printlog("this.readyState = " + xmlhttp.readyState);
    if (xmlhttp.readyState == 4) {
        printlog("this.status = " + this.status);
        printlog("this.responseText = " + this.responseText);
        if (xmlhttp.status == 200) //TODO
        {
            var data = this.responseText;
            printlog(data);
            if (data == "ERR_OK") // login success
            {
                var dialog1 = new singledialog("记录填写成功");
                document.getElementById('singlecontent').innerHTML=dialog1.content;
                setTimeout(hidediv,3000); 
            } 

            else if (data == "ERR_NEW_FAIL") // login success
            {
                var dialog1 = new singledialog("记录填写失败");
                document.getElementById('singlecontent').innerHTML=dialog1.content;
                setTimeout(hidediv,3000); 
            }
        }
    }
}
//------------------------------推送升级/tv端打开升级页面-----------------
function updateList(){
    var  urladdr = httpurl + "/php/getUpdateList.php?model=" + actionType + "&chip=" + actionModel ;
    printlog("urladdr = " + urladdr);
    //sendHTTPRequest(urladdr, loginfunc);  
    sendHTTPRequest(urladdr,updateListfunc);
}
function updateListfunc() {
    //printlog(this.readyState); 
    printlog("this.readyState = " + xmlhttp.readyState);
    if (xmlhttp.readyState == 4) {
        printlog("this.status = " + this.status);
        printlog("this.responseText = " + this.responseText);
        if (xmlhttp.status == 200) //TODO
        {
            var data = this.responseText;
            printlog(data);
            var json_str = JSON.parse(data);
            if (json_str.ret == "OK") // login success
            {
                var nowVersion = actionVersion.replace(/\./g,"");
                tc_version = json_str.version;
                tc_URL = json_str.url;
                printlog(nowVersion + "+" +tc_version);
                if (nowVersion < tc_version) {
                    var dialog1 = new singledialog("该电视可升级到最新版本：\n" + tc_version,hidediv);
                    document.getElementById('singlecontent').innerHTML=dialog1.content;
                    document.getElementById('singlebtnok').onclick=dialog1.ok;
                    // setTimeout(hidediv,2000);
                }
                else{
                    var dialog1 = new singledialog("当前电视已是最新版本",hidediv);
                    document.getElementById('singlecontent').innerHTML=dialog1.content;
                    document.getElementById('singlebtnok').onclick=dialog1.ok;
                }
                // document.getElementById("version").innerHTML=tc_version;
            } 

        }
    }
}
//------------------恢复出厂设置，去掉选定框--------------------
function reset()
{
    var dialog1 = new dialog("确定要恢复出厂设置吗<br><span id='keepapp'><input type='checkbox' id='checkboxApp' checked>保留本机应用</span>",hidediv,resetok)
    // checkbox = document.getElementById('checkboxApp');
    document.getElementById('content').innerHTML=dialog1.content;
    document.getElementById('btnclose').onclick=dialog1.cancle;
    document.getElementById('btnok').onclick=dialog1.ok;
}
function resetok(){
    checkbox = document.getElementById('checkboxApp');
    setTargetAndSource(sourceid,tv_id);
    if (checkbox.checked) {
        setCommandId(T2P_CMD_SYSTEM_RECOVERY,0);
        setIntegerParam("0");
    }
    else{
        setCommandId(T2P_CMD_SYSTEM_RECOVERY,0);
        setIntegerParam("1");
    }   
    socket.send(assemblingProtocol());
    hidediv();
}
//----------日志打印的封装函数-----------
function printlog(data){
    console.log(data);
}
