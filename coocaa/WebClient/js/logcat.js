document.write("<script language=javascript src='js/webclient.js' charset=\"utf-8\"></script>");

var  logcatsocket;

var  g_logcatcmdsIndex = 0;
var  logcatarrCmd = [];
var  logcatStatus = 0;//0为关闭，1为启动

function logcatconsolefocus()
{
  if (!isStartLogcatSocket)
  {
    isStartLogcatSocket = true;
    logcatConnect();
    consolefocus();

  }
  // logcatInput.focus();
  // document.getElementById('inputcmd2').style.display="none";
}


function logcatConnect()
{
  try
  {
    logcatsocket = new WebSocket(logcatHost);
    OutputLog('logcat Socket Status: '+logcatsocket.readyState);
    logcatsocket.onopen = function()
    { 
       var  v1 = new Uint8Array(8);
       v1[0] = (tv_id   >> 24 ) & 0xff;
       v1[1] = (tv_id   >> 16 ) & 0xff;
       v1[2] = (tv_id   >> 8 ) & 0xff;
       v1[3] = (tv_id) & 0xff;
       v1[4] = 0x0d;
       v1[5] = 0x0a;
       v1[6] = 0x0d;
       v1[7] = 0x0a;
       OutputLog("bufer ="+v1.buffer+",len ="+v1.length);
       logcatsocket.send(v1.buffer);  //发送TV的id号

       setTargetAndSource(sourceid,tv_id);//发命令给TV开logcat连接
       setCommandId(CMD_LOGCAT_START_SCREEN,0);
       socket.send(assemblingProtocol());
    }
    logcatsocket.onmessage = function(msg)
    {
      var str = "";
      str = msg.data;
      var   len = str.size;
      printlog("logcat message len="+len);
      var reader = new FileReader();
      reader.readAsBinaryString(str);
      reader.onload = function()
      {
         var   text =reader.result;
         // strCmd =text;
          //logcatarrCmd.push(text);
          logcatprintln(text);
          setInnerText(logcatInput, "");               
      }                   
    }
  
     logcatsocket.onclose = function()
    {
         // subinfo.innerHTML = "PC与和服务器断开链接！";
     printlog('logcatSocket Status: '+logcatsocket.readyState+' (Closed)');
    } 
    
     logcatsocket.onerror =function(event)
     {
        //subinfo.innerHTML = "PC与服务器链接出错了！";
        printlog('logcat socket Status:: Error was reported');
     }    
      
  } 
  catch(exception)
  {
    printlog('Error'+exception);
  }
      
}

function getInnerText(element) 
{
    return (typeof element.value == "string") ? element.value : element.innerText;
}


document.onkeydown = function(e)
{
  var theEvent = window.event || e;
  var activeNode = document.activeElement;
  printlog("activeNode type= "+activeNode.type+", activeNode.id ="+activeNode.id);

   var keycode=e.keyCode;
    if (activeNode.id ==  "divInput2")
    {
    if(keycode == "13") //回车
    {
        var  data= getInnerText(logcatInput);
        data = trim(data);
       if ((data.substr(0,6) != "logcat")) 
        {
         cmdfunc();
        }
       else{
          if (data.length == 0)
          {
            return;
          }
          logcatStatus = 1;
          logcatarrCmd.push(data);
          logcatprintln(data);
          setTargetAndSource(sourceid,tv_id);
          setCommandId(CMD_LOGCAT_PARAM_SCREEN,0);
          setStringParam(data);
          socket.send(assemblingProtocol());  
        // ();
        // objInput.innerText = "";
          setInnerText(logcatInput, "");
          return false;
       }
    }
    else if(keycode == "38" || keycode == "40") //上下键
    {
      var len = parseInt(logcatarrCmd.length);
      if(g_logcatcmdsIndex < len)
      {
          setInnerText(logcatInput, "");
          setInnerText(logcatInput, logcatarrCmd[g_logcatcmdsIndex]);
          g_logcatcmdsIndex++;
      }
      else
      {
          g_logcatcmdsIndex = 0;
      }
    }
    else if (theEvent.ctrlKey && keycode=="67") //ctrl+C   "67"
    {
      if(logcatStatus == 1)
      {
        var  strCmd = "logcat停止抓取";
        // logcatarrCmd.push(strCmd);
        logcatprintln(strCmd) 
        setInnerText(logcatInput, "");
        setTargetAndSource(sourceid,tv_id);
        setCommandId(CMD_LOGCAT_PARAM_SCREEN,0);
        setStringParam("pause");
        socket.send(assemblingProtocol());
        logcatStatus = 0;
      }
      else
      {
        setInnerText(logcatInput, "");
        setTargetAndSource(sourceid,tv_id);
        setCommandId(CMD_TELNET_DATA,0);
        setStringParam('\x03');
        socket.send(assemblingProtocol());
      }
     }
    else if (theEvent.ctrlKey && keycode=="90") //ctrl+Z  断开连接
    {
      isStartLogcatSocket = false;
      var  strCmd = "连接已断开";
      //logcatarrCmd.push(strCmd);
      logcatprintln(strCmd) 
      setInnerText(logcatInput, "");
      //给TV断开的命令
      setTargetAndSource(sourceid,tv_id);
      setCommandId(CMD_LOGCAT_STOP_SCREEN,0);
      socket.send(assemblingProtocol());
      //主动跟服务器断开连接
      logcatsocket.close();
     }
 }
}

function stopCMD(){
  if(logcatStatus == 1)
      {
        var  strCmd = "logcat停止抓取";
        // logcatarrCmd.push(strCmd);
        logcatprintln(strCmd) 
        setInnerText(logcatInput, "");
        setTargetAndSource(sourceid,tv_id);
        setCommandId(CMD_LOGCAT_PARAM_SCREEN,0);
        setStringParam("pause");
        socket.send(assemblingProtocol());
        logcatStatus = 0;
      }
      else
      {
        setInnerText(logcatInput, "");
        setTargetAndSource(sourceid,tv_id);
        setCommandId(CMD_TELNET_DATA,0);
        setStringParam('\x03');
        socket.send(assemblingProtocol());
      }
}
function logcatprintln(str) 
{
    var objDIV = document.createElement("div");
    if (objDIV.innerText != null)
        objDIV.innerText = str;
    else
        objDIV.textContent = str;
    logcatContent.appendChild(objDIV);
    logcatContent.scrollTop = logcatContent.scrollHeight;
}
