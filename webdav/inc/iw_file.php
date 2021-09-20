<?php 

class IceWarpFileStream
{ 
    private $resource;
    private $eof = false;

    function stream_open($path, $mode, $options, &$opened_path)
    {
        $this->resource = $r = icewarp_fopen(str_replace('iw.file://', '', $path), str_replace('b', '', $mode));
        return false !== $this->resource;
    } 

    function stream_read($count) 
    {
        $c = icewarp_fread($this->resource, $count);
        if ($count != 0)
            $this->eof = $c == 0;
        return $c;
    }

    function stream_write($data) 
    {
        return icewarp_fwrite($this->resource, $data);
    }

    function stream_eof()
    { 
        return $this->eof; 
    }

    function stream_close()
    {
        icewarp_fclose($this->resource);
    }
}

?>