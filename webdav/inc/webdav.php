<?php
require_once('datastore.php');
require_once('xml.php');

define('NONCEKEY', 'WebDAV');
define('NONCESTALE', 2);

class webdav_session
{
	var $_datastore;
	var $_authenticated;
	var $_scheme;
	var $_user;
	var $_nonce_cache;
	var $_nonce;
	var $_xml_dav_prefix;

	function __construct()
	{
		$this->_datastore = new datastore();
		$this->_nonce_cache = array();
	}

	function user_logged_on()
	{
		return $this->_datastore->user_logged_on();
	}

	function remove_expired_nonces()
	{
		$time = time();
		foreach($this->_nonce_cache as $nonce => $value)
			if ($value['expiration'] < $time || $value['maxtime'] < $time )
				unset($this->_nonce_cache[$nonce]);
	}

	function get_nonce($nonce)
	{
		$this->remove_expired_nonces();

		 		$value = $this->_nonce_cache[$nonce];
		if (!$value)
			return;

		 		unset($this->_nonce_cache[$nonce]);

		return $value;
	}

	function put_nonce($nonce, $value)
	{
		 		if ($this->_nonce_cache[$nonce])
			return;

		 		$this->_nonce_cache[$nonce] = $value;
	}

	function check_authorization($request)
	{
		$this->_nonce = '';
		$this->remove_expired_nonces();

		if ($request->_ticket)
		{
			$this->_user = 'anyone';
			$this->_authenticated = $this->_datastore->login_ticket($request->_ticket);
			return $this->_authenticated;
		}

 
		$auth = $_SERVER['HTTP_AUTHORIZATION'];
		$p = strpos($auth, ' ');
		$auth_params = substr($auth, $p + 1);

		if (substr_compare($auth, "Digest ", 0, $p + 1, true) === 0)
		{
			$data = array();
			preg_match_all('@(\w+)=(?:(([\'"])(.+?)\3|([A-Za-z0-9/]+)))@', $auth_params, $matches, PREG_SET_ORDER);
			foreach ($matches as $m)
				$data[$m[1]] = $m[4] ? $m[4] : $m[5];

 
			if (!$this->_nonce_cache[$data['nonce']])
				return NONCESTALE;

			$nonce_count = empty($data['nc']) ? 1 : intval($data['nc'], 16);
			if ($nonce_count <= $this->_nonce_cache[$data['nonce']]['nc'])
			{
				unset($this->_nonce_cache[$data['nonce']]);
				return NONCESTALE;
			}

			$this->_nonce = $data['nonce'];
			$this->_nonce_cache[$data['nonce']]['nc'] = $nonce_count;

			$username = $data['username'];
			$password = $auth_params;
			$scheme = 'DIGEST-MD5';
			$challenge = 'nonce="' . $data['nonce'] . '",algorithm=md5,method=' . strtoupper($request->_method);
		}
		else if (substr_compare($auth, "Basic ", 0, $p + 1, true) === 0)
		{
			if ($_SERVER['HTTPS'] != 'ON')
				return false;

			$auth_params = base64_decode($auth_params);
			$p = strpos($auth_params, ':');
			$username = substr($auth_params, 0, $p);
			$password = substr($auth_params, $p + 1);
			$scheme = 'PLAIN';
			$challenge = 'none';
		}
		else if (substr_compare($auth, "Negotiate ", 0, $p + 1, true) === 0)
		{
			$username = '';
			$password = $auth_params;
			$scheme = 'GSSAPI';
			$challenge = $auth_params;
		}
		else
			return false;

		 		$username = str_replace(array('%', '$'), '@', $username);

		 		 		 		 		 
		 		 		 		 		 		if ($this->_authenticated && $this->_scheme == $scheme && $this->_user == $username && $scheme != 'GSSAPI')
		{
			$authenticated = $this->_datastore->recheck_login($username, $password, $scheme, $challenge);
		}
		else
		{
			$authenticated = $this->_datastore->login($username, $password, $scheme, $challenge);
			$this->_authenticated = $authenticated;
			$this->_scheme = $scheme;
			$this->_user = $username;
		}

		if (!$authenticated && $this->_nonce)
			unset($this->_nonce_cache[$this->_nonce]);

		return $authenticated;
	}

	function check_if_preconditions($request)
	{
		foreach ($request->_if as $condition)
		{
			try
			{
				$resource = resource::get_resource(
					$this->_datastore,
					$condition['uri'] == null ? $request->_uri : new caldav_uri($condition['uri']));
				$matched = false;
				foreach ($condition['tokens'] as $token)
				{
					 					if (!$token[0])
					{
						if ((!$token[1] || $token[1] !== $resource->get_lock_token()) &&
						(!$token[2] || $token[2] !== $resource->get_etag()))
							$matched = true;
					}
					else
					{
						if ((!$token[1] || $token[1] === $resource->get_lock_token()) &&
						(!$token[2] || $token[2] === $resource->get_etag()))
							$matched = true;
					}
				}
			}
			catch (not_found_exception $e)
			{
				$matched = false;
				foreach ($condition['tokens'] as $token)
					if (!$token[0])
						$matched = true;
			}
			if (!$matched)
				throw new precondition_failed_exception();
		}
	}

	 	 	 	protected function getFailedAuthHeaders($authenticated, $request, $api)
	{
		$authSchemes = $api->GetProperty('c_accounts_policies_auth_schemes');
		$plainDisabled = filter_var($api->GetProperty('c_accounts_policies_auth_disableplain'), FILTER_VALIDATE_BOOLEAN);
		$sso_enabled = (strpos($authSchemes, 'NTLM') !== false || strpos($authSchemes, 'GSSAPI') !== false) ? true : false;
		$segments = $request->_uri->get_segments();
		$email = '';
		foreach($segments as $segment) {
			$pos = strpos($segment,'@');
			if (strpos($segment,'@') !== false) {
				$email = $segment;
				break;
			}
		}

		if (!empty($email)) {
			$domain_name = substr($email,$pos+1);
			if ($domain_name !== false) {
				$domain = $api->OpenDomain($domain_name);
				if (!empty($domain)){
					$sso_enabled = filter_var($domain->GetProperty('D_ADSyncSSOEnabled'), FILTER_VALIDATE_BOOLEAN);
				}
			}
		}

		do {
			$nonce = md5(uniqid(rand(), true));
		} while ($this->_nonce_cache[$nonce]);

		$this->_nonce_cache[$nonce] = array('nc' => -1, 'expiration' => time() + 3600, 'maxtime' => time() + 86400);

		$headers = array();
		$realm = 'realm="' . $_SERVER['HTTP_HOST'] . '"';

		if ($sso_enabled){
			$headers[] = 'WWW-Authenticate: Negotiate';
		}

		$md5Enabled = strpos($_SESSION['auth_schemes'], 'MD5') !== false;
		$plainEnabled = !$plainDisabled && (strpos($_SESSION['auth_schemes'], 'PLAIN') !== false);
		$httpsDisabled = (empty($_SERVER['HTTPS']) ||  strcasecmp($_SERVER['HTTPS'],'off') === 0);

		if($httpsDisabled || $md5Enabled){
			$headers[] = 'WWW-Authenticate: Digest ' . $realm . ', qop="auth", algorithm=md5, nonce="' . $nonce . '", opaque="' . md5($_SERVER['SERVER_NAME']) . '"' . ($authenticated == NONCESTALE ? ', stale=true' : '');
		}

		if(!$httpsDisabled && ($plainEnabled || !$md5Enabled)){
			$headers[] = 'WWW-Authenticate: Basic ' . $realm;
		}
		return $headers;
	}

	function handle_request($request, $response)
	{
		global $api;

		if ($request->_method != 'options') {
			$authenticated = $this->check_authorization($request);
			if ($authenticated === false || $authenticated === NONCESTALE) {
				return $response->http_response('401 Unauthorized', $this->getFailedAuthHeaders($authenticated, $request, $api));
			} elseif ($this->_nonce){
				$this->_nonce_cache[$this->_nonce]['expiration'] = time() + 3600;
			}
		}
		$this->_xml_dav_prefix = null;
		if (strncmp($_SERVER['HTTP_USER_AGENT'], "Microsoft-WebDAV-MiniRedir", 25) === 0){
			$this->_xml_dav_prefix = 'D';
		}

		$this->check_if_preconditions($request);

		$handler = 'handle_' . $request->_method;
		if (method_exists($this, $handler)) {
			$this->$handler($request, $response);
		} else {
			$response->http_response('405 Method not allowed');
		}
	}

	function handle_options($request, $response)
	{
		$allow = [];
		foreach (get_class_methods('caldav_session') as $method)
			if (!strncmp('handle_', $method, 7) && $method != 'handle_request')
			{
				$method = strtoupper(substr($method, 7));
				$allow[$method] = $method;
			}

		$headers[] = 'Allow: ' . implode(', ', $allow);
		$headers[] = 'DASL: <DAV:basicsearch>';
		$response->http_response('200 OK', $headers);
	}
}
?>
