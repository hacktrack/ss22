<?php

slSystem::import('api/idp');
slSystem::import('tools/filesystem');

define ('ZIPCREATE', 0x0);
define ('ZIPOPEN', 0x1);

 

class slToolsZIP
{
	private $directory;
	private $idp;
	private $file;
	private $files;
	private $flags;
	private $tmp;
	 
    public $data;
	
	public function __construct()
	{
		$this->directory = false;
		$this->files = array();
		$this->data = array();
	}
	
	public function __destruct()
	{
		$this->cleanTemp();
	}
	
	public function open($file, $flags = ZIPCREATE)
	{
		if(($flags & ZIPOPEN) && !file_exists($file)){
			throw new Exception('Fatal error: slToolsZIP::open() file does not exist');
		}
		$this->file = $file;
		$this->flags = $flags;
		$this->idp = new IceWarpIDP();
		
		if ($this->flags & ZIPOPEN){
			$list = $this->idp->ListFiles($this->file);
			$list = rtrim(CRLF,$list);
			$list = explode(';',$list);
			$this->files = $list;
		}
	}
	
	public function close()
	{
		
		if(!$this->directory){
			throw new Exception('Fatal error: slToolsZIP::close() set working directory');
		}
		if(!is_dir($this->directory)){
			slToolsFilesystem::mkdir_r($this->directory);
		}
		$i=1;
		$names = array();
		 		if(is_array($this->data)){
			foreach($this->data as $data){
				$name = self::fixFileName($data['name']);
				if(isset($names[$name])){
					if(strpos($name,'.')!==false){
						$file = substr($name,0,strrpos($name,'.'));
						$ext = substr($name,strrpos($name,'.'));
					}else{
						$file = $name;
						$ext = '';
					}
					$names[$name]++;
					$name = $file.'('.($names[$name]-1).')'.$ext;
				}else{
					$names[$name] = 1;
				}
				$tempFile = $this->directory.$name;
				switch($data['type']){
					case 'string':
						slSystem::import('tools/icewarp');
						slToolsIcewarp::iw_file_put_contents($tempFile,$data['data'],true);
					break;
					case 'file':
						$this->idp->CopyFile(
							$data['location'],
							$tempFile
						);
					break;
				}
			}
		}
		 		$this->idp->AddFiles($this->file,$this->directory);
		$this->cleanTemp();
	}
	
	public function addFile($location,$name)
	{
		$file['name'] = $name;
		$file['location'] = $location;
		$file['type'] = 'file';
		$this->data[] = $file;
	}
	
	public function addFromString($name,$string)
	{
		$file['name'] = $name;
		$file['data'] = $string;
		$file['type'] = 'string';
		$this->data[] = $file;
	}
	
	public function listFiles()
	{
		return $this->files;
	}
	
	public function setTempDir($dir)
	{
		$this->directory = $dir;
	}
	
	public function getTempDir()
	{
		return $this->directory;
	}
	
	public function cleanTemp()
	{
		 		if(is_array($this->data)){
			foreach($this->data as $key => $data){
				$name = self::fixFileName($data['name']);
				$tempFile = $this->directory.$name.'.eml';
				$this->idp->DeleteFile($tempFile);
				unset($this->data[$key]);
			}
		}
	}
	
	public function fixFileName($filename)
	{
		$filename = str_replace(array('/','\\','?','*',':','|','"','<','>'),'',$filename);
		return $filename;
	}
}

?>