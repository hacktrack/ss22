// permissions
var RIGHTS_HIDE = 0;
var RIGHTS_READONLY = 1;
var RIGHTS_FULL = 2;
// user type
var USER_USER = 0;
var USER_ADMIN = 1;
var USER_DOMAIN = 2;
var USER_WEB = 3;
// resource levels
var RESOURCE_LEVEL_SERVER = 0;
var RESOURCE_LEVEL_DOMAIN = 1;
var RESOURCE_LEVEL_ACCOUNT = 2;
// checked status
var FORCE_DEFAULT = 0; // unchecked
var FORCE_CHECKED = 2;
var FORCE_UNCHECKED = 3;
var FORCE_HIDDEN = 10;
var FORCE_CHECKED_HIDDEN = FORCE_HIDDEN + FORCE_CHECKED;
var FORCE_UNCHECKED_HIDDEN = FORCE_HIDDEN + FORCE_UNCHECKED;
// readonly
var READONLY_NONE = 0;
var READONLY_DOMAIN = 1;
var READONLY_USER = 2;
var READONLY_BOTH = 3;
// checked
var CHECKED_NONE = 0;
var CHECKED_DOMAIN = 1;
var CHECKED_USER = 2;
var CHECKED_BOTH = 3;
// com types
var COM_TYPE_SERVER = 'server';
var COM_TYPE_DOMAIN = 'domain';
var COM_TYPE_ACCOUNT = 'account';
var COM_TYPE_STATISTICS = 'statistics';
// outlook sync type
var OS_TYPE_ACCOUNT = 0;
var OS_TYPE_DOMAIN = 1;
var OS_TYPE_SERVER = 3;
var V_TYPE_BOOLEAN = 0;
var V_TYPE_INTEGER = 1;
var V_TYPE_NUMBER = 1;
var V_TYPE_STRING = 2;
