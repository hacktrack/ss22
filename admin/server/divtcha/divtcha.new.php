<?php
class divtcha
{
	private $settings=array();
	private $code=false;
	private $random=array();
	private $input_name=false;
	private $elements=array('div','i','b','u','span','em','strong');
	
	public function __construct($code_length,$bw=false,$images='dtimg',$fontsize=10)
	{
		$this->settings['code_length']=$code_length;
		$this->settings['black_and_white_only']=$bw;	$this->bw=$bw;
		$this->settings['images_path']=$images;
		$this->settings['font_size']=$fontsize;
		
		$this->code=$this->generateCode();
		$this->input_name=$this->generateCode(20);
		$_SESSION['_divtcha']['codes'][$this->input_name]=$this->code;
	}
	
	private function random($key)
	{
		if(!isset($this->random[$key]))
		{
			$code=$this->generateCode(4);
			while(in_array($code,$this->random,true))
			{
				$code=$this->generateCode(4);
			}
			$this->random[$key]='R'.$code;
		}
		return $this->random[$key];
	}
	
	 
	private function rgb2hex($r,$g,$b)
	{
   		return bin2hex(chr($r)).bin2hex(chr($g)).bin2hex(chr($b));
	}
	
	private function generateCode($length=false)
	{
		if(!$length){$length=$this->settings['code_length'];}
		$chars=array('0','1','2','3','4','5','6','7','8','9','0','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z');
		
		$code=array();
		
		for($i=0; $i<$length; $i++)
		{
			$code[]=$chars[mt_rand(0,count($chars)-1)];
		}
		
		return join('',$code);
	}
	
	 
	private function char2div($char,$left,$bg,$pbg)
	{
		$cesta=$this->settings['images_path'].strtolower($char).'.jpg';
		
		if(!file_exists($cesta)){
			throw new Exception("Image path does not exist");
		}
		
		if (file_exists($cesta))
		{
    		$velikost = getimagesize($cesta);
    		
    		$obrazek = imagecreatefromjpeg($cesta);
   	
    		$ret = array();
    		for ($x = 0; $x < $velikost[0]; $x++)
    		{
        		for ($y = 0; $y < $velikost[1]; $y++)
        		{
            		if ($x < $velikost[0] && $y < $velikost[1])
            		{
                		$pixel = imagecolorat($obrazek,$x,$y);
                		$cols = imagecolorsforindex($obrazek,$pixel);
                		$r = $cols['red'];
                		$g = $cols['green'];
                		$b = $cols['blue'];
                		
                		if (isset($this->bw) && $this->bw) 
						{
							$gray=($r+$g+$b)/3;
							if ($gray<=180) {$r=0;$g=0;$b=0;}
							else {$r=255;$g=255;$b=255;}
						}
                		
                		$color=strtolower($this->rgb2hex($r,$g,$b));
                		$bgc=" style=\"background-color:#".$color."\"";
                		if ($color!=$bg) 
						{
							if ($color!=$pbg)
							{
                				$style=$bgc;
							}
							else
							{
								$style='';
							}
							 							$element=$this->elements[rand(0,count($this->elements)-1)];
							
							$xw=($x+$left);
							$yw=$y;
							
                			$ret[]="<$element class=\"".$this->random('xName_'.$xw)." ".$this->random('yName_'.$yw)."\"$style></$element>";
						}
            		}
        		}
			}
    
			ImageDestroy($obrazek);
    		$retx[0]=$ret;
    		$retx[1]=$velikost[0];
    		$retx[2]=$velikost[1];
    		return $retx;
    	}
    	else
    	{
    		return '';
    	}
	}
	
	 
	private function text2div($text,$bg,$pbg)
	{
		$text=strtolower($text);
		$left=0;
		$maxheight=0;

		$aret=array();
		for($i=0; $i<strlen($text); $i++)
		{
			$data=$this->char2div(substr($text,$i,1),$left,$bg,$pbg);
			$height=$data[2];
			if ($maxheight<$height) {$maxheight=$height;}
			$left+=$data[1];
			$aret=array_merge($aret,$data[0]);
		}
		shuffle($aret);
		$ret=join('',$aret);
	
		$classes="#".$this->random('boxName')."{width:".$left."px; height:".($maxheight)."px;position:relative;display:inline-block;} #".$this->random('boxName').">*{display:block; position:absolute;width:1px;height:1px;background-color:#000;}";
		for($i=0; $i<$left; $i++)
		{
			$x=$i;
			$classes.=".".$this->random('xName_'.$x)."{left:".$i."px;}";
		}
		for($i=0; $i<$maxheight; $i++)
		{
			$y=$i;
			$classes.=".".$this->random('yName_'.$y)."{top:".$i."px;}";
		}
		
		 		$element=$this->elements[rand(0,count($this->elements)-1)];
		
		$ret="<$element id=\"".$this->random('boxName')."\">".$ret."</$element>";
		
		return array("content"=>$ret,"style"=>$classes);
	}
	
	public function getCode()
	{
		return $this->text2div($this->code,'ffffff','000000');
	}
	
	public function getInputName()
	{
		return $this->input_name;
	}
	
	public static function clear()
	{
		$_SESSION['_divtcha']['codes']=array();
	}
	
	public static function check($arr=false)
	{
		if(!$arr)
		{
			$arr=$_POST;
		}
		foreach($arr as $key=>$val)
		{
			if(isset($_SESSION['_divtcha']['codes'][$key]))
			{
				if(strtoupper(trim($val))==$_SESSION['_divtcha']['codes'][$key])
				{
					$_SESSION['_divtcha']['codes']=array();
					return true;
				}
			}
		}
		return false;
	}
}
?>