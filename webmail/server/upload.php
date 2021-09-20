<?php
 

require_once('inc/require.php');
require_once('inc/include.php');
require_once('inc/exception.php');
require_once('inc/defines.php');

function upload_error($msg, $userMessage = '')
{
    log_buffer("Upload session [" . ($_SESSION['SID'] ? $_SESSION['SID'] : 'Unauthorized') . "] ERROR : [" . $msg . "]", "DEBUG");
    echo $userMessage !== '' ? $userMessage : $msg;
    exit(0);
}

function main()
{
    if (defined('SECURE_COOKIE') && SECURE_COOKIE) {
        header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
    }
     
    if ($_FILES['file']['error'] <> UPLOAD_ERR_OK || empty($_FILES)) {
        exit('File upload error');
    }
    if (($sid = Post()->sid) === null) exit('Invalid sid');
    if (!isset($_FILES['file'])) exit('Invalid file');

    $itemID = Post()->item;
    $folderID = Post()->folder;

    $resize = Post()->resize;
    $quality = Post()->quality;
    $crop = Post()->crop;
    $width = Post()->width;
    $height = Post()->height;
    $type = Post()->type;

    switch ($_FILES['file']['error']) {
        case UPLOAD_ERR_OK:
            try {
                                 $user = User::load($sid);
                log_buffer("Upload session [" . ($sid ? $sid : 'Unauthorized') . "] STARTED", "DEBUG");

                                 if (substr($folderID, 0, 4) == 'logo' || substr($folderID, 0, 10) == 'background') {
                    $subdir = substr($folderID, 0, 4) == 'logo' ? 'logo' : 'background';
                                                              $pathData = explode("/", $folderID);
                    if ($pathData[1]) {
                        $domain = urldecode($pathData[1]);
                    }
                    switch ($_SESSION['ACCOUNT']) {
                        case 2:
                            if (!$domain) {
                                throw new Exc('upload_logo_permissions', 'upload_logo_permissions');
                            }
                            break;
                        case 1:
                            break;
                        default:
                        case 0:
                            throw new Exc('upload_logo_permissions', 'upload_logo_permissions');
                            break;
                    }
                    $name = str_replace('"', '\\\\"', $_FILES['file']['name']);

                                         $surl = (($_SERVER['HTTPS'] == 'ON' || ($_SESSION['ALWAYSHTTPS'] ?? false)) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['SCRIPT_NAME'];
                    $surl = substr($surl, 0, strpos($surl, "/server/") + 1);
                    $ext = strtolower(substr($name, strrpos($name, '.') + 1));

                    if (!in_array($ext, array('jpg', 'jpeg', 'gif', 'png'))) {
                        upload_error('Unsupported extension: ' . $ext);
                        break;
                    }

                    $api = IceWarpAPI::instance();
                    $config_path = $api->GetProperty('c_configpath');
                    $save_path = $config_path . '/_webmail/images/' . $subdir . '/custom/';
                    if ($domain) {
                        $save_path .= $domain . '/';
                    }
                    if (!is_dir($save_path)) {
                        slSystem::import('tools/filesystem');
                        slToolsFilesystem::mkdir_r($save_path);
                    }
                    $save_path .= 'login_' . $subdir . '.' . $ext;
                    $name = 'login_' . $subdir . '.' . $ext;
                    $itemID = $name;
                    $_FILES['file']['name'] = $itemID;
                    move_uploaded_file($_FILES['file']['tmp_name'], $save_path);
                    break;
                }
                if (!$folderID) $folderID = date('Y-m-d-') . Tools::my_uniqid();
                if (!$itemID) {
                    $itemID = Tools::my_uniqid();
                }
                                 if (Post()->dump) {
                    echo $folderID . "<br/>";
                    echo $itemID;
                }
                log_buffer("Upload session [" . ($sid ? $sid : 'Unauthorized') . "] FILE [Name:" . $_FILES['file']['name'] . ",Type:" . $_FILES['file']['type'] . ",Size:" . $_FILES['file']['size'] . "]", "DEBUG");

                                 if (!$user->addAttachment('file', $folderID, $itemID)) {
                    upload_error('Cannot save the attachment');
                }

                                 define('RESIZE_THRESHOLD', 100 * 1024);

                                 if ($resize && ($_FILES['file']['size'] > RESIZE_THRESHOLD)) {
                    $attachment = $user->getAttachments($folderID, $itemID);
                    slSystem::import('tools/image');
                    try {
                        $image = new slToolsImage();
                        $image->ignoreFileExtension(true);
                        $image->load($attachment['file']);
                        $image->edit($width, $height, $crop, true);
                        $image->save(false, false, $quality, $type);
                    } catch (ImageException $e) {
                        upload_error($e->getMessage(), $e->getUserMessage());
                    }
                }
            } catch (Exception $e) {
                upload_error($e->getMessage());
            }
            break;

        default:
            upload_error('File upload error: ' . $_FILES['file']['error']);
            break;
    }

    if ($resize) {
        $size = filesize($attachment['file']);
    } else {
        $size = $_FILES['file']['size'];
    }

    log_buffer("Upload session [" . ($sid ? $sid : 'Unauthorized') . "] ENDED", "DEBUG");
         if (Post()->swf) {
        header('Content-type: text/json');
        die(json_encode(['folder' => $folderID, 'id' => $itemID, 'size' => $size]));
    } else if (($obj = Post()->obj) !== null) {

        $name = str_replace('"', '\\\\"', $_FILES['file']['name']);

                 $surl = (($_SERVER['HTTPS'] == 'ON' || ($_SESSION['ALWAYSHTTPS'] ?? false)) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['SCRIPT_NAME'];
        $surl = substr($surl, 0, strpos($surl, "/server/") + 1);

        echo '
		<html>
		<head>
			<base href="' . $surl . '">
			<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		</head>
		<body>
		<script language="javascript">
			eval("window.parent.' . $obj . '._setFolder(\\"' . $folderID . '\\");");
			eval("window.parent.' . $obj . '._add({id:\\"' . $itemID . '\\",path:\\"' . str_replace("\\", "\\\\", quotemeta(Post()->path)) . '\\",name:\\"' . $name . '\\",size:\\"' . $size . '\\"})");
		</script>
		</body>
		</html>';
    }
}

main();

?>
