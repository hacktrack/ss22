<?php

namespace server\inc\xml;

class Validator
{
     
    protected static function generateXSD(\Folder $folder, \DOMElement $DOMElement)
    {
        $used = [];
        if(file_exists(__DIR__ . '/' . $folder->getType() . '.xsd')){
            $xmlSchema = simplexml_load_file(__DIR__ . '/' . $folder->getType() . '.xsd');
            $sequence = $xmlSchema->xpath('xs:element/xs:complexType/xs:sequence')[0];
            foreach ($sequence->xpath('xs:element') as $item) {
                $used[(string)$item['name']] = true;
            }
        }else{
            $xmlSchema = new \SimpleXMLElement('<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"></xs:schema>', LIBXML_NOERROR, false, 'xsd', true);
            $newElement = $xmlSchema->addChild('xs:element');
            $newElement->addAttribute('name', 'values');
            $newElement = $newElement->addChild('xs:complexType');
            $sequence = $newElement->addChild('xs:sequence');
        }

        $xml = simplexml_load_string($DOMElement->ownerDocument->saveHTML($DOMElement));
        foreach ($xml as $name => $row) {
            if(isset($used[$name])) continue;
            $element = $sequence->addChild('xs:element');
            $element->addAttribute('type', 'xs:string');
            $element->addAttribute('name', $name);
            $element->addAttribute('minOccurs', '0');
            $element->addAttribute('maxOccurs', 'unbounded');
            $used[$name] = true;
        }
        $xmlSchema->saveXML(__DIR__ . '/' . $folder->getType() . '.xsd');
    }

     
    public static function validateValues(\Folder $folder, \DOMElement $DOMElement)
    {
        $xsd = __DIR__ . '/' . $folder->getType() . '.xsd';
        $dom = new \DOMDocument();
        $dom->loadXML($DOMElement->ownerDocument->saveHTML($DOMElement));
        if(@$dom->schemaValidate($xsd) || !defined('VALIDATE_XML_VALUES')) return true;
        if(!VALIDATE_XML_VALUES){
            log_buffer('Request XML values validation failed - updating validation XSD', 'EXTENDED');
            self::generateXSD($folder, $DOMElement);
            return true;
        }
        return false;
    }
}
