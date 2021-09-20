<?php

namespace tools;

 
class ParamLineParser
{
     
    public $parsedParamLines = [];

     
    public function __construct(string $paramLine, bool $onlyFirst = false)
    {
        $lines = explode(PHP_EOL, $paramLine);
        $labels = explode('&', strtolower(trim(array_shift($lines))));
        foreach ($lines as $line) {
            if(empty($line)) continue;
            $data = explode('&', trim($line));
            $this->parsedParamLines[] = @array_combine($labels, array_map('rawurldecode', $data));
            if($onlyFirst) break;
        }
        $this->parsedParamLines = array_filter($this->parsedParamLines);
    }

     
    public function getValuesWith(string $column, string $value, ... $searches) : array
    {
        $searches[] = $column;
        $searches[] = $value;
        foreach ($this->parsedParamLines as $param) {
            try {
                for ($i = 0; $i < count($searches); $i += 2) {
                    $column = strtolower($searches[$i]);
                    $value = $searches[$i + 1];
                    if (!isset($param[$column])) return [];
                    if ($param[$column] != $value) throw new \Exception('Continue');
                }
            }catch (\Exception $exception){
                continue;
            }
            return $param;
        }
        return [];
    }

     
    public function getValueWith(string $column, string $searchColumn, $value, ... $searches)
    {
        $values = call_user_func_array([$this, 'getValuesWith'], array_merge([$searchColumn, $value], $searches));
        return $values[strtolower($column)] ?? null;
    }

     
    public function getFirstValue(string $column)
    {
        $column = strtolower($column);
        return reset($this->parsedParamLines)[$column] ?? null;
    }

     
    public function getAllValuesColumn(string $column) : array
    {
        return array_column($this->parsedParamLines, $column);
    }

     
    public function getValuesColumns(string ... $columns) : array
    {
        $result = [];
        foreach ($this->parsedParamLines as $key => $parsedParamLine) {
            $result[$key] = [];
            foreach ($columns as $column) {
                $result[$key][$column] = $parsedParamLine[strtolower($column)] ?? null;
            }
            $result[$key] = array_filter($result[$key]);
        }
        return array_filter($result);
    }

     
    protected function inArray(array $array, array $search) : bool
    {
        foreach ($search as $column => $value) {
            if(!isset($array[strtolower($column)]) || $array[strtolower($column)] != $value){
                return false;
            }
        }
        return true;
    }

     
    public function getIndexesBySearchArray(array $array) : array
    {
        $indexes = [];
        foreach ($this->parsedParamLines as $index => $parsedParamLine) {
            foreach ($array as $searchArray) {
                if($this->inArray($parsedParamLine, $searchArray)){
                    $indexes[] = $index;
                }
            }
        }
        return $indexes;
    }
}
