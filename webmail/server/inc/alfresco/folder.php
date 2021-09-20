<?php

class AlfrescoFolder extends Folder
{
     
    public $account;
     
    public $subfolders;
     
    public $baseName;
     
    public $folderID;
     
    public $itemClassName;
     
    public $defaultRights;

     
    public function __construct(AlfrescoAccount $account, string $name, string $baseName, string $folderID)
    {
        $this->account = &$account;
        $rights = Folder::RIGHT_READ;
        $rights |= Folder::RIGHT_MODIFY;
        $rights |= Folder::RIGHT_DELETE;
        $rights |= Folder::RIGHT_FOLDER_READ;
        $this->defaultRights = $rights;
        $this->rights = $rights;
        $this->folderID = $folderID;
        $this->name = $name;
        $this->baseName = $baseName;
        $this->itemClassName = 'AlfrescoItem';
        $this->type = 'F';
    }

    public function sync()
    {
        $this->account->sync();
    }

     
    public function getSubfolders()
    {
        return $this->subfolders = $this->account->getFolders($this->name);
    }

     
    public function getItem($itemID, $cache = array())
    {
        return $this->account->getItem($this, $itemID);
    }

     
    public function getItems(&$aFilterTag = array(), $createObject = true, $ignoreHidden = true)
    {
        return $this->account->getItems($this, $aFilterTag);
    }

     
    public function handleCopyItemFrom(Item $item)
    {
        return $this->account->handleCopyItemFrom($this, $item);
    }

     
    public function getItemClass()
    {
        return AlfrescoItem::class;
    }

     
    public function createItem($aItem, $aTreeItem = [])
    {
        if(is_array($aTreeItem)){
            foreach ($aTreeItem['@childnodes']['attachments'] as $attachment) {
                $fullPath = $attachment['@childnodes']['attachment'][0]['@childnodes']['values'][0]['@childnodes']['fullpath'][0]['@value'];
                $parsedPath = Tools::parseFullPath($fullPath, 'attachment');
                $account = $_SESSION['user']->getAccount($parsedPath['account']);
                 
                $folder = $account->getFolder($parsedPath['folder']);
                $item = $folder->getItem($parsedPath['item']);
                return [$this->account->handleCopyItemFrom($this, $item)];
            }
        }elseif($aItem instanceof IMAPItem){
            $subject = str_replace(' ', '_', $aItem->subject);
            $subject = preg_replace('/[^A-Za-z0-9\-\._\(\)]/', '', $subject);
            $fileNamePrefix = substr($subject,0,40) . '-';
            $fileName = $fileNamePrefix . pathinfo($aTreeItem, PATHINFO_FILENAME) . '.eml';
            $aTreeItem = ['filePath' => $aTreeItem, 'fileName' => $fileName];
        }
        return $this->createItemFile($aItem,$aTreeItem);
    }

     
    public function countItems($flags = 0)
    {
        return $this->account->countItems();
    }

     
    public function copyItems(&$oFolder, $oItems = [], $cache = null)
    {
         
        $user = $_SESSION['user'];
         
        foreach ($oItems as $oItem) {
                         $account = $user->getAccount($oFolder->account->account->accountID);
             
            $folder = $account->getFolder($oFolder->name);

            $user->addFileAttachment($oItem->getFilePath(), $oItem->item['EVNTITLE'], $oItem->item['EVNTYPE'], '@@alfresco@@/' . $oItem->folder->name, $oItem->itemID);
            $filePath = '@@alfresco@@/' . $oItem->folder->name . '/' . $oItem->itemID;
            $dom = new slToolsDOM();
            $dom->loadXML( '<item action="add" duplicity="rename"><attachments><attachment><values><class>file</class><description>'. $oItem->item['EVNTITLE'].'</description><size>'.$oItem->item['EVNCOMPLETE'].'</size><fullpath>'.$filePath.'</fullpath></values></attachment></attachments></item>');
            $aTreeItem = Tools::makeTreeFromXML($dom->getElementsByTagName('item')[0],false);
            $folder->createItem([], $aTreeItem);
            unlink($oItem->folder->name . '/' . $oItem->itemID);
        }
    }

    public function openAccess(){}

    protected function delete(){}

    protected function rename($newName){}

    public function deleteItems($oItems = false){}

    public function moveItems(&$oFolder, $oItems = false){}

    public function setDefault($type, $updateSettings = true){}

    public function setSubscription($state){}

    public function setNotify($bValue){}

    public function setChannels($mailbox, $channels, $encoded = false){}
}