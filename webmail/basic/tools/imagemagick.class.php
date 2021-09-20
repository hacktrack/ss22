<?php
class imagemagick
{
	private static function query2server($query,&$output=array())
	{
		@exec($query,$output,$ret);
		if ($ret==0)
		{
			return true;
		}
		else
		{
			return false;
		}
	}


	public static function resize($zdroj,$cil,$dest_x,$dest_y,$quality=100,$crop=false,$wm='',$allow_bad_size=false,$um=true,$unsharpmask='0.8x0.8+1.0+0.10')
	{
		$picsize = getimagesize($zdroj);
	 	$source_x = $picsize[0];
	 	$source_y = $picsize[1];

	 	$x=$dest_x;
	 	$y=$dest_y;

	 	if (!$crop)
	 	{
	  		if ($source_x > $source_y)
	  		{
				$dest_y = floor(($dest_x/$source_x) * $source_y);
	  		}
	  		else
	  		{
				$dest_x = floor(($dest_y/$source_y) * $source_x);

	  		}
	 	}
	 	else
	 	{
	  		if ($dest_x > $dest_y)
	  		{
	  			if ($source_x<$source_y)
	  			{
					$dest_y = ceil(($dest_x/$source_x) * $source_y);
					if ($dest_y<$y)
					{
						$dest_x = ceil(($dest_y/$source_y) * $source_x);
						$dest_y=$y;
					}
				}
				else
				{
					$dest_x = ceil(($dest_y/$source_y) * $source_x);
					if ($dest_x<$x)
					{
						$dest_x=$x;
						$dest_y = ceil(($dest_x/$source_x) * $source_y);
					}
				}
	  		}
	  		else
	  		{
	  			if ($source_x>$source_y)
	  			{
					$dest_x = ceil(($dest_y/$source_y) * $source_x);
					if ($dest_x<$x)
					{
						$dest_x=$x;
						$dest_y = ceil(($dest_x/$source_x) * $source_y);
					}
				}
				else
				{
					$dest_y = ceil(($dest_x/$source_x) * $source_y);
					if ($dest_y<$y)
					{
						$dest_x = ceil(($dest_y/$source_y) * $source_x);
						$dest_y=$y;
					}
				}
	  		}
	 	}

	 	 
	 	if ($dest_x>$x || $dest_y>$y)
	 	{
	 	
	 	if (!$crop)
	 	{
	 		$dest_x=$x;
	 		$dest_y=$y;
	  		if ($source_x < $source_y)
	  		{
				$dest_y = floor(($dest_x/$source_x) * $source_y);
	  		}
	  		else
	  		{
				$dest_x = floor(($dest_y/$source_y) * $source_x);
	  		}
	 	}

	 	}
	 	 



	 		$bad_size=false;
	 		if ($source_x<$dest_x || $source_y<$dest_y)
	 		{
	 			$dest_x=$source_x;
	 			$dest_y=$source_y;
	 			$bad_size=true;
	 		}

	 	if (!$bad_size || $allow_bad_size)
	 	{
	 		$query="convert $zdroj -quality $quality% -resize ".$dest_x."x".$dest_y." $cil";
			if ($retval=self::query2server($query))
			{
				 				if ($crop)
				{
					$query="convert $cil -crop ".$x."x".$y."+0+0 $cil";
				}
				if (!self::query2server($query))
				{
					 					return false;
				}
				else
				{

					if ($um)
					{
						$query="convert -unsharp $unsharpmask $cil $cil";
						if (!self::query2server($query))
						{
							return false;
						}
					}

					if ($wm!="")
					{
						self::query2server("composite -gravity SouthEast $wm $cil $cil");
					}
				}
			}
			else
			{
				return false;
			}
		}

		return true;
	}
}
?>