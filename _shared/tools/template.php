<?php
 

	class slToolsTemplate
	{
	     
        public $tOpen;
         
        public $tName;
         
        public $tCount;
         
        public $tClose;
         
        public $tDepth;
         
        public $aInfo;
         
        public $aDepth;
         
        public $aCount;
         
        public $output;
         
        public $skip;
         
        public $skipNew;
         
        public $data;
         
        public $aData;
         
        public $pData;
         
        public $b;
         
        public $i;
         
        public $bSize;
         
        public $com;
         
        public $skipcom;

        public function __construct()
		{
			$this->tOpen = false;			 			$this->tName = array();		 			$this->tCount = 0;		 			$this->tClose = false;	 			$this->tDepth = 0;				 			$this->aInfo = array();
			$this->aDepth = 0;
			$this->aCount = 0;
			$this->output = '';					 			$this->skip = false;
			$this->skipNew = 0;
		}
		
	 
		public function parse($template,&$data = false,$bSize = TPL_BUFFER_SIZE)
		{
			$this->data = &$data;				 			
			$this->aData['BEGIN'] = '{';
			$this->aData['END'] = '}';
			$this->aData['amp'] = '&amp;';
			
			$this->pData = &$this->data;			
			if(file_exists($template)){
				$this->b = file_get_contents($template);
			}	else{
				$this->b = $template;
			}
			$this->parseBuffer();
			
			return $this->output;
		}
		
		private function parseBuffer()
		{
			$this->bSize = strlen($this->b);
			for($this->i = 0;$this->i < $this->bSize;$this->i++){
				switch($this->b[$this->i]){
					case '{':
						$this->tName = '';
						$this->tOpen = true;
					break;
					case '}':
						if($this->skip){
							if($this->tClose){
								$this->com = $this->tName[$this->tCount];
							}
							if($this->com && ($this->com == $this->skipcom)){
								if($this->tClose){
									if($this->skipNew == 0){
										$this->skip = false;
									}else{
										$this->skipNew--;
									}
								}else{
									$this->skipNew++;
								}
							}
						} else {
							if($this->tClose){
								$this->com = $this->tName[$this->tCount];
							}
							$this->tag();
						}
						$this->tOpen = false;
						$this->tClose = false;
						$this->tCount = 0;
						$this->com = '';
					break;
					case '/':
						if($this->tOpen){
							$this->tClose = true;
						}else{
							$this->output('/');
						}
					break;
					case ':':
						if($this->tOpen){
							$this->tCount++;
						}else{
							$this->output(':');
						}
					break;
					case ' ':
					if($this->tOpen && $this->tCount===0){
							$this->com = $this->tName[$this->tCount];
							$this->tName = array();
					}
					if(!$this->tOpen){
						$this->output(' ');
					}
					break;
					default:
						if($this->tOpen) {
							$this->tName[$this->tCount].=$this->b[$this->i];
						} else {
							$this->output($this->b[$this->i]);
						}
					break;
				}
			}
		}
		private function tag()
		{
			if(!$this->tClose){
				$variable = false;
				if($this->tName[0]==='*'){
					array_shift($this->tName);
					$this->tCount--;
					$data = &$this->pData;
				}else{
					$data = &$this->data;
				}
				if($this->tCount){
					$variable = $this->traverseArray($data,$this->tName);
				}else{
					
					if($data[$this->tName[0]]){
						$variable = $data[$this->tName[0]];
					}
				}
				unset($data);
				if($this->com){
				switch($this->com){
						case 'arr':
							if($variable!==false) {
								$this->aDepth++;
								$this->aInfo[$this->aDepth]['total'] = count($variable);
								$this->aInfo[$this->aDepth]['remain'] = count($variable);
								$this->aInfo[$this->aDepth]['start'] = $this->i;
								$this->aInfo[$this->aDepth]['pointer'] = $this->pData;
								$this->pData = &$this->pData[$this->tName[$this->tCount]];
								$this->aInfo[$this->aDepth]['apointer'] = $this->pData;
								$this->pData = &$this->pData[0];
							} else {
								$this->skip = true;
								$this->skipcom = $this->com; 
							}
						break;
						case 'opt':
							if($variable===false){
								$this->skip = true;
								$this->skipcom = $this->com;
							}
						break;
					}
				}else{
					if(!$this->skip){
						$this->output($variable);
					}
				}
			}else{
				if($this->com == 'arr'){
					$info = &$this->aInfo[$this->aDepth];
					$info['remain']--;
					$this->pData = &$info['apointer'];
					if($info['remain']==0){
						$this->pData = &$info['pointer'];
						unset($this->aInfo[$this->aDepth]);
						$this->aDepth--;
					}else{
						$this->pData = &$this->pData[$info['total']-$info['remain']];
						$this->i = $info['start'];
					}
				}
			}
		}
		private function traverseArray($array,$path)
		{
			foreach($path as $wp){
				if(!isset($array[$wp]))
					return false;
				$array = &$array[$wp];
			}
			return $array;
		}
		
		private function output($string)
		{
			if(!$this->skip){
				$this->output.=$string;
			}
		}
	}

?>