<?php
header("Content-type: text/html; charset=utf-8");

$Res = getPara();
//print_r($Res);

function getPara()
{	
	$Result = array();//存放结果数组
	
	if(empty($_GET)|| !isset($_GET['filepath']))
	{
		$Result["errorparam"] =  urlencode(":not filepath param");
		$Res = json_encode($Result);
		return urldecode($Res);		
	}
	if( !isset($_GET['filename']))
	{
		$Result["errorparam"] =  urlencode(":not filename param");
		$Res = json_encode($Result);
		return urldecode($Res);		
	}
	$filepath =$_GET['filepath'];

	$filename= $_GET['filename'];
	downloads($filepath,$filename);
}




function  downloads($filepath,$filename)
{
  $name_tmp = explode("@",$filepath);
  $name ="";
  if($filename == "")
  {
   $count1 = sizeof($name_tmp);
 // echo "dir =$filename ,count = $count1 ";
  $len = $count1 -1;
  $name =$name_tmp[$len];
  }
  else 
  {
  	$name =$filename;
  }
 
 // echo "$name            ";
 // $type =$name_tmp[0];
//  $file_time =explode(".",$name_tmp[3]);
 // $file_time = $file_time[0];
 // $file_date = date("Y/md",$file_time);
//  $file_dir = SITE_PATH."/home/skyserver/";    
  $file_dir =""; //"/var/www/TVDoctor/";
  
  foreach($name_tmp as $value)
  {
  	$file_dir .="/";
  	$file_dir .=$value;
  
  }
// echo $file_dir;
 // echo "name_tmp = $file_dir";
   // $file_dir = SITE_PATH."/data/uploads/$type/$file_date/";          
        if (!file_exists($file_dir))
        {
            header("Content-type: text/html; charset=utf-8");
            echo "File not found!";
            exit; 
        }
        else 
        {
            $file = fopen($file_dir,"r"); 
            Header("Content-type: application/octet-stream");
	    header("Content-Type: application/force-download");
            Header("Accept-Ranges: bytes");
            Header("Accept-Length: ".filesize($file_dir));
            Header("Content-Disposition: attachment; filename=".$name);
            echo fread($file, filesize($file_dir));
            fclose($file);
        }
}

?>
