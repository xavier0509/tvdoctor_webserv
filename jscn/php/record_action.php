<?php
	$action = $_GET['action'];
	$msg = $_GET['msg'];
	$conn = mysql_connect("127.0.0.1", "root", "000000") or die ("连接数据库服务器失败！".mysql_error());
	$select = mysql_select_db("tvdoctor", $conn);

	if ("insert" == $action) {
		insert_new_records($msg);//
	} elseif ("list" == $action) {
		list_records($msg);
	} elseif ("list_user" == $action) {
		list_records_by_user($msg);
	} elseif ("list_date" == $action) {
		list_records_by_date($msg);
	} elseif ("insert_login_records" == $action) {
		insert_login_records($msg);//登录记录--->ok
	} elseif ("update_login_records" == $action) {
		update_login_records($msg);//退出记录--->ok
	} elseif ("insert_connect_records" == $action) {
		insert_connect_records($msg);//连接请求--->ok
	} elseif ("update_connect_records_begin" == $action) {
		update_connect_records_begin($msg);//连接成功---ok
	} elseif ("update_connect_records_end" == $action) {
		update_connect_records_end($msg);//断开连接
	} elseif ("query_records" == $action) {
		query_records($msg);//查询--->ok
	}

	
	function insert_login_records($data)
	{
		$node = json_decode($data);
		if($node)
		{
			if ("" != $node->userName && "" != $node->loginTime) 
			{
				$sql_str = 'INSERT INTO login_records (userName, loginTime) VALUES ("' 
					. $node->userName . '", ' . $node->loginTime . ')';
				$ret = mysql_query($sql_str);	
			//	$ret = mysql_query("INSERT INTO login_records (userName, loginTime) VALUES ('fanyanbo',123456)");
				if (!$ret)
				{
					echo '{"ret": "OK", "data": "' . $data . '"}';
					//echo '{"ret": "INSERT_FAILED", "data": "0"}';
				} 
				else 
				{
					$loginId = mysql_insert_id();
					echo '{"ret": "OK", "data": "' . $loginId . '"}';
				}
			} else {
				echo '{"ret": "PARAM_INVALID", "data": "0"}';
			}
		}
		else
		{
			echo '{"ret": "JSON_ERROR", "data": "0"}';
		}

	}

	function update_login_records($data)
	{
		$node = json_decode($data);
		if($node)
		{
			$loginId = $node->loginId;
			if ($loginId) 
			{
				$ret = mysql_query("update login_records set logoutTime = '". $node->logoutTime . "' where loginId='" . $loginId . "';");
				if (!$ret)
				{
					echo '{"ret": "UPDATE_FAILED", "data": "0"}';
				} 
				else 
				{
					echo '{"ret": "OK", "data": "0"}';
				}
			} else {
				echo '{"ret": "PARAM_INVALID", "data": "0"}';
			}
		}
		else
		{
			echo '{"ret": "JSON_ERROR", "data": "0"}';
		}
	}

	function insert_connect_records($data)
	{
		$node = json_decode($data);
		if($node)
		{
			if ("" != $node->loginId && "" != $node->connectRequestTime && "" != $node->connectFlag && "" != $node->activeId) 
			{
				$sql_str = 'INSERT INTO connect_records (loginId, connectRequestTime, connectFlag, activeId) VALUES (' 
					. $node->loginId . ', ' . $node->connectRequestTime . ',' . $node->connectFlag . ',"' .$node->activeId . '")';
				$ret = mysql_query($sql_str);
				if (!$ret)
				{
					echo '{"ret": "INSERT_FAILED", "data": "0"}';
				} 
				else 
				{
					$connectId = mysql_insert_id();
					echo '{"ret": "OK", "data": "' . $connectId . '"}';
				}
			} else {
				echo '{"ret": "PARAM_INVALID", "data": "0"}';
			}
		}
		else
		{
			echo '{"ret": "JSON_ERROR", "data": "0"}';
		}
	}

	function update_connect_records_begin($data)
	{
		$node = json_decode($data);
		if($node)
		{
			$connectId = $node->connectId;
			if ($connectId) 
			{
				$ret = mysql_query("update connect_records set 
					connectedTime = '". $node->connectedTime . 
					"', connectFlag ='0
					', machineCore ='" .$node->machineCore.
					"', machineType ='" .$node->machineType.
					"', version ='" .$node->version.
					"' where connectId='" . $connectId . "';");
				if (!$ret)
				{
					echo '{"ret": "UPDATE_FAILED", "data": "0"}';
				} 
				else 
				{
					echo '{"ret": "OK", "data": "0"}';
				}
			} else {
				echo '{"ret": "PARAM_INVALID", "data": "0"}';
			}
		}
		else
		{
			echo '{"ret": "JSON_ERROR", "data": "0"}';
		}
	}

	function update_connect_records_end($data)
	{
		$node = json_decode($data);
		if($node)
		{
			$connectId = $node->connectId;
			$disconnectedTime = $node->disconnectedTime;
			if ($connectId) 
			{
				$ret = mysql_query("update connect_records set disconnectedTime = '". $node->disconnectedTime . 
					"', issue ='" .$node->issue. 
					"' where connectId ='" . $connectId . "';");
				if (!$ret)
				{
					echo '{"ret": "UPDATE_FAILED", "data": "0"}';
				} 
				else 
				{
					echo '{"ret": "OK", "data": "0"}';
				}
			} else {
				echo '{"ret": "PARAM_INVALID", "data": "0"}';
			}
		}
		else
		{
			echo '{"ret": "JSON_ERROR", "data": "0"}';
		}
	}

	function query_records($data)
	{
		$node = json_decode($data);
		if($node)
		{
			$sql_prex = 'select user.userName, realName, department,from_unixtime(loginTime) as loginTime, from_unixtime(logoutTime) as logoutTime, 
				from_unixtime(connectRequestTime) as connectRequestTime,from_unixtime(connectedTime) as connectedTime, from_unixtime(disconnectedTime) as disconnectedTime,connectFlag,activeId, machineCore, machineType, version, issue 
				from user inner join login_records on user.userName = login_records.username left join connect_records on login_records.loginId = connect_records.loginId';	
			$userName = $node->userName;
			$activeId = $node->activeId;
			$loginTime = $node->loginTime;
			$logoutTime = $node->logoutTime;
		/*	if ("" == $userName && "" == $activeId) 
			{
				$sql_str = $sql_prex . ';';
			}elseif ("" != $userName && "" != $activeId) {
				$sql_str = $sql_prex . ' where user.userName = ' . $userName . ' and activeId = ' . $activeId;
			}else{
				if("" != $userName){
					$sql_str = $sql_prex . ' where user.userName = "' . $userName.'";';
				}else{
					$sql_str = $sql_prex . ' where activeId = "' . $activeId.'";';
				}
			}*/
			if("" == $userName && "" == $activeId && "" == $loginTime && "" == $logoutTime)
			{
				$sql_str = $sql_prex.';';
			}else{
				$sql_str = $sql_prex.' where user.userId >= 1';
				if("" != $userName){
					$sql_str = $sql_str.' and user.userName = "'.$userName.'"';
				}
				if("" != $activeId){
					$sql_str = $sql_str.' and activeId = "'.$activeId.'"';
				}
				if("" != $loginTime){
					$sql_str = $sql_str.' and loginTime >= "'.$loginTime.'"';
				}
				if("" != $logoutTime){
					$sql_str = $sql_str.' and loginTime <= "'.$logoutTime.'"';
				}
				$sql_str = $sql_str.';';
			}
			//echo $sql_str;
			$ret = mysql_query($sql_str);
			if(!$ret)
			{
				echo '{"ret": "QUERY_FAILED", "data": "0"}';
			}else{
				while($result = mysql_fetch_array($ret)) {
					echo $result['userName']."<a>".$result['realName'] . "<a>" . $result['department'] . "<a>" . $result['activeId'] . "<a>" . $result['loginTime']."<a>".$result['logoutTime']."<a>".$result['connectRequestTime'].
				       "<a>".$result['connectFlag']."<a>".$result['connectedTime']."<a>".$result['disconnectedTime']. "<a>" . $result['machineCore'] . "<a>" . $result['machineType'] . "<a>" . $result['version'] . "<a>" . $result['issue'] . "<br />";
				}
			}
		}
		else
		{
			echo '{"ret": "JSON_ERROR", "data": "0"}';
		}
	}

/*	function insert_new_records($data)
	{
		$node = json_decode($data);
		if ("" != $node->userId && "" != $node->login_time) {
			$sql_str = 'INSERT INTO `connection_records` (`userId`, `login_time`, `active_id`, `machine_core`, `machine_type`, `version`, `issuer`) VALUES (' 
			. $node->userId . ', ' . $node->login_time . ', "' . $node->active_id . '", "' . $node->machine_core . '", "' . $node->machine_type . '", "'
			. $node->version . '", "' . $node->issuer . '");';
			$ret = mysql_query($sql_str);
			if (!$ret) {
				echo "ERR_NEW_FAIL";
			} else {
				echo "ERR_OK";
			}
		} else {
			echo "ERR_DATA_INVALID";
		}
	}

	function list_records($data)
	{
		$sql_str = 'select userName, from_unixtime(login_time) as login_time, from_unixtime(logout_time) as logout_time, active_id, machine_core, machine_type, version, issuer from connection_records A inner join user B on A.userId = B.userId;';
		$ret = mysql_query($sql_str);
		while($result = mysql_fetch_array($ret)) {
			echo $result['userName'] . "	" . $result['login_time'] . "	" . $result['logout_time'] . "	" . $result['active_id'] 
			. "	" . $result['machine_core'] . "	" . $result['machine_type'] . "	" . $result['version'] . "	" . $result['issuer'] . "<br />";
		}
	}

	function list_records_by_user($data)
	{
		$node = json_decode($data);
		if ("" != $node->userId) {
			$sql_str = 'select userName, from_unixtime(login_time) as login_time, from_unixtime(logout_time) as logout_time, active_id, machine_core, machine_type, version, issuer from connection_records A inner join user B on A.userId = B.userId and A.userId = ' . $node->userId . ';';
			$ret = mysql_query($sql_str);
 			while($result = mysql_fetch_array($ret)) {
				echo $result['userName'] . "	" . $result['login_time'] . "	" . $result['logout_time'] . "	" . $result['active_id'] 
				. "	" . $result['machine_core'] . "	" . $result['machine_type'] . "	" . $result['version'] . "	" . $result['issuer'] . "<br />";
			}
		} else {
			echo "ERR_DATA_INVALID";
		}
	}

	function list_records_by_date($data)
	{
		$node = json_decode($data);

		if ("" != $node->begin_time && "" != $node->end_time) {
			$sql_str = 'select userName, from_unixtime(login_time) as login_time, from_unixtime(logout_time) as logout_time, active_id, machine_core, machine_type, version, issuer from connection_records A inner join user B on A.userId = B.userId and A.login_time >= '
			 . $node->begin_time . ' and A.login_time <=' . $node->end_time . ' ;';
			$ret = mysql_query($sql_str);
 			while($result = mysql_fetch_array($ret)) {
				echo $result['userName'] . "	" . $result['login_time'] . "	" . $result['logout_time'] . "	" . $result['active_id'] 
			$ret = mysql_query($sql_str);
 			while($result = mysql_fetch_array($ret)) {
				echo $result['userName'] . "	" . $result['login_time'] . "	" . $result['logout_time'] . "	" . $result['active_id'] 
				echo $result['userName'] . "	" . $result['login_time'] . "	" . $result['logout_time'] . "	" . $result['active_id'] 
				. "	" . $result['machine_core'] . "	" . $result['machine_type'] . "	" . $result['version'] . "	" . $result['issuer'] . "<br />";
			}
		} else {
			echo "ERR_DATA_INVALID";
		}
	}*/

?>
