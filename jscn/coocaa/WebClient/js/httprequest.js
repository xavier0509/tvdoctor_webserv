var getTVId;
var g_activeId = "";
var xmlhttp = null;

//http request  pushid
function sendrequset () 
{
  if(subinfo)
  {
      subinfo.style.display ="block";
  }
  var pushid2 =document.getElementById('pushid').value;
  var pushid3 = pushid2.replace(/\s+/g,"");;
  // var pushid = pushid3.toLocaleUpperCase();
  var pushid = pushid3;
  printlog(pushid);
  var lastchar = pushid.charAt(pushid.length - 1);

  if (pushid == "SKYWORTHCOOCAA" || lastchar == "@") 
  {
    getTVId = pushid;
    g_activeId = "";
    var  urladdr ="/jscn/php/dealhttprequest.php?TVId="+getTVId;
    //pushid的请求
    printlog("urladdr="+urladdr);
    urlDeal(urladdr,0); 
  }
  else
  {
    var  getTVidurl = "/jscn/php/getTVId.php?ActiveId="+pushid;
    printlog("getTVidurl = " + getTVidurl);
    sendHTTPRequest(getTVidurl,getTVidfunc);
    // var  urladdr ="/jscn/php/dealhttprequest.php?TVId="+pushid+"&activeId="+pushid;
    // printlog("urladdr="+urladdr);
    // urlDeal(urladdr,0); 
  }
}

function getTVidfunc()
{
    printlog("this.readyState = " + xmlhttp.readyState);
    if (xmlhttp.readyState == 4) {
        printlog("this.status = " + this.status);
        printlog("this.responseText = " + this.responseText);
        if (xmlhttp.status == 200) //TODO
        {
            var data = this.responseText;
            printlog(data);
            //if (data == "TVId is null") // login success
            //{ 
            //   document.getElementById('linkTV').removeAttribute("disabled");
            //   document.getElementById('linkTV').removeAttribute("class");
            //   clearInterval(interval);
            //   document.getElementById('span1').innerHTML="<font color='red'>TVId为空</font>";
            //   setTimeout("document.getElementById('span1').innerHTML=''",3000);
            //   document.getElementById('linkTV').innerHTML="连接电视";
            //} 
            //else
            { 
              //通过电视id通知请求
              if (data == "TVId is null")	// 如果TVID为空则随机生成一个
              {
              	var rand1 = Math.ceil(1000 * Math.random());
	            var rand2 = Math.ceil(1000 * Math.random());
	            var rand3 = Math.ceil(1000 * Math.random());
	            var rand4 = Math.ceil(1000 * Math.random());
	            var rand5 = Math.ceil(1000 * Math.random());
	            getTVId = "" + rand1 + "-" + rand2 + "-" + rand3 + "-" + rand4 + "-" + rand5;
              } 
              else
              getTVId = data;
              var pushid2 =document.getElementById('pushid').value;
              var pushid3 = pushid2.replace(/\s+/g,"");;
              // var pushid = pushid3.toLocaleUpperCase();
              var activeId = pushid3;
              g_activeId = activeId;
              var  urladdr ="/jscn/php/dealhttprequest.php?TVId="+data+"&activeId="+activeId;
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
		document.getElementById('linkTV').removeAttribute("disabled");
                document.getElementById('linkTV').removeAttribute("class");
                document.getElementById('linkTV').removeAttribute("style"); 
              if (xmlhttp.status == 200)
              {
                document.getElementById('linkTV').removeAttribute("disabled");
                document.getElementById('linkTV').removeAttribute("class");
                document.getElementById('linkTV').removeAttribute("style");
                clearInterval(interval);
                var   data =xmlhttp.responseText;
                printlog("return  result="+data);
                if (data == "ok")
                { 
                  clearInterval(interval); 
                  connect();
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
