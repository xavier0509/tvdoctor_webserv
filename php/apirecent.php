<?php
$conn = mysql_connect("127.0.0.1", "root", "000000") or die ("连接数据库服务器失败！".mysql_error());
$select = mysql_select_db("tvdoctor", $conn);

function getMsgApi($activityId,$msg){
    $time = time();
    //      echo "msg====".$msg."\n";
    $sql_str = "INSERT INTO apiRecent (activityId, msg, time) VALUES ('" . $activityId . "', '" . $msg . "'," .$time.")";
    $ret = mysql_query($sql_str);
//              if (!$ret)
//                              {
//                                      echo '{"ret": "OK"}'."\n";
//                                      //echo '{"ret": "INSERT_FAILED", "data": "0"}';
//                              }
//                              else
//                              {
//
//                                      echo '{"ret": "fail"}'."\n";
//                              }
//
//              echo "sqlstring==".$sql_str."\n";
}
?>