<?php
    session_start();
    session_unset();
    session_destroy();
   // echo "<script type='text/javascript'>alert('退出成功!');</script>";
    echo "OK";
?>