<?php
 

if(!defined('MAX_LINKS_SIZE')){
	define( 'MAX_LINKS_SIZE', 32000 );
}
if(!defined('MAX_URL_LINKS')){
	define( 'MAX_URL_LINKS', 100 );
}
if(!defined('MAX_ADDRESS_LINKS')){
	define( 'MAX_ADDRESS_LINKS', 100 );
}
if(!defined('EMAIL_LINK_FORMAT')){
	define( 'EMAIL_LINK_FORMAT',"#__w_o#a href=#__w_q#mailto:$0#__w_q##__w_c#$1#__w_o#/a#__w_c#");
}

class slToolsString
{
	 
	public static function isabovechar($string)
	{
		for ($i = 0; $i < strlen($string); $i++) {
			if (ord($string[$i]) > 127) {
				return true;
			}
		}
		return false;
	}

	static public function text2html($text, $links=false, $checkIfEmpty = false)
	{
	 
			 			if($checkIfEmpty && trim($text)==''){
				return '';
			}
			if ($links) {
				$result = self::textLinksToHTML($text);
			} else {
				$result = slToolsPHP::htmlspecialchars($text,ENT_COMPAT | ENT_HTML401 | ENT_SUBSTITUTE);
			}
			
			 			return str_replace(array('  ',"\t"), array(' &nbsp;','&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'), nl2br($result));
		 
	}

	static public function textLinksToHTML($string, $htmlspecialchars = true)
	{

		$emailPattern = '/(((?<!(\.)))\b[&\*\'a-z0-9\.\+_-]{1,255}@[a-z0-9\.\+_-]{1,252}\.[a-z]{2,6})(\?[^\s]+)?/i';
		$urlPattern = '{(([A-Za-z]{3,9})://?([-;:&=\+\$\w]+@{1})?|(www)\.)((([-A-Za-z0-9\[]{1,}(\.|:))+([-:A-Za-z0-9\]\[]{2,}|[0-9\]\[]{1,}))|([a-zA-Z0-9_-]{1,})):?(\d+)?((/((\?)?[-\(\):\+!\~/&%@\.\w\*,]+)?\??([-\(\)\+!\:=;&%@\.\w\\\\{}\*,/]+)?((["-\(\)\+!\:=;&%@\.\w\\\\{}\*,/]+)([-\(\)\+!\:=;&%@\.\w\\\\{}\*,/]+)))?(#[^\s\r\n\t]+)?)?(/)?}';
		
		 		 		$stringToProcess = substr($string, 0, MAX_LINKS_SIZE);
		$string = substr($string,MAX_LINKS_SIZE);
		 		$replaceFunction = function($matches){
		    $rep = str_replace("@", "#__w_at#", $matches[0]); $http = $matches[4]=="www"?"http://":""; return "#__w_o#a href=#__w_q#$http$rep#__w_q##__w_c#$rep#__w_o#/a#__w_c#";
		};
		$stringToProcess = preg_replace_callback($urlPattern, $replaceFunction, $stringToProcess, MAX_URL_LINKS);

		 		$stringToProcess = preg_replace($emailPattern,EMAIL_LINK_FORMAT,$stringToProcess, MAX_ADDRESS_LINKS);
		
		 		if($htmlspecialchars){
			$stringToProcess = slToolsPHP::htmlspecialchars($stringToProcess, ENT_COMPAT | ENT_HTML401 | ENT_SUBSTITUTE );
			$stringToProcess = str_replace('#__w_o#','<',$stringToProcess);
			$stringToProcess = str_replace('#__w_c#','>',$stringToProcess);
			$stringToProcess = str_replace('#__w_q#','"',$stringToProcess);
			$stringToProcess = str_replace('#__w_at#','@',$stringToProcess);
			$string = slToolsPHP::htmlspecialchars($string, ENT_COMPAT | ENT_HTML401 | ENT_SUBSTITUTE );
			
		}else{
			$stringToProcess = str_replace('#__w_o#','<',$stringToProcess);
			$stringToProcess = str_replace('#__w_c#','>',$stringToProcess);
			$stringToProcess = str_replace('#__w_q#','"',$stringToProcess);
			$stringToProcess = str_replace('#__w_at#','@',$stringToProcess);
		}
		return $stringToProcess.$string;
	}

	public static function removeHTML($message,$maxlen = false)
	{
		 
			 
			$message = preg_replace('#(?<![\s\>])\n#'," ",$message);
			$message = strtr($message,array("\n"=>"","\r\n"=>""));
			 			$message = preg_replace('#<li[^>]*>#i',"\r\n - ",$message);
			$message = preg_replace('#<td[^>]*>#i'," ",$message);

			 			$message = preg_replace('#(\r\n)?<(div|p)([^>]+)?><br><\/(div|p)>#i',"\r\n",$message);

			 			$message = preg_replace('#<(p|br|hr|tr|/p)[^>]*>#i',"\r\n",$message);
			 			$message = preg_replace('#<style[^>]*>(.*?)</style>#si',"",$message);
	
			 			$message = preg_replace('#(\<\/?div\>)+(?!\r\n)#i',"\r\n",$message);
	
			 			$message = strip_tags($message);
			 			$message = html_entity_decode($message,ENT_QUOTES,'UTF-8');

			 

			return $message;
		 
	}

	 
	public static function includeHtmlPurifier() {
		 		 		if (!defined('HTMLPURIFIER_PREFIX')) {
			define('HTMLPURIFIER_PREFIX', __DIR__ . '/../libs');
			set_include_path(HTMLPURIFIER_PREFIX . PATH_SEPARATOR . get_include_path());
			require_once(__DIR__ . '/../libs/HTMLPurifier.standalone.php');
			require_once(__DIR__ . '/../libs/HTMLPurifier.custom.filters.php');
			require_once(__DIR__ . '/../libs/CSSTidy/class.csstidy.php');
			require_once(__DIR__ . '/../libs/HTMLPurifier/Filter/ExtractStyleBlocks.php');
		}

		$config = HTMLPurifier_Config::createDefault();

		 		if(ini_get('session.save_handler') == 'files'){
		    $cacheDir = ini_get('session.save_path') . 'webmail-htmlpurifier';
        }else{
            $api = IceWarpAPI::instance();
            $tempPath = $api->GetProperty('c_system_storage_dir_temppath');
            if(!empty($tempPath)){
                $cacheDir = $tempPath . 'PHP/';
            }else{
                $cacheDir = __DIR__ . '/../libs/HTMLPurifier/DefinitionCache/Serializer';
            }
        }
		if (false === file_exists($cacheDir)) {
			mkdir($cacheDir, 0777, true);
		}
		if (true === file_exists($cacheDir)) {
			$config->set('Cache.SerializerPath', $cacheDir);
		}

		 		$config->set('HTML.TidyAdd', 'table@border');

		 		$config->set('Core.ConvertDocumentToFragment', false);

		 		$config->set('Attr.EnableID', true);
		$config->set('Attr.IDPrefix', 'webClient_');

		 		$config->set('Core.LegacyEntityDecoder', true);

		 		$config->set('Core.EscapeNonASCIICharacters', true);

		 		$config->set('CSS.MaxImgLength', null);
		$config->set('HTML.MaxImgLength', null);

		 		$config->set('CSS.AllowTricky', true);

		 		$config->set('CSS.AllowImportant', true);

		         $config->set('URI.Host', $_SERVER['SERVER_NAME']);

		return $config;
	}

	 
	public static function correctInvalidHtml(&$htmlString) {
		$styles = array();
		 		$firstBodyPosition = stripos($htmlString, '<body');
		if ($firstBodyPosition !== false) {
			$styleAttribute = self::extractStyleFromTag($htmlString, 'body');
			if ($styleAttribute) {
				$styles['body'] = $styleAttribute;
			}
			 			$nextBodyPosition = stripos($htmlString, '<body', $firstBodyPosition + 1);
			if ($nextBodyPosition !== false) {
				 				$xml = self::getXmlFromHtml($htmlString);
				if ($xml) {
					$htmlString = $xml->saveHTML();
				}
			}
		}
		$firstHtmlPosition = stripos($htmlString, '<html');
		if ($firstHtmlPosition !== false) {
			$styleAttribute = self::extractStyleFromTag($htmlString, 'html');
			if ($styleAttribute) {
				$styles['html'] = $styleAttribute;
			}
		}
		if (count($styles) > 0) {
			$styleString = '';
			foreach ($styles as $tag => $style) {
				$styleString .= $tag . '{' . $style . '}';
			}
			$htmlString = '<style>' . $styleString . '</style>' . $htmlString;
		}
	}

	 
	public static function extractStyleFromTag(&$htmlString, $tagName) {
		$firstTagPosition = stripos($htmlString, '<' . $tagName);
		$tagContentStart = $firstTagPosition + 5;
		$endOfTagPosition = strpos($htmlString, '>', $tagContentStart);
		$tagContent = substr($htmlString, $tagContentStart, $endOfTagPosition - $tagContentStart);
		 		if (preg_match('/style=\"([^"]*)/i', $tagContent, $matches) === 1) {
			return $matches[1];
		}
		return '';
	}

	 
	public static function _getDefaultAllowedSchemes() {
		return array('http' => true, 'https' => true, 'mailto' => true, 'ftp' => true, 'nntp' => true, 'news' => true, 'tel' => true, 'data' => true, 'm-files'=>true , 'chrome'=>true, 'file'=>true);
	}

	 
	public static function purifyHTML($htmlString, $enableExternalResources = false, $enableLinkification = true) {
	     
		$config = slToolsString::includeHtmlPurifier();
		slToolsString::correctInvalidHtml($htmlString);

		 		$config->set('URI.AllowedSchemes', slToolsString::_getDefaultAllowedSchemes());

		if ($enableLinkification) {
			 			$config->set('AutoFormat.Linkify', true);
		}

		 		$config->set('HTML.TargetBlank', true);

		 		$uri = $config->getDefinition('URI');
		$uri->addFilter(new HTMLPurifier_URIFilter_DisableResourcesWithoutHost($enableExternalResources), $config);

		$purifier = new HTMLPurifier($config);
		$output = $purifier->purify($htmlString);
		return $output;
	}

	 
	public static function purifyAdvancedHTML($htmlString, $enableExternalResources = false, $enableLinkification = true, &$externalResourcesAreBlocked = false, &$base = '') {
		$config = slToolsString::includeHtmlPurifier();
		slToolsString::correctInvalidHtml($htmlString);

		 		$schemes = slToolsString::_getDefaultAllowedSchemes();
		$schemes['cid'] = true;
		$config->set('URI.AllowedSchemes', $schemes);

		if ($enableLinkification) {
			 			 			$config->set('AutoFormat.Linkify', true);
		}

		 		$config->set('HTML.TargetBlank', true);

		 		$config->set('Filter.ExtractStyleBlocks', true);

		 		$uri = $config->getDefinition('URI');
		$uri->addFilter(new HTMLPurifier_URIFilter_AdvancedResourceFilter($enableExternalResources), $config);

		$htmlString = preg_replace('/<!--([\s\S]*?)-->/', '', $htmlString);
		$purifier = new HTMLPurifier($config);
		$output = $purifier->purify($htmlString);

		 		if ((int) $purifier->context->get('CheckAndDisableExternalResourcesCounter', true) >= 1) {
			$externalResourcesAreBlocked = true;
		}

		$base = $purifier->context->get('BaseUrl', true);

		 		$styles = $purifier->context->get('StyleBlocks');
		foreach ($styles as $style) {
			if ($style !== '') {
				$output = '<style type="text/css">' . $style . '</style>' . "\n" . $output;
			}
		}

		return $output;
	}

	 
	public static function getXmlFromHtml($string) {
		$xml = false;

        if(preg_match_all('/(<meta[^>]*charset[^>]*>)/i', $string, $matches, PREG_SET_ORDER)){
            foreach ($matches as $match) {
                $match = current($match);
                $element = new DOMDocument();
                $options = 0;
                if(defined('LIBXML_HTML_NOIMPLIED')){
                    $options |= LIBXML_HTML_NOIMPLIED;
                }
                if(defined('LIBXML_HTML_NODEFDTD')){
                    $options |= LIBXML_HTML_NODEFDTD;
                }
                @$element->loadHTML($match, $options);
                 
                $meta = $element->getElementsByTagName('meta')->item(0);
                if(!$meta instanceof DOMNode || !$meta->hasAttribute('http-equiv')) continue;
                if($meta->hasAttribute('content')){
                    $meta->setAttribute('content', trim($meta->getAttribute('content'),';') . ';' . $meta->getAttribute('charset'));
                }else{
                    $meta->setAttribute('content', $meta->getAttribute('charset'));
                }
                $meta->removeAttribute('charset');
                $string = str_replace($match, $element->saveXML($element->documentElement), $string);
            }
        }

		libxml_disable_entity_loader(true);
		try {
			$string = self::fixSpace($string);
			if(preg_match_all('/\\<[^a-z!\\/][^\\>]+\\>/i', $string, $matches)){
                foreach ($matches[0] as $match) {
                    $string = str_replace($match, htmlentities($match), $string);
			    }
            }
			$xml = slToolsDOM::openFromString($string, true, LIBXML_PARSEHUGE, true);
		} catch (Exc $e) {
            $config = array(
                'output-xml' => true,
                'wrap' => false,
                'doctype' => 'omit',
                'quote-nbsp' => false,
                'quiet' => false,
                'bare' => true,
                'fix-backslash' => false,
                'indent-cdata' => false,
                'drop-proprietary-attributes' => true
            );
			$tidy = new tidy;
			$tidy->parseString($string, $config, 'utf8');
			$tidy->cleanRepair();
			$string = trim(strval($tidy));
			unset($tidy);
			$string = self::fixSpace($string);
			try {
				$xml = slToolsDOM::openFromString($string, true, LIBXML_PARSEHUGE, true);
			}
			catch (Exc $e) {
				$string = str_replace('<![endif]>', '', $string);
				$string = self::utf8_bad_replace($string);
				$string = self::fixSpace($string);
				$xml = slToolsDOM::openFromString($string, false, LIBXML_PARSEHUGE, true);
			}
		}
		return $xml;
	}

	public static function cleanHTML($string,&$base = '',$block_external = false,&$blocked = false, $textLinks = false, $wrap_html = false)
	{ 
		$oldstring = '';
		$string = str_replace('<?php','',$string);
		while($oldstring!=$string){
			$oldstring = $string;
			$string = str_replace("<pre><o:p>&nbsp;</o:p></pre>\r\n","",$string);
			$string = str_replace("<pre>&nbsp;<o:p></o:p></pre>\r\n","",$string);
		}

		$string = self::fixSpace($string,'in');

		$string = str_replace(
				"&",
				"&amp;",
				$string
		);
		
		 		$string = preg_replace('#(<a[^>]*>)<center>(.*?)</center></a>#si','<center>$1$2</a><center>',$string,-1,$number);
		$string = preg_replace('/<a([^>]*)>(\s+)?(<\!\-\-([^-]+)(\-\->))?(\s+)?<div([^>]*)>(.*?)<\/div>(\s+)?<\/a>/si','<div$7><a$7$1>$8</a></div>',$string);
		$string = preg_replace('/<(span)([^>]*)>(\s+)<center>(.*?)<\/center>(\s+)<\/span>/si','<center><div$2> $4</div><center>',$string);
		
		 		$string = preg_replace('/<([\?#%])([^\/\?#%]*)([\/\?#%])>/si','',$string);
		$string = preg_replace('/<!(\?)?\[[^>]+\](\?)?>/si','',$string);
		$string = preg_replace('/(<![\xe2\x80\x93]{0,3}\[if([^\]]+)\][-]{0,2}>)(.*?)(<![^>]+>)/si','',$string);
		
		 		$string = str_replace('<!-- <script src="http://www.flybe.com/web-app/lib/jqueryext/jquery.xdomainrequest.min.js"></script> -->','',$string);
		$string = str_replace('<!-- <script src="http://www.flybe.com/web-app/common/js/ieFixes/json2.js"></script> -->','',$string);
		$string = str_replace('<!-- <script src="http://www.flybe.com/web-app/common/js/ieFixes/IEConsoleFix.js"></script> -->','',$string);
		$string = str_replace('<!-- <script src="http://www.flybe.com/web-app/lib/jqueryext/jquery.xdomainrequest.min.js"></script> -->','',$string);
		$string = str_replace('<!-- <script src="http://peacock.flybe.com/web-app/common/js/ieFixes/json2.js"></script> -->','',$string);
		$string = str_replace('<!-- <script src="http://peacock.flybe.com/web-app/common/js/ieFixes/IEConsoleFix.js"></script> -->','',$string);
		$string = str_replace('<!-- <script type="text/javascript" src="http://peacock.flybe.com/web-app/dist/js/search-widget-standalone.min.js"></script> -->','',$string);
		$string = str_replace('<!-- <script src="http://peacock.flybe.com/web-app/lib/jqueryext/jquery.xdomainrequest.min.js"></script> -->','',$string);
		 		 		 		$string = preg_replace('/<!--\[if (!mso|gte mso 9) ?\]>(.*?)<!(==)?\[endif\]-->/si','',$string);
		
		$string = preg_replace('/<\!\[if/si','<!--[if',$string);
		$string = preg_replace('/<\!\[endif/si','<!--[endif',$string);
		
		 		$string = preg_replace('/]]&amp;gt;/i',']]>',$string);
		
		 		if($block_external){
			if(preg_match("/(<([^(src|href)]+)src=).data:([^>]+)(>)/siu",$string,$matches)){
				$string = preg_replace("/(<([^(src|href)]+)src=).data:([^>]+)(>)/siu","$1\"#\"$4",$string);
				$blocked = true;
			}
		}

		$xml = self::getXmlFromHtml($string);

		unset($string);
		libxml_disable_entity_loader(false);

		 		$dangerous = $xml->query("//*[@*[starts-with(name(),'on')]] | //*[@*[starts-with(name(),'on')]]");
		if(!empty($dangerous)){
			foreach($dangerous as $item){
				if(!empty($item->attributes)){
					foreach($item->attributes as $attrName => $attr){
						if(strpos($attrName,'on')===0 || strpos($attrName,'xmlns')===0){
							$item->setAttribute($attrName,'');
						}
					}
				}
			}
		}
		 		$metaElm = $xml->query("//meta[@content]");
		$metaElm = $metaElm->item(0);

		if($metaElm){
			$content = $metaElm->getAttribute('content');
			 			$content = preg_replace('/(charset=([^"]+))/si','charset=utf-8',$content);
			$metaElm->setAttribute('content',$content);
		}
		 		$baseElm = $xml->query("//base");
		$baseElm = $baseElm->item(0);
		if($baseElm){
			if($href = $baseElm->getAttribute('href')){
				$res = strval($href);
			}else if($url = $baseElm->getAttribute('url')){
				$res = strval($url);
			}else if($name = $baseElm->getAttribute('name')){
				$res = strval($name);
			}else{
				$res = $baseElm->tagValue;
			}
			$base = $res;
			if(substr($base,strlen($base)-1)!=='/'){
				$base.='/';
			}
			 			$images = $xml->query("//img");
			if(!empty($images)){
				foreach($images as $img){
					if($src = $img->getAttribute('src')){
						if(strpos($src,'http')!==0   && strpos($src,'cid:')!==0){
							$img->setAttribute('src',$base.$src);
						}
					}
				}
			}
		}
		 		if(!$base){
			$hrefs = $xml->query("//a[not(contains(@href,'://')) and not(starts-with(@href,'mailto'))]");
			if(!empty($hrefs)){
				foreach($hrefs as $href){
					if($src = $href->getAttribute('href')){
						if(strpos($src,'#')===false){
							$href->setAttribute('href','http://'.$src);
						}
					}
				}
			}
		}
		 		$hrefs = $xml->query("//a[starts-with(@href,'%20')]");
		if(!empty($hrefs)){
				foreach($hrefs as $href){
					if($src = $href->getAttribute('href')){
						if(strpos($src,'#')===false){
							$href->setAttribute('href',trim(trim($src),'%20'));
						}
					}
				}
			}

		 		$images = $xml->query("//img");
		if(!empty($images)){
			foreach($images as $img){
				if($src = $img->getAttribute('src')){
					
					if($block_external){
						if(strpos($src,'http')!==false && strpos($src,'http')===0){
							$blocked = true;
							$img->setAttribute('src','#');

						}
					}else{
						if(strpos($src,'http')!==false && strpos(ltrim(trim($src),'%20'),'http')===0){
							if(trim($src)!=$src || ltrim($src,'%20')!=$src){
								$img->setAttribute('src',ltrim(trim($src),'%20'));
							}
						}
					}
				}
			}
		}

		 		if($block_external){
			$elements = $xml->query("//input");
			if(!empty($elements)){
				foreach($elements as $elm){
					if($src = $elm->getAttribute('src')){
						if(strpos($src,'http')!==false && strpos($src,'http')===0){
							$blocked = true;
							$elm->setAttribute('src','#');
						}
					}
				}
			}
			unset($elements);
			 			$elements = $xml->query("//*[contains(@background,'http')]");
			if(!empty($elements)){
				foreach($elements as $elm){
					if($src = $elm->getAttribute('background')){
						if(strpos($src,'http')!==false && strpos($src,'http')===0){
							$blocked = true;
							$elm->setAttribute('background','none');
						}
					}
				}
			}
			unset($elements);
				
			 			$elements = $xml->query("//style[contains(.,'@import')]");
			if(!empty($elements)){
				foreach($elements as $elm){
					$blocked = true;
					$elm->nodeValue = '';
				}
			}
			unset($elements);
				
			 			$elements = $xml->query("//style[contains(.,'src:url')]");
			if(!empty($elements)){
				foreach($elements as $elm){
					$blocked = true;
					$elm->nodeValue = '';
				}
			}
			unset($elements);
				
			 			$elements = $xml->query("//*[contains(@style,'http')]");
			if(!empty($elements)){
				foreach($elements as $elm){
					if($src = $elm->getAttribute('style')){
						if(strpos($src,'content:')!==false && strpos($src,'content:')===0){
							$blocked = true;
							$elm->setAttribute('style','#');
						}
					}
				}
			}
			unset($elements);
			
			 			$elements = $xml->query("//*[contains(@srcset,'http')]");
			if(!empty($elements)){
				foreach($elements as $elm){
					if($src = $elm->getAttribute('srcset')){
						if(strpos($src,'http')!==false && strpos($src,'http')===0){
							$blocked = true;
							$elm->setAttribute('srcset','#');
						}
					}
				}
			}
			unset($elements);
		}

		 		if(defined('HTML_MAILTO_FORMAT')){
			$hrefs = $xml->query("//a[starts-with(@href,'mailto')]");
			if(!empty($hrefs)){
				foreach($hrefs as $href){
					if($src = $href->getAttribute('href')){
						if(preg_match('/mailto:([^&]+)/si',$src,$matches)){
							$href->setAttribute('href',str_replace('__#address',$matches[1],HTML_MAILTO_FORMAT));
						}
					}
				}
			}
			unset($hrefs);
		}
		if($textLinks){
			$texts = $xml->query("//text()[not(parent::a)]");
			if(!empty($texts)){
				$textLinksCount = 0;
				foreach($texts as $text){
					if($textLinksCount++>MAX_URL_LINKS){
						break;
					}
					if($text->length >= 5){
						$nodeValue = self::textLinksToHTML($text->nodeValue);
						$fragment = $text->ownerDocument->createDocumentFragment();
						$fragment->appendXML($nodeValue);
						$text->parentNode->insertBefore($fragment,$text);
						$text->nodeValue = '';
					}
				}
			}
		}

		$string = $xml->saveHTML();

		unset($xml);
		 		$achar = slToolsCharset::my_iconv('WINDOWS-1250','UTF-8//IGNORE',chr(hexdec('A0')));
		$string = preg_replace('/'.$achar.'(<\/(span|font|p|div)>)/si','&amp;nbsp;$1',$string);

		 		 		 
		 		$string = preg_replace('#([a-z]*)=([\`\'\"]{0,10})(javascript|vbscript):#iU','$1=$2noscript...',$string);
		 		 		 		if(preg_match('#(<[^>]+) style=(\'|")?([^>\"]{0,})(expression|behavior).([^\>]{0,})#i',$string,$matches)){
			$string = preg_replace('#(<[^>]+) style=(\'|")?([^>\"]{0,})(expression|behavior).([^\>]{0,})#i',"$1",$string);
		}
		

		do {
			$oldstring = $string;
			 			$string = preg_replace('#</*\w+:\w[^>]*>#i',"",$string);
			 			$string = preg_replace('#</*(meta|xml'.($wrap_html?'':'|html').'|blink|link|embed|object|iframe|frame|frameset|ilayer|layer|bgsound)[^>]*>#i',"",$string);
			 			$string = preg_replace('#<applet[^>]*>(.*?)</applet>#si',"",$string);
			$string = preg_replace('#<base[^>]*>(.*?)</base>#si',"",$string);
			$string = preg_replace('#<script[^>]*>(.*?)</script>#si',"",$string);
			$string = preg_replace('#<applet[^>]*>#i',"",$string);
			$string = preg_replace('#<base[^>]*>#i',"",$string);
			$string = preg_replace('#<script[^>]*>#i',"",$string);
			 		} while ($oldstring != $string);
		unset($oldstring);

		 		if(strlen($string) > 100000 && strpos($string,str_pad('',5000,"</li>\n</ul></td></tr></table>\n"))!==false){
			$string = preg_replace('/<table>.?<tr>.?<td>/si','<span>',$string);
			$string = preg_replace('/<ul>/si','',$string);
			$string = preg_replace('/<li>/si','<li style="float:left;">&amp;nbsp;</li>',$string);
		}
		if($block_external){
			$string = preg_replace('/background-image:url\([^\)]+\)/si','',$string);
			$string = preg_replace('/background:url\([^\)]+\)/si','',$string);
		}

		$string = str_replace(
				"&amp;",
				"&",
				$string
		);
					
		 		$string = preg_replace('#<\\\/([^>]+)>#si','</$1>',$string);

		$string = preg_replace('/<(\?|#|%)([^(\?|#|%)]{0,})(\?|#|%)>/i','',$string);
		$string = trim($string);

		return $string;
	}
	
	 
	public static function removeUrlFromAttribute(slToolsDOM & $xml, bool & $blocked, string $query, string $attribute, string $prefix = 'http', string $replace = '#')
	{
	    if (!$elements = $xml->query($query)) return;
	    foreach ($elements as $elm) {
		if (($src = $elm->getAttribute($attribute)) && strpos($src, $prefix) !== false && strpos($src, $prefix) === 0) {
		    $blocked = true;
		    $elm->setAttribute($attribute, $replace);
		}
	    }
	}

	public static function strReplaceOnce($string, $remove, $replace = '')
    {
        if (($pos = strpos($string, $remove)) !== false) {
            $string = substr_replace($string, $replace, $pos, strlen($remove));
        }
        return $string;
    }
	
	public static function basicSanitizeHTML($string, &$base = '', $block_external = false, &$blocked = false, $textLinks = false, $wrap_html = false)
	{
        $blocked = $blocked ?? false;
	    $string = str_replace('<?php', '', $string);

	    if(preg_match_all('/<style[^>]*>(?P<inside>.*?)<\/style>/is', $string, $matches)){
            foreach ($matches['inside'] as $inside) {
                if(!preg_match_all('/<style[^>]*>/', $inside, $remove)) continue;
                $replace = '';
                foreach ($remove[0] as $item) {
                    $replace = self::strReplaceOnce($inside, $item);
                }
                $string = self::strReplaceOnce($string, $inside, $replace);
	        }
        }

	    do{
		$oldstring = $string;
		$string = str_replace("<pre><o:p>&nbsp;</o:p></pre>\r\n", "", $string);
		$string = str_replace("<pre>&nbsp;<o:p></o:p></pre>\r\n", "", $string);
	    }while ($oldstring != $string);

	    $string = str_replace("&", "&amp;", $string);

	     	    $string = preg_replace('/]]&amp;gt;/i', ']]>', $string);

	     	    if ($block_external) {
		if (preg_match("/(<([^(src|href)]+)src=).data:([^>]+)(>)/siu", $string, $matches)) {
		    $string = preg_replace("/(<([^(src|href)]+)src=).data:([^>]+)(>)/siu", "$1\"#\"$4", $string);
		    $blocked = true;
		}
	    }

	    $xml = self::getXmlFromHtml($string);
	    libxml_disable_entity_loader(false);
	     	    $metaElm = $xml->query("//meta[@content]");
	    $metaElm = $metaElm->item(0);

	    if ($metaElm) {
		$content = $metaElm->getAttribute('content');
		 		$content = preg_replace('/(charset=([^"]+))/si', 'charset=utf-8', $content);
		$metaElm->setAttribute('content', $content);
	    }
	     	    $baseElm = $xml->query("//base");
	    $baseElm = $baseElm->item(0);
	    if ($baseElm) {
		if ($href = $baseElm->getAttribute('href')) {
		    $res = strval($href);
		} else if ($url = $baseElm->getAttribute('url')) {
		    $res = strval($url);
		} else if ($name = $baseElm->getAttribute('name')) {
		    $res = strval($name);
		} else {
		    $res = $baseElm->tagValue;
		}
		$base = $res;
		if (substr($base, strlen($base) - 1) !== '/') {
		    $base .= '/';
		}
		 		if ($images = $xml->query("//img")) {
		    foreach ($images as $img) {
			if (($src = $img->getAttribute('src')) && strpos($src, 'http') !== 0 && strpos($src, 'cid:') !== 0) {
			    $img->setAttribute('src', $base . $src);
			}
		    }
		}
	    }

	     	    if ($hrefs = $xml->query("//a[starts-with(@href,'%20')]")) {
		foreach ($hrefs as $href) {
		    if (($src = $href->getAttribute('href')) && strpos($src, '#') === false) {
			$href->setAttribute('href', trim(trim($src), '%20'));
		    }
		}
	    }

	     	    if ($images = $xml->query("//img")) {
		foreach ($images as $img) {
		    if (($src = $img->getAttribute('src')) && strpos($src, 'http') !== false) {
			if ($block_external) {
			    if (strpos($src, 'http') === 0) {
				$blocked = true;
				$img->setAttribute('src', '#');
			    }
			} else {
			    if (strpos(ltrim(trim($src), '%20'), 'http') === 0 && (trim($src) != $src || ltrim($src, '%20') != $src)) {
				$img->setAttribute('src', ltrim(trim($src), '%20'));
			    }
			}
		    }
		}
	    }
	     	    if ($block_external) {
		self::removeUrlFromAttribute($xml, $blocked, '//input', 'src');
		 		self::removeUrlFromAttribute($xml, $blocked, "//*[contains(@background,'http')]", 'background', 'http', 'none');
		 		if ($elements = $xml->query("//style[contains(.,'@import')]")) {
		    foreach ($elements as $elm) {
                if(!preg_match_all('/(?P<full>@import[^\(;]+(?:\((?P<url>[^\)]+)\))?[^;]*?;)/i', $elm->nodeValue, $matches, PREG_SET_ORDER)) continue;
                foreach ($matches as $match) {
                    if(strpos($match['url'], 'https://fonts.googleapis.com/css') === 0) continue;
                    $elm->nodeValue = str_replace($match['full'], '', $elm->nodeValue);
                    $blocked = true;
		        }
                $elm->nodeValue = trim($elm->nodeValue);
		    }
		}
		 		if ($elements = $xml->query("//style[contains(.,'src:url')]")) {
		    foreach ($elements as $elm) {
			$blocked = true;
			$elm->nodeValue = '';
		    }
		}
		 		self::removeUrlFromAttribute($xml, $blocked, "//*[contains(@style,'http')]", 'style', 'content:');
		 		self::removeUrlFromAttribute($xml, $blocked, "//*[contains(@srcset,'http')]", 'srcset');
	    }

	     	    if (defined('HTML_MAILTO_FORMAT')) {
		if ($hrefs = $xml->query("//a[starts-with(@href,'mailto')]")) {
		    foreach ($hrefs as $href) {
			if (($src = $href->getAttribute('href')) && preg_match('/mailto:([^&]+)/si', $src, $matches)) {
			    $href->setAttribute('href', str_replace('__#address', $matches[1], HTML_MAILTO_FORMAT));
			}
		    }
		}
	    }
	    if ($textLinks) {
		if ($texts = $xml->query("//text()[not(parent::a)]")) {
		    $textLinksCount = 0;
		    foreach ($texts as $text) {
			if ($textLinksCount++ > MAX_URL_LINKS) {
			    break;
			}
			if ($text->length >= 5) {
			    $nodeValue = self::textLinksToHTML($text->nodeValue);
			    $fragment = $text->ownerDocument->createDocumentFragment();
			    $fragment->appendXML($nodeValue);
			    $text->parentNode->insertBefore($fragment, $text);
			    $text->nodeValue = '';
			}
		    }
		}
	    }

	    $string = $xml->saveHTML();

	     	    $achar = slToolsCharset::my_iconv('WINDOWS-1250', 'UTF-8//IGNORE', chr(hexdec('A0')));
	    $string = preg_replace('/' . $achar . '(<\/(span|font|p|div)>)/si', '&amp;nbsp;$1', $string);

	    if ($block_external) {
		$string = preg_replace('/background-image:url\([^\)]+\)/si', '', $string);
		$string = preg_replace('/background:url\([^\)]+\)/si', '', $string);
	    }

	    $string = str_replace("&amp;", "&", $string);
	    $string = trim($string);
	    return $string;
	}

    static public function fixSpace($string,$inout = 'out')
	{	
		if($inout=='out'){
			 			$offset = 0;
			while(preg_match("/<pre>(.*?)<\/pre>/si",$string,$matches,PREG_OFFSET_CAPTURE, $offset)){
				$pom = substr($string,$offset,$matches[0][1]-$offset);

				$pom = str_replace(">\r\n",">",$pom);
				$pom = str_replace("\r\n<","<",$pom);
				$pom = str_replace(">\n",">",$pom);
				$pom = str_replace("\n<","<",$pom);

				$string = substr_replace($string,$pom,$offset,$matches[0][1] - $offset);
				$offset = $matches[0][1] + strlen($matches[0][1]);
			}
			if($offset==0){
				$string = str_replace(">\r\n",">",$string);
				$string = str_replace("\r\n<","<",$string);
				$string = str_replace(">\n",">",$string);
				$string = str_replace("\n<","<",$string);
			}
		}
		return $string;
	}
	 
	static function utf8_bad_replace($input,$replace=' ',$fixForXML = false,$fourbyte = false)
	{
		$input = str_replace("\xef\xbf\xbe","",$input);
		 		return icewarp_utf8_bad_replace($input,$replace,true,$fourbyte);
	}

	 
	static public function utf8_bad_replace_array( &$array,$replace=' ',$fixForXML = false )
	{
		if($array) foreach($array as $key => $val){
			if(is_array($val)){
				$array[$key] = self::utf8_bad_replace_array( $array[$key], $replace, $fixForXML );
			}else{
				$array[$key] = self::utf8_bad_replace( $array[$key], $replace, $fixForXML );
			}
		}
		return $array;
	}

	 
	static public function htmlspecialchars_array($array)
	{
        $return = [];
		if (is_array($array)) {
			foreach($array as $key => $val) {
				if (is_array($val)) {
					$return[$key] = self::htmlspecialchars_array($val);
				} else {
					$return[$key] = slToolsPHP::htmlspecialchars($val);
				}
			}
		} else {
			return slToolsPHP::htmlspecialchars($array);
		}
		return $return;
	}

	static public function unhtmlspecialchars($string)
	{
		$trans_tbl = get_html_translation_table (HTML_SPECIALCHARS);
		$trans_tbl = array_flip ($trans_tbl);
		return strtr ($string, $trans_tbl);
	}
	
	static public function unhtmlspecialchars_array($array)
	{
        $return = [];
		if (is_array($array)) {
			foreach($array as $key => $val) {
				if (is_array($val)) {
					$return[$key] = self::unhtmlspecialchars_array($val);
				} else {
					$return[$key] = self::unhtmlspecialchars($val);
				}
			}
		}
		return $return;
	}
	
	static public function lf2crlf($string)
	{
		$string = str_replace(CRLF, LF, $string);
		$string = str_replace(CR, LF, $string);
		return str_replace(LF, CRLF, $string);
	}

	static public function removeLineSeparators($string)
	{
		 		$string = str_replace("\xe2\x80\xa8",'',$string);
		 		$string = str_replace("\xe2\x80\xa9",'',$string);
		 		$string = str_replace("\xc2\x85",'',$string);
		 		$string = str_replace("\xb",'',$string);
		 		$string = str_replace("\xc",'',$string);
		 		$string = str_replace("\xa",'',$string);
		 		$string = str_replace("\xd",'',$string);

		return $string;
	}
	public static function cr2crlf($string)
	{
		$string = str_replace("\x0D", "", $string);
		return str_replace("\x0A", "\x0D\x0A", $string);
	}
	
	public static function parseURL($line)
	{
		if (!$line) {
			return array();
		}
		$result = array();
		$fields = explode("&", $line);
		 		if($fields) foreach ($fields as $item) {
			$pos = strpos($item, '=');
			if ($pos === false) {
				continue;
			}
			$key = substr($item, 0, $pos);
			$value = substr($item, $pos+1);
			$result[$key] = urldecode($value);
		}
		return $result;
	}
	public static function createURL($array) 
	{
		if(!is_array($array)) { 
			return '';
		}
		$result = '';
		$first = true;
		if (is_array($array))
		{
			foreach($array as $k => $v) {
				if ($first) {
					$first = false;
				} else {
					$result .= '&';
				}
				$result .= $k. "=" . urlencode($v);
			}
		}
		return $result;
	}
	
	public static function cidrMatch($ip, $cidr)
	{
	    list($subnet, $mask) = explode('/', $cidr);
	    if ((ip2long($ip) & ~((1 << (32 - $mask)) - 1) ) == ip2long($subnet)) { 
	        return true;
	    }
	    return false;
	}
	
	static public function urlenquote($string)
	{
		$string = urlencode($string);
		$string = str_replace('%','\'',$string);
		return $string;
	}
	
	static public function urldequote($string)
	{
		$string = str_replace('\'','%',$string);
		$string = urldecode($string);
		return $string;
	}	
	
	static public function fixDistributionListHeader($header)
	{
		 		if(preg_match('/^(")?(\[(~)?(.*?))(")?@(")?((.*?)\])(")?$/si',$header,$matches)){
			$header = $matches[2].'@'.$matches[7];
		}
		 		if(preg_match('/^(")?(\[(.*?)\])(")?@".MISSING-HOST-NAME."$/si',$header,$matches)){
			$header = $matches[2];
		}
		return $header;
	}
}
?>