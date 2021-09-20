<?php

namespace server\inc\imap;

 
class Search
{
     
    protected $folder;

     
    public static $allowedKeywords = [
        'from',
        'to',
        'subject',
        'after',
        'before',
        'has',
        'fulltext',
        'is',
        'tag',
        'yoda',
    ];

     
    protected static $keywordTranslations = [
        'after' => 'SINCE',
        'has' => 'HEADER',
        'fulltext' => 'TEXT',
        'is' => 'UNSEEN',
        'tag' => 'KEYWORD',
        'yoda' => 'TEXT',
    ];

    protected static $skipSearchConditions = [
        'is:unread',
    ];

     
    protected $conditions = [];

    protected $isVirtual = false;
    protected $imap;
    protected $enabled = true;

     
    public function __construct(\Folder $folder, string $searchCondition = '')
    {
        if(in_array($searchCondition, self::$skipSearchConditions)) $this->enabled = false;
        if($folder instanceof \VirtualFolder) $this->isVirtual = true;
        $this->folder = $folder;
                 if(!$this->addSearchConditions($searchCondition)) $this->enabled = false;
    }

     
    public function parseSearchCondition(string $searchCondition = '', string $defaultKeyword = 'fulltext', bool $negateAll = false) : ? array
    {
        if(!preg_match_all('/(?P<negation>-)?(?:(?P<keyword>[^\\s:]+):)?(?|(?P<special>NOT)|(?P<special>OR)|(?P<special>AND)|(?P<special>\\/)|(?P<special>\\&)|()(?:(\\()(?P<value>[^\\)]+?)\\))(?P<multiple>)|()(?:((?<!\\\\)["\'])(?P<value>.+?)(?<!\\\\)\4)|()()(?P<value>\\b[^:\\s]+\\b))/iu', $searchCondition, $matches, PREG_SET_ORDER)) return null;

        $conditions = [];
        $andCondition = (object) ['special'=>'&'];

        $negate = false;
        foreach ($matches as $match) {
            if(strcasecmp($match['special'], 'NOT') === 0){
                $negate = true;
                continue;
            }
            $previous = $condition ?? new \stdClass();
            $condition = null;
            if(empty($match['keyword']) || !in_array(strtolower($match['keyword']), self::$allowedKeywords)) $match['keyword'] = $defaultKeyword;
            if($match['keyword'] == 'fulltext' && !$_SESSION['FULLTEXT_SUPPORT']) continue;
            $match['keyword'] = self::$keywordTranslations[strtolower($match['keyword'])] ?? strtoupper($match['keyword']);

            if(isset($match['multiple'])){
                $negation = $negate || !empty($match['negation'] ?? null);
                $subConditions = $this->parseSearchCondition($match['value'], $match['keyword'], ($negateAll) ? !$negation : $negation);
                $negate = false;
                if(is_array($subConditions)){
                    if(count($subConditions) == 1){
                        $condition = current($subConditions);
                    }else{
                        if(empty($condition->special) && !empty($previous->keyword) && empty($previous->special)) $conditions[] = $andCondition;
                        $conditions[] = $subConditions;
                        continue;
                    }
                }
            }
            if(!$condition instanceof \stdClass){
                $condition = new \stdClass();
                if(!empty($match['special'])) $condition->special = $match['special'];
                $condition->keyword = $match['keyword'];
                $condition->value = $match['value'];
                $condition->negation = false;
                if ($negate || !empty($match['negation'] ?? null)){
                    $condition->negation = true;
                    $negate = false;
                }
            }
            if ($negateAll) $condition->negation = !$condition->negation;
            if(empty($condition->special) && !empty($previous->keyword) && empty($previous->special)) $conditions[] = $andCondition;
            $conditions[] = $condition;
        }

        $conditions = $this->infixToPrefix($conditions);
        return $conditions;
    }

     
    public function addSearchConditions(string $searchCondition = '') : bool
    {
        $this->conditions = $this->parseSearchCondition($searchCondition);
        if(is_null($this->conditions)) return false;
        return true;
    }

     
    protected function infixToPrefix(array $expresions)
    {
        $stack = [];
        $result = [];
        foreach ($expresions as $expresion) {
            if(is_array($expresion)){
                $result[] = $expresion;
                continue;
            }
            if(!empty($expresion->special)){
                $stack[] = $expresion;
            }else{
                $result[] = $expresion;
            }
        }
        return (array_merge(array_reverse($stack), $result));
    }

    protected function correctUnseenValue($value)
    {
        $value = '';
        return $value;
    }

    protected function correctKeywordValue($value)
    {
        return \slToolsString::urlenquote($value);
    }

     
    protected function correctHeaderValue($value)
    {
        if($value == 'attachment'){
            $value = 'Content-Type "multipart/mixed"';
        }
        return $value;
    }

     
    protected function correctSinceValue($value)
    {
        return $this->correctDate($value);
    }

     
    protected function correctBeforeValue($value)
    {
        return $this->correctDate($value);
    }

     
    protected function correctDate($date)
    {
        $datetime = date_create_from_format('Y/m/d', $date);
        return $datetime->format('d-M-Y');
    }

     
    public function getCriteria() : string
    {
        return $this->__toString();
    }

     
    public function getSearchResults()
    {
        $imap = $this->getImap();
        if(!$imap instanceof \IMAP) return false;
        $imap->openMailbox($this->folder->name);
        $result = imap_search($imap->getImapResource(), $this->getCriteria(), SE_UID);
        return $result;
    }

     
    public function isSearchEnabled()
    {
        if(!$this->enabled) return false;
        $imap = $this->getImap();
        if(!$imap instanceof \IMAP) return false;
        if(!$this->isVirtual) return true;
        return $imap->getCapability('MULTISEARCH');
    }

     
    protected function getImap()
    {
        if(!$this->imap instanceof \IMAP) {
            try {
                $account = $this->folder->account;
                if ($this->isVirtual) $account = $account->account;
                if(!$account instanceof \IMAPAccount) return false;
                $this->imap = \IMAP::instance($account);
            }catch (\Exception $exception){
                return false;
            }
        }
        return $this->imap;
    }

    protected function getMultiSearchResults(& $folderIds = [], $useFolders = [])
    {
        $allFolders = false;
        if(!empty($useFolders)){
            $folders = $useFolders;
        }elseif(!empty($this->folder->folders ?? null)){
            $folders = $this->folder->folders;
        }else{
            $account = $this->folder->account->account;
            $folders = $account->folders['main'];
            $allFolders = true;
        }
        if(empty($folders)){
            $folders = [$this->folder];
            $allFolders = false;
        }
        $imap = $this->getImap();
        if(!$imap instanceof \IMAP) return '(0 = 1)';
        $folderNames = [];
        foreach($folders as $folder){
            $encodedName = $imap->encode($folder->name);
            $folderIds[strtolower($encodedName)] = $folder->folderID;
            $folderNames[] = '"' . $encodedName . '"';
        }
        if($allFolders){
            $location = '(personal)';
        }else{
            $location = '(mailboxes (' . join(' ', $folderNames) . '))';
        }
        return imap_msearch($imap->getImapResource(), $location, $this->getCriteria(), '(X-NOFALLBACK ALL)');
    }

     
    public function getMultiSearchSql($useFolders = [])
    {
        $imap = $this->getImap();
        $searchResult = $this->getMultiSearchResults($folderIds, $useFolders);
        if(!$searchResult) return null;
        $conditions = $ids = [];
        foreach ($searchResult as $folder => $list) {
            $folderName = strtolower(trim($folder));
            $ids[$folderName] = [];
            foreach($list as $key => $val){
                $ids[$folderName][$key] = \IMAP::fixID($val);
            }
            if(!empty($ids[$folderName])){
                $conditions[] = '(' . 'folder_id = \'' . $folderIds[$folderName] . '\' AND (RID IN (\'' . implode("','", $ids[$folderName]).'\')))';
            }
        }
        return !empty($conditions) ? '(' . implode(' OR ', $conditions) . ')' : '(0 = 1)';
    }

     
    public function getSearchSql()
    {
        if($this->isVirtual || $this->getImap()->getCapability('MULTISEARCH')){
            return $this->getMultiSearchSql();
        }
        $searchResult = $this->getSearchResults();
        if(is_array($searchResult)) $searchResult = array_map('IMAP::fixID', $searchResult);
        return $searchResult !== false ? '(RID IN (\'' . implode('\',\'', $searchResult) . '\'))' : '(0 = 1)';
    }

     
    protected function prefixedNotationToImap(array & $prefixed, array $stack = [], string $result = '')
    {
        $current = array_shift($prefixed);
        if(empty($current)){
            return $result;
        }
        if(is_array($current)){
            $subQuery = $current;
            $sub = $this->prefixedNotationToImap($subQuery);
            $operand = array_pop($stack);
            if(empty($result)){
                $result = ((strtoupper($operand->special) == 'OR' || $operand->special == '/') ? 'OR ' : '') . $sub;
            }else{
                $result = ((strtoupper($operand->special) == 'OR' || $operand->special == '/') ? 'OR ' : '') . '(' . $result . ' ' . $sub . ')';
            }
            return $this->prefixedNotationToImap($prefixed, $stack, $result);
        }
        if(!empty($current->special)){
            $stack[] = $current;
            return $this->prefixedNotationToImap($prefixed, $stack);
        }
        $operand = array_pop($stack);
        if(empty($result)){
            $result = ((strtoupper($operand->special) == 'OR' || $operand->special == '/') ? 'OR ' : '') . $this->getFinalValue($current);
        }else{
            $result = ((strtoupper($operand->special) == 'OR' || $operand->special == '/') ? 'OR ' : '') . '(' . $result . ' ' . $this->getFinalValue($current) . ')';
        }

        return $this->prefixedNotationToImap($prefixed, $stack, $result);
    }

     
    protected function getFinalValue(\stdClass $object)
    {
        $function = 'correct' . ucfirst(strtolower($object->keyword)) . 'Value';
        $finalValue = is_callable([$this, $function]) ? $this->{$function}($object->value) : $object->value;
        $finalValue = ($object->negation ? 'NOT ' : '') . strtoupper($object->keyword) . ' "' . $finalValue . '"';
        return $finalValue;
    }

     
    public function __toString() : string
    {
        $conditions = $this->conditions;
        $result = $this->prefixedNotationToImap($conditions);
        if ($result[0] == '(') $result = substr($result,1);
        if ($result[strlen($result)-1] == ')') $result = substr($result,0,strlen($result)-1);
        return $result;
    }
}