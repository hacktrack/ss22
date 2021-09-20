<?php

use server\inc\alfresco\Api;

include_once 'CurlEmu.php';

class AlfrescoAccount extends Account
{
     
    public $folderClassName;
     
    public $acc_type;
     
    public $aSyncedFolders;
     
    public $user;
     
    public $account;
     
    protected $url;
     
    protected $sso = false;
     
    public $username;
     
    protected $password;
     
    protected $api;
     
    public $folders = [];
     
    public $subfolders = [];
     
    public $syncTimeout;
     
    protected $disablePathLoading = false;

     
    public function __construct(string $url, string $token, bool $sso)
    {
        $this->syncTimeout = time()+900;
        $this->sso = $sso;
        $this->url = $url;
        $this->accountID = '@@alfresco@@';
        $this->api = new Api($this->url, $token, $this);
        $defaultFolderName = $this->api->getDefaultFolderName();
        $this->folders[$defaultFolderName] = new AlfrescoFolder($this, $defaultFolderName, $defaultFolderName, $defaultFolderName);
    }

     
    public function getFolders($parentFolderName = null, bool $disableReset = false)
    {
        if(!$this->api->connect()) throw new Exc(500, 'Unable to connect to Alfresco - ' . $this->api->getException()->getMessage());
        if(!$disableReset && $this->syncTimeout < time()) $this->subfolders = [];
        if(empty($parentFolderName)) $parentFolderName = $this->api->getDefaultFolderName();
        if(!isset($this->folders[$parentFolderName])){
            if($this->disablePathLoading) throw new Exc(404, 'Folder not found (' . $parentFolderName . ')');
            $this->loadFoldersByPath($parentFolderName);
        }
        $folder = $this->folders[$parentFolderName];
        if(isset($this->subfolders[$folder->folderID])) return $this->subfolders[$folder->folderID];

        $folders = $this->api->getFolders($folder);
        $this->folders = array_merge($this->folders, $folders);
        return $folders = $this->subfolders[$folder->folderID] = $folders;
    }

     
    public function loadFoldersByPath(string $path)
    {
        $this->getFolders(null, true);
                 $this->disablePathLoading = true;
        $currentPath = [];
        foreach (explode('/', $path) as $subPath) {
            $currentPath[] = $subPath;
            $this->getFolders(implode('/', $currentPath), true);
        }
        $this->disablePathLoading = false;
    }

     
    public function getFolderIfExists(string $name)
    {
        if(isset($this->folders[$name])) return $this->folders[$name];
        return null;
    }

     
    public function &getFolder($name, &$type = '', $logError = true, $allowDualHiddenFolder = false)
    {
        if(empty($name)) $name = $this->api->getDefaultFolderName();
        if(!isset($this->folders[$name])) $this->loadFoldersByPath($name);
        $result = $this->getFolderIfExists($name);
        if(!$result instanceof AlfrescoFolder) throw new Exc(404, 'Folder not found. (' . $name . ')');
        return $result;
    }

     
    public function getItemContent(string $id)
    {
        return $this->api->getFileContent($id);
    }

     
    public function getItem(AlfrescoFolder $folder, string $id)
    {
        if(!$this->api->connect()) throw new Exc(404, 'Unable to connect to Alfresco');
        return $this->api->getItem($folder, $id);
    }

     
    public function getItems(? AlfrescoFolder $folder, array $filter)
    {
        if(!$this->api->connect()) throw new Exc(404, 'Unable to connect to Alfresco');
        return $this->api->getItems($folder, $filter['orderby'], $filter['limit'], $filter['offset']);
    }

     
    public function handleCopyItemFrom(AlfrescoFolder $targetFolder, Item $item)
    {
        $allAttachmentFile = current($item->getAllAttachmentFiles());
        return $this->createItem($targetFolder, $allAttachmentFile['file'], $allAttachmentFile['name']);
    }

     
    public function createItem(AlfrescoFolder $targetFolder, string $file, string $name)
    {
        return $this->api->create($targetFolder, $file, $name);
    }

     
    public function sync($force_gw = false, $folders = array())
    {
        $this->subfolders = [];
        $this->folders = [];
        $defaultFolderName = $this->api->getDefaultFolderName();
        $this->folders[$defaultFolderName] = new AlfrescoFolder($this, $defaultFolderName, $defaultFolderName, $defaultFolderName);
    }

     
    public function countItems()
    {
        return $this->api->lastPagination->totalItems ?? 0;
    }
}