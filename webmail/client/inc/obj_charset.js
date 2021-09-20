_me = obj_charset.prototype;
function obj_charset(){};

_me.__constructor = function(){
	this._fill({
	"UTF-8":'Auto Unicode (UTF8)',
	"ISO-8859-1":'Western European (ISO-8859-1)',
	"WINDOWS-1252":'Western European (Windows-1252)',
	"ISO-88595":'Cyrillic Alphabet (ISO-8859-5)',
	"WINDOWS-1251":'Cyrillic Alphabet (Windows-1251)',
	"GBK":'Chinese Simplified (GBK)',
	"BIG5":'Chinese Traditional (Big5)',
	"EUC-JP":'Japanese (EUC)',
	"SHIFT_JIS":'Japanese (SHIFT_JIS)',
	"ISO-2022-jp":'Japanese (ISO-2022)',
	"euc-kr":'Korean (EUC)',
	"KS_C_5601-1987":'Korean (ks_c_5601-1987)',
	"ISO-8088-kr":'Korean (ISO-2022)',
	"ISO-8859-9":'Turkish (ISO-8859-9)',
	"WINDOWS-1254":'Turkish (Windows-1254)',
	"ISO-8859-8":'Hebrew (ISO-8859-8)',
	"WINDOWS-1255":'Hebrew (Windows-1255)',
	"ISO-8859-2":'Central European (ISO-8859-2)',
	"WINDOWS-1250":'Central European (Windows-1250)',
	"ISO-8859-4":'Baltic (ISO-8859-4)',
	"WINDOWS-1257":'Baltic (Windows-1257)',
	"ISO-8859-6":'Arabic (ISO-8859-6)',
	"WINDOWS-1256":'Arabic (Windows-1256)',
	"ISO-8859-7":'Greek (ISO-8859-7)',
	"WINDOWS-1253":'Greek (Windows-1253)',
	"WINDOWS-874":'Thai (Windows-874)',
	"TIS-620":'Thai (tis-620)'});

	// default value
	this._value('UTF-8');
};