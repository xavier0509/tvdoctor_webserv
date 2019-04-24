<?php 

$conn = mysql_connect("127.0.0.1","root","000000")or die ("连接数据库服务器失败！".mysql_error());
$select = mysql_select_db("tvdoctor",$conn);

$ipID = "1";
$sql = "select * from ipTable where ipId='" . $ipID . "'";
$result = mysql_query($sql);
$list = mysql_fetch_assoc($result);
$getip = $list['ipAddr'];
$getport = $list['port'];
if ($list != "") {
    # code...
    // echo $getip;
    echo '{"ret": "OK", "data": {"ipAddr":"'.$getip.'","port":"'.$getport.'"}}';
}
else{
    echo "null";
}

?>