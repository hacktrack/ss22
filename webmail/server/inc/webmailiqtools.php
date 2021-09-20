<?php

 
class WebmailIqTools extends XMLRequestInterface
{
    private $sAID;      private $oAccount;      private static $aActions = array(
        'timezone' => 1,
        'delivery_report' => 1,
        'cancel_delivery' => 1,
        'distrib' => 1,
        'weather' => 1,
        'signature' => 1
    );

    public $oDOMQuery;
    public $oDOMTools;
    public $sAction;
    public $oDOMAccount;
    public $oDOMFolder;
    public $sFID;
    public $oFolder;
    public $oDOMItems;
    public $sAttId;
    public $aTools;
     
    public $oDOMDoc;
    public $sIID;
    public $getPartID;
    public $sPartID;
    public $bGetSingleItem;
    public $bGetAttach;

     
    public function __construct(DOMElement $oQuery, slToolsDOM &$oDoc, array &$attrs)
    {
        $this->oDOMQuery = $oQuery;
        $this->oDOMDoc = &$oDoc;
        $this->aAttrs = &$attrs;
        $this->loadUser();
        $this->checkInputXML();
        $this->exeInputXML();
    }

     
    private function checkInputXML() : bool
    {
                 if (!$this->oDOMTools = $this->oDOMDoc->getNode('tools:tools', $this->oDOMQuery)) {
            throw new Exc('upload_tag_missing', 'tag');
        }
        foreach ($this->oDOMDoc->query('/iq/tools:query/tools:tools/tools:*') as $oDOMTool) {
            $this->aTools[] = $oDOMTool;
        }
        return true;
    }

     
    private function exeInputXML()
    {
        if($this->aAttrs['type'] == 'get') return $this->exeGetInputXML();
        if($this->aAttrs['type'] == 'set') return $this->exeSetInputXML();
    }

    protected function exeSetInputXML()
    {
        foreach ($this->aTools as $oDOMTool) {
            $function = 'setAction' . str_replace('_', '', ucwords(strtolower($oDOMTool->nodeName), '_'));
            if(is_callable([$this, $function])) {
                call_user_func([$this, $function], $oDOMTool);
            }
        }
    }

    protected function exeGetInputXML()
    {
        $this->sTemplateFile = 'webmailiqtools_get';
        $sResponse = '';
        foreach ($this->aTools as $oDOMTool) {
            $function = 'getAction' . str_replace('_', '', ucwords(strtolower($oDOMTool->nodeName), '_'));
            if(is_callable([$this, $function])) {
                call_user_func_array([$this, $function], [$oDOMTool, &$sResponse]);
            }
        }
        $this->aData['response'] = $sResponse;
    }

     
    protected function getActionTimezone(DOMElement $oDOMTool, string & $sResponse)
    {
        $result = array();
        $source = $this->oDOMDoc->getNode('tools:source', $oDOMTool);
        $sourceType = $source->getAttribute('type');
        $sourceValue = $this->oDOMDoc->getNodeValue('tools:source', $oDOMTool);

        $dest = $this->oDOMDoc->getNode('tools:dest', $oDOMTool);
        $destType = $dest->getAttribute('type');
        $destValue = $this->oDOMDoc->getNodeValue('tools:dest', $oDOMTool);
        $times = array();
        foreach ($this->oDOMDoc->query('/iq/tools:query/tools:tools/tools:timezone/tools:times/tools:item') as $timeItem) {
            $time = array();
            $time['uid'] = $timeItem->getAttribute('uid');
            if ($time['uid'] != '') {
                $time['uidset'] = true;
            }
            $time['date'] = $this->oDOMDoc->getNodeValue('tools:date', $timeItem);
            $time['time'] = $this->oDOMDoc->getNodeValue('tools:time', $timeItem);
            $times[] = $time;
        }
        $oUser = $_SESSION['user'];
        $oAccount = $oUser->GetAccount($_SESSION['EMAIL']);
        if (!$oAccount->gwAccount) {
            throw new Exc('gw_initialization_failed');
        }
        $oGWAPI = &$oAccount->gwAccount->gwAPI;
        if ($times) foreach ($times as $time) {
            $aItem['EVNSTARTDATE'] = $time['date'];
            $aItem['EVNSTARTTIME'] = $time['time'];

            if($sourceType == 'ctz'){
                $aItem['EVNTIMEFORMAT'] = 'L';
                $aItem['CTZ'] = $sourceValue;
            }elseif($sourceType == 'tzid'){
                $aItem['EVNTIMEFORMAT'] = 'Z';
                $aItem['_TZID'] = $sourceValue;
            }
            $oGWAPI->TimeZone($aItem, 'in', false, false, true);
            unset($aItem['CTZ'], $aItem['_TZID']);
            if($destType == 'ctz'){
                $aItem['EVNTIMEFORMAT'] = 'L';
                $aItem['CTZ'] = $destValue;
            }elseif ($destType == 'tzid'){
                $aItem['EVNTIMEFORMAT'] = 'Z';
                $aItem['_TZID'] = $destValue;
            }
            $oGWAPI->TimeZone($aItem, 'out', false, false, true);
            $time['date'] = $aItem['EVNSTARTDATE'];
            $time['time'] = $aItem['EVNSTARTTIME'];

            $result['times'][] = $time;
        }
        $sResponse .= template('inc/templates/tools_timezone.tpl', $result);
    }

     
    protected function getActionDeliveryReport(DOMElement $oDOMTool, string & $sResponse)
    {
        foreach ($this->oDOMDoc->query('/iq/tools:query/tools:tools/tools:delivery_report/tools:message/tools:item') as $msgItem) {
            $item = array();
            $item['uid'] = $msgItem->getAttribute('uid');
            if ($item['uid'] != '') {
                $item['uidset'] = true;
            }
            $item['message_id'] = $this->oDOMDoc->getNodeValue('tools:message_id', $msgItem);
            $item['unix_time'] = $this->oDOMDoc->getNodeValue('tools:unix_time', $msgItem);
            $messages[] = $item;
        }
        $report = Tools::deliveryReport($messages);
        if (false === $report) {
            throw new Exc('delivery_report_failed');
        }
        $items['messages'] = $report;
        $items = Tools::htmlspecialchars_array($items);
        $sResponse .= template('inc/templates/tools_delivery_report.tpl', $items);
    }

     
    protected function getActionDistrib(DOMElement $oDOMTool, string & $sResponse)
    {
        $gw = new GroupWareManagement();
        $items = array();
        foreach ($this->oDOMDoc->query('/iq/tools:query/tools:tools/tools:distrib/tools:item') as $distribItem) {
            $item = array();
            $account = $this->oDOMDoc->getNode('tools:account', $distribItem);
            $accountID = $account->getAttribute('uid');
            $folder = $this->oDOMDoc->getNode('tools:folder', $account);
            $folderID = $folder->getAttribute('uid');
            $oAccount = $_SESSION['user']->getAccount($accountID);
            $oFolder = $oAccount->getFolder($folderID);
            $item['name'] = $this->oDOMDoc->getNodeValue('tools:name', $folder);
            $contacts = $gw->getDistributionListItems($item['name'], $oFolder);
            if (is_array($contacts) && !empty($contacts)) {
                foreach ($contacts as $contact) {
                    $item['contacts'][] = array(
                        'address' => $contact['LCTEMAIL1'],
                        'name' => $contact['LCTDESCRIPTION']
                    );
                }
            }
            $items['items'][] = $item;
        }
        $items = Tools::htmlspecialchars_array($items);
        $sResponse .= template('inc/templates/tools_distribution_list.tpl', $items);
    }

     
    protected function getActionWeather(DOMElement $oDOMTool, string & $sResponse)
    {
        $oUser = $_SESSION['user'];
        $oAccount = $oUser->GetAccount($_SESSION['EMAIL']);
        $items = array();
        foreach ($this->oDOMDoc->query('/iq/tools:query/tools:tools/tools:weather/tools:item') as $weatherItem) {
            $city = $this->oDOMDoc->getNodeValue('tools:city', $weatherItem);
            if (Storage::checkCityWeather($oAccount->gwAccount, $city, 'weather', $info, true)) {
                $items['items'] = $info;
            }
                         break;
        }
        $items = Tools::htmlspecialchars_array($items);
        $sResponse .= template('inc/templates/tools_weather.tpl', $items);
    }

     
    protected function getActionTicket(DOMElement $oDOMTool, string & $sResponse)
    {
        $oUser = User::load($this->aAttrs['sid']);
                 if (!$this->oDOMAccount = $this->oDOMDoc->getNode("tools:account", $oDOMTool)) {
            throw new Exc('item_missing_tag', 'account');
        }
                 if (!$this->sAID = $this->oDOMAccount->getAttribute("uid")) {
            throw new Exc('item_missing_account_id');
        }
                 if (!($this->oAccount = $oUser->getAccount($this->sAID))) {
            throw new Exc('item_invalid_account_id');
        }
                 if (!$this->oDOMFolder = $this->oDOMDoc->getNode("tools:folder", $this->oDOMAccount)) {
            throw new Exc('item_missing_tag', 'folder');
        }
                 if (!$this->sFID = $this->oDOMFolder->getAttribute("uid")) {
            throw new Exc('item_missing_folder_id');
        }
         
        $this->oFolder = WebmailIqItems::checkFolder($this->oAccount, $this->sFID);

         
                 $this->oDOMItems = array();
        $this->sAttId = false;
        $this->oDOMItems = array();
        foreach ($this->oDOMDoc->query('/iq/tools:query/tools:tools/tools:ticket/tools:account/tools:folder/tools:item') as $item) {
            $this->oDOMItems[] = $item;
        }
                 $oDOMItem = null;
        if (isset($this->oDOMItems[0]) && ($oDOMItem = $this->oDOMItems[0]) && $this->sIID = $oDOMItem->getAttribute("uid")) {
            if (($pos = strpos($this->sIID, '|')) !== false) {
                $this->getPartID = true;
                $this->sPartID = substr($this->sIID, $pos + 1);
                $this->sIID = substr($this->sIID, 0, $pos);
                $this->aData['partid'] = $this->sPartID;
            }
            $this->sPartID = $this->sPartID ? $this->sPartID : 1;
            $this->bGetSingleItem = true;
            if ($this->sAttId = $oDOMItem->getAttribute("atid")) {
                $this->bGetAttach = true;
            }
        }

        if ($oDOMItem) {
            $uid = $oDOMItem->getAttribute('uid');
            $aid = false;
            if ($oDOMAttachment = $this->oDOMDoc->getNode('tools:attachment', $oDOMItem)) {
                $aid = $oDOMAttachment->getAttribute('uid');
            }
            $rights = 'rl';
            if ($oDOMRights = $this->oDOMDoc->getNode('tools:rights', $oDOMItem)) {
                $rights = $oDOMRights->nodeValue;
            }
            $rights = Folder::rightsToBitValue($rights);
            $oItem = $this->oFolder->getItem($uid);
            $url = $oItem->getPublicUrl($aid, $rights);
            $sResponse .= '<ticket>' . slToolsPHP::htmlspecialchars($url) . '</ticket>';
        }
    }

     
    protected function getActionQuota(DOMElement $oDOMTool, string & $sResponse)
    {
        $accounts = [];
        foreach ($this->oDOMDoc->query('/iq/tools:query/tools:tools/tools:quota/tools:item/tools:account') as $item) {
            $accounts[] = $item->nodeValue;
        }

        $account = createobject('account');
        if(!$accounts) return;
        foreach ($accounts as $acc) {
            $quota = 0;
            $size = 0;
            $account->Open($acc);
            $quota = $account->GetProperty("U_MailboxQuota");
            if ($quota) {
                $size = $account->GetProperty("U_MailboxSize");
            }
            $sResponse .= '<quota><item uid="' . htmlspecialchars($acc) . '">';
            $sResponse .= '<quota>' . $quota . '</quota>';
            $sResponse .= '<size>' . $size . '</size>';
            $sResponse .= '</item></quota>';
        }
    }

     
    protected function getActionSignature(DOMElement $oDOMTool, string & $sResponse)
    {
        $signatures = array();
        foreach ($this->oDOMDoc->query('/iq/tools:query/tools:tools/tools:signature/tools:item') as $signature) {
            $s = array();
            $s['id'] = $signature->getAttribute("uid");
            $s['value'] = $signature->nodeValue;
            $signatures[] = $s;
        }
        if (!$signatures) return;

        $sResponse .= '<signature>';
        $oUser = User::load($this->aAttrs['sid']);
        $oAccount = $oUser->getAccount($_SESSION['EMAIL']);
        foreach ($signatures as $signature) {
            if ($signature['value']) {
                $signatureValue = $signature['value'];
            } else {
                if ($signature['id'] == '__@@GLOBAL@@__' || $signature['id'] == '') {
                    $signatureValue = Storage::getDefaults('signature');
                } else {
                    $domain = $signature['id'];
                    $signatureGlobalValue = Storage::getDefaults('signature');
                    $signatureDomainValue = Storage::getDomainDefaults('signature', $domain);
                    $signatureValue = WebmailIqPublic::get('signature', $signatureGlobalValue, $signatureDomainValue, false, 2);
                }
                $signatureValue = $signatureValue["@childnodes"]["item"][0]["@childnodes"]["text"][0]['@value'];
            }
            $signatureValue = Storage::translateSignature($oAccount->gwAccount, $signatureValue);

            $sResponse .= '<item uid="' . slToolsPHP::htmlspecialchars($signature['id']) . '">' . slToolsPHP::htmlspecialchars($signatureValue) . '</item>';
        }
        $sResponse .= '</signature>';
    }

     
    protected function setActionPersonality(DOMElement $oDOMTool)
    {
        $email = $this->oDOMDoc->getNodeValue('tools:email', $oDOMTool);
        $name = $this->oDOMDoc->getNodeValue('tools:name', $oDOMTool);
        $isdelegate = $this->oDOMDoc->getNodeValue('tools:isdelegate', $oDOMTool);

        $aAction['data'] = array(
            'name' => $name,
            'email' => $email,
            'isdelegate' => $isdelegate
        );
        $aAction['dataTree']['@childnodes']['name'][0]['@value'] = $name;
        $aAction['dataTree']['@childnodes']['email'][0]['@value'] = $email;
        $aAction['dataTree']['@childnodes']['isdelegate'][0]['@value'] = $isdelegate;
        $aAction['action'] = 'add';
        $aActions[] = $aAction;
        $return = Storage::getUserData();
        $settings['aliases_data'] = Storage::setAliases($aActions, $return['@childnodes']['aliases_data']);
        foreach ($settings as $key => $value) {
            $return['@childnodes'][$key][0] = $value;
        }
        $return = Tools::makeXMLStringFromTree($return, 'settings', true);
        Storage::setUserDataStr($return, 'settings');
        $string = Tools::makeXMLStringFromTree($settings['aliases_data']['@childnodes']['item'][$email], 'personality', true);
        $this->sTemplateFile = 'webmailiqtools_get';
        $this->aData['response'] .= $string;
    }

     
    protected function setActionTelemetry(DOMElement $oDOMTool)
    {
        $api = createobject('api');
        $telemetry_data = '';

        $ignore = array('ctrl', 'shift', 'count');
        foreach ($this->oDOMDoc->query('/iq/tools:query/tools:tools/tools:telemetry/tools:click') as $oDOMClick) {
            $inner_data = array();
            foreach ($this->oDOMDoc->query('*', $oDOMClick) as $elm) {
                if (!in_array(strtolower($elm->tagName), $ignore)) {
                    $inner_data[] = strtolower($elm->tagName) . '=' . $elm->nodeValue;
                }
            }
            $count = $this->oDOMDoc->getNodeValue('tools:count', $oDOMClick);
            $telemetry_data .= urlencode(join('&', $inner_data)) . '&' . $count . "\r\n";
        }
        $api->ManageConfig('system/pipe', 'add', 'servicetype=2&commandid=4112&name=sendstats&param1=' . urlencode($telemetry_data));
    }

     
    protected function setActionCancelDelivery(DOMElement $oDOMTool)
    {
        foreach ($this->oDOMDoc->query('/iq/tools:query/tools:tools/tools:cancel_delivery/tools:message/tools:item') as $msgItem) {
            $item = array();
            $item['uid'] = $msgItem->getAttribute('uid');
            if ($item['uid'] != '') {
                $item['uidset'] = true;
            }
            $item['message_id'] = $this->oDOMDoc->getNodeValue('tools:message_id', $msgItem);
            $item['unix_time'] = $this->oDOMDoc->getNodeValue('tools:unix_time', $msgItem);
            $messages[] = $item;
        }
        Tools::cancelDelivery($messages);
        $this->sTemplateFile = 'xmlrequest_iq_default';
    }
}
?>
