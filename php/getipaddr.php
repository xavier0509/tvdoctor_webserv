<?php 

$ipID = "1";
$sql = "select ipAddr from ipTable where ipId='" . $ipID . "'";
$result = mysql_query($sql);
$list = mysql_fetch_assoc($result);
$getip = $list['ipAddr'];
if ($list != "") {
    # code...
    echo $getip;
}
else{
    echo "null";
}

?>