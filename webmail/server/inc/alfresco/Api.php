<?php

namespace server\inc\alfresco;

class Api
{
     
    protected $url;
     
    protected $user;
     
    protected $password;
     
    protected $authorization = null;
     
    protected $account;
     
    public $lastPagination = null;
     
    protected $cookies;
         protected $tokenPrefix = 'Bearer';
    protected $exception;

     
    public function __construct(string $url, string $token, \AlfrescoAccount $account)
    {
                 if (!function_exists('curl_init')) include_once __DIR__ . '/CurlEmu.php';
        $this->url = $url;
        $this->account = $account;
        $this->tokenPrefix = $token;
    }

    public function curlResponseHeaderCallback($ch, $headerLine) {
        if (preg_match('/^Set-Cookie:\s*(?P<key>[^=;]+)?=?(?P<value>[^;]*)/mi', $headerLine, $match)){
            $this->cookies[$match['key'] ?? (count($this->cookies))] = $match['value'];
        }
        return strlen($headerLine);      }

     
    protected function getData(string $method, string $url, array $params = [], bool $plain = false)
    {
        $headers = ['Accept' => 'Accept: application/json'];
        if(!empty($this->authorization)){
            $headers['Authorization'] = 'Authorization: ' . $this->authorization;
        }else{
            $headers['Authorization'] = 'Authorization: Basic ' . base64_encode($params['userId'] . ":" . $params['password']);
        }

        $ch = curl_init($this->url . $url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        if($method == 'POST'){
            $dataString = json_encode($params);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $dataString);
            $headers['Content-Length'] = 'Content-Length: ' . strlen($dataString);
            $headers['Content-Type'] = 'Content-Type: application/json';
        }elseif($method == 'GET'){
            $getParams = http_build_query($params);
            curl_setopt($ch, CURLOPT_URL, $this->url . $url . '?' . $getParams);
        }elseif ($method == 'FILE'){
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
            curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
        }
        if(!empty($this->cookies)){
            foreach ($this->cookies as $key => $value) {
                $headers[] = 'Cookie: ' . (is_numeric($key) ? '' : $key . '=') . $value;
            }
        }
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
        curl_setopt($ch, CURLOPT_ENCODING, '');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_HEADERFUNCTION, [&$this, 'curlResponseHeaderCallback']);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
        curl_setopt($ch, CURLOPT_MAXREDIRS, 10);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);

        $serverOutput = curl_exec($ch);
        curl_close($ch);
        if($plain) return $serverOutput;
        $data = json_decode($serverOutput);

        if(!$data instanceof \stdClass){
            throw new \Exc(500, 'No data');
        }
        if(isset($data->error)){
                         if($data->error->statusCode == 401){
                $this->authorization = null;
                if($this->connect()) return $this->getData($method, $url, $params, $plain);
            }
            $this->handleError($data->error);
        }
        if(isset($data->list->pagination)){
            $this->lastPagination = $data->list->pagination;
        }
        return $data;
    }

     
    public function connect()
    {
        try {
            if(!empty($this->authorization)) return true;
             
            $user = $_SESSION['user'];
            $data = $this->getData('POST', '/-default-/public/authentication/versions/1/tickets', ['userId' => current(explode('@', $user->username, 2)), 'password' => $user->getPassword()]);
            $id = $data->entry->id;
            if($this->tokenPrefix == 'Basic') $id = base64_encode($id);
            $this->authorization = $this->tokenPrefix . ' ' . $id;
            return true;
        }catch (\Exception $e){
            $this->exception = $e;
            return false;
        }

    }

     
    protected function handleError(\stdClass $error)
    {
        throw new \Exc($error->statusCode, $error->briefSummary);
    }

     
    public function getDefaultFolderName()
    {
        return '-root-';
    }

     
    public function getFolders(\AlfrescoFolder $folder, $limit = 0, $offset = 0)
    {
        $result = [];
        $params = $this->getParamsFromPaging($limit, $offset);
        $params['where'] = '(isFolder=true)';
        $params['orderBy'] = 'name';
        $data = $this->getData('GET', '/-default-/public/alfresco/versions/1/nodes/' . $folder->folderID . '/children', $params);
        foreach ($data->list->entries as $item) {
            if(!$item->entry->isFolder) continue;
            $baseName = $item->entry->name;
            $name = ($folder->name == $this->getDefaultFolderName()) ? $item->entry->name : $folder->name . '/' . $item->entry->name;
            $entry = new \AlfrescoFolder($this->account, $name, $baseName, $item->entry->id);
            $result[$name] = $entry;
        }
        return $result;
    }

     
    protected function getItemFromEntry(\stdClass $entry)
    {
        return [
            'EVN_ID' => $entry->id,
            'EVNCLASS' => 'F',
            'EVNTITLE' => $entry->name,
            'EVNLOCATION' => $entry->name,
            'EVN_MODIFIED' => strtotime($entry->modifiedAt),
            'EVN_CREATED' => strtotime($entry->createdAt),
            'EVNCOMPLETE' => $entry->content->sizeInBytes,
        ];
    }

     
    protected function getParamsFromPaging(int $limit, int $offset)
    {
        $params = [];
        if($limit > 0) $params['maxItems'] = $limit;
        if($offset > 0) $params['skipCount'] = $offset;
        return $params;
    }

     
    public function getItems(? \AlfrescoFolder $folder, string $orderBy = '', int $limit = 0, int $offset = 0)
    {
        if(!$folder instanceof \AlfrescoFolder){
            $folder = new \AlfrescoFolder($this->account, 'Alfresco', $this->getDefaultFolderName(), $this->getDefaultFolderName());
        }

        $result = [];
        $params = $this->getParamsFromPaging($limit, $offset);
        $params['where'] = '(isFile=true)';
        $data = $this->getData('GET', '/-default-/public/alfresco/versions/1/nodes/' . $folder->folderID . '/children', $params);
        foreach ($data->list->entries as $item) {
            if(!$item->entry->isFile) continue;
            $result[] = new \AlfrescoItem($folder, $this->getItemFromEntry($item->entry));
        }
        return $result;
    }

     
    public function getItem(\AlfrescoFolder $folder, string $id)
    {
        $data = $this->getData('GET', '/-default-/public/alfresco/versions/1/nodes/' . $id);
        if(!$data->entry->isFile) return null;
        return new \AlfrescoItem($folder, $this->getItemFromEntry($data->entry));
    }

     
    public function getFileContent(string $id)
    {
        return $this->getData('GET', '/-default-/public/alfresco/versions/1/nodes/' . $id . '/content', ['attachment' => 'true'], true);
    }

     
    public function create(\Folder $parentFolder, string $filePath, string $fileName)
    {
        $curlFile = curl_file_create(realpath($filePath), '', $fileName);
        $data = $this->getData('FILE', '/-default-/public/alfresco/versions/1/nodes/' . $parentFolder->folderID . '/children', ['filedata' => $curlFile, 'autoRename' => 'true']);
        if(!$data->entry->isFile) return null;
        return $data->entry->id;
    }

     
    public function getException()
    {
        return $this->exception;
    }
}