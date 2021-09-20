<?php

 
class slToolsCharset
{
    protected static $fixUTF8 = array(
        "\xc2\x80" => "\xe2\x82\xac",

        "\xc2\x82" => "\xe2\x80\x9a",
        "\xc2\x83" => "\xc6\x92",
        "\xc2\x84" => "\xe2\x80\x9e",
        "\xc2\x85" => "\xe2\x80\xa6",
        "\xc2\x86" => "\xe2\x80\xa0",
        "\xc2\x87" => "\xe2\x80\xa1",
        "\xc2\x88" => "\xcb\x86",
        "\xc2\x89" => "\xe2\x80\xb0",
        "\xc2\x8a" => "\xc5\xa0",
        "\xc2\x8b" => "\xe2\x80\xb9",
        "\xc2\x8c" => "\xc5\x92",

        "\xc2\x8e" => "\xc5\xbd",


        "\xc2\x91" => "\xe2\x80\x98",
        "\xc2\x92" => "\xe2\x80\x99",
        "\xc2\x93" => "\xe2\x80\x9c",
        "\xc2\x94" => "\xe2\x80\x9d",
        "\xc2\x95" => "\xe2\x80\xa2",
        "\xc2\x96" => "\xe2\x80\x93",
        "\xc2\x97" => "\xe2\x80\x94",
        "\xc2\x98" => "\xcb\x9c",
        "\xc2\x99" => "\xe2\x84\xa2",
        "\xc2\x9a" => "\xc5\xa1",
        "\xc2\x9b" => "\xe2\x80\xba",
        "\xc2\x9c" => "\xc5\x93",

        "\xc2\x9e" => "\xc5\xbe",
        "\xc2\x9f" => "\xc5\xb8"
    );

     
	static public function my_iconv($inCharset, $outCharset, $inputString)
	{
		$bIgnoreIn = self::checkIgnore($inCharset);
		$bIgnoreOut = self::checkIgnore($outCharset);

		if (!$inCharset)
			$inCharset = $_SESSION['DEFAULTCHARSET'];
		
		$inCharset = self::charsetOverride($inCharset);
		$outCharset = self::charsetOverride($outCharset);
		
		if(strtolower($inCharset)=='utf-32'){
			$fix = chr(0).chr(0).chr(0).chr(0);
			$inputString = $inputString.$fix;
		}
		if (strtolower($inCharset) != strtolower($outCharset)){
			$inputString = iconv($inCharset . ($bIgnoreIn ? "//IGNORE" : ""), $outCharset . ($bIgnoreOut ? "//IGNORE" : ""), $inputString);
            $inputString = self::fixUTF8Characters($inputString);
		}
		return $inputString;
	}

     
	static public function charsetOverride($charset)
	{
		
		switch(strtolower($charset)) {
			 			 			case 'utf':
			case 'utf8':
			case 'none':
			case 'unknown-8bit':
				$charset = 'utf-8';
				break;
			 			case 'user-defined':
			case 'x-user-defined':
				$charset = $_SESSION['DEFAULTCHARSET'];
				break;
			 			case '_autodetect_all':
				$charset = '';
				break;
			 			case 'gb18030':
			case 'gb2312':
			case 'x-gbk':
				$charset = 'gbk';
				break;
			 			case 'unicode':
				 				$charset = 'utf-8';
				break;
			 			case 'ks_c_5601-1987':
				$charset = 'euc-kr';
				break;
			case 'ptbr-iso-8859-1':
			case '8859-1':
				$charset = 'iso-8859-1';
			    break;
			case 'big5':
				$charset = 'big5-hkscs';
			    break;
			case 'iso-8859-8-i':
				$charset = 'iso-8859-8';
			    break;
            case 'iso-88595':
                $charset = 'iso-8859-5';                  break;
		}
		return $charset;
	}
     
	static private function checkIgnore(&$charset)
	{
		if (strpos($charset, "//IGNORE") !== false) 
		{
			$charset = str_replace("//IGNORE", "", $charset);
			return true;
		}

		return false;
	}

    public static function fixUTF8Characters($text){
        return str_replace(array_keys(self::$fixUTF8), array_values(self::$fixUTF8), $text);
    }
}
?>