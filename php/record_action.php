<?php
	$action = $_GET['action'];
	$msg = $_GET['msg'];
	$conn = mysql_connect("127.0.0.1", "root", "000000") or die ("连接数据库服务器失败！".mysql_error());
	$select = mysql_select_db("tvdoctor", $conn);

	if ("insert" == $action) {
		insert_new_records($msg);
	} elseif ("list" == $action) {
		list_records($msg);
	} elseif ("list_user" == $action) {
		list_records_by_user($msg);
	} elseif ("list_date" == $action) {
		list_records_by_date($msg);
	}

	function insert_new_records($data)
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
				. "	" . $result['machine_core'] . "	" . $result['machine_type'] . "	" . $result['version'] . "	" . $result['issuer'] . "<br />";
			}
		} else {
			echo "ERR_DATA_INVALID";
		}

	}

?>