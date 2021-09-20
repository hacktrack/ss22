<?php
class slSMTP
{
    var $SMTP_PORT = 25;
    var $CRLF = "\r\n";
    var $do_debug;       
    var $smtp_conn;     
    var $error;          
    var $helo_rply;

    public $Timeout;
    public $server_caps;
    public $Timelimit;

    function __construct() {
        $this->smtp_conn = 0;
        $this->error = null;
        $this->helo_rply = null;

        $this->do_debug = 0;
    }

    function Connect($host,$port=0,$tval=30) 
    {
    	$this->Timeout = $tval;
         static $streamok;
                          if (is_null($streamok)) {
            $streamok = function_exists('stream_socket_client');
        }
		$this->error = null;
        if($this->connected()) {
            $this->error =
                array("error" => "Already connected to a server");
            return false;
        }

        if(empty($port)) {
            $port = $this->SMTP_PORT;
        }

        if ($streamok) {
            $options = null;
            $socket_context = stream_context_create($options);

                                      if (PHP_MAJOR_VERSION >= 7) {
                stream_context_set_option($socket_context, 'ssl', 'verify_host', false);
                stream_context_set_option($socket_context, 'ssl', 'verify_peer', false);
                stream_context_set_option($socket_context, 'ssl', 'verify_peer_name', false);
                stream_context_set_option($socket_context, 'ssl', 'allow_self_signed', true);
            }

            @$this->smtp_conn = stream_socket_client(
                $host . ":" . $port,
                $errno,
                $errstr,
                $tval,
                STREAM_CLIENT_CONNECT,
                $socket_context
            );
            
        } else {
            @$this->smtp_conn = fsockopen(
                $host,
                $port,
                $errno,
                $errstr,
                $tval
            );
        }

        

        if(empty($this->smtp_conn)) {
            $this->error = array("error" => "Failed to connect to server",
                                 "errno" => $errno,
                                 "errstr" => $errstr);
            if($this->do_debug >= 1) {
                echo "SMTP -> ERROR: " . $this->error["error"] .
                         ": $errstr ($errno)" . $this->CRLF;
            }
            return false;
        }

        if(substr(PHP_OS, 0, 3) != "WIN")
           socket_set_timeout($this->smtp_conn, $tval, 0);
                 $first_char =  fgets($this->smtp_conn,1);
        if(strlen($first_char)!=1){
        	usleep(1000000);
        }
        $announce = $this->get_lines($first_char);

        if($this->do_debug >= 2) {
            echo "SMTP -> FROM SERVER:" . $this->CRLF . $announce;
        }

        return true;
    }

    function Authenticate($username, $password, $authtype = null) 
    {
        if (!$this->server_caps) {
            $this->setError('Authentication is not allowed before HELO/EHLO');
            return false;
        }
        if (array_key_exists('EHLO', $this->server_caps)) {
            if (!array_key_exists('AUTH', $this->server_caps)) {
                $this->setError('Authentication is not allowed at this stage');
                                                  return false;
            }	
            if (empty($authtype)) {
                foreach (array('CRAM-MD5', 'LOGIN', 'PLAIN') as $method) {
                    if (in_array($method, $this->server_caps['AUTH'])) {
                        $authtype = $method;
                        break;
                    }
                }
                if (empty($authtype)) {
                    $this->setError('No supported authentication methods found');
                    return false;
                }
            }
        
            if (!in_array($authtype, $this->server_caps['AUTH'])) {
                $this->setError("The requested authentication method \"$authtype\" is not supported by the server");
                return false;
            }
        } elseif (empty($authtype)) {
            $authtype = 'LOGIN';
        }
        $code = null;
        $rply = '';
    	switch($authtype){
    		case 'PLAIN':
	 			fputs($this->smtp_conn,"AUTH PLAIN" . $this->CRLF);
		
		        $rply = $this->get_lines();
		        $code = substr($rply,0,3);

		        if($code != 334) {
		            $this->error =
		                array("error" => "AUTH not accepted from server",
		                      "smtp_code" => $code,
		                      "smtp_msg" => substr($rply,4));
		            if($this->do_debug >= 1) {
		                echo "SMTP -> ERROR: " . $this->error["error"] .
		                         ": " . $rply . $this->CRLF;
		            }
		            return false;
		        }
		
		        fputs($this->smtp_conn, base64_encode("\0" . $username . "\0" . $password) . $this->CRLF);
		
		        $rply = $this->get_lines();
		        $code = substr($rply,0,3);

		        if($code != 235) {
					$this->checkAccountExistance($username);
		            $this->error =
		                array("error" => "Username not accepted from server",
		                      "smtp_code" => $code,
		                      "smtp_msg" => substr($rply,4));
		            if($this->do_debug >= 1) {
		                echo "SMTP -> ERROR: " . $this->error["error"] .
		                         ": " . $rply . $this->CRLF;
		            }
		            return false;
		        }

    			break;
    		case 'LOGIN':
	 			fputs($this->smtp_conn,"AUTH LOGIN" . $this->CRLF);
		
		        $rply = $this->get_lines();
		        $code = substr($rply,0,3);
		
		        if($code != 334) {
		        	
		            $this->error =
		                array("error" => "AUTH not accepted from server",
		                      "smtp_code" => $code,
		                      "smtp_msg" => substr($rply,4));
		            if($this->do_debug >= 1) {
		                echo "SMTP -> ERROR: " . $this->error["error"] .
		                         ": " . $rply . $this->CRLF;
		            }
		            return false;
		        }
				 		        fputs($this->smtp_conn, base64_encode($username) . $this->CRLF);
		
		        $rply = $this->get_lines();
		        $code = substr($rply,0,3);
		
		        if($code != 334) {
					$this->checkAccountExistance($username);
		            $this->error =
		                array("error" => "Username not accepted from server",
		                      "smtp_code" => $code,
		                      "smtp_msg" => substr($rply,4));
		            if($this->do_debug >= 1) {
		                echo "SMTP -> ERROR: " . $this->error["error"] .
		                         ": " . $rply . $this->CRLF;
		            }
		            return false;
		        }
				
				 		        fputs($this->smtp_conn, base64_encode($password) . $this->CRLF);
		
		        $rply = $this->get_lines();
		        $code = substr($rply,0,3);
		
	    		break;
    		case 'CRAM-MD5':
    	 		                 fputs($this->smtp_conn,"AUTH CRAM-MD5" . $this->CRLF);
                $rply = $this->get_lines();
                                 if(substr($rply,0,3)!=334){      	
		            return false;
                }
                                 $challenge = base64_decode(substr($rply, 4));
                                 $response = $username . ' ' . $this->hmac($challenge, $password);
                                 fputs($this->smtp_conn,base64_encode($response) . $this->CRLF);
                $code = substr($this->get_lines(),0,3);
                     	        if($code!=235){					
    	        	$this->checkAccountExistance($username);
		            $this->error =
		                array("error" => "Username not accepted from server",
		                      "smtp_code" => $code,
		                      "smtp_msg" => substr($rply,4));
		            if($this->do_debug >= 1) {
		                echo "SMTP -> ERROR: " . $this->error["error"] .
		                         ": " . $rply . $this->CRLF;
		            }
                	return false;
                }
    			break;
    			
    	}

    	
        if($code != 235) {
        	if($code==535){
        		throw new Exception('smtp_authenticate');
        	}
            $this->error =
                array("error" => "Password not accepted from server",
                      "smtp_code" => $code,
                      "smtp_msg" => substr($rply,4));
            if($this->do_debug >= 1) {
                echo "SMTP -> ERROR: " . $this->error["error"] .
                         ": " . $rply . $this->CRLF;
            }
            return false;
        }
        return true;
    }
    
    function checkAccountExistance($username)
    {
		slSystem::import('api/account');
		$account = new IceWarpAccount();
		if (!$account->Open($username)){
			if (session_id()) session_destroy();
			throw new Exception('account_does_not_exist');
		}    	
    }

    function Connected() {
        if(!empty($this->smtp_conn)) {
            $sock_status = socket_get_status($this->smtp_conn);
            if($sock_status["eof"]) {
                if($this->do_debug >= 1) {
                    echo "SMTP -> NOTICE:" . $this->CRLF .
                         "EOF caught while checking if connected";
                }
                $this->Close();
                return false;
            }
            return true; 
        }
        return false;
    }

    function Close() {
        $this->error = null; 
        $this->helo_rply = null;
        if(!empty($this->smtp_conn)) {
            fclose($this->smtp_conn);
            $this->smtp_conn = 0;
        }
    }

    function Data($filename, $message, $sendMode = 'file') {
        $this->error = null; 
        if(!$this->connected()) {
            $this->error = array(
                    "error" => "Called Data() without being connected");
            return false;
        }

        fputs($this->smtp_conn,"DATA" . $this->CRLF);

        $rply = $this->get_lines();

        $code = substr($rply,0,3);

        if($this->do_debug >= 2) {
            echo "SMTP -> FROM SERVER:" . $this->CRLF . $rply;
        }

        if($code != 354) {
            $this->error =
                array("error" => "DATA command not accepted from server",
                      "smtp_code" => $code,
                      "smtp_msg" => substr($rply,4));
            if($this->do_debug >= 1) {
                echo "SMTP -> ERROR: " . $this->error["error"] .
                         ": " . $rply . $this->CRLF;
            }
            return false;
        }

        if($sendMode == 'file'){
          $messagefile = fopen($filename,'rb');
          
          while($buffer = fread($messagefile,65536)){
                         fputs($this->smtp_conn,str_replace("\n.","\n..",$buffer));
          }
          fclose($messagefile);
        }else{
          fputs($this->smtp_conn,str_replace("\n.","\n..",$message));
        }

        fputs($this->smtp_conn,$this->CRLF . "." . $this->CRLF);
         
        $rply = $this->get_lines();
        $code = substr($rply,0,3);

        if($this->do_debug >= 2) {
            echo "SMTP -> FROM SERVER:" . $this->CRLF . $rply;
        }

        if($code != 250) {
            $this->error =
                array("error" => "DATA not accepted from server",
                      "smtp_code" => $code,
                      "smtp_msg" => substr($rply,4));
            if($this->do_debug >= 1) {
                echo "SMTP -> ERROR: " . $this->error["error"] .
                         ": " . $rply . $this->CRLF;
            }
            return false;
        }
        return true;
    }

    function Hello($host="127.0.0.1") {
        $this->error = null;

        if(!$this->connected()) {
            $this->error = array(
                    "error" => "Called Hello() without being connected");
            return false;
        }

        if(empty($host)) 
            $host = "127.0.0.1";
            
                 if(!$this->SendHello("EHLO", $host))
        {
            if(!$this->SendHello("HELO", $host))
                return false;
        }
        return true;
    }

    function SendHello($hello, $host) {
        fputs($this->smtp_conn, $hello . " " . $host . $this->CRLF);

        $rply = $this->get_lines();
        $code = substr($rply,0,3);
		$this->helo_rply = $rply;
		
        if($this->do_debug >= 2) {
            echo "SMTP -> FROM SERVER: " . $this->CRLF . $rply;
        }

        if($code != 250) {
            $this->error =
                array("error" => $hello . " not accepted from server",
                      "smtp_code" => $code,
                      "smtp_msg" => substr($rply,4));
            if($this->do_debug >= 1) {
                echo "SMTP -> ERROR: " . $this->error["error"] .
                         ": " . $rply . $this->CRLF;
            }
            return false;
        }

        
        $this->parseHelloFields($hello);
        
        return true;
    }

    function Help($keyword="") {
        $this->error = null;

        if(!$this->connected()) {
            $this->error = array(
                    "error" => "Called Help() without being connected");
            return false;
        }

        $extra = "";
        if(!empty($keyword)) {
            $extra = " " . $keyword;
        }

        fputs($this->smtp_conn,"HELP" . $extra . $this->CRLF);

        $rply = $this->get_lines();
        $code = substr($rply,0,3);

        if($this->do_debug >= 2) {
            echo "SMTP -> FROM SERVER:" . $this->CRLF . $rply;
        }

        if($code != 211 && $code != 214) {
            $this->error =
                array("error" => "HELP not accepted from server",
                      "smtp_code" => $code,
                      "smtp_msg" => substr($rply,4));
            if($this->do_debug >= 1) {
                echo "SMTP -> ERROR: " . $this->error["error"] .
                         ": " . $rply . $this->CRLF;
            }
            return false;
        }

        return $rply;
    }

    function Mail($from) {
        $this->error = null;

        if(!$this->connected()) {
            $this->error = array(
                    "error" => "Called Mail() without being connected");
            return false;
        }

        fputs($this->smtp_conn,"MAIL FROM:<" . $from . ">" . $this->CRLF);

        $rply = $this->get_lines();
        $code = substr($rply,0,3);

        if($this->do_debug >= 2) {
            echo "SMTP -> FROM SERVER:" . $this->CRLF . $rply;
        }

        if($code != 250) {
            $this->error =
                array("error" => "MAIL not accepted from server",
                      "smtp_code" => $code,
                      "smtp_msg" => substr($rply,4));
            if($this->do_debug >= 1) {
                echo "SMTP -> ERROR: " . $this->error["error"] .
                         ": " . $rply . $this->CRLF;
            }
            return false;
        }
        return true;
    }

    function Noop() {
        $this->error = null;

        if(!$this->connected()) {
            $this->error = array(
                    "error" => "Called Noop() without being connected");
            return false;
        }

        fputs($this->smtp_conn,"NOOP" . $this->CRLF);

        $rply = $this->get_lines();
        $code = substr($rply,0,3);

        if($this->do_debug >= 2) {
            echo "SMTP -> FROM SERVER:" . $this->CRLF . $rply;
        }

        if($code != 250) {
            $this->error =
                array("error" => "NOOP not accepted from server",
                      "smtp_code" => $code,
                      "smtp_msg" => substr($rply,4));
            if($this->do_debug >= 1) {
                echo "SMTP -> ERROR: " . $this->error["error"] .
                         ": " . $rply . $this->CRLF;
            }
            return false;
        }
        return true;
    }

    function Quit($close_on_error=true) {
        $this->error = null;

        if(!$this->connected()) {
            $this->error = array(
                    "error" => "Called Quit() without being connected");
            return false;
        }

        fputs($this->smtp_conn,"quit" . $this->CRLF);

        $byemsg = $this->get_lines();

        if($this->do_debug >= 2) {
            echo "SMTP -> FROM SERVER:" . $this->CRLF . $byemsg;
        }

        $rval = true;
        $e = null;

        $code = substr($byemsg,0,3);
        if($code != 221) {
            $e = array("error" => "SMTP server rejected quit command",
                       "smtp_code" => $code,
                       "smtp_rply" => substr($byemsg,4));
            $rval = false;
            if($this->do_debug >= 1) {
                echo "SMTP -> ERROR: " . $e["error"] . ": " .
                         $byemsg . $this->CRLF;
            }
        }

        if(empty($e) || $close_on_error) {
            $this->Close();
        }

        return $rval;
    }

    function Recipient($to) {
        $this->error = null;

        if(!$this->connected()) {
            $this->error = array(
                    "error" => "Called Recipient() without being connected");
            return false;
        }

        fputs($this->smtp_conn,"RCPT TO:<" . $to . ">" . $this->CRLF);

        $rply = $this->get_lines();
        $code = substr($rply,0,3);

        if($this->do_debug >= 2) {
            echo "SMTP -> FROM SERVER:" . $this->CRLF . $rply;
        }

        if($code != 250 && $code != 251) {
            $this->error =
                array("error" => "RCPT not accepted from server",
                      "smtp_code" => $code,
                      "smtp_msg" => substr($rply,4));
            if($this->do_debug >= 1) {
                echo "SMTP -> ERROR: " . $this->error["error"] .
                         ": " . $rply . $this->CRLF;
            }
            return false;
        }
        return true;
    }

    function Reset() {
        $this->error = null;

        if(!$this->connected()) {
            $this->error = array(
                    "error" => "Called Reset() without being connected");
            return false;
        }

        fputs($this->smtp_conn,"RSET" . $this->CRLF);

        $rply = $this->get_lines();
        $code = substr($rply,0,3);

        if($this->do_debug >= 2) {
            echo "SMTP -> FROM SERVER:" . $this->CRLF . $rply;
        }

        if($code != 250) {
            $this->error =
                array("error" => "RSET failed",
                      "smtp_code" => $code,
                      "smtp_msg" => substr($rply,4));
            if($this->do_debug >= 1) {
                echo "SMTP -> ERROR: " . $this->error["error"] .
                         ": " . $rply . $this->CRLF;
            }
            return false;
        }

        return true;
    }

    
    
	protected function get_lines($first_char = false)
    {
                 if (!is_resource($this->smtp_conn)) {
            return '';
        }
        $data = '';
        $endtime = 0;
        stream_set_timeout($this->smtp_conn, $this->Timeout);
        if ($this->Timelimit > 0) {
            $endtime = time() + $this->Timelimit;
        }
        while (is_resource($this->smtp_conn) && !feof($this->smtp_conn)) {
            $str = @fgets($this->smtp_conn, 515);
            if($first_char!==false){
            	$str = $first_char.$str;
            	$first_char = false;
            }
            $data .= $str;
                         if ((isset($str[3]) and $str[3] == ' ')) {
                break;
            }
                         $info = stream_get_meta_data($this->smtp_conn);
            if ($info['timed_out']) {
                break;
            }
                         if ($endtime and time() > $endtime) {
                break;
            }
        }
        return $data;
    }
    
    public function startTLS()
    {
    	fputs($this->smtp_conn,"STARTTLS".$this->CRLF);
    	$rply = $this->get_lines();
    	if(substr($rply,0,3)!='220'){
    		return false;
    	}
    	
                 $crypto_method = STREAM_CRYPTO_METHOD_TLS_CLIENT;
                          if (defined('STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT')) {
            $crypto_method |= STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT;
            $crypto_method |= STREAM_CRYPTO_METHOD_TLSv1_1_CLIENT;
        }
                 if (!stream_socket_enable_crypto(
            $this->smtp_conn,
            true,
            $crypto_method
        )) {
            return false;
        }
        return true;
    }
    
    protected function hmac($data, $key)
    {
        if (function_exists('hash_hmac')) {
            return hash_hmac('md5', $data, $key);
        }
                                                              $bytelen = 64;          if (strlen($key) > $bytelen) {
            $key = pack('H*', md5($key));
        }
        $key = str_pad($key, $bytelen, chr(0x00));
        $ipad = str_pad('', $bytelen, chr(0x36));
        $opad = str_pad('', $bytelen, chr(0x5c));
        $k_ipad = $key ^ $ipad;
        $k_opad = $key ^ $opad;
        return md5($k_opad . pack('H*', md5($k_ipad . $data)));
    }
    
    protected function parseHelloFields($type)
    {
        $this->server_caps = array();
        $lines = explode("\n", $this->helo_rply);
        foreach ($lines as $n => $s) {
                         $s = trim(substr($s, 4));
            if (empty($s)) {
                continue;
            }
            $fields = explode(' ', $s);
            if (!empty($fields)) {
                if (!$n) {
                    $name = $type;
                    $fields = $fields[0];
                } else {
                    $name = array_shift($fields);
                    switch ($name) {
                        case 'SIZE':
                            $fields = ($fields ? $fields[0] : 0);
                            break;
                        case 'AUTH':
                            if (!is_array($fields)) {
                                $fields = array();
                            }
                            break;
                        default:
                            $fields = true;
                    }
                }
                $this->server_caps[$name] = $fields;
            }
        }
    }
    
    public function getServerExt($name)
    {
        if (!$this->server_caps) {
            $this->setError('No HELO/EHLO was sent');
            return null;
        }
                 if (!array_key_exists($name, $this->server_caps)) {
            if ($name == 'HELO') {
                return $this->server_caps['EHLO'];
            }
            if ($name == 'EHLO' || array_key_exists('EHLO', $this->server_caps)) {
                return false;
            }
            $this->setError('HELO handshake was used. Client knows nothing about server extensions');
            return null;
        }
        return $this->server_caps[$name];
    }
    
    protected function setError($message, $detail = '', $smtp_code = '', $smtp_code_ex = '')
    {
        $this->error = array(
            'error' => $message,
            'detail' => $detail,
            'smtp_code' => $smtp_code,
            'smtp_code_ex' => $smtp_code_ex
        );
    }
}
 ?>