<?php

class AlfrescoAddon extends GroupWareAddon
{
    protected static $aAddonTypes = array('attachment' => 7,);

    protected static $aAddonTags = array(7 => 'attachments',);

    protected static $aPrefixes = array(7 => '',);

    protected static $aGetFunctions = array(7 => 'getattachmentlist',);

    protected static $aSetFunctions = array(7 => 'addattachment',);

    protected static $aRemoveFunctions = array(7 => 'deleteattachments',);

    protected $convertNote = false;

    public function __construct(AlfrescoItem &$oItem, $sAddonType, $sParentID = false)
    {
        $this->sParentID = $sParentID;
        $this->sAddonType = $sAddonType;
        $this->AddonTypeID = self::$aAddonTypes[$sAddonType];
        $this->item = &$oItem;
        $this->convertNote = false;
    }


    public function getData($param = null, $ctz = 0)
    {

        $oAccount = &$this->item->folder->account;

        $sFID = $this->item->folder->openAccess();

        if ($this->sParentID) $itemID = $this->sParentID; else
            $itemID = $this->item->itemID;

        $result = $oAccount->gwAPI->FunctionCall(self::$aGetFunctions[$this->AddonTypeID], $sFID, $itemID, $param);

        $result = $oAccount->gwAPI->ParseParamLine($result);
        if (isset($result[0])) {
            return $result;
        }

        return false;
    }

     
    public function create($aData, $sParentID = false, &$currentData = false, $ctz = false)
    {
        $attData = Tools::parseFullPath($aData['fullpath'], $aData['class']);
        $attachItems = $_SESSION['user']->getAttachments($this->item->folder);
        $attachItem = $attachItems[$attData['item']];

        $attID = $this->attachFile($aData['file'], $attachItem['name'], $attachItem['type'], '', 'P',$aData['description']);

        $result['id'] = $attID;
        return $result;
    }

     
    public function delete($sAID, $sParentID = false, &$currentData = false)
    {
        if (!$sParentID) {
            $sParentID = $this->item->itemID;
        }
        $oAccount = &$this->item->folder->account;

        $data = array();
        if ($currentData) {
            foreach ($currentData as $attachment) {
                if ($attachment['ATTNAME'] == $sAID) {
                    $data = $attachment;
                }
            }
        }
        if ($data['ATTTYPE'] == 'P') {
            $avatarFile = $_SESSION['CONFIGPATH'] . '_webmail/photo/' . $_SESSION['EMAIL'] . '.jpg';
            $avatarFileXML = $_SESSION['CONFIGPATH'] . '_webmail/photo/' . $_SESSION['EMAIL'] . '.xml';
            if (file_exists($avatarFile)) {
                unlink($avatarFile);
            }
            if (file_exists($avatarFileXML)) {
                unlink($avatarFileXML);
            }
        }

        $sFID = $this->item->openAccess();
        $result = $oAccount->gwAPI->FunctionCall(self::$aRemoveFunctions[$this->AddonTypeID], $sFID, $sParentID, $sAID);
        return $result;
    }

     
    public function edit($aData, $sAid, $sParentID = false, &$aCurrentData = false, $ctz = false)
    {
        $result = $this->editAttachment($sAid, $aData);
        return $result;
    }


    public function process($aTreeItem)
    {
        $fileDataSet = false;
        $fileData = '';
        if (($this->item->folder->getType() == 'F' || $this->item->folder->getType() == 'I') && isset($aTreeItem['@childnodes']['values'][0]['@childnodes']['data'][0]['@value'])) {
            $fileData = $aTreeItem['@childnodes']['values'][0]['@childnodes']['data'][0]['@value'];
            $fileData = slToolsString::lf2crlf($fileData);
            $fileDataSet = true;
        }
                 $this->aFolderList = array();

        $aSentData = $this->getSentData($aTreeItem);

                 $dl = $this->sAddonType == 'location' && ($this->item->item['ITMCLASS'] == 'L');
        $counter = 0;
        $ctz = $aTreeItem['@childnodes']['values'][0]['@childnodes']['ctz'][0]['@value'];
        $result = false;
        if ($aSentData) {
            $currentData = false;
            foreach ($aSentData as $aData) {
                switch ($aData['action']) {
                                         case 'add':
                                                 if ($dl) {
                            if ($counter) $aData['data']['lcttype'] = 'L';
                            $counter++;
                        }
                        $result = $this->create($aData['data'], false, $currentData, $ctz);
                        break;

                                         case 'edit':
                        $result = $this->edit($aData['data'], $aData['id'], false, $currentData, $ctz);
                        break;

                                         case 'delete':
                        if ($this->item->folder->name == '@@mycard@@') {
                            $currentData = $this->getData();
                        }
                        $result = $this->delete($aData['id'], false, $currentData);
                        break;
                }

            }
        } else {
            $currentData = false;
        }

                 if ($dl) {
                         $aLocations = $this->getData('LCTTYPE=\'O\'');
                         if (!$aLocations) $aLocations = $this->getData();
            $counter = 0;
            if ($aLocations) foreach ($aLocations as $location) {
                                 if (!$counter) $lcttype = 'O'; else
                    $lcttype = 'L';
                                 if ($location['LCTTYPE'] != $lcttype) {
                    $location['LCTTYPE'] = $lcttype;
                    $this->edit($location, $location['LCT_ID']);
                }
                $counter++;
            }
        }
        if ($fileDataSet && ($this->item->folder->getType() == 'F' || $this->item->folder->getType() == 'I') && $this->sAddonType == 'attachment') {
            $data = $this->getData();
            if (is_array($data) && !empty($data)) {
                $attachment = reset($data);
                $name = $attachment['ATTDESC'] ? $attachment['ATTDESC'] : $attachment['ATTNAME'];
                $ext = substr($name, strrpos($name, '.') + 1);
                $newData['class'] = 'raw';
                $newData['fullpath'] = $fileData;
                $result = true;
                switch (strtolower($ext)) {
                    case 'txt':
                    case 'htm':
                    case 'html':
                        $result = $this->editAttachment($attachment['ATTNAME'], $newData);
                        break;
                }
            }
        }
        return $result;
    }

     
    public function getXML($ctz = 0)
    {
        $data = $this->getData(null, $ctz);

                 if (($data[0]['note_text'] ?? false) && true === $this->convertNote) {
            if ($this->isFormatHtml($this->item->item['EVNDESCFORMAT'])) {
                $data[0]['note_text'] = slToolsString::purifyHTML($data[0]['note_text'], Tools::externalResourcesEnabled());
            } elseif ($this->isFormatPlainText($this->item->item['EVNDESCFORMAT'])) {
                $data[0]['note_text'] = slToolsString::textLinksToHTML($data[0]['note_text']);
            }
        }

                 if (false === $data && true === $this->convertNote) {
            if ($this->isFormatHtml($this->item->item['EVNDESCFORMAT'])) {
                $this->item->item['EVNNOTE'] = slToolsString::purifyHTML($this->item->item['EVNNOTE'], Tools::externalResourcesEnabled());
            }
        }

                 if (false === $data && true === $this->convertNote) {
            if ($this->isFormatHtml($this->item->item['ITMDESCFORMAT'])) {
                $this->item->item['ITMDESCRIPTION'] = slToolsString::purifyHTML($this->item->item['ITMDESCRIPTION'], Tools::externalResourcesEnabled());
            }
        }

        $sReturn = '';
        if ($data) foreach ($data as $item) {
                         switch ($item['ATTTYPE']) {
                case 'T':
                    $item['ATTTYPE'] = 'thumbnail';
                    break;
                case 'D':
                    $item['ATTTYPE'] = 'pdf';
                    break;
                case 'I':
                    $item['ATTTYPE'] = 'itemlink';
                    break;
                case 'U':
                    $item['ATTTYPE'] = 'url';
                    break;
                case 'P':
                    $item['ATTTYPE'] = 'P';
                    break;
                case 'F':
                default:
                    $item['ATTTYPE'] = 'attachment';
                    break;
            }
            $item['TICKET'] = $this->getAttachmentFile($item['ATTNAME'], 'TICKET');
            if (!$this->ticket) {
                $this->ticket = $item['TICKET'];
            }
            if (!$this->inviteTicket) {
                $item['INVITETICKET'] = $this->getAttachmentFile($item['ATTNAME'], 'INVITETICKET');
                $this->inviteTicket = $item['INVITETICKET'];
            }
            if ($this->item->folder->getType() == 'F' && $this->item->item['EVNCOMPLETE'] == 0) {
                $this->item->edit(array('evncomplete' => $item['ATTSIZE']), array(), false, false, false);
            }
            @$sID = slToolsPHP::htmlspecialchars($item['ATTNAME']);
            $sStart = '<' . $this->sAddonType . '' . ($sID ? (' uid="' . $sID . '"') : ('')) . '>';
            $sValue = Tools::makeXMLTags($item);
            $sEnd = '</' . $this->sAddonType . '>';
            $sValue = '<values>' . $sValue . '</values>';
            $sReturn .= $sStart . $sValue . $sEnd;
        }

        if ($sReturn !== '') {
            $sReturn = '<' . self::$aAddonTags[$this->AddonTypeID] . '>' . $sReturn . '</' . self::$aAddonTags[$this->AddonTypeID] . '>';
        }

        return $sReturn;
    }
}
?>