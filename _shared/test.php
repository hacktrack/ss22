<?php
 class slTestCase
{
	private $test;
	private $success;
	private $fail;
	private $total;

	public function __construct()
	{
		echo '<style type="text/css">.result{ margin:5px;padding:5px;color:#FFF; }</style>';
	}
	private function init( $test = '')
	{
		$this->test = $test;
		$this->success = 0;
		$this->fail = 0;
		$this->total = 0;
	}
	
	private function assumeTrue()
	{
		
	}
	
	private function assumeFalse()
	{
		if($var !== false){
			$this->message('Test '.$this->test.' : variable does not exists');	
			$this->fail();
		}else{
			$this->success();
		}
	}
	
	private function assumeExists( $var )
	{
		if(!isset($var)){
			$this->message('Test '.$this->test.' : variable does not exists');
			$this->fail();
		}else{
			$this->success();
		}
	}
	
	private function assumeClassExists( $var )
	{
		if(!class_exists($var)){
			$this->message('Test '.$this->test.' : class does not exists '.$var);
			$this->fail();
		}else{
			$this->success();
		}
	}
	
	private function assumeNotExists()
	{
		
	}
	
	private function assumeEqual( $var1, $var2 )
	{
		if( $var1 != $var2 ){
			$this->message('Test ' . $var1 . ' and ' . $var2. ' are not equal');
			$this->fail();	
		}else{
			$this->success();
		}
	}
	
	private function message( $msg )
	{
		echo $msg."<br/>";	
	}
	
	private function success()
	{
		$this->success++;
		$this->total++;
	}
	
	private function fail()
	{
		$this->fail++;
		$this->total++;	
	}
	
	private function result()
	{
		if($this->fail){
			$color = '#A00';		
		}else{
			$color = '#0A0';			
		}
		echo '<div class="result" style="background:'.$color.';"><h1>'.$this->test.'</h1><b>'.
			$this->total.'</b> cases completed <b>'.
			$this->success.'</b> succeeded and <b>'.
			$this->fail.'</b> failed </div>';
	}
	
	public function testToolsXML()
	{
		$this->init('Tools/XML');
		require_once('tools/xml.php');
		$string = 
		'<test>'.
			'<element attribute="attribute_value">'.
				'<subelement attribute1="1" attribute2="2">subElementValue0</subelement>'.
				'<subelement>subElementValue1</subelement>'.
				'<subelement attribute1="1" attribute2="2">subElementValue2</subelement>'.
			'elementValue</element>
		</test>';
		$xml = slToolsXML::loadString($string);
		$this->assumeExists($xml->element);
		$this->assumeExists($xml->element->subelement[0]);
		$this->assumeEqual($xml->element->subelement[0]['attribute1'],'1');
		$this->assumeEqual( (string) $xml->element->subelement[2],'subElementValue2');
		$arr = slToolsXML::xml2array($xml);
		$this->assumeExists($arr['@childnodes']);
		$this->result();
	}
	
	public function testSystem()
	{
		$this->init('System');
		require_once('system.php');
		 		slSystem::import('test/test','');
		$this->assumeClassExists('test');
		$this->result();
	}

}

$test = new slTestCase;
$test->slToolXML();
$test->testSystem();
?>