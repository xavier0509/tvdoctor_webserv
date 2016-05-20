<?php
header("Content-type: text/html; charset=utf-8");

  //get TVID by active ID
  $getTVIDUrl = "http://id.device.skysrt.com/v1/serviceId";
  $tvid = $_GET['ActiveId'];
  $appid ='IYM9D51J';
  $apikey ='2QDTUQSY';
  $timestamp = mktime();
  $md5_src = $apikey . "&" . $appid . "&" . $timestamp . "&" . $tvid;
  $tvid_token = md5($md5_src);

  $tvidurl = $getTVIDUrl . "/?appid=" . $appid. "&timestamp=" . $timestamp . "&token=" . $tvid_token . "&sid=" . $tvid;
  //echo $md5_src . "\n";
  //echo $tvidurl . "\n";
  //echo $tvid_token . "\n";
  //echo $timestamp . "\n";
  $tvid_json = httpRequest($tvidurl);
  //echo  "tvid_json= " . $tvid_json . "\n";
  $client_ret =json_decode($tvid_json);  

  if ('' == $client_ret->unique_id) {
    echo "TVId is null";
    return;
  } else {
  //echo  "tvid= " . $client_ret->unique_id . "\n";
   $tvid = $client_ret->unique_id;
   echo $tvid;
  }


  function httpRequest($url,$post='',$method='GET',$limit=0,$returnHeader=FALSE,$cookie='',$bysocket=FALSE,$ip='',$timeout=15,$block=TRUE)
{  
       $return = '';  
       $matches = parse_url($url);  
  // 作用？？？？？？？
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


?>
