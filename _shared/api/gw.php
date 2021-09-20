<?php

require_once SHAREDLIB_PATH . '/tools/crypt.php';

class IceWarpGWAPI
{
    private $pass;
    static public $instance;
         public $user, $authchallenge, $authscheme;
    public $sessid;
    public $groupsessid;
    public $grouplist;
    public $sException;
    public $identity;
    public $deviceid;

    static function instance($identity = 'com.icewarp.shared', $deviceid = '')
    {
        if (!isset(self::$instance)) {
            self::$instance = new IceWarpGWAPI();
            self::$instance->identity = $identity;
            self::$instance->deviceid = $deviceid;
        }
        return self::$instance;
    }

    public function getPassword()
    {
        return slToolsCrypt::decryptSymmetric($this->pass);
    }

    public function setPassword($password)
    {
        $this->pass = slToolsCrypt::encryptSymmetric($password);
    }

         public function FunctionCall($funcname, $param1 = "", $param2 = "", $param3 = "", $param4 = "", $param5 = "")
    {
        @$result = icewarp_calendarfunctioncall($funcname, $param1, $param2, $param3, $param4, $param5);
        return $result;
    }

    public function CreateParamLine($array)
    {
        $result = '';
        if (!is_array($array)) return $result;
        foreach ($array as $k => $v) $result .= $k . "=" . rawurlencode($v) . "&";
        return $result;
    }

    public function ParseParamLine($line)
    {
        if (!$line) return array();

        $lines = explode("\r\n", $line);

                 $fields = explode("&", strtoupper(trim($lines[0])));
        unset($lines[0]);

                 foreach ($lines as $row) {
            $row = trim($row);
            if (!$row) continue;
            $arow = explode("&", $row);

            foreach ($fields as $k => $field) {
                if ($field) $item[$field] = rawurldecode($arow[$k]);
            }
            $result[] = $item;
        }

        return $result;
    }

         function Login()
    {
        global $SERVER_NAME;

        if ($this->IsConnected()) return true;

                 if (!$this->authscheme) {
            $this->authscheme = 'PLAIN';
            $this->authchallenge = 'none';
        }
                 $this->sessid = $this->FunctionCall("authenticate", $this->user, $this->getPassword(), $SERVER_NAME, $this->authscheme . "|" . $this->authchallenge);
        if ($this->identity) {
            $this->FunctionCall("Introduce", $this->sessid, $this->identity, $this->deviceid);
        }
        return $this->sessid;
    }

    function Logout()
    {
        if ($this->sessid) $this->FunctionCall("logoutuser", $this->sessid);

        $this->sessid = null;
        $this->grouplist = null;
    }

    function IsConnected()
    {
        if ($this->sessid && $this->FunctionCall("userloggedon", $this->sessid)) return true;
        return false;
    }

    function GetFolderUpdate()
    {
        return $this->FunctionCall('GetFolderUpdate', $this->sessid);
    }

         function OpenGroup($groupid = "*")
    {
        if (!$groupid) $groupid = $this->grouplist[0]["GRP_ID"];
        return $this->FunctionCall("opengroup", $this->sessid, $groupid);
    }

    function CloseGroup($groupsessid)
    {
        return $this->FunctionCall("closegroup", $groupsessid);
    }

    function OpenFolder($groupsessid, $folder, $autosubscribe = false)
    {
        return $this->FunctionCall("openfolder", $groupsessid, $folder, $autosubscribe);
    }

    function CloseFolder($groupsessid)
    {
        return $this->CloseGroup($groupsessid);
    }

    function GetFolders($groupsessid)
    {
        return $this->ParseParamLine($this->FunctionCall("getfolderlist", $groupsessid));
    }

    function GetGroups($groupview = "")
    {
        if (!$this->sessid) {
            $this->sException = 'Call login first';
            return false;
        }

        if (is_array($this->grouplist)) return $this->grouplist;

        return $this->grouplist = $this->ParseParamLine($this->FunctionCall("getgrouplist", $this->sessid, $groupview));
    }

    function GetGroupSessid($groupid = "")
    {
        return $this->OpenGroup($groupid);
    }

    function GetGroupRights($groupsessid)
    {
        return $this->FunctionCall("GetGroupAccessRights", $groupsessid);
    }

         public static function unix2calendarDate($unixDate)
    {
        $arr = getdate(intval($unixDate));
        return GregorianToJD($arr["mon"], $arr["mday"], $arr["year"]);
    }

    public static function unix2calendarTime($unixDate)
    {
        $arr = getdate($unixDate);
        return $arr["hours"] * 60 + $arr["minutes"];
    }

    public static function calendar2unixTime($calendarDate, $calendarTime)
    {
        $date = JDToGregorian($calendarDate);
        preg_match("#([0-9]{1,2})/([0-9]{1,2})/([0-9]{4})#", $date, $regs);
        $month = $regs[1];
        $day = $regs[2];
        $year = $regs[3];
        if (intval($calendarTime) === -1) {
            $hour = 0;
            $min = 0;
        } else {
            $hour = floor($calendarTime / 60);
            $min = $calendarTime % 60;
        }

        $result = mktime($hour, $min, 0, $month, $day, $year);

                 if ($result === false || $result === -1) $result = '';

        return $result;
    }

    static public function encodeFolder($folder)
    {
        $folder = str_replace('/', '\\', $folder);
        return $folder;
    }

    static public function decodeFolder($folder)
    {
        $folder = str_replace('\\', '/', $folder);
        return $folder;
    }
}

 class MerakGWAPI extends IceWarpGWAPI{}

?>