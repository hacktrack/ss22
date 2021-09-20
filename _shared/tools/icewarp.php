<?php

 
class slToolsIcewarp
{
	
	static public function iw_copy($source,$dest,$failIfExist = 0)
	{
		$api = IceWarpAPI::instance('Shared/Tools/IceWarp');
		return $api->CopyFileWithUpdate($source,$dest,$failIfExist);
	}
	static public function iw_move($source,$dest)
	{
		$api = IceWarpAPI::instance('Shared/Tools/IceWarp');
		return $api->MoveFileWithUpdate($source,$dest);
	}
	static public function iw_delete($file)
	{
		$api = IceWarpAPI::instance('Shared/Tools/IceWarp');
		return $api->DeleteFileWithUpdate($file);
	}
	static public function iw_index($file)
	{
		$api = IceWarpAPI::instance('Shared/Tools/IceWarp');
		return $api->CacheFileWithUpdate($file);
	}
	static public function iw_copy_dir($source,$dest)
	{
		$api = IceWarpAPI::instance('Shared/Tools/IceWarp');
		return $api->CopyDirRecWithUpdate($source,$dest);
	}
	static public function iw_move_dir($source,$dest)
	{
		$api = IceWarpAPI::instance('Shared/Tools/IceWarp');
		return $api->MoveDirWithUpdate($source,$dest);
	}
	static public function iw_delete_dir($dir)
	{
		$api = IceWarpAPI::instance('Shared/Tools/IceWarp');
		return $api->DeleteDirRecWithUpdate($dir);
	}
	static public function iw_index_dir($dir)
	{
		$api = IceWarpAPI::instance('Shared/Tools/IceWarp');
		return $api->CacheDirWithUpdate($dir);
	}
	
	static public function iw_file_put_contents($file,$contents, $flags = NULL)
	{
		$index = true;
		if(file_exists($file)){
			$index = false;
		}
		$result = icewarp_file_put_contents($file,$contents,$flags);
		if($index){
			$result = $result && self::iw_index($file);
		}
		return $result;
	}
	
	static public function my_icewarp_getlock($lock_id)
	{
		$result = icewarp_getlock($lock_id);
		if(defined('APP_LOGGING_METHOD')){
			call_user_func_array( APP_LOGGING_METHOD, array(0=>"Aquire lock: ".$lock_id." : ".$result,1=>"EXTENDED"));
		}
		return $result;
	}
	
	static public function my_icewarp_releaselock($lock_id)
	{
		$result = icewarp_releaselock($lock_id);
		if(defined('APP_LOGGING_METHOD')){
			call_user_func_array( APP_LOGGING_METHOD, array(0=>"Release lock: ".$lock_id." : ".$result,1=>"EXTENDED"));
		}
		return $result;
	}
}
?>