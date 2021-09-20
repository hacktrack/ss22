<?php

class slToolsCrypt
{
	static public function createHash()
	{
		return str_replace('e','z',uniqid());
	}

     
	public static function encryptSymmetric(string $target)
    {
        $api = IceWarpAPI::instance();
        return $api->FunctionCall("ManageConfig",'crypt/encrypt','',$target);
    }


     
    public static function decryptSymmetric($encrypted)
    {
        $api = IceWarpAPI::instance();
        return $api->FunctionCall('ManageConfig','crypt/decrypt','',$encrypted);
    }
}

?>