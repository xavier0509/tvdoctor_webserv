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
  $str="";
  $a = microtime();
  $str = $str." ". $a;

  $Result = array();//存放结果数组

  if(empty($_GET)|| !isset($_GET['TVId']))
  {
    $Result["errorparam"] =  urlencode(":not TVId param");
    $Res = json_encode($Result);
    return urldecode($Res);		
  }

  $tvid = $_GET['TVId'];

  //通过TVid获取clientid
  $clientidurl= "http://msg.push.skysrt.com:8080/api/getClientId?code=" . $tvid;
  $clientidjson =  httpRequest($clientidurl);
  $clientid =json_decode($clientidjson);  

  $c = microtime();
  $str = $str." ".$c;
  if($clientid->clientId == "" )
  {
    echo "clientid is null, tvid = " . $tvid;
    return;
  }
  // http://msg.push.skysrt.com:8080/api/getPushId?clientId=zvsPO8xs&appId=YFdIHyYf   
  //通过clientId获取pushid  TV控制的id是 2L1gbXK0
  $pushIdurl ="http://msg.push.skysrt.com:8080/api/getPushId?clientId=".$clientid->clientId."&appId=2L1gbXK0"; 
  
  $pushidjson = httpRequest($pushIdurl);
  $pushiddata =json_decode($pushidjson);  
  //  echo  $pushiddata->pushId;
  $d = microtime();
  $str = $str." ".$d;
  if($pushiddata->pushId == "" )
  {
    echo "pushid is null";
    return;
  }
  $pushid =$pushiddata->pushId;

  $url="http://msg.push.skysrt.com:8080/message/sendmsg?pushId=".$pushid ."&msg=connect&ttl=120";
  //http://msg.push.skysrt.com:8080/message/sendmsg?pushId=c539a58d1c092d0cb90317fd8cc64a97&msg=123&ttl=120
  $result =  httpRequest($url);
  //echo 'url return='.$result ;
  //后台服务器正常返回了 打开下面二句 
  $datajson =json_decode($result);  
  if( $datajson->code ==200)//$datajson->msg =="ok" &&
  {
    echo notifierSocket($tvid)  ;//pushid 把tvid告诉服务器
  }
  else 
    echo $result ;
}

function httpRequest($url,$post='',$method='GET',$limit=0,$returnHeader=FALSE,$cookie='',$bysocket=FALSE,$ip='',$timeout=15,$block=TRUE)
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


/*
class Byte{  
    //长度  
    private $length=0;  
      
    private $byte='';  
    //操作码  
    private $code;  
    public function setBytePrev($content)
    {  
        $this->byte=$content.$this->byte;  
    }  
    public function getByte()
    {  
        return $this->byte;  
    }  
    public function getLength()
    {  
        return $this->length;  
    }  
    public function writeChar($string)
    {  
        $this->length+=strlen($string);  
        $str=array_map('ord',str_split($string));  
        foreach($str as $vo){  
            $this->byte.=pack('c',$vo);  
        }  
        $this->byte.=pack('c','0');  
        $this->length++;  
    }  
    public function writeInt($str)
    {  
        $this->length+=4;  
        $this->byte.=pack('L',$str);  
    }  
    public function writeShortInt($interge){  
        $this->length+=2;  
        $this->byte.=pack('v',$interge);  
    }  
}  */
class NotifierSocket{  
    private $socket;  
    private $port=9002;  
    private $host='127.0.0.1';  //
   // private $byte;  
   // private $code;  
    //const CODE_LENGTH=2;  
    //const FLAG_LENGTH=4;  
    //public function __set($name,$value){  
     //   $this->$name=$value;  
    //}  
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
       // $this->byte=new Byte();  
    }  
    public function write($data){  
        if(is_string($data)||is_int($data)||is_float($data)){  
            $data=$data;  
        }  
       // $this->setPrev();  
        $this->send($data);
       return  $this->receive();  
    }  
    /* 
     *设置表头部分 
     *表头=length+code+flag 
     *length是总长度(4字节)  code操作标志(2字节)  flag暂时无用(4字节) 
     */  
   /* private function getHeader(){
        $length=$this->byte->getLength();  
        $length=intval($length)+self::CODE_LENGTH+self::FLAG_LENGTH;  
        return pack('L',$length);  
    }  
    private function getCode(){  
        return pack('v',$this->code);  
    }  
    private function getFlag(){  
        return pack('L',24);  
    }  
      
    private function setPrev(){  
        $this->byte->setBytePrev($this->getHeader().$this->getCode().$this->getFlag());  
    } */ 
  
    private function send($data){  
        $result=socket_write($this->socket,/*$this->byte->getByte()*/"$data",strlen("$data")); 

        if(!$result){  
            return 'send info  error';  
        }  
       
    }  
    public function receive(){
        $rec=socket_read($this->socket,8192);
        if (!$rec) {
            return "receive data fail";
          
            
        }else {
            return $rec;
            }
    }
    public function __desctruct(){  
        socket_close($this->socket);  
    }  
}  

function notifierSocket($data)
{
    $notifierSocket=new NotifierSocket();  
   // $notifierSocket->code=11;  
    return  $notifierSocket->write($data);
}


?>
