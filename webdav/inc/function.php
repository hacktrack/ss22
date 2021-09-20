<?php
require_once(SHAREDLIB_PATH . 'api/api.php');
require_once('iw_file.php');

function init_global_api()
{
	global $api;
	$api = new IceWarpAPI();
	stream_wrapper_register("iw.file", "IceWarpFileStream");
}

function server_config()
{
	global $api;
	$_SESSION["config_path"] = $api->GetProperty("c_configpath");
	$_SESSION["Disabled"] = !$api->GetProperty("C_WebDAV_Active");
	$_SESSION["log_level"] = $api->GetProperty("C_System_Log_Services_WebDAV");
	$_SESSION["use_gal_for_search"] = $api->GetProperty("C_WebDAV_UseGALForSearch");
	$_SESSION['shared_prefix'] = $api->GetProperty("C_GW_SharedAccountPrefix");
	$_SESSION['resources'] = $api->GetProperty("C_GW_Resources");
	$_SESSION['auth_schemes'] = $api->GetProperty("c_accounts_policies_auth_schemes");
}

function do_log($body, $level = 1)
{
	global $api;
	 	if ($level > $_SESSION["log_level"]) return;
	 	$api->dolog(0, 17, session_id() . " (" . $_SERVER['REMOTE_ADDR'] . ") ", $body, 1, 1);
}

?>
