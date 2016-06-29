var getTVId;
var xmlhttp = null;
//http request  pushid
function sendrequset () 
{
  if(subinfo){subinfo.style.display ="block";}
  var pushid2 =document.getElementById('pushid').value;
  var pushid3 = pushid2.replace(/\s+/g,"");;
  var pushid = pushid3.toLocaleUpperCase();
  printlog(pushid);
  var lastchar = pushid.charAt(pushid.length - 1);
  if (pushid == "SKYWORTHCOOCAA" || lastchar == "@") {
    getTVId = pushid;
    var  urladdr ="/php/dealhttprequest.php?TVId="+getTVId;
    //pushid的请求
    //var  urladdr =httpurl+"/dealhttprequest.php?pushId="+pushid;
    printlog("urladdr="+urladdr);
    urlDeal(urladdr,0); 
  }
  else{
    var  getTVidurl = "/php/getTVId.php?ActiveId="+pushid;
    printlog("getTVidurl = " + getTVidurl);
    //sendHTTPRequest(urladdr, loginfunc);  
    sendHTTPRequest(getTVidurl,getTVidfunc);
  }
  




  // //通过电视id通知请求
  // var  urladdr ="/php/dealhttprequest.php?TVId="+pushid;
  // //pushid的请求
  // //var  urladdr =httpurl+"/dealhttprequest.php?pushId="+pushid;
  // printlog("urladdr="+urladdr);
  // urlDeal(urladdr,0); 
}

function getTVidfunc(){
    printlog("this.readyState = " + xmlhttp.readyState);
    if (xmlhttp.readyState == 4) {
        printlog("this.status = " + this.status);
        printlog("this.responseText = " + this.responseText);
        if (xmlhttp.status == 200) //TODO
        {
            var data = this.responseText;
            printlog(data);
            if (data == "TVId is null") // login success
            {
                 clearInterval(interval);
                 document.getElementById('span1').innerHTML="<font color='red'>TVId为空</font>";
                 setTimeout("document.getElementById('span1').innerHTML=''",3000);
                 document.getElementById('linkTV').innerHTML="连接电视";
            } 
            else{
              //通过电视id通知请求
              getTVId = data;
              var  urladdr ="/php/dealhttprequest.php?TVId="+data;
              //pushid的请求
              //var  urladdr =httpurl+"/dealhttprequest.php?pushId="+pushid;
              printlog("urladdr="+urladdr);
              urlDeal(urladdr,0); 
            }
        }
    }
}


function  urlDeal(url,index)
{

   if (xmlhttp == null)
   {
      if (window.XMLHttpRequest) 
      {
        xmlhttp=new XMLHttpRequest();
      }
      else if (window.ActiveXObject)
      {
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
      }
   }
    if (xmlhttp != null)
    {
      if ( 0 == index )
      {
         xmlhttp.onreadystatechange=function()
         {
          printlog("readyState="+xmlhttp.readyState);
            if (xmlhttp.readyState == 4)
            {// 4 = "loaded"
              printlog("appurl_download readyState="+xmlhttp.status);
                     clearInterval(interval); 
	     if (xmlhttp.status == 200)
              {// 200 = "OK"
		            clearInterval(interval);
                var   data =xmlhttp.responseText;
                printlog("return  result="+data);
                if (data == "ok")
                { 
                  clearInterval(interval); 
                   // subinfo.innerHTML="远程TV授权控制请求";
                   connect();
           //        document.getElementById('break').style.display="block";
             //      document.getElementById('link').style.display="none";
                   //return "ok";
                }
                else if (data == "refuse")
         	{ 
                  subinfo.innerHTML ="<font color='red'>远程TV拒绝控制请求!</font>";
                  setTimeout("subinfo.innerHTML =''",5000);
                  document.getElementById('linkTV').innerHTML="连接电视";
                }
                else if (data == "timeout") 
                {
                   subinfo.innerHTML = "<font color='red'>网络超时,请稍后再试!</font>";
                   document.getElementById('linkTV').innerHTML="连接电视";
                   setTimeout("subinfo.innerHTML =''",5000);
                }
		else if (data == "replace")
                {
                  subinfo.innerHTML = "<font color='red'>新PC发起连接请求，您的请求被搁置</font>";
                  document.getElementById('linkTV').innerHTML="连接电视";
                  setTimeout("subinfo.innerHTML =''",5000);
                }
                else if(data == "exist"){
                  subinfo.innerHTML = "<font color='red'>该TV已被连接，请稍后再试</font>";
                  document.getElementById('linkTV').innerHTML="连接电视";
                  setTimeout("subinfo.innerHTML =''",5000);
                }
                else
                {
                  subinfo.innerHTML = "<font color='red'>没有找到远程TV,请确认激活ID!</font>";
                  document.getElementById('linkTV').innerHTML="连接电视";
                  setTimeout("subinfo.innerHTML =''",5000);
                }
            }              
            else
            {	
		var code = xmlhttp.status;
                document.getElementById('span1').innerHTML = "<font color='red'>请求远程TV授权出错!错误码为：</font>"+"<font color='red'>"+code+"</font>";
                document.getElementById('linkTV').innerHTML="连接电视";
                setTimeout("subinfo.innerHTML =''",5000);
                // document.getElementById('break').style.display="block";
                // document.getElementById('link').style.display="none";
            }
          }
     }
    }
    else if (1 == index)
    {
      xmlhttp.onreadystatechange = uploadfile_state();
    }
    xmlhttp.open("GET",url,true);
    xmlhttp.send(null);
   }
   else 
   {
      printlog("php is null");
   }
}

function  uploadfile_state()
{
  printlog("uploadfileDeal readyState="+xmlhttp.readyState)
  if (xmlhttp.readyState == 4)
  {// 4 = "loaded"
    printlog("uploadfileDeal status="+xmlhttp.status);
    if (xmlhttp.status == 200)
    {
      var   data =xmlhttp.responseText;
      printlog("uploadfileDeal data="+data);
    }
  }
}

function   uploadfileDeal()
{
  var  urladdr =httpurl+"/fileupload.php";
  //var  urladdr ="http://localhost/fileupload.php";
  printlog("urladdr="+urladdr);
  urlDeal(urladdr,1);  

}


function sendHTTPRequest(url, func)
{

  if (xmlhttp == null)
  {
    if (window.XMLHttpRequest) 
    {
      xmlhttp=new XMLHttpRequest();
    }
    else if (window.ActiveXObject)
    {
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
  }
  if (xmlhttp != null)
  {
    xmlhttp.onreadystatechange = func;
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }
  else 
  {
    printlog("php is null");
  }
}
