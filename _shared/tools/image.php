<?php

include_once SHAREDLIB_PATH . '/error/ShutDownHandler.php';

class ImageException extends Exception {
	protected $code = '';
	protected $message = '';
	protected $userMessage = '';

	public function __construct($message, $code, $userMessage = '') {
		$this->code = $code;
		$this->message = $message;
		$this->userMessage = $userMessage;
	}

	public function __toString() {
		return "exception '" . __CLASS__ . "' with message '" . $this->message . "'";
	}

	public function getErrorCode() {
		return $this->code;
	}

	public function getUserMessage() {
		return $this->userMessage;
	}
}

class slToolsImage
{
	private $image;
	private $image_type;
	private $throw_errors=true;
	private $filename='';
	private $cachepath;
	private $useCache=false;
	private $actions=array();
	private $quality=75;
	private $pathParts=array();
	private $ignoreFileExtension=false;
	private $ignoreImageSize=false;
	private $needChange=false;
	 
	protected $memLimit;
	 
	protected $shutDownHandler;

    const MAX_MEMORY = 2147483648;
    const MAX_MEMORY_STRING = '2048M';

	public function __construct($useCache = false, $throw_errors = true)
	{
		$this->useCache($useCache);
		$this->throw_errors = $throw_errors;
	}

	private function throwException($userMessage, $message, $code = 'UNDEFINED_ERROR', $rethrow = false)
	{
        if($this->shutDownHandler instanceof ShutDownHandler) $this->shutDownHandler->runFunctions();
		if ($this->throw_errors) {
			throw new ImageException($message, $code, $userMessage);
		}
		if ($rethrow) {
			throw new Exception($message, $code);
		}
	}
	
	private function needChange($bool=false)
	{
		if($bool)
		{
			$this->needChange=true;
		}
		return $this->needChange;
	}
	
	private function useCache($bool)
	{
		$this->useCache=$bool;
	}
	
	private function getUseCache()
	{
		return $this->useCache;
	}
	
	private function parsePath($path)
	{
		$path=str_replace('\\','/',$path);
		$parts=explode('/',$path);
		$file=$parts[count($parts)-1];
		unset($parts[count($parts)-1]);
		$path=join('/',$parts).'/';
		if($path=='/'){$path='./';}
		return array('path'=>$path,'file'=>$file);
	}
	
	private function mkdir($path,$rights=0755)
	{
		
		if(class_exists('slsystem'))
		{
			slSystem::import('tools/filesystem');
			return slToolsFilesystem::mkdir_r($path,$rights);
		}
		else
		{
			$this->throwException('Create directory failed.', 'Create directory failed! Class dependency error "slSystem" not found [Method:"' . __METHOD__ . '"]', 'CLASS_DEPENDENCY_ERROR');
			return false;
		}
	}

	private function setFile($source)
	{
		$source=str_replace('\\','/',$source);
		$parse=$this->parsePath($source);
		$this->filename=$source;
		$this->pathParts=$parse;
		return true;
	}
	
	private function getFile()
	{
		return $this->pathParts['path'].$this->pathParts['file'];
	}
	
	private function getFilePath()
	{
		return $this->pathParts['path'];
	}
	private function getFileName()
	{
		return $this->pathParts['file'];
	}

	public function setTempDir($directory,$permissions=0755)
	{
		if(!$this->mkdir($directory,$permissions))
		{
			$this->throwException('Save Failed. Insufficient rights.', 'Save Failed! Insufficient rights for mkdir "' . $directory . '" [Method:"' . __METHOD__ . '"]', 'SAVE_FAILED_RIGHTS_MKDIR');
			return false;
		}
		
		$this->cachepath=str_replace('\\','/',trim($directory,'/\\')).'/';
		return true;
	}

	public function getTempDir()
	{
		return $this->cachepath;
	}
	
	public function getQuality()
	{
		return $this->quality;
	}
	
	public function setQuality($quality)
	{
		$this->quality=$quality;
	}
	
	public function getFileHash()
	{
		return md5_file($this->getFile());
	}
	
	public function ignoreFileExtension($bool)
	{
		$this->ignoreFileExtension=$bool;
	}
	
	public function ignoreImageSize($bool)
	{
		$this->ignoreImageSize=$bool;
	}
	
	public function getImageType()
	{
		return $this->image_type;
	}
	
	private function clearSize($size)
	{
		$size=(int)str_replace(array('px','%'),array('',''),strtolower(trim($size)));
		return $size;
	}
	
	public function getCacheFileName($image_type=IMAGETYPE_JPEG,$additional_variables_to_consider=array())
	{
		$name=$this->getFileHash();
		$actions=md5($this->getActionsHash().md5(serialize($additional_variables_to_consider)));
		
		if($image_type==IMAGETYPE_JPEG){$extension='jpg';}
		elseif($image_type==IMAGETYPE_GIF){$extension='gif';}
		elseif($image_type==IMAGETYPE_PNG){$extension='png';}
		elseif($image_type==IMAGETYPE_BMP){$extension='bmp';}
		else
		{
			$this->throwException('Unsupported image type "' . $this->resolveImageType($this->image_type) . '".', 'getCacheFileName Failed! Unsupported image type "' . $this->resolveImageType($this->image_type) . '" [Method:"' . __METHOD__ . '"]', 'LOAD_FAILED_UNSUPPORTED_TYPE');
			return false;
		}
		
		return $name.'.'.$actions.'.'.$extension;
	}
	
	private function resolveImageType($type,$return_constant=false)
	{
		if($return_constant)
		{
			$lower=strtolower(trim($type));
			if($lower=='jpg' || $lower=='jpeg' || $lower=='jpe' || $lower=='image/jpeg' || $lower=="image/jpg"){$type=IMAGETYPE_JPEG;}
			elseif($lower=='gif' || $lower=='image/gif'){$type=IMAGETYPE_GIF;}
			elseif($lower=='png' || $lower=='image/png'){$type=IMAGETYPE_PNG;}
			elseif($lower=='bmp' || $lower=='image/bmp'){$type=IMAGETYPE_BMP;}
			return $type;
		}
		else
		{
			if($type==IMAGETYPE_JPEG){return "IMAGETYPE_JPEG";}
			elseif($type==IMAGETYPE_BMP){return "IMAGETYPE_BMP";}
			elseif($type==IMAGETYPE_GIF){return "IMAGETYPE_GIF";}
			elseif($type==IMAGETYPE_IFF){return "IMAGETYPE_IFF";}
			elseif($type==IMAGETYPE_JB2){return "IMAGETYPE_JB2";}
			elseif($type==IMAGETYPE_JP2){return "IMAGETYPE_JP2";}
			elseif($type==IMAGETYPE_JPC){return "IMAGETYPE_JPC";}
			elseif($type==IMAGETYPE_JPX){return "IMAGETYPE_JPX";}
			elseif($type==IMAGETYPE_PNG){return "IMAGETYPE_PNG";}
			elseif($type==IMAGETYPE_PSD){return "IMAGETYPE_PSD";}
			elseif($type==IMAGETYPE_SWC){return "IMAGETYPE_SWC";}
			elseif($type==IMAGETYPE_SWF){return "IMAGETYPE_SWF";}
			elseif($type==IMAGETYPE_TIFF_II){return "IMAGETYPE_TIFF_II";}
			elseif($type==IMAGETYPE_TIFF_MM){return "IMAGETYPE_TIFF_MM";}
			elseif($type==IMAGETYPE_WBMP){return "IMAGETYPE_WBMP";}
			elseif($type==IMAGETYPE_XBM){return "IMAGETYPE_XBM";}
			else{return 'UNKNOWN';}
		}
	}
	
	private function addAction($method,$args)
	{
		$this->actions[]=array($method,$args);
	}
	
	private function clearActions()
	{
		$this->actions=array();
	}
	
	private function getActionsHash()
	{
		return md5(serialize($this->actions));
	}
	
	private function runActions()
	{
		$cache=$this->getUseCache();
		$this->useCache(false);
		if(!empty($this->actions))
		{
			foreach($this->actions as $action)
			{
				call_user_func_array(array($this,$action[0]),$action[1]);
			}
		}
		$this->useCache($cache);
		$this->actions=array();
	}

	private function byte3($n)
	{
	    return chr($n & 255) . chr(($n >> 8) & 255) . chr(($n >> 16) & 255);
	}
	private function dword($n)
	{
	    return pack("V", $n);
	}
	private function word($n)
	{
	    return pack("v", $n);
	}

	private function imagebmp(&$img, $filename = false)
	{
	    if(!is_resource($img)) throw new Exc('Img is not resource');
	    $wid = imagesx($img);
	    $hei = imagesy($img);
	    $wid_pad = str_pad('', $wid % 4, "\0");
	   
	    $size = 54 + ($wid + $wid_pad) * $hei;
	   
	     	    $header['identifier'] = 'BM';
	    $header['file_size'] = $this->dword($size);
	    $header['reserved'] = $this->dword(0);
	    $header['bitmap_data'] = $this->dword(54);
	    $header['header_size'] = $this->dword(40);
	    $header['width'] = $this->dword($wid);
	    $header['height'] = $this->dword($hei);
	    $header['planes'] = $this->word(1);
	    $header['bits_per_pixel'] = $this->word(24);
	    $header['compression'] = $this->dword(0);
	    $header['data_size'] = $this->dword(0);
	    $header['h_resolution'] = $this->dword(0);
	    $header['v_resolution'] = $this->dword(0);
	    $header['colors'] = $this->dword(0);
	    $header['important_colors'] = $this->dword(0);
	
	    if ($filename)
	    {
	        $f = fopen($filename, "wb");
	        foreach ($header AS $h)
	        {
	            fwrite($f, $h);
	        }
	       
	         	        for ($y=$hei-1; $y>=0; $y--)
	        {
	            for ($x=0; $x<$wid; $x++)
	            {
	                $rgb = imagecolorat($img, $x, $y);
	                fwrite($f, $this->byte3($rgb));
	            }
	            fwrite($f, $wid_pad);
	        }
	        fclose($f);
	    }
	    else
	    {
	        foreach ($header AS $h)
	        {
	            echo $h;
	        }
	       
	         	        for ($y=$hei-1; $y>=0; $y--)
	        {
	            for ($x=0; $x<$wid; $x++)
	            {
	                $rgb = imagecolorat($img, $x, $y);
	                echo $this->byte3($rgb);
	            }
	            echo $wid_pad;
	        }
	    }
	    return true;
	} 

	public function imagecreatefrombmp($p_sFile)
	{
        $this->beforeImageManipulation($p_sFile);
		try
		{
		    $file    =    fopen($p_sFile,"rb");
		    $read    =    fread($file,10);
		    while(!feof($file)&&($read<>""))
		        $read    .=    fread($file,1024);
		    $temp    =    unpack("H*",$read);
		    $hex    =    $temp[1];
		    $header    =    substr($hex,0,108);
		    if (substr($header,0,4)=="424d")
		    {
		        $header_parts    =    str_split($header,2);
		        $width            =    hexdec($header_parts[19].$header_parts[18]);
		        $height            =    hexdec($header_parts[23].$header_parts[22]);
		        unset($header_parts);
		    }
		    $x                =    0;
		    $y                =    1;
		    $image            =    imagecreatetruecolor($width,$height);
		    $body            =    substr($hex,108);
		    $body_size        =    (strlen($body)/2);
		    $header_size    =    ($width*$height);
		    $usePadding        =    ($body_size>($header_size*3)+4);
		    for ($i=0;$i<$body_size;$i+=3)
		    {
		        if ($x>=$width)
		        {
		            if ($usePadding)
		                $i    +=    $width%4;
		            $x    =    0;
		            $y++;
		            if ($y>$height)
		                break;
		        }
		        $i_pos    =    $i*2;
		        $r        =    hexdec($body[$i_pos+4].$body[$i_pos+5]);
		        $g        =    hexdec($body[$i_pos+2].$body[$i_pos+3]);
		        $b        =    hexdec($body[$i_pos].$body[$i_pos+1]);
		        $color    =    imagecolorallocate($image,$r,$g,$b);
		        imagesetpixel($image,$x,$height-$y,$color);
		        $x++;
		    }
		    unset($body);
            $this->afterImageManipulation();
		    return $image;
		}
		catch(exception $e){
            $this->afterImageManipulation();
			$this->throwException('Load Failed. BMP error.', 'Load Failed! BMP error in "' . $p_sFile . '" [Method:"' . __METHOD__ . '"]', 'LOAD_FAILED_BMP');
			return false;
		}
	}

     
    protected function getBytes(string $string) : float
    {
        if($string === '-1') return self::MAX_MEMORY;
        if(!preg_match_all('/(?P<number>[0-9]+)(?P<unit>[PTGMK])?B?/i', $string, $matches, PREG_SET_ORDER)) return 0;
        $units = ['G' => 1073741824, 'M' => 1048576, 'K' => 1024, 'B' => 1];
        if(strlen((string)PHP_INT_MAX) > 10){
            $units['T'] = $units['G'] * 1024;
            $units['P'] = $units['T'] * 1024;
        }
        $result = 0;
        foreach ($matches as $match) {
            $result += $match['number'] * $units[strtoupper($match['unit'] ?? 'B')];
        }
        return $result;
    }

     
    public function enoughMemory(int $width, int $height, ? int $channels = 3) : bool
    {
        $channels = $channels ?? 3;
        $memLimit = ini_get ('memory_limit');
        $limit = $this->getBytes($memLimit);
        return ( $width * $height * $channels * 1.8 < $limit - memory_get_usage() );
    }

    protected function beforeImageManipulation(string $file = '') : void
    {
        $this->memLimit = ini_get ('memory_limit');
        if($this->getBytes($this->memLimit) < self::MAX_MEMORY) ini_set ('memory_limit', self::MAX_MEMORY_STRING);
        $this->shutDownHandler = new ShutDownHandler(507, 'Image can\'t be processed because it\'s size');
        if(strpos($file, '/~webmail/~upload/resize/') === false) return;
        $this->shutDownHandler->addFunction(function ($file) { unlink($file); }, $file);
    }

    protected function afterImageManipulation() : void
    {
        ini_set ('memory_limit', $this->memLimit);
        $this->shutDownHandler->disable();
    }

     
	public function load($source,$autorotate=true)
	{
		$this->setFile($source);
		if($this->useCache) {
            $args = func_get_args();
            $this->addAction(__FUNCTION__, $args);
            return true;
        }
        if (!file_exists($source)) {
            $this->throwException('Load Failed. File not found.', 'Load Failed! File not found "' . $source . '" [Method:"' . __METHOD__ . '"]', 'LOAD_FAILED_FILE_NOT_FOUND');
        }
        if(pathinfo($source, PATHINFO_EXTENSION) == 'svg' || mime_content_type($source) == 'image/svg+xml'){
            $this->image = file_get_contents($source);
            return true;
        }
        $image_info = @getimagesize($source);
        if (!$image_info) {
            $this->throwException('Load Failed. Invalid filetype or damaged image.', 'Load Failed! Invalid filetype or damaged image "' . $source . '" [Method:"' . __METHOD__ . '"]', 'LOAD_FAILED');
        }
        $this->beforeImageManipulation($source);
        if(!$this->enoughMemory($image_info[0], $image_info[1], $image_info['channels'] ?? 3)){
            $this->afterImageManipulation();
            $this->throwException('Load Failed. Image too large.', 'Load Failed. Image too large. "' . $source . '" [Method:"' . __METHOD__ . '"]', 'LOAD_FAILED_IMAGE_LARGE');
        }
        $error = false;
        try {
            $this->image_type = $image_info[2];
            if ($this->image_type == IMAGETYPE_JPEG) {
                if (!$this->image = @imagecreatefromjpeg($source)) $error = true;
            } elseif ($this->image_type == IMAGETYPE_GIF) {
                if (!$this->image = @imagecreatefromgif($source)) $error = true;
            } elseif ($this->image_type == IMAGETYPE_BMP) {
                if (!$this->image = $this->imagecreatefrombmp($source)) $error = true;
            } elseif ($this->image_type == IMAGETYPE_PNG) {
                if (!$this->image = @imagecreatefrompng($source)) {
                    $error = true;
                } else {
                    $output = imagecreatetruecolor($this->getWidth(), $this->getHeight());
                    $trnprt_indx = imagecolortransparent($this->image);
                                         if ($trnprt_indx >= 0) {
                                                 $trnprt_color = imagecolorsforindex($this->image, $trnprt_indx);
                                                 $trnprt_indx = imagecolorallocate($output, $trnprt_color['red'], $trnprt_color['green'], $trnprt_color['blue']);
                                                 imagefill($output, 0, 0, $trnprt_indx);
                                                 imagecolortransparent($output, $trnprt_indx);
                    } else {
                        imagealphablending($output, false);
                        imagesavealpha($output, true);
                        $transparent = imagecolorallocatealpha($output, 255, 255, 255, 127);
                        imagefilledrectangle($output, 0, 0, $this->getWidth(), $this->getHeight(), $transparent);
                    }
                    imagecopy($output, $this->image, 0, 0, 0, 0, $this->getWidth(), $this->getHeight());
                    $this->image = $output;
                }
            } else {
                $this->throwException('Load Failed. Unsupported image type "' . $this->resolveImageType($this->image_type) . '".', 'Load Failed! Unsupported image type "' . $this->resolveImageType($this->image_type) . '" in "' . $source . '" [Method:"' . __METHOD__ . '"]', 'LOAD_FAILED_UNSUPPORTED_TYPE');
            }
            if ($error) {
                $this->throwException('Load Failed. Corrupted image.', 'Load Failed! Corrupted image "' . $source . '" [Method:"' . __METHOD__ . '"]', 'LOAD_FAILED_UNSUPPORTED_TYPE');
            }
            if ($autorotate) {
                @$exif = exif_read_data($source);
                if (isset($exif['Orientation']) && ($exif['Orientation'] == 8 || $exif['Orientation'] == 6) && $image_info[0] > $image_info[1]) {
                    $degrees = 90;
                    if ($exif['Orientation'] != 8) {
                        $degrees *= -1;
                    }
                    $this->image = imagerotate($this->image, $degrees, 0);
                }
            }
            $this->afterImageManipulation();
            return true;
        } catch (Exception $e) {}
        $this->afterImageManipulation();
        $this->throwException('Load Failed. Invalid filetype or damaged image.', 'Load Failed! Invalid filetype or damaged image "' . $source . '" [Method:"' . __METHOD__ . '"]', 'LOAD_FAILED');
	}
	
	private function fixFileName($filename,$image_type)
	{
		if(!$this->ignoreFileExtension)
		{
			if(substr_count($filename,'.')==0){
				if($image_type==IMAGETYPE_JPEG){$filename=$filename.'.jpg';}
				if($image_type==IMAGETYPE_PNG){$filename=$filename.'.png';}
				if($image_type==IMAGETYPE_GIF){$filename=$filename.'.gif';}
				if($image_type==IMAGETYPE_BMP){$filename=$filename.'.bmp';}
			}else{
				$filename=explode('.',$filename);unset($filename[count($filename)-1]);$filename=join('.',$filename);
				if($image_type==IMAGETYPE_JPEG){$filename=$filename.'.jpg';}
				if($image_type==IMAGETYPE_PNG){$filename=$filename.'.png';}
				if($image_type==IMAGETYPE_GIF){$filename=$filename.'.gif';}
				if($image_type==IMAGETYPE_BMP){$filename=$filename.'.bmp';}
			}
		}
		return $filename;
	}
	
	public function save($filepath=false,$filename=false,$compression=false,$image_type=false,$permissions=0755)
	{
		if($compression==''){$compression=false;}
		if($image_type==''){$image_type=false;}
		if($filename==''){$filename=false;}
		
		if($image_type===false){$image_type=$this->getImageType();}else{$image_type=$this->resolveImageType($image_type,true);}
		if($filepath){$filepath=trim(str_replace('\\','/',$filepath),'/').'/';if($filepath=='/'){$filepath='./';}}
		if($filename){$filename=$this->fixFileName($filename,$image_type);}
		
		if(!$this->getUseCache())
		{
			if($image_type!=$this->getImageType()){$this->needChange(true);}
			
			if(!$filepath){$filepath=$this->getFilePath();}
			if(!$filename){$filename=$this->fixFileName($this->getFileName(),$image_type);}
			
			$this->runActions();
			if($compression){$this->setQuality($compression);}
			$compression=$this->getQuality();
			
			try
			{
				if(file_exists($filepath.$filename)){@chmod($filepath.$filename,$permissions);}
				else
				{
					 					if(!$this->mkdir($filepath,$permissions))
					{
						$this->throwException('Save Failed. Insufficient rights.', 'Save Failed! Insufficient rights for mkdir "' . $filepath . '" [Method:"' . __METHOD__ . '"]', 'SAVE_FAILED_RIGHTS_MKDIR');
						return false;
					}
				}
			}
			catch(ImageException $e)
			{
				throw $e;
			}
			catch(Exception $e)
			{
				$this->throwException('Save Failed! Insufficient rights.', 'Save Failed! Insufficient rights "' . $filepath . '" [Method:"' . __METHOD__ . '"]', 'SAVE_FAILED_RIGHTS');
				return false;
			}
			
			if($this->needChange())
			{
                $this->beforeImageManipulation($filepath.$filename);
				if($image_type==IMAGETYPE_JPEG)
				{
					if(!@imagejpeg($this->image,$filepath.$filename,$compression))
					{
                        $this->afterImageManipulation();
						$this->throwException('Save Failed! Image couldn\'t be created', 'Save Failed! Image couldn\'t be created "' . $filepath . $filename . '" [Method:"' . __METHOD__ . '"]', 'SAVE_FAILED');
						return false;
					}
				}
				elseif($image_type==IMAGETYPE_GIF)
				{
					if(!imagegif($this->image,$filepath.$filename))
					{
                        $this->afterImageManipulation();
						$this->throwException('Save Failed! Image couldn\'t be created', 'Save Failed! Image couldn\'t be created "' . $filepath . $filename . '" [Method:"' . __METHOD__ . '"]', 'SAVE_FAILED');
						return false;
					}
				}
				elseif($image_type==IMAGETYPE_BMP)
				{
					 					
					if(!$this->imagebmp($this->image,$filepath.$filename))
					{
                        $this->afterImageManipulation();
						$this->throwException('Save Failed! Image couldn\'t be created', 'Save Failed! Image couldn\'t be created "' . $filepath . $filename . '" [Method:"' . __METHOD__ . '"]', 'SAVE_FAILED');
						return false;
					}
					
					 				}
				elseif($image_type==IMAGETYPE_PNG)
				{
					if(!imagepng($this->image,$filepath.$filename))
					{
                        $this->afterImageManipulation();
						$this->throwException('Save Failed! Image couldn\'t be created', 'Save Failed! Image couldn\'t be created "' . $filepath . $filename . '" [Method:"' . __METHOD__ . '"]', 'SAVE_FAILED');
						return false;
					}
				}
				else
				{
                    $this->afterImageManipulation();
					$this->throwException('Save Failed! Unsupported image type "' . $this->resolveImageType($image_type) . '".', 'Save Failed! Unsupported image type "' . $this->resolveImageType($image_type) . '" in "' . $filepath . $filename . '" [Method:"' . __METHOD__ . '"]', 'SAVE_FAILED_UNSUPPORTED_TYPE');
					return false;
				}
                $this->afterImageManipulation();
			}
			else
			{
				if($filepath.$filename!=$this->getFilePath().$this->getFileName())
				{
					if(!file_exists($filepath.$filename))
					{
						if(!copy($this->getFilePath().$this->getFileName(),$filepath.$filename))
						{
							$this->throwException('Save Failed! Copy failed.', 'Save Failed! Copy failed "' . $this->getFilePath() . $this->getFileName() . '" to "' . $filepath . $filename . '" [Method:"' . __METHOD__ . '"]', 'SAVE_FAILED_UNSUPPORTED_TYPE');
							return false;
						}
					}
				}
			}
			
			@chmod($filepath.$filename,$permissions);
			
			return $filename;
		}
		else
		{
			if($filepath){$this->setTempDir($filepath);}
			return $this->cache(false,$compression,$image_type,$permissions);
		}
	}
	
	public function cache($tempDir=false,$compression=false,$image_type=false,$permissions=0755)
	{
		if($image_type===false){$image_type=$this->getImageType();}else{$image_type=$this->resolveImageType($image_type,true);}
		if($tempDir){$this->setTempDir($tempDir,$permissions);}
		if($compression){$this->setQuality($compression);}
		$compression=$this->getQuality();
		
		if(trim($this->getTempDir())=='')
		{
			$this->throwException('Save Failed! Temp directory was not set.', 'Save Failed! Temp directory was not set. Use "$obj->setTempDir($directory)" [Method:"' . __METHOD__ . '"]', 'SAVE_FAILED_NO_TEMP_DIR');
			return false;
		}
		$filename=$this->getCacheFileName($image_type,array($this->getFile(),$compression,$image_type));
		if(!file_exists($filename))
		{
			$this->runActions();
			$this->useCache(false);
			if($this->save($this->getTempDir(),$filename,$compression,$image_type,$permissions))
			{
				return $filename;
			}
			return false;
		}
		return $filename;
	}

	public function getWidth()
	{
		if(!$this->useCache && is_resource($this->image))
		{
			return imagesx($this->image);
		}
		else
		{
			return false;
		}
	}
	
	public function getHeight()
	{
		if(!$this->useCache && is_resource($this->image))
		{
			return imagesy($this->image);
		}
		else
		{
			return false;
		}
	}
	
	public function resizeToHeight($height)
	{
		$height=$this->clearSize($height);
		if(!$this->useCache)
		{
			$ratio = $height / $this->getHeight();
			$width = $this->getWidth() * $ratio;
			
			
			if(!$this->ignoreImageSize && $width>=$this->getWidth() && $height>=$this->getHeight())
			{
				return true;
			}
			else
			{
				$this->needChange(true);
				return $this->resize($width,$height);
			}
		}
		else
		{
			$args=func_get_args();$this->addAction(__FUNCTION__,$args);
			return true;
		}
	}
	
	public function resizeToWidth($width)
	{
		$width=$this->clearSize($width);
		if(!$this->useCache)
		{
			$ratio=$width / $this->getWidth();
			$height=$this->getheight() * $ratio;
			if(!$this->ignoreImageSize && $width>=$this->getWidth() && $height>=$this->getHeight())
			{
				return true;
			}
			else
			{
				$this->needChange(true);
				return $this->resize($width,$height);
			}
		}
		else
		{
			$args=func_get_args();$this->addAction(__FUNCTION__,$args);
			return true;
		}
	}
	
	public function resizeToFit($width,$height)
	{
		$width=$this->clearSize($width);
		$height=$this->clearSize($height);
		
		if(!$this->ignoreImageSize && $width>=$this->getWidth() && $height>=$this->getHeight())
		{
			return true;
		}
		else
		{
			$this->needChange(true);
			if(!$this->useCache)
			{
				$wScale=$this->getWidth()/$width;
				$hScale=$this->getHeight()/$height;
				
				if($hScale>$wScale)
				{
					return $this->resizeToHeight($height);
				}
				else
				{
					return $this->resizeToWidth($width);
				}
			}
			else
			{
				$args=func_get_args();$this->addAction(__FUNCTION__,$args);
				return true;
			}
		}
	}
	
	public function resizeToOverFit($width,$height)
	{
		$width=$this->clearSize($width);
		$height=$this->clearSize($height);
		if(!$this->useCache)
		{
			$wScale=$this->getWidth()/$width;
			$hScale=$this->getHeight()/$height;
			
			if($hScale<$wScale)
			{
				return $this->resizeToHeight($height);
			}
			else
			{
				return $this->resizeToWidth($width);
			}
		}
		else
		{
			$args=func_get_args();$this->addAction(__FUNCTION__,$args);
			return true;
		}
	}

	public function scale($scale)
	{
		$scale=$this->clearSize($scale);
		if(!$this->useCache)
		{
			$width=$this->getWidth()*$scale/100;
			$height=$this->getheight()*$scale/100;
			if(!$this->ignoreImageSize && $width>=$this->getWidth() && $height>=$this->getHeight())
			{
				return true;
			}
			else
			{
				$this->needChange(true);
				return $this->resize($width,$height);
			}
		}
		else
		{
			$args=func_get_args();$this->addAction(__FUNCTION__,$args);
			return true;
		}
	}

	public function resize($width,$height)
	{
		$width=$this->clearSize($width);
		$height=$this->clearSize($height);
		
		if(!$this->useCache)
		{
            $this->beforeImageManipulation();
			if($new_image=@imagecreatetruecolor($width,$height))
			{
				$trnprt_indx = imagecolortransparent($this->image);
				 				if ($trnprt_indx >= 0) {
					 					$trnprt_color    = imagecolorsforindex($new_image, $trnprt_indx);
					 					$trnprt_indx    = imagecolorallocate($new_image, $trnprt_color['red'], $trnprt_color['green'], $trnprt_color['blue']);				
					 					imagefill($new_image, 0, 0, $trnprt_indx);				
					 					imagecolortransparent($new_image, $trnprt_indx);
				}
				else
				{
					imagealphablending($new_image, false);
					imagesavealpha($new_image,true);
					$transparent = imagecolorallocatealpha($new_image, 255, 255, 255, 127);
					imagefilledrectangle($new_image, 0, 0, $width, $height, $transparent);
				}
				
				if(@imagecopyresampled($new_image,$this->image,0,0,0,0,$width,$height,$this->getWidth(),$this->getHeight()))
				{
					$this->image=$new_image;
                    $this->afterImageManipulation();
					return true;
				}
				else
				{
                    $this->afterImageManipulation();
					return false;
				}
			}
			else
			{
                $this->afterImageManipulation();
				return false;
			}
		}
		else
		{
			$args=func_get_args();$this->addAction(__FUNCTION__,$args);
            $this->afterImageManipulation();
			return true;
		}
	}
	
	public function crop($crop_width,$crop_height,$position=false)
	{
		$crop_width=$this->clearSize($crop_width);
		$crop_height=$this->clearSize($crop_height);
		
		if(!$this->useCache)
		{
			if($crop_width>$this->getWidth()){$crop_width=$this->getWidth();}
			if($crop_height>$this->getHeight()){$crop_height=$this->getHeight();}
			
			if($position)
			{
				if(is_string($position))
				{
					$left=0;
					$top=0;
					
					$ex=explode(' ',$position);
					if(substr_count($ex[0],'%')==0){$left=str_replace('px','',$ex[0]);$left=$left*-1;}
					else
					{
						$percent=(int)str_replace('%','',$ex[0]);
						if($percent>100){$percent=100;}
						$left=(($this->getWidth()-$crop_width)/100)*$percent;
					}
					
					if(!isset($ex[1])){$ex[1]=$ex[0];}
					if(substr_count($ex[1],'%')==0){$top=(int)str_replace('px','',$ex[1]);$top=$top*-1;}
					else
					{
						$percent=(int)str_replace('%','',$ex[1]);
						if($percent>100){$percent=100;}
						$top=(($this->getHeight()-$crop_height)/100)*$percent;
					}
				}
				else
				{
					$left=(($this->getWidth()-$crop_width)/2);
					$top=(($this->getHeight()-$crop_height)/2);
				}
			}
            $this->beforeImageManipulation();
			if($new_image=imagecreatetruecolor($crop_width, $crop_height))
			{
				$trnprt_indx = imagecolortransparent($this->image);
				 				if ($trnprt_indx >= 0) {
					 					$trnprt_color    = imagecolorsforindex($new_image, $trnprt_indx);
					 					$trnprt_indx    = imagecolorallocate($new_image, $trnprt_color['red'], $trnprt_color['green'], $trnprt_color['blue']);				
					 					imagefill($new_image, 0, 0, $trnprt_indx);				
					 					imagecolortransparent($new_image, $trnprt_indx);
				}
				else
				{
					imagealphablending($new_image, false);
					imagesavealpha($new_image,true);
					$transparent = imagecolorallocatealpha($new_image, 255, 255, 255, 127);
					imagefilledrectangle($new_image, 0, 0, $crop_width, $crop_width, $transparent);
				}
				
				if(imagecopy($new_image,$this->image,0,0,$left,$top,$this->getWidth(),$this->getHeight()))
				{
					$this->image=$new_image;
                    $this->afterImageManipulation();
					return true;
				}
				else
				{
                    $this->afterImageManipulation();
					return false;
				}
			}
			else
			{
                $this->afterImageManipulation();
				return false;
			}
		}
		else
		{
			$args=func_get_args();$this->addAction(__FUNCTION__,$args);
            $this->afterImageManipulation();
			return true;
		}
	}
	
	public function edit($width=false,$height=false,$crop=false,$fitDefinedBoxInside=false)
	{
		if($width && !$height)
		{
			return $this->resizeToWidth($width);
		}
		elseif(!$width && $height)
		{
			return $this->resizeToHeight($height);
		}
		elseif($width && $height)
		{
			if($crop || $fitDefinedBoxInside)
			{
				$position=false;
				if(is_string($crop)){$position=$crop;}
				if($res=$this->resizeToOverFit($width,$height))
				{
					if($crop)
					{
						return $this->crop($width,$height,$position);
					}
					else
					{
						return $res;
					}
				}
				return false;
			}
			else
			{
				return $this->resizeToFit($width,$height);
			}
		}
		return false;
	}
}
?>