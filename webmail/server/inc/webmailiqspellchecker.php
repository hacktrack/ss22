<?php
 
class WebmailIqSpellChecker extends XMLRequestInterface {
	 
	public function __construct($oQuery, $oDoc, &$attrs)
	{
		$this->oQuery = $oQuery;
		$this->oDoc = $oDoc;
		$this->aAttrs = &$attrs;
		$this->loadUser();
		$this->checkInputXML();
		$this->exeInputXML();
	}
	private function checkInputXML()
	{
		if (!$this->aAttrs['sid']) {
			throw new Exc('access_denied','access_denied');
		}
	}
	 
	private function exeInputXML()
	{
		slSystem::import('tools/spellchecker');
		 		switch ($this->aAttrs['type']) {
			case 'get':
				if ($checkNode = $this->oDoc->getNode('spellchecker:check', $this->oQuery)) {
					if (!($id = $checkNode->getAttribute('uid')))
					{
						if ($id==0) {
							$id = "0";
						} else {
							throw new Exc('spellchecker_missing_check_id');
						}
					}
					if (!($textNode = $this->oDoc->getNode('spellchecker:text', $checkNode))) {
						throw new Exc('spellchecker_missing_tag','text');
					}
					$suggestNode = $this->oDoc->getNode('spellchecker:suggest', $checkNode);
					$spellChecker = new slToolsSpellChecker($id);
					$misspelled = $spellChecker->check($textNode->nodeValue, $suggestNode != null);
					$this->aData['DICTIONARY_ID'] = slToolsPHP::htmlspecialchars($id);
					$this->aData['SUGGEST'] = $suggestNode != null;
					foreach ($misspelled as $word => $suggests) {
						$word = array('WORD' => slToolsPHP::htmlspecialchars($word));
						if ($suggestNode) {
							foreach ($suggests as &$suggest) {
								$suggest = array('WORD' => slToolsPHP::htmlspecialchars($suggest));
							}
							unset($suggest);
							$word['SUGGESTS'] = $suggests;
						}
						$this->aData['WORDS'][] = $word;
					}
					$this->sTemplateFile = 'webmailiqspellchecker_get_check';
				} else if ($dictionaryNode = $this->oDoc->getNode('spellchecker:dictionary', $this->oQuery)) {
					if (!($id = $dictionaryNode->getAttribute('uid'))) {
						throw new Exc('spellchecker_missing_dictionary_id');
					}
					$spellChecker = new slToolsSpellChecker($id);
					$this->aData['DICTIONARY_ID'] = slToolsPHP::htmlspecialchars($id);
					foreach ($this->oDoc->query('spellchecker:suggest', $dictionaryNode) as $suggestNode) {
						if (!($word = $suggestNode->getAttribute('word'))) {
							throw new Exc('spellchecker_missing_word');
						}
						$suggests = $spellChecker->suggests($word);
						foreach ($suggests as &$suggest) {
							$suggest = array('WORD' => slToolsPHP::htmlspecialchars($suggest));
						}
						unset($suggest);
						$this->aData['WORDS'][] = array(
							'WORD' => slToolsPHP::htmlspecialchars($word),
							'SUGGESTS' =>   $suggests
							 
						);
					}
					$this->sTemplateFile = 'webmailiqspellchecker_get_suggest';
				} else {
					throw new Exc('spellchecker_missing_tag','dictionary,check');
				}
				break;
			case 'set':
				if (!($dictionaryNode = $this->oDoc->getNode('spellchecker:dictionary', $this->oQuery))) {
					throw new Exc('spellchecker_missing_tag','dictionary');
				}
				if (!($id = $dictionaryNode->getAttribute('uid'))) {
					throw new Exc('spellchecker_missing_dictionary_id');
				}
				$spellChecker = new slToolsSpellChecker($id);
				foreach ($this->oDoc->query('spellchecker:add', $dictionaryNode) as $addNode) {
					$spellChecker->add($addNode->nodeValue);
				}
				$this->aData['DICTIONARY_ID'] = slToolsPHP::htmlspecialchars($id);
				$this->sTemplateFile = 'webmailiqspellchecker_set';
				break;
			default:
				break;
		}
	}
}
?>
