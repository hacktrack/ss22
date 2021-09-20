<?php
include('jsmin.php');
include('cssmin.php');

class minimizer
{
	private static $prefix='';
	private static $gz=true;
	private static $debug=false;
	private static $charset='utf-8';
	private static $type='';

	public static function secureList($list)
	{
		$sec=array();
		$exs=array();
		foreach($list as $val)
		{
			$val=str_replace("\0",'',$val);
			$ex=explode('.',$val);
			$exs[]=$ex;
			if (strtolower($ex[count($ex)-1])=='css' || strtolower($ex[count($ex)-1])=='js')
			{
				$sec[]=$val;
			}
			else
			{
				$sec[]='!AD!';
			}
		}
		 		return $sec;
	}

	private static function gzdecode ($data)
	{
		$flags = ord(substr($data, 3, 1));
		$headerlen = 10;
		$extralen = 0;
		$filenamelen = 0;
		if ($flags & 4)
		{
			$extralen = unpack('v' ,substr($data, 10, 2));
			$extralen = $extralen[1];
			$headerlen += 2 + $extralen;
		}
		if ($flags & 8)  			$headerlen = strpos($data, chr(0), $headerlen) + 1;
		if ($flags & 16)  			$headerlen = strpos($data, chr(0), $headerlen) + 1;
		if ($flags & 2)  			$headerlen += 2;
		$unpacked = @gzinflate(substr($data, $headerlen));
		if ($unpacked === FALSE)
			$unpacked = $data;
		return $unpacked;
	}

	 
	public static function getMime ($pripona)
	{
		$mimetypes = array(
		'doc' => 'application/msword',
		'bin' => 'application/octet-stream',
		'lha' => 'application/octet-stream',
		'exe' => 'application/octet-stream',
		'dll' => 'application/octet-stream',
		'pdf' => 'application/pdf',
		'eps' => 'application/postscript',
		'ps' => 'application/postscript',
		'xls' => 'application/vnd.ms-excel',
		'ppt' => 'application/vnd.ms-powerpoint',
		'swf' => 'application/x-shockwave-flash',
		'tar' => 'application/x-tar',
		'zip' => 'application/zip',
		'mid' => 'audio/midi',
		'midi' => 'audio/midi',
		'mp2' => 'audio/mpeg',
		'mp3' => 'audio/mpeg',
		'm3u' => 'audio/x-mpegurl',
		'bmp' => 'image/bmp',
		'gif' => 'image/gif',
		'ief' => 'image/ief',
		'jpeg' => 'image/jpeg',
		'jpg' => 'image/jpeg',
		'jpe' => 'image/jpeg',
		'png' => 'image/png',
		'tiff' => 'image/tiff',
		'tif' => 'image/tiff',
		'xbm' => 'image/x-xbitmap',
		'wrl' => 'model/vrml',
		'vrml' => 'model/vrml',
		'js' => 'text/javascript',
		'css' => 'text/css',
		'script' => 'text/javascript',
		'style' => 'text/css',
		'html' => 'text/html',
		'htm' => 'text/html',
		'asc' => 'text/plain',
		'txt' => 'text/plain',
		'rtx' => 'text/richtext',
		'rtf' => 'text/rtf',
		'sgml' => 'text/sgml',
		'sgm' => 'text/sgml',
		'xml' => 'text/xml',
		'mpeg' => 'video/mpeg',
		'mpg' => 'video/mpeg',
		'mpe' => 'video/mpeg',
		'qt' => 'video/quicktime',
		'mov' => 'video/quicktime',
		'avi' => 'video/x-msvideo',
		'rar' => 'application/rar',
		);

		return $mimetypes[$pripona];
	}

	static function expost($nazev_promenne,$ex='')
	{
		$ret = "";
		if (isset($_POST["$nazev_promenne"]))
		{
			$ret = $_POST["$nazev_promenne"];
		}
		else
		{
			if (isset($_GET["$nazev_promenne"]))
			{
				$ret = $_GET["$nazev_promenne"];
			}
			else
			{
				$ret = "";
			}
		}
			if ($ret=='') {$ret=$ex;}
			return $ret;
	}

	public static function prefix($prefix)
	{
		self::$prefix=$prefix;
	}

	public static function debug()
	{
		self::$debug=true;
	}

	private static function packJS($script)
	{

		 
		$co=array("{\n",")\n","else\n");
		$zaco=array("{",")","else ");

		 		$packed=JSMin::minify($script);
		return $packed;
	}

	private static function packCSS($style)
	{
		$packed=cssmin($style);
		return $packed;
	}

	private static function timeHash($list)
	{
		$info='';
		foreach($list as $val)
		{
			if ($val!='none')
			{
				$info.=@filemtime(self::$prefix.$val);
			}
		}
		return md5($info);
	}

	public static function check($type,$files='')
	{
		if ($files=='') {$files=self::expost($type);}
		$hash=md5($files);

		if ($files!='')
		{

			$list=explode(',',$files);

			$info=self::timeHash($list);

			if (!file_exists('packages')) {mkdir('packages',0755);}

			$d=opendir('packages');
			while($f=readdir($d))
			{
				$fl=explode('.',$f);
				if ($fl[0]==$hash && $fl[1]!=$info)
				{
					@unlink('packages/'.$f);
				}
			}
		}
	}

	private static function getPackage($list,$hash,$info)
	{
		if (file_exists('packages/'.$hash.'.'.$info) && !self::$debug)
		{
			$ret=file_get_contents('packages/'.$hash.'.'.$info);
			if (!self::$gz)
			{
				$ret=self::gzdecode($ret);
			}
			return $ret;
		}
		else
		{
			$ret='';
			 			 			foreach ($list as $val)
			{
				 				if ($val!='!AD!' && $val!='none' && $val!='')
				{
					
					if (file_exists(self::$prefix.$val) && is_file(self::$prefix.$val))
					{
						if (!$ret.=@file_get_contents(self::$prefix.$val)."\r\n")
						{
							$ret.="/* SOUBOR \"".slToolsPHP::htmlspecialchars(self::$prefix.$val)."\" NEEXISTUJE */\r\n";
						}
						 					}
					else
					{
						$ret.="/* SOUBOR \"".slToolsPHP::htmlspecialchars(self::$prefix.$val)."\" NENALEZEN */\r\n";
						 					}
				}
				else
				{
					if ($val=='!AD!')
					{
						$ret.="/*/ ACCESS DENIED /*/";
					}
				}
			}

			 
			 
			if (!self::$debug)
			{
				if (self::$type=='script')
				{
					$ret=self::packJS($ret);
				}
				elseif (self::$type=='style')
				{
					$ret=self::packCSS($ret);
				}
			}

			
			$ungzipped=$ret;
			$ret=gzencode($ret);

			if (!file_exists('packages')) {mkdir('packages',0755);}

			file_put_contents('packages/'.$hash.'.'.$info,$ret);

			if (!self::$gz) {$ret=$ungzipped;}

			return $ret;
		}
	}

	public static function get($type,$files='')
	{

		$ret='';
		if ($files=='') {$files=self::expost($type);}

		if ($files!='')
		{
			self::$type=$type;
	
			header("Content-type: ".self::getMime($type)."; charset=".self::$charset);
	
			if (substr_count(strtolower($_SERVER["HTTP_ACCEPT_ENCODING"]),'gzip')==0 || !function_exists('gzencode'))
			{
			 				self::$gz=false;
			}
			else
			{
				header("Content-Encoding: gzip");
				self::$gz=true;
			}
	
			$val='';
			$list=explode(',',$files);
			$list=self::secureList($list);
	
			$info=self::timeHash($list);
	
			$hash=md5($files);
	
			$ret=self::getPackage($list,$hash,$info);
		}

		return $ret;
	}
}
?>