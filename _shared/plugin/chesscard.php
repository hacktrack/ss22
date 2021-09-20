<?php

class ChesscardClientAPIException extends Exception {
	public $statusCode;

	public function __construct($message, $statusCode = 'CHESSCARD_ERROR') {
		parent::__construct($message);

		$this->statusCode = $statusCode;
	}
}

class ChesscardClientAPI {
	protected $serviceHost;
	protected $servicePort;
	protected $serviceDefaultPort = 443;

	protected $accessCode;
	protected $customerID;
	protected $applicationID;

	protected $statusCode;
	protected $errorMessage;

	protected $httpContext;

	public function __construct($configFile = 'chesscard_config.xml') {

		$config = new DOMDocument();
		if (!@$config->load($configFile))
			throw new ChesscardClientAPIException('Cannot load the configuration file: ' . $configFile);

		if (($node = $config->getElementsByTagName('HOST')->item(0)) !== null) {
			$this->serviceHost = $node->nodeValue;
		} else throw new ChesscardClientAPIException('HOST is not set');

		if (($node = $config->getElementsByTagName('PORT')->item(0)) !== null) {
			$this->servicePort = $node->nodeValue ? $node->nodeValue : $this->serviceDefaultPort;
		}

		if (($node = $config->getElementsByTagName('CUSTOMER_ID')->item(0)) !== null) {
			$this->customerID = $node->nodeValue;
		} else throw new ChesscardClientAPIException('CUSTOMER_ID is not set');

		if (($node = $config->getElementsByTagName('APPLICATION_ID')->item(0)) !== null) {
			$this->applicationID = $node->nodeValue;
		} else {
			 			$this->applicationID = '';
		}

		if (($node = $config->getElementsByTagName('ACCESS_CODE')->item(0)) !== null) {
			$this->accessCode = $node->nodeValue;
		} else throw new ChesscardClientAPIException('ACCESS_CODE is not set');

		if (($node = $config->getElementsByTagName('SOCKET_TIMEOUT')->item(0)) !== null) {
			$this->httpContext = stream_context_create(array(
				'http' => array(
					'timeout' => intval($node->nodeValue)
				)
			));
		}
	}

	public function getStatusCode() {
		return $this->statusCode;
	}

	public function getErrorMessage() {
		return $this->errorMessage;
	}

	 
	public function ping() {
		try {
			$this->parseResponse($this->sendRequest('ping', ''));

			return true;
		} catch (Exception $e) {
			return false;
		}
	}

	public function chesscardExpiration() {
		$this->parseResponse($this->sendRequest('chesscard_expiration', ''), $data);

		if (($expiration = $data->getElementsByTagName('EXPIRATION')->item(0)) == null)
			throw new ChesscardClientAPIException('EXPIRATION is missing');

		return $expiration->nodeValue;
	}

	public function createUser($uid, $name = null, $address = null, $city = null, $country = null, $zip = null, $email = null) {
		$data = "<UID>".slToolsPHP::htmlspecialchars($uid)."</UID>";
		if ($name) $data .= "<NAME>".slToolsPHP::htmlspecialchars($name)."</NAME>";
		if ($address) $data .= "<ADDRESS>".slToolsPHP::htmlspecialchars($address)."</ADDRESS>";
		if ($city) $data .= "<CITY>".slToolsPHP::htmlspecialchars($city)."</CITY>";
		if ($country) $data .= "<COUNTRY>".slToolsPHP::htmlspecialchars($country)."</COUNTRY>";
		if ($zip) $data .= "<ZIP>".slToolsPHP::htmlspecialchars($zip)."</ZIP>";
		if ($email) $data .= "<EMAIL>".slToolsPHP::htmlspecialchars($email)."</EMAIL>";

		$this->parseResponse($this->sendRequest('create_user', $data));
	}

	public function deleteUser($uid) {
		$this->parseResponse($this->sendRequest('delete_user', "<UID>$uid</UID>"));
	}

	public function updateUserDetails($uid, $name = null, $address = null, $city = null, $country = null, $zip = null, $email = null) {
		$data = "<UID>".slToolsPHP::htmlspecialchars($uid)."</UID>";
		if ($name) $data .= "<NAME>".slToolsPHP::htmlspecialchars($name)."</NAME>";
		if ($address) $data .= "<ADDRESS>".slToolsPHP::htmlspecialchars($address)."</ADDRESS>";
		if ($city) $data .= "<CITY>".slToolsPHP::htmlspecialchars($city)."</CITY>";
		if ($country) $data .= "<COUNTRY>".slToolsPHP::htmlspecialchars($country)."</COUNTRY>";
		if ($zip) $data .= "<ZIP>".slToolsPHP::htmlspecialchars($zip)."</ZIP>";
		if ($email) $data .= "<EMAIL>".slToolsPHP::htmlspecialchars($email)."</EMAIL>";

		$this->parseResponse($this->sendRequest('update_user_details', $data));
	}

	public function getLoginPrompt($uid) {
		$this->parseResponse($this->sendRequest('get_login_prompt', "<UID>$uid</UID>"), $data);

		if (($prompt = $data->getElementsByTagName('PROMPT')->item(0)) == null)
			throw new ChesscardClientAPIException('PROMPT is missing');

		$fields = array();
		foreach ($prompt->getElementsByTagName('FIELD') as $field)
			$fields[] = $field->nodeValue;

		return implode(' ', $fields);
	}

	public function authenticateUser($uid, $password) {
		try {
			$this->parseResponse(
				$this->sendRequest('authenticate_user', "<UID>$uid</UID><PASSWORD>$password</PASSWORD>")
			);
		} catch (Exception $e) {
			return false;
		}

		return true;
	}

	public function regenerateChesscard($uid) {
		$this->parseResponse($this->sendRequest('regenerate_chesscard', "<UID>$uid</UID>"));
	}

	public function getChesscard($uid, $secondCard = false) {
		$this->parseResponse($this->sendRequest('get_chesscard', "<UID>$uid</UID><SECOND_CARD>".$secondCard."</SECOND_CARD>"), $data);

		return $this->nodeToArray($data);
	}

	public function activateUser($uid, $password) {
		try {
			$this->parseResponse(
				$this->sendRequest('activate_user', "<UID>$uid</UID><PASSWORD>$password</PASSWORD>")
			);
		} catch (Exception $e) {
			return false;
		}

		return true;
	}

	public function getUserInfo($uid) {
		$this->parseResponse($this->sendRequest('get_user_info', "<UID>$uid</UID>"), $data);

		return $this->nodeToArray($data);
	}

	public function userActivated($uid) {
		$this->parseResponse($this->sendRequest('user_activated', "<UID>$uid</UID>"), $data);

		$data = $this->nodeToArray($data);
		return ($data['ACTIVE'] == '1') ? true : false;
	}

	public function getUserStatus($uid) {
		$this->parseResponse($this->sendRequest('get_user_status', "<UID>$uid</UID>"), $data);

		$data = $this->nodeToArray($data);
		if (count($data) == 1) {
			return array($data['STATUS']);
		} else {
			return array($data['STATUS'], $data['STATUS_2']);
		}
	}

	public function getUsers($state = null) {
		$this->parseResponse($this->sendRequest('get_users', $state ? "<STATE>$state</STATE>" : ''), $data);

		return $this->multinodeToArray($this->getSubtag($data, 'USERS'), 'UID');
	}

	public function markAsSent($uid) {
		$this->parseResponse($this->sendRequest('mark_as_sent', "<UID>$uid</UID>"));
	}

	public function revokeChesscard($uid, $secondCard = false) {
		$this->parseResponse($this->sendRequest('revoke_chesscard', "<UID>$uid</UID><SECOND_CARD>".$secondCard."</SECOND_CARD>"));
	}

	 
	protected function sendRequest($type, $data) {
		if (($ret = @file_get_contents("https://$this->serviceHost:$this->servicePort/service.php?request=".
				urlencode($this->createRequest($type, $data)), 0, $this->httpContext)) === FALSE) {

			throw new ChesscardClientAPIException('Cannot connect to the host: '
				. "$this->serviceHost:$this->servicePort", 'CANNOT_CONNECT_TO_CHESSCARD_SERVICE');
		}

		return $ret;
	}

	protected function parseResponse($response, &$data = null) {
		$xml = new DOMDocument();
		if (@$xml->loadXML($response) === false)
			throw new ChesscardClientAPIException('Malformed response');

		if (($this->statusCode = @$xml->getElementsByTagName('STATUS_CODE')->item(0)->nodeValue) == null)
			throw new ChesscardClientAPIException('STATUS_CODE is missing');

		if ($this->statusCode != 'OK') {
			$this->errorMessage = @$xml->getElementsByTagName('MESSAGE')->item(0)->nodeValue;

			throw new ChesscardClientAPIException($this->errorMessage, $this->statusCode);
		} else {
			$this->errorMessage = null;

			if (func_num_args() >= 2) {
				$data = $xml->getElementsByTagName('DATA')->item(0);
			}
		}
	}

	protected function createRequest($type, $data) {
		return "<CHESSCARD_REQUEST
access_code=\"$this->accessCode\"
application_id=\"$this->applicationID\"
customer_id=\"$this->customerID\"
request_type=\"$type\" >
<DATA>
$data
</DATA>
</CHESSCARD_REQUEST>";
	}

	protected function nodeToArray(DOMNode $node) {
		$result = array();
		foreach ($node->childNodes as $child) {
			if ($child->nodeType == XML_ELEMENT_NODE)
				$result[$child->tagName] = $child->nodeValue;
		}
		return $result;
	}

	protected function getSubtag($node, $tagName) {
		if (($tag = $node->getElementsByTagName($tagName)->item(0)) == null)
			throw new ChesscardClientAPIException($tagName . ' is missing');

		return $tag;
	}

	protected function multinodeToArray(DOMNode $node, $tag) {
		$result = array();
		foreach ($node->childNodes as $child) {
			if ($child->nodeType == XML_ELEMENT_NODE && $child->nodeName == $tag)
				$result[] = $child->nodeValue;
		}
		return $result;
	}
}

?>
