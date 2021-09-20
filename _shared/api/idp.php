<?php
require_once('abstract.php');

class IceWarpIDP extends iAPIInterface
{
	var $base;

	function __construct($basevalue = 0)
	{
		$this->apiID = 'IceWarpServer.IDP';
		$this->exc_id = 'api_idp';
		$this->function = 'icewarp_apiobjectcall_persistent';
		if (!$basevalue) {
			$this->_createBase();
		} else {
			$this->base = $basevalue;
		}
	}


	function AddFiles($archive, $path)
	{
		return icewarp_apiobjectcall_persistent($this->base, 'AddFiles', $archive, $path);
	}

	function AddFilesEx($archive, $path, $pass)
	{
		return icewarp_apiobjectcall_persistent($this->base, 'AddFilesEx', $archive, $path, $pass);
	}

	function ListFiles($archive)
	{
		return icewarp_apiobjectcall_persistent($this->base, 'ListFiles', $archive);
	}

	function RestoreFiles($archive, $path)
	{
		return icewarp_apiobjectcal_persistent($this->base, 'RestoreFiles', $archive, $path);
	}

	function RestoreFilesEx($archive, $path, $list = '', $pass = '')
	{
		return icewarp_apiobjectcall_persistent($this->base, 'RestoreFilesEx', $archive, $path, $list,
			$pass);
	}

	function CopyFile($source, $dest)
	{
		return icewarp_apiobjectcall_persistent($this->base, 'CopyFile', $source, $dest);
	}

	function DeleteFile($fname)
	{
		return icewarp_apiobjectcall_persistent($this->base, 'DeleteFile', $fname);
	}
}

?>