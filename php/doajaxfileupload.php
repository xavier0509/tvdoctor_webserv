<?php
    if ($_FILES["upfile"]["error"] > 0)
    {
        echo "Return Code: " . $_FILES["upfile"]["error"] . "<br />";
    }
    else
    {
        $upfile=$_FILES["upfile"];  //获取数组里面的值  
        $name=$upfile["name"];//上传文件的文件名 
        $time =time();
        $newpath =$time."_".$name;//'/var/www/up/'.
        $type=$upfile["type"];//上传文件的类型 
        $size=$upfile["size"];//上传文件的大小 
        $tmp_name=$upfile["tmp_name"];//上传文件的临时存放路径 
        $error=$upfile["error"];//上传后系统返回的值 
        //echo "Upload: " . $_FILES["file"]["name"] . "<br />";
        // echo "Type: " . $_FILES["file"]["type"] . "<br />";
        // echo "Size: " . ($_FILES["file"]["size"] / 1024) . " Kb<br />";
        // echo "Temp file: " . $_FILES["file"]["tmp_name"] . "<br />";

        if (file_exists("../upload/" . $_FILES["upfile"]["name"]))
        {
            echo $_FILES["upfile"]["name"] . " already exists. ";
        }
        else
        {
            $ok = @move_uploaded_file($tmp_name,
                    "../upload/" . $newpath);
            //echo "Stored in: " . "upload/" . $_FILES["upfile"]["name"];
            if($ok === FALSE)
             {
                //$arr = array ('file_infor'=>'upload error'); 
              $arr = array ('file_result'=>'error','file_path'=>'upload/'.$newpath,'file_size'=>$size,'file_error'=>$error); 
              echo json_encode($arr); 
             }
             else
             {
              $arr = array ('file_result'=>'ok','file_path'=>'upload/'.$newpath,'file_size'=>$size,'file_error'=>$error); 
              echo json_encode($arr);   
            }
        }
    }
?>
