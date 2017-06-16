<?php
header("Content-type: text/html; charset=utf-8");

$activeId = $_GET['activeId'];
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
  $activeId = $_GET['activeId'];

  // $appidurl ="http://msg.push.skysrt.com:8080/api/getAllByCode?code=".$tvid;
  // $appidinfojson=httpRequest($appidurl);
  // $appidinfo =json_decode($appidinfojson); 
  // $appinfoArray =$appidinfo->appInfos;
  // $arrCount =count($appinfoArray);

  $isFindPushid = 0;
  $isFindAgentPushid = 0;
  $isPushIdExsit = 0;

  $apikey = "sjDG4kZA";
  $appidSys = "547e1e25-26a0-4576-8cd1-1c19b0729c25";
  $appidTv = "2L1gbXK0";
  $devid = "RDIxRq8r";
  $APISecret = "sjDG4kZA";

  $accessTokenSys = getToken($devid, $appidSys, $APISecret);
  $SySpushid = getPushIdByActiveId($appidSys, $activeId, $accessTokenSys);
  if ("" == $SySpushid) {
    $SySpushid = getPushIdByCode($tvid, $appidSys, $apikey);
  }

  if ("" != $SySpushid) {
    $isFindPushid  = 1;
    $ret = pushv2($SySpushid,$appidSys);
    if($ret == 200) {
      $isPushIdExsit = 1;
    }
  }
  // if ("" != $SySpushid2) {
  //   $isFindPushid  = 1;
  //   $ret = pushv2($SySpushid2,$appidSys);
  //   if($ret == 200) {
  //     $isPushIdExsit = 1;
  //   }
  // }

  $accessTokenTv = getToken($devid, $appidTv, $APISecret);
  $TVCpushid = getPushIdByActiveId($appidTv, $activeId, $accessTokenTv);
  if ("" == $TVCpushid) {
    $TVCpushid = getPushIdByCode($tvid, $appidTv, $apikey);
  }
  // $TVCpushid = getPushIdByCode($tvid, $appidTv, $apikey);

  if ("" != $TVCpushid) {
    $isFindPushid  = 1;
    $ret = pushv2($TVCpushid,$appidTv);
    if($ret == 200) {
      $isPushIdExsit = 1;
      $isFindAgentPushid = 1;
    }
  }
  
  if ($isFindPushid == 1) {
    if (1 == $isPushIdExsit) {
      echo notifierSocket($tvid)  ;//pushid 把tvid告诉服务器
      return;
    } 
  }
  // else {
    echo "pushid is null";
  // }
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
    public function __construct($host='223.202.11.125',$port=9002){  
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

function getPushIdByCode($tvid, $appid, $apikey) 
{
  $getTVIDUrl = "http://msg.push.skysrt.com:8080/api/getClientIdAndPushId";
  #$appid ='nAPkh8JA';
  #$apikey ='sjDG4kZA';
  $timestamp = microtime_float();
  $md5_src = $appid . $apikey . $timestamp. $tvid;
  $tvid_token = md5($md5_src);
  #echo($timestamp."&&");
  #echo($tvid_token."\n");
  $tvidurl = $getTVIDUrl . "?code=" . $tvid . "&appId=" . $appid. "&timeStamp=" . $timestamp . "&token=" . $tvid_token;
  //echo $md5_src . "\n";
  #echo $tvidurl . "\n";
  //echo $tvid_token . "\n";
  //echo $timestamp . "\n";
  $tvid_json = httpRequest($tvidurl);
  #echo  "tvid_json= " . $tvid_json . "\n";
  $client_ret =json_decode($tvid_json);  
  return $client_ret->pushId;
}

function getPushIdByActiveId($appid, $activeId, $accessToken){
  $getPushIDUrl = "http://msg.push.skysrt.com:8080/api/v3/getPushIdByActiveId";
  $timestamp = microtime_float();
  $tvidurl = $getPushIDUrl . "?appId=" . $appid . "&activeId=" . $activeId. "&timeStamp=" . $timestamp . "&token=" . $accessToken;
  $tvid_json = httpRequest($tvidurl);
  #echo  "tvid_json= " . $tvid_json . "\n";
  $client_ret =json_decode($tvid_json); 
  if ($client_ret->code == "200") {
    return $client_ret->data->pushId;
   }  else{
    return "";
   }
}


function pushv2($id,$appid){
  $appid = $appid;
  $apikey ='sjDG4kZA';
  $timestamp = microtime_float();
  //echo $timestamp."\n";
  $md5_src = $appid . $apikey . $timestamp . "connect";
  $tvid_token = md5($md5_src);
  $url = "http://msg.push.skysrt.com:8080/v2/message/sendMsg?pushId=".$id ."&msg=connect&ttl=120&token=".$tvid_token."&timeStamp=".$timestamp."&appId=".$appid;
  $result =  httpRequest($url);
  $datajson =json_decode($result);
  return $datajson->code;

}

function getToken($devid, $appid, $APISecret){
  $devid = $devid;
  $appid = $appid;
  $APISecret = $APISecret;
  $timeStamp = microtime_float();
  $md5String = $devid. $appid. $APISecret. $timeStamp;
  $token = md5($md5String);
  $url = "http://msg.push.skysrt.com:8080/api/v3/getToken?devId=".$devid."&appId=".$appid."&timeStamp=".$timeStamp."&token=".$token;
  $result =  httpRequest($url);
  $datajson =json_decode($result);
  return $datajson->data->access_token;
}

function microtime_float()
{
    list($usec, $sec) = explode(" ", microtime());
    // echo (int)($usec * 1000) . "\n";
    return (int)($sec . '000' ) + (int)($usec * 1000);
}

?>
