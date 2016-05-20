

var xmlhttp = null;
//http request  pushid
function sendrequset () 
{
  subinfo.style.display ="block";
  var pushid2 =document.getElementById('pushid').value;
  var pushid = pushid2.toLocaleUpperCase();
  //通过电视id通知请求
  var  urladdr =httpurl+"/dealhttprequest.php?TVId="+pushid;
  //pushid的请求
  //var  urladdr =httpurl+"/dealhttprequest.php?pushId="+pushid;
  console.log("urladdr="+urladdr);
  urlDeal(urladdr,0);  
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
          console.log("readyState="+xmlhttp.readyState);
            if (xmlhttp.readyState == 4)
            {// 4 = "loaded"
              console.log("appurl_download readyState="+xmlhttp.status);
                     clearInterval(interval); 
	     if (xmlhttp.status == 200)
              {// 200 = "OK"
		clearInterval(interval);
                var   data =xmlhttp.responseText;
                console.log("return  result="+data);
                if (data == "ok")
                { 
		   clearInterval(interval); 
                   subinfo.innerHTML="远程TV授权控制请求";
                   connect();
                   document.getElementById('break').style.display="block";
                   document.getElementById('link').style.display="none";
                   //return "ok";
                }
                else if (data == "refuse")
         	{ 
                  subinfo.innerHTML ="<font color='red'>远程TV拒绝控制请求!</font>";
                }
                else if (data == "timeout") 
                {
                   subinfo.innerHTML = "<font color='red'>网络超时,请稍后再试!</font>";
                }
		else if (data == "replace")
                {
                  subinfo.innerHTML = "<font color='red'>新的PC发起连接请求，您的请求被搁置</font>";
                }
                else
                {
                  subinfo.innerHTML = "<font color='red'>没有找到远程TV,请确认电视ID!</font>";
                }
            }              
            else
            {	
		var code = xmlhttp.status;
                document.getElementById('span1').innerHTML = "<font color='red'>请求远程TV授权出错!错误码为：</font>"+"<font color='red'>"+code+"</font>";
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
      console.log("php is null");
   }
}

function  uploadfile_state()
{
  console.log("uploadfileDeal readyState="+xmlhttp.readyState)
  if (xmlhttp.readyState == 4)
  {// 4 = "loaded"
    console.log("uploadfileDeal status="+xmlhttp.status);
    if (xmlhttp.status == 200)
    {
      var   data =xmlhttp.responseText;
      console.log("uploadfileDeal data="+data);
    }
  }
}

function   uploadfileDeal()
{
  var  urladdr =httpurl+"/fileupload.php";
  //var  urladdr ="http://localhost/fileupload.php";
  console.log("urladdr="+urladdr);
  urlDeal(urladdr,1);  

}
