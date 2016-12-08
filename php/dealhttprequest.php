<?php
header("Content-type: text/html; charset=utf-8");

$TVId = $_GET['TVId'];
$length = strlen($TVId);
$lastChar = substr($TVId, $length-1);
if($TVId == "SKYWORTHCOOCAA" || $lastChar == "@"){
  echo notifierSocket($TVId);
}
else{
  getPara();
}

function getPara()
{

  $Result = array();//存放结果数组

  if(empty($_GET)|| !isset($_GET['TVId']))
  {
    $Result["errorparam"] = urlencode(":not TVId param");
    $Res = json_encode($Result);
    return urldecode($Res);
  }

  $tvid = $_GET['TVId'];

  $appidurl ="http://msg.push.skysrt.com:8080/api/getAllByCode?code=".$tvid;
  $appidinfojson=httpRequest($appidurl);
  $appidinfo =json_decode($appidinfojson); 
  $appinfoArray =$appidinfo->appInfos;
  $arrCount =count($appinfoArray);

  $isFindAppid = 0;
  $isFindAgentPushid = 0;
  $isPushIdExsit = 0;

  for($x = 0; $x < $arrCount; $x++ ) 
  {
    if ("547e1e25-26a0-4576-8cd1-1c19b0729c25" == $appinfoArray[$x]->appId )
    {
      if ('' != $appinfoArray[$x]->pushId) {
        $pushid = $appinfoArray[$x]->pushId;
        $isFindAppid = 1;
        break;
      }
    }  
  }
  

  if ($isFindAppid == 1) {
    //send push msg to system   
    // $url = "http://msg.push.skysrt.com:8080/message/sendmsg?pushId=".$pushid ."&msg=connect&ttl=120";
    // $result =  httpRequest($url);
    // $datajson = json_decode($result);  
    $ret = pushv2($pushid);
    if($ret == 200) {
      $isPushIdExsit = 1;
    }
  }

  for($x = 0 ;$x < $arrCount; $x++) 
  {
    if ("2L1gbXK0" == $appinfoArray[$x]->appId)
    {
      if ('' != $appinfoArray[$x]->pushId) {
        $pushid = $appinfoArray[$x]->pushId;
        $isFindAppid = 1;
        $isFindAgentPushid = 1;
        break;
      }
    }     
  }

  if ($$isFindAppid = 1 == 1) {
    $ret = pushv2($pushid);
    //send push msg to tvagent
    // $url="http://msg.push.skysrt.com:8080/message/sendmsg?pushId=".$pushid ."&msg=connect&ttl=120";
    // $result =  httpRequest($url);
    // //echo 'url return='.$result ;
    // //后台服务器正常返回了 打开下面二句 
    // $datajson =json_decode($result);  
    if( $ret == 200) {
      $isPushIdExsit = 1;
    }
    if ($isPushIdExsit == 1) {
      echo notifierSocket($tvid)  ;//pushid 把tvid告诉服务器
    } else { 
      echo $result ;
    }
  } else {
    echo "pushid is null";
  }
  return;
}

function httpRequest($url,$post='',$method='GET',$limit=0,$returnHeader=FALSE,$cookie='',$bysocket=FALSE,$ip='',$timeout=60,$block=TRUE)
{  
       $return = '';  
       $matches = parse_url($url);  

       !isset($matches['host']) && $matches['host'] = '';  
       !isset($matches['path']) && $matches['path'] = '';  
       !isset($matches['query']) && $matches['query'] = '';  
       !isset($matches['port']) && $matches['port'] = '';  
  
       $host = $matches['host'];  
       $path = $matches['path'] ? $matches['path'].($matches['query'] ? '?'.$matches['query'] : '') : '/';  
       $port = !empty($matches['port']) ? $matches['port'] : 80;  
      // 转化为小写
       if(strtolower($method) == 'post') 
       {  
           $post = (is_array($post) and !empty($post)) ? http_build_query($post) : $post;  
           $out = "POST $path HTTP/1.0\r\n";  
           $out .= "Accept: */*\r\n";  
           //$out .= "Referer: $boardurl\r\n";  
           $out .= "Accept-Language: zh-cn\r\n";  
           $out .= "Content-Type: application/x-www-form-urlencoded\r\n";  
           $out .= "User-Agent: $_SERVER[HTTP_USER_AGENT]\r\n";  
           $out .= "Host: $host\r\n";  
           $out .= 'Content-Length: '.strlen($post)."\r\n";  
           $out .= "Connection: Close\r\n";  
           $out .= "Cache-Control: no-cache\r\n";  
           $out .= "Cookie: $cookie\r\n\r\n";  
           $out .= $post;  
       } else {  
           $out = "GET $path HTTP/1.0\r\n";  
           $out .= "Accept: */*\r\n";  
           //$out .= "Referer: $boardurl\r\n";  
           $out .= "Accept-Language: zh-cn\r\n";  
           $out .= "User-Agent: $_SERVER[HTTP_USER_AGENT]\r\n";  
           $out .= "Host: $host\r\n";  
           $out .= "Connection: Close\r\n";  
           $out .= "Cookie: $cookie\r\n\r\n";  
       }  
  //打开网络socket
       $fp = fsockopen(($ip ? $ip : $host), $port, $errno, $errstr, $timeout);  
  
       if(!$fp) return ''; 
       else 
       {  
           $header = $content = '';    
           stream_set_blocking($fp, $block);  
           stream_set_timeout($fp, $timeout);  
           fwrite($fp, $out);  
           $status = stream_get_meta_data($fp);  
  
           if(!$status['timed_out']) 
           {//未超时  //检查是否执行完成
               while (!feof($fp)) {  
                   $header .= $h = fgets($fp);  
                   if($h && ($h == "\r\n" ||  $h == "\n")) break;  
               }  
  
               $stop = false;  
               while(!feof($fp) && !$stop) {  
                   $data = fread($fp, ($limit == 0 || $limit > 8192 ? 8192 : $limit));  
                   $content .= $data;  
                   if($limit) {  
                       $limit -= strlen($data);  
                       $stop = $limit <= 0;  
                   }  
               }  
           }  
        fclose($fp);  
        return $returnHeader ? array($header,$content) : $content;  
       }  
    }  


class NotifierSocket
{  
    private $socket;  
    private $port=9002;  
    private $host='127.0.0.1';  
    public function __construct($host='192.168.2.38',$port=9002){  
        $this->host=$host;  
        $this->port=$port;  
        $this->socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);  
        if(!$this->socket){  
            return 'create  socket error';  
        }  
        $result = socket_connect($this->socket,$this->host,$this->port);  
        if(!$result){  
                 $errorcode = socket_last_error();
            $errormsg = socket_strerror($errorcode);
           return "connect error=".$errormsg;       
        }  
    }  
    
    public function write($data)
    {  
        if(is_string($data)||is_int($data)||is_float($data))
        {  
            $data=$data;  
        }  
        $this->send($data);
       return  $this->receive();  
    }  
    
    private function send($data)
    {  
        $result=socket_write($this->socket,"$data",strlen("$data")); 
        if(!$result)
        {  
            return 'send info  error';  
        }  
       
    }  
    public function receive()
    {
        $rec=socket_read($this->socket,8192);
        if (!$rec) 
        {
            return "receive data fail";                    
        }
        else
        {
            return $rec;
        }
    }
    public function __desctruct()
    {  
        socket_close($this->socket);  
    }  
}  

function notifierSocket($data)
{
    $notifierSocket=new NotifierSocket();  
    return  $notifierSocket->write($data);
}


function pushv2($id){
  $appid ='nAPkh8JA';
  $apikey ='sjDG4kZA';
  $timestamp = microtime_float();
  echo $timestamp."\n";
  $md5_src = $appid . $apikey . $timestamp . "connect";
  $tvid_token = md5($md5_src);
  $url = "http://msg.push.skysrt.com:8080/v2/message/sendMsg?pushId=".$id ."&msg=connect&ttl=120&token=".$tvid_token."&timeStamp=".$timestamp."&appId=".$appid;
  $result =  httpRequest($url);
  $datajson =json_decode($result)
  return $datajson->code;

}

function microtime_float()
{
    list($usec, $sec) = explode(" ", microtime());
    // echo (int)($usec * 1000) . "\n";
    return (int)($sec . '000' ) + (int)($usec * 1000);
}

?>
