<?php

class AlfrescoItem extends Item
{
     
    public $folder;
     
    public $item;
     
    public $sFields;
     
    public $aAddons;
     
    protected $filePath = null;
     
    public $itemID;

     
    public function __construct(AlfrescoFolder &$folder, array $item)
    {
        $this->itemID = $item['EVN_ID'];
        $this->item = $item;
        $this->folder = &$folder;
        $this->wmclass = 'ALFRESCO';
        $this->sFields = '<values>'.Tools::makeXMLTags($this->item).'</values>';
    }

     
    public function sendAttachment($partID,$startID,$ids = array())
    {
        $file = $this->getFilePath($ids['item_id']);
        $size = icewarp_file_get_size($file,true);
        slToolsFilesystem::sendFileHeaders($file, $size, 'application/octet-stream', false, 'inline');
        slToolsFilesystem::downloadFile($file,true);
    }

     
    public function getFilePath(string $id = null)
    {
        if(!empty($this->filePath)) return $this->filePath;
        $id = $id ?? $this->itemID;
        $dir = $_SESSION['user']->getUploadDir('Alfresco');
        $file =  Tools::randomFileName($dir.'/');
        $content = $this->folder->account->getItemContent($id);
        file_put_contents($file, $content);
        return $this->filePath = $file;
    }

     
    public function getAddons($type = false)
    {
        if ($this->aAddons) return $this->aAddons;
        $oAddon = array();
        $oAddon['attachment'] = new AlfrescoAddon($this, 'attachment');
        return $this->aAddons = $oAddon;
    }

     
    public function getAttachmentDataFile($part = null, & $info, $startPartId = null)
    {
        $file = $this->getFilePath();
        $info = [
            'name' => $this->item['EVNTITLE'],
            'size' => $this->item['EVNCOMPLETE'],
            'mimetype' => $this->item['EVNTYPE'],
        ];
        return $file;
    }

     
    public static function create(&$folder, $item = [], $itemTree = [], array $fileInfo = [])
    {
        return $folder->account->createItem($folder, $fileInfo['file'], $fileInfo['name']);
    }

     
    public static function createFile(&$folder, $filePath)
    {
        return $folder->account->createItem($folder, $filePath['filePath'], $filePath['fileName']);
    }

    public function openAccess() {}

    public function delete() {}

    protected function move($folder) {}

    public function getMessage() {}

    public function __destruct()
    {
        slToolsFilesystem::rmdir($_SESSION['user']->getUploadDir('Alfresco'));
    }
}