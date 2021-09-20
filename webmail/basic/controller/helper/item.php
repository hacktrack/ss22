<?php
define('FLAG_GW_SUNDAY', 0x0000);
define('FLAG_GW_MONDAY', 0x0002);
define('FLAG_GW_TUESDAY', 0x0004);
define('FLAG_GW_WEDNESDAY', 0x0008);
define('FLAG_GW_THURSDAY', 0x0010);
define('FLAG_GW_FRIDAY', 0x0020);
define('FLAG_GW_SATURDAY', 0x0040);

slSystem::import('tools/php');

class slHelperItem extends slHelper {
    private static $firstDayOfTheWeek = 1;      private static $en = true;
    private static $enSet = false;
    private static $DTF = array();
    static $lol;
    private static $imgEx = array('jpg', 'jpeg', 'jp2', 'jpm', 'jpx', 'bmp', 'ico', 'gif', 'png', 'svg');
    public $param;
    public $items;
    public $ade;

    private static function browser_info($agent = null)
    {
        $known = array('msie', 'firefox', 'safari', 'webkit', 'opera', 'netscape', 'konqueror', 'gecko');
        $agent = strtolower($agent ? $agent : $_SERVER['HTTP_USER_AGENT']);
        $pattern = '#(?<browser>' . join('|', $known) . ')[/ ]+(?<version>[0-9]+(?:\.[0-9]+)?)#';
        if (!preg_match_all($pattern, $agent, $matches)) return array();
        $i = count($matches['browser']) - 1;
        return array('browser' => $matches['browser'][$i], 'version' => $matches['version'][$i]);
    }

    private static function isMobile()
    {
         
		foreach (['Mobile', 'Berry', 'Opera Mini', 'Kindle', 'Silk', 'Symbian', 'SymbOS'] as $agent) {
			if(strpos($_SERVER['HTTP_USER_AGENT'], $agent) !== false) return true;
        }
        return false;
    }

    private static function getTags()
    {
        if (!isset($_SESSION['tags'])) {
            $oUser = &$_SESSION['user'];
            if (!$_SESSION['PUBLIC_CALENDAR']) {
                $oAccount = $oUser->getAccount($_SESSION['EMAIL']);
                $oFolder = $oAccount->getFolder('__@@TAGS@@__');
                $oItems = $oFolder->getItems();
                $tags = array();
                foreach ($oItems as $val) {
                    $tags[$val->subject] = $val->from;
                }
                $_SESSION['tags'] = $tags;
            } else {
                $_SESSION['tags'] = '';
            }
        }
        return $_SESSION['tags'];
    }

    private static function getTagColor($tag)
    {
        $tag = trim($tag);
        $tags = self::getTags();
        if (isset($tags[$tag])) {
            return $tags[$tag];
        }
        return '';
    }

    private static function convertTags($string, $fromMail = false)
    {
         
        if ($fromMail) {
            $string = slToolsString::urldequote(str_replace(' ', ',', $string));
        }
        $tags = explode(',', trim($string));
        $tagsToShow = array();
        if (!empty($tags)) {
            foreach ($tags as $val) {
                $val = trim($val);
                if (empty($val)) continue;
				$color = self::getTagColor($val);
				if (strlen($color) == 4) {
					$color = '#' . substr($color, 1, 1) . substr($color, 1, 1) . substr($color, 2, 1) . substr($color, 2, 1) . substr($color, 3, 1) . substr($color, 3, 1);
				} elseif (strlen($color) != 7 || $color == '') {
					$color = '#FFFFFF';
				}
				$light = false;

				$brightness = (hexdec(substr($color, 1, 2)) + hexdec(substr($color, 3, 2)) + hexdec(substr($color, 5, 2))) / 3;
				if ($brightness < 128) {
					$light = true;
				}

				$tagsToShow[] = array('color' => $color, 'light' => $light, 'tag' => trim($val));
            }
        }
         

        $ret = array();
        foreach ($tagsToShow as $val) {
            if (isset($ret[$val['color']])) {
                $ret[$val['color']]['tag'] = $ret[$val['color']]['tag'] . ', ' . $val['tag'];
            } else {
                $ret[$val['color']] = $val;
            }
        }
        return array_values($ret);
    }

    static function clenupString($str, $mp = true, $p = false)      {
        $str = htmlspecialchars_decode($str);
        $str = preg_replace('/' . base64_decode('W15hLXpBLVowLTkgXC4sw6HDpMSNxI/DqcSbw6vDrWnEvsWIw7PDtsWZxaHFpcO6xa/DvMO9ecW+w4HDhMSMxI7DicSaw4vDjUnEvcWHw5PDlsWYxaDFpMOaxa7DnMOdWcW9XF9cLV0=') . '/', '', $str);
        $co = array(base64_decode('w6E='), base64_decode('w6Q='), base64_decode('xI0='), base64_decode('xI8='), base64_decode('w6k='), base64_decode('xJs='), base64_decode('w6s='), base64_decode('w60='), base64_decode('aQ=='), base64_decode('xL4='), base64_decode('xYg='), base64_decode('w7M='), base64_decode('w7Y='), base64_decode('xZk='), base64_decode('xaE='), base64_decode('xaU='), base64_decode('w7o='), base64_decode('xa8='), base64_decode('w7w='), base64_decode('w70='), base64_decode('eQ=='), base64_decode('xb4='), base64_decode('w4E='), base64_decode('w4Q='), base64_decode('xIw='), base64_decode('xI4='), base64_decode('w4k='), base64_decode('xJo='), base64_decode('w4s='), base64_decode('w40='), base64_decode('SQ=='), base64_decode('xL0='), base64_decode('xYc='), base64_decode('w5M='), base64_decode('w5Y='), base64_decode('xZg='), base64_decode('xaA='), base64_decode('xaQ='), base64_decode('w5o='), base64_decode('xa4='), base64_decode('w5w='), base64_decode('w50='), base64_decode('WQ=='), base64_decode('xb0='));
        $za = array('a', 'a', 'c', 'd', 'e', 'e', 'e', 'i', 'i', 'l', 'n', 'o', 'o', 'r', 's', 't', 'u', 'u', 'u', 'y', 'y', 'z', 'A', 'A', 'C', 'D', 'E', 'E', 'E', 'I', 'I', 'L', 'N', 'O', 'O', 'R', 'S', 'T', 'U', 'U', 'U', 'Y', 'Y', 'Z');
        $str = str_replace($co, $za, $str);
        if ($p) {
            $co = array(' ', '.', ',');
            $za = array('-', '-', '-');
        } else {
            $co = array(' ', '.', ',', '-_', '_-');
            $za = array('-', '-', '-', '-', '-');
        }
        $str = str_replace($co, $za, $str);
        $str = strtolower($str);
        if ($mp) {
			$str = preg_replace('/-{2,}/', '-', $str);
			$str = trim($str, '-');
        }
        return $str;
    }

    private function utf8_urldecode($str)
    {
        $str = preg_replace("/%u([0-9a-f]{3,4})/i", "&#x\\1;", urldecode($str));
        return html_entity_decode($str, null, 'UTF-8');
    }

     
    private static function setEn($w = 0)
    {
        if (self::$enSet) return;
		if ($w == 0) {
			$w = time();
		}

		$request = slRequest::instance();
		$session = slSession::instance();
		$days = array('monday' => 1, 'tuesday' => 2, 'wednesday' => 3, 'thursday' => 4, 'friday' => 5, 'saturday' => 6, 'sunday' => 7);
		$week_begins = $session->getMain("['week_begins']");

		$begins_on_today = $session->getMain("['begin_on_today']");

		self:: $firstDayOfTheWeek = $days[$week_begins];

		if ($begins_on_today == 1 && $request->get('all.view') != 'event.month') {
			$week_begins = date('w', $w);
			if ($week_begins == 0) {
				$week_begins = 7;
			}
			self::$firstDayOfTheWeek = $week_begins;
		}

		self::$en = false;
		self::$enSet = true;

		$domaindata = Storage::getDomainDefaults('calendar_settings', false);
		$defaultdata = Storage::getDefaults('calendar_settings');
		$calendar_settings = WebmailIqPrivate::get('calendar_settings', $defaultdata, $domaindata, null, 0);
		$startDay = strtolower($calendar_settings['@childnodes']['item'][0]['@childnodes']['week_begins'][0]['@value'] ?? null);
		self::$firstDayOfTheWeek = $days[$startDay] ?? self::$firstDayOfTheWeek;
    }

     
    private static function getEn()
    {
        return self::$en;
    }

    public function getPublicCalendarContainer(&$info)
    {
        $email = slRequest::instance()->get('all.email');
        if (!$_SESSION['PUBLIC_CALENDAR'] || (isset($email) && $email != $_SESSION['PUBLIC_EMAIL'])) {

            $account = new stdClass();
            $gwAccount = new GroupWareAccount('', '', $account);
            if (!$email && !$_SESSION['PUBLIC_CALENDAR']) {
                throw new Exception('Public Calendar: No email');
            }
            $gid = $gwAccount->gwAPI->OpenGroup('~' . $email);
            if (!$gid) {
                throw new Exception('Public Calendar: Can\'t open Group');
            }
            $list = $gwAccount->getFolders();
            if (is_array($list) && !empty($list)) foreach ($list as $folder) {
                if ($folder->getType() == 'E' && $folder->isDefault()) {
                    $defaultEvents = $folder;
                    break;
                }
            }
            if (!$defaultEvents) {
                throw new Exception('Public Calendar: Can\'t retrieve default events folder');
            }

            $_SESSION['PUBLIC'] = true;
            if ($email) {
                $_SESSION['PUBLIC_EMAIL'] = $email;
            }
            $_SESSION['PUBLIC_CALENDAR'] = $defaultEvents;

        } else {
            $defaultEvents = $_SESSION['PUBLIC_CALENDAR'];
            slRequest::instance()->set('all.email', $_SESSION['PUBLIC_EMAIL']);
        }
        $info['id'] = $defaultEvents->name;
        $info['type'] = $defaultEvents->getType();
        return $defaultEvents;
    }

    public function getContainer($param, &$info)
    {
        if (slRequest::instance()->get('all.public')) {
            $container = $this->getPublicCalendarContainer($info);
            return $container;
        }
        $type = slRequest::instance()->get('all._s.type');
        if (Folder::isRestrictedType($type)) {
            $result = new stdClass();
            $result->error = new Exc('folder_type_restricted', slToolsPHP::htmlspecialchars($type));
            $result->redirect = true;
            $result->redirectURL = slRequest::instance()->getPath() . '?_l=folder&p0=main&p1=content&p2=mail.main&p3=item.fdr&p4=INBOX&p5=M';
            return slApplication::instance()->finish($result);
        }
        $this->getData($param);
        $folder = $this->data['id'];
        $oUser = &$_SESSION['user'];
        if (!$this->data['id']) {
            $folder = 'INBOX';
        }
        $oAccount = $oUser->getAccount($_SESSION['EMAIL']);
        if (strpos($folder, '__@@VIRTUAL@@__') === 0) {
            $oAccount = $oAccount->virtualAccount;
        }
        $oFolder = $oAccount->getFolder($folder);
        $helper['helper'] = 'folder';
        $folderHelper = slHelperFactory::instance($helper);
        $sentName = $folderHelper->getMappedFolderName('sent', true);
        if (!$sentName) {
            $sentName = 'Sent';
        }
        if ($oFolder->name == $sentName) {
            $info['isSent'] = true;
        } else {
            $info['isSent'] = false;
        }
        $info['id'] = $oFolder->name;
        $info['type'] = $oFolder->getType();
        $info['item'] = $this->data['item'];

        return $oFolder;
    }

    public function getFilter(&$container, &$param, &$info)
    {
        $request = slRequest::instance();
                 if (!$this->data['page']) {
            $this->data['page'] = 1;
        }

        $view_type = $request->get('all.type');

        if (!$this->data['interval']) {
            $view = $request->get('all._n.p.content');
            if($view == 'contact.main' || $view == 'contact.select'){
				if ($this->data['filter']) {
					$filter['sql'] = $this->data['filter'];
				}
			}elseif($view == 'event.main'){
				if (stripos($param['columns'], 'EVNCLASS') == false) {
					$param['columns'] .= ',EVNCLASS';
				}
				$template = $request->get('all.view');

				if($template == 'event.list'){
					$info['showListing'] = true;
				}else{
					$info = self::getWeek();
					$templateView = '';
					if ($template) {
						$templateView = substr($template, strrpos($template, '.') + 1);
					}
					if ($view_type) {
						$templateView = $view_type;
					}
					if($templateView == 'month'){
						$start = $info['this_month']['start'];
						$end = $info['this_month']['end'];
					}elseif($templateView == 'all' || $templateView == 'day'){
						$start = $info['this_day']['start'];
						$end = $info['this_day']['end'];
					}else{
						$start = $info['this_week']['start'];
						$end = $info['this_week']['end'];
					}
					$this->data['interval']['start'] = $start;
					$this->data['interval']['end'] = $end;
				}
			}
        }

        if ($search = $this->data['search']) {
            slSystem::import('tools/search');
            $tool = new SearchTool();
            $tool->setType($container->getType());
            $tool->setAccount($container->account);
            $filter['sql'] = '(' . $tool->parse($search) . ')';
        }
        if ($this->data['sort']) {
            $this->data['orderby'] = $this->data['sort'];
        }
        if($container instanceof IMAPFolder) $filter['sql'] = $container->filterTagsToSql($filter['sql']);
        $itemsCount = $container->countItems(0, true, $filter['sql']);

        $filter['tag'] = $param['columns'];
                 if ($this->data['interval']) {
            $start = $this->data['interval']['start'];
            $end = $this->data['interval']['end'];
            $start = MerakGWAPI::unix2calendarDate($start);
            $end = MerakGWAPI::unix2calendarDate($end);
            $filter['interval'] = $start . '-' . $end;
                     } else {
                         $filter['orderby'] = $this->data['orderby'];
            $info['page'] = $this->data['page'];
            if (!$filter['orderby']) {
                $filter['orderby'] = $param['orderby'];
            }
            if ($param['limit']) {
                $info['total'] = ceil($itemsCount / $param['limit']);
            }
            $info['total'] = $info['total'] ? $info['total'] : 1;
            $info['itemsCount'] = $itemsCount;

            if ($info['page'] <= 1) {
                $info['page'] = 1;
            } else if ($info['page'] > $info['total']) {
                $info['page'] = $info['total'];
            }
            $filter['limit'] = $param['limit'];
            $filter['offset'] = $filter['limit'] * ($info['page'] - 1);
            $info['hasNext'] = ($filter['offset'] + $filter['limit'] < $itemsCount) ? true : false;
            $info['hasPrev'] = ($info['page'] > 1) ? true : false;
        }
        $filter['timezone'] = $_SESSION['CTZ'];
        $request = slRequest::instance();
        $info['link'] = $request->getURI(false);

                 if ($request->get('all.public') && strpos($info['link'], '_n[p][main]=win.main.public') === false) {
            $info['link'] .= '&_n[p][main]=win.main.public';
        }

        $info['controller'] = $param['controller'];
        return $filter;
    }

	 
    public function gridWidget($param)
    {
        $this->param = $param;
        $result = array();
                 try {
            $container = $this->getContainer($param, $result['container']);
			$delayedResult = true;
            if ($container->account && $container->account->isDelayed()) {
                $delayedResult = $container->account->syncDelayedFolders();
            }
                         $session = slSession::instance();
            $sessionVar = '["sync"]["folder"]["' . md5($container->name) . '"]';
            $lastSync = $session->getMain($sessionVar);
            $lastSync = $lastSync ? $lastSync : 0;

            if (time() - $lastSync > 60) {
                $session->setMain($sessionVar, time());
                if ($delayedResult) {
                    $container->sync();
                }
            }
            if ($container->name == 'INBOX') {
                $result['container']['unread'] = $container->countItems(Item::FLAG_SEEN);
            }
                         $filter = $this->getFilter($container, $param, $result['info']);
                         $oItems = $container->getItems($filter);

                         require_once('inc/webmailiqitems.php');
            if (method_exists($this, "convert" . $container->getType())) {
                $result['data'] = WebmailIQItems::cnvItems($oItems, $filter, array('class' => $this, 'method' => 'convert' . $container->getType()));
            } else {
                $result['data'] = WebmailIQItems::cnvItems($oItems, $filter);
            }
            $finish = $container->getType() . 'finishHandler';
                         if (method_exists($this, $finish)) {
                $result['data'] = $this->$finish($result['data'], $result['info']);
            }
        } catch (Exception $e) {
            $result['info']['link'] = 'DUMMY#1';
        }
                 $folderHelper['helper'] = 'folder';
        $fHelper = slHelperFactory::instance($folderHelper);
        $type = slRequest::instance()->get('all._s.type') ? slRequest::instance()->get('all._s.type') : 'M';
        $fHelper->getPersonalFolders($type);
        return $result;
    }

    protected function fillResultData(& $result, $DTFormats, $request, string $mailAction)
	{
		$result['data']['mail_action'] = $mailAction;
		$result['data']['date'] = @date($DTFormats['date'] . self::convertTimeFormat(" H:i:s", $DTFormats['time']), $result['data']['date']);
		$result['data']['sourceid'] = $result['data']['id'];
		$result['data']['sourcefolder'] = $this->data['id'];
		$result['data']['sourceaccount'] = $_SESSION['EMAIL'];
		$result['data']['sourceaction'] = $mailAction;
		if ($request->get('all._s.sourceid')) {
			$result['data']['sourceid'] = $request->get('all._s.sourceid');
			$result['data']['sourcefolder'] = $request->get('all._s.sourcefolder');
			$result['data']['sourceaccount'] = $request->get('all._s.sourceaccount');
			$result['data']['sourceaction'] = $request->get('all._s.sourceaction');
		}
		$this->createMessageEnvelope($mailAction, $result);
	}

	protected function handleAddressArray(& $result, $addresses, & $my_addr)
	{
		if (!is_array($addresses)) return;
		foreach ($addresses as $address) {
			if (!$address['address']) {
				continue;
			}
			if ($address['address'] != $address['display'] && $address['display']) {
				$addr = '"' . $address['display'] . '" <' . $address['address'] . '>';
			} else {
				$addr = $address['address'];
			}
			if (isset($result[$address['address']])) {
				if ($address['address'] != $address['display']) {
					$result[$address['address']] = $addr;
				} else {
					continue;
				}
			}
			if ($_SESSION['EMAIL'] == $address['address']) {
				$my_addr = $addr;
				if (!isset($fromAddresses[$address['address']])) {
					continue;
				}
			}

			$result[$address['address']] = $addr;
		}
	}

    public function mailviewWidget($param)
    {
        $DTFormats = self::getDTFormats();

        $session = slSession::instance();
        $request = slRequest::instance();
        $priorityTrans = array('highest' => 1, 'high' => 2, 'normal' => 3, 'low' => 4, 'lowest' => 5);
		$result = [];
		$newMessage = $blocked = null;
                          if ($request->get('all.raw')) {
            $container = $this->getContainer($param, $result['info']);
            $item = $container->getItem($this->data['item']);
            $data = $item->parseMessage(true, 1, $newMessage, false, $blocked, false, false, true);
            $items[0]['html'] = $data['html_body'];
            if (!$items[0]['html']) {
                $items[0]['html'] = slToolsString::text2html($data['plain_body']);
            }
            $items[0]['text'] = $data['plain_body'];
            $items[0]['type'] = $data['content-type'];
            $items[0]['subject'] = $data['headers']['subject'];
            $items[0]['attachments'] = $data['attachments'];
            $items[0]['x_icewarp_server_request'] = $data['headers']['x_icewarp_server_request'];
            $result['data'] = $items[0];
        } else if ($param['htmlOnly']) {
            $items[0]['html'] = $session->getPage('html');
            $items[0]['text'] = $session->getPage('text');
            $items[0]['type'] = $session->getPage('type');
            $items[0]['subject'] = $session->getPage('subject');
            $items[0]['attachments'] = $session->getPage('attachments');
            $items[0]['x_icewarp_server_request'] = $session->getPage('x_icewarp_server_request');
            $items[0]['aditional'] = $session->getPage('aditional');

            $result['data'] = $items[0];
        } else {

            $action = $request->get('all._s.action');

            switch ($action) {
                case 'error':
                case 'session':
                    if ($request->get('all._n.p.content') != 'mail.view') {
                        break;
                    }
                case 'replytoall':
                case 'reply':
                case 'forward':
                case 'continue':
                default:
                    try {

                        $container = $this->getContainer($param, $result['info']);
                        if ($request->get('all._n.p.content') == 'mail.view') {

                            if ($_SESSION['SPAM_FOLDER'] && $container->name == $_SESSION['SPAM_FOLDER_NAME']) {
                                $block_external = true;
                            } else {
                                $settingsConstructor['helper'] = 'settings';
                                $settings = slHelperFactory::instance($settingsConstructor);
                                $default = $settings->getPrivate('mail_settings_general');
                                $default = $default['@childnodes']['item'][0]['@childnodes'];
                                $block_external = !intval($default['show_images'][0]['@value']);
                            }
                        }

                        if ($request->get('all.show_external_images')) {
                            $block_external = false;
                        }
                        $result['container'] = $result['info'];

                                                 $oItem = $container->getItem($this->data['item']);
						$unread = true;
                        if ($oItem->flags & Item::FLAG_SEEN) {
                            $unread = false;
                        }
                                                 if (method_exists($oItem, 'markAsRead')) {
                            $oItem->markAsRead();
                        }
                                                 require_once('inc/webmailiqitems.php');
                        $filter = array();
                        $filter['tag'] = "*";
                        $items[0] = $oItem;

                        $items = WebmailIQItems::cnvItems($items, $filter, ['class' => $this, 'method' => 'convertM'],true, 1, false, $block_external,$blocked);  
                                                 if (isset($items[0]['attachments'])) {
                            if (isset($items[0]['attachments']['num'])) {
                                foreach ($items[0]['attachments']['num'] as $key => $val) {
                                    if (isset($val['smart']) && $val['smart'] == 1 && isset($val['all']) && $val['all'] == true) {
                                        $items[0]['attachments']['num'][$key]['name'] = slLanguage::instance()->get('mail_view', "download_all");
                                    }
                                }
                            }

                            $router = slRouter::instance();
                            $url = MODEL_PATH . 'download.php';
                            $linkParam['sid'] = $_SESSION['SID'];
                            $linkParam['class'] = 'attachment';
                            if ($items[0]['attachments']['num']) {
                                foreach ($items[0]['attachments']['num'] as $key => $attachment) {
                                    $linkParam['fullpath'] = rawurlencode($oItem->folder->account->accountID) . '/' . rawurlencode($oItem->folder->name) . '/' . $oItem->itemID . '/' . $attachment['part_id'];
                                    $items[0]['attachments']['num'][$key]['link'] = $router->getCustomLink($linkParam, true, false, $url, true);
                                     
                                    $preview = explode('?', $items[0]['attachments']['num'][$key]['link']);
                                     
                                    $items[0]['attachments']['num'][$key]['preview'] = 'tools/preview.php?' . $preview[1];
                                    $items[0]['attachments']['num'][$key]['class'] = 'attachment';
                                    $items[0]['attachments']['num'][$key]['fullpath'] = $linkParam['fullpath'];
                                    $fParse = explode('.', $items[0]['attachments']['num'][$key]['name']);
                                    $extension = strtolower($fParse[count($fParse) - 1]);
                                    if (in_array($extension, self::$imgEx)) {
                                        $items[0]['attachments']['num'][$key]['isimg'] = true;
                                    }
                                }
                            }
                        }

                        $result['data'] = $items[0];
                        $result['data']['type'] = $result['data']['content-type'];
                        if ($result['data']['type'] == 'text') {
                            $result['data']['html'] = "<pre>" . $result['data']['html'] . "</pre>";
                        }
                        $result['data']['text'] = slToolsPHP::htmlspecialchars($result['data']['text']);
                        $result['data']['plain'] = $result['data']['text'];
                        $result['data']['unread'] = $unread;
                        $result['data']['block_external'] = $block_external && $blocked;
                        if ($request->get('all._n.p.content') == 'mail.view') {

                            $prev = $this->getPrevLink($container, $oItem);
                            $next = $this->getNextLink($container, $oItem);

                            unset($this->cachedIDs);
                            $result['data']['navigation']['prev'] = $prev;
                            $result['data']['navigation']['next'] = $next;
                        }

                    } catch (Exception $e) {}
                    break;
            }

            $helperConstructor['helper'] = 'settings';
            $settings = slHelperFactory::instance($helperConstructor);
                         $sset = $settings->getPrivate('signature');
            $bset = $sset;
            $mail_settings_default = $settings->getPrivate('mail_settings_default');

            $sightml = $bset['@childnodes']['item'][0]['@childnodes']['text'][0]['@value'];
            $sightml = preg_replace('/server\/download\.php\?sid=([^&]+)/si', '../server/download.php?sid=' . $_SESSION['SID'], $sightml);

                                      $sightml = preg_replace("/\?sid=([^&\s\"']{0,})('|\"|\s|&)/si", "?sid=" . $_SESSION['SID'] . "$2", $sightml);
                         $sightml = preg_replace("/fullpath=({account})(%2F[^&\s\"']{0,})/si", "fullpath=" . urlencode($_SESSION['EMAIL']) . "$2", $sightml);

            $sig['html'] = slToolsString::unhtmlspecialchars($sightml);
            $sig['text'] = slToolsString::removeHTML($sig['html']);

            $sig['to_top'] = $sset['@childnodes']['item'][0]['@childnodes']['to_top'][0]['@value'];

            switch ($action) {
                case 'reply':
                	$this->fillResultData($result, $DTFormats, $request, 'replay');
					 					$this->createConversationHeaders($result);
                                         if ($result['data']['reply_to']) {
                        $result['data']['to'] = $result['data']['reply_to'];
                    } else {
                        $result['data']['to'] = $result['data']['from'];
                    }
                    $result['data']['cc'] = '';
                    $result['data']['bcc'] = '';
                    unset($result['data']['attachments']);
                    $result['data']['text'] = $this->addSignature($result['data']['text'], "\r\n" . $sig['text'], 'text', $sig['to_top']);
                    $result['data']['html'] = $this->addSignature($result['data']['html'], "<br />" . $sig['html'], 'html', $sig['to_top']);

                    break;
                case 'replytoall':
                    $this->fillResultData($result, $DTFormats, $request, 'replay');
					 					$this->createConversationHeaders($result);
                                         $from = MailParse::parseAddresses($result['data']['from']);
                    $to = MailParse::parseAddresses($result['data']['to']);
                    $cc = MailParse::parseAddresses($result['data']['cc']);
                    $reply_to = MailParse::parseAddresses($result['data']['reply_to']);
                    if ($reply_to) {
                        $from = $reply_to;
                    }
                    if ($from) foreach ($from as $faddr) {
                        $fromAddresses[$faddr['address']] = 1;
                    }
                    $from = is_array($from) ? $from : array();
                    $to = is_array($to) ? $to : array();
                    $cc = is_array($cc) ? $cc : array();

                    @$addresses = slToolsPHP::array_merge($from, $to);
					$my_addr = false;
					$this->handleAddressArray($reply_all, $addresses, $my_addr);

					$reply_cc = array();
					$this->handleAddressArray($reply_cc, $cc, $my_addr);

                    if ($my_addr && empty($reply_all)) {
                        $reply_all[$_SESSION['EMAIL']] = $my_addr;
                    }
                    $reply_all = join(', ', $reply_all);
                    $reply_cc = join(', ', $reply_cc);

                    $result['data']['to'] = $reply_all;
                    $result['data']['cc'] = $reply_cc;
                    $result['data']['bcc'] = '';
                    unset($result['data']['attachments']);
                    $result['data']['text'] = $this->addSignature($result['data']['text'], "\r\n" . $sig['text'], 'text', $sig['to_top']);

                    $result['data']['html'] = $this->addSignature($result['data']['html'], "<br />" . $sig['html'], 'html', $sig['to_top']);
                    break;
                case 'forward':
					$this->fillResultData($result, $DTFormats, $request, 'forward');

                    $result['data']['to'] = '';
                    $result['data']['cc'] = '';
                    $result['data']['bcc'] = '';
                    $result['data']['text'] = $this->addSignature($result['data']['text'], "\r\n" . $sig['text'], 'text', $sig['to_top']);
                    $result['data']['html'] = $this->addSignature($result['data']['html'], "<br />" . $sig['html'], 'html', $sig['to_top']);
                    break;
                 
                case 'continue':
					$result['data']['draftid'] = $result['data']['id'];
					$result['data']['draftfolder'] = $this->data['id'];
					$result['data']['draftaccount'] = $_SESSION['EMAIL'];

					if ($request->get('all._s.sourceid')) {
						$result['data']['sourceid'] = $request->get('all._s.sourceid');
						$result['data']['sourcefolder'] = $request->get('all._s.sourcefolder');
						$result['data']['sourceaccount'] = $request->get('all._s.sourceaccount');
						$result['data']['sourceaction'] = $request->get('all._s.sourceaction');
					}
					if ($request->get('all._s.draftid')) {
						$result['data']['draftid'] = $request->get('all._s.draftid');
						$result['data']['draftfolder'] = $request->get('all._s.draftfolder');
						$result['data']['draftaccount'] = $request->get('all._s.draftaccount');
					}

					$result['data']['mail_action'] = 'draft';
					if ($result['data']['type'] == 'text') {
						$result['data']['html'] = $result['data']['text'];
					} else {
						$result['data']['type'] = 'html';
						$result['data']['text'] = slToolsString::removeHTML($result['data']['html']);
					};
					$result['data']['html'] = slToolsPHP::htmlspecialchars($result['data']['html']);
					$result['data']['text'] = slToolsPHP::htmlspecialchars($result['data']['text']);
					break;
                case 'error':
                case 'session':
                    if ($request->get('all._n.p.content') != 'mail.view') {
                                                 $session = slSession::instance();
                        $id = $request->get('all._s.message_id');
                        $mail = $session->getMain('["compose"]["' . $id . '"]["mail"]');
                        $formData = $session->getMain('["compose"]["' . $id . '"]["form"]');

                        $result['data'] = $this->mailToForm($mail, $id, $formData);

                        $result['data']['to'] = urldecode($result['data']['to']);

                        if ($formData['mail_action']) {
                            $result['data']['mail_action'] = $formData['mail_action'];
                        }
                        $result['data']['options'] = $formData['options'];
                        if (!$result['data']['html'] && !$result['data']['text']) {
                            $result['data']['type'] = $result['data']['options']['type'];
                        }
                        if ($request->get('all._s.sourceid')) {
                            $result['data']['sourceid'] = $request->get('all._s.sourceid');
                            $result['data']['sourcefolder'] = $request->get('all._s.sourcefolder');
                            $result['data']['sourceaccount'] = $request->get('all._s.sourceaccount');
                            $result['data']['sourceaction'] = $request->get('all._s.sourceaction');
                        }
                        if ($request->get('all._s.draftid')) {
                            $result['data']['draftid'] = $request->get('all._s.draftid');
                            $result['data']['draftfolder'] = $request->get('all._s.draftfolder');
                            $result['data']['draftaccount'] = $request->get('all._s.draftaccount');
                        }
                        $result['data']['html'] = slToolsPHP::htmlspecialchars($result['data']['html']);
                        $result['data']['text'] = slToolsPHP::htmlspecialchars($result['data']['text']);
                    } else {
                        $session = slSession::instance();
                        $id = $request->get('all._s.message_id');
                        $formData = $session->getMain('["compose"]["' . $id . '"]["form"]');
                        @$result['data']['fast_reply'] = Tools::unhtmlspecialchars($formData['html']);
                    }
                    break;
                  default:

                if ($request->get('all._n.p.content') == 'mail.compose') {

                    $result['data']['text'] = $this->addSignature($result['data']['text'], "\r\n" . $sig['text'], 'text', $sig['to_top']);

                    if (trim($sig['html']) == '') {
                        $result['data']['html'] = '';
                    } else {
                        $result['data']['html'] = $this->addSignature($result['data']['html'], "<br />" . $sig['html'], 'html', $sig['to_top']);
                    }
                }
                break;
            }

            $replyFullpath = $result['data']['reply_fullpath'];
            $fwdFullpath = $result['data']['forward_fullpath'];

            if ($replyFullpath || $fwdFullpath) {

                if ($replyFullpath) {
                    $fullpath = Tools::parseFullpath($replyFullpath, 'item');
                }
                if ($fwdFullpath) {
                    $fullpath = Tools::parseFullpath($fwdFullpath, 'item');
                }
                $result['data']['sourceid'] = $fullpath['item'];
                $result['data']['sourcefolder'] = $fullpath['folder'];
                $result['data']['sourceaccount'] = $fullpath['account'];
                $result['data']['sourceaction'] = $replyFullpath ? 'reply' : 'forward';
            }
            $result['data']['signature'] = $sig;

            $basic = $settings->getPrivate('basic');
            $mail_settings_default = $settings->getPrivate('mail_settings_default');
            $mail_settings_default = $mail_settings_default['@childnodes']['item'][0]['@childnodes'];
            $basic = $basic['@childnodes']['item'][0]['@childnodes'];

            if ($request->get('all._n.p.content') == 'mail.compose') {
                                 $pset = $settings->getPrivate('personalities');

                $fa = MailParse::parseAddresses($result['data']['options']['alias']);

                if (!isset($result['data']['options']['alias']) && isset($mail_settings_default['from'])) {
                	$fa = MailParse::parseAddresses(Tools::unhtmlspecialchars($mail_settings_default['from'][0]['@value']));
                }

                $fa = $fa[0]['address'];

                if (is_array($pset['@childnodes']['item']) && !empty($pset['@childnodes']['item'])) {
                    foreach ($pset['@childnodes']['item'] as $item) {
                        $personality = array();
                        $personality['person'] = $item['@childnodes']['person'][0]['@value'];
                        $info = MailParse::parseAddresses(Tools::unhtmlspecialchars($personality['person']));
                        if ($info[0]['address'] == $fa) {
                            $personality['selected'] = true;
                        }

                        $personalities[] = $personality;
                    }
                }

                $als = $settings->getPrivate('aliases');
                $personalities = $als;

                if (isset($personalities) && is_array($personalities) && !empty($personalities)) {
                    foreach ($personalities as $key => $val) {
                        $info = MailParse::parseAddresses(slToolsString::unhtmlspecialchars($val['email']));
                        if ($info[0]['address'] == $fa) {
                            $personalities[$key]['selected'] = true;
                        }
                    }
                }

                $result['data']['personalities'] = $personalities;
            }

             			$default_personality = false;
			if (isset($mail_settings_default['from'])) {
                $default_personality = $mail_settings_default['from'][0]['@value'];
            }

			$save_sent_message = 1;
			$force_save_sent_message = false;
            if (isset($mail_settings_default['save_sent_message'])) {
                $save_sent_message = $mail_settings_default['save_sent_message'][0]['@value'];
                $force_save_sent_message = $mail_settings_default['save_sent_message'][0]['@attributes']['access'] == 'view' ? true : false;
            }

			$read_confirmation = 0;
			$force_read_confirmation = 0;
            if (isset($mail_settings_default['read_confirmation'])) {
                $read_confirmation = $mail_settings_default['read_confirmation'][0]['@value'];
                $force_read_confirmation = $mail_settings_default['read_confirmation'][0]['@attributes']['access'] == 'view' ? true : false;
            }

			$priority = 3;
			$force_priority = false;
            if (isset($mail_settings_default['priority'])) {
                $priority = $mail_settings_default['priority'][0]['@value'];
                $force_priority = $mail_settings_default['priority'][0]['@attributes']['access'] == 'view' ? true : false;
            }

            $msg_type = $basic['html_message'][0]['@value'];
            $force_msg_type = $basic['html_message'][0]['@attributes']['access'] == 'view' ? true : false;

            $result['data']['options']['default_personality'] = $default_personality;

            $msg_type = $msg_type ? 'html' : 'text';
            if (!isset($result['data']['options']['request_read_confirmation'])) {
                $result['data']['options']['request_read_confirmation'] = $read_confirmation;
            }
            if (!isset($result['data']['options']['save_sent_message'])) {
                $result['data']['options']['save_sent_message'] = $save_sent_message;
            }
            if (!isset($result['data']['options']['priority'])) {
                $result['data']['options']['priority'] = $priority;
                $untrans = array_flip($priorityTrans);
                $result['data']['options']['priority_val'] = $untrans[$priority];
            }
            if (!isset($result['data']['options']['save_sent_message'])) {
                $result['data']['options']['save_sent_message'] = $msg_type;
            }

                         if (self::isMobile()) {
                $force_msg_type = true;
                $msg_type = 'text';
            }

            $result['data']['force']['request_read_confirmation'] = $force_read_confirmation;
            $result['data']['force']['save_sent_message'] = $force_save_sent_message;
            $result['data']['force']['priority'] = $force_priority;
            $result['data']['force']['type'] = $force_msg_type;
            if (!$result['data']['type']) {
                $result['data']['type'] = $msg_type;
            }

            $result['data']['br'] = "\r\n";
            if (!$_SESSION['jscheck'] || self::isMobile()) {
                $result['data']['type'] = 'text';
            }
                         $this->separateAddresses($result, 'reply_to');
            $this->separateAddresses($result, 'from');
            $this->separateAddresses($result, 'to');
            $this->separateAddresses($result, 'cc');
            $this->separateAddresses($result, 'bcc');

            $session->setPage('html', $result['data']['html']);
            $session->setPage('text', "<pre>" . $result['data']['text'] . "</pre>");
            $session->setPage('type', $result['data']['type']);
            $session->setPage('subject', $result['data']['subject']);
            if ($result['data']['x_icewarp_server_request']) {
                $session->setPage('x_icewarp_server_request', $result['data']['x_icewarp_server_request']);
            }

            $session->setPage('aditional', $result['data']['aditional']);
             
            if ($result['data']['attachments']['num']) {
                foreach ($result['data']['attachments']['num'] as $key => $attachment) {
                    if ($attachment['imip_xml']) {
                        unset($result['data']['attachments']['num'][$key]['imip_xml']);
                    }
                }
            }
            $session->setPage('attachments', $result['data']['attachments']);
        }

        $result['data']['from'] = stripslashes($result['data']['from']);
        $result['data']['to'] = stripslashes($result['data']['to']);
        $result['data']['reply_to'] = stripslashes($result['data']['reply_to']);
        $result['data']['cc'] = stripslashes($result['data']['cc']);
        $result['data']['bcc'] = stripslashes($result['data']['bcc']);
        return $result;
    }

    private function getPrev($container, $id)
    {
        if (!$this->cachedIDs) {
            $this->cachedIDs = $this->getCachedIDs($container);
        }
        $index = array_search($id, $this->cachedIDs);

        if ($index > 0) {
            return $this->cachedIDs[$index - 1];
        }
        return false;
    }

    private function getNext($container, $id)
    {
        if (!$this->cachedIDs) {
            $this->cachedIDs = $this->getCachedIDs($container);
        }
        $index = array_search($id, $this->cachedIDs);
        if ($index < count($this->cachedIDs)) {
            return $this->cachedIDs[$index + 1];
        }
        return false;
    }

    private function getPrevLink($container, $item)
    {
        if ($prev = $this->getPrev($container, $item->itemID)) {
            $linkItem = clone($item);
            $linkItem->itemID = $prev;
            return $this->getItemLink($linkItem, array(), 'item');
        }
        return false;
    }

    private function getNextLink($container, $item)
    {
        if ($next = $this->getNext($container, $item->itemID)) {
            $linkItem = clone($item);
            $linkItem->itemID = $next;
            return $this->getItemLink($linkItem, array(), 'item');
        }
        return false;
    }

    public function getCachedIDs($container)
    {
        $request = slRequest::instance();
        $param['search'] = $request->get('all._s.search');
        $param['sort'] = $request->get('all._s.sort');
        $filter = $this->getFilter($container, $param, $info);
        if (!$filter['orderby']) {
            $filter['orderby'] = 'date DESC';
        }
        $filter['tag'] = 'item_id';

        $items = $container->getItems($filter, false);
        return array_keys($items);
    }

    public function separateAddresses(&$result, $index)
    {
        if ($result['data'][$index] && ($addresses = MailParse::parseAddresses($result['data'][$index]))) {
			foreach ($addresses as $address) {
				if ($address['display'] == $address['address']) {
					$name = strtok($address['address'], '@');
					$address['display'] = $name;
					 				} else {
					$address['cdisplay'] = addslashes($address['display']);
					$address['display'] = rawurlencode($address['display']);
				}
				$address['caddress'] = $address['address'];
				$address['address'] = rawurlencode($address['address']);
				$result['data']['aditional'][$index][] = $address;
			}
        }
    }

    public function formWidget($param)
    {
		$result = [];
        $detail = $param['detail'];
        $request = slRequest::instance();
        try {
            $container = $this->getContainer($param, $result['info']);
            try {
                if ($detail) {
                    $item = $container->getItem($this->data['item'], WITH_ADDONS, $_SESSION['CTZ']);
                    $items[0] = $item;
                    require_once('inc/webmailiqitems.php');
                    $filter = array();
                    $filter['tag'] = "*";

					$method = false;
                    if (method_exists($this, 'convert' . $container->getType() . 'Detail')) {
                        $method = array('class' => $this, 'method' => 'convert' . $container->getType() . 'Detail');
                    }
                    $oItem = reset($items);
                    $items = WebmailIQItems::cnvItems($items, $filter, $method, false, 1, false);
                    $item = reset($items);
                    $result['item'] = $item;
                    if ($item['attachments']) {
                        $file_id = reset($item['attachments']);
                        $file_id = $file_id['ATTNAME'];
                        $result['item']['file_id'] = str_replace(".", "*", $file_id);
                    }
                }
            } catch (Exc $e) {
                if ($container->getType() == 'E' || $container->getType() == 'T') {
                    $result['item'] = $this->newE();
                } elseif ($container->getType() == 'C') {
                    $result['item'] = $this->newC();
                }
            }

            $result['info']['controller'] = $param['controller'];

            $action = $request->get('all._s.action');
            if($action == 'session'){
				$session = slSession::instance();
				$id = $request->get('all._s.distrib_id');
				$is_dialog = $request->get('all.distribution_contact');
				$item = $session->getMain('["item"]["' . $id . '"]["item"]');
				if (!$is_dialog && $item) {
					$item['id'] = $item['ITM_ID'];
				}
				$formData = $session->getMain('["item"]["' . $id . '"]["form"]');
				$result['item'] = $item;
			}
        } catch (Exc $e) {}
        $result['info']['link'] = $request->getURI(false);
        return $result;
    }

    public function mailToForm($mail, $id, $formData)
    {
        $request = slRequest::instance();
        if (is_array($mail->to) && !empty($mail->to)) foreach ($mail->to as $to) {
            $result['to'][] = $this->completeAddress($to);
        }
        if (is_array($result['to']) && !empty($result['to'])) {
            $result['to'] = implode(', ', $result['to']);
        }
        if (is_array($mail->cc) && !empty($mail->cc)) foreach ($mail->cc as $cc) {
            $result['cc'][] = $this->completeAddress($cc);
        }
        if (is_array($result['cc']) && !empty($result['cc'])) {
            $result['cc'] = implode(', ', $result['cc']);
        }
        if (is_array($mail->bcc) && !empty($mail->bcc)) foreach ($mail->bcc as $bcc) {
            $result['bcc'][] = $this->completeAddress($bcc);
        }
        if (is_array($result['bcc']) && !empty($result['bcc'])) {
            $result['bcc'] = implode(', ', $result['bcc']);
        }

        $result['subject'] = $mail->Subject;
        if (is_array($mail->attachment) && !empty($mail->attachment)) foreach ($mail->attachment as $key => $attach) {
            $attachments[$key]['class'] = 'session';
            $attachments[$key]['fullpath'] = $id . '/' . $key;
            $attachments[$key]['name'] = $attach[2];
            $attachments[$key]['extension'] = substr($attach[2], strrpos($attach[2], '.') + 1);
        }
        $result['attachments'] = $attachments;

        if (strpos($mail->ContentType, 'plain') !== false) {
            $result['type'] = 'text';
            $result['html'] = slToolsString::text2html($mail->Body);
            $result['text'] = $mail->Body;
        } else {
            $result['type'] = 'html';
            $result['html'] = $mail->Body;
            $result['text'] = slToolsString::removeHTML($mail->Body);
        };
        if ($formData['draftid']) {
            $result['draftid'] = $formData['draftid'];
            $result['draftfolder'] = $formData['draftfolder'];
            $result['draftaccount'] = $formData['draftaccount'];
        }
        if ($formData['sourceid']) {
            $result['sourceid'] = $formData['sourceid'];
            $result['sourcefolder'] = $formData['sourcefolder'];
            $result['sourceaccount'] = $formData['sourceaccount'];
            $result['sourceaction'] = $formData['sourceaction'];
        }
        return $result;
    }

    private function completeAddress($addr)
    {
        if ($addr[1]) {
            if (substr($addr[1], 0, 2) != '\"') {
                $addr[1] = addslashes($addr[1]);
            } else {
                $addr[1] = str_replace("'", "\'", $addr[1]);
            }

            $result = '"' . $addr[1] . '"' . ' <' . $addr[0] . '>';
        } else {
            $result = $addr[0];
        }
        return $result;
    }


    public function getItemLink($oItem, $aItem, $link = false)
    {
                 $router = slRouter::instance('Request');
                 $linkType = $this->param['link'] ? $this->param['link'] : 'item';
                 $linkParam['window'] = 'main';
        $linkParam['target'] = $this->data['target'] ? $this->data['target'] : 'content';
        $linkParam['data'] = $this->data['data'] ? $this->data['data'] : 'item.fdr';
        $linkParam['type'] = $oItem->folder->getType();
        $linkParam['id'] = $oItem->folder->name;
        $linkParam['item'] = $oItem->itemID;
         
		$folderTypeView = [
			'M' => 'mail.view',
			'E' => 'event.detail',
			'C' => 'contact.detail',
			'T' => 'task.detail',
			'N' => 'note.detail',
			'J' => 'journal.detail',
			'F' => 'file.detail',
			'Q' => 'quarantine.view',
			'QL' => 'bwlist.view',
			'HIPAA' => 'hipaa.detail',
		];

		$linkParam['view'] = $folderTypeView[$oItem->folder->getType()] ?? null;
		if($oItem->folder->getType() == 'Q'){
			$linkParam['item'] = $aItem['id'];
		}

                 $link = $router->getCompressedLink($linkType, $linkParam);
        $request = slRequest::instance();
        if (($sort = $request->get('get._s.sort')) != false) {
            $link .= '&_s[sort]=' . rawurlencode($sort);
        }
        if (($search = $request->get('get._s.search')) != false) {
            $link .= '&_s[search]=' . rawurlencode($search);
        }
        return $link;
    }

     
    public function convertE(&$oItem, &$aItem, $notes = false)
    {
        $addon = $oItem->getAddons();
        $recurrence = $addon['recurrence']->getData();

        $wasSplitted = false;

        $DTFormats = self::getDTFormats();
        $time_format = $DTFormats['time'];

        $t = time();
        $m = microtime();
        $settingsConfig['helper'] = 'settings';
        $settings = slHelperFactory::instance($settingsConfig);
        $settings = $settings->get();

        self::setEn();
        $request = slRequest::instance();
        $tpl = $request->get('all.view');

        $tagsToShow = self::convertTags($aItem['EVNTYPE']);

         
        if ($this->week_start) {
            $winfo = $this->week_start;
        } else {
            if ($request->get('all._s.interval.start') != '') {
                $w = $request->get('all._s.interval.start');
                if ($tpl == 'event.month') {
                    $w += (86400 * 15);
                }
            } else {
                $w = time();
            }
            if ($tpl == 'event.month') {
                $winfo = self::getWeek($w, true, false, true);
            } else {
                $winfo = self::getWeek($w, true);
            }
            $this->week_start = $winfo;
        }
         

         
        if (!isset($this->uniqueid)) {
            $this->uniqueid = 0;
        } else {
            $this->uniqueid++;
        }

         
        $iinfo['id'] = $aItem['id'];
        $iinfo['month'] = @date("m", MerakGWAPI::calendar2unixTime(intval($aItem['EVNSTARTDATE']), intval($aItem['EVNSTARTTIME'])));
        $iinfo['day'] = @date("d", MerakGWAPI::calendar2unixTime(intval($aItem['EVNSTARTDATE']), intval($aItem['EVNSTARTTIME'])));
        $iinfo['hour'] = @date("G", MerakGWAPI::calendar2unixTime(intval($aItem['EVNSTARTDATE']), intval($aItem['EVNSTARTTIME'])));
        $iinfo['dayinweek'] = @date("w", MerakGWAPI::calendar2unixTime(intval($aItem['EVNSTARTDATE']), intval($aItem['EVNSTARTTIME'])));
        $iinfo['minute'] = @date("i", MerakGWAPI::calendar2unixTime(intval($aItem['EVNSTARTDATE']), intval($aItem['EVNSTARTTIME'])));
         

         
        if ($iinfo['minute'] % 5 != 0) $iinfo['minute'] = strval(round($iinfo['minute'] / 5) * 5);
         

         

        $iinfo['color'] = $aItem['EVNCOLOR'];

         
        if ($tpl != 'event.list') {
            if (self::getEn()) {
                $czdiw = $iinfo['dayinweek'];
            } elseif ($iinfo['dayinweek'] == 0) {
                $czdiw = 6;
            } else {
                $czdiw = $iinfo['dayinweek'] - 1;
            }

            $start_position = round((($iinfo['hour'] * 60) + $iinfo['minute']) / 30);

            $end_position = $start_position + round((MerakGWAPI::calendar2unixTime($aItem['EVNENDDATE'], $aItem['EVNENDTIME']) - MerakGWAPI::calendar2unixTime($aItem['EVNSTARTDATE'], $aItem['EVNSTARTTIME'])) / (30 * 60));

            $iinfo['left'] = floor($czdiw * 128) + 57 + 1;
            $iinfo['top'] = floor(($start_position / 30) * 13) + 42;
            $iinfo['width'] = 124;
        }

         
        if ($aItem['EVNSTARTTIME'] >= 0) {

            $startTime = @date(self::convertTimeFormat('H:i', $time_format), MerakGWAPI::calendar2unixTime($aItem['EVNSTARTDATE'], $aItem['EVNSTARTTIME']));
            $endTime = @date(self::convertTimeFormat('H:i', $time_format), MerakGWAPI::calendar2unixTime($aItem['EVNENDDATE'], $aItem['EVNENDTIME']));

            if ($tpl != 'event.list' && $end_position > 48 && $aItem['EVNSTARTTIME'] >= 0) {

                $wasSplitted = true;

                $advend = $end_position;
                 
                $i = 0;
                while ($advend > 0 && $i < 1000) {
                    $i++;
                    $identificator = $aItem['id'] . $this->uniqueid . "-ADV-$i";

                    $sttime = MerakGWAPI::calendar2unixTime($aItem['EVNSTARTDATE'], $aItem['EVNSTARTTIME']);

                    $eventStart = (mktime(0, 0, 0, @date('m', $sttime), @date('d', $sttime), @date('Y', $sttime)) + (($i - 1) * (24 * 60 * 60)));
                    $eventEnd = MerakGWAPI::calendar2unixTime($aItem['EVNENDDATE'], $aItem['EVNENDTIME']);

                    if (($tpl != 'event.month' && $eventStart >= $winfo['this_week']['start'] && $eventStart < $winfo['this_week']['end']) || ($tpl == 'event.month' && $eventStart >= $winfo['this_month']['start'] && $eventStart < $winfo['this_month']['end'])) {
                        $this->items[$identificator]['st'] = $eventStart;
                        $this->items[$identificator]['et'] = $eventEnd;

                        if ($i > 1) {
                            $size = 48;
                            if ($advend < 48) {
                                $size = $advend;
                            }
                            $this->items[$identificator]['start'] = 0;
                            $this->items[$identificator]['end'] = $size;
                            $this->items[$identificator]['size'] = $size;
                            $this->items[$identificator]['under'] = true;
                        } else {
                            $this->items[$identificator]['start'] = $start_position;
                            $this->items[$identificator]['end'] = 48;
                            $this->items[$identificator]['size'] = 48 - $start_position;
                            $this->items[$identificator]['over'] = true;
                        }

                        $diw = @date("w", $eventStart) - 1;
                        if ($diw == -1) {
                            $diw = 6;
                        }
                        $diw = $diw - self::$firstDayOfTheWeek + 1;
                        if ($diw < 0) {
                            $diw += 7;
                        }

                        $this->items[$identificator]['day'] = $diw;

                        $this->items[$identificator]['title'] = $aItem['EVNTITLE'];
                        $this->items[$identificator]['note'] = (isset($aItem['EVNNOTE']) ? $aItem['EVNNOTE'] : '');
                        $this->items[$identificator]['location'] = (isset($aItem['EVNLOCATION']) ? $aItem['EVNLOCATION'] : '');
                        $this->items[$identificator]['id'] = $aItem['id'];
                        $this->items[$identificator]['color'] = $aItem['EVNCOLOR'];
                        $this->items[$identificator]['tags'] = $tagsToShow;
                        $this->items[$identificator]['startT'] = $startTime;
                        $this->items[$identificator]['endT'] = $endTime;
                        if ($oItem->folder->name) {
                            $folder = $oItem->folder->name;
                        } else {
                            $folder = $settings['settings']['default_folders']['events'];
                        }
                        $this->items[$identificator]['link'] = '?_l=item&p0=main&p1=content&p2=event.detail&p3=item.fdr&p4=' . rawurlencode(MerakGWAPI::decode($aItem['EVNFOLDER'])) . '&p5=E&p6=' . $aItem['id'];
                        $this->items[$identificator]['folder'] = MerakGWAPI::decode($aItem['EVNFOLDER']);
                        $this->items[$identificator]['recurrence'] = $recurrence;
                    }
                    $advend -= 48;
                }
            }
        }

        if (!$wasSplitted) {

             
            $ts = MerakGWAPI::calendar2unixTime($aItem['EVNSTARTDATE'], $aItem['EVNSTARTTIME']);
            if ($aItem['EVNSTARTTIME'] != -1 || $tpl == 'event.list') {
                $this->items[$aItem['id'] . $this->uniqueid]['id'] = $aItem['id'];
                if ($oItem->folder->name) {
                    $folder = $oItem->folder->name;
                } else {
                    $folder = $settings['settings']['default_folders']['events'];
                }

                 
                $dayToView = $czdiw - self::$firstDayOfTheWeek + 1;
                if ($dayToView < 0) {
                    $dayToView = 7 + $dayToView;
                }

                $this->items[$aItem['id'] . $this->uniqueid]['link'] = '?_l=item&p0=main&p1=content&p2=event.detail&p3=item.fdr&p4=' . rawurlencode(MerakGWAPI::decode($aItem['EVNFOLDER'])) . '&p5=E&p6=' . $aItem['id'];
                $this->items[$aItem['id'] . $this->uniqueid]['folder'] = MerakGWAPI::decode($aItem['EVNFOLDER']);
                $this->items[$aItem['id'] . $this->uniqueid]['start'] = $start_position;
                $this->items[$aItem['id'] . $this->uniqueid]['end'] = $end_position;
                $this->items[$aItem['id'] . $this->uniqueid]['size'] = $end_position - $start_position;
                $this->items[$aItem['id'] . $this->uniqueid]['day'] = $dayToView;
                $this->items[$aItem['id'] . $this->uniqueid]['color'] = $aItem['EVNCOLOR'];
                $this->items[$aItem['id'] . $this->uniqueid]['title'] = $aItem['EVNTITLE'];
                $this->items[$aItem['id'] . $this->uniqueid]['note'] = (isset($aItem['EVNNOTE']) ? $aItem['EVNNOTE'] : '');
                $this->items[$aItem['id'] . $this->uniqueid]['location'] = (isset($aItem['EVNLOCATION']) ? $aItem['EVNLOCATION'] : '');
                $this->items[$aItem['id'] . $this->uniqueid]['tags'] = $tagsToShow;
                $this->items[$aItem['id'] . $this->uniqueid]['startT'] = $startTime;
                $this->items[$aItem['id'] . $this->uniqueid]['endT'] = $endTime;
                $this->items[$aItem['id'] . $this->uniqueid]['recurrence'] = $recurrence;
                $this->items[$aItem['id'] . $this->uniqueid]['st'] = $ts;
                $this->items[$aItem['id'] . $this->uniqueid]['et'] = MerakGWAPI::calendar2unixTime($aItem['EVNENDDATE'], $aItem['EVNENDTIME']);
                $this->items[$aItem['id'] . $this->uniqueid]['ade'] = ($aItem['EVNSTARTTIME'] == -1);
            } else {
                $diff = false;

                if ($tpl == 'event.month') {
                    $sl = 0;
                    $czdiw = @date('d', $ts);

                    $first = $winfo['this_month']['start'];
                    if (@date('d', $first) > @date('d', $ts) || @date('m', $first) > @date('m', $ts) || @date('Y', $first) > @date('Y', $ts)) {
                        $sl = (($first - $ts) / 86400) + $czdiw - 1;
                    }
                } else {
                    $first = $winfo['this_week']['start'];
                    if (@date('d', $first) > @date('d', $ts) || @date('m', $first) > @date('m', $ts) || @date('Y', $first) > @date('Y', $ts)) {
                        $sl = floor(($first - $ts) / 86400) + $czdiw;
                    }
                    if ($first > $ts) {
                        $czdiw = self::$firstDayOfTheWeek - 1;
                        $diff = ($aItem['EVNENDDATE'] - $aItem['EVNSTARTDATE'] - ($first - MerakGWAPI::calendar2unixTime($aItem['EVNSTARTDATE'], $aItem['EVNSTARTTIME'])) / 86400);
                    }
                }

                if (!$diff) {
                    $diff = $aItem['EVNENDDATE'] - $aItem['EVNSTARTDATE'];
                }

                if ($oItem->folder->name) {
                    $folder = $oItem->folder->name;
                } else {
                    $folder = $settings['settings']['default_folders']['events'];
                }

                for ($i = 0; $i < $diff; $i++) {
                     
                    $dayToView = $czdiw - self::$firstDayOfTheWeek + 1;
                    if ($dayToView < 0) {
                        $dayToView = 7 + $dayToView;
                    }
                     
                    if ($dayToView + $i < 7 || $tpl == 'event.month') {
                        $this->ade[$aItem['id'] . $this->uniqueid . $i]['id'] = $aItem['id'];
                        $this->ade[$aItem['id'] . $this->uniqueid . $i]['type'] = $aItem['EVNTYPE'];
                        $this->ade[$aItem['id'] . $this->uniqueid . $i]['link'] = '?_l=item&p0=main&p1=content&p2=event.detail&p3=item.fdr&p4=' . MerakGWAPI::decode($aItem['EVNFOLDER']) . '&p5=E&p6=' . $aItem['id'];
                        $this->ade[$aItem['id'] . $this->uniqueid . $i]['folder'] = MerakGWAPI::decode($aItem['EVNFOLDER']);
                        $this->ade[$aItem['id'] . $this->uniqueid . $i]['day'] = $dayToView + $i;
                        $this->ade[$aItem['id'] . $this->uniqueid . $i]['color'] = $aItem['EVNCOLOR'];
                        $this->ade[$aItem['id'] . $this->uniqueid . $i]['tags'] = $tagsToShow;
                        $this->ade[$aItem['id'] . $this->uniqueid . $i]['class'] = $aItem['EVNCLASS'];
                        $this->ade[$aItem['id'] . $this->uniqueid . $i]['title'] = $aItem['EVNTITLE'];
                        $this->ade[$aItem['id'] . $this->uniqueid . $i]['note'] = (isset($aItem['EVNNOTE']) ? $aItem['EVNNOTE'] : '');
                        $this->ade[$aItem['id'] . $this->uniqueid . $i]['location'] = (isset($aItem['EVNLOCATION']) ? $aItem['EVNLOCATION'] : '');
                        $this->ade[$aItem['id'] . $this->uniqueid . $i]['startT'] = $startTime;
                        $this->ade[$aItem['id'] . $this->uniqueid . $i]['endT'] = $endTime;
                        $this->ade[$aItem['id'] . $this->uniqueid . $i]['st'] = $ts + ($i * 86400);
                        $this->ade[$aItem['id'] . $this->uniqueid . $i]['et'] = MerakGWAPI::calendar2unixTime($aItem['EVNENDDATE'], $aItem['EVNENDTIME']);
                        $this->ade[$aItem['id'] . $this->uniqueid . $i]['recurrence'] = $recurrence;
                        if (isset($aItem['EVNLOCATION']) && !empty($aItem['EVNLOCATION'])) {
                            $moreInfo = explode("&", $aItem['EVNLOCATION']);
                            foreach ($moreInfo as $val3) {
                                $moreParse = explode('=', $val3);
                                $more[$moreParse[0]] = $this->utf8_urldecode($moreParse[1]);
                            }
                            if ($more['type'] == 'weather') {
                                $this->ade[$aItem['id'] . $this->uniqueid . $i]['more'] = $more;
                            }
                        } else {
                            $this->ade[$aItem['id'] . $this->uniqueid . $i]['classic'] = true;
                        }
                    }
                }
            }
        }
    }

     

    public function convertNDetail(&$oItem, &$aItem)
    {
        $addons = $oItem->getAddons();
        $attachments = $addons['attachment']->getData();

        if ($aItem['EVNCLASS'] == 'N') {
            $data = $oItem->aAddons['note']->getData();
            $aItem['ADDONS']['NOTE']['NOTE_TEXT'] = $data[0]['note_text'];
        }

        if ($attachments) {
            foreach ($attachments as $key => $val) {
                $size = $val['ATTSIZE'];
                $att = 'B';
                if ($size > 1000) {
                    $size = round($size / 1000, 0);
                    $att = 'kB';
                }
                if ($size > 1000) {
                    $size = round($size / 1000, 2);
                    $att = 'MB';
                }
                $size = $size . ' ' . $att;
                $attachments[$key]['ATTSIZE'] = $size;

                $path = strtok($aItem['TICKET'], '?');
                $expath = explode('webdav/', $path);
                $path = $expath[1];

                $ex = explode('.', $val['ATTNAME']);
                $attachments[$key]['extension'] = strtolower($ex[count($ex) - 1]);
				$attachments[$key]['ATTURL'] = '#';
                if ($val['ATTTYPE'] == 'F' || $val['ATTTYPE'] == 'P') {
                    $attachments[$key]['ATTURL'] = "../server/download.php?sid=" . session_id() . "&class=attachment" . "&fullpath=" . rawurlencode($oItem->folder->account->account->accountID . "/" . $oItem->folder->folderID . "/" . $oItem->itemID . "/" . $attachments[$key]['ATTNAME']);
                }
            }
        }

        $aItem['aditional']['attachments'] = $attachments;
    }

    public function convertN(&$oItem, &$aItem)
    {
        $addons = $oItem->getAddons();
        $attachments = $addons['attachment']->getData();

        if ($aItem['EVNCLASS'] == 'N') {
            $data = $oItem->aAddons['note']->getData();
            $note = slToolsString::removeHTML($data[0]['note_text']);
            if (strlen($note) > 128) {
                $note = substr($note, 0, 125) . '...';
            }
            $aItem['ADDONS']['NOTE']['NOTE_TEXT'] = $note;
        }

                 $tagsToShow = self::convertTags($aItem['EVNTYPE']);

		$folder = null;
        if ($oItem->folder->name) {
            $folder = $oItem->folder->name;
        }

        $aItem['link'] = '?_l=item&p0=main&p1=content&p2=notes.detail&p3=item.fdr&p4=' . $folder . '&p5=N' . '&p6=' . $aItem['id'];
        $aItem['tags'] = $tagsToShow;
    }

    public function convertFDetail(&$oItem, &$aItem)
    {
        $addon = $oItem->getAddons();
        $attachments = $addon['attachment']->getData();

        if (is_array($attachments)) foreach ($attachments as $key => $val) {

            $size = $val['ATTSIZE'];
            $att = 'B';
            if ($size > 1000) {
                $size = round($size / 1000, 0);
                $att = 'kB';
            }
            if ($size > 1000) {
                $size = round($size / 1000, 2);
                $att = 'MB';
            }
            $size = $size . ' ' . $att;
            $attachments[$key]['ATTSIZE'] = $size;

            $path = strtok($aItem['TICKET'], '?');
            $expath = explode('webdav/', $path);
            $path = $expath[1];
            $attachments[$key]['ATTNAME'] = $val['ATTNAME'];
            $attachments[$key]['ATTNAME_DISPLAY'] = urldecode($val['ATTDESC']);
            $ex = explode('.', $attachments[$key]['ATTNAME_DISPLAY']);
            $attachments[$key]['extension'] = strtolower($ex[count($ex) - 1]);
			$attachments[$key]['ATTURL'] = '#';
            if ($val['ATTTYPE'] == 'F' || $val['ATTTYPE'] == 'P') {
                $attachments[$key]['ATTURL'] = "../server/download.php?sid=" . session_id() . "&class=attachment" . "&fullpath=" . rawurlencode($oItem->folder->account->account->accountID . "/" . $oItem->folder->folderID . "/" . $oItem->itemID . "/" . $attachments[$key]['ATTNAME']);
            }
        }
        $aItem['attachments'] = $attachments;
        if (!empty($attachments)) {
            $aItem['has_attachment'] = true;
        }
        $aItem['aditional']['size'] = round($aItem['EVNCOMPLETE'] / 1024, 2);
    }

    public function convertF(&$oItem, &$aItem)
    {
        $aItem['tags'] = self::convertTags($aItem['EVNTYPE']);
        $aItem['fullpath'] = $oItem->folder->account->account->accountID . "/" . $oItem->folder->folderID . "/" . $oItem->itemID;
        $aItem['link'] = $this->getItemLink($oItem, $aItem, true);
        $this->convertFDetail($oItem, $aItem);

        $aItem['EVNNOTE'] = slToolsString::removeHTML($aItem['EVNNOTE']);

        if ($aItem['has_attachment']) {
            foreach ($aItem['attachments'] as $val) {
                if ($val['ATTTYPE'] == 'F') {
                    $aItem['main_attachment'] = $val;
                }
            }
        }
    }

     
    public function convertTDetail(&$oItem, &$aItem)
    {
        $attach = $oItem->getAddons();
        $attachments = $attach['attachment']->getData();
        $reminder = $attach['reminder']->getData();
        $aItem['aditional']['reminder'] = array();
        $aItem['aditional']['reminder']['hr'] = array('minute' => date('i'), 'hour' => date('H'), 'day' => date('d'), 'month' => date('m'), 'year' => date('Y'),);

        if (isset($reminder[0])) {
            $aItem['aditional']['reminder'] = $reminder[0];
                         $aItem['aditional']['reminder']['id'] = $reminder[0]['RMN_ID'];
            $aItem['aditional']['reminder']['active'] = true;
            $aItem['aditional']['reminder']['hr'] = array('minute' => date('i', $reminder[0]['RMNTIME']), 'hour' => date('H', $reminder[0]['RMNTIME']), 'day' => date('d', $reminder[0]['RMNTIME']), 'month' => date('m', $reminder[0]['RMNTIME']), 'year' => date('Y', $reminder[0]['RMNTIME']),);
        }

        if (isset($aItem['EVNSTARTDATE']) && $aItem['EVNSTARTDATE'] != 0) {
             
            $aItem['aditional']['startday'] = @date("d", MerakGWAPI::calendar2unixTime(intval($aItem['EVNSTARTDATE']), intval($aItem['EVNSTARTTIME'])));
            $aItem['aditional']['startmonth'] = @date("m", MerakGWAPI::calendar2unixTime(intval($aItem['EVNSTARTDATE']), intval($aItem['EVNSTARTTIME'])));
            $aItem['aditional']['startyear'] = @date("Y", MerakGWAPI::calendar2unixTime(intval($aItem['EVNSTARTDATE']), intval($aItem['EVNSTARTTIME'])));
            $aItem['aditional']['startactive'] = true;
        } else {
            $aItem['aditional']['startday'] = @date("d");
            $aItem['aditional']['startmonth'] = @date("m");
            $aItem['aditional']['startyear'] = @date('Y');
            $aItem['aditional']['startactive'] = false;
        }
        if (is_array($attachments)) {
            foreach ($attachments as $key => $val) {
                $size = $val['ATTSIZE'];
                $att = 'B';
                if ($size > 1000) {
                    $size = round($size / 1000, 0);
                    $att = 'kB';
                }
                if ($size > 1000) {
                    $size = round($size / 1000, 2);
                    $att = 'MB';
                }
                $size = $size . ' ' . $att;
                $attachments[$key]['ATTSIZE'] = $size;

                $path = strtok($aItem['TICKET'], '?');
                $expath = explode('webdav/', $path);
                $path = $expath[1];

                $ex = explode('.', $val['ATTNAME']);
                $attachments[$key]['extension'] = strtolower($ex[count($ex) - 1]);
				$attachments[$key]['ATTURL'] = '#';
                if ($val['ATTTYPE'] == 'F' || $val['ATTTYPE'] == 'P') {
                    $attachments[$key]['ATTURL'] = "../server/download.php?sid=" . session_id() . "&class=attachment" . "&fullpath=" . rawurlencode($oItem->folder->account->account->accountID . "/" . $oItem->folder->folderID . "/" . $oItem->itemID . "/" . $attachments[$key]['ATTNAME']);
                }
            }
        }

        $aItem['aditional']['attachments'] = $attachments;

        if (isset($aItem['EVNSTARTDATE']) && $aItem['EVNSTARTDATE'] != 0) {
             
            $aItem['aditional']['startday'] = @date("d", MerakGWAPI::calendar2unixTime(intval($aItem['EVNSTARTDATE']), intval($aItem['EVNSTARTTIME'])));
            $aItem['aditional']['startmonth'] = @date("m", MerakGWAPI::calendar2unixTime(intval($aItem['EVNSTARTDATE']), intval($aItem['EVNSTARTTIME'])));
            $aItem['aditional']['startyear'] = @date("Y", MerakGWAPI::calendar2unixTime(intval($aItem['EVNSTARTDATE']), intval($aItem['EVNSTARTTIME'])));
            $aItem['aditional']['startactive'] = true;
        } else {
            $aItem['aditional']['startday'] = @date("d");
            $aItem['aditional']['startmonth'] = @date("m");
            $aItem['aditional']['startyear'] = @date('Y');
            $aItem['aditional']['startactive'] = false;
        }

        if (isset($aItem['EVNENDDATE']) && $aItem['EVNENDDATE'] != 0) {
             
            $aItem['aditional']['endday'] = @date("d", MerakGWAPI::calendar2unixTime(intval($aItem['EVNENDDATE']), intval($aItem['EVNENDTIME'])));
            $aItem['aditional']['endmonth'] = @date("m", MerakGWAPI::calendar2unixTime(intval($aItem['EVNENDDATE']), intval($aItem['EVNENDTIME'])));
            $aItem['aditional']['endyear'] = @date("Y", MerakGWAPI::calendar2unixTime(intval($aItem['EVNENDDATE']), intval($aItem['EVNENDTIME'])));
             
            $aItem['aditional']['endactive'] = true;
        } else {
            $aItem['aditional']['endday'] = @date("d");
            $aItem['aditional']['endmonth'] = @date("m");
            $aItem['aditional']['endyear'] = @date('Y');
            $aItem['aditional']['endactive'] = false;
        }

         
        $sd = $aItem['aditional']['startday'];
        $sm = $aItem['aditional']['startmonth'];
        $sy = $aItem['aditional']['startyear'];
        $sa = $aItem['aditional']['startactive'];
        $aItem['aditional']['startday'] = $aItem['aditional']['endday'];
        $aItem['aditional']['startmonth'] = $aItem['aditional']['endmonth'];
        $aItem['aditional']['startyear'] = $aItem['aditional']['endyear'];
        $aItem['aditional']['startactive'] = $aItem['aditional']['endactive'];
        $aItem['aditional']['endactive'] = $sa;
        $aItem['aditional']['endday'] = $sd;
        $aItem['aditional']['endmonth'] = $sm;
        $aItem['aditional']['endyear'] = $sy;
         

         
        $ey = array();
        for ($i = -10 + $aItem['aditional']['endyear']; $i < $aItem['aditional']['endyear'] + 10; $i++) {
            $ey[] = array('y' => $i, 's' => ($i == $aItem['aditional']['endyear'] ? true : false));
        }
        $aItem['aditional']['endyears'] = $ey;

        $sy = array();
        for ($i = -10 + $aItem['aditional']['startyear']; $i < $aItem['aditional']['startyear'] + 10; $i++) {
            $sy[] = array('y' => $i, 's' => ($i == $aItem['aditional']['startyear'] ? true : false));
        }
        $aItem['aditional']['startyears'] = $sy;
         
    }

    static public function convertT(&$oItem, &$aItem)
    {
                 $tagsToShow = self::convertTags($aItem['EVNTYPE']);

        $DTFormats = self::getDTFormats();
		$due = '';
        if ($aItem['EVNENDDATE'] != 0) {
            $due = @date($DTFormats['date'], MerakGWAPI::calendar2unixTime($aItem['EVNENDDATE'], $aItem['EVNENDTIME']));
        }
		$start = '';
        if ($aItem['EVNSTARTDATE'] != 0) {
            $start = @date($DTFormats['date'], MerakGWAPI::calendar2unixTime($aItem['EVNSTARTDATE'], $aItem['EVNSTARTTIME']));
        }

		$folder = null;
        if ($oItem->folder->name) {
            $folder = $oItem->folder->name;
        }

        $aItem['link'] = '?_l=item&p0=main&p1=content&p2=tasks.detail&p3=item.fdr&p4=' . $folder . '&p5=T' . '&p6=' . $aItem['id'];
        $aItem['tags'] = $tagsToShow;

         
        $aItem['aditional']['start'] = $due;
        $aItem['aditional']['due'] = $start;
         
    }


     
    static public function convertC(&$oItem, &$aItem)
    {
        if (substr_count($aItem['ITMCATEGORY'], ',') > 0) {
            $ct = explode(',', $aItem['ITMCATEGORY']);
            $ct = $ct[0];
        } else {
            $ct = $aItem['ITMCATEGORY'];
        }
        $aItem['aditional']['class'] = strtolower($ct);

                 $tagsToShow = self::convertTags($aItem['ITMCATEGORY']);

         
		$rename = true;
        if(isset($aItem['ITMCLASSIFYAS']) && $aItem['ITMCLASSIFYAS'] != ''){
			$rename = false;
		}
         

         
        if ($rename) {
            $name = '';
            if (isset($aItem['ITMSURNAME']) && $aItem['ITMSURNAME'] != '') {
            	$name .= ' ' . $aItem['ITMSURNAME'];
            }
            if (isset($aItem['ITMFIRSTNAME']) && $aItem['ITMFIRSTNAME'] != '') {
            	$name .= ' ' . $aItem['ITMFIRSTNAME'];
            }

            if (!isset($aItem['ITMCLASSIFYAS']) || $aItem['ITMCLASSIFYAS'] == '') {
                $aItem['ITMCLASSIFYAS'] = $name;
            }
            if ($aItem['ITMCLASSIFYAS'] == '') {
                $aItem['NOCA'] = true;
            }
        }

        $aItem['tags'] = $tagsToShow;
        $aItem['page'] = 'contact.detail';
        $aItem['LCTEMAIL1DISPLAY'] = $aItem['LCTEMAIL1'];
        $aItem['LCTEMAIL1_URLESCAPED'] = urlencode($aItem['LCTEMAIL1']);
        $aItem['LCTEMAIL2_URLESCAPED'] = urlencode($aItem['LCTEMAIL2']);
        $aItem['LCTEMAIL3_URLESCAPED'] = urlencode($aItem['LCTEMAIL3']);
        $aItem['ITMCLASSIFYAS_ESCAPED'] = strtr($aItem['ITMCLASSIFYAS'], array("\"" => "\\\"", "\\" => "\\\\"));
        $aItem['ITMCLASSIFYAS_URLESCAPED'] = urlencode($aItem['ITMCLASSIFYAS_ESCAPED']);
        if ($aItem['ITMCLASS'] == 'L') {
            $aItem['LCTEMAIL1_DL'] = '' . str_replace('#', '', $oItem->folder->name) . '/' . $aItem['ITMCLASSIFYAS'] . '';
            self::convertL($oItem, $aItem);
        }
         
    }

    public function convertLDetail(&$oItem, &$aItem)
    {
        unset($aItem['ADDONS']['LOCATION']['H']);
        $addresses = $oItem->aAddons['location']->getData();
        if ($addresses) {
            foreach ($addresses as $address) {
                $aItem['ADDONS']['LOCATION'][$address['LCT_ID']] = $address;
            }
        }
    }

    public function convertL(&$oItem, &$aItem)
    {
        $aItem['page'] = 'contact.distribution';
        $aItem['LCTEMAIL1'] = rawurlencode('[' . $oItem->folder->name . '/' . $aItem['ITMCLASSIFYAS'] . ']');
        $aItem['LCTEMAIL1DISPLAY'] = '[' . $oItem->folder->name . '/' . $aItem['ITMCLASSIFYAS'] . ']';
    }

    private function createMainPhones($v, &$newPhones)
    {
		$ret = array('PHN_ID' => $v, 'PHNNUMBER' => '');
        if (isset($newPhones[$v])) {
            $ret = $newPhones[$v];
            unset($newPhones[$v]);
        }
        return $ret;
    }

     
    public function convertCDetail(&$oItem, &$aItem)
    {
		$session = null;
        $sets = WebmailSettings::instance($session);
        $restrictionsData = $sets->getPublic('restrictions');

        if (isset($restrictionsData['@childnodes']['item'][0]['@childnodes']['sortstring'][0]['@value']) && $restrictionsData['@childnodes']['item'][0]['@childnodes']['sortstring'][0]['@value'] == 1) {
            $aItem['SORTSTRINGALLOWED'] = 1;
        }

        $phoneNames = array('LCTPHNHOME1', 'LCTPHNHOME2', 'LCTPHNASSISTANT', 'LCTPHNWORK1', 'LCTPHNWORK2', 'LCTPHNFAXHOME', 'LCTPHNFAXWORK', 'LCTPHNCALLBACK', 'LCTPHNCOMPANY', 'LCTPHNCAR', 'LCTPHNISDN', 'LCTPHNMOBILE', 'LCTPHNOTHER', 'LCTPHNOTHERFAX', 'LCTPHNPAGER', 'LCTPHNPRIMARY', 'LCTPHNRADIO', 'LCTPHNTELEX', 'LCTPHNHEARING');

        if (!empty($oItem->aAddons)) {
            foreach ($oItem->aAddons as $addonType => $addon) {
                if ($addonData = $addon->getData()) {
                    if (strtoupper($addonType) == 'LOCATION') {
                        foreach ($addonData as $key => $val) {
                            if ($val['LCTTYPE'] == 'H') {
                                $homeLocation = $val;
                            }
                        }
                        $addonData = array();
                        $addonData['H'] = $homeLocation;
                    }
                    $result[strtoupper($addonType)] = $addonData;
                }
            }
             
            $newPhones = array();

            if ($phoneNames) {
                foreach ($phoneNames as $val) {
                    if (isset($result['LOCATION']['H'][$val]) && !empty($result['LOCATION']['H'][$val])) {
                        $newPhones[$val] = array('PHN_ID' => $val, 'PHNNUMBER' => $result['LOCATION']['H'][$val]);
                    }
                }
            }

            $viewPhones = array();
                         $viewPhones[] = self::createMainPhones('LCTPHNHOME1', $newPhones);
                         $viewPhones[] = self::createMainPhones('LCTPHNWORK1', $newPhones);
                         $viewPhones[] = self::createMainPhones('LCTPHNMOBILE', $newPhones);
                         $viewPhones[] = self::createMainPhones('LCTPHNFAXWORK', $newPhones);

            if ($newPhones) {
                foreach ($newPhones as $val) {
                    $viewPhones[] = $val;
                }
            }

            $result['LOCATION']['H']['PHONES'] = $viewPhones;

             

            $aItem['ADDONS'] = $result;
        }
        if ($aItem['ITMCLASS'] == 'L') {
            self::convertLDetail($oItem, $aItem);
        }

        if ($aItem['ITMCLASS'] == 'C' && !$aItem['ADDONS']['LOCATION']['H']['LCT_ID']) {
            $aItem['ADDONS']['LOCATION']['H']['LCT_ID'] = 0;
            $aItem['ADDONS']['LOCATION']['H']['LCTTYPE'] = 'H';
        }
    }

    public function newT()
    {
        $this->newE();
    }

    public function newE()
    {
        $intervalstart = slRequest::instance()->get('all._s.interval.start');
        if (!is_numeric($intervalstart)) {
            $intervalstart = false;
        }
        $time = $intervalstart ? mktime(date('H'), date('i'), date('s'), date('m', $intervalstart), date('d', $intervalstart), date('Y', $intervalstart)) : time();
        $aItem['aditional']['start'] = @date("d/m/Y H:i", $time);
        $aItem['aditional']['end'] = @date("d/m/Y H:i", $time);
         
        $aItem['aditional']['startday'] = @date("d", $time);
        $aItem['aditional']['startmonth'] = @date("m", $time);
        $aItem['aditional']['startyear'] = @date("Y", $time);
        $aItem['aditional']['starthour'] = @date("H", $time);
        $aItem['aditional']['startminute'] = @date("i", $time);
         
        $time += 1800;
        $aItem['aditional']['endday'] = @date("d", $time);
        $aItem['aditional']['endmonth'] = @date("m", $time);
        $aItem['aditional']['endyear'] = @date("Y", $time);
        $aItem['aditional']['endhour'] = @date("H", $time);
        $aItem['aditional']['endminute'] = @date("i", $time);
        $aItem['aditional']['endyear'] = @date("Y", $time);

         
        if ($aItem['aditional']['startminute'] % 5 != 0) {
            $aItem['aditional']['startminute'] = strval(ceil($aItem['aditional']['startminute'] / 5) * 5);
        }
        if ($aItem['aditional']['endminute'] % 5 != 0) {
            $aItem['aditional']['endminute'] = strval(ceil(($aItem['aditional']['endminute']) / 5) * 5);
        }
         

         
        $ey = array();
        for ($i = -10 + $aItem['aditional']['endyear']; $i < $aItem['aditional']['endyear'] + 10; $i++) {
            $ey[] = array('y' => $i, 's' => ($i == $aItem['aditional']['endyear'] ? true : false));
        }
        $aItem['aditional']['endyears'] = $ey;

        $sy = array();
        for ($i = -10 + $aItem['aditional']['startyear']; $i < $aItem['aditional']['startyear'] + 10; $i++) {
            $sy[] = array('y' => $i, 's' => ($i == $aItem['aditional']['startyear'] ? true : false));
        }
        $aItem['aditional']['startyears'] = $sy;
        $DTFormats = self::getDTFormats();
        $aItem['timeformat'] = $DTFormats['time'];
         

        return $aItem;
    }

    public function newC()
    {
        $newPhones = array();
        $viewPhones = array();
                 $viewPhones[] = self::createMainPhones('LCTPHNHOME1', $newPhones);
                 $viewPhones[] = self::createMainPhones('LCTPHNWORK1', $newPhones);
                 $viewPhones[] = self::createMainPhones('LCTPHNMOBILE', $newPhones);
                 $viewPhones[] = self::createMainPhones('LCTPHNFAXWORK', $newPhones);

        if (!empty($result['LOCATION'])) {
            $result['LOCATION']['H']['PHONES'] = $viewPhones;
        }
        $aItem['ADDONS'] = $result;
        return $aItem;
    }

    public function inBitValue($haystack, $needle)
    {
        return ($haystack & $needle) ? true : false;
    }

     
    public function convertEDetail(&$oItem, &$aItem)
    {
        $request = [];
        $addon = $oItem->getAddons();
        $attachments = $addon['attachment']->getData();
        $recurrence = $addon['recurrence']->getData();
         
         
        $recurrenceData = array();
        if (isset($recurrence[0])) {
            $recurrence = $recurrence[0];
        }

                 if (isset($recurrence['RCRMONTHREPETITION']) && $recurrence['RCRMONTHREPETITION'] > 0) {
            $recurrenceData['type'] = '3';
            $recurrenceData['dayrepetition'] = $recurrence['RCRDAYREPETITION'];
            $recurrenceData['monthrepetition'] = $recurrence['RCRMONTHREPETITION'];
            $recurrenceData['innertype'] = '1';
            if (isset($recurrence['RCRDAYOFWEEKNUMBER']) && $recurrence['RCRDAYOFWEEKNUMBER'] > 0) {
                $recurrenceData['weekofmonthnumber'] = $recurrence['RCRWEEKOFMONTHNUMBER'];
                $recurrenceData['dayofweeknumber'] = $recurrence['RCRDAYOFWEEKNUMBER'];
                $recurrenceData['innertype'] = '2';
            }
        }          elseif (isset($recurrence['RCRYEARREPETITION']) && $recurrence['RCRYEARREPETITION'] > 0 || isset($recurrence['RCRMONTHOFYEARNUMBER']) && $recurrence['RCRMONTHOFYEARNUMBER'] > 0) {
            $recurrenceData['innertype'] = '1';

            $recurrenceData['type'] = '4';

            if (isset($recurrence['RCRMONTHOFYEARNUMBER']) && $recurrence['RCRMONTHOFYEARNUMBER'] > 0) {
                $recurrenceData['innertype'] = '2';
                $recurrenceData['monthofyearnumber'] = $recurrence['RCRMONTHOFYEARNUMBER'];
                $recurrenceData['weekofyearnumber'] = $recurrence['RCRWEEKOFYEARNUMBER'];
                $recurrenceData['dayofweeknumber'] = $recurrence['RCRDAYOFWEEKNUMBER'];
            } elseif (isset($recurrence['RCRYEARREPETITION']) && $recurrence['RCRYEARREPETITION'] > 0) {
                $recurrenceData['yearrepetition'] = $recurrence['RCRYEARREPETITION'];
            }
        }          elseif (isset($recurrence['RCRDAYREPETITION']) && $recurrence['RCRDAYREPETITION'] > 0) {
            $recurrenceData['type'] = '1';
            $recurrenceData['dayrepetition'] = $recurrence['RCRDAYREPETITION'];
        }          elseif (isset($recurrence['RCRWEEKREPETITION']) && $recurrence['RCRWEEKREPETITION'] > 0) {
            $recurrenceData['type'] = '2';
            $recurrenceData['weekrepetition'] = $recurrence['RCRWEEKREPETITION'];
            $recurrenceData['weekdays'][0] = $this->inBitValue($recurrence['RCRDAYOFWEEKNUMBER'], FLAG_GW_SUNDAY);
            $recurrenceData['weekdays'][1] = $this->inBitValue($recurrence['RCRDAYOFWEEKNUMBER'], FLAG_GW_MONDAY);
            $recurrenceData['weekdays'][2] = $this->inBitValue($recurrence['RCRDAYOFWEEKNUMBER'], FLAG_GW_TUESDAY);
            $recurrenceData['weekdays'][3] = $this->inBitValue($recurrence['RCRDAYOFWEEKNUMBER'], FLAG_GW_WEDNESDAY);
            $recurrenceData['weekdays'][4] = $this->inBitValue($recurrence['RCRDAYOFWEEKNUMBER'], FLAG_GW_THURSDAY);
            $recurrenceData['weekdays'][5] = $this->inBitValue($recurrence['RCRDAYOFWEEKNUMBER'], FLAG_GW_FRIDAY);
            $recurrenceData['weekdays'][6] = $this->inBitValue($recurrence['RCRDAYOFWEEKNUMBER'], FLAG_GW_SUNDAY);
                     }

                 if (isset($recurrence['RCRENDDATE']) && $recurrence['RCRENDDATE']) {
            $unixtime = MerakGWAPI::calendar2unixTime(intval($recurrence['RCRENDDATE']), 0);
            $recurrenceData['enddate_raw'] = $recurrence['RCRENDDATE'];
            $recurrenceData['enddate_strval'] = strval($recurrence['RCRENDDATE']);
            $recurrenceData['enddate'] = $unixtime;
            $recurrenceData['enddate_converted'] = date('d/m/Y', $unixtime);
        }
        if (isset($recurrence['RCRCOUNT']) && $recurrence['RCRCOUNT']) {
            $recurrenceData['count'] = $recurrence['RCRCOUNT'];
        }

         
        $aItem['rcr'] = $recurrenceData;
         

        $reminders = $addon['reminder']->getData();
        if (is_array($reminders)) {
            foreach ($reminders as $reminder) {
                if ($reminder['RMNTIME'] == 0) {
                    $currentReminder = $reminder;
                }
            }
        }
        if ($currentReminder) {
            $reminder = array();
            $reminder['ID'] = $currentReminder['RMN_ID'];
            if ($currentReminder['RMNMINUTESBEFORE']) {
                $reminder['BEFORE'] = $currentReminder['RMNMINUTESBEFORE'];
                $reminder['UNIT'] = 'm';
            }
            if ($currentReminder['RMNHOURSBEFORE']) {
                $reminder['BEFORE'] = $currentReminder['RMNHOURSBEFORE'];
                $reminder['UNIT'] = 'h';
            }
            if ($currentReminder['RMNDAYSBEFORE']) {
                $reminder['BEFORE'] = $currentReminder['RMNDAYSBEFORE'];
                $reminder['UNIT'] = 'd';
            }
            $reminder['ACTIVE'] = $currentReminder['RMN_ID'] ? true : false;
            $remindersData[0] = $reminder;
        } else {
            $remindersData[0]['BEFORE'] = 0;
        }

        if (is_array($attachments)) foreach ($attachments as $key => $val) {

            $size = $val['ATTSIZE'];
            $att = 'B';
            if ($size > 1000) {
                $size = round($size / 1000, 0);
                $att = 'kB';
            }
            if ($size > 1000) {
                $size = round($size / 1000, 2);
                $att = 'MB';
            }
            $size = $size . ' ' . $att;
            $attachments[$key]['ATTSIZE'] = $size;

            $path = strtok($aItem['TICKET'], '?');
            $expath = explode('webdav/', $path);
            $path = $expath[1];

            $ex = explode('.', $val['ATTNAME']);
            $attachments[$key]['extension'] = strtolower($ex[count($ex) - 1]);

            if ($val['ATTTYPE'] == 'F' || $val['ATTTYPE'] == 'P') {
                $attachments[$key]['ATTURL'] = "../server/download.php?sid=" . session_id() . "&class=attachment" . "&fullpath=" . rawurlencode($oItem->folder->account->account->accountID . "/" . $oItem->folder->folderID . "/" . $oItem->itemID . "/" . $attachments[$key]['ATTNAME']);
            } else {
                $attachments[$key]['ATTURL'] = '#';
            }
        }
        $aItem['aditional']['reminders'] = $remindersData;
        $aItem['aditional']['attachments'] = $attachments;


        if ($aItem['EVNSTARTTIME'] < 0) {
            $aItem['aditional']['allday'] = true;
        }
        $adFix = 0;
        if (intval($aItem['EVNSTARTTIME']) < 0) {
            $adFix = '1';
        }

         
        $aItem['aditional']['startday'] = @date("d", MerakGWAPI::calendar2unixTime(intval($aItem['EVNSTARTDATE']), intval($aItem['EVNSTARTTIME'])));
        $aItem['aditional']['startmonth'] = @date("m", MerakGWAPI::calendar2unixTime(intval($aItem['EVNSTARTDATE']), intval($aItem['EVNSTARTTIME'])));
        $aItem['aditional']['startyear'] = @date("Y", MerakGWAPI::calendar2unixTime(intval($aItem['EVNSTARTDATE']), intval($aItem['EVNSTARTTIME'])));
        $aItem['aditional']['starthour'] = @date("H", MerakGWAPI::calendar2unixTime(intval($aItem['EVNSTARTDATE']), intval($aItem['EVNSTARTTIME'])));
        $aItem['aditional']['startminute'] = @date("i", MerakGWAPI::calendar2unixTime(intval($aItem['EVNSTARTDATE']), intval($aItem['EVNSTARTTIME'])));
         
        $aItem['aditional']['endday'] = @date("d", MerakGWAPI::calendar2unixTime(intval($aItem['EVNENDDATE']) - $adFix, intval($aItem['EVNENDTIME'])));
        $aItem['aditional']['endmonth'] = @date("m", MerakGWAPI::calendar2unixTime(intval($aItem['EVNENDDATE']) - $adFix, intval($aItem['EVNENDTIME'])));
        $aItem['aditional']['endyear'] = @date("Y", MerakGWAPI::calendar2unixTime(intval($aItem['EVNENDDATE']) - $adFix, intval($aItem['EVNENDTIME'])));
        $aItem['aditional']['endhour'] = @date("H", MerakGWAPI::calendar2unixTime(intval($aItem['EVNENDDATE']) - $adFix, intval($aItem['EVNENDTIME'])));
        $aItem['aditional']['endminute'] = @date("i", MerakGWAPI::calendar2unixTime(intval($aItem['EVNENDDATE']) - $adFix, intval($aItem['EVNENDTIME'])));
         


        if (!isset($aItem['id'])) {
            $time = time();
            if (isset($request['day'])) {
                $time = $request['day'];
            }
            $aItem['aditional']['start'] = @date("d/m/Y H:i", $time);
            $aItem['aditional']['end'] = @date("d/m/Y H:i", $time);
             
            $aItem['aditional']['startday'] = @date("d", $time);
            $aItem['aditional']['startmonth'] = @date("m", $time);
            $aItem['aditional']['startyear'] = @date("Y", $time);
            $aItem['aditional']['starthour'] = @date("H", $time);
            $aItem['aditional']['startminute'] = @date("i", $time);
             
            $time += 1800;
            $aItem['aditional']['endday'] = @date("d", $time);
            $aItem['aditional']['endmonth'] = @date("m", $time);
            $aItem['aditional']['endyear'] = @date("Y", $time);
            $aItem['aditional']['endhour'] = @date("H", $time);
            $aItem['aditional']['endminute'] = @date("i", $time);
            $aItem['aditional']['endyear'] = @date("Y", $time);
             
        }

         
        if ($aItem['aditional']['startminute'] % 5 != 0) {
            $aItem['aditional']['startminute'] = strval(ceil($aItem['aditional']['startminute'] / 5) * 5);
        }
        if ($aItem['aditional']['endminute'] % 5 != 0) {
            $aItem['aditional']['endminute'] = strval(ceil(($aItem['aditional']['endminute']) / 5) * 5);
        }
         

         
        $ey = array();
        for ($i = -10 + $aItem['aditional']['endyear']; $i < $aItem['aditional']['endyear'] + 10; $i++) {
            $ey[] = array('y' => $i, 's' => ($i == $aItem['aditional']['endyear'] ? true : false));
        }
        $aItem['aditional']['endyears'] = $ey;

        $sy = array();
        for ($i = -10 + $aItem['aditional']['startyear']; $i < $aItem['aditional']['startyear'] + 10; $i++) {
            $sy[] = array('y' => $i, 's' => ($i == $aItem['aditional']['startyear'] ? true : false));
        }
        $aItem['aditional']['startyears'] = $sy;
        $DTFormats = self::getDTFormats();
        $aItem['timeformat'] = $DTFormats['time'];
         
    }

    public function convertHIPAA(&$oItem, &$aItem)
    {
        $aItem['email'] = $oItem->item['email'];
        $aItem['name'] = $oItem->item['name'];
        $aItem['category'] = $oItem->category;
        $aItem['link'] = $this->getItemLink($oItem, $aItem, 'item');
    }

    public function convertHIPAADetail(&$oItem, &$aItem)
    {
        $aItem['email'] = $oItem->item['email'];
        $aItem['name'] = $oItem->item['name'];
        $aItem['category'] = $oItem->category;
        $aItem['notify_sms'] = Hipaa::getValue('phone', $aItem['email']);
        $aItem['notify_email'] = Hipaa::getValue('notifyto', $aItem['email']);
        $card = Hipaa::getAccountCardProperties($aItem['email']);
        $aItem['city'] = $card['city'];
        $aItem['street'] = $card['street'];
        $aItem['state'] = $card['state'];
        $aItem['zip'] = $card['zip'];

        $aItem['link'] = $this->getItemLink($oItem, $aItem, 'item');
    }

     
    public function convertM(&$oItem, &$aItem)
    {
        global $convertMailTime;
        $t = time();
        $m = microtime();

        $data = slRequest::instance();

                 $tagsToShow = self::convertTags($oItem->taglist, true);
        $aItem['tags'] = $tagsToShow;

         
        $select = $data->get('get.select');
        $items = $data->get('form.items');
        if (($select == 'all' || ($select == 'unread' && $aItem['recent']) || ($select == 'read' && !$aItem['recent'])) || isset($items[$aItem['id']])) {
            $aItem['aditional']['checked'] = true;
            $aItem['checked'] = true;
        }
         

        $DTFormats = self::getDTFormats();

        $date_format = $DTFormats['date'];
        $time_format = $DTFormats['time'];
        $ctz = 0;
        $stz = 0;
        if (isset($_SESSION['CTZ']) && trim($_SESSION['CTZ']) != '') {
            $ctz = $_SESSION['CTZ'] * 60;
        }
        if (isset($_SESSION['STZ']) && trim($_SESSION['STZ']) != '') {
            $stz = $_SESSION['STZ'] * 60;
        }

        $timestampToUse = ($aItem['date'] - date('Z', $aItem['date'])) + $ctz;

        if (isset($aItem['arrayinfo']) && isset($aItem['arrayinfo']['subject']) && isset($aItem['arrayinfo']['subject']['emailAddress'])) {
            $validCert = false;
            $fromAddresses = MailParse::parseAddresses($aItem['from']);
            if (!empty($fromAddresses) && is_array($fromAddresses)) {
                foreach ($fromAddresses as $val) {
                    if ($aItem['arrayinfo']['subject']['emailAddress'] == $val['address']) {
                        $validCert = true;
                    }
                }
            }
            $aItem['arrayinfo']['valid'] = $validCert;
        } else {
            $aItem['arrayinfo']['valid'] = true;
        }

         
        $aItem['aditional']['fromshow'] = htmlspecialchars(self::getDisplayAddress($aItem['from']));
        $aItem['aditional']['toshow'] = htmlspecialchars(self::getDisplayAddress($aItem['to']));
        $aItem['aditional']['date'] = @date($date_format, $timestampToUse);
        $aItem['aditional']['fulldate'] = @date($date_format . " " . self::convertTimeFormat('H:i:s', $time_format), $timestampToUse);
        if ($aItem['aditional']['date'] == @date($date_format, time() - date('Z') + $ctz)) {
            $aItem['aditional']['date'] = @date(self::convertTimeFormat('H:i', $time_format), $timestampToUse);
        }
        $aItem['aditional']['size'] = round($aItem['size'] / 1024, 2) . ' kB';
        $aItem['link'] = $this->getItemLink($oItem, $aItem);

        if ($aItem['flags'] & Item::FLAG_ANSWERED) {
            $aItem['answered'] = true;
        }
        if ($aItem['flags'] & Item::FLAG_FORWARDED) {
            $aItem['forwarded'] = true;
        }

        if (isset($aItem['attachments']['num']) && is_array($aItem['attachments']['num'])) {
            foreach ($aItem['attachments']['num'] as $key => $val) {
                $aItem['attachments']['num'][$key]['size'] = self::format_bytes($val['size']);
                $ex = explode('.', $val['name']);
                $extension = strtolower($ex[count($ex) - 1]);
                $mime = explode('/', $val['type']);
                if ($mime[0] == 'message') {
                    $extension = 'msg';
                }
                $aItem['attachments']['num'][$key]['extension'] = $extension;
            }
        }
         
         
        if (isset($aItem['x_icewarp_server_request']) && !empty($aItem['x_icewarp_server_request'])) {
            $aItem['x_icewarp_server_request']['title'] = sprintf(slLanguage::instance()->get('messages', "access_granted"), $aItem['x_icewarp_server_request']['folder'], $aItem['x_icewarp_server_request']['user']);
            $aItem['x_icewarp_server_request']['rights_exploded'] = array();
            for ($i = 0; $i < strlen($aItem['x_icewarp_server_request']['rights']); $i++) {
                $aItem['x_icewarp_server_request']['rights_exploded'][$aItem['x_icewarp_server_request']['rights'][$i]] = true;
            }
        }
         

         
        $imip = false;
        $imip_part_id = '';
        if (isset($aItem['attachments']['num']) && !empty($aItem['attachments']['num'])) {
            foreach ($aItem['attachments']['num'] as $key => $val) {
                if (isset($val['imip_xml'])) {
                    $imip = $val['imip_xml'];
                    $imip_part_id = $aItem['attachments']['num'][$key]['part_id'];
                    break;
                }
            }
        }
        if ($imip) {
            if (isset($imip->VEVENT)) {
                $aItem['imip'] = array('method' => strtolower(strval($imip->METHOD)), 'title' => strval($imip->VEVENT->SUMMARY), 'description' => strval($imip->VEVENT->DESCRIPTION), 'uid' => strval($imip->VEVENT->UID), 'part_id' => $imip_part_id);
                if (substr_count(strval($imip->VEVENT->DTSTART), 'T') == 0) {
                    $aItem['imip']['start'] = MerakGWAPI::calendar2unixTime(intval(MerakGWAPI::iso86012calendardate($imip->VEVENT->DTSTART . 'T000000')), intval(MerakGWAPI::iso86012calendartime($imip->VEVENT->DTSTART)));
                    $aItem['imip']['end'] = MerakGWAPI::calendar2unixTime(intval(MerakGWAPI::iso86012calendardate($imip->VEVENT->DTEND . 'T000000')), intval(MerakGWAPI::iso86012calendartime($imip->VEVENT->DTEND)));
                } else {
                    $aItem['imip']['start'] = MerakGWAPI::calendar2unixTime(intval(MerakGWAPI::iso86012calendardate($imip->VEVENT->DTSTART)), intval(MerakGWAPI::iso86012calendartime($imip->VEVENT->DTSTART)));
                    $aItem['imip']['end'] = MerakGWAPI::calendar2unixTime(intval(MerakGWAPI::iso86012calendardate($imip->VEVENT->DTEND)), intval(MerakGWAPI::iso86012calendartime($imip->VEVENT->DTEND)));
                }
                $aItem['imip']['hr'] = array('start' => date('d.m.Y H:i', $aItem['imip']['start']), 'end' => date('d.m.Y H:i', $aItem['imip']['end']));

            } elseif (isset($imip->VTODO)) {
                $aItem['imip'] = array('method' => strtolower(strval($imip->METHOD)), 'title' => strval($imip->VTODO->SUMMARY), 'description' => strval($imip->VTODO->DESCRIPTION), 'uid' => strval($imip->VTODO->UID));
                if (isset($imip->VTODO->DTSTART) && substr_count(strval($imip->VTODO->DTSTART), 'T') == 0) {
                    $aItem['imip']['start'] = MerakGWAPI::calendar2unixTime(intval(MerakGWAPI::iso86012calendardate($imip->VTODO->DTSTART . 'T000000')), intval(MerakGWAPI::iso86012calendartime($imip->VTODO->DTSTART)));
                    $aItem['imip']['end'] = MerakGWAPI::calendar2unixTime(intval(MerakGWAPI::iso86012calendardate($imip->VTODO->DTEND . 'T000000')), intval(MerakGWAPI::iso86012calendartime($imip->VTODO->DTEND)));
                } elseif (isset($imip->VTODO->DTSTART)) {
                    $aItem['imip']['start'] = MerakGWAPI::calendar2unixTime(intval(MerakGWAPI::iso86012calendardate($imip->VTODO->DTSTART)), intval(MerakGWAPI::iso86012calendartime($imip->VTODO->DTSTART)));
                    $aItem['imip']['end'] = MerakGWAPI::calendar2unixTime(intval(MerakGWAPI::iso86012calendardate($imip->VTODO->DTEND)), intval(MerakGWAPI::iso86012calendartime($imip->VTODO->DTEND)));
                }

                if (isset($imip->VTODO->DUE) && substr_count(strval($imip->VTODO->DUE), 'T') == 0) {
                    $aItem['imip']['end'] = MerakGWAPI::calendar2unixTime(intval(MerakGWAPI::iso86012calendardate($imip->VTODO->DUE . 'T000000')), intval(MerakGWAPI::iso86012calendartime($imip->VTODO->DUE)));
                } elseif (isset($imip->VTODO->DUE)) {
                    $aItem['imip']['start'] = MerakGWAPI::calendar2unixTime(intval(MerakGWAPI::iso86012calendardate($imip->VTODO->DUE)), intval(MerakGWAPI::iso86012calendartime($imip->VTODO->DUE)));
                    $aItem['imip']['end'] = MerakGWAPI::calendar2unixTime(intval(MerakGWAPI::iso86012calendardate($imip->VTODO->DUE)), intval(MerakGWAPI::iso86012calendartime($imip->VTODO->DUE)));
                }

                if ($aItem['imip']['start']) {
                    $aItem['imip']['hr']['start'] = date('d.m.Y H:i', $aItem['imip']['start']);
                }
                if ($aItem['imip']['end']) {
                    $aItem['imip']['hr']['end'] = date('d.m.Y H:i', $aItem['imip']['end']);
                }
            } elseif (isset($imip->VJOURNAL)) {
                $aItem['imip'] = array('method' => strtolower(strval($imip->METHOD)), 'title' => strval($imip->VJOURNAL->SUMMARY), 'description' => strval($imip->VJOURNAL->DESCRIPTION), 'uid' => strval($imip->VJOURNAL->UID));
                if (substr_count(strval($imip->VJOURNAL->DTSTART), 'T') == 0) {
                    $aItem['imip']['start'] = MerakGWAPI::calendar2unixTime(intval(MerakGWAPI::iso86012calendardate($imip->VJOURNAL->DTSTART . 'T000000')), intval(MerakGWAPI::iso86012calendartime($imip->VJOURNAL->DTSTART)));
                    $aItem['imip']['end'] = MerakGWAPI::calendar2unixTime(intval(MerakGWAPI::iso86012calendardate($imip->VJOURNAL->DTEND . 'T000000')), intval(MerakGWAPI::iso86012calendartime($imip->VJOURNAL->DTEND)));
                } else {
                    $aItem['imip']['start'] = MerakGWAPI::calendar2unixTime(intval(MerakGWAPI::iso86012calendardate($imip->VJOURNAL->DTSTART)), intval(MerakGWAPI::iso86012calendartime($imip->VJOURNAL->DTSTART)));
                    $aItem['imip']['end'] = MerakGWAPI::calendar2unixTime(intval(MerakGWAPI::iso86012calendardate($imip->VJOURNAL->DTEND)), intval(MerakGWAPI::iso86012calendartime($imip->VJOURNAL->DTEND)));
                }
                $aItem['imip']['hr'] = array('start' => date('d.m.Y H:i', $aItem['imip']['start']), 'end' => date('d.m.Y H:i', $aItem['imip']['end']));
            }
        }
         
        $convertMailTime += (time() - $t + microtime() - $m);
    }

    public function convertQ(&$oItem, &$aItem)
    {
        $this->convertM($oItem, $aItem);
        $aItem['aditional']['date'] = @date("d/m/Y", $aItem['date']);
        $aItem['aditional']['fulldate'] = @date("d/m/Y H:i:s", $aItem['date']);
        if ($aItem['aditional']['date'] == @date('d/m/Y')) {
            $aItem['aditional']['date'] = @date("H:i", $aItem['date']);
        }
    }

    public function convertQL(&$oItem, &$aItem)
    {
        $aItem['aditional']['toshow'] = htmlspecialchars($aItem['owner']);
        $aItem['aditional']['fromshow'] = htmlspecialchars($aItem['sender']);
        $aItem["subject"] = (string)$oItem->subject;
        $aItem["domain"] = (string)$oItem->domain;
        $aItem["createdat"] = (string)$oItem->createdAt;
        $aItem["createdon"] = (string)$oItem->createdOn;
        $value = jdtounix($oItem->createdOn) + $oItem->createdAt - $_SESSION['TIMEZONE'];
        $aItem["date"] = (string)$value;
        $aItem['aditional']['date'] = @date("d/m/Y", $aItem['date']);
        $aItem['aditional']['fulldate'] = @date("d/m/Y H:i:s", $aItem['date']);
        if ($aItem['aditional']['date'] == @date('d/m/Y')) {
            $aItem['aditional']['date'] = @date("H:i", $aItem['date']);
        }
        $aItem['link'] = '#';
    }

     
    static private function getDisplayAddress($address)
    {
        $result = slToolsString::unhtmlspecialchars($address);
        $result = MailParse::parseAddresses($result);
        if ($result[0]['display']) {
            $result = $result[0]['display'];
        } else {
            $result = $result[0]['address'];
        }

        return $result;
    }
     

     
     
     

     
    static public function getMonday($day = '')
    {
        self::setEn();

        $request = slRequest::instance();
        if ($day == '') {
            $day = time();
        }
        $d = @date('w', $day);

        if ($d == 0) {
            $d = 7;
        }
        $d -= 1;

        $move = $d - (self::$firstDayOfTheWeek - 1);
        if ($move < 0) {
            $move = 7 + $move;
        }

        $dd = $day;

        return mktime(0, 0, 0, @date("m", $dd), @date("d", $dd) - $move, @date("Y", $dd));
    }
     

     
    static public function getWeekInterval($w)
    {
        $ret['start'] = self::getMonday($w);
                 $ret['end'] = mktime(0, 0, 0, @date("m", $ret['start']), @date("d", $ret['start']) + 7, @date("Y", $ret['start']));
        return $ret;
    }
     

     
    static public function getMonth($w = '')
    {
         
        if ($w == '') {
            $w = time();
        } else {
            $w = mktime(0, 0, 0, @date('m', $w), 1, @date('Y', $w));
        }

        $today = mktime(0, 0, 0, @date("m", $w), @date("d", $w), @date("Y", $w));
        $first = mktime(0, 0, 0, @date("m", $w), 1, @date("Y", $w));
        $dayCount = @date('t', $first);
        $firstMonday = self::getMonday($first);

        $month = array();
        $month['dw'] = @date('w', $w);

        $month['dw']--;
        if ($month['dw'] == -1) {
            $month['dw'] = 6;
        }
        $month['week_starts'] = self::$firstDayOfTheWeek;

        $koef = -1;

        $startPos = 1;

        $month['w1'] = '';
        $month['w2'] = '';
        $month['w3'] = '';
        $month['w4'] = '';
        $month['w5'] = '';
        $month['w6'] = '';

        $nmw = array();

        $i = 0;
        $day = 0;
        $lastDayTime = mktime(0, 0, 0, @date('m', $today), $dayCount, @date('Y', $today));
        $lastMonday = self::getMonday($lastDayTime);
        $lastMondayR = $lastMonday;
        $lastMonday = $lastMonday + (6 * 86400);
        $lastDay = mktime(23, 59, 59, @date('m', $lastMonday), @date('d', $lastMonday), @date('Y', $lastMonday));

        $lang = slLanguage::instance();
        $names = array('sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat');

        while ($i < 42 && ($day <= $lastDay)) {

            $day = mktime(0, 0, 0, @date('m', $firstMonday), @date('d', $firstMonday) + $i, @date('Y', $firstMonday));

            if ($day <= $lastDay) {

                $active_day = false;
                if (date('d.m.Y') == date('d.m.Y', $day)) {
                    $active_day = true;
                }
                $tomonth = false;
                if (date('m', $today) == date('m', $day)) {
                    $tomonth = true;
                }

                $nmw[floor($i / 7)]['data'][] = array('dim' => @date("j", $day), 'dim_name' => $lang->get('event_main', $names[@date('w', $day)]), 'day' => @date("j", $day), 'value' => @date("d. ", $day) . self::getTranslated('n', $day), 'intervals' => $day, 'intervale' => ($day + (86400) - 1), 'active' => $active_day, 'tomonth' => $tomonth);
            }
            $i++;
        }

        $nmwr = array();

        if ($nmw) {
            foreach ($nmw as $key => $val) {
                $nmw[$key]['info']['week_number'] = date('W', $val['data'][0]['intervals'] + (86400 * 2));
                $nmw[$key]['info']['week_start'] = $val['data'][0]['intervals'];
                $nmw[$key]['info']['week_end'] = $val['data'][count($val['data']) - 1]['intervale'];

                $valr = array();
                if ($val['data']) {
                    foreach ($val['data'] as $key2 => $val2) {
                        $valr[$val2['dim']] = $val2;
                    }
                }

                $nmwr[$nmw[$key]['info']['week_number']]['data'] = $valr;
                $nmwr[$nmw[$key]['info']['week_number']]['info'] = $nmw[$key]['info'];
            }
        }
        $nmw = $nmwr;

        $month['startPos'] = $startPos;
        $month['this'] = @date("m", $first);
        $month['last'] = @date("m", $first - (86400));
        $month['thisdays'] = @date("t", $first);
        $month['lastdays'] = @date("t", $first - (86400));
        $month['next'] = mktime(0, 0, 0, @date('m', $first) + 1, 1, @date('Y', $first));
        $month['koeficient'] = $koef;
        $month['today'] = $today;

        $month['nmw'] = $nmw;

        return $month;
    }
     

     
    static public function getWeek($w = '', $extends = true, $next = false, $monthSpecial = false)
    {
         
        if ($w == '') {
            $w = time();
        } elseif ($next) {
            $w = mktime(0, 0, 0, @date('m', $w + (7 * 86400)), 1, @date('Y', $w + (7 * 86400)));
        }

        $today = mktime(0, 0, 0, @date("m", $w), @date("d", $w), @date("Y", $w));
        $day = 86400;
        $monday = self::getMonday($w);

        $week['previous'] = $monday - (1 * $day);

         
        $lang = slLanguage::instance();
        $names = array('sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat');
        $mnames = array('', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec');
         

         
        if (self::getEn()) {
            $week['sun'] = @date('d. ', $monday) . $lang->get('event_main', $mnames[@date('n', $monday)]);
            $week['mon'] = @date('d. ', $monday + (1 * $day)) . $lang->get('event_main', $mnames[@date('n', $monday + (1 * $day))]);
            $week['tue'] = @date('d. ', $monday + (2 * $day)) . $lang->get('event_main', $mnames[@date('n', $monday + (2 * $day))]);
            $week['wed'] = @date('d. ', $monday + (3 * $day)) . $lang->get('event_main', $mnames[@date('n', $monday + (3 * $day))]);
            $week['thu'] = @date('d. ', $monday + (4 * $day)) . $lang->get('event_main', $mnames[@date('n', $monday + (4 * $day))]);
            $week['fri'] = @date('d. ', $monday + (5 * $day)) . $lang->get('event_main', $mnames[@date('n', $monday + (5 * $day))]);
            $week['sat'] = @date('d. ', $monday + (6 * $day)) . $lang->get('event_main', $mnames[@date('n', $monday + (6 * $day))]);
        } else {
            $week['mon'] = @date('d. F', $monday);
            $week['tue'] = @date('d. F', $monday + (1 * $day));
            $week['wed'] = @date('d. F', $monday + (2 * $day));
            $week['thu'] = @date('d. F', $monday + (3 * $day));
            $week['fri'] = @date('d. F', $monday + (4 * $day));
            $week['sat'] = @date('d. F', $monday + (5 * $day));
            $week['sun'] = @date('d. F', $monday + (6 * $day));
        }
         

        $week['next'] = mktime(0, 0, 0, @date('m', $monday), @date('d', $monday + 7), @date('Y', $monday));
        $week['today'] = $today;
        $week['yesterday'] = mktime(0, 0, 0, @date('m', $today), @date('d', $today - 1), @date('Y', $today));
        $week['tomorow'] = mktime(0, 0, 0, @date('m', $today), @date('d', $today + 1), @date('Y', $today));

        if ($extends) {
            if ($monthSpecial) {
                                 $wSpecial = $w;
            } else {
                $wSpecial = $w;
            }

            $week['this_month']['start'] = self::getMonday(mktime(0, 0, 0, @date('m', $wSpecial), 1, @date('Y', $wSpecial)));
            $wm = self::getMonday(mktime(23, 59, 59, @date('m', $wSpecial), @date('t', $wSpecial), @date('Y', $wSpecial))) + (7 * 86400);
            $week['this_month']['end'] = mktime(23, 59, 59, @date('m', $wm), @date('d', $wm), @date('Y', $wm));

            $week['next_month']['start'] = self::getMonday($wm + 1);
            $wm = self::getMonday(mktime(23, 59, 59, date('m', $week['next_month']['start'] + (7 * 86400)), date('t', $week['next_month']['start'] + (7 * 86400)), date('Y', $week['next_month']['start'] + (7 * 86400))));
            $week['next_month']['end'] = mktime(23, 59, 59, @date('m', $wm), @date('d', $wm), @date('Y', $wm)) + (7 * 86400);

            $wd = $week['this_month']['start'] - 1;
            $wm = mktime(0, 0, 0, @date('m', $wd - (7 * 86400)), 1, @date('Y', $wd - (7 * 86400)));
            $week['previous_month']['start'] = self::getMonday(mktime(0, 0, 0, @date('m', $wm), 1, @date('Y', $wm)));
            $week['previous_month']['end'] = self::getMonday(mktime(0, 0, 0, @date('m', $wm), @date('t', $wm), @date('Y', $wm))) + (7 * 86400);

            $week['this_week']['start'] = self::getMonday($w);
            $week['this_week']['end'] = mktime(0, 0, 0, @date('m', $week['this_week']['start']), @date('d', $week['this_week']['start']) + 7, @date('Y', $week['this_week']['start'])) - 1;

            $week['next_week']['start'] = $week['this_week']['end'] + 1;
            $week['next_week']['end'] = mktime(0, 0, 0, @date('m', $week['next_week']['start']), @date('d', $week['next_week']['start']) + 7, @date('Y', $week['next_week']['start'])) - 1;

            $week['previous_week']['start'] = mktime(0, 0, 0, @date('m', $week['this_week']['start']), @date('d', $week['this_week']['start']) - 7, @date('Y', $week['this_week']['start']));
            $week['previous_week']['end'] = $week['this_week']['start'] - 1;

            $week['this_day']['start'] = $today;
            $week['this_day']['end'] = mktime(0, 0, 0, @date('m', $today), @date('d', $today) + 1, @date('Y', $today)) - 1;

            $week['previous_day']['start'] = mktime(0, 0, 0, @date('m', $today), @date('d', $today) - 1, @date('Y', $today));
            $week['previous_day']['end'] = $today - 1;

            $week['next_day']['start'] = mktime(0, 0, 0, @date('m', $today), @date('d', $today) + 1, @date('Y', $today));
            $week['next_day']['end'] = mktime(0, 0, 0, @date('m', $today), @date('d', $today) + 2, @date('Y', $today)) - 1;
        }

        $weekNumber = $week['this_week']['start'];

         
        if (@date('w', $weekNumber) != 1) {
            $weekNumber += 86400 * 7;
        }
         

        if (date('Y', $week['this_week']['start']) != date('Y', $week['this_week']['end'])) {
            $week['extended_week'] = date('j. ', $week['this_week']['start']) . $lang->get('event_main', $mnames[@date('n', $week['this_week']['start'])]) . ' ' . date('Y', $week['this_week']['start']) . ' - ' . date('j. ', $week['this_week']['end']) . $lang->get('event_main', $mnames[@date('n', $week['this_week']['end'])]) . ' ' . date('Y', $week['this_week']['end']);
        } else {
            $week['extended_week'] = date('j. ', $week['this_week']['start']) . $lang->get('event_main', $mnames[@date('n', $week['this_week']['start'])]) . ' - ' . date('j. ', $week['this_week']['end']) . $lang->get('event_main', $mnames[@date('n', $week['this_week']['end'])]) . ' ' . date('Y', $week['this_week']['end']);
        }

        $week['extended_day'] = date('j. ', $week['this_day']['start']) . $lang->get('event_main', $mnames[@date('n', $week['this_day']['start'])]) . ' ' . date('Y', $week['this_day']['start']);

        $week['num'] = @date('W', $weekNumber);
        $week['year'] = @date('Y', $today);
        $week['month'] = $lang->get('event_main', $mnames[@date('n', $today)]);
        $week['today_name'] = $lang->get('event_main', $names[@date('w', $today)]);
        $week['today_enc'] = @date('j', $today);

        return $week;
    }
     

     
    static public function getMaxColision($ordered, $val, &$checked, &$sichr)
    {
        $sichr++;
        if ($sichr > 10000) {
            die('Stack limit achieved');
        }

        $checked[] = $val['id'];
        $max = 0;
        foreach ($ordered as $key2 => $val2) {
            $vs = $val['start'];
            $v2s = $val2['start'];
            $vk = $val['end'];
            $v2k = $val2['end'];
            $v2d = $val2['day'];
            $vd = $val['day'];
            if ((($vs >= $v2s && $vs < $v2k) || ($vs <= $v2s && $vk > $v2s)) && ($vd == $v2d) && ($val['id'] != $val2['id'])) {
                $p1 = $ordered[$key2]['col'];

                if (!in_array($val2['id'], $checked)) {
                    $p2 = self::getMaxColision($ordered, $val2, $checked, $sichr);
                    if ($p1 >= $p2) {
                        if ($max < $p1) {
                            $max = $p1;
                        }
                    } else {
                        if ($max < $p2) {
                            $max = $p2;
                        }
                    }
                } else {
                    if ($max < $p1) {
                        $max = $p1;
                    }
                }
            }
        }
        return $max;
    }
     

     
    public function EfinishHandler($data, &$info)
    {
        $DTFormats = self::getDTFormats();

        $all = array();

        $request = slRequest::instance();
        $tpl = $request->get('all.view');
        $view_type = $request->get('all.type');

         
        if ($tpl == '') {
            $tpl = 'event.all';
        }
        if ($view_type == '') {
            $view_type = 'week';
        }
         

         
        if ($request->get('all._s.interval.start') != '') {
            $w = $request->get('all._s.interval.start');
            if ($tpl == 'event.month') {
                $w += (86400 * 15);
            }
        } else {
            $w = time();
        }
         

         
        self::setEn($w);

        $info['month'] = self::getMonth($w);

         
        $top = 0;
        $column = 100;
        $row = 13;
        $rowBig = 24;
         

        $preordered = array();
        $ordered = array();
        $list = array();
        if (!isset($this->items)) {
            $this->items = array();
        }
        if (!isset($this->ade)) {
            $this->ade = array();
        }

        $koeficient = $info['month']['koeficient'];

        $monday = $this->getMonday($w);

        if ($this->items) {
            foreach ($this->items as $key => $val) {
                 
                if ($val['st'] >= $monday && $val['st'] <= ($monday + 604800)) {
                    $end = $val['end'];

                    $item = array("color" => $val['color'], "start" => $val['start'], "end" => $end, "size" => $val['size'], "micro" => ($val['size'] <= 0 ? true : false), "day" => $val['day'], "id" => $val['id'], "link" => $val['link'], "folder" => $val['folder'], "cols" => 1, "leftC" => 0, "title" => $val['title'], "tags" => $val['tags'], "endT" => $val['endT'], "startT" => $val['startT'], "under" => ($val['under'] ? true : false), "over" => ($val['over'] ? true : false), "note" => $val['note'], "location" => $val['location'], "ade" => $val['ade']);

                    $preordered[$val['start']][$end - $val['start']][] = $item;
                }
                $place = 0;
                if ($info['month']['this'] == @date("m", $val['st'])) {
                    $place = (@date("d", $val['st']) + $koeficient);
                } elseif ($info['month']['last'] == @date("m", $val['st'])) {
                    $place = (($info['month']['lastdays'] - @date("d", $val['st'])) * (-1)) + $koeficient;
                } elseif ($info['month']['next'] == @date("m", $val['st'])) {
                    $place = $info['month']['thisdays'] + @date("d", $val['st']) + $koeficient;
                }
                 

                 
                if ($tpl == 'event.list' || $tpl == 'event.month') {
                    if ($val['startT'] == $val['endT'] && $val['endT'] == '00:00') {
                        $val['startT'] = '';
                        $val['endT'] = '';
                    }

                    $oid = $val['st'];
                    $oidc = 0;
                    while (isset($list[$oid . $oidc])) {
                        $oidc++;
                    }

                    if ($val['ade']) {
                        $val['et'] = $val['st'];
                    }

                    $list[$oid . $oidc] = array("color" => $val['color'], 'startD' => @date($DTFormats['date'], $val['st']), 'endD' => @date($DTFormats['date'], $val['et']), 'title' => $val['title'], 'tags' => $val['tags'], "startT" => $val['startT'], "endT" => $val['endT'], "link" => $val['link'], "id" => $val['id'], 'recurrence' => $val['recurrence']);

                    $mv['d' . $place][] = array("color" => $val['color'], 'day' => @date("d", $val['st']), 'title' => $val['title'], 'tags' => $val['tags'], "startT" => $val['startT'], "endT" => $val['endT'], "link" => $val['link']);

                    $use = array("color" => $val['color'], 'day' => @date("j", $val['st']), 'week' => @date("W", self::getMonday($val['st']) + (86400 * 2)), 'title' => $val['title'], 'tags' => $val['tags'], "startT" => $val['startT'], "endT" => $val['endT'], "link" => $val['link']);

                    if (isset($info['month']['nmw'][$use['week']]['data'][$use['day']])) {
                        $info['month']['nmw'][$use['week']]['data'][$use['day']]['events'][] = $use;
                    }
                }
                 
            }
        }

        if ($tpl != 'event.list') {
            krsort($list);
        }

        $info['list'] = $list;
        $info['monthView'] = $mv;

         
        if ($tpl != 'event.month' && $tpl != 'event.list') {
            if ($preordered) {
                foreach ($preordered as $key => $val) {
                    rsort($val);
                    $preordered[$key] = $val;
                }
            }
            ksort($preordered);

            $ordered = array();
            if ($preordered) {
                foreach ($preordered as $val) {
                    foreach ($val as $val2) {
                        foreach ($val2 as $val3) {
                            $ordered[] = $val3;
                        }
                    }
                }
            }

            $clmns = array();
            if ($ordered) {
                foreach ($ordered as $key => $val) {
                    $placed = false;
                    $clmn = 1;

                     
                    while (!$placed) {
                        if (isset($clmns[$val['day']][$clmn])) {
                            $countFor = count($clmns[$val['day']][$clmn]);
                            for ($i = 0; $i < $countFor; $i++) {
                                if (!(($val['start'] >= $clmns[$val['day']][$clmn][$i]['start'] && $val['start'] < $clmns[$val['day']][$clmn][$i]['end']) || ($val['start'] <= $clmns[$val['day']][$clmn][$i]['start'] && $val['end'] > $clmns[$val['day']][$clmn][$i]['start'])) && ($key != $clmns[$val['day']][$clmn][$i]['id'])) {
                                    $clmns[$val['day']][$clmn][$i]['start'] = $val['start'];
                                    $clmns[$val['day']][$clmn][$i]['end'] = $val['end'];
                                    $clmns[$val['day']][$clmn][$i]['id'] = $val['id'];
                                    $ordered[$key]['col'] = $clmn;
                                    $placed = true;
                                }
                            }
                        } else {
                            $clmns[$val['day']][$clmn][0]['start'] = $val['start'];
                            $clmns[$val['day']][$clmn][0]['end'] = $val['end'];
                            $clmns[$val['day']][$clmn][0]['id'] = $val['id'];
                            $ordered[$key]['col'] = $clmn;
                            $placed = true;
                        }
                        $clmn++;
                    }
                     

                    foreach ($ordered as $key2 => $val2) {
                        $vs = $val['start'];
                        $v2s = $val2['start'];
                        $vk = $val['end'];
                        $v2k = $val2['end'];
                        $v2d = $val2['day'];
                        $vd = $val['day'];
                        if ((($vs >= $v2s && $vs < $v2k) || ($vs <= $v2s && $vk > $v2s)) && ($vd == $v2d) && ($key != $key2)) {
                            $ordered[$key]['cols']++;
                        }
                    }
                }
            }

            if ($ordered) {
                foreach ($ordered as $key => $val) {
                     
                    $checked = array();
                    $max = self::getMaxColision($ordered, $val, $checked, $sichr);
                    $ordered[$key]['max'] = $max;
                     
                }
            }

            $data = [];
            if ($ordered) {
                foreach ($ordered as $key => $val) {
                     
                    if (isset($ordered[$key]['day'])) {
                        $dpos = $ordered[$key]['day'];

                        if ($ordered[$key]['max'] > 0) {
                            $ordered[$key]['leftC'] = ($column / $ordered[$key]['max']) * ($ordered[$key]['col'] - 1);
                        } else {
                            $ordered[$key]['leftC'] = 0;
                        }

                         
                        $ordered[$key]['start_big'] = $ordered[$key]['start'] * $rowBig + $top;
                        $ordered[$key]['end_big'] = $ordered[$key]['end'] * $rowBig;
                        $ordered[$key]['size_big'] = $ordered[$key]['size'] * $rowBig - 3;
                         

                        $ordered[$key]['start'] = $ordered[$key]['start'] * $row + $top;
                        if (($ordered[$key]['size']) <= 1) {
                            $ordered[$key]['start'] -= 1;
                        }
                        $ordered[$key]['end'] = $ordered[$key]['end'] * $row;
                        $ordered[$key]['size'] = $ordered[$key]['size'] * $row - 2;
                        if ($ordered[$key]['size'] + 2 == $row) {
                            $ordered[$key]['start']--;
                            $ordered[$key]['size'] = $row + 1;
                            $ordered[$key]['half'] = true;
                        }

                        if ($ordered[$key]['max'] > 0) {
                            $ordered[$key]['width'] = $column / $ordered[$key]['max'];
                        } else {
                            $ordered[$key]['width'] = 100;
                        }
                        $ordered[$key]['left'] = $ordered[$key]['leftC'];

                        if (isset($data['d' . $dpos])) {
                            $cn = count($data['d' . $dpos]);
                        } else {
                            $cn = 0;
                        }
                        $data['d' . $dpos][$cn] = $ordered[$key];
                    }
                     
                }
            }
             
            $working_hours = array('start' => 16, 'end' => 36);

            $min_start = 1000;
            if (!empty($data)) {
                foreach ($data as $v1) {
                    if (!empty($v1)) {
                        foreach ($v1 as $v2) {
                            if ($v2['start_big'] < $min_start) {
                                $min_start = $v2['start_big'];
                            }
                        }
                    }
                }
            }
            if ($min_start == 1000) {
                $min_start = $working_hours['start'] * $rowBig;
            }

            if ($working_hours['start'] * $rowBig < $min_start) {
                $min_start = $working_hours['start'] * $rowBig;
            }
            if (floor($min_start / $rowBig / 2) != ($min_start / $rowBig / 2)) {
                $min_start -= $rowBig;
            }
            $info['min_start'] = $min_start;

            $max_end = 0;
            if (!empty($data)) {
                foreach ($data as $v1) {
                    if (!empty($v1)) {
                        foreach ($v1 as $v2) {
                            if ($v2['end_big'] > $max_end) {
                                $max_end = $v2['end_big'];
                            }
                        }
                    }
                }
            }
            if ($max_end == 0) {
                $max_end = $working_hours['end'] * $rowBig;
            }

            if ($working_hours['end'] * $rowBig > $max_end) {
                $max_end = $working_hours['end'] * $rowBig;
            }
            if (floor($max_end / $rowBig / 2) != ($max_end / $rowBig / 2)) {
                $max_end += $rowBig;
            }
            $info['max_end'] = $max_end - $min_start;
        }
         

         
        $this->ade = array_reverse($this->ade);
        if ($this->ade) {
            $adeSortTemp = array();
            $i = 0;
            foreach ($this->ade as $key => $val) {
                if ($val['classic']) {
                    $i++;
                    $adeSortTemp[$this->clenupString($val['title']) . '-' . $val['id'] . '-' . $i] = $val;
                    unset($this->ade[$key]);
                }
            }

            ksort($adeSortTemp);
            $i = 0;
            foreach ($adeSortTemp as $key => $val) {
                $i++;
                $this->ade[$this->clenupString($val['title']) . '-' . $val['id'] . '-' . $i] = $val;
            }

            foreach ($this->ade as $val) {
                $pos = ($info['month']['startPos'] + $val['day']);
                if ($tpl == 'event.day') {
                    $pos = 0;
                }
                if ($pos >= 0) {
                    $data['ade']['d' . $pos][] = $val;
                }

                if ($tpl == 'event.month') {
                    $use = array("color" => $val['color'], 'day' => @date("j", $val['st']), 'week' => @date("W", self::getMonday($val['st']) + (86400 * 2)), 'title' => $val['title'], "startT" => $val['startT'], "endT" => $val['endT'], "link" => $val['link'], 'class' => $val['class'], 'tags' => $val['tags'], 'more' => $val['more']);

                    if (isset($info['month']['nmw'][$use['week']]['data'][$use['day']])) {
                        $info['month']['nmw'][$use['week']]['data'][$use['day']]['allDayEvents'][] = $use;
                    }
                }
            }
        }

         
        $next = false;
        $info['week'] = self::getWeek($w, true, $next);
        if ($tpl != 'event.month' && $tpl != 'event.list') {
            $info['view_type'] = $view_type;
        } else {
            $info['view_type'] = str_replace('event.', '', $tpl);
        }

        $ui = slGUI::instance();
        $request = slRequest::instance();
        $info['template'] = $ui->getFile('template', $tpl);

        $all['count'] = 1;

         
        if ($view_type == 'day') {
            $all = self::getDayItems($data, $info['week']);
        } elseif ($view_type == 'workweek') {
            $all = self::getWorkWeekItems($data, $info['week']);
        } else {
            $all = self::getWeekItems($data, $info['week']);
        }
         

         
        $all['count']++;
        $all['column_width'] = round(100 / ($all['count'] - 1), 3);
         

         
        $info['all'] = $all;
        $info['time_format'] = $DTFormats['time'];

                 $info['all']['events'];

        $session = slSettings::instance();
        $sets = WebmailSettings::instance($session);
        $calendarDataXml = $sets->getPrivate('calendar_settings');
        $calendarData = array();
        if (isset($calendarDataXml['@childnodes']['item'][0]['@childnodes'])) {
            $calendarDataXml = $calendarDataXml['@childnodes']['item'][0]['@childnodes'];
            foreach ($calendarDataXml as $key => $val) {
                $calendarData[$key] = $val[0]['@value'];
            }
        }
        $info['settings'] = $calendarData;

        return $data;
    }
     

     
    static public function getTranslated($what, $time)
    {
        $lang = slLanguage::instance();
        $name = $what . "_names";
        $c = $$name;
        return $lang->get('event_main', $c[@date($what, $time)]);
    }
     

     
    public function getDayItems($data, $info)
    {
         
        if (is_array($data)) {
            ksort($data);
        } else {
            $data = array();
        }
         

         
        $this_day = @date('w', $info['this_day']['start']);
        if ($this_day == 0) {
            $this_day = 7;
        }
        $this_day--;

        $this_day = 7 - self::$firstDayOfTheWeek + $this_day + 1;
        if ($this_day > 6) {
            $this_day = $this_day - 7;
        }

         
        $ade = $data['ade'];
        unset($data['ade']);
        $events = $data;
        if (!is_array($ade)) {
            $ade = array();
        }
        if (!is_array($events)) {
            $events = array();
        }
        $all = array();
        $all['events'] = array(array());
         
        $all['count'] = 1;
         

         
        for ($i = 0; $i < $all['count']; $i++) {
            $all['events'][$i]['items'] = array();
            $all['events'][$i]['start'] = $info['today'];
            $all['events'][$i]['dim_name'] = self::getTranslated('w', $info['today']);
            $all['events'][$i]['day'] = date('j', $info['today']);
            $all['events'][$i]['active'] = (date('dmY', $info['today']) == date('dmY'));
            $all['events'][$i]['end'] = $info['today'] + 86399;
            $all['events'][$i]['info'] = self::getTranslated('w', $info['today']) . " " . @date('d', $info['today']) . ". " . self::getTranslated('n', $info['today']);

            $all['ade'][$i] = array();
        }
         

         
        $i = -1;
        if ($ade) {
            foreach ($ade as $key => $val) {
                $i++;
                if ($val[0]['day'] == $this_day) {
                    $all['ade'][0] = $val;
                }
            }
        }
         

         
        $i = -1;
        if ($events) {
            foreach ($events as $key => $val) {
                $i++;
                if ($val[0]['day'] == $this_day) {
                    $all['events'][0]['items'] = $val;
                }
            }
        }
         

         
        $all['next']['start'] = $info['next_day']['start'];
        $all['next']['end'] = $info['next_day']['end'];
        $all['previous']['start'] = $info['previous_day']['start'];
        $all['previous']['end'] = $info['previous_day']['end'];
        $all['this']['start'] = $info['previous_week']['end'] + 1;
        $all['this']['end'] = $info['next_week']['start'] - 1;
         
        return $all;
    }
     

     
    public function getWeekItems($data, $info)
    {
         
        if (!is_array($data)) {
            $data = array();
        }
        $ade = $data['ade'];
        unset($data['ade']);
        $events = $data;
        if (!is_array($ade)) {
            $ade = array();
        }
        if (!is_array($events)) {
            $events = array();
        }

        $all = array();
        $all['events'] = array(array());
         
        $all['count'] = 7;
         

        ksort($events);
        ksort($ade);

         
        for ($i = 0; $i < $all['count']; $i++) {
            $today = mktime(0, 0, 0, @date("m", $info['this_week']['start']), @date("d", $info['this_week']['start']) + $i, @date("Y", $info['this_week']['start']));
            $all['events'][$i]['items'] = array();
            $all['events'][$i]['start'] = $today;
            $all['events'][$i]['dim_name'] = self::getTranslated('w', $today);
            $all['events'][$i]['day'] = date('j', $today);
            $all['events'][$i]['active'] = (date('dmY', $today) == date('dmY'));
            $all['events'][$i]['end'] = $today + 86399;
            $all['events'][$i]['info'] = self::getTranslated('w', $today) . " " . @date('d', $today) . ". " . self::getTranslated('n', $today);

            $all['ade'][$i] = array();;
        }
         

         
        $i = -1;
        if ($ade) {
            foreach ($ade as $key => $val) {
                $i++;
                if ($i < $all['count'] && $val[0]['day'] < $all['count']) {
                    $all['ade'][$val[0]['day']] = $val;
                }
            }
        }
         

         
        $i = -1;
        if ($events) {
            foreach ($events as $key => $val) {
                $i++;
                if ($i < $all['count']) {
                    $all['events'][$val[0]['day']]['items'] = $val;
                }
            }
        }
         

        ksort($all['ade']);
        ksort($all['events']);

         
        $all['next']['start'] = $info['next_week']['start'];
        $all['next']['end'] = $info['next_week']['end'];
        $all['previous']['start'] = $info['previous_week']['start'];
        $all['previous']['end'] = $info['previous_week']['end'];
        $all['this']['start'] = $info['previous_week']['end'] + 1;
        $all['this']['end'] = $info['next_week']['start'] - 1;
         
        return $all;
    }
     

     
    public function getWorkWeekItems($data, $info)
    {
         
        if (!is_array($data)) {
            $data = array();
        }
        $ade = $data['ade'];
        unset($data['ade']);
        $events = $data;
        if (!is_array($ade)) {
            $ade = array();
        }
        if (!is_array($events)) {
            $events = array();
        }
        $all = array();
        $all['events'] = array(array());
         
        $all['count'] = 5;
         

         
        $session = slSession::instance();
        $week_begins = $session->getMain("['week_begins']");
        $days = array('monday' => 1, 'tuesday' => 2, 'wednesday' => 3, 'thursday' => 4, 'friday' => 5, 'saturday' => 6, 'sunday' => 7);
        $week_begins = $days[$week_begins];
         

         
        if ($week_begins > 1 && $week_begins != 7) {
            $week_begins = 7;
        }
         

         
        $sat = 6 - $week_begins;
        $sun = 7 - $week_begins;
        if ($sat == -1) {
            $sat = 6;
        }
         

        ksort($events);
        ksort($ade);

         
        for ($i = 0; $i < $all['count'] + 2; $i++) {
            $today = mktime(0, 0, 0, @date('m', $info['this_week']['start']), @date('d', $info['this_week']['start']) + $i, @date('Y', $info['this_week']['start']));
            $today_day = @date('w', $today);
            if ($today_day != 6 && $today_day != 0) {
                $all['events'][$i]['items'] = array();
                $all['events'][$i]['start'] = $today;
                $all['events'][$i]['dim_name'] = self::getTranslated('w', $today);
                $all['events'][$i]['day'] = date('j', $today);
                $all['events'][$i]['active'] = (date('dmY', $today) == date('dmY'));
                $all['events'][$i]['end'] = $today + 86399;
                $all['events'][$i]['info'] = self::getTranslated('w', $today) . " " . @date('d', $today) . ". " . self::getTranslated('n', $today);
                $all['ade'][$i] = array();
            }
        }
         

         
        unset($all['events'][$sat]);
        unset($all['events'][$sun]);
        unset($all['ade'][$sat]);
        unset($all['ade'][$sun]);
         

         
        $i = -1;
        $i2 = 0;
        if ($ade) {
            foreach ($ade as $key => $val) {
                $i++;
                if ($i2 < $all['count'] && $val[0]['day'] != $sat && $val[0]['day'] != $sun && $val[0]['day'] <= $all['count']) {
                    $i2++;
                    $all['ade'][$val[0]['day']] = $val;
                }
            }
        }
         

         
        $i = -1;
        $i2 = 0;
        foreach ($events as $key => $val) {
            $i++;
            if ($i2 < $all['count'] && $val[0]['day'] != $sat && $val[0]['day'] != $sun) {
                $i2++;
                $all['events'][$val[0]['day']]['items'] = $val;
            }
        }
         

        ksort($all['ade']);
        ksort($all['events']);

         
        $all['next']['start'] = $info['next_week']['start'];
        $all['next']['end'] = $info['next_week']['end'];
        $all['previous']['start'] = $info['previous_week']['start'];
        $all['previous']['end'] = $info['previous_week']['end'];
        $all['this']['start'] = $info['previous_week']['end'] + 1;
        $all['this']['end'] = $info['next_week']['start'] - 1;
         
        return $all;
    }

     

    public function checkItems($data, &$info)
    {
        $checked = slSession::getPage('selected_items');
        if (!empty($checked)) {
            $checked_rest_list = array_flip($checked);
            if (!$checked) {
                $checked = array();
            }
            foreach ($data as &$val) {
                if (in_array($val['id'], $checked)) {
                    $val['checked'] = true;
                    if (isset($checked_rest_list[$val['id']])) {
                        unset($checked_rest_list[$val['id']]);
                    }
                }
            }
            $checked_rest_list = array_flip($checked_rest_list);
            $checked_rest_list = array_values($checked_rest_list);

            $info['checked'] = $checked_rest_list;
            $info['checked_count'] = count($checked_rest_list);
        }
        return $data;
    }

     
    public function JfinishHandler($data, &$info)
    {
        $data = $this->checkItems($data, $info);
        $info['list'] = $data;
        return $data;
    }

    public function NfinishHandler($data, &$info)
    {
        $data = $this->checkItems($data, $info);
        $info['list'] = $data;
        return $data;
    }

    public function FfinishHandler($data, &$info)
    {
        $DTFormats = self::getDTFormats();
        if (!empty($data)) {
            foreach ($data as $key => $val) {
                $ex = explode('.', $val['EVNTITLE']);
                $data[$key]['extension'] = strtolower($ex[count($ex) - 1]);
                $data[$key]['EVNCOMPLETE'] = $this->format_bytes($val['EVNCOMPLETE']);
                $data[$key]['EVN_MODIFIED'] = @date($DTFormats['date'] . self::convertTimeFormat(" H:i:s", $DTFormats['time']), $val['EVN_MODIFIED']);
            }
        }
        $data = $this->checkItems($data, $info);
        $info['list'] = $data;

        return $data;
    }

    public function TfinishHandler($data, &$info)
    {
        $data = $this->checkItems($data, $info);
        $info['list'] = $data;
        return $data;
    }
     

     
    public function CfinishHandler($data, &$info)
    {
        $ui = slGUI::instance();
        $request = slRequest::instance();
        $tpl = $request->get('all.view');
        $widget = $this->getWidget('grid');
        try {
            $tpl = $widget->getProperty('view');
        } catch (Exception $e) {}

        if ($tpl == '') {
            $tpl = 'contact.list';
        }

        $data = $this->checkItems($data, $info);

        $info['template'] = $ui->getFile('template', $tpl);
        return $data;
    }
     

     
    public function MFinishHandler($data, &$info)
    {
        try {
            $ui = slGUI::instance();
            $info['read'] = $ui->getFile('css/images/grid/', 'ico_unread', true, '.gif');
        } catch (Exception $e) {}

        $data = $this->checkItems($data, $info);

        $info['sid'] = session_id();
        $info['uid'] = $_SESSION['EMAIL'];

        return $data;
    }

     

    public function createConversationHeaders(&$result)
    {
                 $result['data']['in-reply-to'] = $result['data']['message_id'];
        $result['data']['references'] = ($result['data']['references']) ? ($result['data']['references'] . "\n\t") . $result['data']['message_id'] : $result['data']['message_id'];
    }

    public function createMessageEnvelope($type, &$data, $htmlspecialchars = true)
    {
        $settings['helper'] = 'settings';
        $settingsHelper = slHelperFactory::instance($settings);
        $default = $settingsHelper->getPrivate('mail_settings_general');
        $default = $default['@childnodes']['item'][0]['@childnodes'];
        $classic_prefix = $default['classic_prefix'][0]['@value'];

        $language = slLanguage::instance();
        if ($data['data']['content-type'] == 'html') {
            $subject = $language->get('mail_compose', 'subject') . ': ' . slToolsPHP::htmlspecialchars($data['data']['subject']);
            $from = $language->get('mail_compose', 'from') . ': ' . slToolsPHP::htmlspecialchars($data['data']['from']);
            $to = $language->get('mail_compose', 'to') . ': ' . slToolsPHP::htmlspecialchars($data['data']['to']);

            $subjectt = $language->get('mail_compose', 'subject') . ': ' . $data['data']['subject'];
            $fromt = $language->get('mail_compose', 'from') . ': ' . $data['data']['from'];
            $tot = $language->get('mail_compose', 'to') . ': ' . $data['data']['to'];

            if ($htmlspecialchars) {
                $subject = slToolsPHP::htmlspecialchars($subject);
                $from = slToolsPHP::htmlspecialchars($from);
                $to = slToolsPHP::htmlspecialchars($to);
                $subjectt = slToolsPHP::htmlspecialchars($subjectt);
                $fromt = slToolsPHP::htmlspecialchars($fromt);
                $tot = slToolsPHP::htmlspecialchars($tot);
            }

            $date = $language->get('mail_compose', 'date') . ': ' . $data['data']['date'];
            $headHTML = $subject . "<br/>" . $from . "<br/>" . $to . "<br/>" . $date . "<br/>";
            $headText = $subjectt . "\r\n" . $fromt . "\r\n" . $tot . "\r\n" . $date . "\r\n";
            $original = $language->get('mail_compose', 'original_message');
            $html = $data['data']['html'];
            $data['data']['html'] = "<br />" . $original . "<br />" . $headHTML . "<br />" . $html;
            $data['data']['text'] = "\n" . $original . "\n" . $headText . "\n" . slToolsString::removeHTML($html);

            if (isset($default['no_reply_prefix'][0]['@value']) && $default['no_reply_prefix'][0]['@value'] == 0) {
                $prefixed = ">" . str_replace("\n", "\n>", trim($data['data']['text']));
                $data['data']['text'] = "\n" . $prefixed;
                if ($htmlspecialchars) {
                    $html = slToolsPHP::htmlspecialchars($html);
                }
                $data['data']['html'] = "<br /><br /><div style=\"border-left:#777 3px solid; margin-left:5px; padding-left:5px;\">" . $original . "<br />" . $headHTML . "<br />" . $html . "</div>";
            }

        }
        if ($data['data']['content-type'] == 'text') {
            $pref = "";
            if (isset($default['no_reply_prefix'][0]['@value']) && $default['no_reply_prefix'][0]['@value'] == 0) {
                $pref = '>';
            }

            $subject = $language->get('mail_compose', 'subject') . ': ' . $data['data']['subject'];
            $from = $pref . $language->get('mail_compose', 'from') . ': ' . $data['data']['from'];
            $to = $pref . $language->get('mail_compose', 'to') . ': ' . $data['data']['to'];
            $date = $pref . $language->get('mail_compose', 'date') . ': ' . $data['data']['date'];
            $head = $pref . $subject . "\r\n" . $from . "\r\n" . $to . "\r\n" . $date . "\r\n" . $pref;

            $original = $pref . $language->get('mail_compose', 'original_message');
            if (isset($default['no_reply_prefix'][0]['@value']) && $default['no_reply_prefix'][0]['@value'] == 0) {
                $prefixed = ">" . str_replace("\n", "\n>", trim($data['data']['text']));
                $data['data']['text'] = $prefixed;
            }

            $data['data']['text'] = "\n\n" . $original . "\n" . $head . "\n" . $data['data']['text'];
            if ($htmlspecialchars) {
                $data['data']['text'] = slToolsPHP::htmlspecialchars($data['data']['text']);
            }
            $data['data']['html'] = nl2br(slToolsPHP::htmlspecialchars($data['data']['text']));
        }
        if($type == 'reply'){
            $data['data']['subject'] = $this->addSubjectPrefix($data['data']['subject'], 'Re', $classic_prefix);
        }elseif($type == 'forward'){
            $data['data']['subject'] = $this->addSubjectPrefix($data['data']['subject'], 'Fw', $classic_prefix);
        }
    }

    public function addSubjectPrefix($value, $prefix, $classic_prefix)
    {
        if ($classic_prefix || !preg_match('/^' . $prefix . '(\[([0-9]+)\])?(\s)?:(\s)?/si', $value, $matches)) {
            $value = $prefix . ':' . $value;
        } else {
            $val = (intval($matches[2]) == 0) ? '2' : (intval($matches[2]) + 1);
            $value = preg_replace('/^' . $prefix . '(\[([0-9]+)\])?(\s)?:(\s)?/si', $prefix . '[' . $val . ']' . $matches[3] . ':' . ($matches[4] == '' ? ' ' : $matches[4]), $value);
        }
        return $value;
    }

    public function addSignature($value, $signature, $type, $to_top)
    {
        $signature = str_replace('&lt;script', '<script', $signature);
        $signature = str_replace('&lt;/script&gt;', '</script>', $signature);
        $signature = preg_replace("/(<[^>]*script[^<]*<\/script>)/i", "", $signature);

        $newline = $type == 'html' ? '<br/>' : "\n";
        if (trim($signature) != '') {
            if ($to_top) {
                $value = $newline . $signature . $newline . $value;
            } else {
                $value = $value . $newline . $newline . $signature;
            }
        }
        return $value;
    }

    static public function convertDateFormat($format)
    {
        if (is_numeric($format)) {
            $types = array('mm/dd/yy', 'mm/dd/yyyy', 'dd-mm-yyyy', 'dd/mm/yyyy', 'yyyy-mm-dd', 'dd-mm-yy', 'dd/mm/yy', 'dd.mm.yy', 'dd.mm.yyyy');
            $format = $types[$format];
        }

        $pre = array('dd', 'mm', 'yyyy', 'yy');
        $post = array('d', 'm', 'Y', 'y');
        return str_replace($pre, $post, $format);
    }

    public function convertTimeFormat($definition, $format = 0)
    {
        $pre = array('H');
        $post = array('h');

        if ($format == 0) {
            return str_replace($pre, $post, $definition . 'a');
        } else {
            return str_replace($post, $pre, $definition);
        }
    }

    static public function getDTFormats()
    {
        if (empty(self::$DTF)) {
            $helper['helper'] = 'settings';
            $helperObject = slHelperFactory::instance($helper);
            $mail_settings_default = $helperObject->getPrivate('layout_settings');
            $mail_settings_default = $mail_settings_default['@childnodes']['item'][0]['@childnodes'];

            if (isset($mail_settings_default['date_format'])) {
                $date_format = $mail_settings_default['date_format'][0]['@value'];
            } else {
                $date_format = 'dd/mm/yyyy';
            }
                         if (isset($mail_settings_default['time_format'])) {
                $time_format = $mail_settings_default['time_format'][0]['@value'];
            } else {
                $time_format = 1;
            }

            $time_format = abs($time_format - 1);

            self::$DTF['date'] = $date_format;
            self::$DTF['time'] = $time_format;
        } else {
            $date_format = self::$DTF['date'];
            $time_format = self::$DTF['time'];
        }
        return array('date' => self::convertDateFormat($date_format), 'time' => $time_format);
    }

    public function format_bytes($size)
    {
        $units = array(' B', ' KB', ' MB', ' GB', ' TB');
        for ($i = 0; $size >= 1024 && $i < 4; $i++) $size /= 1024;
        return round($size, 2) . $units[$i];
    }
}

?>
