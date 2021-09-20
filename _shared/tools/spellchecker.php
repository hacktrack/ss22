<?php

 
class slToolsSpellChecker {
	 
	private $broker;
	
	 
	private $dict;
	
	 
	private $custom;

	 
	public function __construct($lang)
	{
		$locale = array(
				"af" => "af_ZA",
				"ar" => "ar_AE",
				"be" => "be_BY",
				"bg" => "bg_BG",
				"br" => "br_FR",
				"bs" => "bs_BA",
				"ca" => "ca_ES",
				"cs" => "cs_CZ",
				"cy" => "cy_GB",
				"da" => "da_DK",
				"de" => "de_DE",
				"el" => "el_GR",
				"en" => "en_US",
				"es" => "es_ES",
				"et" => "et_EE",
				"eu" => "eu_ES",
				"fa" => "fa_IR",
				"fi" => "fi_FI",
				"fo" => "fo_FO",
				"fr" => "fr_FR",
				"ga" => "ga_IE",
				"gl" => "gl_ES",
				"gv" => "gv_GB",
				"he" => "he_IL",
				"hi" => "hi_IN",
				"hr" => "hr_HR",
				"hu" => "hu_HU",
				"id" => "id_ID",
				"is" => "is_IS",
				"it" => "it_IT",
				"iw" => "iw_IL",
				"ja" => "ja_JP",
				"ka" => "ka_GE",
				"kl" => "kl_GL",
				"ko" => "ko_KR",
				"kw" => "kw_GB",
				"lt" => "lt_LT",
				"lv" => "lv_LV",
				"mi" => "mi_NZ",
				"mk" => "mk_MK",
				"mr" => "mr_IN",
				"ms" => "ms_MY",
				"mt" => "mt_MT",
				"nl" => "nl_NL",
				"nn" => "nn_NO",
				"no" => "no_NO",
				"oc" => "oc_FR",
				"pl" => "pl_PL",
				"pt" => "pt_BR",
				"ro" => "ro_RO",
				"ru" => "ru_RU",
				"se" => "se_NO",
				"sk" => "sk_SK",
				"sl" => "sl_SI",
				"sq" => "sq_AL",
				"sr" => "sr_YU",
				"sv" => "sv_SE",
				"ta" => "ta_IN",
				"te" => "te_IN",
				"tg" => "tg_TJ",
				"th" => "th_TH",
				"tl" => "tl_PH",
				"tr" => "tr_TR",
				"uk" => "uk_UA",
				"ur" => "ur_PK",
				"uz" => "uz_UZ",
				"vi" => "vi_VN",
				"wa" => "wa_BE",
				"yi" => "yi_US",
				"zh" => "zh_CN"
		);
		if(!preg_match('/[a-z]{2}_[A-Z]{2}/si',$lang)){
			$lang = $locale[$lang];
		}
		 		if(!($this->broker = enchant_broker_init())){
			throw new Exc('enchant_broker_init');
		}
		
		 		if (enchant_broker_dict_exists($this->broker,$lang)) {
			$this->dict = enchant_broker_request_dict($this->broker, $lang);
		}else{
			throw new Exc('enchant_dictionary_exist',$lang);
		}
	}

	 
	public function __destruct()
	{
		if($this->dict){
			enchant_broker_free_dict($this->dict);
		}
		if($this->broker){
			enchant_broker_free($this->broker);
		}
	}

	 
	public function check($text, $suggest)
	{
		$misspelled = array();

		mb_regex_encoding('UTF-8');
		mb_ereg_search_init($text, "[^[:alpha:]]*([[:alpha:]]+(['-]?[[:alpha:]])+)");
		while (($regs = mb_ereg_search_regs()) !== false) {
			$word = $regs[1];
			if (!enchant_dict_check($this->dict, $word))
				$misspelled[$word] = $suggest ? $this->suggest($word)  : array();
		}
		return $misspelled;
	}

	 
	public function suggest($word)
	{
		return enchant_dict_suggest($this->dict, $word);
	}

	 
	public function add($word)
	{
		if (!enchant_dict_add_to_personal ( $this->dict , $word )){
			throw new Exc('enchant_add_word',$word);
		}
		
		return true;
	}
	 
	public function addCorrection($word, $correction)
	{
		if(!enchant_dict_store_replacement($this->dict, $word, $correction)){
			throw new Exc('enchant_add_replacement',$word.'|'.$correction);
		}
		
		return true;
	}
}

?>