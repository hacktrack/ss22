<?php
 define('SHAREDLIB_PATH', get_cfg_var('icewarp_sharedlib_path'));

error_reporting(E_ALL ^E_WARNING ^E_NOTICE);
include_once 'request.php';
include_once 'response.php';
include_once 'caldav.php';
include_once 'function.php';

 
function __autoload($class_name)
{
	if (substr_compare($class_name, '_exception', - 10, 10) === 0)
		require_once('exception/' . $class_name . '.php');
	else if (substr_compare($class_name, '_resource', - 9, 9) === 0)
		require_once('resource/' . $class_name . '.php');
}

function get_nonce()
{
	$auth = $_SERVER['HTTP_AUTHORIZATION'];
	if (substr_compare($auth, "Digest ", 0, 7, true) === 0)
	{
		$result = array();
		preg_match_all('@(\w+)=(?:(([\'"])(.+?)\3|([A-Za-z0-9/]+)))@', $auth, $matches, PREG_SET_ORDER);
		foreach ($matches as $m)
			$result[$m[1]] = $m[4] ? $m[4] : $m[5];
	
		return $result['nonce'];
	}
	else
		return '';
}

function create_session_id($except_user = false)
{
	if ($except_user)
		return 'webdav' . sha1($_SERVER['HTTP_USER_AGENT'] . $_SERVER['REMOTE_ADDR']);

	 	 	$auth = $_SERVER['HTTP_AUTHORIZATION'];
	if (substr_compare($auth, "Digest ", 0, 7, true) === 0)
	{
		$data = array();
		preg_match_all('@(\w+)=(?:(([\'"])(.+?)\3|([A-Za-z0-9/]+)))@', $auth, $matches, PREG_SET_ORDER);
		foreach ($matches as $m)
			$data[$m[1]] = $m[4] ? $m[4] : $m[5];

		return 'webdav' . sha1($data['username'] . $_SERVER['HTTP_USER_AGENT'] . $_SERVER['REMOTE_ADDR']);
	}

	 	return 'webdav' . sha1($_SERVER['PHP_AUTH_USER'] . $_SERVER['HTTP_USER_AGENT'] . $_SERVER['REMOTE_ADDR']);
}

function initialize_session($request)
{
	$value = '';
	$nonce = null;
	 	if ($_SERVER['HTTP_AUTHORIZATION'] && !$request->_ticket)
	{
		$nonce = get_nonce();
		if ($nonce)
		{
			session_id(create_session_id(true));
			session_start();
			if ($_SESSION['caldav_session'])
				$value = $_SESSION['caldav_session']->get_nonce($nonce);

			session_write_close();
		}
	}

	if (!$request->_ticket)
	{
		session_id(create_session_id());
		session_start();
	}

	init_global_api();
	server_config();

	 	if (!$_SESSION['caldav_session'])
	{
		$_SESSION['caldav_session'] = new caldav_session();
	}
	else
	{
		 		if ($_SESSION['caldav_session']->_authenticated && !$_SESSION['caldav_session']->user_logged_on())
		{
			do_log('!!! Session recreate !!!', 2);
			unset($_SESSION['caldav_session']);
			$_SESSION['caldav_session'] = new caldav_session();
		}
	}

	if ($value)
		$_SESSION['caldav_session']->put_nonce($nonce, $value);
}

 try
{
	$request = new webdav_request();
	$response = new webdav_response();
	initialize_session($request);

	$request->log();
	if ($_SESSION['Disabled'])
		throw new service_unavailable_exception();

	$_SESSION['caldav_session']->handle_request($request, $response);
}
catch (dav_exception $e)
{
	$response->http_response($e->get_status_line() , array('Content-Type: application/xml'), $e->get_body());
}
catch (CIWPipeException $e)
{
	$response->http_response('503 Service Unavailable', array('Content-Type: application/xml'), 'IceWarp Server PHP Extension: Pipe server connection problem when login');
}

if ($_SESSION['caldav_session']->_authenticated)
{
	if ($request->_ticket)
	{
		$_SESSION['caldav_session']->_datastore->_gw->logout();

		session_unset();
		session_destroy();
	}
}

$response->flush();
?>
