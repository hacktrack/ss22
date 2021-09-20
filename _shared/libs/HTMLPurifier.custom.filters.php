<?php
 
 
class HTMLPurifier_URIFilter_DisableResourcesWithoutHost extends HTMLPurifier_URIFilter_DisableExternalResources {
	public $name = 'DisableResourcesWithoutHost';
	private $enableExternalResources = false;

	public function __construct($enableExternalResources = false) {
		$this->enableExternalResources = $enableExternalResources;
	}

	public function filter(&$uri, $config, $context) {
		if (true === $this->enableExternalResources) {
			return true;  		}

		 		if (null === $uri->host && null === $uri->scheme) {  			 			return false;
		}

		 		return parent::filter($uri, $config, $context);
	}
}

 
class HTMLPurifier_URIFilter_AdvancedResourceFilter extends HTMLPurifier_URIFilter_DisableExternalResources {
	public $name = 'AdvancedResourceFilter';
	public $counter = 0;
	private $enableExternalResources = null;
	private $base = null;

	public function __construct($enableExternalResources = false) {
		$this->enableExternalResources = $enableExternalResources;
	}

	public function filter(&$uri, $config, $context) {
		 		if ('mailto' === $uri->scheme && $uri->path) {
			return true;
		}
		
		 		if ('tel' === $uri->scheme) {
			return true;
		}

		 		if ('content' === $uri->scheme) {
			return false;
		}


		if ($this->base === null) {
			$this->base = $context->get('BaseUrl', true);
		}
		$base = $this->base;

		 		if (strpos($uri->path, '/server/download.php') !== false) {
			return true;
		}
		 		elseif ('cid' === $uri->scheme) {
			$newUri = new HTMLPurifier_URI(null, null, null, null, null, null, null);
			 			$newUri->path = 'cid:' . str_replace('$', '%24', $uri->path);
			$uri = $newUri;
			return true;
		}
		 		elseif (null === $uri->host && !$base) {
			 			return false;
		}
		 		elseif (null === $uri->host) {
			 			if ($base && $uri->path) {
				$uriParser = new HTMLPurifier_URIParser();
				$newUri = $uriParser->parse($base);
				$newUri->path .= $uri->path;
				$uri = $newUri;
				 			}
		}

		 		if (true === $this->enableExternalResources) {
			return true;
		}

		 		$disableExternalResourcesResult = parent::filter($uri, $config, $context);

		if (false === $disableExternalResourcesResult) {
			 			if (null === $context->get('CheckAndDisableExternalResourcesCounter', true)) {
				 				$context->register('CheckAndDisableExternalResourcesCounter', $this->counter);
			}

			$this->counter++;

			 			 			$uri = new HTMLPurifier_URI(null, null, null, null, null, null, '');
			return true;
		}

		return $disableExternalResourcesResult;
	}
}