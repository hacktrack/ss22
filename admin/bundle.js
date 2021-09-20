(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var T=require("icebrace-runtime"),v,s={0:'\' \'+T.e(c,v,\'identifier\')+\' \'',1:'\' \'+T.e(c,v,\'.\')+\' \'',2:'\' data-ad-format="\'+T.e(c,v,\'format\')+\'" \'',3:'\' \'+T.e(c,v,\'key\')+\':\'+T.e(c,v,\'value\')+\';\''};module.exports=function(c){var c={c:c,p:0};return'<ins '+T.u(c,v,'hook')+' class=" adsbygoogle o-ad__ins '+T.s(s,c,v,'identifier', s[0])+' '+T.s(s,c,v,'class_name', s[1])+'" data-ad-client="'+T.e(c,v,'client_id')+'" data-ad-slot="'+T.e(c,v,'slot_id')+'" '+T.s(s,c,v,'format', s[2])+' style="'+T.s(s,c,v,'style', s[3])+' "></ins> '}
},{"icebrace-runtime":"icebrace-runtime"}],2:[function(require,module,exports){
"use strict";
var T=require("icebrace-runtime"),v,s={0:'\' \'+T.e(c,v,\'.\')+\' \'',1:'\' <div class="\'+T.s(s,c,v,\'class_name\', s[0])+\'" style="background-image: url(\\\'\'+T.e(c,v,\'src\')+\'\\\')"></div> \'',2:'\'\'+T.c(\'_name\', c.c)+\'\''};module.exports=function(c){var c={c:c,p:0};return'<div class="o-ad" '+T.u(c,v,'hook')+'> '+T.s(s,c,v,'image', s[1])+''+T.s(s,c,v,'component', s[2])+'</div> '}
},{"icebrace-runtime":"icebrace-runtime"}],3:[function(require,module,exports){
"use strict";
var T=require("icebrace-runtime"),v,s={0:'\' o-addon--\'+T.e(c,v,\'.\')+\' \'',1:'\' \'+T.e(c,v,\'.\')+\' \'',2:'\'\'+T.e(c,v,\'text\')+\'\''};module.exports=function(c){var c={c:c,p:0};return'<a href="javascript:" class=" o-addon '+T.s(s,c,v,'mod', s[0])+' '+T.s(s,c,v,'class_name', s[1])+' "'+T.u(c,v,'hook')+' tabIndex="-1">'+T.s(s,c,v,'text', s[2])+'</a> '}
},{"icebrace-runtime":"icebrace-runtime"}],4:[function(require,module,exports){
"use strict";
var T=require("icebrace-runtime"),v,s={0:'\' o-avatar--image \'',1:'\' o-avatar--letter \'',2:'\'\'+T.e(c,v,\'.\')+\'\'',3:'\' o-avatar--\'+T.e(c,v,\'.\')+\' \'',4:'\' style="background-image: url(\\\'\'+T.e(c,v,\'image\')+\'\\\')" \'',5:'\' data-\'+T.e(c,v,\'tag\')+\'="\'+T.e(c,v,\'value\')+\'" \'',6:'\' \'+T.s(s,c,v,\'data\', s[5])+\' \'',7:'\'\'+T.e(c,v,\'letter\')+\'\''};module.exports=function(c){var c={c:c,p:0};return'<div class=" o-avatar '+T.s(s,c,v,'image', s[0])+' '+T.i(s,c,v,'image', s[1])+' '+T.s(s,c,v,'class_name', s[2])+' '+T.s(s,c,v,'mod', s[3])+' " '+T.s(s,c,v,'image', s[4])+' '+T.i(s,c,v,'image', s[6])+'>'+T.i(s,c,v,'image', s[7])+'</div> '}
},{"icebrace-runtime":"icebrace-runtime"}],5:[function(require,module,exports){
"use strict";
var T=require("icebrace-runtime"),v,s={0:'\' is-self \'',1:'\'<a class="o-chat__username" \'+T.u(c,v,\'to-hook\')+\'>\'+T.e(c,v,\'name\')+\'</a>\''};module.exports=function(c){var c={c:c,p:0};return'<div class=" o-chat__message '+T.s(s,c,v,'self', s[0])+' "><span class="o-chat__text">'+T.s(s,c,v,'to', s[1])+''+T.u(c,v,'text')+'</span></div> '}
},{"icebrace-runtime":"icebrace-runtime"}],6:[function(require,module,exports){
"use strict";
var T=require("icebrace-runtime"),v,s={0:'\'\'+T.c(\'atoms-icons\', c.c)+\'\'',1:'\' <label class="o-dropdown__text">\'+T.e(c,v,\'code\')+\'</label> \''};module.exports=function(c){var c={c:c,p:0};return'<div class="o-dropdown" '+T.u(c,v,'hook')+'> '+T.s(s,c,v,'icon', s[0])+''+T.s(s,c,v,'code', s[1])+'</div> '}
},{"icebrace-runtime":"icebrace-runtime"}],7:[function(require,module,exports){
"use strict";
var T=require("icebrace-runtime"),v,s={0:'\' \'+T.e(c,v,\'.\')+\' \'',1:'\' name="\'+T.e(c,v,\'name\')+\'"\'',2:'\' type="button"\'',3:'\' type="\'+T.e(c,v,\'type\')+\'"\'',4:'\' value="\'+T.e(c,v,\'value\')+\'"\'',5:'\' disabled="\'+T.e(c,v,\'disabled\')+\'"\'',6:'\'\'+T.c(\'atoms-icons\', c.c)+\'\'',7:'\'\'+T.e(c,v,\'text\')+\'\''};module.exports=function(c){var c={c:c,p:0};return'<button '+T.u(c,v,'hook')+' '+T.s(s,c,v,'class_name', s[0])+' '+T.s(s,c,v,'name', s[1])+' '+T.i(s,c,v,'type', s[2])+' '+T.s(s,c,v,'type', s[3])+' '+T.s(s,c,v,'value', s[4])+' '+T.s(s,c,v,'disabled', s[5])+' >'+T.s(s,c,v,'icon', s[6])+'<span>'+T.s(s,c,v,'text', s[7])+'</span></button> '}
},{"icebrace-runtime":"icebrace-runtime"}],8:[function(require,module,exports){
"use strict";
var T=require("icebrace-runtime"),v,s={0:'\' \'+T.e(c,v,\'.\')+\'\'',1:'\' type="\'+T.e(c,v,\'type\')+\'"\'',2:'\' accept="\'+T.e(c,v,\'accept\')+\'"\'',3:'\' name="\'+T.e(c,v,\'name\')+\'"\'',4:'\' value="\'+T.e(c,v,\'value\')+\'"\'',5:'\' placeholder="\'+T.e(c,v,\'placeholder\')+\'"\'',6:'\' autocomplete="\'+T.e(c,v,\'autocomplete\')+\'"\'',7:'\' max="\'+T.e(c,v,\'max\')+\'"\'',8:'\' min="\'+T.e(c,v,\'min\')+\'"\'',9:'\' size="\'+T.e(c,v,\'size\')+\'"\'',10:'\' maxlength="\'+T.e(c,v,\'maxlength\')+\'"\'',11:'\' minlength="\'+T.e(c,v,\'minlength\')+\'"\'',12:'\' multiple="\'+T.e(c,v,\'multiple\')+\'"\'',13:'\' readonly="readonly"\'',14:'\' checked="checked"\'',15:'\' disabled="disabled"\'',16:'\' required\''};module.exports=function(c){var c={c:c,p:0};return'<input class="'+T.s(s,c,v,'class_name', s[0])+'" '+T.s(s,c,v,'type', s[1])+' '+T.s(s,c,v,'accept', s[2])+' '+T.s(s,c,v,'name', s[3])+' '+T.s(s,c,v,'value', s[4])+' '+T.s(s,c,v,'placeholder', s[5])+' '+T.s(s,c,v,'autocomplete', s[6])+' '+T.s(s,c,v,'max', s[7])+' '+T.s(s,c,v,'min', s[8])+' '+T.s(s,c,v,'size', s[9])+' '+T.s(s,c,v,'maxlength', s[10])+' '+T.s(s,c,v,'minlength', s[11])+' '+T.s(s,c,v,'multiple', s[12])+' '+T.s(s,c,v,'readonly', s[13])+' '+T.s(s,c,v,'checked', s[14])+' '+T.s(s,c,v,'disabled', s[15])+' '+T.s(s,c,v,'required', s[16])+' '+T.u(c,v,'hook')+' > '}
},{"icebrace-runtime":"icebrace-runtime"}],9:[function(require,module,exports){
"use strict";
var T=require("icebrace-runtime"),v,s={0:'\' \'+T.e(c,v,\'.\')+\' \'',1:'\' name="\'+T.e(c,v,\'name\')+\'"\'',2:'\' size="\'+T.e(c,v,\'size\')+\'"\'',3:'\' disabled="disabled"\'',4:'\' readonly="readonly"\'',5:'\' multiple="true"\'',6:'\'\'+T.e(c,v,\'value\')+\'\'',7:'\' label="\'+T.e(c,v,\'label\')+\'"\'',8:'\' selected="selected"\'',9:'\' hidden="hidden"\'',10:'\' disabled="disabled"\'',11:'\' <option value="\'+T.s(s,c,v,\'value\', s[6])+\'" \'+T.s(s,c,v,\'label\', s[7])+\' \'+T.s(s,c,v,\'selected\', s[8])+\' \'+T.s(s,c,v,\'hidden\', s[9])+\' \'+T.s(s,c,v,\'disabled\', s[10])+\' >\'+T.e(c,v,\'text\')+\'</option> \''};module.exports=function(c){var c={c:c,p:0};return'<select '+T.u(c,v,'hook')+' class="'+T.s(s,c,v,'class_name', s[0])+'" '+T.s(s,c,v,'name', s[1])+' '+T.s(s,c,v,'size', s[2])+' '+T.s(s,c,v,'disabled', s[3])+' '+T.s(s,c,v,'readonly', s[4])+' '+T.s(s,c,v,'multiple', s[5])+'> '+T.s(s,c,v,'options', s[11])+'</select> '}
},{"icebrace-runtime":"icebrace-runtime"}],10:[function(require,module,exports){
"use strict";
var T=require("icebrace-runtime"),v,s={0:'\' \'+T.e(c,v,\'.\')+\' \'',1:'\' name="\'+T.e(c,v,\'name\')+\'"\'',2:'\' placeholder="\'+T.e(c,v,\'placeholder\')+\'"\'',3:'\' cols="\'+T.e(c,v,\'cols\')+\'"\'',4:'\' rows="\'+T.e(c,v,\'rows\')+\'"\'',5:'\' disabled="disabled"\'',6:'\' readonly="readonly"\'',7:'\' maxlength="\'+T.e(c,v,\'maxlength\')+\'"\'',8:'\' minlength="\'+T.e(c,v,\'minlength\')+\'"\'',9:'\' autocomplete="\'+T.e(c,v,\'autocomplete\')+\'"\'',10:'\' required\'',11:'\'\'+T.e(c,v,\'text\')+\'\''};module.exports=function(c){var c={c:c,p:0};return'<textarea class="'+T.s(s,c,v,'class_name', s[0])+'" '+T.s(s,c,v,'name', s[1])+' '+T.s(s,c,v,'placeholder', s[2])+' '+T.s(s,c,v,'cols', s[3])+' '+T.s(s,c,v,'rows', s[4])+' '+T.s(s,c,v,'disabled', s[5])+' '+T.s(s,c,v,'readonly', s[6])+' '+T.s(s,c,v,'maxlength', s[7])+' '+T.s(s,c,v,'minlength', s[8])+' '+T.s(s,c,v,'autocomplete', s[9])+' '+T.s(s,c,v,'required', s[10])+' '+T.u(c,v,'hook')+' >'+T.s(s,c,v,'text', s[11])+'</textarea> '}
},{"icebrace-runtime":"icebrace-runtime"}],11:[function(require,module,exports){
"use strict";
var T=require("icebrace-runtime"),v,s={0:'\' \'+T.e(c,v,\'.\')+\' \''};module.exports=function(c){var c={c:c,p:0};return'<svg '+T.u(c,v,'hook')+' class=" o-icon '+T.s(s,c,v,'class_name', s[0])+' "><use xlink:href="./images/icons/icons.svg#'+T.e(c,v,'icon')+'"></use></svg> '}
},{"icebrace-runtime":"icebrace-runtime"}],12:[function(require,module,exports){
"use strict";
var T=require("icebrace-runtime"),v,s={0:'\' \'+T.e(c,v,\'.\')+\' \''};module.exports=function(c){var c={c:c,p:0};return'<img class="'+T.s(s,c,v,'class_name', s[0])+'" src="'+T.e(c,v,'src')+'"> '}
},{"icebrace-runtime":"icebrace-runtime"}],13:[function(require,module,exports){
"use strict";
var T=require("icebrace-runtime"),v,s={0:'\' o-info--\'+T.e(c,v,\'.\')+\' \'',1:'\' \'+T.e(c,v,\'.\')+\' \'',2:'\'\'+T.u(c,v,\'text\')+\'\'',3:'\'\'+T.c(\'atoms-link\', c.c)+\'\''};module.exports=function(c){var c={c:c,p:0};return'<p class=" o-info '+T.s(s,c,v,'mod', s[0])+' '+T.s(s,c,v,'class_name', s[1])+' " '+T.u(c,v,'hook')+'>'+T.s(s,c,v,'text', s[2])+' '+T.s(s,c,v,'link', s[3])+'</p> '}
},{"icebrace-runtime":"icebrace-runtime"}],14:[function(require,module,exports){
"use strict";
var T=require("icebrace-runtime"),v,s={0:'\' \'+T.u(c,v,\'hook\')+\'\'',1:'\' \'+T.e(c,v,\'.\')+\' \'',2:'\'\'+T.e(c,v,\'text\')+\'\'',3:'\' - \'+T.e(c,v,\'error\')+\'\''};module.exports=function(c){var c={c:c,p:0};return'<span'+T.s(s,c,v,'hook', s[0])+' class=" o-label '+T.s(s,c,v,'class_name', s[1])+' ">'+T.s(s,c,v,'text', s[2])+''+T.s(s,c,v,'error', s[3])+'</span> '}
},{"icebrace-runtime":"icebrace-runtime"}],15:[function(require,module,exports){
"use strict";
var T=require("icebrace-runtime"),v,s={0:'\' o-link--\'+T.e(c,v,\'.\')+\' \'',1:'\' \'+T.e(c,v,\'.\')+\' \'',2:'\'\'+T.e(c,v,\'text\')+\'\''};module.exports=function(c){var c={c:c,p:0};return'<a href="javascript:" class=" o-link '+T.s(s,c,v,'mod', s[0])+' '+T.s(s,c,v,'class_name', s[1])+' " '+T.u(c,v,'hook')+'>'+T.s(s,c,v,'text', s[2])+'</a> '}
},{"icebrace-runtime":"icebrace-runtime"}],16:[function(require,module,exports){
"use strict";
var T=require("icebrace-runtime"),v,s={0:'\' o-loader--\'+T.e(c,v,\'.\')+\' \'',1:'\' \'+T.e(c,v,\'.\')+\' \''};module.exports=function(c){var c={c:c,p:0};return'<div class=" o-loader '+T.s(s,c,v,'mod', s[0])+' '+T.s(s,c,v,'class_name', s[1])+' "></div> '}
},{"icebrace-runtime":"icebrace-runtime"}],17:[function(require,module,exports){
"use strict";
var T=require("icebrace-runtime"),v,s={0:'\' data-color="\'+T.e(c,v,\'color\')+\'" \'',1:'\' o-nametag--\'+T.e(c,v,\'.\')+\' \'',2:'\' \'+T.e(c,v,\'.\')+\' \'',3:'\'\'+T.e(c,v,\'name\')+\'\''};module.exports=function(c){var c={c:c,p:0};return'<div '+T.s(s,c,v,'color', s[0])+' class=" o-nametag '+T.s(s,c,v,'mod', s[1])+' '+T.s(s,c,v,'class_name', s[2])+' " '+T.u(c,v,'hook')+'><div class="o-nametag__stripe"></div><span class="o-nametag__name">'+T.s(s,c,v,'name', s[3])+'</span></div> '}
},{"icebrace-runtime":"icebrace-runtime"}],18:[function(require,module,exports){
"use strict";
var T=require("icebrace-runtime"),v,s={0:'\' o-section--\'+T.e(c,v,\'.\')+\' \'',1:'\' \'+T.e(c,v,\'.\')+\' \'',2:'\'\'+T.c(\'_name\', c.c)+\'\''};module.exports=function(c){var c={c:c,p:0};return'<section class=" o-section '+T.s(s,c,v,'mod', s[0])+' '+T.s(s,c,v,'class_name', s[1])+' " '+T.u(c,v,'hook')+'> '+T.s(s,c,v,'component', s[2])+'</section> '}
},{"icebrace-runtime":"icebrace-runtime"}],19:[function(require,module,exports){
"use strict";
var T=require("icebrace-runtime"),v,s={};module.exports=function(c){var c={c:c,p:0};return'<span class="o-form__element" '+T.u(c,v,'hook')+'>'+T.e(c,v,'value')+'</span>'}
},{"icebrace-runtime":"icebrace-runtime"}],20:[function(require,module,exports){
"use strict";
var T=require("icebrace-runtime"),v,s={0:'\' \'+T.e(c,v,\'.\')+\' \'',1:'\'\'+T.c(\'atoms-avatar\', c.c)+\'\'',2:'\'<p class="o-switch__name">\'+T.e(c,v,\'name\')+\'</p>\'',3:'\'<p class="o-switch__email">\'+T.e(c,v,\'email\')+\'</p>\'',4:'\'\'+T.c(\'atoms-icons\', c.c)+\'\'',5:'\'\'+T.c(\'atoms-link\', c.c)+\'\''};module.exports=function(c){var c={c:c,p:0};return'<div class=" o-switch '+T.s(s,c,v,'class_name', s[0])+' " '+T.u(c,v,'hook')+' tabindex="0"> '+T.s(s,c,v,'avatar', s[1])+' <div class="o-switch__text"> '+T.s(s,c,v,'name', s[2])+' '+T.s(s,c,v,'email', s[3])+' </div> '+T.s(s,c,v,'icon', s[4])+''+T.s(s,c,v,'link', s[5])+'</div> '}
},{"icebrace-runtime":"icebrace-runtime"}],21:[function(require,module,exports){
"use strict";
var T=require("icebrace-runtime"),v,s={0:'\' data-color="\'+T.e(c,v,\'color\')+\'" \'',1:'\' o-tag--\'+T.e(c,v,\'.\')+\' \'',2:'\' \'+T.e(c,v,\'.\')+\' \'',3:'\'\'+T.e(c,v,\'text\')+\'\''};module.exports=function(c){var c={c:c,p:0};return'<div '+T.s(s,c,v,'color', s[0])+' class=" o-tag '+T.s(s,c,v,'mod', s[1])+' '+T.s(s,c,v,'class_name', s[2])+' "> '+T.s(s,c,v,'text', s[3])+' <div class="o-tag__close" '+T.u(c,v,'hook')+'><svg class="o-tag__close-icon"><use xlink:href="./images/icons/icons.svg#xmark"></use></svg></div></div> '}
},{"icebrace-runtime":"icebrace-runtime"}],22:[function(require,module,exports){
"use strict";
var T=require("icebrace-runtime"),v,s={};module.exports=function(c){var c={c:c,p:0};return'<i class="o-form__tooltip" '+T.u(c,v,'hook')+'>?</i> '}
},{"icebrace-runtime":"icebrace-runtime"}],23:[function(require,module,exports){
"use strict";
var T=require("icebrace-runtime"),v,s={0:'\' \'+T.e(c,v,\'.\')+\' \'',1:'\'\'+T.c(\'atoms-icons\', c.c)+\'\'',2:'\' controls\'',3:'\' type="\'+T.e(c,v,\'type\')+\'"\'',4:'\'<source src="\'+T.e(c,v,\'src\')+\'"\'+T.s(s,c,v,\'type\', s[3])+\'>\''};module.exports=function(c){var c={c:c,p:0};return'<div '+T.u(c,v,'hook')+' class=" o-video '+T.s(s,c,v,'class_name', s[0])+' "> '+T.s(s,c,v,'icon', s[1])+' <video '+T.u(c,v,'video-hook')+' '+T.s(s,c,v,'controls', s[2])+'> '+T.s(s,c,v,'source', s[4])+' </video></div> '}
},{"icebrace-runtime":"icebrace-runtime"}],24:[function(require,module,exports){
"use strict";
var T=require("icebrace-runtime"),v,s={0:'\' o-well--\'+T.e(c,v,\'.\')+\' \'',1:'\' \'+T.e(c,v,\'.\')+\' \'',2:'\' \'+T.e(c,v,\'.\')+\' \'',3:'\'\'+T.c(\'atoms-icons\', c.c)+\'\'',4:'\'<p class="o-well__text u-bold">\'+T.e(c,v,\'title\')+\'</p>\'',5:'\'<p class="o-well__text">\'+T.u(c,v,\'.\')+\'</p>\''};module.exports=function(c){var c={c:c,p:0};return'<div data-hook="well" class=" o-well '+T.s(s,c,v,'mod', s[0])+' '+T.s(s,c,v,'class_name', s[1])+' '+T.s(s,c,v,'wrapper-class', s[2])+' "> '+T.s(s,c,v,'icon', s[3])+' <div class="o-well__content"> '+T.s(s,c,v,'title', s[4])+' '+T.s(s,c,v,'text', s[5])+' </div></div> '}
},{"icebrace-runtime":"icebrace-runtime"}],25:[function(require,module,exports){
"use strict";
var T=require("icebrace-runtime"),v,s={0:'\' <!--[if lte IE 8]><meta http-equiv="refresh" content="0;url=\'+T.e(c,v,\'url\')+\'"><![endif]--> \'',1:'\' <noscript><meta http-equiv="refresh" content="0;url=\'+T.e(c,v,\'url\')+\'"></noscript> \'',2:'\'<meta charset="\'+T.e(c,v,\'charset\')+\'">\'',3:'\'<meta http-equiv="X-UA-Compatible" content="\'+T.e(c,v,\'X-UA-Compatible\')+\'" />\'',4:'\'<meta name="viewport" content="\'+T.e(c,v,\'viewport\')+\'" />\'',5:'\'<meta name="google" value="notranslate" />\'',6:'\'\'+T.e(c,v,\'name\')+\'="\'+T.e(c,v,\'value\')+\'"\'',7:'\' <meta \'+T.s(s,c,v,\'attributes\', s[6])+\'> \'',8:'\'?version=\'+T.e(c,v,\'.\')+\'\'',9:'\' <link type="text/css" href="\'+T.e(c,v,\'.\')+\'\'+T.s(s,c,v,\'version\', s[8])+\'" rel="stylesheet"> \'',10:'\'?version=\'+T.e(c,v,\'.\')+\'\'',11:'\' <script src="\'+T.e(c,v,\'.\')+\'\'+T.s(s,c,v,\'version\', s[10])+\'"></script> \''};module.exports=function(c){var c={c:c,p:0};return'<head><title>'+T.e(c,v,'title')+'</title><meta id="theme-colors"> '+T.s(s,c,v,'backward-compatibility-redirect', s[0])+''+T.s(s,c,v,'noscript-redirect', s[1])+' '+T.s(s,c,v,'charset', s[2])+' '+T.s(s,c,v,'X-UA-Compatible', s[3])+' '+T.s(s,c,v,'viewport', s[4])+' '+T.s(s,c,v,'google-notranslate', s[5])+' <!-- Turn on IE cleartype --><meta http-equiv="cleartype" content="on"> '+T.s(s,c,v,'custom-meta', s[7])+' '+T.s(s,c,v,'css-files', s[9])+' '+T.s(s,c,v,'script-files', s[11])+'</head> '}
},{"icebrace-runtime":"icebrace-runtime"}],26:[function(require,module,exports){
"use strict";
var T=require("icebrace-runtime"),v,s={0:'\'\'+T.c(\'meta-head\', c.c)+\'\'',1:'\'\'+T.c(\'atoms-loader\', c.c)+\'\'',2:'\'.min\'',3:'\'.min\''};module.exports=function(c){var c={c:c,p:0};return'<!DOCTYPE html><html> '+T.s(s,c,v,'head', s[0])+' <body><div class="l-loading" id="content"> '+T.s(s,c,v,'loader', s[1])+' </div><script src="framework'+T.s(s,c,v,'min', s[2])+'.js?'+T.e(c,v,'fw_version')+'"></script><script src="bundle'+T.s(s,c,v,'min', s[3])+'.js?'+T.e(c,v,'version')+'"></script></body></html> '}
},{"icebrace-runtime":"icebrace-runtime"}],27:[function(require,module,exports){
"use strict";
var T=require("icebrace-runtime"),v,s={0:'\' o-button--\'+T.e(c,v,\'.\')+\' \'',1:'\' \'+T.e(c,v,\'.\')+\' \'',2:'\'\'+T.c(\'atoms-element-button\', c.c)+\'\''};module.exports=function(c){var c={c:c,p:0};return'<div class=" o-button o-form__object '+T.s(s,c,v,'mod', s[0])+' '+T.s(s,c,v,'class_name', s[1])+' "> '+T.s(s,c,v,'button', s[2])+'</div> '}
},{"icebrace-runtime":"icebrace-runtime"}],28:[function(require,module,exports){
"use strict";
var T=require("icebrace-runtime"),v,s={0:'\'\'+T.c(\'atoms-addon\', c.c)+\'\''};module.exports=function(c){var c={c:c,p:0};return'<div class="l-captcha"><div class="o-captcha" '+T.u(c,v,'hook')+'>'+T.c('atoms-loader', c.c)+'</div> '+T.s(s,c,v,'addon', s[0])+'</div> '}
},{"icebrace-runtime":"icebrace-runtime"}],29:[function(require,module,exports){
"use strict";
var T=require("icebrace-runtime"),v,s={0:'\' o-checkbox--\'+T.e(c,v,\'.\')+\' \'',1:'\' \'+T.e(c,v,\'.\')+\' \'',2:'\'\'+T.c(\'atoms-element-input\', c.c)+\'\'',3:'\'\'+T.e(c,v,\'label\')+\'\''};module.exports=function(c){var c={c:c,p:0};return'<div class=" o-checkbox o-checkbox--default '+T.s(s,c,v,'mod', s[0])+' '+T.s(s,c,v,'class_name', s[1])+' "> '+T.s(s,c,v,'input', s[2])+' <i class="o-checkbox__icon"></i><label class="o-checkbox__label">'+T.s(s,c,v,'label', s[3])+'</label></div> '}
},{"icebrace-runtime":"icebrace-runtime"}],30:[function(require,module,exports){
"use strict";
var T=require("icebrace-runtime"),v,s={0:'\' \'+T.e(c,v,\'.\')+\' \'',1:'\' o-form__object--\'+T.e(c,v,\'.\')+\' \'',2:'\'\'+T.c(\'atoms-element-input\', c.c)+\'\'',3:'\'\'+T.c(\'atoms-label\', c.c)+\'\'',4:'\'\'+T.c(\'atoms-addon\', c.c)+\'\'',5:'\'\'+T.c(\'atoms-tooltip\', c.c)+\'\''};module.exports=function(c){var c={c:c,p:0};return'<label class=" o-input o-form__object molecules-input '+T.s(s,c,v,'class_name', s[0])+' '+T.s(s,c,v,'mod', s[1])+' " '+T.u(c,v,'hook')+'> '+T.s(s,c,v,'input', s[2])+''+T.s(s,c,v,'label', s[3])+''+T.s(s,c,v,'addon', s[4])+''+T.s(s,c,v,'tooltip', s[5])+'</label> '}
},{"icebrace-runtime":"icebrace-runtime"}],31:[function(require,module,exports){
"use strict";
var T=require("icebrace-runtime"),v,s={0:'\' \'+T.e(c,v,\'.\')+\' \''};module.exports=function(c){var c={c:c,p:0};return'<li tabindex="0" class=" o-language-picker__item '+T.s(s,c,v,'class_name', s[0])+' " '+T.u(c,v,'# hook')+''+T.u(c,v,'hook')+''+T.u(c,v,'/ hook')+'>'+T.e(c,v,'text')+'</li> '}
},{"icebrace-runtime":"icebrace-runtime"}],32:[function(require,module,exports){
"use strict";
var T=require("icebrace-runtime"),v,s={0:'\' o-language-picker--\'+T.e(c,v,\'.\')+\' \'',1:'\' \'+T.e(c,v,\'.\')+\' \'',2:'\'\'+T.c(\'molecules-language-picker-item\', c.c)+\'\'',3:'\' <ul class="o-language-picker__column"> \'+T.s(s,c,v,\'item\', s[2])+\' </ul> \''};module.exports=function(c){var c={c:c,p:0};return'<div class=" o-language-picker '+T.s(s,c,v,'mod', s[0])+' '+T.s(s,c,v,'class_name', s[1])+' "> '+T.s(s,c,v,'column', s[3])+'</div> '}
},{"icebrace-runtime":"icebrace-runtime"}],33:[function(require,module,exports){
"use strict";
var T=require("icebrace-runtime"),v,s={0:'\' \'+T.e(c,v,\'.\')+\' \'',1:'\'\'+T.c(\'atoms-element-select\', c.c)+\'\'',2:'\'\'+T.c(\'atoms-label\', c.c)+\'\'',3:'\'\'+T.c(\'atoms-tooltip\', c.c)+\'\'',4:'\'\'+T.c(\'atoms-icons\', c.c)+\'\''};module.exports=function(c){var c={c:c,p:0};return'<label class=" o-select o-form__object '+T.s(s,c,v,'class_name', s[0])+' "> '+T.s(s,c,v,'select', s[1])+''+T.s(s,c,v,'label', s[2])+''+T.s(s,c,v,'tooltip', s[3])+''+T.s(s,c,v,'icon', s[4])+'</label> '}
},{"icebrace-runtime":"icebrace-runtime"}],34:[function(require,module,exports){
"use strict";
var T=require("icebrace-runtime"),v,s={0:'\' \'+T.e(c,v,\'.\')+\' \'',1:'\' o-form__object--\'+T.e(c,v,\'.\')+\' \'',2:'\'\'+T.c(\'atoms-static\', c.c)+\'\'',3:'\'\'+T.c(\'atoms-label\', c.c)+\'\'',4:'\'\'+T.c(\'atoms-addon\', c.c)+\'\'',5:'\'\'+T.c(\'atoms-tooltip\', c.c)+\'\''};module.exports=function(c){var c={c:c,p:0};return'<label class=" o-static o-form__object '+T.s(s,c,v,'class_name', s[0])+' '+T.s(s,c,v,'mod', s[1])+' " '+T.u(c,v,'hook')+'> '+T.s(s,c,v,'static', s[2])+''+T.s(s,c,v,'label', s[3])+''+T.s(s,c,v,'addon', s[4])+''+T.s(s,c,v,'tooltip', s[5])+'</label> '}
},{"icebrace-runtime":"icebrace-runtime"}],35:[function(require,module,exports){
"use strict";
var T=require("icebrace-runtime"),v,s={0:'\' \'+T.e(c,v,\'.\')+\' \'',1:'\' o-form__object--\'+T.e(c,v,\'.\')+\' \'',2:'\'\'+T.c(\'atoms-tag\', c.c)+\'\'',3:'\'\'+T.c(\'atoms-element-textarea\', c.c)+\'\'',4:'\'\'+T.c(\'atoms-label\', c.c)+\'\'',5:'\'\'+T.c(\'atoms-addon\', c.c)+\'\'',6:'\'\'+T.c(\'atoms-tooltip\', c.c)+\'\'',7:'\'\'+T.c(\'atoms-icons\', c.c)+\'\''};module.exports=function(c){var c={c:c,p:0};return'<label class=" o-textarea o-form__object '+T.s(s,c,v,'class_name', s[0])+' '+T.s(s,c,v,'mod', s[1])+' " '+T.u(c,v,'hook')+'> '+T.s(s,c,v,'tag', s[2])+''+T.s(s,c,v,'textarea', s[3])+''+T.s(s,c,v,'label', s[4])+''+T.s(s,c,v,'addon', s[5])+''+T.s(s,c,v,'tooltip', s[6])+''+T.s(s,c,v,'icon', s[7])+'</label> '}
},{"icebrace-runtime":"icebrace-runtime"}],36:[function(require,module,exports){
"use strict";
var T=require("icebrace-runtime"),v,s={0:'\'\'+T.c(\'_name\', c.c)+\'\''};module.exports=function(c){var c={c:c,p:0};return'<div style=" border-bottom: 1px solid black; height: 40px; width: 100%; /* position: absolute; */ top: 0; background: #fff; z-index: 1;"> '+T.s(s,c,v,'components', s[0])+'</div> '}
},{"icebrace-runtime":"icebrace-runtime"}],37:[function(require,module,exports){
"use strict";
var T=require("icebrace-runtime"),v,s={0:'\' \'+T.e(c,v,\'.\')+\' \'',1:'\' o-bar__section--\'+T.e(c,v,\'.\')+\' \'',2:'\'\'+T.c(\'atoms-icons\', c.c)+\'\'',3:'\'\'+T.s(s,c,v,\'logo\', s[2])+\' <p class="o-external__copy o-info" title="\'+T.e(c,v,\'version\')+\'">\'+T.e(c,v,\'copyright\')+\' &copy;&nbsp;<time datetime="\'+T.e(c,v,\'current_year\')+\'">\'+T.e(c,v,\'current_year\')+\'</time></p> \'',4:'\'\'+T.c(\'atoms-icons\', c.c)+\'\'',5:'\' <a class="o-external__social" href="\'+T.e(c,v,\'href\')+\'" rel="noopener" target="_blank"> \'+T.s(s,c,v,\'icon\', s[4])+\' </a> \'',6:'\' <p class="o-info" title="\'+T.e(c,v,\'version\')+\'">\'+T.u(c,v,\'text\')+\'</p> \'',7:'\'\'+T.s(s,c,v,\'copyright\', s[3])+\' \'+T.s(s,c,v,\'social\', s[5])+\' \'+T.s(s,c,v,\'find-out-more\', s[6])+\'\'',8:'\' <section class=" o-bar__section \'+T.s(s,c,v,\'mod\', s[1])+\' "> \'+T.s(s,c,v,\'footer\', s[7])+\' </section> \''};module.exports=function(c){var c={c:c,p:0};return'<div class=" o-bar '+T.s(s,c,v,'class_name', s[0])+' "> '+T.s(s,c,v,'section', s[8])+' </div> '}
},{"icebrace-runtime":"icebrace-runtime"}],38:[function(require,module,exports){
"use strict";
var T=require("icebrace-runtime"),v,s={0:'\' o-header--\'+T.e(c,v,\'.\')+\' \'',1:'\'\'+T.c(\'_name\', c.c)+\'\'',2:'\'\'+T.c(\'atoms-icons\', c.c)+\'\'',3:'\'\'+T.c(\'atoms-avatar\', c.c)+\'\'',4:'\'\'+T.c(\'atoms-image\', c.c)+\'\'',5:'\'\'+T.c(\'atoms-icons\', c.c)+\'\'',6:'\'\'+T.s(s,c,v,\'icon\', s[5])+\'\'',7:'\'\'+T.s(s,c,v,\'logo\', s[4])+\'\'+T.i(s,c,v,\'logo\', s[6])+\'\'',8:'\'\'+T.s(s,c,v,\'avatar\', s[3])+\'\'+T.i(s,c,v,\'avatar\', s[7])+\'\'',9:'\' \'+T.e(c,v,\'.\')+\' \'',10:'\' <h2 class=" o-header__title o-heading o-heading--beta \'+T.s(s,c,v,\'class_name\', s[9])+\' " \'+T.u(c,v,\'hook\')+\'>\'+T.e(c,v,\'.\')+\'</h2> \'',11:'\'\'+T.c(\'atoms-info\', c.c)+\'\'',12:'\'\'+T.c(\'atoms-well\', c.c)+\'\''};module.exports=function(c){var c={c:c,p:0};return'<div class=" o-header '+T.s(s,c,v,'mod', s[0])+' "> '+T.s(s,c,v,'language', s[1])+' <main class="o-header__main"><div class="o-header__content"> '+T.s(s,c,v,'card-icon', s[2])+''+T.i(s,c,v,'card-icon', s[8])+' '+T.s(s,c,v,'heading', s[10])+' '+T.s(s,c,v,'subtitle', s[11])+' </div> '+T.s(s,c,v,'well', s[12])+' </main></div> '}
},{"icebrace-runtime":"icebrace-runtime"}],39:[function(require,module,exports){
"use strict";
var T=require("icebrace-runtime"),v,s={0:'\' o-card__section--\'+T.e(c,v,\'.\')+\' \'',1:'\' \'+T.e(c,v,\'.\')+\' \'',2:'\'\'+T.c(\'_name\', c.c)+\'\''};module.exports=function(c){var c={c:c,p:0};return'<section class=" o-card__section '+T.s(s,c,v,'mod', s[0])+' '+T.s(s,c,v,'class_name', s[1])+' " '+T.u(c,v,'hook')+'> '+T.s(s,c,v,'component', s[2])+'</section> '}
},{"icebrace-runtime":"icebrace-runtime"}],40:[function(require,module,exports){
"use strict";
var T=require("icebrace-runtime"),v,s={0:'\' \'+T.e(c,v,\'.\')+\' \'',1:'\'\'+T.c(\'molecules-window-header\', c.c)+\'\'',2:'\'\'+T.c(\'_name\', c.c)+\'\''};module.exports=function(c){var c={c:c,p:0};return'<div class=" o-window '+T.s(s,c,v,'class_name', s[0])+' "> '+T.s(s,c,v,'header', s[1])+' <div class="o-window__main"> '+T.s(s,c,v,'components', s[2])+' </div></div> '}
},{"icebrace-runtime":"icebrace-runtime"}],41:[function(require,module,exports){
"use strict";
var T=require("icebrace-runtime"),v,s={0:'\' is-ie \'',1:'\' style="background-image: url(\\\'\'+T.e(c,v,\'background\')+\'\\\')"\'',2:'\'\'+T.c(\'atoms-ad\', c.c)+\'\'',3:'\'\'+T.c(\'templates-card\', c.c)+\'\'',4:'\'\'+T.c(\'organisms-bar\', c.c)+\'\''};module.exports=function(c){var c={c:c,p:0};return'<div class="o-external t-'+T.e(c,v,'theme')+' '+T.s(s,c,v,'ie', s[0])+'"'+T.s(s,c,v,'background', s[1])+'><main class="o-external__main"> '+T.s(s,c,v,'ad', s[2])+''+T.s(s,c,v,'card', s[3])+' </main> '+T.s(s,c,v,'bar', s[4])+'</div> '}
},{"icebrace-runtime":"icebrace-runtime"}],42:[function(require,module,exports){
"use strict";
var T=require("icebrace-runtime"),v,s={0:'\' o-card--\'+T.e(c,v,\'.\')+\' \'',1:'\' \'+T.e(c,v,\'.\')+\' \'',2:'\'\'+T.c(\'_name\', c.c)+\'\'',3:'\' <div class="o-card__prepend"> \'+T.s(s,c,v,\'component\', s[2])+\' </div> \'',4:'\'\'+T.c(\'organisms-card-section\', c.c)+\'\'',5:'\'\'+T.c(\'_name\', c.c)+\'\''};module.exports=function(c){var c={c:c,p:0};return'<form class=" o-card c-card '+T.s(s,c,v,'mod', s[0])+' '+T.s(s,c,v,'class_name', s[1])+' " '+T.u(c,v,'hook')+' method="POST"><div class="o-card__main"> '+T.s(s,c,v,'prepend', s[3])+' <div class="o-card__content" data-hook="content"> '+T.s(s,c,v,'content', s[4])+''+T.s(s,c,v,'component', s[5])+' </div></div></form> '}
},{"icebrace-runtime":"icebrace-runtime"}],43:[function(require,module,exports){
"use strict";
require('./middleware/middleware')(
	polyfills,
	require('./middleware/i18n'),
	require('./middleware/setLogLevel'),
	require('./middleware/initEnvironment'),
	require('./middleware/loadConfig'),
	require('./middleware/initDebugger'),
	setupApp,
	legacyURL,
	getServerProperties,
	getWebmailResources,
	changeLanguage,
	startApp
);

/**
 * @param {Object} data 
 * @param {Function} next 
 * @returns {undefined}
 */
function polyfills(data, next) {
	require('classlist-polyfill');
	require('svg4everybody')();
	require('match-media');
	require('es6-object-assign/auto');
	SVGElement.prototype.contains = SVGElement.prototype.contains || HTMLDivElement.prototype.contains;

	Element.prototype.matches = Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;

	Element.prototype.closest = Element.prototype.closest || function (s) {
		var el = this;

		do {
			if (el.matches(s)) {
				return el;
			}
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1);
		return null;
	};

	next();
}

/**
 * 
 * @param {Object} data 
 * @param {Function} next 
 * @returns {undefined}
 */
function legacyURL(data, next) {
	var BaseModel = require('BaseModel');
	BaseModel.static('LegacyURL').redirect() || next();
}

/**
 * 
 * @param {Object} data 
 * @param {Function} next 
 * @returns {undefined}
 */
function setupApp(data, next) {
	var disabled;
	var Hash = require('@icewarp/hash');
	var BaseModel = require('BaseModel');
	var BaseController = require('BaseController');
	var OldCommunication = require('@icewarp/old-communication');
	require('./communication-xml.js');

	new OldCommunication(OldCommunication.XHR, 'admin', {
		host: (BaseModel.instance('Config').getData('config').icewarpapiUrl || ('//' + location.host + '/icewarpapi')) + '/',
		xmlns: 'admin:iq:rpc'
	});

	/**
	 * Call communication command on model
	 * @param {String} command
	 * @param {Object} args
	 * @param {Object} callback
	 * @returns {unresolved} response
	 */
	BaseModel.prototype.callCommunication = function (command, args, callback) {
		return this.com[command].call(this, args, callback);
	};

	BaseController.prototype.disable = function () {
		if (!this.DOMElement) {
			return this;
		}
		this.DOMElement.classList.add('is-loading');
		(disabled = document.querySelector(':focus')) && disabled.blur();
		return this;
	};

	BaseController.prototype.enable = function () {
		if (!this.DOMElement) {
			return this;
		}
		this.DOMElement.classList.remove('is-loading');
		!document.querySelector(':focus') && disabled && disabled.focus();
		return this;
	};

	// set hashchange listener
	Hash.update(function (site, parts, previous_site, previous_parts) {
		var old_controller;
		var Template = require('icebrace-runtime');
		var name = Template.t(site) ? site : Template.t('sites-' + site) ? 'sites-' + site : false;
		var content = document.getElementById('content');
		if (name) {
			return new(BaseController.static(name))().execute().then(function (controller) {
				controller.render(content);
			});
		}
		old_controller = BaseController.prototype.getInstanceByElement(content);
		if (!((old_controller || {})['onHashChange'] || function () {}).call(old_controller, site, parts, previous_site, previous_parts)) {
			new(BaseController.static('sites-login'))().execute().then(function (controller) {
				controller.render(content);
			});
		}
	});

	next();
}

/**
 * 
 * @param {Object} data 
 * @param {Function} next 
 * @returns {undefined}
 */
function getServerProperties(data, next) {
	var BaseModel = require('BaseModel');
	var Server = BaseModel.instance('Server');
	Server.callCommunication('getServerProperties', {
		serverpropertylist: ['c_webmail_url', 'c_accounts_policies_login_loginsettings', 'c_niceversion']
	}, {
		success: next,
		error: error
	});
}

/**
 * 
 * @param {Object} data 
 * @param {Function} next 
 * @returns {undefined}
 */
function getWebmailResources(data, next) {
	var BaseModel = require('BaseModel');
	var WebClient = BaseModel.instance('WebClient');
	WebClient.callCommunication('getWebmailResources', {
		properties: ['layout_settings', 'restrictions', 'custom_login_fields', 'reset_settings', 'languages', 'signup_domains', 'password_policy', 'banner_options'],
		selector: document.location.hostname,
		level: 1
	}, {
		success: next,
		error: error
	});
}

/**
 * 
 * @param {Object} data 
 * @param {Function} next 
 * @returns {undefined}
 */
function changeLanguage(data, next) {
	var BaseModel = require('BaseModel');
	var WebClient = BaseModel.instance('WebClient');
	BaseModel.instance('Login').changeLanguage(WebClient.getData('layout_settings').getDefaultLanguageCode(), {
		success: next,
		error: next
	});
}

/**
 * 
 * @param {Object} data 
 * @param {Function} next 
 * @returns {undefined}
 */
function startApp() {
	var Hash = require('@icewarp/hash');
	var chosen_users;
	var BaseModel = require('BaseModel');
	var BaseController = require('BaseController');
	var WebClient = BaseModel.instance('WebClient');
	var Login = BaseModel.instance('Login');

	if (BaseModel.instance('Config').getData('config').application === 'webclient' && WebClient.getData('restrictions').getValue('sso_only')) {
		if (Hash.getParts().eid) {
			BaseController.new('sites-login', {
				site: 'unavailable',
				data: {
					title: __('error.' + Hash.getParts().eid),
					retry_link: './'
				}
			}).execute().then(function (controller) {
				var content = document.getElementById('content');
				controller.render(content);
			});
		} else {
			location.href = './sso';
		}
		return;
	}

	if (Hash.getParts().auth_id) {
		document.title = __('title.oauth');
	} else {
		document.title = WebClient.getData('layout_settings').getValue('title');
	}

	chosen_users = Hash.getParts().username ? [Hash.getParts().username] : Login.getUsers();
	chosen_users[0] && Login.setData('chosen_account', chosen_users[0]);

	Hash.update();
}

/**
 * @returns {undefined}
 */
function error() {
	var BaseModel = require('BaseModel');
	var WebClient = BaseModel.instance('WebClient');
	BaseModel.instance('Login').changeLanguage(WebClient.getData('layout_settings').getDefaultLanguageCode(), {
		success: function () {
			var BaseController = require('BaseController');
			BaseController.new('sites-login').execute({
				site: 'unavailable'
			}).then(function (controller) {
				var content = document.getElementById('content');
				controller.render(content);
			});
		}
	});
}

},{"./communication-xml.js":44,"./middleware/i18n":129,"./middleware/initDebugger":130,"./middleware/initEnvironment":131,"./middleware/loadConfig":132,"./middleware/middleware":133,"./middleware/setLogLevel":134,"@icewarp/hash":156,"@icewarp/old-communication":164,"BaseController":"BaseController","BaseModel":"BaseModel","classlist-polyfill":176,"es6-object-assign/auto":178,"icebrace-runtime":"icebrace-runtime","match-media":193,"svg4everybody":195}],44:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');
var Login = BaseModel.static('Login');
Login.prototype.com= new (require('./communication/xml/Login/LoginPrototype.js'))();
var Server = BaseModel.static('Server');
Server.prototype.com= new (require('./communication/xml/Server/ServerPrototype.js'))();
var OAuth = BaseModel.static('OAuth');
OAuth.prototype.com= new (require('./communication/xml/OAuth/OAuthPrototype.js'))();
var WebClient = BaseModel.static('WebClient');
WebClient.prototype.com= new (require('./communication/xml/WebClient/WebClientPrototype.js'))();

},{"./communication/xml/Login/LoginPrototype.js":45,"./communication/xml/OAuth/OAuthPrototype.js":46,"./communication/xml/Server/ServerPrototype.js":47,"./communication/xml/WebClient/WebClientPrototype.js":48,"BaseModel":"BaseModel"}],45:[function(require,module,exports){
"use strict";
var OldCommunication = require('@icewarp/old-communication');
var rsa = require('@icewarp/rsa');
var Callback = require('Callback');
var xhr_connection = require('@icewarp/xhr-connection');

/**
 * @param {String} password 
 * @returns {String}
 */
function authPlain(password) {
	return password;
}

/**
 * @param {String} hash 
 * @param {String} timestamp 
 * @returns {String}
 */
function authRSA(hash, timestamp) {
	return hash ? function (password) {
		var RSA = new rsa();
		RSA.setPublic(hash, '10001');
		return RSA.encrypt('p=' + encodeURIComponent(password).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+') + '&t=' + timestamp);
	} : authPlain;
}

/**
 * Communication for Login model
 * @class LoginPrototype
 */
function LoginPrototype() {}

LoginPrototype.prototype.getVerification = function (params, callback) {
	var data = {
		commandname: 'sendsignupverification',
		commandparams: params
	};
	OldCommunication.getConnection('admin').send(data, {
		success: function (auth) {
			return Callback(Callback.SUCCESS, callback, auth);
		},
		error: callback.error,
		context: callback.context
	});
};

LoginPrototype.prototype.getAuthChallenge = function (callback) {
	var data;
	if (!this.getData('useRSA')) {
		return Callback(Callback.SUCCESS, callback, authPlain);
	}
	data = {
		commandname: 'getauthchallenge',
		commandparams: {
			authtype: +this.getData('useRSA')
		}
	};
	OldCommunication.getConnection('admin').send(data, {
		success: function (auth) {
			var rsa;
			try {
				rsa = authRSA(auth.hashid, auth.timestamp);
				return Callback(Callback.SUCCESS, callback, rsa);
			} catch(error) {
				return Callback(Callback.ERROR, callback, error);
			}
		},
		error: callback.error,
		context: callback.context
	});
};

LoginPrototype.prototype.logoutTeamChatOnly = function (data, callback) {
	var XHRConnection = new xhr_connection({
		host: data.notifyuri + '?token=' + data.token + '&action=logout',
		listeners: {
			onmessage: {
				func: callback.success,
				context: callback.context
			},
			onerror: {
				func: callback.error,
				context: callback.context
			}
		}
	});
	XHRConnection.send('', Date.now());
};

LoginPrototype.prototype.teamchatError = function (data) {
	var XHRConnection = new xhr_connection({
		host: data.notifyuri + '?eid=' + data.eid
	});
	XHRConnection.send('', Date.now());
};

module.exports = LoginPrototype;

},{"@icewarp/old-communication":164,"@icewarp/rsa":167,"@icewarp/xhr-connection":174,"Callback":"Callback"}],46:[function(require,module,exports){
"use strict";
var Callback = require('Callback');
var OldCommunication = require('@icewarp/old-communication');

/**
 *
 * @description Resolves Admin API props to reasonable format
 * @param {Object} value
 * @returns {*}
 */
function resolveAPIItemValue(value) {
	switch (value.classname) {
		case 'TAccountName':
			return [value.name, value.surname].filter(Boolean);
		case 'TPropertyString':
			return value.val;
		case 'TPropertyNoValue':
			return null;
		case 'TAccountImage':
			return {
				data: value.base64data,
				mime: value.contenttype,
				url: 'data:' + value.contenttype + ';base64,' + encodeURIComponent(value.base64data)
			};
		default:
			return false;
	}
}

/**
 * Communication for OAuth model
 * @class OAuthPrototype
 */
function OAuthPrototype() {}

OAuthPrototype.prototype.login = function(args, callback) {
	var data = {
		commandname: 'authenticate',
		commandparams: {
			authtype: +args.authtype,
			email: args.user
		}
	};
	data.commandparams[args.authtype ? 'digest' : 'password'] = args.password;

	OldCommunication.getConnection('admin').send(data, {
		success: function(result, attributes) {
			Callback('success', callback, attributes._attributes.sid);
		},
		error: function(error) {
			Callback('error', callback, error);
		},
		context: this
	});
};

OAuthPrototype.prototype.GetOauthClientInfo = function (params, callback) {
	var data = {
		commandname: 'getoauthclientinfo',
		commandparams: {
			clientid: params.clientid
		}
	};
	OldCommunication.getConnection('admin-auth').send(data, callback);
};

OAuthPrototype.prototype.GetSessionInfo = function (params, callback) {
	var data = {
		commandname: 'getsessioninfo'
	};
	return OldCommunication.getConnection('admin-auth').send(data, callback);
};

OAuthPrototype.prototype.GetOauthAuthorizationRequest = function (params, callback) {
	var data = {
		commandname: 'getoauthauthorizationrequest',
		commandparams: {
			requestid: params.requestid
		}
	};
	OldCommunication.getConnection('admin-auth').send(data, callback);
};

OAuthPrototype.prototype.GrantOauthAuthorization = function (params, callback) {
	var data = {
		commandname: 'grantoauthauthorization',
		commandparams: {
			requestid: params.requestid,
			description: params.description
		}
	};
	OldCommunication.getConnection('admin-auth').send(data, callback);
};

OAuthPrototype.prototype.getAccountDetail = function(args, callback) {
	var data = {
		commandname: 'GetAccountProperties',
		commandparams: {
			accountemail: args.email,
			accountpropertyset: 1
		}
	};
	OldCommunication.getConnection('admin-auth').send(data, {
		success: function(data) {
			var admin = {
				A_Name: [args.email]
			};
			data.item.forEach(function(item) {
				var value = resolveAPIItemValue(item.propertyval);
				if (!value) {
					return;
				}
				admin[item.apiproperty.propname] = value;
			});
			callback.success.call(callback.context, admin);
		},
		error: function(error) {
			Callback('error', callback, error);
		},
		context: this
	});
};

module.exports = OAuthPrototype;

},{"@icewarp/old-communication":164,"Callback":"Callback"}],47:[function(require,module,exports){
"use strict";
var Callback = require('Callback');
var OldCommunication = require('@icewarp/old-communication');

/**
 * Communication for Server model
 * @class ServerPrototype
 */
function ServerPrototype() {}

ServerPrototype.prototype.getServerProperties = function (args, callback) {
	var data = {
		commandname: 'getserverproperties',
		commandparams: {
			serverpropertylist: args.serverpropertylist.map(function (property) {
				return {
					item: {
						propname: property
					}
				};
			})
		}
	};
	OldCommunication.getConnection('admin').send(data, {
		success: function (response_json) {
			var items = Array.isArray(response_json.item) ? response_json.item : [response_json.item];
			items.forEach(function (item) {
				this.setData(item.apiproperty.propname, item.propertyval.val);
			}, this);
			Callback('success', callback, arguments);
		},
		error: function () {
			Callback('error', callback, arguments);
		},
		context: this
	});
};

module.exports = ServerPrototype;

},{"@icewarp/old-communication":164,"Callback":"Callback"}],48:[function(require,module,exports){
"use strict";
var OldCommunication = require('@icewarp/old-communication');
var BaseModel = require('BaseModel');
var Callback = require('Callback');

/**
 * Communication for WebClient model
 * @class WebClientPrototype
 */
function WebClientPrototype() {}

// sign-in-password
WebClientPrototype.prototype.authenticate = function (args, callback) {
	var authtype = +BaseModel.instance('Login').getData('useRSA');
	var data = {
		commandname: 'authenticate',
		commandparams: {
			email: args.email,
			authtype: authtype,
			persistentlogin: args.persistentlogin
		}
	};

	data.commandparams[authtype ? 'digest' : 'password'] = args.password;

	OldCommunication.getConnection('admin').send(data, callback);
};

WebClientPrototype.prototype.sendGatewayAuthentication = function (args, callback) {
	var data = {
		commandname: 'sendgatewayauthentication',
		commandparams: {
			email: args.email,
			captcharequest: {
				uid: args.captcharequest.uid,
				value: args.captcharequest.value
			}
		}
	};
	OldCommunication.getConnection('admin').send(data, callback);
};

WebClientPrototype.prototype.getAuthToken = function (args, callback) {
	var authtype = +BaseModel.instance('Login').getData('useRSA');
	var data = {
		commandname: 'getauthtoken',
		commandparams: {
			email: args.email,
			authtype: authtype,
			persistentlogin: args.persistentlogin
		}
	};

	data.commandparams[authtype ? 'digest' : 'password'] = args.password;
	args.totpcode && (data.commandparams.totpcode = args.totpcode);

	OldCommunication.getConnection('admin').send(data, callback);
};

WebClientPrototype.prototype.confirmPersonality = function (args, callback) {
	var data = {
		commandname: 'confirmpersonality',
		commandparams: {
			email: args.email,
			user: args.user,
			hash: args.hash
		}
	};
	OldCommunication.getConnection('admin').send(data, callback);
};

// create-account -> set-password
WebClientPrototype.prototype.signupAccount = function (args, callback) {
	OldCommunication.getConnection('admin').send({
		commandname: 'signupaccount',
		commandparams: args
	}, callback);
};

// forgot-password
WebClientPrototype.prototype.resetPasswordEmail = function (args, callback) {
	var data = {
		commandname: 'resetpasswordemail',
		commandparams: {
			email: args.email,
			langid: BaseModel.instance('WebClient').getData('layout_settings').getUserLanguageCode(),
			captcharequest: {
				uid: args.captcharequest.uid,
				value: args.captcharequest.value
			}
		}
	};
	OldCommunication.getConnection('admin').send(data, callback);
};

// reset-password
WebClientPrototype.prototype.resetPassword = function (args, callback) {
	var Hash = require('@icewarp/hash');
	var data = {
		commandname: 'resetpassword',
		commandparams: {
			email: Hash.getParts().user,
			newpassword: args.newpassword,
			resethash: Hash.getParts().hash,
			authtype: +BaseModel.instance('Login').getData('useRSA')
		}
	};
	OldCommunication.getConnection('admin').send(data, callback);
};

// change-password
WebClientPrototype.prototype.changePassword = function (args, callback) {
	var data = {
		commandname: 'changepassword',
		commandparams: {
			email: args.email,
			oldpassword: args.oldpassword,
			newpassword: args.newpassword,
			authtype: +BaseModel.instance('Login').getData('useRSA')
		}
	};
	OldCommunication.getConnection('admin').send(data, callback);
};

WebClientPrototype.prototype.getCaptcha = function (callback) {
	OldCommunication.getConnection('admin').send({
		commandname: 'getcaptcha'
	}, callback);
};

// contact-admin
WebClientPrototype.prototype.contactAdministrator = function (args, callback) {
	var data = {
		commandname: 'contactadministrator',
		commandparams: {
			email: args.email,
			data: args.data,
			host: location.hostname,
			captcharequest: {
				uid: args.captcha.uid,
				value: args.captcha.value
			}
		}
	};
	OldCommunication.getConnection('admin').send(data, callback);
};

//tc-join
WebClientPrototype.prototype.guestConfirm = function (args, callback) {
	var data = {
		commandname: 'guestconfirm',
		commandparams: {
			email: args.email,
			password: args.password,
			fullname: args.fullname,
			sender: args.sender,
			hash: args.hash,
			authtype: +BaseModel.instance('Login').getData('useRSA')
		}
	};
	OldCommunication.getConnection('admin').send(data, callback);
};

WebClientPrototype.prototype.guestVerify = function (args, callback) {
	var data = {
		commandname: 'guestverify',
		commandparams: {
			email: args.email,
			hash: args.hash
		}
	};
	OldCommunication.getConnection('admin').send(data, callback);
};

// app start
WebClientPrototype.prototype.getWebmailResources = function (args, callback) {
	var data = {
		commandname: 'getwebmailresources',
		commandparams: {
			resources: args.properties.map(function (prop) {
				return {
					item: {
						name: prop
					}
				};
			}),
			selector: args.selector,
			level: args.level
		}
	};
	OldCommunication.getConnection('admin').send(data, {
		success: function (response_json) {
			BaseModel.instance('WebClient').initialize(response_json);
			Callback('success', callback, response_json);
		},
		error: function () {
			Callback('error', callback, arguments);
		},
		context: this
	});
};

module.exports = WebClientPrototype;

},{"@icewarp/hash":156,"@icewarp/old-communication":164,"BaseModel":"BaseModel","Callback":"Callback"}],49:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var AtomsAdAdsense = BaseController.create('AtomsAdAdsense');

AtomsAdAdsense.prototype.afterRender = function () {
	var script;
	(window.adsbygoogle = window.adsbygoogle || []).push({});
	if (!document.getElementById('adsbygoogle')) {
		script = document.createElement('script');
		script.setAttribute('id', 'adsbygoogle');
		script.setAttribute('async', true);
		script.setAttribute('src', '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js');
		document.head.appendChild(script);
	}
};

module.exports = AtomsAdAdsense;

},{"BaseController":"BaseController"}],50:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');
var BaseController = require('BaseController');
var AtomsAd = BaseController.create('AtomsAd');

AtomsAd.prototype.afterRender = function () {
	if (!this.view_data.hook) {
		this.remove();
	}
};

AtomsAd.prototype.helper = function () {
	var Restrictions = BaseModel.instance('WebClient').getData('restrictions');
	var BannerOptions = BaseModel.instance('WebClient').getData('banner_options');

	if (!this.data || !this.data.position || Restrictions.getValue('enable_adsense') !== 1) {
		return {};
	}

	switch (BannerOptions.getValue(this.data.position + '_type')) {
		case 'url':
			if (!BannerOptions.getValue(this.data.position + '_url')) {
				return {};
			}
			return {
				hook: this.data.hook,
				image: {
					src: BannerOptions.getValue(this.data.position + '_url'),
					class_name: ['o-ad__img']
				}
			};
		case 'code':
			if (!BannerOptions.getValue('customer_id') || !BannerOptions.getValue(this.data.position + '_code')) {
				return {};
			}
			return {
				hook: this.data.hook,
				component: BaseController.new('atoms-ad-adsense', {
					slot_id: BannerOptions.getValue(this.data.position + '_code'),
					client_id: BannerOptions.getValue('customer_id').trim(),
					identifier: this.data.identifier,
					style: this.data.style,
					format: this.data.format || 'auto'
				})
			};
	}
	return {};
};

module.exports = AtomsAd;

},{"BaseController":"BaseController","BaseModel":"BaseModel"}],51:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var AtomsAddon = BaseController.create('AtomsAddon');

AtomsAddon.prototype.helper = function () {
	return {
		'class_name': this.data.class_name,
		'mod': this.data.mod,
		'text': this.data.text,
		'hook': this.data.hook
	};
};

module.exports = AtomsAddon;

},{"BaseController":"BaseController"}],52:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var AtomsAddon = require('./addon');
var AtomsAddon_Show = BaseController.create('AtomsAddon_Show', AtomsAddon);

AtomsAddon_Show.prototype.helper = function () {
	this.data.text = __('generic.show');
	this.data.mod = ['bottom'];
	this.data.hook = this.createHook('show-password');
	return AtomsAddon.prototype.helper.call(this);
};

module.exports = AtomsAddon_Show;

},{"./addon":51,"BaseController":"BaseController"}],53:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');
var BaseController = require('BaseController');
var AtomsAvatar = BaseController.create('AtomsAvatar');

AtomsAvatar.prototype.helper = function () {
	return this.data['email'] ? {
		'image': this.data['avatar_token'] ? BaseModel.instance('Server').getAvatar({email: this.data['email'], avatarhash: this.data['avatar_token']}) : false,
		'letter': !this.data['avatar_token'] ? (this.data['name'] || this.data['email'] || '').substr(0, 1) : false,
		'class_name': this.data.class_name,
		'mod': this.data['mod'],
		'data': [
			{
				tag: 'color',
				value: this.data['color']
			}
		]
	} : {};
};

module.exports = AtomsAvatar;

},{"BaseController":"BaseController","BaseModel":"BaseModel"}],54:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var AtomsChatMessage = BaseController.create('AtomsChatMessage');
var linkifyString = require('linkifyjs/string');

AtomsChatMessage.prototype.helper = function () {
	var model = this.data.model;
	return {
		model: model,
		self: model.getData('is_outgoing'),
		'to': model.getData('is_private') ? {
			'to-hook': this.createHook(model.getData('recipient') === model.getData('chat').getData('user') ? 'deselectRecipient' : 'selectRecipient'),
			name: model.getData('recipient').getData('name')
		} : false,
		'text': linkifyString(model.getData('content'))
	};
};

module.exports = AtomsChatMessage;

},{"BaseController":"BaseController","linkifyjs/string":192}],55:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var AtomsDropdown = BaseController.create('AtomsDropdown');

AtomsDropdown.prototype.helper = function () {
	return {
		'icon': BaseController.new('atoms-icons', {
			'icon': 'planet',
			'class_name': ['o-dropdown__icon']
		}),
		'hook': this.data.hook,
		'code': this.data.code
	};
};

module.exports = AtomsDropdown;

},{"BaseController":"BaseController"}],56:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var AtomsElementButton = BaseController.create('AtomsElementButton');

AtomsElementButton.prototype.helper = function () {
	return {
		'class_name': this.data.class_name,
		'name': this.data.name || 'button',
		'text': this.data.text,
		'hook': this.data.hook,
		'disabled': this.data.disabled ? 'disabled' : false,
		'icon': this.data.icon
	};
};

module.exports = AtomsElementButton;

},{"BaseController":"BaseController"}],57:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var AtomsElementInput = BaseController.create('AtomsElementInput');

AtomsElementInput.prototype.helper = function () {
	return {
		'class_name': this.data.class_name,
		'type': this.data.type || 'text',
		'accept': this.data.accept,
		'name': this.data.name || 'input',
		'value': this.data.value,
		'placeholder': this.data.placeholder,
		'autocomplete': this.data.autocomplete,
		'max': this.data.max,
		'min': this.data.min,
		'size': this.data.size,
		'maxlength': this.data.maxlength,
		'minlength': this.data.minlength,
		'multiple': this.data.multiple,
		'readonly': this.data.readonly,
		'checked': this.data.checked,
		'disabled': this.data.disabled,
		'required': this.data.required,
		'hook': this.data.hook,
		'maxDate': this.data.maxDate
	};
};

module.exports = AtomsElementInput;

},{"BaseController":"BaseController"}],58:[function(require,module,exports){
"use strict";
var Library = require('Library');
var BaseController = require('BaseController');
var AtomsElementInput = require('./element-input.js');
var AtomsElementInput_Date = BaseController.create('AtomsElementInput_Date_Date', AtomsElementInput);

AtomsElementInput_Date.prototype.afterRender = function () {
	if (this.DOMElement.type === 'date') {
		return;
	}
	Library.get('pikaday', {
		success: function (Pikaday) {
			new Pikaday({
				field: this.DOMElement,
				maxDate: this.data.maxDate,
				onSelect: function (date) {
					this.date = date;
				}.bind(this),
				yearRange: [1900, new Date().getFullYear()],
				i18n: {
					previousMonth: __('calendar.previous_month'),
					nextMonth: __('calendar.next_month'),
					months: ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'].map(function (month) {
						return __('calendar.month.' + month);
					}),
					weekdays: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map(function (day) {
						return __('calendar.day.' + day);
					}),
					weekdaysShort: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map(function (day) {
						return __('calendar.day_short.' + day);
					})
				}
			});
		},
		error: function () {},
		context: this
	}, false, window);
};

module.exports = AtomsElementInput_Date;

},{"./element-input.js":57,"BaseController":"BaseController","Library":"Library"}],59:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var AtomsElementSelect = BaseController.create('AtomsElementSelect');

AtomsElementSelect.prototype.helper = function () {
	return {
		'class_name': this.data.class_name,
		'label': this.data.label,
		'name': this.data.name || 'select',
		'hook': this.data.hook,
		'readonly': this.data.readonly,
		'size': this.data.size,
		'options': (this.data.options || []).map(function(option) {
			option.text = option.text === void 0 || option.text === false ? option.value : option.text;
			return option;
		})
	};
};

module.exports = AtomsElementSelect;

},{"BaseController":"BaseController"}],60:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var AtomsElementTextarea = BaseController.create('AtomsElementTextarea');

AtomsElementTextarea.prototype.helper = function () {
	return {
		'rows': this.data.rows || 3,
		'class_name': this.data.class_name,
		'placeholder': this.data.placeholder,
		'name': this.data.name,
		'autocomplete': this.data.autocomplete || 'off',
		'required': this.data.required,
		'text': this.data.text,
		'hook': this.data.hook
	};
};

module.exports = AtomsElementTextarea;

},{"BaseController":"BaseController"}],61:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var AtomsInfo_DontHaveAccount = BaseController.create('AtomsInfo_DontHaveAccount');

AtomsInfo_DontHaveAccount.prototype.helper = function () {
	return {
		'text': __('generic.dont-have-account'),
		'class_name': ['u-align-center'],
		'link': BaseController.new('atoms-link~create-acc')
	};
};

module.exports = AtomsInfo_DontHaveAccount;

},{"BaseController":"BaseController"}],62:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var AtomsInfo_HaveAccount = BaseController.create('AtomsInfo_HaveAccount');

AtomsInfo_HaveAccount.prototype.helper = function () {
	return {
		'text': __('generic.have-account'),
		'class_name': ['u-align-center'],
		'link': BaseController.new('atoms-link~sign-in')
	};
};

module.exports = AtomsInfo_HaveAccount;

},{"BaseController":"BaseController"}],63:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');
var BaseController = require('BaseController');
var AtomsInfo_NotYou = BaseController.create('AtomsInfo_NotYou');
var Login = BaseModel.instance('Login');

AtomsInfo_NotYou.prototype.helper = function () {
	return {
		'text': __('generic.not-you'),
		'class_name': ['u-align-center'],
		'link': BaseController.new('atoms-link~' + (Login.getUsers().length ? 'choose-account' : 'check-account'))
	};
};

module.exports = AtomsInfo_NotYou;

},{"BaseController":"BaseController","BaseModel":"BaseModel"}],64:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var AtomsLabel = BaseController.create('AtomsLabel');

AtomsLabel.prototype.addListeners = function () {
	this.addGlobalListener('validation-error', this.handleValidation);
	this.addGlobalListener('validation-success', this.handleValidation);
};

AtomsLabel.prototype.handleValidation = function (data) {
	if (this.getParent(data.controller._name) === data.controller) {
		this.data.error = data.message;
		this.rerender();
	}
};

AtomsLabel.prototype.helper = function () {
	return {
		'hook': this.data.hook,
		'text': this.data.text,
		'class_name': this.data.class_name,
		'error': this.data.error
	};
};

module.exports = AtomsLabel;

},{"BaseController":"BaseController"}],65:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var AtomsLink_Back = BaseController.create('AtomsLink_Back');

AtomsLink_Back.prototype.helper = function () {
	return {
		'text': __('generic.back'),
		'class_name': ['u-float-left'],
		'hook': this.createHook('back')
	};
};

module.exports = AtomsLink_Back;

},{"BaseController":"BaseController"}],66:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var AtomsLink_CheckAccount = BaseController.create('AtomsLink_CheckAccount');

AtomsLink_CheckAccount.prototype.helper = function () {
	return {
		'text': __('generic.check-account'),
		'hook': this.createHook('back-to-email'),
		'mod': ['switch']
	};
};

module.exports = AtomsLink_CheckAccount;

},{"BaseController":"BaseController"}],67:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var AtomsLink_CheckAccount = BaseController.create('AtomsLink_CheckAccount');

AtomsLink_CheckAccount.prototype.helper = function () {
	return {
		'text': __('generic.choose-different-account'),
		'hook': this.createHook('choose-account'),
		'mod': ['switch']
	};
};

module.exports = AtomsLink_CheckAccount;

},{"BaseController":"BaseController"}],68:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');
var BaseController = require('BaseController');
var AtomsLink_ContactAdmin = BaseController.create('AtomsLink_ContactAdmin');

AtomsLink_ContactAdmin.prototype.helper = function () {
	return BaseModel.instance('WebClient').getData('restrictions').getValue('contact_support') ? {
		'text': __('generic.contact-admin'),
		'class_name': this.data.class_name || ['u-float-right'],
		'hook': this.createHook('contact-admin'),
		'mod': ['switch']
	} : {};
};

module.exports = AtomsLink_ContactAdmin;

},{"BaseController":"BaseController","BaseModel":"BaseModel"}],69:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var AtomsLink_CreateAcc = BaseController.create('AtomsLink_CreateAcc');

AtomsLink_CreateAcc.prototype.helper = function () {
	return {
		'text': __('generic.create-acc'),
		'hook': this.createHook('create-acc'),
		'mod': ['switch']
	};
};

module.exports = AtomsLink_CreateAcc;

},{"BaseController":"BaseController"}],70:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var AtomsLink_RemoveFromList = BaseController.create('AtomsLink_RemoveFromList');

AtomsLink_RemoveFromList.prototype.helper = function () {
	return {
		'text': __('choose-account.remove'),
		'class_name': ['u-float-left'],
		'hook': this.createHook('remove-from-list')
	};
};

module.exports = AtomsLink_RemoveFromList;

},{"BaseController":"BaseController"}],71:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var AtomsLink_Retry = BaseController.create('AtomsLink_Retry');

AtomsLink_Retry.prototype.addListeners = function () {
	this.addDOMListener('', 'click', this.retry);
};

AtomsLink_Retry.prototype.retry = function (event) {
	event.preventDefault();
	if(this.data.link) {
		document.location = this.data.link;
	} else {
		document.location.reload();
	}
};

AtomsLink_Retry.prototype.helper = function () {
	return {
		link: this.data.link,
		'text': __('generic.retry'),
		'class_name': ['u-float-center']
	};
};

module.exports = AtomsLink_Retry;

},{"BaseController":"BaseController"}],72:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var AtomsLink_SignIn = BaseController.create('AtomsLink_SignIn');

AtomsLink_SignIn.prototype.helper = function () {
	return {
		'text': __('generic.sign-in'),
		'hook': this.createHook('sign-in'),
		'mod': ['switch']
	};
};

module.exports = AtomsLink_SignIn;

},{"BaseController":"BaseController"}],73:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var AtomsLink_SignWithAnotherAcc = BaseController.create('AtomsLink_SignWithAnotherAcc');

AtomsLink_SignWithAnotherAcc.prototype.helper = function () {
	return {
		'text': __('generic.sign-with-another-acc'),
		'class_name': ['u-align-center'],
		'hook': this.createHook('sign-with-another-acc'),
		'mod': ['switch']
	};
};

module.exports = AtomsLink_SignWithAnotherAcc;

},{"BaseController":"BaseController"}],74:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var AtomsLink_WhatIsTeamchat = BaseController.create('AtomsLink_WhatIsTeamchat');

AtomsLink_WhatIsTeamchat.prototype.helper = function () {
	return {
		'text': __('tc-join.what-is-teamchat'),
		'hook': this.createHook('what-is-teamchat'),
		'mod': ['switch']
	};
};

module.exports = AtomsLink_WhatIsTeamchat;

},{"BaseController":"BaseController"}],75:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var AtomsNametag = BaseController.create('AtomsNametag');

AtomsNametag.prototype.helper = function () {
	return {
		model: this.data.model,
		'id': this.data.model.getId(),
		'name': this.data.model.getData('name'),
		'color': this.data.model.getData('color'),
		'class_name': [],
		'hook': this.createHook('selectRecipient')
	};
};

module.exports = AtomsNametag;

},{"BaseController":"BaseController"}],76:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var AtomsSwitch = BaseController.create('AtomsSwitch');

AtomsSwitch.prototype.helper = function () {
	return {
		'avatar': BaseController.new('atoms-avatar', Object.assign({}, this.data, {
			class_name: ['o-switch__avatar']
		})),
		'name': this.data['name'] || this.data['email'],
		'email': this.data['email'],
		'class_name': this.data.class_name,
		'hook': this.createHook('switch'),
		'icon': [
			BaseController.new('atoms-icons', {
				'icon': 'arrow', 
				'class_name': ['o-switch__ui', 'o-switch__arrow']
			}),
			BaseController.new('atoms-icons', {
				'icon': 'xmark',
				'class_name': ['o-switch__ui', 'o-switch__xmark']
			})
		],
		'link': {
			'text': 'Undo',
			'class_name': ['o-switch__ui', 'o-switch__addon'],
			'hook': this.createHook('remove-from-list-undo')
		}
	};
};

module.exports = AtomsSwitch;

},{"BaseController":"BaseController"}],77:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var AtomsWell = require('BaseController').create('AtomsWell');

AtomsWell.prototype.helper = function () {
	switch (this.data.type) {
		case 'success':
			this.data.mod = ['success'];
			this.data.icon = BaseController.new('atoms-icons', {
				'icon': 'success',
				class_name: 'o-well__icon'
			});
			break;
		case 'error':
			this.data.mod = ['error'];
			this.data.icon = BaseController.new('atoms-icons', {
				'icon': 'error',
				class_name: 'o-well__icon'
			});
			break;
		case 'primary':
		default:
			this.data.mod = ['primary'];
			this.data.icon = BaseController.new('atoms-icons', {
				'icon': 'information',
				class_name: 'o-well__icon'
			});
	}
	return this.data;
};

module.exports = AtomsWell;

},{"BaseController":"BaseController"}],78:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var Validatable = require('./validatable');

var Form = BaseController.create('Form');

Form.prototype.onCreate = function () {
	this.inputs = {};
};

/**
 * Find all validatable children and validate them.
 * @returns {boolean}
 */
Form.prototype.validate = function () {
	var isValid = true;
	this.getChildrenByClass(Validatable).forEach(function (input) {
		if (!input.validate()) {
			isValid = false;
		}
	});
	return isValid;
};

Form.prototype.saveInputs = function () {
	this.selectAll('input').concat(this.selectAll('textarea')).forEach(function (input) {
		this.inputs[input.getAttribute('name')] = input.value;
	}, this);
};
Form.prototype.loadInputs = function () {
	this.selectAll('input').concat(this.selectAll('textarea')).forEach(function (input) {
		if (!this.inputs[input.getAttribute('name')]) {
			return;
		}
		input.focus();
		input.value = this.inputs[input.getAttribute('name')];
		input.blur();
	}, this);
};

module.exports = Form;

},{"./validatable":123,"BaseController":"BaseController"}],79:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var MoleculesButton = BaseController.create('MoleculesButton');

MoleculesButton.prototype.helper = function () {
	return {
		'mod': this.data['mod'],
		'class_name': this.data.class_name,
		'button': BaseController.new('atoms-element-button', this.data.button)
	};
};

module.exports = MoleculesButton;

},{"BaseController":"BaseController"}],80:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');
var BaseController = require('BaseController');
var MoleculesCaptcha = BaseController.create('MoleculesCaptcha');

MoleculesCaptcha.prototype.addListeners = function () {
	this.addHookListener('generate-captcha', 'click', this.rerender);
};

MoleculesCaptcha.prototype.afterRender = function () {
	this.regenerate();
};

MoleculesCaptcha.prototype.regenerate = function () {
	BaseModel.instance('WebClient').getCaptcha({
		success: function (response) {
			var parent, style;
			this.uid = response.uid;
			parent = this.hook('captcha_html');
			while (parent.firstChild) {
				parent.removeChild(parent.firstChild);
			}
			parent.insertAdjacentHTML('afterbegin', response.html);
			style = document.createElement('style');
			style.insertAdjacentHTML('afterbegin', response.style);
			this.hook('captcha_html').appendChild(style);
		},
		error: function () {
			console.error(arguments);
		},
		context: this
	});
};

MoleculesCaptcha.prototype.helper = function () {
	var data = this.data || {};

	data.addon = BaseController.new('atoms-addon', {
		'text': __('generic.captcha-generate'),
		'mod': ['top'],
		'hook': this.createHook('generate-captcha')
	});

	data.hook = this.createHook('captcha_html');
	return data;
};

module.exports = MoleculesCaptcha;

},{"BaseController":"BaseController","BaseModel":"BaseModel"}],81:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var MoleculesCheckbox = BaseController.create('MoleculesCheckbox');

MoleculesCheckbox.prototype.helper = function () {

	this.data.input.type = this.data.input.type || 'checkbox';
	this.data.input.class_name = this.data.input.class_name || ['o-checkbox__element'];
	this.data.input.name = this.data.input.name;
	return {
		'class_name': this.data.class_name,
		'input': BaseController.new('atoms-element-input', this.data.input),
		'label': this.data.label
	};
};

module.exports = MoleculesCheckbox;

},{"BaseController":"BaseController"}],82:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var MoleculesInput = BaseController.create('MoleculesInput');

MoleculesInput.prototype.addListeners = function () {
	this.addDOMListener('input', 'input keyup blur', this.checkEmptiness);
	this.addDOMListener('input', 'keypress', this.keypress);
};

MoleculesInput.prototype.afterRender = function () {
	this.checkEmptiness({target: this.select('input')});
};

MoleculesInput.prototype.keypress = function (event) {
	~[10, 13].indexOf(event.which || event.keyCode) && (event.form = this.DOMElement.closest('form')) && this.getInstanceByElement(event.form).submitForm(event);
};

MoleculesInput.prototype.checkEmptiness = function (event) {
	this.DOMElement.classList[event.target.value ? 'remove' : 'add']('is-empty');
	this.data.input.value = event.target.value;
};

MoleculesInput.prototype.helper = function () {
	var input, label;

	if(this.data.input.type === 'date') {
		input = BaseController.new('atoms-element-input~date', this.data.input);
	} else {
		this.data.input.class_name = ['o-form__element'];
		input = BaseController.new('atoms-element-input', this.data.input);
	}

	if(this.data.label) {
		this.data.label.class_name = ['o-form__label', 'o-form__label--main', 'o-form__label--floating'];
		label = BaseController.new('atoms-label', this.data.label);
	}

	return {
		'class_name': this.data.class_name,
		'input': input,
		'label': label,
		'addon': this.data.addon,
		'tooltip': this.data.tooltip,
		'mod': this.data.mod,
		'tag': this.data.tag,
		'hook': this.data.hook,
		'icon': this.data.icon,
		'value': this.data.value
	};
};

module.exports = MoleculesInput;

},{"BaseController":"BaseController"}],83:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');
var BaseController = require('BaseController');
var MoleculesInput_Password = require('./input~password.js');
var MoleculesInput_PasswordWithPolicy = BaseController.create('MoleculesInput_PasswordWithPolicy', MoleculesInput_Password);

MoleculesInput_PasswordWithPolicy.prototype.addListeners = function () {
	MoleculesInput_Password.prototype.addListeners.call(this);
};

MoleculesInput_PasswordWithPolicy.prototype.helper = function () {
	var Login = BaseModel.instance('Login');
	var password_policy = BaseModel.instance('WebClient').getData('password_policy') || {};
	var policies;

	var alias_rule = password_policy.getValue('user_alias') && {
		'name': 'not_contains',
		'counterpart_value': Login.getData('create_account').username || Login.getData('chosen_account').username,
		'parent_hook': 'form',
		'counterpart_hook': 'username',
		'message': __('validation.user_alias')
	};
	password_policy.unsetData('user_alias');

	policies = password_policy.getWorkingDataKeys();
	this.data.rules = [
		{
			'name': 'empty',
			'message': __('validation.empty')
		},
		alias_rule
	].concat(policies.map(function (key) {
		return password_policy.getValue(key) && {
			name: key,
			data: password_policy.getValue(key),
			message: __('validation.' + key, password_policy.getValue(key))
		};
	})).filter(Boolean);

	this.data.tooltip = {
		hook: this.createHook('tooltip'),
		'well': {
			'title': __('generic.password-policy'),
			'text': [__('validation.empty')].concat(policies.map(function (key) {
				return password_policy.getValue(key) && __('validation.' + key, password_policy.getValue(key));
			}).filter(Boolean)),
			'type': 'primary'
		}
	};

	return MoleculesInput_Password.prototype.helper.call(this);
};

module.exports = MoleculesInput_PasswordWithPolicy;

},{"./input~password.js":84,"BaseController":"BaseController","BaseModel":"BaseModel"}],84:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var MoleculesInput_Validatable = require('./input~validatable.js');
var MoleculesInput_Password = BaseController.create('MoleculesInput_Password', MoleculesInput_Validatable);

MoleculesInput_Password.prototype.onCreate = function () {
	this.text = false;
	this.data.input.type = 'password';
	this.data.input.class_name = ['o-form__element--password'];
	this.data.input.autocomplete = 'current-password';
};

MoleculesInput_Password.prototype.addListeners = function () {
	MoleculesInput_Validatable.prototype.addListeners.call(this);
	this.addDelegatedHookListener('show-password', 'click', this.showPassword);
};

MoleculesInput_Password.prototype.showPassword = function () {
	this.select('input').setAttribute('type', this.text ? 'password' : 'text');
	this.hook('show-password').textContent = this.text ? __('generic.show') : __('generic.hide');
	this.text = !this.text;
};

module.exports = MoleculesInput_Password;

},{"./input~validatable.js":86,"BaseController":"BaseController"}],85:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');
var BaseController = require('BaseController');
var MoleculesInput = require('./input');
var MoleculesInput_Search = BaseController.create('MoleculesInput_Search', MoleculesInput);

MoleculesInput_Search.prototype.addListeners = function () {
	MoleculesInput.prototype.addListeners.call(this);

	this.addDOMListener('input', 'submit', this.search);
	this.addDOMListener('input', 'keydown', this.keyup);
};

MoleculesInput_Search.prototype.keyup = function (event) {
	((event.which || event.keyCode) === 13) && this.search(event);
};

MoleculesInput_Search.prototype.search = function (event) {
	var WebClient = BaseModel.instance('WebClient');
	var url = WebClient.getData('layout_settings').getValue('search_phrase').replace(/%%query%%/g, event.target.value);
	var search = window.open(url);
	if(!search) {
		window.location = url;
		return;
	}
	search.focus();
	event.target.value = '';
	event.target.blur();

	event.preventDefault();
	event.stopPropagation();
	event.stopImmediatePropagation();
};

module.exports = MoleculesInput_Search;

},{"./input":82,"BaseController":"BaseController","BaseModel":"BaseModel"}],86:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var MoleculesInput = require('./input');
var Validatable = require('../../validatable');
var MoleculesInput_Validatable = BaseController.create('MoleculesInput_Validatable', MoleculesInput, Validatable);

MoleculesInput_Validatable.prototype.addListeners = function () {
	Validatable.prototype.addListeners.call(this);
	MoleculesInput.prototype.addListeners.call(this);

	this.addDOMListener('input', 'change', this.validate);
};

MoleculesInput_Validatable.prototype.helper = function () {
	this.data.tooltip && (this.data.tooltip.hook = this.createHook('tooltip'));
	return MoleculesInput.prototype.helper.call(this);
};

module.exports = MoleculesInput_Validatable;

},{"../../validatable":123,"./input":82,"BaseController":"BaseController"}],87:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');
var BaseController = require('BaseController');
var Window = require('../../window.js');
var MoleculesLanguagePicker = BaseController.create('MoleculesLanguagePicker', Window);

MoleculesLanguagePicker.prototype.onCreate = function () {
	Window.prototype.onCreate.apply(this, arguments);
	this.setup({
		move_selector: false,
		draggable_border: false
	});
};

MoleculesLanguagePicker.prototype.afterRender = function () {
	Window.prototype.afterRender.apply(this, arguments);
	this.DOMElement.classList.add('c-card');
};

MoleculesLanguagePicker.prototype.addListeners = function () {
	Window.prototype.addListeners.apply(this, arguments);
	this.addPartialListener('molecules-language-picker-item', 'click', this.changeLanguage);
	this.addClickOutsideListener(this.DOMShadowElement, this.onClickOutside);
};

MoleculesLanguagePicker.prototype.onClickOutside = function () {
	this.invoker.removeChooseLanguage();
};

MoleculesLanguagePicker.prototype.changeLanguage = function (event) {
	var controller = this.getInstanceByElement(event.target);
	this.disable();

	BaseModel.instance('Login').changeLanguage(controller.data.model.getValue('code'), {
		success: function () {
			var site = this.getParent('sites');
			this.invoker.removeChooseLanguage.call(this.invoker);
			site.getChildren('organisms-bar').forEach(function (bar) {
				bar.rerender();
			});
			site.getChildren('templates-card').forEach(function (card) {
				card.saveInputs();
				card.rerender();
				card.loadInputs();
			});
		},
		error: function (error) {
			this.enable();
			this.trigger('error-message-show', {
				title: __('generic.error'),
				text: error || __('error.language-not-found'),
				type: 'error'
			});
			this.invoker.removeChooseLanguage.call(this.invoker);
		},
		context: this
	});

};

MoleculesLanguagePicker.prototype.helper = function () {
	var WebClient = BaseModel.instance('WebClient');
	var languages = WebClient.getData('languages');
	var columns = Math.ceil(languages.length / 13);
	var rows = Math.ceil(languages.length / columns);
	var column = [];

	languages.sort(function (a, b) {
		var _a = a.getValue('code'), _b = b.getValue('code');
		if (_a === 'en') {
			return -1;
		} else if (_b === 'en') {
			return 1;
		}
		return _a < _b ? -1 : _b < _a;
	}).map(function (language) {
		return BaseController.new('molecules-language-picker-item', {
			'text': __('languages.' + language.getValue('code')),
			'class_name': WebClient.getData('layout_settings').getUserLanguage().getValue('code') === language.getValue('code') ? ['is-active'] : false,
			'hook': this.createHook('language'),
			'model': language
		});
	}, this).forEach(function (language, i) {
		var index = Math.floor(i / rows);
		column[index] = column[index] || {item: []};
		column[index].item.push(language);
	});
	return {
		column: column
	};
};

module.exports = MoleculesLanguagePicker;

},{"../../window.js":124,"BaseController":"BaseController","BaseModel":"BaseModel"}],88:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var MoleculesSelect = BaseController.create('MoleculesSelect');

MoleculesSelect.prototype.helper = function () {
	var select, label;
	this.data.select = this.data.select || {};
	this.data.select.class_name = this.data.select.class_name || [];
	this.data.select.class_name.push('o-form__element');
	select = BaseController.new('atoms-element-select', this.data.select);

	if(this.data.label) {
		this.data.label.class_name = this.data.label.class_name || [];
		this.data.label.class_name.push('o-form__label', 'o-form__label--main');
		label = BaseController.new('atoms-label', this.data.label);
	}
	
	return {
		class_name: this.data.class_name,
		select: select,
		label: label,
		icon: BaseController.new('atoms-icons', {
			icon: 'arrow',
			class_name: ['o-select__arrow']
		})
	};
};

module.exports = MoleculesSelect;

},{"BaseController":"BaseController"}],89:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var MoleculesSelect = require('./select');
var Validatable = require('../../validatable');
var MoleculesSelect_Validatable = BaseController.create('MoleculesSelect_Validatable', MoleculesSelect, Validatable);

MoleculesSelect_Validatable.prototype.addListeners = function () {
	Validatable.prototype.addListeners.call(this);
	MoleculesSelect.prototype.addListeners.call(this);

	this.addDOMListener('select', 'change', this.validate);
};

MoleculesSelect_Validatable.prototype.helper = function () {
	this.data.tooltip && (this.data.tooltip.hook = this.createHook('tooltip'));
	return MoleculesSelect.prototype.helper.call(this);
};

module.exports = MoleculesSelect_Validatable;

},{"../../validatable":123,"./select":88,"BaseController":"BaseController"}],90:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var MoleculesStatic = BaseController.create('MoleculesStatic');

MoleculesStatic.prototype.helper = function () {
	if(this.data.label) {
		this.data.label.class_name = this.data.label.class_name || [];
		this.data.label.class_name.push('o-form__label', 'o-form__label--main', 'o-form__label--floating');
		this.data.label = BaseController.new('atoms-label', this.data.label);
	}

	return this.data;
};

module.exports = MoleculesStatic;

},{"BaseController":"BaseController"}],91:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var MoleculesTextarea = BaseController.create('MoleculesTextarea');

MoleculesTextarea.prototype.addListeners = function () {
	this.addDOMListener('textarea', 'input keyup blur', this.checkEmptiness);
};

MoleculesTextarea.prototype.afterRender = function () {
	this.checkEmptiness({target: this.select('textarea')});
};

MoleculesTextarea.prototype.checkEmptiness = function (event) {
	this.DOMElement.classList[event.target.value ? 'remove' : 'add']('is-empty');
	this.data.textarea.text = event.target.value;
};

MoleculesTextarea.prototype.helper = function () {
	var textarea, label;
	this.data.textarea = this.data.textarea || {};
	this.data.textarea.class_name = this.data.textarea.class_name || [];
	this.data.textarea.class_name.push('o-form__element');
	textarea = BaseController.new('atoms-element-textarea', this.data.textarea);

	if(this.data.label) {
		this.data.label.class_name = this.data.label.class_name || [];
		this.data.label.class_name.push('o-form__label', 'o-form__label--main', 'o-form__label--floating');
		label = BaseController.new('atoms-label', this.data.label);
	}

	return {
		'class_name': this.data.class_name,
		'textarea': textarea,
		'label': label,
		'tooltip': this.data.tooltip,
		'addon': this.data.addon,
		'mod': this.data.mod,
		'tag': this.data.tag,
		'hook': this.data.hook,
		'icon': this.data.icon
	};
};

module.exports = MoleculesTextarea;

},{"BaseController":"BaseController"}],92:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var MoleculesTextarea = require('./textarea');
var Validatable = require('../../validatable');
var MoleculesTextarea_Validatable = BaseController.create('MoleculesTextarea_Validatable', MoleculesTextarea, Validatable);

MoleculesTextarea_Validatable.prototype.addListeners = function () {
	Validatable.prototype.addListeners.call(this);
	MoleculesTextarea.prototype.addListeners.call(this);

	this.addDOMListener('textarea', 'change', this.validate);
};

MoleculesTextarea_Validatable.prototype.helper = function () {
	this.data.tooltip && (this.data.tooltip.hook = this.createHook('tooltip'));
	return MoleculesTextarea.prototype.helper.call(this);
};

module.exports = MoleculesTextarea_Validatable;

},{"../../validatable":123,"./textarea":91,"BaseController":"BaseController"}],93:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');
var BaseController = require('BaseController');
var OrganismsBar_Footer = BaseController.create('OrganismsBar_Footer');

OrganismsBar_Footer.prototype.helper = function () {
	var WC = BaseModel.instance('WebClient');

	return {
		'class_name': ['o-external__footer'],
		'section': [
			{
				'mod': ['start'],
				'footer': {
					'current_year': new Date().getFullYear(),
					'logo': BaseController.new('atoms-icons', {
						'icon': 'icewarp',
						'class_name': ['o-external__logo']
					}),
					'copyright': __('generic.copyright')
				}
			},
			{
				'mod': ['center'],
				'footer': {
					'social': [
						(WC.getData('restrictions').getValue('facebook_disabled') || !WC.getData('layout_settings').getValue('facebook_link')) ? false : {
							'icon': BaseController.new('atoms-icons', {
								'icon': 'facebook',
								'class_name': ['o-external__icon']
							}),
							'href': WC.getData('layout_settings').getValue('facebook_link')
						},
						(WC.getData('restrictions').getValue('twitter_disabled') || !WC.getData('layout_settings').getValue('twitter_link')) ? false : {
							'icon': BaseController.new('atoms-icons', {
								'icon': 'twitter',
								'class_name': ['o-external__icon']
							}),
							'href': WC.getData('layout_settings').getValue('twitter_link')
						},
						(WC.getData('restrictions').getValue('linkedin_disabled') || !WC.getData('layout_settings').getValue('linkedin_link')) ? false : {
							'icon': BaseController.new('atoms-icons', {
								'icon': 'linkedin',
								'class_name': ['o-external__icon']
							}),
							'href': WC.getData('layout_settings').getValue('linkedin_link')
						}
					].filter(Boolean)
				}
			},
			{
				'mod': ['end'],
				'footer': {
					'find-out-more': {
						text: __('generic.find_out_more', {
							md: true
						})
					},
					version: BaseModel.instance('Server').getData('c_niceversion')
				}
			}
		]
	};
};

module.exports = OrganismsBar_Footer;

},{"BaseController":"BaseController","BaseModel":"BaseModel"}],94:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');
var Animations = require('@icewarp/utils').animations;
var BaseController = require('BaseController');
var OrganismsCardHeader = BaseController.create('OrganismsCardHeader');
var Escape = require('@icewarp/escape-string');

OrganismsCardHeader.prototype.addListeners = function () {
	this.addDelegatedHookListener('language', 'click', this.chooseLanguage);
};

OrganismsCardHeader.prototype.chooseLanguage = function (event) {
	var rect = event.element.getBoundingClientRect();
	event.stopPropagation();
	this.choose_language = this.choose_language || BaseController.new('molecules-language-picker');
	if (this.choose_language.DOMElement) {
		return;
	}
	this.choose_language.invoker = this;
	this.choose_language.execute().then(function(controller) {
		controller.render(this.getParent('sites').DOMElement, 'beforeend');
		controller.DOMElement.style.top = rect.bottom + 'px';
		controller.DOMElement.style.left = (rect.left + rect.right - controller.DOMElement.clientWidth) / 2 + 'px';
		event.element.classList.add('is-open');
	}.bind(this));
};

OrganismsCardHeader.prototype.removeChooseLanguage = function () {
	if (Animations.browserEvent('animationend')) {
		this.choose_language.DOMElement.classList.add('is-previous');
		this.choose_language.addDOMListener(this.choose_language.DOMElement, Animations.browserEvent('animationend'), function () {
			this.DOMElement && this.hook('language').classList.remove('is-open');
			this.choose_language.remove();
			this.choose_language = null;
		}.bind(this), {}, true);
		this.choose_language.DOMElement.classList.add('on-destroy');
	} else {
		this.hook('language').classList.remove('is-open');
		this.choose_language.remove();
		this.choose_language = null;
	}
};

OrganismsCardHeader.prototype.helper = function () {
	var Server = BaseModel.instance('Server');
	var WebClient = BaseModel.instance('WebClient');
	var Login = BaseModel.instance('Login');

	var subtitle = this.data.subtitle !== void 0 ? this.data.subtitle : (Login.getData('chosen_account').email ? [
		Login.getData('chosen_account').name && {
			'text': Escape(Login.getData('chosen_account').name),
			'class_name': ['o-header__subtitle'],
			'mod': ['normal']
		}, {
			'text': Escape(Login.getData('chosen_account').email),
			'class_name': ['o-header__subtitle'],
			'mod': ['normal']
		}
	].filter(Boolean) : false);
	subtitle && (subtitle.mod = ['normal']);

	if(this.data['card-icon']) {
		this.data['card-icon'].data.class_name = ['o-header__image', 'o-header__image--default'];
	}

	this.data.well = this.data.well || {};
	this.data.well.class_name = this.data.well.class_name || [];
	this.data.well.class_name.push('o-header__well');

	return {
		'avatar': this.data.avatar !== void 0 ? this.data.avatar : BaseController.new('atoms-avatar', Login.getData('chosen_account')),
		'logo': WebClient.getData('layout_settings').getValue('login_logo') ? BaseController.new('atoms-image', {
			'class_name': ['o-header__image', 'o-card__header--default'],
			'src': Server.getLogo()
		}) : false,
		'icon': this.data.icon || BaseController.new('atoms-icons', {
			'icon': 'icewarp',
			'class_name': [
				'o-header__image',
				'o-header__image--default'
			]
		}),
		'card-icon': this.data['card-icon'],
		'heading': this.data.heading,
		'hook': this.data.hook,
		'subtitle': subtitle,
		'mod': this.data.mod,
		'well': BaseController.new('atoms-well', this.data.well),
		'language': (WebClient.getData('restrictions').getValue('disable_languages') || WebClient.getData('languages').length < 2) ? false : BaseController.new('atoms-dropdown', {
			'hook': this.createHook('language'),
			'code': WebClient.getData('layout_settings').getUserLanguage().getValue('code')
		})
	};
};

module.exports = OrganismsCardHeader;

},{"@icewarp/escape-string":155,"@icewarp/utils":173,"BaseController":"BaseController","BaseModel":"BaseModel"}],95:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var OrganismsCardHeader = require('./card-header.js');
var OrganismsCardHeader_Message = BaseController.create('OrganismsCardHeader_Message', OrganismsCardHeader);

OrganismsCardHeader_Message.prototype.helper = function () {
	this.data.well && (this.data.well.icon = false);

	return OrganismsCardHeader.prototype.helper.call(this);
};

module.exports = OrganismsCardHeader_Message;

},{"./card-header.js":94,"BaseController":"BaseController"}],96:[function(require,module,exports){
"use strict";
var Window = require('../../window.js');
var BaseController = require('BaseController');
var OrganismsWindow = BaseController.create('OrganismsWindow', Window);

OrganismsWindow.prototype.onCreate = function () {
	Window.prototype.onCreate.apply(this, arguments);
	this.setup({
		//move_selector: ".molecules-window-header",
		//draggable_border: 10
	});
};

OrganismsWindow.prototype.beforeFullscreenToggle = function () {
	this.DOMElement.classList[this.fullscreen ? 'remove' : 'add']('fullscreen');
};

module.exports = OrganismsWindow;

},{"../../window.js":124,"BaseController":"BaseController"}],97:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var SitesGeneric = BaseController.create('SitesGeneric');

SitesGeneric.prototype.afterRender = function () {
	this.DOMElement.setAttribute('id', 'content');
	this.DOMElement.classList.add('site');
};

module.exports = SitesGeneric;

},{"BaseController":"BaseController"}],98:[function(require,module,exports){
"use strict";
var Breakpoint = require('Breakpoint');
var BaseController = require('BaseController');
var GenericSite = require('../generic');
var SitesLogin = BaseController.create('SitesLogin', GenericSite);
var Browser = require('@icewarp/utils').browser;

var BaseModel = require('BaseModel');
var Hash = require('@icewarp/hash');
var LocalStorage = require('@icewarp/localstorage');

SitesLogin.prototype.addListeners = function () {
	this.addDOMListener(document.body, 'keydown', this.keydown);
	this.addBreakpointListener([Breakpoint.xs, Breakpoint.sm], this.recompileAd);
	this.addBreakpointListener([Breakpoint.md, Breakpoint.lg, Breakpoint.xl], this.recompileAd);
};

SitesLogin.prototype.keydown = function (event) {
	if (!document.querySelectorAll('input:focus, textarea:focus, select:focus, button:focus').length && !event.altKey && !event.ctrlKey && !event.metaKey && (!~[8, 9].indexOf(event.which || event.keyCode))) {
		this.selectAll('input, textarea').some(function (elem) {
			if (elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length) {
				elem.focus();
				return true;
			}
		});
	}
};

SitesLogin.cards_order = {
	'unavailable': 0,
	'choose-account': 1,
	'sign-in': 2,
	'sign-in-password': 3,
	'forgot-password': 3,
	'create-account': 3,
	'two-factor': 4,
	'personal': 4,
	'reset-password': 5,
	'change-password': 5,
	'set-password': 5,
	'verification': 6,
	'contact-admin': 7,
	'tc-join': 101,
	'tc-check-email': 102,
	'tc-collaboration': 103,
	'tc-share': 104,
	'tc-actions': 105,
	'gateway-login': 301,
	'generic-message': 401,
	'guest-verify': 500,
	'confirm-personality': 501,
	'oauth-grant': 601,
};

SitesLogin['restriction_sign-in-password'] = function () {
	var Login = BaseModel.instance('Login');
	if (!Login.getData('chosen_account').email) {
		if (Login.getUsers().length === 1) {
			Login.setData('chosen_account', Login.getUsers()[0]);
		} else {
			return Login.getDefaultCard();
		}
	}
};
SitesLogin['restriction_two-factor'] = function () {
	var Login = BaseModel.instance('Login');
	if (Login.getUsers().length === 1) {
		Login.setData('chosen_account', Login.getUsers()[0]);
		return 'sign-in-password';
	} else {
		return Login.getDefaultCard();
	}
};
SitesLogin['restriction_set-password'] = function () {
	if (!BaseModel.instance('Login').getData('chosen_account').email) {
		return 'create-account';
	}
};
SitesLogin['restriction_generic-message'] = function () {
	return !Hash.getParts().tconly && BaseModel.instance('Login').getDefaultCard();
};
SitesLogin.autoChooseAccount = true;
SitesLogin['restriction_choose-account'] = function () {
	var last_login;
	var config = BaseModel.instance('Config').getData('config');
	var Login = BaseModel.instance('Login');
	if(Login.getData('chosen_account').email) {
		return 'choose-account';
	}
	if (Login.getUsers().length === 1 && SitesLogin.autoChooseAccount) {
		SitesLogin.autoChooseAccount = false;
		Login.setData('chosen_account', Login.getUsers()[0]);
		return 'sign-in-password';
	} else {
		last_login = LocalStorage.getItem('last-login-' + config.application);
		if (Login.getUsers().length && last_login && Login.getUser(last_login.email)) {
			Login.setData('chosen_account', Login.getUser(last_login.email));
			return 'sign-in-password';
		}
	}
	if (!Login.getUsers().length || BaseModel.instance('WebClient').getData('restrictions').getValue('disable_autofill')) {
		return 'sign-in';
	}
};
SitesLogin['restriction_forgot-password'] = function () {
	if (!BaseModel.instance('WebClient').getData('reset_settings').getValue('enabled') || !BaseModel.instance('Login').getData('chosen_account').email) {
		return BaseModel.instance('Login').getDefaultCard();
	}
};
SitesLogin['restriction_change-password'] = function () {
	if (BaseModel.instance('WebClient').getData('restrictions').getValue('disable_changepass')) {
		return BaseModel.instance('Login').getDefaultCard();
	}
};
SitesLogin['restriction_contact-admin'] = function () {
	if (!BaseModel.instance('WebClient').getData('restrictions').getValue('contact_support')) {
		return BaseModel.instance('Login').getDefaultCard();
	}
};
SitesLogin['restriction_create-account'] = function () {
	var WebClient = BaseModel.instance('WebClient');
	if (WebClient.getData('restrictions').getValue('disable_signup') || WebClient.getData('restrictions').getValue('disable_signup_ip')) {
		return BaseModel.instance('Login').getDefaultCard();
	}
};
SitesLogin['restriction_personal'] = function () {
	var WebClient = BaseModel.instance('WebClient');
	var Login = BaseModel.instance('Login');
	if (WebClient.getData('restrictions').getValue('disable_signup') || WebClient.getData('restrictions').getValue('disable_signup_ip')) {
		return Login.getDefaultCard();
	}
	if (!Login.getData('create_account').username || !WebClient.getData('custom_login_fields').enabledCustomFields().length) {
		return 'create-account';
	}
};
SitesLogin['restriction_verification'] = SitesLogin['restriction_personal'];
SitesLogin['restriction_guest-verify'] = function () {
	if (!Hash.getParts().email || !Hash.getParts().hash) {
		return BaseModel.instance('Login').getDefaultCard();
	}
};
SitesLogin['restriction_confirm-personality'] = function () {
	if (!Hash.getParts().email || !Hash.getParts().user || !Hash.getParts().hash) {
		return BaseModel.instance('Login').getDefaultCard();
	}
};
SitesLogin['restriction_unavailable'] = function () {
	if (BaseModel.instance('WebClient').getData('settings_loaded') && Hash.getParts().error) {
		return BaseModel.instance('Login').getDefaultCard();
	}
	return 'unavailable';
};
SitesLogin['restriction_tc-*'] = function () {
	if (!Hash.getParts().email || !Hash.getParts().sender || !Hash.getParts().hash || !Hash.getParts().room) {
		return BaseModel.instance('Login').getDefaultCard();
	}
};
SitesLogin['restriction_tc-action'] = SitesLogin['restriction_tc-*'];
SitesLogin['restriction_tc-check-emal'] = SitesLogin['restriction_tc-*'];
SitesLogin['restriction_tc-collaboration'] = SitesLogin['restriction_tc-*'];
SitesLogin['restriction_tc-join'] = SitesLogin['restriction_tc-*'];
SitesLogin['restriction_tc-share'] = SitesLogin['restriction_tc-*'];

SitesLogin['restriction_oauth-grant'] = function() {
	if (!Hash.getParts().auth_id) {
		return BaseModel.instance('Login').getDefaultCard();
	}
};

SitesLogin.restricted = function (subpage) {
	var restriction;
	subpage = SitesLogin.cards_order[subpage] !== void 0 ? subpage : BaseModel.instance('Login').getDefaultCard();

	if (!this['restriction_' + subpage]) {
		return subpage;
	}
	restriction = this['restriction_' + subpage]() || subpage;
	if (restriction !== subpage) {
		Hash.change(restriction, false, false, true);
	}
	return restriction;
};

SitesLogin.prototype.recompileAd = function () {
	this.getChildren('atoms-ad')[0] && this.getChildren('atoms-ad')[0].rerender({
		position: ~[Breakpoint.md, Breakpoint.lg, Breakpoint.xl].indexOf(Breakpoint.getCurrent()) ? 'desktop' : 'mobile'
	});
};

SitesLogin.prototype.onHashChange = function (site, parts, previous_site) {
	var card = SitesLogin.restricted(site);
	var prev_subpage = previous_site || BaseModel.instance('Login').getDefaultCard();
	prev_subpage !== card && this.getInstanceByElement('form').changeCard({}, {card: card, prepend: SitesLogin.cards_order[card] < SitesLogin.cards_order[prev_subpage], change_hash: false});
	return true;
};

SitesLogin.prototype.helper = function () {
	return {
		'card': BaseController.new('templates-card~' + SitesLogin.restricted(this.data.site || Hash.getSite()), this.data.data),
		'bar': BaseController.new('organisms-bar~footer', {
			'class_name': ['footer']
		}),
		'theme': BaseModel.instance('WebClient').getData('layout_settings').getValue('login_color'),
		'background': BaseModel.instance('Server').getBackground(),
		'ie': Browser.isIE() || Browser.isEdge(),
		'ad': BaseController.new('atoms-ad', {
			position: ~[Breakpoint.md, Breakpoint.lg, Breakpoint.xl].indexOf(Breakpoint.getCurrent()) ? 'desktop' : 'mobile'
		})
	};
};

module.exports = SitesLogin;

},{"../generic":97,"@icewarp/hash":156,"@icewarp/localstorage":163,"@icewarp/utils":173,"BaseController":"BaseController","BaseModel":"BaseModel","Breakpoint":"Breakpoint"}],99:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');
var BaseController = require('BaseController');
var Form = require('../../form');
var TemplatesCard = BaseController.create('TemplatesCard', false, Form);
var animationEnd = require('@icewarp/utils').animations.browserEvent('animationend');
var Hash = require('@icewarp/hash');
var delayed = require('delayed');

TemplatesCard.prototype.addListeners = function () {
	this.addDelegatedHookListener('sign-with-another-acc', 'click', this.changeCard, {card: 'sign-in', hashData: Hash.getParts()});
	this.addDelegatedHookListener('contact-admin', 'click', this.changeCard, {card: 'contact-admin', hashData: Hash.getParts()});
	this.addDelegatedHookListener('sign-in', 'click', this.changeCard, {data: {autoselect: false}, hashData: Hash.getParts()});
	this.addDelegatedHookListener('choose-account', 'click', this.changeCard, {card: 'choose-account', hashData: Hash.getParts()});
	this.addDelegatedHookListener('create-acc', 'click', this.changeCard, {card: 'create-account'});
	this.addDelegatedHookListener('back-to-email', 'click', this.backToEmail);
	this.addDelegatedHookListener('back', 'click', this.back);
	this.addDOMListener('', 'submit', this.submitForm);

	this.addGlobalListener('error-message-hide', this.hideMessage);
	this.addGlobalListener('error-message-show', this.showMessage);
};

TemplatesCard.prototype.onCreate = function () {
	Form.prototype.onCreate.call(this);
	this.submitted = false;
};

TemplatesCard.prototype.afterRender = function () {
	var parts = Hash.getParts();
	var error = parts.eid || parts.reason;
	document.body.scrollTop = document.documentElement.scrollTop = 0;
	error && this.showMessage({
		title: __('generic.error'),
		text: __('error.' + error, {}, __('error.unspecified', {error: error, md: true})),
		type: 'error',
		pinned: true
	});

	parts.notifyuri && parts.eid && BaseModel.instance('Login').callCommunication('teamchatError', parts);
};

TemplatesCard.prototype.beforeDestroy = function () {
	this.autohide_timeout && clearTimeout(this.autohide_timeout);
};

TemplatesCard.prototype.back = function () {
	history.go(-1);
};

TemplatesCard.prototype.backToEmail = function () {
	this.changeCard({card: this.data.prev || 'sign-in'});
};

TemplatesCard.prototype.submitForm = function (event) {
	event.preventDefault();
	event.stopPropagation();
	event.stopImmediatePropagation();
	if (this.submitted) {
		return;
	}
	this.validateForm && this.disable() && this.validateForm();
};

TemplatesCard.prototype.hasError = function () {
	this.enable();
	if (animationEnd) {
		this.addDOMListener(this.DOMElement, animationEnd, function () {
			this.DOMElement.classList.remove('a-error');
		}.bind(this), {}, true);
		this.DOMElement.classList.add('a-error');
	}
};

TemplatesCard.prototype.genericError = function (error, type, title) {
	var captchas = this.getChildren('molecules-captcha');
	this.hasError();
	this.enable();
	if (captchas.length) {
		captchas[0].rerender();
		this.hook('captcha').value = '';
		this.hook('captcha').focus();
	}
	this.showMessage({
		title: title || __('generic.error'),
		text: __('error.' + error, {}, __('error.unspecified', {error: error, md: true})),
		type: type || 'error'
	});
};

TemplatesCard.prototype.changeCardCallback = function (data) {
	if (!this.DOMElement) {
		return;
	}
	BaseController.new('templates-card~' + data.card).execute(data.data || {}).then(function(controller) {
		controller.render(this.DOMElement.parentElement, 'beforeend');
		if (animationEnd) {
			controller.DOMElement.classList.add(data.prepend ? 'is-previous' : 'is-next');
			controller.addDOMListener(controller.DOMElement, animationEnd, function () {
				controller.DOMElement.classList.remove(data.prepend ? 'is-previous' : 'is-next');
			}, {}, true);
		}
		this.remove();
	}.bind(this));
};

TemplatesCard.prototype.changeCard = function (event, data) {
	data = (arguments.length === 1 ? event : data) || {};
	data.card = data.card || BaseModel.instance('Login').getDefaultCard();

	(data.change_hash === void 0 ? true : data.change_hash) && Hash.change(data.card, data.hashData || {}, true, data.keepHashData);

	if (animationEnd) {
		this.DOMElement.classList.add(data.prepend ? 'is-next' : 'is-previous');
		this.addDOMListener(this.DOMElement, animationEnd, function () {
			this.changeCardCallback(data);
		}, {}, true);
		this.DOMElement.classList.add('on-destroy');
	} else {
		this.changeCardCallback(data);
	}
};

TemplatesCard.prototype.hideMessage = function () {
	var well = this.getInstanceByElement(this.hook('well'));
	if (well.data.pinned) {
		return;
	}
	if (animationEnd) {
		well.addDOMListener(well.DOMElement, animationEnd, function () {
			well.DOMElement.classList.remove('on-destroy');
			well.DOMElement.classList.remove('is-visible');
		}, {}, true);
		well.DOMElement.classList.add('on-destroy');
	} else {
		well.DOMElement.classList.remove('is-visible');
	}
};

TemplatesCard.prototype.showMessage = function (data) {
	var well = this.getInstanceByElement(this.hook('well'));
	well.data.title = data.title;
	well.data.text = data.text;
	well.data.type = data.type;
	well.data.pinned = data.pinned;
	well.data.class_name = well.data.class_name || [];
	well.data.class_name.push('is-visible');

	well.rerender();
	this.autohide_timeout && clearTimeout(this.autohide_timeout);
	data.autohide && (this.autohide_timeout = delayed(this.hideMessage, this, data.autohide, this._name + this.id));
};

TemplatesCard.prototype.helper = function () {
	return BaseController.static('templates-card~' + (this.data.content || BaseModel.instance('Login').getDefaultCard()));
};

module.exports = TemplatesCard;

},{"../../form":78,"@icewarp/hash":156,"@icewarp/utils":173,"BaseController":"BaseController","BaseModel":"BaseModel","delayed":"delayed"}],100:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');
var BaseController = require('BaseController');
var TemplatesCard = require('./card.js');
var TemplatesCard_ChangePassword = BaseController.create('TemplatesCard_ChangePassword', TemplatesCard);

TemplatesCard_ChangePassword.prototype.addListeners = function () {
	TemplatesCard.prototype.addListeners.call(this);
	this.addHookListener('change-password', 'click', this.submitForm);
};

TemplatesCard_ChangePassword.prototype.validateForm = function () {
	if (!this.validate()) {
		return this.hasError();
	}

	BaseModel.instance('Login').getAuthChallenge({
		success: this.changePassword,
		error: function(error) {
			this.genericError(error);
		},
		context: this
	});
};

TemplatesCard_ChangePassword.prototype.changePassword = function (encrypt) {
	BaseModel.instance('WebClient').changePassword({
		email: this.hook('username').value,
		oldpassword: encrypt(this.hook('current-password').value),
		newpassword: encrypt(this.hook('password').value)
	}, {
		success: function () {
			this.changeCard({
				data: {
					well: {
						'title': __('generic.success'),
						'text': __('change-password.success-message'),
						'type': 'success',
						'class_name': ['is-visible']
					}
				}
			});
		},
		error: function(error) {
			this.genericError(error);
		},
		context: this
	});
};

TemplatesCard_ChangePassword.prototype.helper = function () {
	return {
		'hook': this.createHook('form'),
		'content': [
			{
				'mod': ['default'],
				'component': BaseController.new('organisms-card-header', {
					'heading': __('change-password.heading'),
					'subtitle': '',
					well: this.data.well
				})
			},
			{
				'mod': ['form'],
				'component': BaseController.new('molecules-input~validatable', {
					'input': {
						'type': 'text',
						'name': 'username',
						'hook': this.createHook('username')
					},
					'label': {
						'text': BaseModel.instance('Server').getData('c_accounts_policies_login_loginsettings') ? __('generic.email') : __('generic.username')
					},
					'rules': [
						{
							'name': 'empty',
							'message': __('validation.empty')
						}
					]
				})
			},
			{
				'mod': ['form'],
				'component': BaseController.new('molecules-input~password', {
					'input': {
						'hook': this.createHook('current-password'),
						'name': 'current-password'
					},
					'label': {
						'text': __('generic.password-current')
					},
					'addon': BaseController.new('atoms-addon~show'),
					'rules': [
						{
							'name': 'empty',
							'message': __('validation.empty')
						}
					]
				})
			},
			{
				'mod': ['form'],
				'component': BaseController.new('molecules-input~password-with-policy', {
					'input': {
						'hook': this.createHook('password'),
						'name': 'new-password'
					},
					'label': {
						'text': __('generic.password-new')
					},
					'addon': BaseController.new('atoms-addon~show')
				})
			},
			{
				'mod': ['form'],
				'component': BaseController.new('molecules-input~password', {
					'input': {
						'name': 'confirm-password'
					},
					'label': {
						'text': __('generic.password-confirm')
					},
					'addon': BaseController.new('atoms-addon~show'),
					'rules': [
						{
							'name': 'empty',
							'message': __('validation.empty')
						},
						{
							'name': 'same',
							'controller': this,
							'parent_hook': 'form',
							'counterpart_hook': 'password',
							'message': __('validation.passwords-no-match')
						}
					]
				})
			},
			{
				'mod': ['default'],
				'component': [
					BaseController.new('molecules-button', {
						'mod': ['block', 'primary'],
						'button': {
							'text': __('generic.save-password'),
							'hook': this.createHook('change-password'),
							'name': 'change-password'
						}
					}),
					BaseController.new('atoms-link~contact-admin')
				].filter(Boolean)
			},
			{
				'mod': ['default'],
				'component': BaseController.new('atoms-info~have-account')
			}
		].filter(Boolean)
	};
};

module.exports = TemplatesCard_ChangePassword;

},{"./card.js":99,"BaseController":"BaseController","BaseModel":"BaseModel"}],101:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');
var BaseController = require('BaseController');
var TemplatesCard = require('./card.js');
var Hash = require('@icewarp/hash');
var TemplatesCard_ChooseAccount = BaseController.create('TemplatesCard_ChooseAccount', TemplatesCard);

TemplatesCard_ChooseAccount.prototype.addListeners = function () {
	TemplatesCard.prototype.addListeners.call(this);
	this.addHookListener('remove-from-list', 'click', this.removeFromListInit);
	this.addHookListener('remove-from-list-done', 'click', this.removeFromListDone);
	this.addHookListener('switch', 'click', this.chooseAccount);
	this.addHookListener('switch', 'keypress', this.chooseAccountEnter);
	this.addDelegatedDOMListener('.is-removed', 'click', this.removeFromListUndo);
	this.addDelegatedDOMListener('.is-removable', 'click', this.removeFromListRemove);
};

TemplatesCard_ChooseAccount.prototype.chooseAccountEnter = function (event, data) {
	((event.which || event.keyCode) === 13) && this.chooseAccount(event, data);
};

TemplatesCard_ChooseAccount.prototype.chooseAccount = function (event) {
	var Login = BaseModel.instance('Login');
	event.preventDefault();
	if (event.element.classList.contains('is-removable') || event.element.classList.contains('is-removed')) {
		return;
	}
	Login.setData('chosen_account', Login.getUser(this.getInstanceByElement(event.element).data.email));
	this.changeCard({card: 'sign-in-password', hashData: Hash.getParts(), data: {prev: 'choose-account'}});
};

TemplatesCard_ChooseAccount.prototype.removeFromListInit = function () {
	var heading = this.hook('heading');
	this.hook('remove-from-list-section').classList.add('u-hide');
	this.hook('remove-from-list-done-section').classList.add('on-load');
	this.hook('remove-from-list-done-section').classList.remove('u-hide');
	while (heading.firstChild) {
		heading.removeChild(heading.firstChild);
	}
	heading.insertAdjacentHTML('afterbegin', __('choose-account.remove'));
	this.hooks('switch').forEach(function (user) {
		user.classList.add('is-removable');
	});
};

TemplatesCard_ChooseAccount.prototype.removeFromListRemove = function (event) {
	event.stopPropagation();
	event.stopImmediatePropagation();
	this.closestHook('switch', event.target).classList.add('is-removed');
	this.closestHook('switch', event.target).classList.remove('is-removable');
	this.hook('remove-from-list-done').textContent = this.selectAll('[data-hook="switch"].is-removed').length ? __('choose-account.remove-selected') : __('generic.cancel');
};

TemplatesCard_ChooseAccount.prototype.removeFromListUndo = function (event) {
	event.stopPropagation();
	event.stopImmediatePropagation();
	this.closestHook('switch', event.target).classList.add('is-removable');
	this.closestHook('switch', event.target).classList.remove('is-removed');
	this.hook('remove-from-list-done').textContent = this.selectAll('[data-hook="switch"].is-removed').length ? __('choose-account.remove-selected') : __('generic.cancel');
};

TemplatesCard_ChooseAccount.prototype.removeFromListDone = function (event) {
	var heading = this.hook('heading');
	event.preventDefault();
	this.hook('remove-from-list-section').classList.add('on-load');
	this.hook('remove-from-list-section').classList.remove('u-hide');
	while (heading.firstChild) {
		heading.removeChild(heading.firstChild);
	}
	heading.insertAdjacentHTML('afterbegin', __('choose-account.heading'));
	this.hook('remove-from-list-done-section').classList.add('u-hide');
	this.selectAll('[data-hook="switch"].is-removed').forEach(function (user) {
		var user_controller = this.getInstanceByElement(user);
		BaseModel.instance('Login').removeUser({email: user_controller.data.email});
		user_controller.remove();
	}, this);
	this.selectAll('[data-hook="switch"].is-removable').forEach(function (user) {
		user.classList.remove('is-removable');
	});
	if (!BaseModel.instance('Login').getUsers().length) {
		this.changeCard({card: 'sign-in'});
	}
};

TemplatesCard_ChooseAccount.prototype.helper = function () {
	var WebClient = BaseModel.instance('WebClient');

	return {
		autoselect: this.data.autoselect === void 0 ? true : this.data.autoselect,
		'hook': this.createHook('form'),
		'content': [
			{
				'mod': ['default'],
				'component': BaseController.new('organisms-card-header', {
					'heading': __('choose-account.heading'),
					'hook': this.createHook('heading'),
					'avatar': false,
					'subtitle': false,
					well: this.data.well
				})
			},
			{
				'mod': ['form'],
				'component': BaseModel.instance('Login').getUsers().map(function (user) {
					return BaseController.new('atoms-switch', user);
				})
			},
			{
				'mod': ['default'],
				'hook': this.createHook('remove-from-list-section'),
				'component': [
					BaseController.new('atoms-link~remove-from-list'),
					BaseController.new('atoms-link~contact-admin')
				].filter(Boolean)
			},
			{
				'mod': ['default'],
				'class_name': ['u-hide'],
				'hook': this.createHook('remove-from-list-done-section'),
				'component': BaseController.new('molecules-button', {
					'mod': ['block', 'primary'],
					'button': {
						'hook': this.createHook('remove-from-list-done'),
						'text': __('generic.cancel'),
						'name': 'done'
					}
				})
			},
			{
				'mod': ['default'],
				'component': BaseController.new('atoms-link~sign-with-another-acc')
			},
			WebClient.getData('restrictions').getValue('show_search') ? {
				'mod': ['form'],
				'component': BaseController.new('molecules-input~search', {
					'input': {
						'name': 'search'
					},
					'label': {
						'text': __('generic.search')
					}
				})
			} : false
		].filter(Boolean)
	};
};

module.exports = TemplatesCard_ChooseAccount;

},{"./card.js":99,"@icewarp/hash":156,"BaseController":"BaseController","BaseModel":"BaseModel"}],102:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var TemplatesCard_GenericMessage = require('./card~generic-message.js');
var TemplatesCard_ConfirmPersonality = BaseController.create('TemplatesCard_ConfirmPersonality', TemplatesCard_GenericMessage);
var Hash = require('@icewarp/hash');

TemplatesCard_ConfirmPersonality.prototype.addListeners = function () {
	TemplatesCard_GenericMessage.prototype.addListeners.call(this);
};

TemplatesCard_ConfirmPersonality.prototype.afterRender = function () {
	TemplatesCard_GenericMessage.prototype.afterRender.call(this);

	!this.hasResponse && this.callCommunication('confirmPersonality', {
		user: Hash.getParts().user,
		email: Hash.getParts().email,
		hash: Hash.getParts().hash
	});
};

TemplatesCard_ConfirmPersonality.prototype.helper = function () {
	this.data.title = __('confirm-personality.heading');
	this.data.subtitle = this.data.subtitle === void 0 ? {
		text: __('confirm-personality.subheading')
	} : this.data.subtitle;
	this.data.loading = this.data.loading === void 0 ? true : this.data.loading;
	this.data.type = this.data.type || 'none';
	return TemplatesCard_GenericMessage.prototype.helper.call(this);
};

module.exports = TemplatesCard_ConfirmPersonality;

},{"./card~generic-message.js":107,"@icewarp/hash":156,"BaseController":"BaseController"}],103:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');
var BaseController = require('BaseController');
var TemplatesCard = require('./card.js');
var TemplatesCard_ContactAdmin = BaseController.create('TemplatesCard_ContactAdmin', TemplatesCard);

TemplatesCard_ContactAdmin.prototype.addListeners = function () {
	TemplatesCard.prototype.addListeners.call(this);
	this.addHookListener('validate-form', 'click', this.submitForm);
	this.addHookListener('validate-form', 'keypress', this.textareaKeypress);
};

TemplatesCard_ContactAdmin.prototype.validateForm = function () {
	var data;
	if (!this.validate()) {
		return this.hasError();
	}
	data = this.hook('describe-problem').value;
	if (BaseModel.instance('WebClient').getData('restrictions').getValue('support_require_number')) {
		data += '\n\n' + __('personal.mobile-phone') + ': ' + this.hook('tel').value;
	}
	BaseModel.instance('WebClient').contactAdministrator({
		email: this.hook('email-address').value,
		data: data,
		captcha: {
			uid: this.getChildren('molecules-captcha')[0].uid,
			value: this.hook('captcha').value.toUpperCase()
		}
	}, {
		success: function () {
			this.changeCard({
				card: 'generic-message',
				data: {
					type: 'success',
					well: {
						text: __('contact-admin.success-message')
					},
					link: ''
				},
				change_hash: false
			});
		},
		error: function(error) {
			this.genericError(error);
		},
		context: this
	});
};

TemplatesCard_ContactAdmin.prototype.textareaKeypress = function (event) {
	(event.ctrlKey || event.metaKey) && ~[10, 13].indexOf(event.which || event.keyCode) && this.submitForm(event);
};

TemplatesCard_ContactAdmin.prototype.helper = function () {
	var WebClient = BaseModel.instance('WebClient');

	return {
		'hook': this.createHook('form'),
		'content': [
			{
				mod: ['default'],
				'component': BaseController.new('organisms-card-header', {
					'heading': __('contact-admin.heading'),
					'subtitle': false,
					well: this.data.well
				})
			},
			{
				'mod': ['form'],
				'component': BaseController.new('molecules-input~validatable', {
					'input': {
						'hook': this.createHook('email-address'),
						'type': 'email',
						'name': 'email-address',
						'value': BaseModel.instance('Login').getData('chosen_account').email
					},
					'label': {
						'text': __('generic.email')
					},
					'rules': [
						{
							'name': 'empty',
							'message': __('validation.empty')
						},
						{
							'name': 'email',
							'message': __('validation.email')
						}
					],
					'tooltip': {
						'well': {
							'text': [
								__('contact-admin.email-helper')
							],
							'type': 'primary'
						}
					}
				})
			},
			BaseModel.instance('WebClient').getData('restrictions').getValue('support_require_number') && {
				'mod': ['form'],
				'component': BaseController.new('molecules-input~validatable', {
					'input': {
						'hook': this.createHook('tel'),
						'type': 'tel',
						'name': 'tel'
					},
					'label': {
						'text': __('personal.mobile-phone')
					},
					'rules': [
						{
							'name': 'empty',
							'message': __('validation.empty')
						}
					],
					'tooltip': {
						'well': {
							'text': [
								__('contact-admin.tel')
							],
							'type': 'primary'
						}
					}
				})
			},
			{
				'mod': ['form'],
				'component': BaseController.new('molecules-textarea~validatable', {
					'textarea': {
						'hook': this.createHook('describe-problem'),
						'name': 'describe-problem'
					},
					'label': {
						'text': __('contact-admin.describe-problem')
					},
					'rules': [
						{
							'name': 'empty',
							'message': __('validation.empty')
						}
					]
				})
			},
			{
				'mod': ['form'],
				'component': BaseController.new('molecules-captcha')
			},
			{
				'mod': ['form'],
				'component': BaseController.new('molecules-input~validatable', {
					'input': {
						'hook': this.createHook('captcha'),
						'type': 'text',
						'name': 'security-code',
						'maxlength': 6,
						'minlength': 6
					},
					'label': {
						'text': __('generic.security-code')
					},
					'rules': [
						{
							'name': 'empty',
							'message': __('validation.empty')
						},
						{
							'name': 'length',
							'data': 6,
							'message': __('validation.length', 6)
						}
					]
				})
			},
			{
				'mod': ['default'],
				'component': [
					BaseController.new('molecules-button', {
						'mod': ['block', 'primary'],
						'button': {
							'hook': this.createHook('validate-form'),
							'text': __('contact-admin.submit'),
							'name': 'send-message'
						}
					}),
					BaseController.new('atoms-link~back')
				]
			},
			{
				'mod': ['default'],
				'component': BaseController.new('atoms-info~have-account')
			},
			WebClient.getData('restrictions').getValue('show_search') ? {
				'mod': ['form'],
				'component': BaseController.new('molecules-input~search', {
					'input': {
						'name': 'search'
					},
					'label': {
						'text': __('generic.search')
					}
				})
			} : false
		].filter(Boolean)
	};
};

module.exports = TemplatesCard_ContactAdmin;

},{"./card.js":99,"BaseController":"BaseController","BaseModel":"BaseModel"}],104:[function(require,module,exports){
"use strict";
var punycode = require('punycode');
var BaseModel = require('BaseModel');
var BaseController = require('BaseController');
var TemplatesCard = require('./card.js');
var TemplatesCard_CreateAccount = BaseController.create('TemplatesCard_CreateAccount', TemplatesCard);

TemplatesCard_CreateAccount.prototype.addListeners = function () {
	TemplatesCard.prototype.addListeners.call(this);
	this.addHookListener('save-credentials', 'click', this.submitForm);
};

TemplatesCard_CreateAccount.prototype.validateForm = function () {
	var Login = BaseModel.instance('Login');
	var WebClient = BaseModel.instance('WebClient');
	if (!this.validate()) {
		return this.hasError();
	}

	Login.setData('chosen_account', {
		name: this.hook('full-name').value,
		email: this.hook('username').value + '@' + punycode.toUnicode(this.hook('select').value),
		avatar_token: false
	});
	Login.setData('create_account', {
		domain: this.hook('select').value,
		username: this.hook('username').value,
		fullname: this.hook('full-name').value,
		alternativeemail: this.hook('alternate-email').value,
		card : {}
	});
	this.changeCard({card: WebClient.getData('custom_login_fields').enabledCustomFields().length || WebClient.getData('custom_login_fields').getValue('login_verification_enabled') ? 'personal' : 'set-password'});
};

TemplatesCard_CreateAccount.prototype.helper = function () {
	var WebClient = BaseModel.instance('WebClient');
	var Login = BaseModel.instance('Login');

	var signup_domains = WebClient.getData('signup_domains').map(function (domain) {
		return {
			value: domain.getData('value'),
			text: punycode.toUnicode(domain.getData('value')),
			selected: Login.getData('create_account').domain === domain.getData('value')
		};
	}).sort(function (a, b) {
		return b.value > a.value ? -1 : a.value > b.value;
	});

	return {
		'hook': this.createHook('form'),
		'content': [
			{
				'mod': ['default'],
				'component': BaseController.new('organisms-card-header', {
					'heading': __('create-account.heading'),
					'avatar': false,
					'subtitle': false,
					well: this.data.well
				})
			},
			{
				'mod': ['form'],
				'component': BaseController.new('molecules-input~validatable', {
					'input': {
						'type': 'text',
						'hook': this.createHook('username'),
						'name': 'username',
						'value': Login.getData('create_account').username
					},
					'label': {
						'text': __('generic.username')
					},
					'rules': [
						{
							'name': 'empty',
							'message': __('validation.empty')
						}
					]
				})
			},
			{
				'mod': ['form'],
				'component': BaseController.new('molecules-select', {
					'select': {
						'hook': this.createHook('select'),
						'name': 'select',
						'options': signup_domains
					},
					'label': {
						'text': __('create-account.domain')
					},
					'rules': [
						{
							'name': 'empty',
							'message': __('validation.empty')
						}
					]
				})
			},
			{
				'mod': ['form'],
				'component': BaseController.new('molecules-input~validatable', {
					'input': {
						'type': 'text',
						'hook': this.createHook('full-name'),
						'name': 'full-name',
						'value': Login.getData('create_account').fullname
					},
					'label': {
						'text': __('create-account.full-name')
					},
					'rules': [
						{
							'name': 'empty',
							'message': __('validation.empty')
						}
					]
				})
			},
			{
				'mod': ['form'],
				'component': BaseController.new('molecules-input~validatable', {
					'input': {
						'type': 'email',
						'hook': this.createHook('alternate-email'),
						'name': 'alternate-email',
						'value': Login.getData('create_account').alternativeemail
					},
					'label': {
						'text': __('create-account.alternative-email')
					},
					'rules': [
						{
							'name': 'empty',
							'message': __('validation.empty')
						},
						{
							'name': 'email',
							'message': __('validation.email')
						}
					]
				})
			},
			{
				'mod': ['default'],
				'component': [
					BaseController.new('molecules-button', {
						'mod': ['block', 'primary'],
						'button': {
							'hook': this.createHook('save-credentials'),
							'text': WebClient.getData('custom_login_fields').enabledCustomFields().length ? __('create-account.next-step') : __('create-account.last-step'),
							'name': 'next'
						}
					}),
					BaseController.new('atoms-link~contact-admin')
				].filter(Boolean)
			},
			{
				'mod': ['default'],
				'component': BaseController.new('atoms-info~have-account')
			}
		].filter(Boolean)
	};
};

module.exports = TemplatesCard_CreateAccount;

},{"./card.js":99,"BaseController":"BaseController","BaseModel":"BaseModel","punycode":175}],105:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');
var BaseController = require('BaseController');
var TemplatesCard = require('./card.js');
var TemplatesCard_ForgotPassword = BaseController.create('TemplatesCard_ForgotPassword', TemplatesCard);

TemplatesCard_ForgotPassword.prototype.addListeners = function () {
	TemplatesCard.prototype.addListeners.call(this);
	this.addHookListener('send-message', 'click', this.submitForm);
};

TemplatesCard_ForgotPassword.prototype.validateForm = function () {
	if (!this.validate()) {
		return this.hasError();
	}
	BaseModel.instance('WebClient').resetPasswordEmail({
		email: BaseModel.instance('Login').getData('chosen_account').email,
		captcharequest: {
			uid: this.getChildren('molecules-captcha')[0].uid,
			value: this.hook('captcha').value.toUpperCase()
		}
	}, {
		success: function (response) {
			this.changeCard({
				card: 'generic-message',
				data: {
					type: 'success',
					well: {
						text: __('forgot-password.success-message' + (response * 1 === 2 ? '-guest' : ''))
					},
					link: ''
				},
				change_hash: false
			});
		},
		error: function (error) {
			switch (error) {
				case 'account_alternative_email':
					this.changeCard({
						card: 'contact-admin',
						data: {
							well: {
								'title': __('generic.error'),
								'text': __('error.' + error),
								'type': 'error',
								'class_name': ['is-visible']
							}
						}
					});
					break;
				default:
					this.genericError.apply(this, arguments);
			}
		},
		context: this
	});
};

TemplatesCard_ForgotPassword.prototype.helper = function () {
	return {
		'hook': this.createHook('form'),
		'content': [
			{
				'mod': ['default'],
				'component': BaseController.new('organisms-card-header', {
					'heading': __('forgot-password.heading'),
					well: this.data.well
				})
			},
			{
				'mod': ['form'],
				'component': BaseController.new('molecules-captcha')
			},
			{
				'mod': ['form'],
				'component': BaseController.new('molecules-input~validatable', {
					'input': {
						'hook': this.createHook('captcha'),
						'type': 'text',
						'name': 'security-code',
						'maxlength': 6,
						'minlength': 6
					},
					'label': {
						'text': __('generic.security-code')
					},
					'rules': [
						{
							'name': 'empty',
							'message': __('validation.empty')
						},
						{
							'name': 'length',
							'data': 6,
							'message': __('validation.length', 6)
						}
					]
				})
			},
			{
				'mod': ['default'],
				'component': [
					BaseController.new('molecules-button', {
						'mod': ['block', 'primary'],
						'button': {
							'hook': this.createHook('send-message'),
							'text': __('forgot-password.submit'),
							'name': 'send-message'
						}
					}),
					BaseController.new('atoms-link~contact-admin')
				].filter(Boolean)
			},
			{
				'mod': ['default'],
				'component': BaseController.new('atoms-info~not-you')
			}
		].filter(Boolean)
	};
};

module.exports = TemplatesCard_ForgotPassword;

},{"./card.js":99,"BaseController":"BaseController","BaseModel":"BaseModel"}],106:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');
var BaseController = require('BaseController');
var TemplatesCard = require('./card.js');
var TemplatesCard_GatewayLogin = BaseController.create('TemplatesCard_GatewayLogin', TemplatesCard);

TemplatesCard_GatewayLogin.prototype.addListeners = function () {
	TemplatesCard.prototype.addListeners.call(this);
	this.addHookListener('gateway-sign-in', 'click', this.validateForm);
};

TemplatesCard_GatewayLogin.prototype.validateForm = function () {
	if (!this.validate()) {
		return this.hasError();
	}
	BaseModel.instance('WebClient').sendGatewayAuthentication({
		email: this.hook('email').value,
		captcharequest: {
			uid: this.getChildren('molecules-captcha')[0].uid,
			value: this.hook('captcha').value.toUpperCase()
		}
	}, {
		success: function () {
			this.changeCard({
				card: 'generic-message',
				data: {
					type: 'success',
					well: {
						text: __('gateway-login.success-message')
					},
					link: ''
				},
				change_hash: false
			});
		},
		error: function(error) {
			this.genericError(error);
		},
		context: this
	});
};

TemplatesCard_GatewayLogin.prototype.helper = function () {
	var config = BaseModel.instance('Config').getData('config');
	return {
		'hook': this.createHook('form'),
		'content': [
			{
				'mod': ['default'],
				'component': BaseController.new('organisms-card-header', {
					'heading': __('sign-in-generic.heading.' + config.application),
					'subtitle': {
						text: __('gateway-login.subheading')
					},
					well: this.data.well
				})
			},
			{
				'mod': ['form'],
				'component': BaseController.new('molecules-input~validatable', {
					'input': {
						'type': 'email',
						'name': 'email-address',
						'hook': this.createHook('email')
					},
					'label': {
						'text': __('generic.email')
					},
					'rules': [
						{
							'name': 'empty',
							'message': __('validation.empty')
						},
						{
							'name': 'email',
							'message': __('validation.email')
						}
					].filter(Boolean)
				})
			},
			{
				'mod': ['form'],
				'component': BaseController.new('molecules-captcha')
			},
			{
				'mod': ['form'],
				'component': BaseController.new('molecules-input~validatable', {
					'input': {
						'hook': this.createHook('captcha'),
						'type': 'text',
						'name': 'security-code',
						'maxlength': 6,
						'minlength': 6
					},
					'label': {
						'text': __('generic.security-code')
					},
					'rules': [
						{
							'name': 'empty',
							'message': __('validation.empty')
						},
						{
							'name': 'length',
							'data': 6,
							'message': __('validation.length', 6)
						}
					]
				})
			},
			{
				'mod': ['default'],
				'component': BaseController.new('molecules-button', {
					'mod': ['block', 'primary'],
					'button': {
						'text': __('generic.sign-in'),
						'name': 'gateway-sign-in',
						'hook': this.createHook('gateway-sign-in')
					}
				})
			},
			{
				'mod': ['default'],
				'component': BaseController.new('atoms-link~sign-with-another-acc')
			}
		].filter(Boolean)
	};
};

module.exports = TemplatesCard_GatewayLogin;

},{"./card.js":99,"BaseController":"BaseController","BaseModel":"BaseModel"}],107:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');
var BaseController = require('BaseController');
var TemplatesCard = require('./card.js');
var TemplatesCard_GenericMessage = BaseController.create('TemplatesCard_GenericMessage', TemplatesCard);
var delayed = require('delayed');
var Hash = require('@icewarp/hash');

TemplatesCard_GenericMessage.prototype.addListeners = function () {
	TemplatesCard.prototype.addListeners.call(this);
	this.addDelegatedHookListener('redirect', 'click', this.changeCard, {card: this.data.link});
};

TemplatesCard_GenericMessage.prototype.onCreate = function () {
	this.delayMessage = true;
};

TemplatesCard_GenericMessage.prototype.afterRender = function () {
	var parts = Hash.getParts();
	TemplatesCard.prototype.afterRender.call(this);

	parts.tconly && parts.token && parts.notifyuri && this.callCommunication('logoutTeamChatOnly', parts, BaseModel.instance('Login'));

	delayed(function () {
		this.delayMessage = false;
	}, this, 400, 'delay' + this._mod);
};

TemplatesCard_GenericMessage.prototype.callCommunication = function (method, data, model) {
	(model || BaseModel.instance('WebClient'))[method](data, {
		success: function () {
			this.communicationCallback('success');
		},
		error: function (error) {
			this.communicationCallback('error', error);
		},
		context: this
	});
};

TemplatesCard_GenericMessage.prototype.communicationCallback = function (type, error) {
	this.data.type = type;
	this.data.well = type === 'error' ? {
		text: __('error.' + error, {error: error, md: true})
	} : {
		text: __(this._mod + '.success-message')
	};
	this.data.subtitle = false;
	this.data.link = '';
	this.data.loading = false;
	this.hasResponse = true;
	Hash.change(false, false, true);
	if (this.delayMessage) {
		delayed(function () {
			this.rerender();
		}, this, 400, 'rerender' + this._mod);
	} else {
		this.rerender();
	}
};

TemplatesCard_GenericMessage.prototype.helper = function () {
	var contact_admin_link = BaseController.new('atoms-link~contact-admin', {
		'class_name': ['u-float-center']
	});

	if (this.data.well) {
		this.data.well.type = this.data.type;
		this.data.well.class_name = this.data.class_name || [];
		this.data.well.class_name.push('is-visible');
	}

	return {
		'content': [
			{
				'mod': ['default', 'no-border'],
				'component': BaseController.new('organisms-card-header~message', {
					'mod': this.data.type,
					'card-icon': function () {
						switch (this.data.type) {
							case 'success':
								return BaseController.new('atoms-icons', {
									'icon': 'success'
								});
							case 'error':
								return BaseController.new('atoms-icons', {
									'icon': 'error'
								});
							case 'none':
								return false;
							default:
								return BaseController.new('atoms-icons', {
									'icon': 'information'
								});
						}
					}.call(this),
					'heading': this.data.title === void 0 ? __('generic.' + this.data.type) : this.data.title,
					'subtitle': this.data.subtitle,
					'well': this.data.well
				})
			},
			this.data.loading ? {
				'mod': ['default', 'no-border'],
				'component': BaseController.new('atoms-loader', {
					'mod': ['large']
				})
			} : false,
			this.data.link !== void 0 ? {
				'mod': ['default', 'no-border'],
				'component': BaseController.new('molecules-button', {
					'mod': ['block', 'primary'],
					'button': {
						'text': __('generic.understand'),
						'name': 'redirect',
						'hook': this.createHook('redirect')
					}
				})
			} : false,
			this.data.footer !== void 0 ? this.data.footer : (contact_admin_link ? {
				'mod': ['default'],
				'component': contact_admin_link
			} : false)
		].filter(Boolean)
	};
};

module.exports = TemplatesCard_GenericMessage;

},{"./card.js":99,"@icewarp/hash":156,"BaseController":"BaseController","BaseModel":"BaseModel","delayed":"delayed"}],108:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');
var BaseController = require('BaseController');
var TemplatesCard_GenericMessage = require('./card~generic-message.js');
var TemplatesCard_GuestVerify = BaseController.create('TemplatesCard_GuestVerify', TemplatesCard_GenericMessage);
var Hash = require('@icewarp/hash');

TemplatesCard_GuestVerify.prototype.addListeners = function () {
	TemplatesCard_GenericMessage.prototype.addListeners.call(this);
};

TemplatesCard_GuestVerify.prototype.afterRender = function () {
	BaseModel.instance('Login').setData('guestLogin', true);
	TemplatesCard_GenericMessage.prototype.afterRender.call(this);

	!this.hasResponse && this.callCommunication('guestVerify', {
		email: Hash.getParts().email,
		hash: Hash.getParts().hash
	});
};

TemplatesCard_GuestVerify.prototype.helper = function () {
	this.data.title = __('guest-verify.heading');
	this.data.subtitle = this.data.subtitle === void 0 ? {
		text: __('guest-verify.subheading')
	} : this.data.subtitle;
	this.data.loading = this.data.loading === void 0 ? true : this.data.loading;
	this.data.type = this.data.type || 'none';
	return TemplatesCard_GenericMessage.prototype.helper.call(this);
};

module.exports = TemplatesCard_GuestVerify;

},{"./card~generic-message.js":107,"@icewarp/hash":156,"BaseController":"BaseController","BaseModel":"BaseModel"}],109:[function(require,module,exports){
"use strict";
var Hash = require('@icewarp/hash');
var BaseModel = require('BaseModel');
var BaseController = require('BaseController');
var TemplatesCard = require('./card.js');
var TemplatesCard_Unavailable = require('./card~unavailable');
var TemplatesCard_OauthGrant = BaseController.create(
	'TemplatesCard_OauthGrant',
	TemplatesCard
);

TemplatesCard_OauthGrant.prototype.addListeners = function () {
	TemplatesCard.prototype.addListeners.call(this);
	this.addHookListener('accept', 'click', this.accept);
	this.addHookListener('decline', 'click', this.decline);
};

TemplatesCard_OauthGrant.prototype.accept = function () {
	var OAuth = BaseModel.instance('OAuth');
	OAuth.GrantOauthAuthorization(this.hook('description').value, {
		success: function () {
			window.location.replace(OAuth.getRedirectURL());
		},
		error: function (error) {
			this.genericError(error);
		},
		context: this,
	});
};
TemplatesCard_OauthGrant.prototype.decline = function () {
	window.location.replace(
		'/oauth/v2/code?auth_id=' + Hash.getParts().auth_id
	);
};

TemplatesCard_OauthGrant.prototype.helperDataBuilder = function () {
	var OAuth = BaseModel.instance('OAuth');
	var account_data = OAuth.getData('account_data');
	var image = account_data.A_Image;

	var client = {
		client: OAuth.getData('name'),
	};

	return {
		hook: this.createHook('form'),
		content: [
			{
				mod: ['default'],
				component: BaseController.new('organisms-card-header', {
					heading: __('sign-in-generic.heading.oauth', client),
					well: {
						title: __('oauth.grant_title', client),
						text: OAuth.getData('scopes').map(function (scope) {
							return '- ' + __('oauth.'+scope) + '\n';
						}) + __('oauth.info', client),
						class_name: ['is-visible'],
					},
					avatar: {
						image: image && image.url,
						letter: !image && account_data.A_Name[0][0],
					},
				}),
			},
			{
				mod: ['form'],
				component: BaseController.new('molecules-input', {
					input: {
						type: 'text',
						name: 'description',
						hook: this.createHook('description'),
					},
					label: {
						text: __('oauth.description'),
					},
				}),
			},
			{
				mod: ['default'],
				component: [
					BaseController.new('molecules-button', {
						mod: ['block', 'primary', 'flex'],
						button: {
							hook: this.createHook('accept'),
							text: __('generic.authorize'),
							name: 'next',
						},
					}),
					BaseController.new('molecules-button', {
						mod: ['block', 'flex', 'error'],
						button: {
							hook: this.createHook('decline'),
							text: __('generic.decline'),
							name: 'next',
						},
					}),
				].filter(Boolean),
			},
		].filter(Boolean),
	};
};

TemplatesCard_OauthGrant.prototype.helper = function () {
	var OAuth = BaseModel.instance('OAuth');
	var account_data = OAuth.getData('account_data');
	var controller_this = this;
	if (!account_data) {
		return new Promise(function (resolve) {
			OAuth.initAlreadyLoggedIn({
				success: function () {
					resolve(controller_this.helperDataBuilder());
				},
				error: function (error) {
					controller_this.data.title = error;
					resolve(
						TemplatesCard_Unavailable.prototype.helper.call(
							controller_this
						)
					);
				},
				context: this,
			});
		});
	}
	return this.helperDataBuilder();
};

module.exports = TemplatesCard_OauthGrant;

},{"./card.js":99,"./card~unavailable":122,"@icewarp/hash":156,"BaseController":"BaseController","BaseModel":"BaseModel"}],110:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');
var BaseController = require('BaseController');
var TemplatesCard = require('./card.js');
var TemplatesCard_Personal = BaseController.create('TemplatesCard_Personal', TemplatesCard);

TemplatesCard_Personal.prototype.addListeners = function () {
	TemplatesCard.prototype.addListeners.call(this);
	this.addHookListener('save-personal', 'click', this.submitForm);
};

TemplatesCard_Personal.prototype.validateForm = function () {
	var Login = BaseModel.instance('Login');
	var WebClient = BaseModel.instance('WebClient');
	var CLF = WebClient.getData('custom_login_fields');
	var sms_verification = CLF.getValue('login_verification_type') === 'sms';
	var create_account = Login.getData('create_account');
	var selector;

	if (!this.validate()) {
		return this.hasError();
	}

	CLF.enabledCustomFields().map(function (field) {
		create_account.card[this.hook(field.name).getAttribute('name')] = this.hook(field.name).value;
	}, this);

	create_account.card.classname = 'taccountcard';
	Login.setData('create_account', create_account);

	if (!WebClient.getData('custom_login_fields').getValue('login_verification_enabled')) {
		return this.changeCard({card: 'set-password'});
	}

	selector = sms_verification ? create_account.card.mobiletelephonenumber : create_account.alternativeemail;
	Login.getVerification({
		verificationtype: +sms_verification,
		verificationselector: selector,
		captcharequest: {
			uid: this.getChildren('molecules-captcha')[0].uid,
			value: this.hook('captcha').value.toUpperCase()
		}
	}, {
		success: function () {
			this.changeCard({
				card: 'set-password',
				data: {
					well: {
						'title': __('generic.success'),
						'text': __('set-password.code_sent_to', {to: selector}),
						'type': 'success',
						'class_name': ['is-visible']
					}
				}
			});
		},
		error: function(error) {
			this.genericError(error);
		},
		context: this
	});

};

TemplatesCard_Personal.prototype.customFieldsHelper = function () {
	var Login = BaseModel.instance('Login');
	var WebClient = BaseModel.instance('WebClient');

	return WebClient.getData('custom_login_fields').enabledCustomFields().map(function (custom_field) {
		switch (custom_field.type) {
			case 'select':
				return {
					'mod': ['form'],
					'component': BaseController.new('molecules-select~validatable', {
						'select': {
							'hook': this.createHook(custom_field.name),
							'name': custom_field.name,
							'options': custom_field.options.map(function (option) {
								option.selected = Login.getData('create_account').card[custom_field.name] == option.value;
								return option;
							})
						},
						'label': {
							'text': custom_field.label
						},
						'rules': WebClient.getData('custom_login_fields').getValue(custom_field.id + '_required') ? [
							{
								'name': 'empty',
								'message': __('validation.empty')
							}
						] : false
					})
				};
			default:
				return {
					'mod': ['form'],
					'component': BaseController.new('molecules-input~validatable', {
						'input': {
							'type': custom_field.type || 'text',
							'hook': this.createHook(custom_field.name),
							'name': custom_field.name,
							'value': Login.getData('create_account').card[custom_field.name],
							'maxDate': custom_field.maxDate
						},
						'label': {
							'text': custom_field.label
						},
						'rules': (WebClient.getData('custom_login_fields').getValue(custom_field.id + '_required') || (custom_field.id === 'mobile_phone' && WebClient.getData('custom_login_fields').getValue('login_verification_enabled') && (WebClient.getData('custom_login_fields').getValue('login_verification_type') === 'sms'))) ? [
							{
								'name': 'empty',
								'message': __('validation.empty')
							}
						] : false
					})
				};
		}
	}, this);
};

TemplatesCard_Personal.prototype.helper = function () {
	var WebClient = BaseModel.instance('WebClient');

	return {
		'hook': this.createHook('form'),
		'content': [
			{
				'mod': ['default'],
				'component': BaseController.new('organisms-card-header', {
					'heading': __('personal.heading'),
					'avatar': false,
					'subtitle': false,
					well: this.data.well
				})
			}
		].concat(this.customFieldsHelper(), WebClient.getData('custom_login_fields').getValue('login_verification_enabled') ? {
			'mod': ['form'],
			'component': BaseController.new('molecules-captcha')
		} : false, WebClient.getData('custom_login_fields').getValue('login_verification_enabled') ? {
			'mod': ['form'],
			'component': BaseController.new('molecules-input~validatable', {
				'input': {
					'hook': this.createHook('captcha'),
					'type': 'text',
					'name': 'security-code',
					'maxlength': 6,
					'minlength': 6
				},
				'label': {
					'text': __('generic.security-code')
				},
				'rules': [
					{
						'name': 'empty',
						'message': __('validation.empty')
					},
					{
						'name': 'length',
						'data': 6,
						'message': __('validation.length', 6)
					}
				]
			})
		} : false, {
			'mod': ['default'],
			'component': [
				BaseController.new('molecules-button', {
					'mod': ['block', 'primary'],
					'button': {
						'hook': this.createHook('save-personal'),
						'text': __('create-account.last-step'),
						'name': 'next'
					}
				}),
				BaseController.new('atoms-link~back'),
				BaseController.new('atoms-link~contact-admin')
			].filter(Boolean)
		}, {
			'mod': ['default'],
			'component': BaseController.new('atoms-info~have-account')
		}).filter(Boolean)
	};
};

module.exports = TemplatesCard_Personal;

},{"./card.js":99,"BaseController":"BaseController","BaseModel":"BaseModel"}],111:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');
var BaseController = require('BaseController');
var TemplatesCard = require('./card.js');
var TemplatesCard_ResetPassword = BaseController.create('TemplatesCard_ResetPassword', TemplatesCard);
var Hash = require('@icewarp/hash');

TemplatesCard_ResetPassword.prototype.addListeners = function () {
	TemplatesCard.prototype.addListeners.call(this);
	this.addHookListener('confirm', 'click', this.submitForm);
};

TemplatesCard_ResetPassword.prototype.validateForm = function () {
	if (!this.validate()) {
		return this.hasError();
	}
	BaseModel.instance('Login').getAuthChallenge({
		success: this.resetPassword,
		error: function(error) {
			this.genericError(error);
		},
		context: this
	});
};

TemplatesCard_ResetPassword.prototype.resetPassword = function (encrypt) {
	BaseModel.instance('WebClient').resetPassword({
		newpassword: encrypt(this.hook('password').value)
	}, {
		success: function () {
			this.changeCard({
				card: 'generic-message',
				data: {
					type: 'success',
					well: {
						text: __('reset-password.success-message')
					},
					link: ''
				},
				change_hash: false
			});
		},
		error: function(error) {
			this.genericError(error);
		},
		context: this
	});
};

TemplatesCard_ResetPassword.prototype.helper = function () {
	var Login = BaseModel.instance('Login');
	Login.setData('chosen_account', Login.getUser(Hash.getParts().user) || {});

	return {
		'hook': this.createHook('form'),
		'content': [
			{
				'mod': ['default'],
				'component': BaseController.new('organisms-card-header', {
					'heading': __('reset-password.heading'),
					well: this.data.well
				})
			},
			{
				'class_name': ['u-hide'],
				'component': BaseController.new('molecules-input', {
					'input': {
						'type': 'text',
						'name': 'username',
						'hook': this.createHook('username'),
						'value': (Hash.getParts().user || '').replace(/@.*/, '')
					}
				})
			},
			{
				'mod': ['form'],
				'component': BaseController.new('molecules-input~password-with-policy', {
					'input': {
						'name': 'password',
						'hook': this.createHook('password')
					},
					'label': {
						'text': __('generic.password-new')
					},
					'addon': BaseController.new('atoms-addon~show')
				})
			},
			{
				'mod': ['form'],
				'component': BaseController.new('molecules-input~password', {
					'input': {
						'name': 'confirm-password'
					},
					'label': {
						'text': __('generic.password-confirm')
					},
					'addon': BaseController.new('atoms-addon~show'),
					'rules': [
						{
							'name': 'empty',
							'message': __('validation.empty')
						},
						{
							'name': 'same',
							'controller': this,
							'parent_hook': 'form',
							'counterpart_hook': 'password',
							'message': __('validation.passwords-no-match')
						}
					]
				})
			},
			{
				'mod': ['default'],
				'component': [
					BaseController.new('molecules-button', {
						'mod': ['block', 'primary'],
						'button': {
							'text': __('generic.save-password'),
							'hook': this.createHook('confirm'),
							'name': 'confirm'
						}
					}),
					BaseController.new('atoms-link~contact-admin')
				].filter(Boolean)
			},
			{
				'mod': ['default'],
				'component': BaseController.new('atoms-info~not-you')
			}
		].filter(Boolean)
	};
};

module.exports = TemplatesCard_ResetPassword;

},{"./card.js":99,"@icewarp/hash":156,"BaseController":"BaseController","BaseModel":"BaseModel"}],112:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');
var BaseController = require('BaseController');
var TemplatesCard = require('./card.js');
var TemplatesCard_SetPassword = BaseController.create('TemplatesCard_SetPassword', TemplatesCard);

TemplatesCard_SetPassword.prototype.addListeners = function () {
	TemplatesCard.prototype.addListeners.call(this);
	this.addHookListener('create-account', 'click', this.submitForm);
	this.addHookListener('password', 'change', this.crossValidatePasswordCheck);
	this.addHookListener('password-check', 'change', this.crossValidatePassword);
};

TemplatesCard_SetPassword.prototype.validateForm = function () {
	var WebClient = BaseModel.instance('WebClient');
	var Login = BaseModel.instance('Login');

	if (!this.validate()) {
		return this.hasError();
	}

	Login.getData('create_account').password = this.hook('password').value;

	if (WebClient.getData('custom_login_fields').getValue('login_verification_enabled')) {
		Login.getData('create_account').verificationrequest.code = this.hook('verification_code').value;
	} else {
		Login.getData('create_account').captcharequest = {
			uid: this.getChildren('molecules-captcha')[0].uid,
			value: this.hook('captcha').value.toUpperCase()
		};
	}

	Login.getAuthChallenge({
		success: this.signupAccount,
		error: function(error) {
			this.genericError(error);
		},
		context: this
	});
};

TemplatesCard_SetPassword.prototype.signupAccount = function (encrypt) {
	BaseModel.instance('WebClient').signupAccount(encrypt, {
		success: function () {
			this.changeCard({
				data: {
					well: {
						'title': __('generic.success'),
						'text': __('set-password.success-message'),
						'type': 'success',
						'class_name': ['is-visible']
					}
				}
			});
		},
		error: function(error) {
			this.genericError(error);
		},
		context: this
	});
};

TemplatesCard_SetPassword.prototype.crossValidatePasswordCheck = function () {
	this.hook('password-check').value.trim().length && this.getInstanceByElement(this.hook('password2')).validate();
};
TemplatesCard_SetPassword.prototype.crossValidatePassword = function () {
	this.hook('password').value.trim().length && this.getInstanceByElement(this.hook('password1')).validate();
};

TemplatesCard_SetPassword.prototype.helper = function () {
	var WebClient = BaseModel.instance('WebClient');

	return {
		'hook': this.createHook('form'),
		'content': [
			{
				'mod': ['default'],
				'component': BaseController.new('organisms-card-header', {
					'heading': __('set-password.heading'),
					well: this.data.well
				})
			},
			{
				'mod': ['form'],
				'component': BaseController.new('molecules-input~password-with-policy', {
					'hook': this.createHook('password1'),
					'input': {
						'name': 'password',
						'hook': this.createHook('password')
					},
					'label': {
						'text': __('generic.password')
					},
					'addon': BaseController.new('atoms-addon~show')
				})
			},
			{
				'mod': ['form'],
				'component': BaseController.new('molecules-input~password', {
					'hook': this.createHook('password2'),
					'input': {
						'name': 'password-check',
						'hook': this.createHook('password-check')
					},
					'label': {
						'text': __('generic.password-confirm')
					},
					'rules': [
						{
							'name': 'empty',
							'message': __('validation.empty')
						},
						{
							'name': 'same',
							'controller': this,
							'parent_hook': 'form',
							'counterpart_hook': 'password',
							'message': __('validation.passwords-no-match')
						}
					],
					'addon': BaseController.new('atoms-addon~show')
				})
			},
			WebClient.getData('custom_login_fields').getValue('login_verification_enabled') ? {
				'mod': ['form'],
				'component': BaseController.new('molecules-input~validatable', {
					'input': {
						'hook': this.createHook('verification_code'),
						'type': 'text',
						'name': 'verification_code',
						'maxlength': 6,
						'minlength': 6
					},
					'label': {
						'text': __('set-password.verification_code')
					},
					'rules': [
						{
							'name': 'empty',
							'message': __('validation.empty')
						},
						{
							'name': 'length',
							'data': 6,
							'message': __('validation.length', 6)
						}
					]
				})
			} : {
				'mod': ['form'],
				'component': BaseController.new('molecules-captcha')
			},
			WebClient.getData('custom_login_fields').getValue('login_verification_enabled') ? false : {
				'mod': ['form'],
				'component': BaseController.new('molecules-input~validatable', {
					'input': {
						'hook': this.createHook('captcha'),
						'type': 'text',
						'name': 'security-code',
						'maxlength': 6,
						'minlength': 6
					},
					'label': {
						'text': __('generic.security-code')
					},
					'rules': [
						{
							'name': 'empty',
							'message': __('validation.empty')
						},
						{
							'name': 'length',
							'data': 6,
							'message': __('validation.length', 6)
						}
					]
				})
			},
			{
				'mod': ['default'],
				'component': [
					BaseController.new('molecules-button', {
						'mod': ['block', 'primary'],
						'button': {
							'text': __('set-password.submit'),
							'hook': this.createHook('create-account'),
							'name': 'create-account'
						}
					}),
					BaseController.new('atoms-link~back'),
					BaseController.new('atoms-link~contact-admin')
				].filter(Boolean)
			},
			{
				'mod': ['default'],
				'component': BaseController.new('atoms-info~have-account')
			}
		].filter(Boolean)
	};
};

module.exports = TemplatesCard_SetPassword;

},{"./card.js":99,"BaseController":"BaseController","BaseModel":"BaseModel"}],113:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');
var BaseController = require('BaseController');
var TemplatesCard = require('./card.js');
var TemplatesCard_SignInPassword = BaseController.create('TemplatesCard_SignInPassword', TemplatesCard);
var QueryParams = require('@icewarp/query-params');
var MobileDetect = require('mobile-detect');
var Hash = require('@icewarp/hash');

TemplatesCard_SignInPassword.prototype.loginOauth = function (password) {
	var Login = BaseModel.instance('Login');
	var OAuth = BaseModel.instance('OAuth');
	OAuth.login(Login.getData('chosen_account').email, password, Login.getData('useRSA'), {
		success: function () {
			this.changeCard({
				card: 'oauth-grant',
				hashData: Hash.getParts()
			});
		},
		error: function (error) {
			this.genericError(error);
		},
		context: this
	});
};

TemplatesCard_SignInPassword.prototype.loginApp = function (response) {
	var WebClient = BaseModel.instance('WebClient');
	var Login = BaseModel.instance('Login');
	var i, ctz;
	var params = QueryParams.parse();
	var hash_parts = Hash.getParts();
	var user_interface = this.getUserInterface();

	this.submitted = true;
	for (i in hash_parts) {
		params[i] = hash_parts[i];
	}
	params.atoken = response.authtoken;
	params.language = WebClient.getData('layout_settings').getUserLanguageCode();
	params.remember = this.getPersistentLoginValue();
	ctz = (new Date()).getTimezoneOffset();
	params.ctz = ctz ? -ctz : 0;
	this.hook('username').value = Login.getData('chosen_account').email;
	document.location.href = document.location.protocol + '//' + location.host + (location.pathname + (user_interface ? '/' + user_interface : '') + '/?' + QueryParams.stringify(params)).replace(/\/\//g, '/') + document.location.hash;
};

TemplatesCard_SignInPassword.prototype.loginError = function (error, response) {
	var phone;

	if (!isNaN(response.query.error)) {
		phone = +response.query.error;
	}
	if (error === 'auth_two_factor_required' || phone) {
		return this.changeCard({
			card: 'two-factor',
			hashData: Hash.getParts(),
			data: {
				password: this.hook('password').value,
				persistentLogin: this.getPersistentLoginValue(),
				user_interface: this.getUserInterface(),
				well: {
					title: __('two_step.heading'),
					text: __('two_step.subheading' + (phone ? '-phone' : ''), {
						phone: phone
					}),
					type: 'info',
					class_name: ['is-visible']
				}
			}
		});
	}
	this.genericError(error);
};

TemplatesCard_SignInPassword.prototype.getPersistentLoginValue = function () {
	var WebClient = BaseModel.instance('WebClient');
	return (Hash.getParts().auth_id || Hash.getParts().conference || WebClient.getData('restrictions').getValue('disable_remember')) ? 0 : +this.hook('persistentlogin').checked;
};

TemplatesCard_SignInPassword.prototype.getUserInterface = function () {
	var user_interface = this.hook('user_interface') && this.hook('user_interface').value;
	var isIE9 = document.all && !window.atob;
	if (isIE9) {
		user_interface = 'basic';
	}
	return user_interface;
};

TemplatesCard_SignInPassword.prototype.addListeners = function () {
	TemplatesCard.prototype.addListeners.call(this);
	this.addDelegatedHookListener('forgot-password', 'click', this.changeCard, {
		card: 'forgot-password'
	});
	this.addHookListener('validate-password', 'click', this.submitForm);
};

TemplatesCard_SignInPassword.prototype.validateForm = function () {
	if (!this.validate()) {
		return this.hasError();
	}

	BaseModel.instance('Login').getAuthChallenge({
		success: this.authenticate,
		error: function (error) {
			this.genericError(error);
		},
		context: this
	});
};

TemplatesCard_SignInPassword.prototype.authenticate = function (encrypt) {
	var password = encrypt(this.hook('password').value);
	var WebClient = BaseModel.instance('WebClient');
	var Login = BaseModel.instance('Login');

	if (Hash.getParts().conference || Hash.getParts().auth_id) {
		return this.loginOauth(password);
	}

	WebClient.getAuthToken({
		email: Login.getData('chosen_account').email,
		password: password,
		persistentlogin: this.getPersistentLoginValue()
	}, {
		success: this.loginApp,
		error: this.loginError,
		context: this
	});
};

TemplatesCard_SignInPassword.prototype.helper = function () {
	var config = BaseModel.instance('Config').getData('config');
	var WebClient = BaseModel.instance('WebClient');
	var Login = BaseModel.instance('Login');

	var md = new MobileDetect(window.navigator.userAgent);
	return {
		hook: this.createHook('form'),
		content: [
			{
				mod: ['default'],
				component: BaseController.new('organisms-card-header', {
					heading: __('sign-in-generic.heading.' + config.application),
					subtitle: Hash.getParts().conference && {
						hook: this.createHook('subtitle'),
						text: Hash.getParts().conference
					},
					well: this.data.well
				})
			},
			{
				class_name: ['u-hide'],
				component: BaseController.new('molecules-input', {
					input: {
						type: 'text',
						name: 'username',
						hook: this.createHook('username'),
						value: Login.getData('chosen_account').email,
						autocomplete: 'username'
					}
				})
			},
			{
				mod: ['form'],
				component: BaseController.new('molecules-input~password', {
					input: {
						name: 'password',
						hook: this.createHook('password'),
						maxlength: 240
					},
					label: {
						text: __('generic.password')
					},
					rules: [{
						name: 'empty',
						message: __('validation.empty')
					},
					{
						name: 'min_length',
						data: 1,
						message: __('validation.min_length', 1)
					}
					],
					addon: WebClient.getData('reset_settings').getValue('enabled') ? [{
						text: __('sign-in-password.forgot'),
						mod: ['top'],
						hook: this.createHook('forgot-password')
					}] : false
				})
			},
			{
				mod: ['default'],
				component: [
					BaseController.new('molecules-button', {
						mod: ['block', 'primary'],
						button: {
							hook: this.createHook('validate-password'),
							text: __('generic.sign-in'),
							name: 'next'
						}
					}),
					(Hash.getParts().auth_id || Hash.getParts().conference || WebClient.getData('restrictions').getValue('disable_remember')) ? false : BaseController.new('molecules-checkbox', {
						label: __('sign-in-password.remember'),
						input: {
							name: 'remember-me',
							hook: this.createHook('persistentlogin')
						}
					}),
					BaseController.new('atoms-link~contact-admin')
				].filter(Boolean)
			},
			(config.application === 'webclient' && (md.mobile() || QueryParams.parse().mobile)) ? {
				mod: ['form'],
				component: BaseController.new('molecules-select', {
					select: {
						name: 'user_interface',
						hook: this.createHook('user_interface'),
						options: [{
							selected: md.tablet() && md.mobileGrade() === 'A',
							text: __('interface.desktop')
						},
						{
							selected: md.tablet() && md.mobileGrade() !== 'A',
							text: __('interface.tablet'),
							value: 'basic'
						},
						{
							selected: md.phone(),
							text: __('interface.phone'),
							value: 'pda'
						}
						]
					},
					label: {
						text: __('interface.label')
					}
				})
			} : false,
			{
				mod: ['default'],
				component: BaseController.new('atoms-info~not-you')
			},
			WebClient.getData('restrictions').getValue('show_search') ? {
				mod: ['form'],
				component: BaseController.new('molecules-input~search', {
					input: {
						name: 'search'
					},
					label: {
						text: __('generic.search')
					}
				})
			} : false
		].filter(Boolean)
	};

};

module.exports = TemplatesCard_SignInPassword;

},{"./card.js":99,"@icewarp/hash":156,"@icewarp/query-params":166,"BaseController":"BaseController","BaseModel":"BaseModel","mobile-detect":194}],114:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');
var BaseController = require('BaseController');
var TemplatesCard = require('./card.js');
var TemplatesCard_SignIn = BaseController.create('TemplatesCard_SignIn', TemplatesCard);
var Hash = require('@icewarp/hash');
TemplatesCard_SignIn.prototype.addListeners = function () {
	TemplatesCard.prototype.addListeners.call(this);
	this.addHookListener('validate-email', 'click', this.submitForm);
};

TemplatesCard_SignIn.prototype.validateForm = function () {
	if (!this.validate()) {
		return this.hasError();
	}
	BaseModel.instance('Login').setData('chosen_account', {
		email: this.hook('email').value.toLowerCase()
	});
	this.changeCard({card: 'sign-in-password', hashData: Hash.getParts()});
};

TemplatesCard_SignIn.prototype.helper = function () {
	var config = BaseModel.instance('Config').getData('config');
	var WebClient = BaseModel.instance('WebClient');
	var Server = BaseModel.instance('Server');
	var Login = BaseModel.instance('Login');

	return {
		'hook': this.createHook('form'),
		'content': [
			{
				'mod': ['default'],
				'component': BaseController.new('organisms-card-header', {
					'heading': __('sign-in-generic.heading.' + config.application),
					'subtitle': false,
					'avatar': false,
					well: this.data.well
				})
			},
			{
				'mod': ['form'],
				'component': BaseController.new('molecules-input~validatable', {
					'input': {
						'type': 'email',
						'name': 'email-address',
						'hook': this.createHook('email'),
						'value': Login.getData('chosen_account').email || Hash.getParts().email || Hash.getParts().username
					},
					'label': {
						'text': (+Server.getData('c_accounts_policies_login_loginsettings') || Login.getData('guestLogin')) ? __('generic.email') : __('generic.username')
					},
					'rules': [
						{
							'name': 'empty',
							'message': __('validation.empty')
						},
						+Server.getData('c_accounts_policies_login_loginsettings') ? {
							'name': 'email',
							'message': __('validation.email')
						} : false
					].filter(Boolean)
				})
			},
			{
				'mod': ['default'],
				'component': [
					BaseController.new('molecules-button', {
						'mod': ['block', 'primary'],
						'button': {
							'hook': this.createHook('validate-email'),
							'text': __('generic.next'),
							'name': 'next'
						}
					}),
					BaseController.new('atoms-link~contact-admin')
				].filter(Boolean)
			},
			(WebClient.getData('restrictions').getValue('disable_signup') || WebClient.getData('restrictions').getValue('disable_signup_ip')) ? false : {
				'mod': ['default'],
				'component': BaseController.new('atoms-info~dont-have-account')
			},
			WebClient.getData('restrictions').getValue('show_search') ? {
				'mod': ['form'],
				'component': BaseController.new('molecules-input~search', {
					'input': {
						'name': 'search'
					},
					'label': {
						'text': __('generic.search')
					}
				})
			} : false
		].filter(Boolean)
	};

};

module.exports = TemplatesCard_SignIn;

},{"./card.js":99,"@icewarp/hash":156,"BaseController":"BaseController","BaseModel":"BaseModel"}],115:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var TemplatesCard = require('./card.js');
var TemplatesCard_TcActions = BaseController.create('TemplatesCard_TcActions', TemplatesCard);
var Hash = require('@icewarp/hash');

TemplatesCard_TcActions.prototype.addListeners = function () {
	var hash_data = Hash.getParts();
	TemplatesCard.prototype.addListeners.call(this);
	this.addHookListener('next', 'click', this.changeCard, {card: hash_data.return || 'tc-join', hashData: hash_data});
	this.addHookListener('skip', 'click', this.changeCard, {card: hash_data.return || 'tc-join', hashData: hash_data});
};

TemplatesCard_TcActions.prototype.helper = function () {
	return {
		'content': [
			{
				'mod': ['default', 'no-border'],
				'component': BaseController.new('organisms-card-header', {
					'mod': ['no-border'],
					'card-icon': BaseController.new('atoms-icons', {
						'icon': 'teamchat'
					}),
					'heading': __('tc-actions.heading'),
					'subtitle': {
						'text': __('tc-actions.subheading')
					},
					well: this.data.well
				})
			},
			{
				'mod': ['default', 'no-border', 'no-padding'],
				'component': BaseController.new('AtomsImage', {
					'class_name': ['u-margin-auto'],
					'src': './images/teamchat/actions.png'
				})
			},
			{
				'mod': ['default', 'no-border'],
				'component': [
					BaseController.new('molecules-button', {
						'mod': ['primary', 'inverted', 'flex'],
						'button': {
							'text': __('generic.skip'),
							'name': 'skip',
							'hook': this.createHook('skip')
						}
					}),
					BaseController.new('molecules-button', {
						'mod': ['primary', 'flex'],
						'button': {
							'text': __('generic.next'),
							'name': 'next',
							'hook': this.createHook('next')
						}
					})
				]
			}
		].filter(Boolean)
	};
};

module.exports = TemplatesCard_TcActions;

},{"./card.js":99,"@icewarp/hash":156,"BaseController":"BaseController"}],116:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var TemplatesCard = require('./card.js');
var TemplatesCard_TcCheckEmail = BaseController.create('TemplatesCard_TcCheckEmail', TemplatesCard);
var Hash = require('@icewarp/hash');

TemplatesCard_TcCheckEmail.prototype.addListeners = function () {
	TemplatesCard.prototype.addListeners.call(this);
	this.addHookListener('what-is-teamchat', 'click', this.changeCard, {card: 'tc-collaboration', hashData: Hash.getParts(), keepHashData: true});
};

TemplatesCard_TcCheckEmail.prototype.helper = function () {
	var contact_admin_link = BaseController.new('atoms-link~contact-admin', {
		'class_name': ['u-float-center']
	});
	return {
		'content': [
			{
				'mod': ['default', 'no-border'],
				'component': BaseController.new('organisms-card-header', {
					'card-icon': BaseController.new('atoms-icons', {
						'icon': 'teamchat'
					}),
					'heading': __('tc-check-email.heading'),
					'subtitle': {
						'text': __('tc-check-email.subheading', {'md': true, room: this.data.room || (Hash.getParts().room || '').replace(/\+/g, ' ')})
					},
					'well': this.data.well
				})
			},
			contact_admin_link ? {
				'mod': ['default', 'no-border'],
				'component': [contact_admin_link]
			} : false,
			{
				'mod': ['default'],
				'component': BaseController.new('atoms-link~what-is-teamchat')
			}
		].filter(Boolean)
	};
};

module.exports = TemplatesCard_TcCheckEmail;

},{"./card.js":99,"@icewarp/hash":156,"BaseController":"BaseController"}],117:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var TemplatesCard = require('./card.js');
var TemplatesCard_TcCollaboration = BaseController.create('TemplatesCard_TcCollaboration', TemplatesCard);
var Hash = require('@icewarp/hash');

TemplatesCard_TcCollaboration.prototype.addListeners = function () {
	var hash_data = Hash.getParts();
	TemplatesCard.prototype.addListeners.call(this);
	this.addHookListener('next', 'click', this.changeCard, {card: 'tc-share', hashData: hash_data});
	this.addHookListener('skip', 'click', this.changeCard, {card: hash_data.return || 'tc-join', hashData: hash_data});
};

TemplatesCard_TcCollaboration.prototype.helper = function () {
	return {
		'content': [
			{
				'mod': ['default', 'no-border'],
				'component': BaseController.new('organisms-card-header', {
					'mod': ['no-border'],
					'card-icon': BaseController.new('atoms-icons', {
						'icon': 'teamchat'
					}),
					'heading': __('tc-collaboration.heading'),
					'subtitle': {
						'text': __('tc-collaboration.subheading')
					},
					well: this.data.well
				})
			},
			{
				'mod': ['default', 'no-border', 'no-padding'],
				'component': BaseController.new('AtomsImage', {
					'class_name': ['u-margin-auto'],
					'src': './images/teamchat/collaboration.png'
				})
			},
			{
				'mod': ['default', 'no-border'],
				'component': [
					BaseController.new('molecules-button', {
						'mod': ['primary', 'inverted', 'flex'],
						'button': {
							'text': __('generic.skip'),
							'name': 'skip',
							'hook': this.createHook('skip')
						}
					}),
					BaseController.new('molecules-button', {
						'mod': ['primary', 'flex'],
						'button': {
							'text': __('generic.next'),
							'name': 'next',
							'hook': this.createHook('next')
						}
					})
				]
			}
		].filter(Boolean)
	};
};

module.exports = TemplatesCard_TcCollaboration;

},{"./card.js":99,"@icewarp/hash":156,"BaseController":"BaseController"}],118:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');
var BaseController = require('BaseController');
var TemplatesCard = require('./card.js');
var TemplatesCard_TcJoin = BaseController.create('TemplatesCard_TcJoin', TemplatesCard);
var Hash = require('@icewarp/hash');

TemplatesCard_TcJoin.prototype.addListeners = function () {
	TemplatesCard.prototype.addListeners.call(this);
	this.addHookListener('verify-email', 'click', this.validateForm);
	this.addHookListener('what-is-teamchat', 'click', this.changeCard, {card: 'tc-collaboration', hashData: Hash.getParts(), keepHashData: true});
};

TemplatesCard_TcJoin.prototype.validateForm = function () {
	if (!this.validate()) {
		return this.hasError();
	}
	BaseModel.instance('Login').getAuthChallenge({
		success: this.guestConfirm,
		error: function(error) {
			this.genericError(error);
		},
		context: this
	});
};

TemplatesCard_TcJoin.prototype.guestConfirm = function (encrypt) {
	var hash_parts = Hash.getParts();
	hash_parts.room = (hash_parts.room || '').replace(/\+/g, ' ');
	BaseModel.instance('WebClient').guestConfirm({
		password: encrypt(this.hook('password').value),
		fullname: this.hook('username').value,
		email: hash_parts.email,
		sender: hash_parts.sender,
		hash: hash_parts.hash
	}, {
		success: function () {
			this.changeCard({
				data: {
					well: {
						'title': __('generic.success'),
						'text': __('tc-join.success-message', {'room': hash_parts.room}),
						'type': 'success',
						'class_name': ['is-visible']
					},
					room: hash_parts.room
				},
				card: 'tc-check-email',
				hashData: {
					room: hash_parts.room,
					return: 'tc-check-email'
				}
			});
		},
		error: function(error) {
			this.genericError(error);
		},
		context: this
	});
};

TemplatesCard_TcJoin.prototype.helper = function () {
	var hash_parts = Hash.getParts();
	hash_parts.room = (hash_parts.room || '').replace(/\+/g, ' ');
	return {
		'hook': this.createHook('form'),
		'content': [
			{
				'mod': ['default'],
				'component': BaseController.new('organisms-card-header', {
					'card-icon': BaseController.new('atoms-icons', {
						'icon': 'teamchat'
					}),
					'heading': __('tc-join.heading'),
					'subtitle': {
						'text': __('tc-join.subheading', {'name': hash_parts.sendername || hash_parts.sender, 'room': hash_parts.room, 'md': true})
					},
					well: this.data.well
				})
			},
			{
				'mod': ['form'],
				'component': BaseController.new('molecules-input~validatable', {
					'input': {
						'type': 'text',
						'name': 'username',
						'hook': this.createHook('username')
					},
					'label': {
						'text': __('tc-join.username')
					},
					'rules': [
						{
							'name': 'empty',
							'message': __('validation.empty')
						}
					],
					'tooltip': {
						'well': {
							'title': __('tc-join.username-helper'),
							'type': 'primary'
						}
					}
				})
			},
			{
				'mod': ['form'],
				'component': BaseController.new('molecules-input~password-with-policy', {
					'input': {
						'name': 'password',
						'hook': this.createHook('password')
					},
					'label': {
						'text': __('generic.password-new')
					},
					'addon': BaseController.new('atoms-addon~show')
				})
			},
			{
				'mod': ['form'],
				'component': BaseController.new('molecules-input~password', {
					'input': {
						'name': 'confirm-password'
					},
					'label': {
						'text': __('generic.password-confirm')
					},
					'addon': BaseController.new('atoms-addon~show'),
					'rules': [
						{
							'name': 'empty',
							'message': __('validation.empty')
						},
						{
							'name': 'same',
							'controller': this,
							'parent_hook': 'form',
							'counterpart_hook': 'password',
							'message': __('validation.passwords-no-match')
						}
					]
				})
			},
			{
				'mod': ['default'],
				'component': BaseController.new('molecules-button', {
					'mod': ['block', 'primary'],
					'button': {
						'text': __('tc-join.submit'),
						'name': 'verify-email',
						'hook': this.createHook('verify-email')
					}
				})
			},
			{
				'mod': ['default'],
				'component': BaseController.new('atoms-link~what-is-teamchat')
			}
		].filter(Boolean)
	};
};

module.exports = TemplatesCard_TcJoin;

},{"./card.js":99,"@icewarp/hash":156,"BaseController":"BaseController","BaseModel":"BaseModel"}],119:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var TemplatesCard = require('./card.js');
var TemplatesCard_TcShare = BaseController.create('TemplatesCard_TcShare', TemplatesCard);
var Hash = require('@icewarp/hash');

TemplatesCard_TcShare.prototype.addListeners = function () {
	var hash_data = Hash.getParts();
	TemplatesCard.prototype.addListeners.call(this);
	this.addHookListener('next', 'click', this.changeCard, {card: 'tc-actions', hashData: hash_data});
	this.addHookListener('skip', 'click', this.changeCard, {card: hash_data.return || 'tc-join', hashData: hash_data});
};

TemplatesCard_TcShare.prototype.helper = function () {
	return {
		'content': [
			{
				'mod': ['default', 'no-border'],
				'component': BaseController.new('organisms-card-header', {
					'mod': ['no-border'],
					'card-icon': BaseController.new('atoms-icons', {
						'icon': 'teamchat'
					}),
					'heading': __('tc-share.heading'),
					'subtitle': {
						'text': __('tc-share.subheading')
					},
					well: this.data.well
				})
			},
			{
				'mod': ['default', 'no-border', 'no-padding'],
				'component': BaseController.new('AtomsImage', {
					'class_name': ['u-margin-auto'],
					'src': './images/teamchat/share.png'
				})
			},
			{
				'mod': ['default', 'no-border'],
				'component': [
					BaseController.new('molecules-button', {
						'mod': ['primary', 'inverted', 'flex'],
						'button': {
							'text': __('generic.skip'),
							'name': 'skip',
							'hook': this.createHook('skip')
						}
					}),
					BaseController.new('molecules-button', {
						'mod': ['primary', 'flex'],
						'button': {
							'text': __('generic.next'),
							'name': 'next',
							'hook': this.createHook('next')
						}
					})
				]
			}
		].filter(Boolean)
	};
};

module.exports = TemplatesCard_TcShare;

},{"./card.js":99,"@icewarp/hash":156,"BaseController":"BaseController"}],120:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var TemplatesCard = require('./card.js');
var TemplatesCard_TouchId = BaseController.create('TemplatesCard_TouchId', TemplatesCard);

TemplatesCard_TouchId.prototype.addListeners = function () {
	TemplatesCard.prototype.addListeners.call(this);
};

TemplatesCard_TouchId.prototype.helper = function () {
	return {
		'content': [
			{
				'mod': ['default'],
				'component': BaseController.new('organisms-card-header', {
					'heading': __('tc-touch-id.heading'),
					'well': this.data.well
				})
			},
			{
				'mod': ['default'],
				'component': [
					{
						'_name': 'atoms-touch-id'
					},
					BaseController.new('atoms-link~contact-admin')
				].filter(Boolean)
			},
			{
				'mod': ['default'],
				'component': BaseController.new('atoms-link', {
					'text': __('tc-touch-id.use-password'),
					'mod': ['switch'],
					'class_name': ['u-align-center']
				})
			}
		].filter(Boolean)
	};
};

module.exports = TemplatesCard_TouchId;

},{"./card.js":99,"BaseController":"BaseController"}],121:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');
var BaseController = require('BaseController');
var TemplatesCard_SignInPassword = require('./card~sign-in-password');
var TemplatesCard_TwoFactor = BaseController.create('TemplatesCard_TwoFactor', TemplatesCard_SignInPassword);
var QueryParams = require('@icewarp/query-params');
var MobileDetect = require('mobile-detect');
var Hash = require('@icewarp/hash');

TemplatesCard_TwoFactor.prototype.addListeners = function () {
	TemplatesCard_SignInPassword.prototype.addListeners.call(this);
	this.addHookListener('validate-totp', 'click', this.submitForm);
};

TemplatesCard_TwoFactor.prototype.authenticate = function (encrypt) {
	var password = encrypt(this.data.password);
	var WebClient = BaseModel.instance('WebClient');
	var Login = BaseModel.instance('Login');

	if (Hash.getParts().conference || Hash.getParts().auth_id) {
		return this.loginOauth(password);
	}

	WebClient.getAuthToken({
		email: Login.getData('chosen_account').email,
		password: password,
		persistentlogin: this.getPersistentLoginValue.call(this),
		totpcode: this.hook('totpcode').value
	}, {
		success: this.loginApp,
		error: function(error) {
			this.genericError(error);
		},
		context: this
	});
};

TemplatesCard_TwoFactor.prototype.helper = function () {
	var config = BaseModel.instance('Config').getData('config');
	var WebClient = BaseModel.instance('WebClient');
	var Login = BaseModel.instance('Login');

	var md = new MobileDetect(window.navigator.userAgent);
	return {
		password: this.data.password,
		hook: this.createHook('form'),
		content: [
			{
				mod: ['default'],
				component: BaseController.new('organisms-card-header', {
					heading: __('sign-in-generic.heading.' + config.application),
					well: this.data.well
				})
			},
			{
				class_name: ['u-hide'],
				component: BaseController.new('molecules-input', {
					input: {
						type: 'text',
						name: 'username',
						hook: this.createHook('username'),
						value: Login.getData('chosen_account').email
					}
				})
			},
			{
				mod: ['form'],
				component: BaseController.new('molecules-input~validatable', {
					input: {
						name: 'totpcode',
						hook: this.createHook('totpcode'),
						maxlength: 6,
						autocomplete: 'off'
					},
					label: {
						text: __('two_step.verification_code')
					},
					rules: [
						{
							name: 'length',
							data: 6,
							message: __('validation.length', 6)
						}
					]
				})
			},
			{
				mod: ['default'],
				component: [
					BaseController.new('molecules-button', {
						mod: ['block', 'primary'],
						button: {
							hook: this.createHook('validate-totp'),
							text: __('generic.sign-in'),
							name: 'next'
						}
					}),
					WebClient.getData('restrictions').getValue('disable_remember') ? false : BaseController.new('molecules-checkbox', {
						label: __('sign-in-password.remember'),
						input: {
							name: 'remember-me',
							checked: this.data.persistentLogin,
							hook: this.createHook('persistentlogin')
						}
					}),
					BaseController.new('atoms-link~contact-admin')
				].filter(Boolean)
			},
			(config.application === 'webclient' && (md.mobile() || QueryParams.parse().mobile)) && {
				mod: ['form'],
				component: BaseController.new('molecules-select', {
					select: {
						name: 'user_interface',
						hook: this.createHook('user_interface'),
						options: [
							{
								selected: !this.data.user_interface || (md.tablet() && md.mobileGrade() === 'A'),
								text: __('interface.desktop')
							},
							{
								selected: (this.data.user_interface === 'basic') || (md.tablet() && md.mobileGrade() !== 'A'),
								text: __('interface.tablet'),
								value: 'basic'
							},
							{
								selected: (this.data.user_interface === 'pda') || md.phone(),
								text: __('interface.phone'),
								value: 'pda'
							}
						]
					},
					label: {
						text: __('interface.label')
					}
				})
			},
			{
				mod: ['default'],
				component: BaseController.new('atoms-info~not-you')
			},
			WebClient.getData('restrictions').getValue('show_search') && {
				mod: ['form'],
				component: BaseController.new('molecules-input~search', {
					input: {
						name: 'search'
					},
					label: {
						text: __('generic.search')
					}
				})
			}
		].filter(Boolean)
	};

};

module.exports = TemplatesCard_TwoFactor;

},{"./card~sign-in-password":113,"@icewarp/hash":156,"@icewarp/query-params":166,"BaseController":"BaseController","BaseModel":"BaseModel","mobile-detect":194}],122:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var TemplatesCard_GenericMessage = require('./card~generic-message.js');
var TemplatesCard_Unavailable = BaseController.create('TemplatesCard_Unavailable', TemplatesCard_GenericMessage);

TemplatesCard_Unavailable.prototype.addListeners = function () {
	TemplatesCard_GenericMessage.prototype.addListeners.call(this);
};

TemplatesCard_Unavailable.prototype.helper = function () {
	this.data.title = this.data.title || __('error.unavailable');
	this.data.type = this.data.type || 'error';
	this.data.footer = {
		'mod': ['default'],
		'component': BaseController.new('atoms-link~retry', {
			link: this.data.retry_link
		})
	};
	return TemplatesCard_GenericMessage.prototype.helper.call(this);
};

module.exports = TemplatesCard_Unavailable;

},{"./card~generic-message.js":107,"BaseController":"BaseController"}],123:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var Validatable = BaseController.create('Validatable');
var BaseModel = require('BaseModel');
var Validator = BaseModel.instance('Validator');

Validatable.prototype.addListeners = function () {
	this.addDelegatedHookListener('tooltip', 'click', this.showMessage);
};

Validatable.prototype.validate = function (event) {
	var i,
		target = event && event.target ? event.target : this.select('input, textarea, select');
	this.trigger('error-message-hide');
	for (i = 0; i < (this.data.rules || []).length; i++) {
		this.data.rules[i].controller = this;
		if (!Validator[this.data.rules[i].name]) {
			console.error('missing validation', this.data.rules[i].name);
			continue;
		}
		if (!Validator[this.data.rules[i].name](this.data.rules[i], target.value)) {
			this.trigger('validation-error', this.data.rules[i]);
			this.DOMElement.classList.add('has-error');
			return false;
		}
	}
	this.trigger('validation-success', {
		controller: this
	});
	this.DOMElement.classList.remove('has-error');
	return true;
};

Validatable.prototype.showMessage = function () {
	this.trigger('error-message-show', this.data.tooltip.well);
};

module.exports = Validatable;

},{"BaseController":"BaseController","BaseModel":"BaseModel"}],124:[function(require,module,exports){
"use strict";
var BaseController = require('BaseController');
var IndexManager = require('@icewarp/index-manager');

var Window = BaseController.create('Window');

/** 
 * West Bit
 * @type Number
 */
var W = 1;

/** 
 * East bit
 * @type Number
 */
var E = 2;
/** 
 * North bit
 * @type Number
 */
var N = 4;

/** 
 * South bit
 * @type Number
 */
var S = 8;

/**
 * 
 * @param {object} e
 * @returns {undefined}
 */
function dragStart(e) {
	if (this.fullscreen || !this.move_selector) {
		return;
	}
	updateIndex.call(this);
	this.drag_start = {x: e.clientX, y: e.clientY};
	if (this.resize) {
		e.preventDefault();
		this.resizing = true;
		this.start_width = this.DOMElement.offsetWidth;
		this.start_height = this.DOMElement.offsetHeight;
		this.start_top = this.DOMElement.offsetTop;
		this.start_left = this.DOMElement.offsetLeft;
		return;
	}
	if (e.target === this.select(this.move_selector)) {
		e.preventDefault();
		this.moving = true;
	}
}

/**
 * 
 * @param {object} e
 * @returns {undefined}
 */
function stopDrag(e) {
	var coords;
	if (this.moving) {
		coords = calculateCoordinates.call(this, e, true);
		this.x = coords.x;
		this.y = coords.y;
		this.DOMElement.style.transform = 'none';
		this.DOMElement.style.left = this.x + 'px';
		this.DOMElement.style.top = this.y + 'px';
		this.moving = false;
	}
	if (this.resizing) {
		this.resizing = false;
		this.x = this.DOMElement.offsetLeft;
		this.y = this.DOMElement.offsetTop;
	}

}

/**
 * 
 * @param {object} e
 * @returns {undefined}
 */
function move(e) {
	var coords, width, height, top, left;
	if (this.moving) {
		coords = calculateCoordinates.call(this, e);
		(this.DOMElement.style.transform = 'translateX(' + coords.x + 'px' + ') translateY(' + coords.y + 'px' + ') translateZ(0)');
	}
	if (this.resizing) {
		width = getWidth.call(this, e);
		height = getHeight.call(this, e);
		top = getTop.call(this, e);
		left = getLeft.call(this, e);
		width && (this.resize & W || this.resize & E) && (this.DOMElement.style.width = width + 'px');
		height && (this.resize & N || this.resize & S) && (this.DOMElement.style.height = height + 'px');
		height && (this.resize & N) && (this.DOMElement.style.top = top + 'px');
		width && (this.resize & W) && (this.DOMElement.style.left = left + 'px');
	}
}

/**
 * 
 * @param {type} e
 * @returns {undefined}
 */
function resize(e) {
	var dir = 0;
	if (this.resizing) {
		return;
	}
	this.DOMElement.style.cursor = 'auto';
	(Math.abs(e.clientX - this.x) < this.draggable_border) && (dir = dir | W);
	(Math.abs(e.clientX - (this.x + this.DOMElement.offsetWidth)) < this.draggable_border) && (dir = dir | E);
	(Math.abs(e.clientY - this.y) < this.draggable_border) && (dir = dir | N);
	(Math.abs(e.clientY - (this.y + this.DOMElement.offsetHeight)) < this.draggable_border) && (dir = dir | S);
	if (dir & W || dir & E) {
		this.DOMElement.style.cursor = 'ew-resize';
	}
	if (dir & N || dir & S) {
		this.DOMElement.style.cursor = 'ns-resize';
	}
	if ((dir & W && dir & S) || (dir & E && dir & N)) {
		this.DOMElement.style.cursor = 'nesw-resize';
	}
	if ((dir & E && dir & S) || (dir & W && dir & N)) {
		this.DOMElement.style.cursor = 'nwse-resize';
	}
	this.resize = dir;
}

/**
 * 
 * @param {object} e
 * @param {boolean} fixed
 * @returns {nm$_window.Window.prototype.calculateCoordinates.windowAnonym$0}
 */
function calculateCoordinates(e, fixed) {
	var x_diff = e.clientX - this.drag_start.x;
	var y_diff = e.clientY - this.drag_start.y;
	var x = x_diff;
	var y = y_diff;
	if ((this.x + x_diff + this.DOMElement.offsetWidth) > document.body.offsetWidth) {
		x = (document.body.offsetWidth - this.DOMElement.offsetWidth - this.x);
	}
	if ((this.x + x_diff) < 0) {
		x = -this.x;
	}
	if ((this.y + y_diff + this.DOMElement.offsetHeight) > document.body.offsetHeight) {
		y = (document.body.offsetHeight - this.DOMElement.offsetHeight - this.y);
	}
	if ((this.y + y_diff) < 0) {
		y = -this.y;
	}
	return {x: fixed ? this.x + x : x, y: fixed ? this.y + y : y};
}
/**
 * 
 * @param {object} e
 * @returns {Number}
 */
function getTop(e) {
	var top = this.start_top + (e.clientY - this.drag_start.y);
	return top > 0 ? top : 0;
}
/**
 * 
 * @param {object} e
 * @returns {Number}
 */
function getLeft(e) {
	var left = this.start_left + (e.clientX - this.drag_start.x);
	return left > 0 ? left : 0;
}
/**
 * 
 * @param {object} e
 * @returns {Number}
 */
function getWidth(e) {
	var width = this.start_width + ((e.clientX - this.drag_start.x) * (this.resize & W ? -1 : 1));
	var space_right = (document.body.offsetWidth - this.DOMElement.offsetLeft);
	var space_left = (this.DOMElement.offsetLeft > 0 ? this.DOMElement.offsetLeft : 0) + this.DOMElement.offsetWidth;
	if (width < this.min_width) {
		return this.min_width;
	}
	if ((document.body.offsetWidth - this.DOMElement.offsetLeft - this.DOMElement.offsetWidth) < 0) {
		return 0;
	}
	return (this.resize & W) ? (width > space_left ? space_left : width) : (width > space_right ? space_right : width);
}
/**
 * 
 * @param {object} e
 * @returns {Number}
 */
function getHeight(e) {
	var height = this.start_height + ((e.clientY - this.drag_start.y) * (this.resize & N ? -1 : 1));
	var space_bottom = (document.body.offsetHeight - this.DOMElement.offsetTop);
	var space_top = (this.DOMElement.offsetTop < 0 ? 0 : this.DOMElement.offsetTop) + this.DOMElement.offsetHeight;
	if (height < this.min_height) {
		return this.min_height;
	}
	if ((space_bottom - this.DOMElement.offsetHeight) < 0 || this.DOMElement.offsetTop < 0) {
		return 0;
	}
	return (this.resize & N) ? (height > space_top ? space_top : height) : (height > space_bottom ? space_bottom : height);
}

/**
 * 
 * @returns {undefined}
 */
function updateIndex() {
	this.DOMElement.style.zIndex = IndexManager.add(this) + 200;
}

/** Generic class_name for floating windows
 * 
 * @returns {Window}
 */
Window.prototype.onCreate = function () {
	/** 
	 * Border for resizing
	 * @type Number
	 */
	this.draggable_border = 0;

	/** 
	 * Selector for moving window
	 * @type String
	 */
	this.move_selector = false;

	/**
	 * 
	 * @type Number
	 */
	this.min_width = 100;

	/**
	 * 
	 * @type Number
	 */
	this.min_height = 100;

	this.drag_start = false;
	this.x = 0;
	this.y = 0;
	this.fullscreen = false;
};

Window.prototype.addListeners = function () {
	if(this.move_selector) {
		this.addDOMListener('', 'mousedown', dragStart.bind(this));
		this.addDOMListener(document, 'mouseup', stopDrag.bind(this));
		this.addDOMListener(document, 'mousemove', move.bind(this));
		this.addDelegatedDOMListener(this.move_selector, 'dblclick', this.toggleFullscreen);
	}
	this.draggable_border && this.addDOMListener('', 'mousemove', resize.bind(this));
};

/** Setup 
 * 
 * @param {object} options
 * @returns {undefined}
 */
Window.prototype.setup = function (options) {
	var i;
	for (i in (options || {})) {
		this[i] = options[i];
	}
};
Window.prototype.toggleFullscreen = function (e) {
	this.beforeFullScreenToggle && this.beforeFullScreenToggle(e);
	if (!this.fullscreen) {
		this.beforeFullScreenOn && this.beforeFullScreenOn(e);
		this.fullscreen = {
			top: this.DOMElement.style.top,
			left: this.DOMElement.style.left,
			width: this.DOMElement.style.width,
			height: this.DOMElement.style.height,
			x: this.x,
			y: this.y
		};
		this.DOMElement.style.top = 0;
		this.DOMElement.style.left = 0;
		this.DOMElement.style.width = this.DOMElement.style.height = '100%';
		this.x = 0;
		this.y = 0;
		this.afterFullScreenOn && this.afterFullScreenOn(e);
	} else {
		this.beforeFullScreenOff(e);
		this.DOMElement.style.top = this.fullscreen.top;
		this.DOMElement.style.left = this.fullscreen.left;
		this.DOMElement.style.width = this.fullscreen.width;
		this.DOMElement.style.height = this.fullscreen.height;
		this.x = this.fullscreen.x;
		this.y = this.fullscreen.y;
		this.fullscreen = false;
		this.afterFullScreenOff && this.afterFullScreenOff(e);
	}
	this.afterFullScreenToggle && this.afterFullScreenToggle(e);
};

/**
 * 
 * @returns {undefined}
 */
Window.prototype.afterRender = function () {
	this.DOMElement.classList.add('o-window');
	this.x = this.DOMElement.offsetLeft;
	this.y = this.DOMElement.offsetTop;
	updateIndex.call(this);
};

module.exports = Window;

},{"@icewarp/index-manager":160,"BaseController":"BaseController"}],125:[function(require,module,exports){
"use strict";
module.exports={'form':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/form.js')},'validatable':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/validatable.js')},'window':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/window.js')},'sites-generic':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/sites/generic.js')},'sites-login':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/sites/login/login.js')},'organisms-bar~footer':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/organisms/bar/bar~footer.js')},'organisms-card-header':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/organisms/card-section/card-header.js')},'organisms-card-header~message':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/organisms/card-section/card-header~message.js')},'organisms-window':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/organisms/window/window.js')},'molecules-button':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/molecules/button/button.js')},'molecules-captcha':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/molecules/captcha/captcha.js')},'molecules-input':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/molecules/input/input.js')},'molecules-input~password-with-policy':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/molecules/input/input~password-with-policy.js')},'molecules-input~password':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/molecules/input/input~password.js')},'molecules-input~search':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/molecules/input/input~search.js')},'molecules-input~validatable':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/molecules/input/input~validatable.js')},'molecules-checkbox':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/molecules/checkbox/checkbox.js')},'molecules-static':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/molecules/static/static.js')},'molecules-textarea':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/molecules/textarea/textarea.js')},'molecules-textarea~validatable':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/molecules/textarea/textarea~validatable.js')},'molecules-select':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/molecules/select/select.js')},'molecules-select~validatable':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/molecules/select/select~validatable.js')},'molecules-language-picker':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/molecules/language-picker/language-picker.js')},'templates-card':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card.js')},'templates-card~change-password':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~change-password.js')},'templates-card~choose-account':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~choose-account.js')},'templates-card~confirm-personality':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~confirm-personality.js')},'templates-card~contact-admin':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~contact-admin.js')},'templates-card~create-account':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~create-account.js')},'templates-card~forgot-password':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~forgot-password.js')},'templates-card~gateway-login':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~gateway-login.js')},'templates-card~generic-message':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~generic-message.js')},'templates-card~oauth-grant':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~oauth-grant.js')},'templates-card~personal':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~personal.js')},'templates-card~guest-verify':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~guest-verify.js')},'templates-card~reset-password':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~reset-password.js')},'templates-card~set-password':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~set-password.js')},'templates-card~sign-in-password':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~sign-in-password.js')},'templates-card~sign-in':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~sign-in.js')},'templates-card~tc-actions':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~tc-actions.js')},'templates-card~tc-check-email':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~tc-check-email.js')},'templates-card~tc-collaboration':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~tc-collaboration.js')},'templates-card~tc-share':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~tc-share.js')},'templates-card~tc-join':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~tc-join.js')},'templates-card~two-factor':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~two-factor.js')},'templates-card~touch-id':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~touch-id.js')},'templates-card~unavailable':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~unavailable.js')},'atoms-ad-adsense':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/ad/ad-adsense.js')},'atoms-ad':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/ad/ad.js')},'atoms-addon':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/addon/addon.js')},'atoms-addon~show':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/addon/addon~show.js')},'atoms-avatar':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/avatar/avatar.js')},'atoms-dropdown':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/dropdown/dropdown.js')},'atoms-element-button':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/form-elements/element-button.js')},'atoms-element-input':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/form-elements/element-input.js')},'atoms-element-input~date':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/form-elements/element-input~date.js')},'atoms-element-select':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/form-elements/element-select.js')},'atoms-element-textarea':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/form-elements/element-textarea.js')},'atoms-info~dont-have-account':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/info/info~dont-have-account.js')},'atoms-info~have-account':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/info/info~have-account.js')},'atoms-info~not-you':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/info/info~not-you.js')},'atoms-link~back':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/link/link~back.js')},'atoms-link~choose-account':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/link/link~choose-account.js')},'atoms-link~check-account':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/link/link~check-account.js')},'atoms-link~create-acc':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/link/link~create-acc.js')},'atoms-link~remove-from-list':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/link/link~remove-from-list.js')},'atoms-link~retry':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/link/link~retry.js')},'atoms-link~contact-admin':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/link/link~contact-admin.js')},'atoms-link~sign-in':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/link/link~sign-in.js')},'atoms-link~sign-with-another-acc':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/link/link~sign-with-another-acc.js')},'atoms-link~what-is-teamchat':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/link/link~what-is-teamchat.js')},'atoms-nametag':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/nametag/nametag.js')},'atoms-switch':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/switch/switch.js')},'atoms-chat-message':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/chat/chat-message.js')},'atoms-well':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/well/well.js')},'atoms-label':function(){return require('C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/label/label.js')}};
},{"C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/ad/ad-adsense.js":49,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/ad/ad.js":50,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/addon/addon.js":51,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/addon/addon~show.js":52,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/avatar/avatar.js":53,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/chat/chat-message.js":54,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/dropdown/dropdown.js":55,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/form-elements/element-button.js":56,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/form-elements/element-input.js":57,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/form-elements/element-input~date.js":58,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/form-elements/element-select.js":59,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/form-elements/element-textarea.js":60,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/info/info~dont-have-account.js":61,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/info/info~have-account.js":62,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/info/info~not-you.js":63,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/label/label.js":64,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/link/link~back.js":65,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/link/link~check-account.js":66,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/link/link~choose-account.js":67,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/link/link~contact-admin.js":68,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/link/link~create-acc.js":69,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/link/link~remove-from-list.js":70,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/link/link~retry.js":71,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/link/link~sign-in.js":72,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/link/link~sign-with-another-acc.js":73,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/link/link~what-is-teamchat.js":74,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/nametag/nametag.js":75,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/switch/switch.js":76,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/atoms/well/well.js":77,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/form.js":78,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/molecules/button/button.js":79,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/molecules/captcha/captcha.js":80,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/molecules/checkbox/checkbox.js":81,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/molecules/input/input.js":82,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/molecules/input/input~password-with-policy.js":83,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/molecules/input/input~password.js":84,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/molecules/input/input~search.js":85,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/molecules/input/input~validatable.js":86,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/molecules/language-picker/language-picker.js":87,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/molecules/select/select.js":88,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/molecules/select/select~validatable.js":89,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/molecules/static/static.js":90,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/molecules/textarea/textarea.js":91,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/molecules/textarea/textarea~validatable.js":92,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/organisms/bar/bar~footer.js":93,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/organisms/card-section/card-header.js":94,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/organisms/card-section/card-header~message.js":95,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/organisms/window/window.js":96,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/sites/generic.js":97,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/sites/login/login.js":98,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card.js":99,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~change-password.js":100,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~choose-account.js":101,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~confirm-personality.js":102,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~contact-admin.js":103,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~create-account.js":104,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~forgot-password.js":105,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~gateway-login.js":106,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~generic-message.js":107,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~guest-verify.js":108,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~oauth-grant.js":109,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~personal.js":110,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~reset-password.js":111,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~set-password.js":112,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~sign-in-password.js":113,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~sign-in.js":114,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~tc-actions.js":115,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~tc-check-email.js":116,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~tc-collaboration.js":117,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~tc-join.js":118,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~tc-share.js":119,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~touch-id.js":120,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~two-factor.js":121,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/templates/card/card~unavailable.js":122,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/validatable.js":123,"C:/BuildAgent/work/e24a4084e6e20918/merged/components/window.js":124}],126:[function(require,module,exports){
module.exports={"calendar":{"day":{"monday":"Monday","tuesday":"Tuesday","wednesday":"Wednesday","thursday":"Thursday","friday":"Friday","saturday":"Saturday","sunday":"Sunday"},"day_short":{"mon":"Mon","tue":"Tue","wed":"Wed","thu":"Thu","fri":"Fri","sat":"Sat","sun":"Sun"},"month":{"january":"January","february":"February","march":"March","april":"April","may":"May","june":"June","july":"July","august":"August","september":"September","october":"October","november":"November","december":"December"},"next_month":"Next month","previous_month":"Previous month"},"default":{"name":"English"},"recurrence":{"all_day":"All day","time":"%{start} %{from} - %{end} %{suffix}","time_samedate":"%{start} %{from} - %{suffix}","secondly":"Repeats every second||||Repeats every %{amount} seconds","minutely":"Repeats every minute %{byhour}||||Repeats every %{amount} minutes %{byhour}","hourly":"Repeats every hour %{byminute}||||Repeats every %{amount} hours %{byminute}","daily":"Repeats every day %{bymonth} %{byhour} %{byminute}||||Repeats every %{amount} days %{bymonth} %{byhour} %{byminute}","daily_workdays":"Repeats every workday","daily_weekends":"Repeats every weekend","weekly":"Repeats every week %{byday}||||Repeats every %{amount} weeks %{byday}","monthly":"Repeats every month %{byday} %{bymonthday}||||Repeats every %{amount} months %{byday} %{bymonthday}","yearly":"Repeats every year %{byday} %{bymonth} %{bymonthday} %{byweekno} %{byyearday}||||Repeats every %{amount} years %{byday} %{bymonth} %{bymonthday} %{byweekno} %{byyearday}","every_day":"every day||||every %{amount} days","sunday":"on Sunday","sunday_1":"on the first Sunday","sunday_2":"on the second Sunday","sunday_3":"on the third Sunday","sunday_4":"on the fourth Sunday","sunday_-1":"on the last Sunday","sunday_n":"on the %{index}th Sunday","sunday_-n":"on the %{index}th last Sunday","monday":"on Monday","monday_1":"on the first Monday","monday_2":"on the second Monday","monday_3":"on the third Monday","monday_4":"on the fourth Monday","monday_-1":"on the last Monday","monday_n":"on the %{index}th Monday","monday_-n":"on the %{index}th last Monday","tuesday":"on Tuesday","tuesday_1":"on the first Tuesday","tuesday_2":"on the second Tuesday","tuesday_3":"on the third Tuesday","tuesday_4":"on the fourth Tuesday","tuesday_-1":"on the last Tuesday","tuesday_n":"on the %{index}th Tuesday","tuesday_-n":"on the %{index}th last Tuesday","wednesday":"on Wednesday","wednesday_1":"on the first Wednesday","wednesday_2":"on the second Wednesday","wednesday_3":"on the third Wednesday","wednesday_4":"on the fourth Wednesday","wednesday_-1":"on the last Wednesday","wednesday_n":"on the %{index}th Wednesday","wednesday_-n":"on the %{index}th last Wednesday","thursday":"on Thursday","thursday_1":"on the first Thursday","thursday_2":"on the second Thursday","thursday_3":"on the third Thursday","thursday_4":"on the fourth Thursday","thursday_-1":"on the last Thursday","thursday_n":"on the %{index}th Thursday","thursday_-n":"on the %{index}th last Thursday","friday":"on Friday","friday_1":"on the first Friday","friday_2":"on the second Friday","friday_3":"on the third Friday","friday_4":"on the fourth Friday","friday_-1":"on the last Friday","friday_n":"on the %{index}th Friday","friday_-n":"on the %{index}th last Friday","saturday":"on Saturday","saturday_1":"on the first Saturday","saturday_2":"on the second Saturday","saturday_3":"on the third Saturday","saturday_4":"on the fourth Saturday","saturday_-1":"on the last Saturday","saturday_n":"on the %{index}th Saturday","saturday_-n":"on the %{index}th last Saturday","workweek":"on the workweek","workweek_1":"on the first workweek","workweek_2":"on the second workweek","workweek_3":"on the third workweek","workweek_4":"on the fourth workweek","workweek_-1":"on the last workweek","workweek_n":"on the %{index}th workweek","workweek_-n":"on the %{index}th last workweek","weekend":"on the weekend","weekend_1":"on the first weekend","weekend_2":"on the second weekend","weekend_3":"on the third weekend","weekend_4":"on the fourth weekend","weekend_-1":"on the last weekend","weekend_n":"on the %{index}th weekend","weekend_-n":"on the %{index}th last weekend","onweekno":"in week %{list}","onmonthday":"on the day %{list} of the month||||on days %{list} of the month","onmonthday_-n":"on the day %{list} from the end of the month||||on days %{list} from the end of the month","onyearday":"on the day %{list} of the year","athour":"at %{list} o'clock","atminute":"at %{list} minutes","until":"until %{date}","repeating":"repeating once||||repeating %{amount} times","month_1":"in January","month_2":"in February","month_3":"in March","month_4":"in April","month_5":"in May","month_6":"in June","month_7":"in July","month_8":"in August","month_9":"in September","month_10":"in October","month_11":"in November","month_12":"in December"},"change-password":{"heading":"Change password","submit":"Change password","success-message":"Password has been changed"},"choose-account":{"heading":"Choose an account","remove":"Edit the list","remove-selected":"Remove selected"},"confirm-personality":{"heading":"Confirm personality","subheading":"Please wait while your account is being verified","success-message":"Your account has been verified"},"contact-admin":{"describe-problem":"Describe your problem","email-helper":"The address which will be used to reply you.","heading":"Contact administrator","submit":"Send message","success-message":"Admin has been notified","tel":"Please leave us here your mobile phone number"},"create-account":{"alternative-email":"Alternative email","domain":"Domain","full-name":"Full name","heading":"Create an account","last-step":"Last step","next-step":"Next step"},"error":{"invalid_login":"Incorrect username or password. Please try again.","expired":"Expired session","connection":"Unable to reach server. Please check your internet connection or contact administrator.","servererror":"Unable to access this service. Please try again later or contact administrator.","overloaded":"The server is currently overloaded. Please try again later or contact administrator.","wc_disabled":"WebClient is disabled.","invalid_rsa":"Unable to create RSA password.","no_db":"Database Connection Error","no_data":"No Data Available","access_error":"Unable to access mailbox folder, please contact administrator.","ip_mismatch":"Your IP has changed, you will be logged out. To prevent this problem in the future, please access WebClient via HTTPS connection.","sso_login_not_allowed":"SSO login not allowed","sso_unable_to_use":"Unable to use SSO","sso_error":"Error when trying to use SSO login","auth_login_invalid":"Invalid login username or password","account_already_exists":"Account already exists","account_alternative_email":"Account has no alternate email address. Please contact admin","account_disabled_1":"Could not login because of IP Restriction","account_disabled_2":"Could not login because account is disabled","account_disabled_3":"Could not login because password is expired","account_disabled_4":"Could not login because account expired","account_disabled_5":"Could not login because of SMTP access mode","account_disabled_6":"Could not login because of POP/IMAP access mode","account_disabled_7":"Could not login because account is IMAP only","account_disabled_8":"Could not login because account is POP3 only","account_disabled_9":"Could not login because account has no access rights to WebClient","account_disabled_10":"Could not login because of access mode","account_disabled_11":"Could not login because login to this domain is disabled","account_disabled_12":"Could not login because domain expired","account_disabled_13":"Could not login because of license","account_invalid":"Account invalid","account_does_not_exist":"Specified account doesn't exist","account_missing_required_property":"Some of the required properties is missing","account_no_password":"Account password is missing or empty","account_no_username":"Account username is missing or empty","account_no_domain":"Domain is missing","account_password_policy":"Password does not match the password policy","account_signup_disabled":"Self sign-up disabled","account_signup_disabled_ip":"Admin has disabled signup from your IP","auth_digest_expired":"Login expired, please login again","auth_two_factor_invalid":"Invalid verification code","auth_webadmin_session_not_found":"Webadmin session not found","captcha_confirmation":"Wrong security code","contact_support_no_admin_email":"Administrator has not set up an email address","db_auto_create":"Cannot auto create the database","db_create_sqlitefile":"Cannot create SQLite DB file","db_create_tables":"Cannot create tables","db_invalid_statement":"Invalid statement type","domain_invalid":"Invalid domain","folder_get_list":"Cannot get the list of folders","folder_open":"Cannot open folder","group_open":"Cannot open group","groupware_authenticate":"Login to GroupWare failed","groupware_db_connection":"GroupWare is unable to connect to database","groupware_timeout":"GroupWare timeout","groupware_upgrade_task":"GroupWare service update procedure is running. Please try again later.","guest_invalid_hash":"Wrong verification hash","gw_init_error":"GroupWare initialization error","language_path_not_found":"Language path not found","language-not-found":"Language file not found","logdir_create":"Cannot create logging directory","login_account_valid":"Invalid account","login_invalid":"Invalid login for user","login_invalid_keypair":"RSA validation failed. Try again.","login_ip_invalid":"Login IP restriction","migration_in_progress":"Migration of account is in progress, please try again later","missing_request_params":"Missing request parameters","no_teamchat_folders":"Unable to login due to missing teamchat folder","password_not_changed":"New password cannot be the same as old password","personality_confirmation_invalid_hashid":"Email address cannot be confirmed: Invalid Hash","personality_confirmation_invalid_user":"Email address cannot be confirmed: Invalid User","reset_disabled":"Reset password has been disabled","reset_password_invalid_hashid":"Invalid hash ID","reset_password_no_hash":"Invalid hash ID","reset_password_uid_file":"UID file doesn't exist","rsa_create_key_pair":"Unable to create RSA key pair","session_cookie_mismatch":"Session cookie mismatch","session_expired":"Session expired","session_ip_mismatch":"Session IP mismatch","session_mismatch":"Session mismatch","session_no_user":"Session user object cannot be retrieved","settings_user_set":"Cannot load user settings","setting_file_corrupted":"Webmail server settings are corrupted. Please, contact the administrator.","signup_verification_failed_sms":"Unable to send SMS verification","signup_verification_failed_email":"Unable to send email verification","signup_verification_not_initialized":"Verification not initialized","signup_verification_failed":"Verification failed","storage_get_dom":"Unable to load setting file","unavailable":"Temporary unavailable","unspecified":"Server returned an error **%{error}**","user_settings_global":"Unable to load settings","oauth_not_found":"Invalid OAuth authorization code","oauth_expired":"OAuth authorization code expired","wm_disabled":"WebClient is disabled"},"forgot-password":{"heading":"Forgot password","submit":"Send me instructions","success-message":"Email has been sent to your alternative email address","success-message-guest":"Email has been sent to your email address"},"gateway-login":{"subheading":"Sign in with an administrator account to manage domains and users","success-message":"We have sent you an e-mail which contains a secure link. Clicking the link will let you access spam management for a limited time."},"generic":{"accept":"Accept","authorize":"Authorize","back":"Back","cancel":"Cancel","captcha-generate":"Generate new","check-account":"Check your account again","choose-different-account":"Choose different account","confirm":"Confirm","contact-admin":"Contact admin","copyright":"Powered by IceWarp","create-acc":"Create an account","decline":"Decline","done":"Done","email":"Email address","error":"Error","female":"Female","find_out_more":"To find out more about IceWarp server visit [www.icewarp.com](//www.icewarp.com)","fullscreen-enter":"Enter fullscreen","fullscreen-exit":"Exit fullscreen","have-account":"Already have an account?","dont-have-account":"Don't have an account yet?","hide":"Hide","male":"Male","next":"Next","not-you":"Not you?","password":"Password","password-confirm":"Confirm password","password-current":"Current password","password-new":"New password","password-policy":"Password policy","retry":"Retry","save-password":"Save new password","search":"Search","security-code":"Security code","send":"Send","show":"Show","sign-in":"Sign in","sign-with-another-acc":"Sign in with another account","skip":"Skip","success":"Success","undefined":"Undefined","understand":"OK, I understand","undisclosed_participant":"Undisclosed participant","username":"Username"},"guest-verify":{"heading":"Guest verification","subheading":"Please wait while your account is being verified","success-message":"Your account has been verified"},"interface":{"label":"Interface","desktop":"Desktop","tablet":"Tablet","phone":"Phone"},"oauth":{"grant_title":"Application %{client} needs to access your account and asks for following permissions:","Admin":"Admin API access","User":"WebClient API access","info":"%{client} will be listed among your OAuth applications in WebClient and can be removed any time. You may optionally fill the description below.","description":"Description (optional)"},"personal":{"heading":"Personal Information","nickname":"Nickname","birthday":"Birthday","company":"Company","job":"Job","profession":"Profession","mobile-phone":"Mobile Phone","work-phone":"Work Phone","home-phone":"Home Phone","im":"IM","gender":"Gender","homepage":"Homepage"},"reset-password":{"heading":"Reset password","success-message":"Password has been changed"},"set-password":{"code_sent_to":"Verification code has been sent to *%{to}*.","verification_code":"Verification code","heading":"You're almost done!","submit":"Create an account","success-message":"Account has been created"},"sign-in-generic":{"heading":{"oauth":"%{client} requires permissions","webclient":"Sign in to WebClient","webadmin":"Sign in to WebAdmin"}},"sign-in-password":{"forgot":"Forgot?","remember":"Keep me signed in"},"tc-actions":{"heading":"Plus button actions","subheading":"Make it easy to manage all TeamChat actions using the multi action '+' button."},"tc-check-email":{"heading":"Check your email","subheading":"Verify your email address and then use the **combination of your email address and password to join in** and chat with other users in TeamChat room **%{room}**","submit":"Go to sign in page","success-message":"Email has been verified"},"tc-collaboration":{"heading":"Collaboration in teams","subheading":"Exchange ideas, files or other data and discuss in different groups in real-time."},"tc-join":{"heading":"Join our TeamChat","subheading":"%{name} invited you to join TeamChat room _%{room}_","submit":"Verify my email address","success-message":"You have joined %{room}","username":"Name","username-helper":"Add name as it will appear in TeamChat","what-is-teamchat":"What is TeamChat?"},"tc-share":{"heading":"Share everything easily","subheading":"Drag & drop any documents or media - share and edit them right within the app."},"title":{"webadmin":"IceWarp WebAdmin","webclient":"IceWarp WebClient","oauth":"IceWarp OAuth"},"touch-id":{"heading":"Sign in with touch ID","use-password":"Use password instead"},"two_step":{"verification_code":"Verification code","heading":"Two step verification","subheading":"Please enter 6 digit code from IceWarp Authenticator app","subheading-phone":"Please enter 6 digit code sent to your phone number ending -%{phone}"},"validation":{"alpha_chars":"Field has to contain at least %{amount} letter||||Field has to contain at least %{amount} letters","email":"Invalid Email","empty":"Field cannot be empty","length":"Length must be %{amount} characters","min_length":"Minimum length is %{amount} characters","non_alpha_num_chars":"Field has to contain at least %{amount} non-alphanumeric character||||Field has to contain at least %{amount} non-alphanumeric characters","numeric_chars":"Field has to contain at least %{amount} number||||Field has to contain at least %{amount} numbers","passwords-no-match":"Passwords do not match","upper_alpha_chars":"Field has to contain at least %{amount} uppercase letter||||Field has to contain at least %{amount} uppercase letters","user_alias":"Field cannot contain username"},"languages":{"ar":"اللغة العربية","bg":"български","cn":"简体中文","cs":"Čeština","de":"Deutsch","dk":"Dansk","el":"Ελληνικά","en":"English","es":"Español","fa":"فارسی","fi":"Suomi","fr":"Français","he":"עִבְרִית","hi":"हिन्दी","hr":"Hrvatski","hu":"Magyar","is":"Íslenska","it":"Italiano","jp":"日本語","kr":"한국어","lv":"Latviešu","nl":"Nederlands","no":"Norsk","pl":"Polski","pt":"Português","ru":"Pусский","se":"Svenska","sk":"Slovenčina","th":"ไทย","tr":"Türkçe","ro":"Română","ua":"Українська"},"wm-join":{"already-member":"Already a member","audio-help":"Audio help","heading":"Join our WebMeeting","join-webmeeting":"Join WebMeeting","subheading":"WebMeeting created by %{name} is ready","subheading-prepare":"Waiting for WebMeeting info","success-message":"You have joined %{room}","username":"Name","username-helper":"Add name as it will appear in WebMeeting"},"wm":{"device-error":"Device error","error":"An error during webmeeting","hang-up":"Hang up","hang-up-confirm":"Are you sure you want to leave this webmeeting?","maximize":"Maximize window","microphone-denied":"Access to is microphone denied","microphone-denied-helper":"You will not be able to talk during this WebMeeting","no-microphone-detected":"No microphone detected","phone-number":"Phone number","restore":"Restore window","screen-share-started":"Screen sharing started","screen-share-stopped":"Screen sharing stopped","unsupported":"This browser does not support WebRTC","unsupported-text":"[More information](%{link})","user-joined":"User **%{name}** has joined the meeting","user-left":"User **%{name}** has left the meeting","meeting-ended":"WebMeeting has ended.","welcome-message":"Welcome to WebMeeting, **%{name}**! Group chat is ready."}}
},{}],127:[function(require,module,exports){
module.exports={"en":{"label":"English","direction":"ltr"},"ar":{"label":"‫العربية‬","direction":"rtl"},"bg":{"label":"български език","direction":"ltr"},"cs":{"label":"čeština","direction":"ltr"},"da":{"label":"dansk","direction":"ltr"},"de":{"label":"Deutsch","direction":"ltr"},"el":{"label":"Ελληνικά","direction":"ltr"},"es":{"label":"español","direction":"ltr"},"fa":{"label":"‫فارسی‬","direction":"rtl"},"fi":{"label":"Suomen kieli","direction":"ltr"},"fr":{"label":"français","direction":"ltr"},"he":{"label":"‫עברית‬","direction":"rtl"},"hi":{"label":"हिन्दी","direction":"ltr"},"hr":{"label":"Hrvatski","direction":"ltr"},"hu":{"label":"Magyar","direction":"ltr"},"is":{"label":"Íslenska","direction":"ltr"},"it":{"label":"Italiano","direction":"ltr"},"ja":{"label":"日本語 (にほんご)","direction":"ltr"},"ko":{"label":"한국어 (韓國語)","direction":"ltr"},"la":{"label":"latine","direction":"ltr"},"lv":{"label":"latviešu valoda","direction":"ltr"},"nl":{"label":"Nederlands","direction":"ltr"},"no":{"label":"Norsk","direction":"ltr"},"pl":{"label":"Polski","direction":"ltr"},"pt":{"label":"Português","direction":"ltr"},"ro":{"label":"română","direction":"ltr"},"ru":{"label":"русский язык","direction":"ltr"},"sk":{"label":"slovenčina","direction":"ltr"},"sv":{"label":"Svenska","direction":"ltr"},"th":{"label":"ไทย","direction":"ltr"},"tr":{"label":"Türkçe","direction":"ltr"},"zh":{"label":"中文","direction":"ltr"}}
},{}],128:[function(require,module,exports){
"use strict";
/**
 * @see {@link https://stackoverflow.com/a/48275932}
 * @param {*} target 
 * @param {*} source 
 */
function mergeDeep(target, source) {
	var key;
	if (typeof target == "object" && typeof source == "object") {
		for (key in source) {
			if (source[key] === null && (target[key] === undefined || target[key] === null)) {
				target[key] = null;
			} else if (source[key] instanceof Array) {
				if (!target[key]) target[key] = [];
				//concatenate arrays
				target[key] = target[key].concat(source[key]);
			} else if (typeof source[key] == "object") {
				if (!target[key]) target[key] = {};
				mergeDeep(target[key], source[key]);
			} else {
				target[key] = source[key];
			}
		}
	}
	return target;
}

module.exports = mergeDeep;

},{}],129:[function(require,module,exports){
"use strict";
var I18n = require('@icewarp/i18n');
var config = require('C:\\BuildAgent\\work\\e24a4084e6e20918\\src\\_config.json');

/**
 * Init translations
 * @param {Object} data
 * @param {*} next
 * @returns {undefined}
 */
function i18n(data, next) {
	config.i18n = config.i18n || {};

	I18n.init({
		url: config.i18n.url || 'locale/',
		expose: config.i18n.expose || '__',
		default_locale: config.i18n.default_locale || 'en',
		default_locale_dictionary: config.i18n.default_locale_dictionary || require('./../locale/en.json'),
		supported_languages: config.i18n.supported_languages || require('./../locale/languages.json'),
		external_url: config.i18n.external_url,
		version: config.i18n.version,
		project_name: config.project_name
	});
	next();
}

module.exports = i18n;

},{"./../locale/en.json":126,"./../locale/languages.json":127,"@icewarp/i18n":157,"C:\\BuildAgent\\work\\e24a4084e6e20918\\src\\_config.json":196}],130:[function(require,module,exports){
"use strict";
var Debugger = require('debugger');
var config = require('C:\\BuildAgent\\work\\e24a4084e6e20918\\src\\_config.json');

/**
 * Init Debugger
 * 
 * @param {*} data
 * @param {function} next
 * @returns {undefined}
 * @ignore
 */
function initDebugger(data, next) {
	if(config.debugger) {
		window.Debugger = Debugger;
	}

	config.debugger = config.debugger || {};

	Debugger.init({
		level: config.debugger.level || (Debugger.levels.ERROR | Debugger.levels.EVENT | Debugger.levels.HASHCHANGE | Debugger.levels.MOUSE_TRACKING),
		log_length: config.debugger.log_length || 10,
		mouse_log_length: config.debugger.mouse_log_length || 5000,
		dump: {
			fn: function (type, data) {
				/* eslint-disable no-console*/
				console.log(type, data);
				/* eslint-enable no-console*/
			}
		}
	});
	next();
}
module.exports = initDebugger;

},{"C:\\BuildAgent\\work\\e24a4084e6e20918\\src\\_config.json":196,"debugger":"debugger"}],131:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');
var BaseController = require('BaseController');
var Template = require('icebrace-runtime');

/**
 * Environment initialization
 * set models, controllers, templates
 * 
 * @param {*} data
 * @param {function} next
 * @returns {undefined}
 * @ignore
 */
function initEnvironment(data, next) {
	BaseModel.setModels(require('./../models-list.js'));
	BaseController.setControllers(require('./../controllers-list.js'));
	Template.setTemplates(require('./../templates-list.js'));
	next();
}

module.exports = initEnvironment;

},{"./../controllers-list.js":125,"./../models-list.js":135,"./../templates-list.js":153,"BaseController":"BaseController","BaseModel":"BaseModel","icebrace-runtime":"icebrace-runtime"}],132:[function(require,module,exports){
"use strict";
var config = require('C:\\BuildAgent\\work\\e24a4084e6e20918\\src\\_config.json');
var BaseModel = require('BaseModel');
var Request = require('request');
var mergeDeep = require('./helpers/merge-deep');

/**
 * @description Load config from URL, if provided
 * @param {string} url
 * @param {function} callback
 * @returns {undefined}
 */
function request(url, callback) {
	if (!url) {
		return callback();
	}
	new Request({
		url: url
	})
		.on('load', function(e, xhr) {
			try {
				mergeDeep(config, JSON.parse(xhr.response || xhr.responseText));
			} catch (e) {
				console.info('Error while loading config', url, 'fallback', config);
			}
			callback();
		})
		.on('error', function() {
			console.info('Error while loading config', url, 'fallback', config);
			callback();
		})
		.send();
}

/**
 * Load config from ./_config, extend it by ./external_config.json and config from config.remote_config_url
 *
 * @param {*} data
 * @param {function} next
 * @returns {undefined}
 * @ignore
 */
module.exports = function(data, next) {
	var external_config_url =
		config.external_config_url ||
		(location.origin || location.protocol + '//' + location.hostname) +
			(location.pathname + '/external_config.json').replace('//', '/');

	BaseModel.instance('Config').setData('config', config);
	request(external_config_url, function() {
		request(config.remote_config_url, next);
	});
};

},{"./helpers/merge-deep":128,"BaseModel":"BaseModel","C:\\BuildAgent\\work\\e24a4084e6e20918\\src\\_config.json":196,"request":"request"}],133:[function(require,module,exports){
"use strict";
/**
 * @returns {undefined}
 */
function Middleware() {
	if (!arguments[0]) {
		throw new Error('No middlewares specified');
	}

	runMiddleware(void 0, [].slice.call(arguments));
}

/**
 * 
 * @param {*} data 
 * @param {middleware[]} middlewares 
 * @returns {undefined}
 */
function runMiddleware(data, middlewares) {
	if (!middlewares.length) {
		return;
	}
	middlewares.shift()(data, function(data) {
		runMiddleware(data, middlewares.slice(0));
	});
}

module.exports = Middleware;

},{}],134:[function(require,module,exports){
"use strict";
var logger = require('logger');
var config = require('C:\\BuildAgent\\work\\e24a4084e6e20918\\src\\_config.json');

/**
 * Set logger log level
 * 
 * @param {*} data
 * @param {function} next
 * @returns {undefined}
 * @ignore
 */
function setLogLevel(data, next) {
	logger.setLevel((config.logger || {}).level || (logger.INFO | logger.WARN | logger.ERROR));
	next();
}
module.exports = setLogLevel;

},{"C:\\BuildAgent\\work\\e24a4084e6e20918\\src\\_config.json":196,"logger":"logger"}],135:[function(require,module,exports){
"use strict";
module.exports={'LegacyURL':function(){return require('./models/LegacyURL.js')},'OAuth':function(){return require('./models/OAuth.js')},'Server':function(){return require('./models/Server.js')},'WebClient':function(){return require('./models/WebClient.js')},'Validator':function(){return require('./models/Validator.js')},'Login':function(){return require('./models/Login.js')},'Config':function(){return require('./models/Config.js')},'banner_options':function(){return require('./models/WebClientSettings/banner_options.js')},'language':function(){return require('./models/WebClientSettings/language.js')},'custom_login_fields':function(){return require('./models/WebClientSettings/custom_login_fields.js')},'password_policy':function(){return require('./models/WebClientSettings/password_policy.js')},'layout_settings':function(){return require('./models/WebClientSettings/layout_settings.js')},'reset_settings':function(){return require('./models/WebClientSettings/reset_settings.js')},'restrictions':function(){return require('./models/WebClientSettings/restrictions.js')},'Setting':function(){return require('./models/WebClientSettings/Setting.js')},'Settings':function(){return require('./models/WebClientSettings/Settings.js')},'signup_domain':function(){return require('./models/WebClientSettings/signup_domain.js')}};
},{"./models/Config.js":136,"./models/LegacyURL.js":137,"./models/Login.js":138,"./models/OAuth.js":139,"./models/Server.js":140,"./models/Validator.js":141,"./models/WebClient.js":142,"./models/WebClientSettings/Setting.js":143,"./models/WebClientSettings/Settings.js":144,"./models/WebClientSettings/banner_options.js":145,"./models/WebClientSettings/custom_login_fields.js":146,"./models/WebClientSettings/language.js":147,"./models/WebClientSettings/layout_settings.js":148,"./models/WebClientSettings/password_policy.js":149,"./models/WebClientSettings/reset_settings.js":150,"./models/WebClientSettings/restrictions.js":151,"./models/WebClientSettings/signup_domain.js":152}],136:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');

var Config = BaseModel.create('Config');

Config.singleton = true;

module.exports = Config;

},{"BaseModel":"BaseModel"}],137:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');
var Hash = require('@icewarp/hash');
var LegacyURL = BaseModel.create('LegacyURL');
var QueryParams = require('@icewarp/query-params');


var legacy = function () {
	var OAuth = BaseModel.instance('OAuth');
	var wa_sid_cookie = getCookie('waid');
	if(wa_sid_cookie){
		OAuth.createAuthConnection(wa_sid_cookie);
	}

	return {
		atoken: BaseModel.instance('Login').getDefaultCard(),
		resetpwd: 'reset-password',
		changePwd: 'change-password',
		changepwd: 'change-password',
		reset: 'forgot-password',
		selfSignUp: 'create-account',
		guestSignUp: 'tc-join',
		guestVerify: 'guest-verify',
		'_s[action]': {
			error: BaseModel.instance('Login').getDefaultCard()
		},
		action: {
			confirm_personality: 'confirm-personality'
		},
		view: {
			gateway_login: 'gateway-login'
		},
		username: 'sign-in',
		eid: BaseModel.instance('Login').getDefaultCard(),
		tconly: 'generic-message',
		auth_id: wa_sid_cookie ? 'oauth-grant' : BaseModel.instance('Login').getDefaultCard()
	};
};

/**
 * 
 * @param {string} name 
 * @returns {string|undefined}
 */
function getCookie(name) {
	const value = '; ' + document.cookie + ';';
	const parts = value.split('; ' + name + '=');
	if (parts.length === 2) {
		return parts.pop().split(';').shift();
	}
}

LegacyURL.redirect = function () {
	var parts = QueryParams.parse(),
		type, site;

	var Legacy = legacy();
	for (type in Legacy) {
		site = (typeof Legacy[type] === 'string' && parts[type]) ? Legacy[type] : (Legacy[type] || {})[parts[type]];
		if (site) {
			return Hash.change(site, parts, true, false, location.protocol + '//' + location.host + location.pathname + '?legacy');
		}
	}
};

module.exports = LegacyURL;

},{"@icewarp/hash":156,"@icewarp/query-params":166,"BaseModel":"BaseModel"}],138:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');
var Login = BaseModel.create('Login');
var LocalStorage = require('@icewarp/localstorage');
var i18n = require('@icewarp/i18n');
var CssLoader = require('@icewarp/css-loader');

Login.singleton = true;

Login.prototype.onCreate = function () {
	this.setData('guestLogin', false)
		.setData('useRSA', true)
		.setData('chosen_account', {})
		.setData('create_account', {});
};

Login.prototype.getUser = function (email) {
	return this.getUsers().filter(function (user) {
		return user.email === email;
	})[0];
};

Login.prototype.getUsers = function () {
	!LocalStorage.getItem('logins') && LocalStorage.setItem('logins', []);
	return LocalStorage.getItem('logins');
};

Login.prototype.removeUser = function (condition) {
	LocalStorage.setItem('logins', this.getUsers().filter(function (login) {
		return !Object.keys(condition).some(function (key) {
			return login[key] === condition[key];
		});
	}));
	return this;
};

Login.prototype.addUser = function (new_user) {
	var logins, i;
	if (BaseModel.instance('WebClient').getData('restrictions').getValue('disable_autofill')) {
		return this;
	}
	logins = this.getUsers();
	logins.unshift(new_user);
	new_user.color = new_user.color || Math.floor(Math.random() * 6);
	LocalStorage.setItem('logins', logins.filter(function (value, index, arr) {
		var found = false;
		for (i = 0; i <= index; i++) {
			if (arr[i].email === value.email) {
				found = i;
				break;
			}
		}
		return index === found;
	}));
	return this;
};

Login.prototype.getDefaultCard = function () {
	return (this.getUsers().length && !BaseModel.instance('WebClient').getData('restrictions').getValue('disable_autofill')) ? (this.getData('chosen_account') ? 'sign-in-password' : 'choose-account') : 'sign-in';
};

Login.prototype.getAuthChallenge = function (callback) {
	this.callCommunication('getAuthChallenge', callback);
};

Login.prototype.getVerification = function (data, callback) {
	this.callCommunication('getVerification', data, {
		success: function (verification_id) {
			this.getData('create_account').verificationrequest = {
				id: verification_id
			};
			callback.success.call(callback.context);
		},
		error: function () {
			callback.error.apply(callback.context, arguments);
		},
		context: this
	});
};

Login.prototype.logoutTeamChatOnly = function (data, callback) {
	this.callCommunication('logoutTeamChatOnly', data, callback);
};

Login.prototype.changeLanguage = function (language, callback) {
	i18n.changeLanguage(language, changeLanguage.bind(null, callback), changeLanguage.bind(null, callback));
};

/**
 * 
 * @param {Object} callback
 * @param {String} language_code 
 * @returns {undefined}
 */
function changeLanguage(callback, language_code) {
	var WebClient = BaseModel.instance('WebClient');
	var styles = [].map.call(document.head.querySelectorAll('meta[name="stylesheet"]'), function (meta) {
		return document.head.querySelector('style[content="' + meta.getAttribute('content') + '"], link[href="' + meta.getAttribute('content') + '"]');
	}).filter(Boolean);

	WebClient.getData('layout_settings').setUserLanguageCode(language_code);

	document.body.setAttribute('dir', WebClient.getData('layout_settings').getUserLanguage().isRTL() ? 'rtl' : 'ltr');
	CssLoader.setRTL(WebClient.getData('layout_settings').getUserLanguage().isRTL(), function () {
		var color, colors = {};
		getComputedStyle(document.getElementById('theme-colors')).getPropertyValue('font-family').replace(/([\w-]+):(#\w+),?/g, function (all, key, value) {
			colors[key] = value;
		});
		color = WebClient.getData('layout_settings').getValue('login_color');

		CssLoader.load(function () {
			styles.forEach(function (style) {
				style.parentNode.removeChild(style);
			});
			callback.success && callback.success.call(callback.context || this);
		}, {
			'theme-color': colors[color],
			'theme-grey-color': colors[color + '-grey'],
			'theme-light-grey-color': colors[color + '-light-grey']
		});
	});
}

module.exports = Login;

},{"@icewarp/css-loader":154,"@icewarp/i18n":157,"@icewarp/localstorage":163,"BaseModel":"BaseModel"}],139:[function(require,module,exports){
"use strict";
var OldCommunication = require('@icewarp/old-communication');
var Hash = require('@icewarp/hash');
var BaseModel = require('BaseModel');
const Callback = require('Callback');
var OAuth = BaseModel.create('OAuth');

OAuth.singleton = true;

/**
 *
 *
 * @param {Callback} callback
 * @param {function} sideEffect
 * @returns {Callback}
 */
function callbackChainBuilder(callback) {
	var effects = [].slice.call(arguments, 1);
	var context =
		typeof effects[effects.length - 1] !== 'function' ? effects.pop() : null;
	var constructed_callback = callback;
	effects.reverse().forEach(function (sideEffect) {
		var current_level = constructed_callback;
		constructed_callback = {
			success: function (result) {
				sideEffect.call(
					context || null, {
						success: function () {
							current_level.success.apply(current_level.context, arguments);
						},
						error: function () {
							current_level.error.apply(current_level.context, arguments);
						}
					},
					result
				);
			},
			error: function () {
				current_level.error.apply(current_level.context, arguments);
			},
			context: current_level.context
		};
	});
	return constructed_callback;
}

/**
 *
 * @description Creates new Connection with admin SID
 * @param {string} sid - session id
 * @returns {undefined}
 */
OAuth.prototype.createAuthConnection = function (sid) {
	new OldCommunication(OldCommunication.XHR, 'admin-auth', {
		host: (BaseModel.instance('Config').getData('config').icewarpapiUrl ||
			'//' + location.host + '/icewarpapi') + '/',
		xmlns: 'admin:iq:rpc',
		session_id: sid
	});
};

/**
 * @description Set initial data to the model
 * @property {string} auth_id - ID of the auth request, used for grant
 * @property {string} email - Email of the user that should grant access
 * @property {array} scopes - Array of scopes that user should grant to the application
 * @returns {undefined}
 */
OAuth.prototype.onCreate = function () {
	this.setData('account_data', null)
		.initArray('scopes');
};

OAuth.prototype.initAlreadyLoggedIn = function(callback){
	var constructed_callback = callbackChainBuilder(
		callback,
		function (callback, result) {
			this.getAccountDetail(result.email, callback);
		},
		function (callback, account) {
			this.setData('account_data', account);
			this.GetOauthAuthorizationRequest(callback);
		},
		function (callback, response) {
			var prop;
			for (prop in response) {
				if (response[prop] && response[prop].item !== void 0) {
					this.setData(prop, Array.isArray(response[prop].item) ? response[prop].item : [response[prop].item]);
				} else {
					this.setData(prop, response[prop]);
				}
			}
			this.GetOauthClientInfo(response.clientid, callback);
		},
		function (callback, response) {
			var prop;
			for (prop in response) {
				this.setData(prop, response[prop]);
			}
			callback.success.call(callback.context);
		},
		this
	);
	this.getSessionInfo(constructed_callback);
};

/**
 * @param {string} email
 * @param {string} password
 * @param {Number} authtype
 * @param {Callback} callback
 * @returns {undefined}
 */
OAuth.prototype.login = function (email, password, authtype, callback) {
	var constructed_callback = callbackChainBuilder(
		callback,
		function (callback, sid) {
			this.createAuthConnection(sid);
			this.getAccountDetail(email, callback);
		},
		function (callback, account) {
			this.setData('account_data', account);
			this.GetOauthAuthorizationRequest(callback);
		},
		function (callback, response) {
			var prop;
			for (prop in response) {
				if (response[prop] && response[prop].item !== void 0) {
					this.setData(prop, Array.isArray(response[prop].item) ? response[prop].item : [response[prop].item]);
				} else {
					this.setData(prop, response[prop]);
				}
			}
			this.GetOauthClientInfo(response.clientid, callback);
		},
		function (callback, response) {
			var prop;
			for (prop in response) {
				this.setData(prop, response[prop]);
			}
			callback.success.call(callback.context);
		},
		this
	);
	this.callCommunication(
		'login', {
			user: email,
			password: password,
			authtype: authtype
		},
		constructed_callback
	);
};

/**
 * @description Gets detail of the logged in account, this data should be used for card heading and avatar
 * @param {String} email
 * @param {Callback} callback
 * @returns {undefined}
 */
OAuth.prototype.getAccountDetail = function (email, callback) {
	return this.callCommunication(
		'getAccountDetail', {
			email: email
		},
		callback
	);
};

/**
 * @description Get information about currently active session
 * @param {Callback} callback
 * @returns {undefined}
 */
OAuth.prototype.getSessionInfo = function (callback) {
	return this.callCommunication(
		'GetSessionInfo', {},
		callback
	);
};

OAuth.prototype.GetOauthClientInfo = function (clientid, callback) {
	if(!clientid) {
		return Callback(Callback.SUCCESS, callback, {});
	}

	return this.callCommunication('GetOauthClientInfo', {
		clientid: clientid
	}, callback);
};

OAuth.prototype.GetOauthAuthorizationRequest = function (callback) {
	var auth_id = Hash.getParts().auth_id;

	if(!auth_id) {
		return Callback(Callback.SUCCESS, callback, {});
	}

	return this.callCommunication('GetOauthAuthorizationRequest', {
		requestid: Hash.getParts().auth_id
	}, callback);
};

/**
 * @description Grant app permissions to access required scopes
 * @param {String} description
 * @param {Callback} callback
 * @returns {undefined}
 */
OAuth.prototype.GrantOauthAuthorization = function (description, callback) {
	return this.callCommunication('GrantOauthAuthorization', {
		requestid: Hash.getParts().auth_id,
		description: description
	}, callback);
};

OAuth.prototype.getRedirectURL = function () {
	return '/oauth/v2/code?auth_id=' + Hash.getParts().auth_id;
};

module.exports = OAuth;

},{"@icewarp/hash":156,"@icewarp/old-communication":164,"BaseModel":"BaseModel","Callback":"Callback"}],140:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');
var Server = BaseModel.create('Server');

Server.singleton = true;

Server.prototype.getLogo = function () {
	return this.getResource({'class': 'logo', fullpath: document.location.hostname, uid: BaseModel.instance('WebClient').getData('layout_settings').getValue('logo_uid')});
};

Server.prototype.getBackground = function () {
	return this.getResource({'class': 'background', fullpath: document.location.hostname, uid: BaseModel.instance('WebClient').getData('layout_settings').getValue('login_background_uid')});
};

Server.noCacheHash = (0 | Math.random() * 6.04e7).toString(36);
Server.prototype.getAvatar = function (data) {
	var config = BaseModel.instance('Config').getData('config');
	data.internal = 1;
	data.uid = Server.noCacheHash;
	return this.getResource(data, config.avatarResourcePath);
};

Server.prototype.getResource = function (data, resourcePath) {
	var config = BaseModel.instance('Config').getData('config');
	return (resourcePath || config.resourcePath) + '?' + Object.keys(data).map(function (key) {
		return key + '=' + data[key];
	}).join('&');
};

module.exports = Server;

},{"BaseModel":"BaseModel"}],141:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');
var Validator = BaseModel.create('Validator');

Validator.prototype.empty = function (options, value) {
	return value.trim().length;
};
Validator.prototype.length = function (options, value) {
	return value.trim().length === +options.data;
};
Validator.prototype.min_length = function (options, value) {
	return value.trim().length >= options.data;
};
Validator.prototype.numeric_chars = function (options, value) {
	return (value.match(/\d/g) || []).length >= options.data;
};
Validator.prototype.non_alpha_num_chars = function (options, value) {
	return (value.match(/[^A-Za-z0-9]/g) || []).length >= options.data;
};
Validator.prototype.alpha_chars = function (options, value) {
	return (value.match(/\w/g) || []).length >= options.data;
};
Validator.prototype.upper_alpha_chars = function (options, value) {
	return (value.match(/[A-Z]/g) || []).length >= options.data;
};
Validator.prototype.email = function (options, value) {
	return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
};
Validator.prototype.same = function (options, value) {
	return (options.counterpart_value || options.controller.closestHook(options.parent_hook).querySelector('[data-hook="' + options.counterpart_hook + '"]').value) === value;
};
Validator.prototype.different = function (options, value) {
	return !this.same(options, value);
};
Validator.prototype.contains = function (options, value) {
	return !!(value.match(new RegExp(options.counterpart_value === void 0 ? options.controller.closestHook(options.parent_hook).querySelector('[data-hook="' + options.counterpart_hook + '"]').value : options.counterpart_value, 'gi')) || []).length;
};
Validator.prototype.not_contains = function (options, value) {
	return !this.contains(options, value);
};
module.exports = Validator;

},{"BaseModel":"BaseModel"}],142:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');
var WebClient = BaseModel.create('WebClient');

WebClient.singleton = true;

WebClient.prototype.onCreate = function () {
	this.initArray('languages');
	this.initArray('signup_domains');
	this.setData('custom_login_fields', BaseModel.instance('custom_login_fields'));
	this.setData('layout_settings', BaseModel.instance('layout_settings'));
	this.setData('password_policy', BaseModel.instance('password_policy'));
	this.setData('reset_settings', BaseModel.instance('reset_settings'));
	this.setData('restrictions', BaseModel.instance('restrictions'));
	this.setData('banner_options', BaseModel.instance('banner_options'));
};

WebClient.prototype.initialize = function (data) {
	var lvl0 = Array.isArray(data.list.item) ? data.list.item : [data.list.item];
	var lvl2, i, lvl1, j;
	for (i in lvl0) {
		lvl1 = lvl0[i];
		switch (lvl1.name) {
			case 'languages':
				lvl2 = Array.isArray(lvl1.list.item) ? lvl1.list.item : [lvl1.list.item];
				for (j in lvl2) {
					this.pushData('languages', BaseModel.instance('language').initialize(lvl2[j].list.item));
				}
				break;
			case 'signup_domains':
				if (!lvl1.list.item.list) {
					continue;
				}
				lvl2 = Array.isArray(lvl1.list.item.list.item) ? lvl1.list.item.list.item : [lvl1.list.item.list.item];
				for (j in lvl2) {
					this.pushData('signup_domains', BaseModel.instance('signup_domain').initialize(lvl2[j]));
				}
				break;
			default:
				lvl1.list && lvl1.list.item && lvl1.list.item.list && lvl1.list.item.list.item && this.setData(lvl1.name, BaseModel.instance(lvl1.name).initialize(lvl1.list.item.list.item));
		}
	}
	this.setData('settings_loaded', true);

	return this;
};

/**
 *
 * @param {function} encrypt
 * @param {@icewarp/callback} callback callback object
 * @returns {undefined}
 */
WebClient.prototype.signupAccount = function (encrypt, callback) {
	var Login = BaseModel.instance('Login');
	var i, data = {};
	for (i in Login.getData('create_account')) {
		data[i] = Login.getData('create_account')[i];
	}

	data.password = encrypt(Login.getData('create_account').password);
	data.authtype = +Login.getData('useRSA');
	this.callCommunication('signupAccount', data, {
		success: function() {
			Login.addUser(Login.getData('chosen_account'));
			Login.setData('create_account', {card: {}});
			callback.success.call(callback.context);
		},
		error: function(response) {
			callback.error.call(callback.context, response);
		},
		context: callback.context
	});
};

WebClient.prototype.getAuthToken = function(data, callback) {
	this.callCommunication('getAuthToken', data, {
		success: function(response) {
			var config = BaseModel.instance('Config').getData('config');
			var LocalStorage = require('@icewarp/localstorage');
			var punycode = require('punycode');
			var Login = BaseModel.instance('Login');
			var chosen_account = Login.getData('chosen_account');
			chosen_account.name = [response.name.name || '', response.name.surname || ''].join(' ').trim();
			chosen_account.email = punycode.toUnicode(response.email || '');
			chosen_account.avatar_token = response.avatartoken;
			Login.setData('chosen_account', chosen_account);
			Login.addUser(Login.getData('chosen_account'));
			LocalStorage.setItem('last-login-' + config.application, response);
			callback.success.call(callback.context, response);
		},
		error: function(error, response) {
			callback.error.call(callback.context, error, response);
		},
		context: this
	});
};

WebClient.prototype.getCaptcha = function(callback) {
	this.callCommunication('getCaptcha', callback);
};

WebClient.prototype.changePassword = function(data, callback) {
	this.callCommunication('changePassword', data, callback);
};

WebClient.prototype.resetPassword = function(data, callback) {
	this.callCommunication('resetPassword', data, callback);
};

WebClient.prototype.confirmPersonality = function(data, callback) {
	this.callCommunication('confirmPersonality', data, callback);
};

WebClient.prototype.contactAdministrator = function(data, callback) {
	this.callCommunication('contactAdministrator', data, callback);
};

WebClient.prototype.resetPasswordEmail = function(data, callback) {
	this.callCommunication('resetPasswordEmail', data, callback);
};

WebClient.prototype.sendGatewayAuthentication = function(data, callback) {
	this.callCommunication('sendGatewayAuthentication', data, callback);
};

WebClient.prototype.guestConfirm = function(data, callback) {
	this.callCommunication('guestConfirm', data, callback);
};

WebClient.prototype.guestVerify = function(data, callback) {
	this.callCommunication('guestVerify', data, callback);
};

module.exports = WebClient;

},{"@icewarp/localstorage":163,"BaseModel":"BaseModel","punycode":175}],143:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');
var Setting = BaseModel.create('Setting');

Setting.prototype.onCreate = function () {
	this.setData('domainadminaccesslevel', 0)
		.setData('useraccesslevel', 0)
		.setData('accesslevel', 0)
		.setData('name', '')
		.setData('value', '')
		.setData('setdefault', 0);
};

Setting.prototype.initialize = function (data) {
	var key;
	for (key in data) {
		data[key] !== null && data[key] !== void 0 && this.setData(key, isNaN(parseInt(data[key])) ? data[key] : parseInt(data[key]));
	}

	return this;
};

module.exports = Setting;

},{"BaseModel":"BaseModel"}],144:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');
var Settings = BaseModel.create('Settings');

Settings.singleton = true;

Settings.prototype.initialize = function (data) {
	var j;
	data = Array.isArray(data) ? data : [data];
	for (j in data) {
		this.setData(data[j].name, BaseModel.instance('Setting', data[j].name).initialize(data[j]));
	}

	return this;
};

Settings.prototype.getValue = function (name) {
	return this.getData(name) ? this.getData(name).getData('value') : void 0;
};

module.exports = Settings;

},{"BaseModel":"BaseModel"}],145:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');
var Settings = require('./Settings');
var banner_options = BaseModel.create('banner_options', Settings);

banner_options.prototype.onCreate = function () {
	[
		{name: 'top_type', value: 'none'},
		{name: 'top_url', value: ''},
		{name: 'top_code', value: ''},
		{name: 'below_type', value: 'none'},
		{name: 'below_url', value: ''},
		{name: 'below_code', value: ''},
		{name: 'desktop_type', value: 'none'},
		{name: 'desktop_url', value: ''},
		{name: 'desktop_code', value: ''},
		{name: 'mobile_type', value: 'none'},
		{name: 'mobile_url', value: ''},
		{name: 'mobile_code', value: ''},
		{name: 'customer_id', value: ''}
	].forEach(function (setting) {
		this.setData(setting.name, BaseModel.instance('Setting', setting.name).initialize(setting));
	}, this);
};

module.exports = banner_options;

},{"./Settings":144,"BaseModel":"BaseModel"}],146:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');
var Settings = require('./Settings');
var custom_login_fields = BaseModel.create('custom_login_fields', Settings);

var available_custom_fields = [
	{
		id: 'nickname',
		name: 'nickname',
		label: __('personal.nickname')
	}, {
		id: 'birthday',
		name: 'birthday',
		label: __('personal.birthday'),
		type: 'date',
		maxDate: new Date()
	}, {
		id: 'company',
		name: 'companyname',
		label: __('personal.company')
	}, {
		id: 'job',
		name: 'jobtitle',
		label: __('personal.job')
	}, {
		id: 'profession',
		name: 'profession',
		label: __('personal.profession')
	}, {
		id: 'mobile_phone',
		name: 'mobiletelephonenumber',
		label: __('personal.mobile-phone'),
		type: 'tel'
	}, {
		id: 'work_phone',
		name: 'businesstelephonenumber',
		label: __('personal.work-phone'),
		type: 'tel'
	}, {
		id: 'home_phone',
		name: 'hometelephonenumber',
		label: __('personal.home-phone'),
		type: 'tel'
	}, {
		id: 'im',
		name: 'imaddress',
		label: __('personal.im')
	}, {
		id: 'gender',
		name: 'gender',
		label: __('personal.gender'),
		type: 'select',
		options: [
			{
				text: '',
				value: 0
			},
			{
				text: __('generic.male'),
				value: 2
			},
			{
				text: __('generic.female'),
				value: 1
			}
		]
	}, {
		id: 'homepage',
		name: 'homepage',
		label: __('personal.homepage')
	}
];

custom_login_fields.prototype.onCreate = function () {
	[{name: 'login_verification_enabled', value: 0},
		{name: 'login_verification_type', value: 'none'}
	].forEach(function (setting) {
		this.setData(setting.name, BaseModel.instance('Setting', setting.name).initialize(setting));
	}, this);
};

custom_login_fields.prototype.enabledCustomFields = function () {
	var WebClient = BaseModel.instance('WebClient');
	return available_custom_fields.map(function (field) {
		if (field.id === 'mobile_phone' && WebClient.getData('custom_login_fields').getValue('login_verification_enabled') && (WebClient.getData('custom_login_fields').getValue('login_verification_type') === 'sms')) {
			return field;
		}
		return this.getValue(field.id + '_enabled') ? field : false;
	}, this).filter(Boolean);
};

module.exports = custom_login_fields;

},{"./Settings":144,"BaseModel":"BaseModel"}],147:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');
var language = BaseModel.create('language');

var codes = {
	zh: 'cn',
	da: 'dk',
	ja: 'jp',
	ko: 'kr',
	//	lv: 'la',
	sv: 'se'
};

language.prototype.initialize = function (data) {
	var k;
	data = Array.isArray(data) ? data : [data];
	for (k in data) {
		if(data[k].name === 'code') {
			data[k].value = codes[data[k].value] || data[k].value;
		}
		this.setData(data[k].name, BaseModel.instance('Setting').initialize(data[k]));
	}

	return this;
};

language.prototype.isRTL = function () {
	return this.getValue('rtl') === 'true';
};

language.prototype.getValue = function (name) {
	return this.getData(name).getData('value');
};

module.exports = language;

},{"BaseModel":"BaseModel"}],148:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');
var LocalStorage = require('@icewarp/localstorage');
var Settings = require('./Settings');
var layout_settings = BaseModel.create('layout_settings', Settings);

var detected_language;

layout_settings.prototype.onCreate = function () {
	var config = BaseModel.instance('Config').getData('config');
	[{name: 'language', value: 'en'},
		{name: 'logo_uid', value: ''},
		{name: 'login_background_uid', value: ''},
		{name: 'login_title', value: __('title.' + config.application)},
		{name: 'title', value: __('title.' + config.application)},
		{name: 'skin_style', value: 'blue'},
		{name: 'login_color', value: 'default'},
		{name: 'facebook_link', value: 'https://www.facebook.com/IceWarpInc'},
		{name: 'twitter_link', value: 'https://twitter.com/icewarp'},
		{name: 'linkedin_link', value: 'https://www.linkedin.com/company/IceWarp'},
		{name: 'search_phrase', value: ''}
	].forEach(function (setting) {
		this.setData(setting.name, BaseModel.instance('Setting', setting.name).initialize(setting));
	}, this);
};

/**
 * @returns {String}
 */
function getBrowserLanguageCode() {
	var browser_languages, allowed_languages, index, language,
		WebClient = BaseModel.instance('WebClient');
	if (detected_language !== void 0) {
		return detected_language;
	}
	browser_languages = (navigator.languages || []).concat([navigator.language || navigator.userLanguage]);
	allowed_languages = WebClient.getData('languages').map(function (language) {
		return language.getValue('code');
	});
	detected_language = false;
	for (index in browser_languages) {
		language = browser_languages[index].split('-')[0].toLowerCase();
		if (~allowed_languages.indexOf(language)) {
			detected_language = language;
			break;
		}
	}
	return detected_language;
}

layout_settings.prototype.getDefaultLanguageCode = function () {
	var WebClient = BaseModel.instance('WebClient');
	return WebClient.getData('restrictions').getValue('disable_languages') ? this.getValue('language') : this.getUserLanguageCode();
};

layout_settings.prototype.getUserLanguageCode = function () {
	return LocalStorage.getItem('language') || this.getValue('language') || getBrowserLanguageCode() || 'en';
};

layout_settings.prototype.setUserLanguageCode = function (language) {
	LocalStorage.setItem('language', language);
};

layout_settings.prototype.getUserLanguage = function () {
	var i;
	var browser_language;
	var default_language;
	var ulc = this.getUserLanguageCode();
	var blc = getBrowserLanguageCode();
	var languages = BaseModel.instance('WebClient').getData('languages') || [];
	var lang_length = languages.length;
	for (i = 0; i < lang_length; i++) {
		switch (languages[i].getValue('code')) {
			case ulc:
				return languages[i];
			case blc:
				browser_language = browser_language || languages[i];
				break;
			case this.getValue('language'):
				default_language = default_language || languages[i];
				break;
		}
	}

	return browser_language || default_language || languages.filter(function(language) {
		return language.getValue('code') === 'en';
	})[0] || BaseModel.instance('language').initialize([{'name': 'code', value: 'en'}, {name: 'rtl', value: false}]);
};

module.exports = layout_settings;

},{"./Settings":144,"@icewarp/localstorage":163,"BaseModel":"BaseModel"}],149:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');
var Settings = require('./Settings');
var password_policy = BaseModel.create('password_policy', Settings);

module.exports = password_policy;

},{"./Settings":144,"BaseModel":"BaseModel"}],150:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');
var Settings = require('./Settings');
var reset_settings = BaseModel.create('reset_settings', Settings);

module.exports = reset_settings;

},{"./Settings":144,"BaseModel":"BaseModel"}],151:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');
var Settings = require('./Settings');
var restrictions = BaseModel.create('restrictions', Settings);

restrictions.prototype.onCreate = function () {
	[{name: 'disable_languages', value: false},
		{name: 'disable_signup', value: true},
		{name: 'disable_signup_ip', value: false},
		{name: 'disable_remember', value: false},
		{name: 'disable_autofill', value: false},
		{name: 'contact_support', value: true},
		{name: 'disable_changepass', value: false},
		{name: 'facebook_disabled', value: false},
		{name: 'twitter_disabled', value: false},
		{name: 'linkedin_disabled', value: false},
		{name: 'show_search', value: false}
	].forEach(function (setting) {
		this.setData(setting.name, BaseModel.instance('Setting', setting.name).initialize(setting));
	}, this);
};
module.exports = restrictions;

},{"./Settings":144,"BaseModel":"BaseModel"}],152:[function(require,module,exports){
"use strict";
var BaseModel = require('BaseModel');
var Setting = require('./Setting');
var signup_domain = BaseModel.create('signup_domain', Setting);

signup_domain.prototype.initialize = function (data) {
	var key;
	for (key in data) {
		data[key] !== null && data[key] !== void 0 && this.setData(key, isNaN(parseInt(data[key])) ? data[key] : parseInt(data[key]));
	}
	this.setId(this.getData('value'));

	return this;
};

module.exports = signup_domain;

},{"./Setting":143,"BaseModel":"BaseModel"}],153:[function(require,module,exports){
"use strict";
module.exports={'atoms-ad-adsense':function(){return require('./_compiled/atoms-ad-adsense.js')},'atoms-ad':function(){return require('./_compiled/atoms-ad.js')},'atoms-avatar':function(){return require('./_compiled/atoms-avatar.js')},'atoms-addon':function(){return require('./_compiled/atoms-addon.js')},'atoms-dropdown':function(){return require('./_compiled/atoms-dropdown.js')},'atoms-chat-message':function(){return require('./_compiled/atoms-chat-message.js')},'atoms-element-button':function(){return require('./_compiled/atoms-element-button.js')},'atoms-element-input':function(){return require('./_compiled/atoms-element-input.js')},'atoms-element-textarea':function(){return require('./_compiled/atoms-element-textarea.js')},'atoms-element-select':function(){return require('./_compiled/atoms-element-select.js')},'atoms-icons':function(){return require('./_compiled/atoms-icons.js')},'atoms-image':function(){return require('./_compiled/atoms-image.js')},'atoms-info':function(){return require('./_compiled/atoms-info.js')},'atoms-label':function(){return require('./_compiled/atoms-label.js')},'atoms-loader':function(){return require('./_compiled/atoms-loader.js')},'atoms-nametag':function(){return require('./_compiled/atoms-nametag.js')},'atoms-link':function(){return require('./_compiled/atoms-link.js')},'atoms-section':function(){return require('./_compiled/atoms-section.js')},'atoms-static':function(){return require('./_compiled/atoms-static.js')},'atoms-switch':function(){return require('./_compiled/atoms-switch.js')},'atoms-tag':function(){return require('./_compiled/atoms-tag.js')},'atoms-tooltip':function(){return require('./_compiled/atoms-tooltip.js')},'atoms-video':function(){return require('./_compiled/atoms-video.js')},'atoms-well':function(){return require('./_compiled/atoms-well.js')},'meta-head':function(){return require('./_compiled/meta-head.js')},'molecules-captcha':function(){return require('./_compiled/molecules-captcha.js')},'molecules-button':function(){return require('./_compiled/molecules-button.js')},'molecules-checkbox':function(){return require('./_compiled/molecules-checkbox.js')},'molecules-language-picker-item':function(){return require('./_compiled/molecules-language-picker-item.js')},'molecules-input':function(){return require('./_compiled/molecules-input.js')},'meta-index':function(){return require('./_compiled/meta-index.js')},'molecules-language-picker':function(){return require('./_compiled/molecules-language-picker.js')},'molecules-static':function(){return require('./_compiled/molecules-static.js')},'molecules-select':function(){return require('./_compiled/molecules-select.js')},'molecules-textarea':function(){return require('./_compiled/molecules-textarea.js')},'molecules-window-header':function(){return require('./_compiled/molecules-window-header.js')},'organisms-card-header':function(){return require('./_compiled/organisms-card-header.js')},'organisms-card-section':function(){return require('./_compiled/organisms-card-section.js')},'organisms-bar':function(){return require('./_compiled/organisms-bar.js')},'organisms-window':function(){return require('./_compiled/organisms-window.js')},'sites-login':function(){return require('./_compiled/sites-login.js')},'templates-card':function(){return require('./_compiled/templates-card.js')}};
},{"./_compiled/atoms-ad-adsense.js":1,"./_compiled/atoms-ad.js":2,"./_compiled/atoms-addon.js":3,"./_compiled/atoms-avatar.js":4,"./_compiled/atoms-chat-message.js":5,"./_compiled/atoms-dropdown.js":6,"./_compiled/atoms-element-button.js":7,"./_compiled/atoms-element-input.js":8,"./_compiled/atoms-element-select.js":9,"./_compiled/atoms-element-textarea.js":10,"./_compiled/atoms-icons.js":11,"./_compiled/atoms-image.js":12,"./_compiled/atoms-info.js":13,"./_compiled/atoms-label.js":14,"./_compiled/atoms-link.js":15,"./_compiled/atoms-loader.js":16,"./_compiled/atoms-nametag.js":17,"./_compiled/atoms-section.js":18,"./_compiled/atoms-static.js":19,"./_compiled/atoms-switch.js":20,"./_compiled/atoms-tag.js":21,"./_compiled/atoms-tooltip.js":22,"./_compiled/atoms-video.js":23,"./_compiled/atoms-well.js":24,"./_compiled/meta-head.js":25,"./_compiled/meta-index.js":26,"./_compiled/molecules-button.js":27,"./_compiled/molecules-captcha.js":28,"./_compiled/molecules-checkbox.js":29,"./_compiled/molecules-input.js":30,"./_compiled/molecules-language-picker-item.js":31,"./_compiled/molecules-language-picker.js":32,"./_compiled/molecules-select.js":33,"./_compiled/molecules-static.js":34,"./_compiled/molecules-textarea.js":35,"./_compiled/molecules-window-header.js":36,"./_compiled/organisms-bar.js":37,"./_compiled/organisms-card-header.js":38,"./_compiled/organisms-card-section.js":39,"./_compiled/organisms-window.js":40,"./_compiled/sites-login.js":41,"./_compiled/templates-card.js":42}],154:[function(require,module,exports){
var Request = require('request');
/*
 * store the number of loaded CSS's
 * @type Number
 */
var passed;
/**
 * store the number of CSS's to pass
 * @type Number
 */
var to_pass;
/**
 * Flag for browsers supporting css variables
 * @type Boolean
 */
var supports_css_variables = !!(window.CSS && window.CSS.supports && window.CSS.supports('--v', 0));

/**
 * CSS loader class
 */
var loader = {};

var forced_definitions = {};

/**
 * Loads styles defined in meta name="stylesheet" head tags
 * @param {function} callback Callback to call after loading all styles
 * @param {Object} custom_definitions object with definitions to use
 * @returns {undefined}
 */
loader.load = function (callback, custom_definitions) {
	forced_definitions = custom_definitions || forced_definitions;
	var metas = [].slice.call(document.head.querySelectorAll('meta[name="stylesheet"]'));
	passed = 0;
	to_pass = metas.length;
	if (!to_pass) {
		return callback && callback();
	}
	metas.forEach(function (meta) {
		var uses_variables = meta.getAttribute('variables') && meta.getAttribute('variables') !== "false";
		if (!uses_variables || supports_css_variables) {
			createTag('link', meta.getAttribute('content'), function () {
				runCallback(callback);
			});
		} else {
			requestCss.call(this, meta, callback);
		}
	}.bind(this));
};

loader.setRTL = function (isRTL, callback) {
	[].forEach.call(document.head.querySelectorAll('meta[name="stylesheet"]'), function (meta) {
		var href = meta.getAttribute('content');
		if (isRTL) {
			href = href.replace(/(\.rtl)?.css$/, '.rtl.css');
		} else {
			href = href.replace(/.rtl.css$/, '.css');
		}
		meta.setAttribute('content', href);
	});
	callback && callback();
};

/**
 * Substitutes css variables for their values
 * @param {string} cssText
 * @returns {string} parsed text
 */
loader.replace = function (cssText) {
	cssText = cssText || '';
	var match;
	var regExpDefinition = /(?:^|\s+)--(.+?):\s*(.+?);/g;
	var regExpSubstitution = /var\(--(.+?)\)/g;
	var repeat = true;

	while (repeat) {
		var definitions = {};
		while ((match = regExpDefinition.exec(cssText)) !== null) {
			definitions[match[1]] = match[2];
		}
		repeat = false;
		cssText = cssText.replace(regExpSubstitution, function (whole, match) {
			repeat = true;
			return forced_definitions[match] || definitions[match];
		});
	}
	return cssText;
};

/**
 * requests css form the server
 * @param {DOMElement} meta meta tag
 * @param {function} callback
 * @returns {undefined}
 */
function requestCss(meta, callback) {
	var url = meta.getAttribute('content');
	var base = document.head.getElementsByTagName('base')[0];
	base = base ? base.getAttribute('href') : '';
	base = ~base.indexOf('{') ? '' : base;
	var request = new Request({
		url: base + url,
		method: "GET"
	});
	request.on('load', function (event, xhr) {
		var replace = new RegExp('(\\.\\.[/\\\\]){' + (meta.getAttribute('content').match(/\//g) || []).length + '}', 'g');
		createTag('style', this.replace(xhr.responseText).replace(replace, ''), function (style) {
			style.setAttribute('content', url);
			runCallback(callback);
		});
	}.bind(this));
	request.on('error', console.error);
	request.on('abort', console.error);
	request.send();
}

/**
 * Appends "style" or "link" element to head
 * @param {string} type "style" or "link" element
 * @param {string} src href for "link" element and textContent for "style" element
 * @param {function} callback
 * @returns {undefined}
 */
function createTag(type, src, callback) {
	var style = document.createElement(type);
	style.setAttribute('type', 'text/css');
	switch (type) {
		case 'link':
			style.setAttribute('rel', 'stylesheet');
			style.setAttribute('href', src);
			style.onload = callback;
			style.onerror = function () {
				console.error('Unable to load ' + src);
				callback(style);
			};
			document.head.appendChild(style);
			break;
		case 'style':
			style.textContent = src;
			document.head.appendChild(style);
			callback && callback(style);
	}
}

/**
 * Removes original meta element from head and calls callback if called last time
 * @param {function} callback
 * @returns {undefined}
 */
function runCallback(callback) {
	(++passed === to_pass) && callback && callback();
}

module.exports = loader;

},{"request":"request"}],155:[function(require,module,exports){
/**
 * map of substitutions
 */
var entity_map = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;',
	'/': '&#x2F;',
	'`': '&#x60;',
	'=': '&#x3D;'
};

/**
 * function to escape &<>"'`=\/ in string
 * @param string string to escape
 */
var escapeString = function(string) {
	return String(string).replace(/[&<>"'`=/]/g, function (match) {
		return entity_map[match];
	});
};

/**
 * @module escape-string
 */
module.exports = escapeString;

},{}],156:[function(require,module,exports){
var hashchange = require('hashchange');
var Debugger = require('debugger');
Debugger.addLogLevel("HASHCHANGE");

/**
 * Current site
 * @type String
 */
var _site = '';

/**
 * Current hash parts
 * @type String[]
 */
var _parts = {};

/**
 * Previous site
 * @type String
 */
var _previous_site = '';

/**
 * Previous hash parts
 * @type String[]
 */
var _previous_parts = [];

/**
 * Flag to skip callback on hash change
 * @type Boolean
 */
var _skip_callback = false;

/**
 * @class Hash
 */
var Hash = {}; 

/**
 * Set hash change function or trigger hash change event
 * @param {function} callback
 * @returns {unresolved}
 */
Hash.update = function (callback) {
	return hashchange.update(callback ? function (hashFragment) {
		updateParts(hashFragment);
		Debugger.logAction({site: _site, parts: _parts}, Debugger.levels.HASHCHANGE);
		!_skip_callback && callback(_site, _parts, _previous_site, _previous_parts);
		_skip_callback = false;
		_previous_site = _site;
		_previous_parts = _parts;
	} : void 0);
};

/**
 * Change browser URL hash
 * @param {String} site
 * @param {String[]} parts
 * @param {Boolean} skip_callback
 * @param {Boolean} keep_parts 
 * @param {String} root 
 * @returns {Hash}
 */
Hash.change = function (site, parts, skip_callback, keep_parts, root) {
	_site = site || _site;
	_parts = keep_parts ? Hash.getParts() : {};
	if(parts) {
		for(var i in parts) {
			if(parts[i] === null) {
				delete _parts[i];
			} else {
				_parts[i] = parts[i];
			}
		}
	}
	var data = [];
	for (i in _parts) {
		data.push(encodeURIComponent(i) + (_parts[i] !== void 0 ? '=' + encodeURIComponent(_parts[i]) : ''));
	}
	Debugger.logAction({site: _site, parts: _parts}, Debugger.levels.HASHCHANGE);
	_skip_callback = skip_callback;
	if(root !== void 0) {
		location.replace(root + '#' + _site + (data.length ? '&' + data.join('&') : ''));
	} else {
		location.hash = _site + (data.length ? '&' + data.join('&') : '');
	}
	return this;
};

/**
 * Returns current site
 * @returns {String}
 */
Hash.getSite = function () {
	return _site;
};

/**
 * Returns URL hash parts
 * @returns {String[]}
 */
Hash.getParts = function () {
	return _parts;
};

function updateParts(hashFragment) {
	hashFragment = hashFragment || location.hash;
	var parts = hashFragment.replace('#', '').split('&');
	_site = ~parts[0].indexOf('=') ? '' : parts.shift();
	_parts = {};
	parts.forEach(function (part) {
		part = part.split('=');
		_parts[decodeURIComponent(part.splice(0, 1))] = decodeURIComponent(part.join('='));
	});
}
updateParts();

/**
 * @module Hash
 */
module.exports = Hash;

},{"debugger":"debugger","hashchange":181}],157:[function(require,module,exports){
var Request = require('request');
var logger = require('logger');
var Polyglot = require('./polyglot.js');
var polyglot = null;

/**
 * object to store loaded languages
 */
var language_dictionaries = {};
/**
 * object to store supported languages
 */
var supported_languages = {
	en: {
		direction: 'ltr',
		label: 'English'
	}
};

/**
 * i18n settings
 */
var settings = {};

var default_locale = 'en';

/**
 * 
 * @param {function} fn
 * @param {string} language
 * @param {Event} event
 * @param {XmlHttpRequest} xhr
 * @returns {i18n}
 */
var loadSuccess = function (fn, language, event, xhr) {
	try {
		language_dictionaries[language] = JSON.parse(event.target.responseText);
	} catch (e) {
		//
	}

	polyglot.extend(language_dictionaries[default_locale]);
	polyglot.extend(language_dictionaries[language]);
	polyglot.locale(language);
	fn(language);
	return this;
};

/**
 * 
 * @param {string} error_message
 * @param {function} fn
 * @param {string} language
 * @param {XmlHttpRequest} xhr
 * @returns {unresolved}
 */
var loadError = function (error_message, fn, language, xhr) {
	polyglot.locale(language);
	return fn ? fn(polyglot.locale()) : logger.error(error_message);
};

function compareVersions(a, b) {
	return compareVersions.parts(a.split('.'), b.split('.'), 0);
}
compareVersions.parts = function (a_parts, b_parts, index) {
	var diff;
	return ((a_parts.length - 1) < index && (b_parts.length - 1) < index) ? 0 : (!(diff = (+a_parts[index] || 0) - (+b_parts[index] || 0)) ? compareVersions.parts(a_parts, b_parts, index + 1) : (diff < 0 ? -1 : 1));
};

/**
 * Class for frontend translations
 * @class i18n
 */
function i18n() {}

/**
 * Initialize i18n library
 * @param {object} options
 * @param {string} url - url of local dictionaries
 * @param {string} [default_locale] - ISO code of default locale
 * @param {string} [external_url] - url of external dictionaries (required for external dictionaries)
 * @param {Object} [default_locale_dictionary] - dictionary that is build in application
 * @param {string} [version] - version of local dictionaries (required for external dictionaries)
 * @param {string} [project_name] - name of project (required for external dictionaries)
 * @param {boolean} [options.dynamic] - switches translate function from regular to dynamic
 * @param {function} [callback] - callback function called on i18n initialization
 * @returns {i18n}
 */
i18n.init = function (options, callback) {
	settings = options || {};
	polyglot = new Polyglot(settings);

	if (settings.default_locale) {
		default_locale = settings.default_locale;
		if (settings.default_locale_dictionary) {
			language_dictionaries[settings.default_locale] = settings.default_locale_dictionary;
		}
	}

	supported_languages = settings.supported_languages || supported_languages;
	checkExternalDictionary.call(this, function () {
		i18n.changeLanguage(default_locale, callback);
	});

	settings.expose && (window[settings.expose] = (settings.dynamic ? i18n.tDynamic : i18n.tRegular).bind(i18n));
};

i18n.getSupportedLanguages = function () {
	return supported_languages;
};

/**
 * @summary Check and download external dictionary, if it's missing or it's old fallback to local
 * @description First check if settings necessary for external loading are present. Then create request for remote dictionary version, compare this version with settings.version this property contains version of locale dictionary from app build process. If external version is higher than local download external dictionary and save that external version for that language so it's not checked another time and fallback directly to error handler. Error handler checks if there is dictionary already in memory so there will be no other xhr. 
 * @param {function} callback
 * @returns {undefined}
 */
function checkExternalDictionary(callback) {
	if (!settings.external_url || !settings.version) {
		logger.info('Missing settings for external dictionary');
		return callback();
	}

	this.download(settings.external_url + '/version.json', function (event) {
		var version;
		try {
			version = JSON.parse(event.target.responseText).version;
		} catch (error) {
			return callback();
		}
		if (compareVersions(version, settings.version) === 1) {
			settings.url = settings.external_url;
			this.download(settings.url + '/languages.json', function (event) {
				try {
					supported_languages = JSON.parse(event.target.responseText);
				} catch (e) {
					//
				}
				language_dictionaries = {};
				callback();
			}.bind(this));
		} else {
			callback();
		}
	}.bind(this), callback);
}

i18n.download = function (url, success, error) {
	var options = {
		url: url
	};
	new Request(options)
		.on('load', success)
		.on('error', error)
		.send();
};

function downloadDictionary(url, language, fn, error_fn) {
	fn = fn || function () {};
	error_fn = error_fn || fn;
	this.download(url, loadSuccess.bind(this, fn, language), loadError.bind(this, error_fn, language));
}

/**
 * Change output language. Automatically loads new language file if not loaded yet
 * @param {string} language
 * @param {function} fn
 * @param {function} error_fn
 * @returns {i18n}
 */
i18n.changeLanguage = function (language, fn, error_fn) {
	if (!supported_languages[language]) {
		return loadError.call(this, language + ' language not supported', error_fn || fn, language);
	}

	if (language_dictionaries[language]) {
		polyglot.extend(language_dictionaries[default_locale]);
		polyglot.extend(language_dictionaries[language]);
		polyglot.locale(language);
		fn && fn(language);
		return;
	}
	downloadDictionary.call(this, settings.url + '/' + language + '.json', language, fn, error_fn);
	return this;
};

/**
 * function to translate text
 * 
 * @returns {string}
 */
i18n.tRegular = function () {
	return polyglot.t.apply(polyglot, arguments);
};

/**
 * function to translate text, returns new lambda that will return translated string
 * 
 * @returns {function}
 */
i18n.tDynamic = function () {
	var args = arguments;
	return function () {
		return polyglot.t.apply(polyglot, args);
	};
};

i18n.t = i18n.tRegular;

/** 
 * @module @icewarp/i18n 
 * @requires @icewarp/request
 * @requires @icewarp/logger
 * @requires node-polyglot
 */
module.exports = i18n;

},{"./polyglot.js":159,"logger":"logger","request":"request"}],158:[function(require,module,exports){
/**
 * function to parse MD syntax
 * @param input input text to parse
 */
module.exports = function (input) {
	return input.replace(/(\*{1,2}|_{1,2})(.*?)\1/gi, function (match, m1, m2) {
		var tag = ['em', 'strong'][m1.length - 1];
		return '<' + tag + '>' + m2 + '</' + tag + '>';
	}).replace(/\[(.*?)\]\((.*?)\)/gi, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
};
},{}],159:[function(require,module,exports){
var logger = require('logger');
var Escape = require('@icewarp/escape-string');
var markdown = require('./markdown.js');
/**
 * Polyglot dictionary
 */
var phrases = {};
/**
 * Supress errors on missing translation
 * @type Boolean
 */
var allowMissing = false;
/**
 * Current locale
 * @type String
 */
var current_locale = '';
/**
 * Current plural type function
 * @type function
 */
var current_plural_type = null;
/**
 * Plural forms delimiter
 * @type String
 */
var delimiter = '||||';

var start_tag = '%{';

var end_tag = '}';

/**
 * Types of plural
 */
var pluralTypes = {
	chinese: function (n) {
		return 0;
	},
	german: function (n) {
		return n !== 1 ? 1 : 0;
	},
	french: function (n) {
		return n > 1 ? 1 : 0;
	},
	russian: function (n) {
		return n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2;
	},
	czech: function (n) {
		return (n === 1) ? 0 : (n >= 2 && n <= 4) ? 1 : 2;
	},
	polish: function (n) {
		return (n === 1 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
	},
	icelandic: function (n) {
		return (n % 10 !== 1 || n % 100 === 11) ? 1 : 0;
	}
};

/**
 * List of languages for each plural type
 */
var pluralTypeToLanguages = {
	chinese: ['fa', 'id', 'ja', 'ko', 'lo', 'ms', 'th', 'tr', 'zh'],
	german: ['da', 'de', 'en', 'es', 'fi', 'el', 'he', 'hu', 'it', 'nl', 'no', 'pt', 'sv'],
	french: ['fr', 'tl', 'pt-br'],
	russian: ['hr', 'ru'],
	czech: ['cs', 'sk'],
	polish: ['pl'],
	icelandic: ['is']
};

/**
 * Return type of plural for locale
 * @param {String} locale
 * @returns {String}
 */
function pluralType(locale) {
	for (var type in pluralTypeToLanguages) {
		if (~pluralTypeToLanguages[type].indexOf(locale)) {
			return type;
		}
	}
	return 'german';
}

/**
 * Return index of plural form for count
 * @param {Number} count
 * @returns {Number}
 */
function pluralIndex(count) {
	return pluralTypes[current_plural_type](count);
}

/**
 * Return plural translation for text specified by count
 * @param {String} text
 * @param {Number} count
 * @returns {String}
 */
function plural(text, count) {
	var texts = text.split(delimiter);
	return (texts[pluralIndex(count)] || texts[0]).trim();
}

/**
 * Substitute %{placeholder}'s for options[placeholder]'s
 * @param {String} phrase
 * @param {Object} options
 * @returns {String}
 */
function substitute(phrase, options) {
	if (Array.isArray(options)) {
		var _options = {};
		options.forEach(function (value, index) {
			_options[index] = value;
		});
		options = _options;
	}
	phrase = (options.md === void 0 || options.md) ? markdown(phrase) : phrase;
	var escape = options.escape === void 0 ? true : options.escape;
	delete(options.md);
	delete(options.escape);
	for (var arg in options) {
		phrase = phrase.replace(new RegExp(start_tag + arg + end_tag, 'g'), escape ? Escape(options[arg]) : options[arg]);
	}
	var substitution_index = 0;
	phrase = phrase.replace(/%s/g, function () {
		return options[substitution_index++];
	});
	return phrase;
}

/**
 * Polyglot class
 * @param {Object} options
 * @returns {Polyglot}
 */
function Polyglot(options) {
	options = options || {};
	allowMissing = !!options.allowMissing;
	options.delimiter && (delimiter = options.delimiter);
	options.start_tag && (start_tag = options.start_tag);
	options.end_tag && (end_tag = options.end_tag);
	this.locale(options.default_locale || 'en');
	this.extend(options.default_locale_dictionary || {});
}

/**
 * Get and/or set current_locale
 * @param {type} new_locale
 * @returns {String} current_locale
 */
Polyglot.prototype.locale = function (new_locale) {
	new_locale && (current_locale = new_locale) && (current_plural_type = pluralType(current_locale));
	return current_locale;
};

/**
 * Extend polyglot dictionary with morePhrases
 * @param {Object} morePhrases
 * @returns {Polyglot}
 */
Polyglot.prototype.extend = function (morePhrases) {
	for (var key in morePhrases) {
		var phrase = morePhrases[key];
		var prefixedKey = (arguments[1] || '') + key;
		if (typeof phrase === 'object') {
			this.extend(phrase, prefixedKey + '.');
		} else {
			phrases[prefixedKey] = phrase;
		}
	}
	return this;
};

/**
 * Translate function
 * @param {String} key
 * @param {Object} options
 * @returns {String}
 */
Polyglot.prototype.t = function (key, options, fallback) {
	options = (options === null || options === void 0) ? {} : (typeof options === 'number' ? {amount: options} : options);
	if (typeof phrases[key] !== 'string') {
		switch (typeof fallback) {
			case 'function':
				return fallback(key, options);
			case 'string':
				return fallback;
		}
		phrases[key] = key;
		allowMissing || logger.warning('Missing translation for key: "' + key + '"');
	}
	return substitute(plural(phrases[key], options.amount === void 0 ? 1 : (+options.amount || 1)), options);
};

/**
 * @module Polyglot
 */
module.exports = Polyglot;

},{"./markdown.js":158,"@icewarp/escape-string":155,"logger":"logger"}],160:[function(require,module,exports){
/**
 * array of objects (properties: object, index) to store their indexes
 */
var objects = [];

/**
 * Variable to store max window index
 * @type Number|maxIndex
 */
var maxIndex = 0;

/**
 * class to store and assign object indexes
 * @returns {IndexManager}
 */
function IndexManager() {}

/**
 * Add object to the storage and return its assigned index.
 * Index of a duplicate is overwritten by a new index
 * @param {object} object to store
 * @returns {Number} maxIndex
 */
IndexManager.add = function (object) {
	if (!objects.some(function (obj) {
		if (obj.object === object && obj.index !== maxIndex) {
			obj.index = ++maxIndex;
		}
		return obj.object === object;
	})) {
		objects.push({
			object: object,
			index: ++maxIndex
		});
	}
	return maxIndex;
};

/**
 * Remove object from the storage and return highest index
 * @param {object} object to remove
 * @returns {Number} maxIndex
 */
IndexManager.remove = function (object) {
	for (var i in objects) {
		if (objects[i].object === object) {
			objects.splice(i, 1);
			return maxIndex = objects.length ? maxIndex : 0;
		}
	}
};

/**
 * @module IndexManager
 * @exports IndexManager
 */
module.exports = IndexManager;

},{}],161:[function(require,module,exports){
/**
 * Options for IQ setup.
 * @typedef {Object} IQOptions
 * @property {array} arguments - array of arguments to be addet to IQ tag (Optional).
 * @property {string} id_attr - Custom rename of ID attribute (optional).
 * @property {string} format - Change format of response (optional).
 */

/**
 * Messages ID auto increment
 * @type Number
 */
var i = 1;
/**
 * Crate IQ message and handle response for it.
 * @class IQ
 * @param {IQOptions} options
 * @returns {IQ}
 */
function IQ(options) {
	options = options || {};
	/**
	 * IQ callbacks storage
	 * @type object
	 */
	this.iqs = {};
	/**
	 * Arguments to add to IQ
	 * @type Array
	 */
	this.arguments = options.arguments || [];
	/**
	 * Custom rename of ID attribute
	 * @type string
	 */
	this.id_attr = options.id_attr || 'id';
	/**
	 * Change type of response
	 * @type string
	 */
	this.format = options.format || 'text/xml';
	
	this.id = i++;
}
/**
 * Add attribute to IQ tag
 * @param {string} name
 * @param {*} value
 * @returns {undefined}
 */
IQ.prototype.addAttribute = function (name, value) {
	this.arguments.push({name: name, value: value});
	return this;
};
/**
 * Create IQ message, auto increment ID and save callbacks
 * @param {string} body
 * @param {object} callback
 * @returns {String}
 */
IQ.prototype.getIQ = function (body, callback) {
	this.iqs[this.id] = callback;
	return "<iq " + this.id_attr + '="' + this.id + '" ' + (this.arguments.map(function (argument) {
		return argument.name + '="' + argument.value + '" ';
	}).join(' ')) + " format=\"" + this.format + "\"><query " + (this.query.arguments.map(function (argument) {
		return argument.name + '="' + argument.value + '" ';
	}).join(' ')) + ">" + body + "</query></iq>";
};
/**
 * Process response and return callbacks by ID
 * @param {string} response
 * @returns {object}
 */
IQ.prototype.getCallbacks = function (response, id) {
	var xml = new DOMParser().parseFromString(response.replace(/>\s+</g, '><'), "text/xml");
	var iq;
	var callback;
	if ((iq = xml.getElementsByTagName('iq')).length) {
		callback = this.iqs[id || iq[0].getAttribute(this.id_attr)];
		delete this.iqs[id || iq[0].getAttribute(this.id_attr)];
		return {callback: callback, document: xml};
	}
	throw new Error("Malformed message");
};
/**
 * Get IQ by it's ID
 * @param {number} id
 * @returns {object}
 */
IQ.prototype.getCallbacksById = function (id) {
	return this.iqs[id];
};
/**
 * Get All pending IQs
 * @returns {object}
 */
IQ.prototype.getPendingIqs = function () {
	return this.iqs;
};
IQ.prototype.query = {
	arguments: [],
	addAttribute: function (name, value) {
		this.arguments.push({name: name, value: value});
		return this;
	}
};

module.exports = IQ;

},{}],162:[function(require,module,exports){
/**
 * @class Json
 */
var Json = {};

/**
 * Converts JSON object to XML string
 * @param {object} json
 * @returns {string} XML string
 */
Json.toXmlString = function(json) {
	if (Array.isArray(json)) {
		return json.map(function (item) {
			return this.toXmlString(item);
		}, this).join('');
	} else if (typeof json === 'object') {
		return Object.keys(json).map(function (key) {
			return '<' + key + '>' + this.toXmlString(json[key]) + '</' + key + '>';
		}, this).join('');
	}
	return json;
};

/**
 * Converts JSON object to XML object
 * @param {object} json
 * @returns {object} xml
 */
Json.toXml = function(json) {
	return this.XmlStringToXml(this.toXmlString(json));
};

/**
 * Parses XML string to XML
 * @param {string} xml xml string
 * @returns {object} XML
 */
Json.XmlStringToXml = function(xml) {
	return (new DOMParser()).parseFromString(xml, "text/xml");
};

/**
 * Converts XML to JSON
 * @param {object} xml
 * @returns {object} converted json
 */
Json.fromXml = function(xml) {
	var obj = {};

	if (xml.nodeType === 3 || (!(xml.attributes || []).length && !xml.hasChildNodes())) {
		return xml.nodeValue;
	}
	
	if ((xml.attributes || []).length > 0) {
		obj._attributes = {};
		for (var j = 0; j < xml.attributes.length; j++) {
			var attribute = xml.attributes.item(j);
			obj._attributes[attribute.nodeName] = attribute.nodeValue;
		}
	}

	for (var i = 0; i < (xml.childNodes || []).length; i++) {
		var item = xml.childNodes.item(i);
		var nodeName = item.nodeName;
		if (nodeName === '#text') {
			if(typeof obj === 'string') {
				obj += this.fromXml(item);
			} else {
				obj = this.fromXml(item);
			}
		} else if (obj[nodeName] === void 0) {
			obj[nodeName] = this.fromXml(item);
		} else {
			if (obj[nodeName].push === void 0) {
				var old = obj[nodeName];
				obj[nodeName] = [];
				obj[nodeName].push(old);
			}
			obj[nodeName].push(this.fromXml(item));
		}
	}
	return obj;
};

/**
 * Converts XML string to JSON
 * @param {type} xml
 * @returns {unresolved}
 */
Json.fromXmlString = function(xml) {
	return this.fromXml(this.XmlStringToXml(xml));
};

/**
 * @module Json
 */
module.exports = Json;

},{}],163:[function(require,module,exports){
function migrate() {
	for (var i = 0; i < localStorage.length; i++) {
		var key = localStorage.key(i);
		fakeEngine.setItem(key, localStorage.getItem(key));
	}
}

var fakeStorage = {};
var fakeEngine = {};

fakeEngine.getItem = function (key) {
	return fakeStorage[key];
};
fakeEngine.setItem = function (key, value) {
	fakeStorage[key] = value;
};
fakeEngine.removeItem = function (key) {
	delete(fakeStorage[key]);
};

var LocalStorage = {};
LocalStorage.getItem = function (key) {
	var value = _engine.getItem(key);
	try {
		return JSON.parse(value);
	} catch (e) {
		return value;
	}
};
LocalStorage.setItem = function (key, value) {
	try {
		_engine.setItem(key, JSON.stringify(value));
	} catch (e) {
		if (~['QUOTA_EXCEEDED_ERR', 'NS_ERROR_DOM_QUOTA_REACHED'].indexOf(e.name) || ~e.toString().indexOf("QUOTA_EXCEEDED_ERR") || ~e.toString().indexOf("QuotaExceededError")) {
			_engine = fakeEngine;
			migrate();
			return this.set(key, value);
		}
	}
	return this;
};
LocalStorage.removeItem = function (key) {
	_engine.removeItem(key);
	return this;
};

LocalStorage.setEngine = function (engine) {
	if(!engine.getItem) {
		throw new Error('Engine is missing getItem function');
	}
	if(!engine.setItem) {
		throw new Error('Engine is missing setItem function');
	}
	if(!engine.removeItem) {
		throw new Error('Engine is missing removeItem function');
	}
	_engine = engine;
};

var _engine = fakeEngine;
try {
	localStorage.setItem('_privateSafari', 'sucks');
	_engine = localStorage;
	localStorage.removeItem('_privateSafari');
} catch (e) {
	console.log('safari private');
}
module.exports = LocalStorage;

},{}],164:[function(require,module,exports){
var IQ = require('@icewarp/iq-protocol');
var Json = require('@icewarp/json-xml');
var processResponse = require('./processResponse');
var connections = {};
var main = 'default';

function createConnection(type) {
	this.setConnection(new OldCommunication.connections[type](this.getOptions()));
}
/**
 * @class OldCommunication
 * @param {number} type type of connection XHR|Scoket
 * @param {string} name will be used as ke for storing this instance in global storage
 * @param {object} options
 * @returns {OldCommunication}
 */
function OldCommunication(type, name, options) {
	this.host = options.host;
	this.email = options.email;
	this.subscriptions = options.subscriptions || [];
	this.password = options.password;
	this.login_type = options.login_type || OldCommunication.PLAIN;
	this.send_type = options.send_type || OldCommunication.XML;
	options.iq_options = options.iq_options || {};
	options.iq_options.id_attr = options.iq_options.id_attr || 'uid';
	this.iq = new IQ(options.iq_options);
	this.iq.query.addAttribute('xmlns', options.xmlns || "admin:iq:rpc");
	options.session_id && this.iq.addAttribute('sid', options.session_id);
	createConnection.call(this, type);
	connections[name || main] = this;
}
/**
 * @constant
 * XHR connection
 */
OldCommunication.XHR = 1;
/**
 * @constant
 * Socket connection
 */
OldCommunication.SOCKET = 2;
/**
 * @type {object}
 * @static
 * @description List of connection libs
 */
OldCommunication.connections = {};
OldCommunication.connections[OldCommunication.XHR] = require('@icewarp/xhr-connection');
OldCommunication.connections[OldCommunication.SOCKET] = require('socket');

/**
 * @constant
 * Plain auth const
 */
OldCommunication.PLAIN = 1;
/**
 * @constant
 * Auth via RSA digest
 */
OldCommunication.DIGEST = 2;

OldCommunication.XML = 'xml';

/**
 * @static
 * @type {object}
 * Error types
 */
OldCommunication.ERRORS = {
	UNSPECIFIED: 'unspecified',
	SERVER: 'server'
};

OldCommunication.prototype.callback = require('Callback');

OldCommunication.prototype.getOptions = function () {
	return {
		protocol: "xmpp",
		listeners: {
			onopen: {
				func: processResponse.onOpen,
				context: this
			},
			onclose: {
				func: processResponse.onClose,
				context: this
			},
			onerror: {
				func: processResponse.onError,
				context: this
			},
			onmessage: {
				func: processResponse.onMessage,
				context: this
			}
		},
		host: this.host
	};
};

/**
 *
 * @param {object} json
 * @param {@icewarp/Callback} callback
 * @returns {undefined}
 */
OldCommunication.prototype.send = function (json, callback) {
	this.connection.send(this.iq.getIQ(Json.toXmlString(json), callback), this.iq.id);
};
/**
 * Set chosen connection instance
 * @param {Xhr|Socket} connection
 * @returns {Xhr|Socket}
 */
OldCommunication.prototype.setConnection = function (connection) {
	return this.connection = connection;
};
/**
 * get OldCommunication from global storage
 * @param {string} name
 * @returns {OldCommunication}
 */
OldCommunication.getConnection = function (name) {
	if (!connections[name || main]) {
		throw new Error("Missing connection : " + name);
	}
	return connections[name || main];
};

module.exports = OldCommunication;

},{"./processResponse":165,"@icewarp/iq-protocol":161,"@icewarp/json-xml":162,"@icewarp/xhr-connection":174,"Callback":"Callback","socket":"socket"}],165:[function(require,module,exports){
var Json = require('@icewarp/json-xml');
var processResponse = {};

function processData(message) {
	var response = Json.fromXml(message.document.querySelector('iq'));
	if (response._attributes.type === 'error' || response.query.result === '0') {
		return this.callback(
			'error',
			message.callback,
			((response.query.error || {})._attributes || {}).uid || this.constructor.ERRORS.UNSPECIFIED,
			response
		);
	}
	this.callback('success', message.callback, response.query.result, response);
}

processResponse.onMessage = function (data, id) {
	processData.call(this, this.iq.getCallbacks(data, id));
};
processResponse.onError = function (id) {
	var iqs = [];
	if (id) {
		iqs = [this.iq.getCallbacksById(id)];
	} else {
		var iqs_obj = this.iq.getPendingIqs();
		for (var i in iqs_obj) {
			iqs.push(iqs_obj[i]);
		}
	}
	iqs.forEach(function (callback) {
		this.callback('error', callback, this.constructor.ERRORS.SERVER);
	}, this);
};
processResponse.onClose = function () {

};
processResponse.onOpen = function () {

};

module.exports = processResponse;

},{"@icewarp/json-xml":162}],166:[function(require,module,exports){
var QueryParams = {};
QueryParams.parse = function(query) {
	var parts = {};
	decodeURIComponent(query || location.search || '').replace(/^\?/, '').split('&').forEach(function (val) {
		var part = val.split('=');
		if(!part[0]) {
			return;
		}
		parts[part.splice(0, 1)] = part.join('=');
	});
	return parts;
};
QueryParams.stringify = function(parts) {
	return Object.keys(parts).map(function(key) {
		return encodeURIComponent(key) + '=' + encodeURIComponent(parts[key]);
	}).join('&');
};
module.exports = QueryParams;
},{}],167:[function(require,module,exports){

/*** client/inc/rsa/jsbn.js ***/
var dbits;
var canary = 0xdeadbeefcafe;
var j_lm = ((canary & 0xffffff) == 0xefcafe);
function BigInteger(a, b, c) {
	if (a != null)
		if ("number" == typeof a)
			this.fromNumber(a, b, c);
		else if (b == null && "string" != typeof a)
			this.fromString(a, 256);
		else
			this.fromString(a, b);
}
_me = BigInteger.prototype;
_me.toString = function (b) {
	if (this.s < 0)
		return "-" + this.negate().toString(b);
	var k;
	if (b == 16)
		k = 4;
	else if (b == 8)
		k = 3;
	else if (b == 2)
		k = 1;
	else if (b == 32)
		k = 5;
	else if (b == 4)
		k = 2;
	else
		return this.toRadix(b);
	var km = (1 << k) - 1, d, m = false, r = "", i = this.t;
	var p = this.DB - (i * this.DB) % k;
	if (i-- > 0) {
		if (p < this.DB && (d = this[i] >> p) > 0) {
			m = true;
			r = this.int2char(d);
		}
		while (i >= 0) {
			if (p < k) {
				d = (this[i] & ((1 << p) - 1)) << (k - p);
				d |= this[--i] >> (p += this.DB - k);
			} else {
				d = (this[i] >> (p -= k)) & km;
				if (p <= 0) {
					p += this.DB;
					--i;
				}
			}
			if (d > 0)
				m = true;
			if (m)
				r += this.int2char(d);
		}
	}
	return m ? r : "0";
}
_me.negate = function () {
	var r = nbi();
	BigInteger.ZERO.subTo(this, r);
	return r;
}
_me.abs = function () {
	return (this.s < 0) ? this.negate() : this;
}
_me.compareTo = function (a) {
	var r = this.s - a.s;
	if (r != 0)
		return r;
	var i = this.t;
	r = i - a.t;
	if (r != 0)
		return r;
	while (--i >= 0)
		if ((r = this[i] - a[i]) != 0)
			return r;
	return 0;
}
_me.bitLength = function () {
	if (this.t <= 0)
		return 0;
	return this.DB * (this.t - 1) + this.nbits(this[this.t - 1] ^ (this.s & this.DM));
}
_me.mod = function (a) {
	var r = nbi();
	this.abs().divRemTo(a, null, r);
	if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0)
		a.subTo(r, r);
	return r;
}
_me.modPowInt = function (e, m) {
	var z;
	if (e < 256 || m.isEven())
		z = new Classic(m);
	else
		z = new Montgomery(m);
	return this.exp(e, z);
}
function nbi() {
	return new BigInteger(null);
}
function am1(i, x, w, j, c, n) {
	while (--n >= 0) {
		var v = x * this[i++] + w[j] + c;
		c = Math.floor(v / 0x4000000);
		w[j++] = v & 0x3ffffff;
	}
	return c;
}
function am2(i, x, w, j, c, n) {
	var xl = x & 0x7fff, xh = x >> 15;
	while (--n >= 0) {
		var l = this[i] & 0x7fff;
		var h = this[i++] >> 15;
		var m = xh * l + h * xl;
		l = xl * l + ((m & 0x7fff) << 15) + w[j] + (c & 0x3fffffff);
		c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
		w[j++] = l & 0x3fffffff;
	}
	return c;
}
function am3(i, x, w, j, c, n) {
	var xl = x & 0x3fff, xh = x >> 14;
	while (--n >= 0) {
		var l = this[i] & 0x3fff;
		var h = this[i++] >> 14;
		var m = xh * l + h * xl;
		l = xl * l + ((m & 0x3fff) << 14) + w[j] + c;
		c = (l >> 28) + (m >> 14) + xh * h;
		w[j++] = l & 0xfffffff;
	}
	return c;
}
if (j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
	BigInteger.prototype.am = am2;
	dbits = 30;
} else if (j_lm && (navigator.appName != "Netscape")) {
	BigInteger.prototype.am = am1;
	dbits = 26;
} else {
	BigInteger.prototype.am = am3;
	dbits = 28;
}
BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = ((1 << dbits) - 1);
BigInteger.prototype.DV = (1 << dbits);
var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2, BI_FP);
BigInteger.prototype.F1 = BI_FP - dbits;
BigInteger.prototype.F2 = 2 * dbits - BI_FP;
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
var BI_RC = new Array();
var rr, vv;
rr = "0".charCodeAt(0);
for (vv = 0; vv <= 9; ++vv)
	BI_RC[rr++] = vv;
rr = "a".charCodeAt(0);
for (vv = 10; vv < 36; ++vv)
	BI_RC[rr++] = vv;
rr = "A".charCodeAt(0);
for (vv = 10; vv < 36; ++vv)
	BI_RC[rr++] = vv;
_me.int2char = function (n) {
	return BI_RM.charAt(n);
}
_me.intAt = function (s, i) {
	var c = BI_RC[s.charCodeAt(i)];
	return (c == null) ? -1 : c;
}
_me.copyTo = function (r) {
	for (var i = this.t - 1; i >= 0; --i)
		r[i] = this[i];
	r.t = this.t;
	r.s = this.s;
}
_me.fromInt = function (x) {
	this.t = 1;
	this.s = (x < 0) ? -1 : 0;
	if (x > 0)
		this[0] = x;
	else if (x < -1)
		this[0] = x + DV;
	else
		this.t = 0;
}
function nbv(i) {
	var r = nbi();
	r.fromInt(i);
	return r;
}
_me.fromString = function (s, b) {
	var k;
	if (b == 16)
		k = 4;
	else if (b == 8)
		k = 3;
	else if (b == 256)
		k = 8;
	else if (b == 2)
		k = 1;
	else if (b == 32)
		k = 5;
	else if (b == 4)
		k = 2;
	else {
		this.fromRadix(s, b);
		return;
	}
	this.t = 0;
	this.s = 0;
	var i = s.length, mi = false, sh = 0;
	while (--i >= 0) {
		var x = (k == 8) ? s[i] & 0xff : this.intAt(s, i);
		if (x < 0) {
			if (s.charAt(i) == "-")
				mi = true;
			continue;
		}
		mi = false;
		if (sh == 0)
			this[this.t++] = x;
		else if (sh + k > this.DB) {
			this[this.t - 1] |= (x & ((1 << (this.DB - sh)) - 1)) << sh;
			this[this.t++] = (x >> (this.DB - sh));
		} else
			this[this.t - 1] |= x << sh;
		sh += k;
		if (sh >= this.DB)
			sh -= this.DB;
	}
	if (k == 8 && (s[0] & 0x80) != 0) {
		this.s = -1;
		if (sh > 0)
			this[this.t - 1] |= ((1 << (this.DB - sh)) - 1) << sh;
	}
	this.clamp();
	if (mi)
		BigInteger.ZERO.subTo(this, this);
}
_me.clamp = function () {
	var c = this.s & this.DM;
	while (this.t > 0 && this[this.t - 1] == c)
		--this.t;
}
_me.nbits = function (x) {
	var r = 1, t;
	if ((t = x >>> 16) != 0) {
		x = t;
		r += 16;
	}
	if ((t = x >> 8) != 0) {
		x = t;
		r += 8;
	}
	if ((t = x >> 4) != 0) {
		x = t;
		r += 4;
	}
	if ((t = x >> 2) != 0) {
		x = t;
		r += 2;
	}
	if ((t = x >> 1) != 0) {
		x = t;
		r += 1;
	}
	return r;
}
_me.dlShiftTo = function (n, r) {
	var i;
	for (i = this.t - 1; i >= 0; --i)
		r[i + n] = this[i];
	for (i = n - 1; i >= 0; --i)
		r[i] = 0;
	r.t = this.t + n;
	r.s = this.s;
}
_me.drShiftTo = function (n, r) {
	for (var i = n; i < this.t; ++i)
		r[i - n] = this[i];
	r.t = Math.max(this.t - n, 0);
	r.s = this.s;
}
_me.lShiftTo = function (n, r) {
	var bs = n % this.DB;
	var cbs = this.DB - bs;
	var bm = (1 << cbs) - 1;
	var ds = Math.floor(n / this.DB), c = (this.s << bs) & this.DM, i;
	for (i = this.t - 1; i >= 0; --i) {
		r[i + ds + 1] = (this[i] >> cbs) | c;
		c = (this[i] & bm) << bs;
	}
	for (i = ds - 1; i >= 0; --i)
		r[i] = 0;
	r[ds] = c;
	r.t = this.t + ds + 1;
	r.s = this.s;
	r.clamp();
}
_me.rShiftTo = function (n, r) {
	r.s = this.s;
	var ds = Math.floor(n / this.DB);
	if (ds >= this.t) {
		r.t = 0;
		return;
	}
	var bs = n % this.DB;
	var cbs = this.DB - bs;
	var bm = (1 << bs) - 1;
	r[0] = this[ds] >> bs;
	for (var i = ds + 1; i < this.t; ++i) {
		r[i - ds - 1] |= (this[i] & bm) << cbs;
		r[i - ds] = this[i] >> bs;
	}
	if (bs > 0)
		r[this.t - ds - 1] |= (this.s & bm) << cbs;
	r.t = this.t - ds;
	r.clamp();
}
_me.subTo = function (a, r) {
	var i = 0, c = 0, m = Math.min(a.t, this.t);
	while (i < m) {
		c += this[i] - a[i];
		r[i++] = c & this.DM;
		c >>= this.DB;
	}
	if (a.t < this.t) {
		c -= a.s;
		while (i < this.t) {
			c += this[i];
			r[i++] = c & this.DM;
			c >>= this.DB;
		}
		c += this.s;
	} else {
		c += this.s;
		while (i < a.t) {
			c -= a[i];
			r[i++] = c & this.DM;
			c >>= this.DB;
		}
		c -= a.s;
	}
	r.s = (c < 0) ? -1 : 0;
	if (c < -1)
		r[i++] = this.DV + c;
	else if (c > 0)
		r[i++] = c;
	r.t = i;
	r.clamp();
}
_me.multiplyTo = function (a, r) {
	var x = this.abs(), y = a.abs();
	var i = x.t;
	r.t = i + y.t;
	while (--i >= 0)
		r[i] = 0;
	for (i = 0; i < y.t; ++i)
		r[i + x.t] = x.am(0, y[i], r, i, 0, x.t);
	r.s = 0;
	r.clamp();
	if (this.s != a.s)
		BigInteger.ZERO.subTo(r, r);
}
_me.squareTo = function (r) {
	var x = this.abs();
	var i = r.t = 2 * x.t;
	while (--i >= 0)
		r[i] = 0;
	for (i = 0; i < x.t - 1; ++i) {
		var c = x.am(i, x[i], r, 2 * i, 0, 1);
		if ((r[i + x.t] += x.am(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
			r[i + x.t] -= x.DV;
			r[i + x.t + 1] = 1;
		}
	}
	if (r.t > 0)
		r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1);
	r.s = 0;
	r.clamp();
}
_me.divRemTo = function (m, q, r) {
	var pm = m.abs();
	if (pm.t <= 0)
		return;
	var pt = this.abs();
	if (pt.t < pm.t) {
		if (q != null)
			q.fromInt(0);
		if (r != null)
			this.copyTo(r);
		return;
	}
	if (r == null)
		r = nbi();
	var y = nbi(), ts = this.s, ms = m.s;
	var nsh = this.DB - this.nbits(pm[pm.t - 1]);
	if (nsh > 0) {
		pm.lShiftTo(nsh, y);
		pt.lShiftTo(nsh, r);
	} else {
		pm.copyTo(y);
		pt.copyTo(r);
	}
	var ys = y.t;
	var y0 = y[ys - 1];
	if (y0 == 0)
		return;
	var yt = y0 * (1 << this.F1) + ((ys > 1) ? y[ys - 2] >> this.F2 : 0);
	var d1 = this.FV / yt, d2 = (1 << this.F1) / yt, e = 1 << this.F2;
	var i = r.t, j = i - ys, t = (q == null) ? nbi() : q;
	y.dlShiftTo(j, t);
	if (r.compareTo(t) >= 0) {
		r[r.t++] = 1;
		r.subTo(t, r);
	}
	BigInteger.ONE.dlShiftTo(ys, t);
	t.subTo(y, y);
	while (y.t < ys)
		y[y.t++] = 0;
	while (--j >= 0) {
		var qd = (r[--i] == y0) ? this.DM : Math.floor(r[i] * d1 + (r[i - 1] + e) * d2);
		if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd) {
			y.dlShiftTo(j, t);
			r.subTo(t, r);
			while (r[i] < --qd)
				r.subTo(t, r);
		}
	}
	if (q != null) {
		r.drShiftTo(ys, q);
		if (ts != ms)
			BigInteger.ZERO.subTo(q, q);
	}
	r.t = ys;
	r.clamp();
	if (nsh > 0)
		r.rShiftTo(nsh, r);
	if (ts < 0)
		BigInteger.ZERO.subTo(r, r);
}
_me.invDigit = function () {
	if (this.t < 1)
		return 0;
	var x = this[0];
	if ((x & 1) == 0)
		return 0;
	var y = x & 3;
	y = (y * (2 - (x & 0xf) * y)) & 0xf;
	y = (y * (2 - (x & 0xff) * y)) & 0xff;
	y = (y * (2 - (((x & 0xffff) * y) & 0xffff))) & 0xffff;
	y = (y * (2 - x * y % this.DV)) % this.DV;
	return (y > 0) ? this.DV - y : -y;
}
_me.isEven = function () {
	return ((this.t > 0) ? (this[0] & 1) : this.s) == 0;
}
_me.exp = function (e, z) {
	if (e > 0xffffffff || e < 1)
		return BigInteger.ONE;
	var r = nbi(), r2 = nbi(), g = z.convert(this), i = this.nbits(e) - 1;
	g.copyTo(r);
	while (--i >= 0) {
		z.sqrTo(r, r2);
		if ((e & (1 << i)) > 0)
			z.mulTo(r2, g, r);
		else {
			var t = r;
			r = r2;
			r2 = t;
		}
	}
	return z.revert(r);
}
function Classic(m) {
	this.m = m;
}
_me = Classic.prototype;
_me.convert = function (x) {
	if (x.s < 0 || x.compareTo(this.m) >= 0)
		return x.mod(this.m);
	else
		return x;
}
_me.revert = function (x) {
	return x;
}
_me.reduce = function (x) {
	x.divRemTo(this.m, null, x);
}
_me.mulTo = function (x, y, r) {
	x.multiplyTo(y, r);
	this.reduce(r);
}
_me.sqrTo = function (x, r) {
	x.squareTo(r);
	this.reduce(r);
}
function Montgomery(m) {
	this.m = m;
	this.mp = m.invDigit();
	this.mpl = this.mp & 0x7fff;
	this.mph = this.mp >> 15;
	this.um = (1 << (m.DB - 15)) - 1;
	this.mt2 = 2 * m.t;
}
_me = Montgomery.prototype;
_me.convert = function (x) {
	var r = nbi();
	x.abs().dlShiftTo(this.m.t, r);
	r.divRemTo(this.m, null, r);
	if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0)
		this.m.subTo(r, r);
	return r;
}
_me.revert = function (x) {
	var r = nbi();
	x.copyTo(r);
	this.reduce(r);
	return r;
}
_me.reduce = function (x) {
	while (x.t <= this.mt2)
		x[x.t++] = 0;
	for (var i = 0; i < this.m.t; ++i) {
		var j = x[i] & 0x7fff;
		var u0 = (j * this.mpl + (((j * this.mph + (x[i] >> 15) * this.mpl) & this.um) << 15)) & x.DM;
		j = i + this.m.t;
		x[j] += this.m.am(0, u0, x, i, 0, this.m.t);
		while (x[j] >= x.DV) {
			x[j] -= x.DV;
			x[++j]++;
		}
	}
	x.clamp();
	x.drShiftTo(this.m.t, x);
	if (x.compareTo(this.m) >= 0)
		x.subTo(this.m, x);
}
_me.sqrTo = function (x, r) {
	x.squareTo(r);
	this.reduce(r);
}
_me.mulTo = function (x, y, r) {
	x.multiplyTo(y, r);
	this.reduce(r);
}
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);

/*** client/inc/rsa/prng4.js ***/
function Arcfour() {
	this.i = 0;
	this.j = 0;
	this.S = new Array();
}
_me = Arcfour.prototype;
_me.init = function (key) {
	var i, j, t;
	for (i = 0; i < 256; ++i)
		this.S[i] = i;
	j = 0;
	for (i = 0; i < 256; ++i) {
		j = (j + this.S[i] + key[i % key.length]) & 255;
		t = this.S[i];
		this.S[i] = this.S[j];
		this.S[j] = t;
	}
	this.i = 0;
	this.j = 0;
}
_me.next = function () {
	var t;
	this.i = (this.i + 1) & 255;
	this.j = (this.j + this.S[this.i]) & 255;
	t = this.S[this.i];
	this.S[this.i] = this.S[this.j];
	this.S[this.j] = t;
	return this.S[(t + this.S[this.i]) & 255];
}
function prng_newstate() {
	return new Arcfour();
}
var rng_psize = 256;

/*** client/inc/rsa/rng.js ***/
var rng_state;
var rng_pool;
var rng_pptr;
function SecureRandom() {}
_me = SecureRandom.prototype;
_me.nextBytes = function rng_get_bytes(ba) {
	var i;
	for (i = 0; i < ba.length; ++i)
		ba[i] = this.rng_get_byte();
}
function rng_seed_int(x) {
	rng_pool[rng_pptr++] ^= x & 255;
	rng_pool[rng_pptr++] ^= (x >> 8) & 255;
	rng_pool[rng_pptr++] ^= (x >> 16) & 255;
	rng_pool[rng_pptr++] ^= (x >> 24) & 255;
	if (rng_pptr >= rng_psize)
		rng_pptr -= rng_psize;
}
function rng_seed_time() {
	rng_seed_int(new Date().getTime());
}
if (rng_pool == null) {
	rng_pool = new Array();
	rng_pptr = 0;
	var t;
	if (navigator.appName == "Netscape" && navigator.appVersion < "5" && window.crypto) {
		var z = window.crypto.random(32);
		for (t = 0; t < z.length; ++t)
			rng_pool[rng_pptr++] = z.charCodeAt(t) & 255;
	}
	while (rng_pptr < rng_psize) {
		t = Math.floor(65536 * Math.random());
		rng_pool[rng_pptr++] = t >>> 8;
		rng_pool[rng_pptr++] = t & 255;
	}
	rng_pptr = 0;
	rng_seed_time();
}
_me.rng_get_byte = function () {
	if (rng_state == null) {
		rng_seed_time();
		rng_state = prng_newstate();
		rng_state.init(rng_pool);
		for (rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr)
			rng_pool[rng_pptr] = 0;
		rng_pptr = 0;
	}
	return rng_state.next();
}

/*** client/inc/rsa/rsa.js ***/
function RSAKey() {
	this.n = null;
	this.e = 0;
	this.d = null;
	this.p = null;
	this.q = null;
	this.dmp1 = null;
	this.dmq1 = null;
	this.coeff = null;
}
_me = RSAKey.prototype;
_me.setPublic = function (N, E) {
	if (N != null && E != null && N.length > 0 && E.length > 0) {
		this.n = this.parseBigInt(N, 16);
		this.e = parseInt(E, 16);
	} else
		throw "Invalid RSA public key";
}
_me.encrypt = function (text) {
	var m = this.pkcs1pad2(text, (this.n.bitLength() + 7) >> 3);
	if (m == null)
		return null;
	var c = this.doPublic(m);
	if (c == null)
		return null;
	var h = c.toString(16);
	if ((h.length & 1) == 0)
		return h;
	else
		return "0" + h;
}
_me.parseBigInt = function (str, r) {
	return new BigInteger(str, r);
}
_me.linebrk = function (s, n) {
	var ret = "";
	var i = 0;
	while (i + n < s.length) {
		ret += s.substring(i, i + n) + "\n";
		i += n;
	}
	return ret + s.substring(i, s.length);
}
_me.byte2Hex = function (b) {
	if (b < 0x10)
		return "0" + b.toString(16);
	else
		return b.toString(16);
}
_me.pkcs1pad2 = function (s, n) {
	if (n < s.length + 11) {
		throw "Message too long for RSA";
		return null;
	}
	var ba = new Array();
	var i = s.length - 1;
	while (i >= 0 && n > 0)
		ba[--n] = s.charCodeAt(i--);
	ba[--n] = 0;
	var rng = new SecureRandom();
	var x = new Array();
	while (n > 2) {
		x[0] = 0;
		while (x[0] == 0)
			rng.nextBytes(x);
		ba[--n] = x[0];
	}
	ba[--n] = 2;
	ba[--n] = 0;
	return new BigInteger(ba);
}
_me.doPublic = function (x) {
	return x.modPowInt(this.e, this.n);
}

module.exports = RSAKey;
},{}],168:[function(require,module,exports){
var StringUtils = require('./string.js');
var Utils = {};

var supress_animations = false;
/**
 * Supress animations
 */
Utils.supress = function () {
	document.body.classList.add('no-animation');
	supress_animations = true;
};

/**
 * Allow animations
 */
Utils.allow = function () {
	document.body.classList.remove('no-animation');
	supress_animations = false;
};

/**
 * Returns whether animations are enabled
 * @returns {Boolean}
 */
Utils.allowed = function () {
	return !supress_animations;
};

/**
 * Return supported browser event type
 * @param {String} event
 * @returns {String|Boolean} Supported event type or false
 */
Utils.browserEvent = function (event) {
	if (!this.allowed()) {
		return false;
	}
	if (('on' + event) in window || event.replace(/end|start|update$/, '') in document.body.style) {
		return event;
	}
	if (('onwebkit' + event) in window) {
		return 'webkit' + StringUtils.capitalize(event[0]).replace(/(end|start|update)$/, StringUtils.capitalize);
	}
	return false;
};

module.exports = Utils;
},{"./string.js":172}],169:[function(require,module,exports){
var Utils = {};

/**
 * Detect if the browser is IE 9+
 * @returns {Boolean}
 */
Utils.isIE = function () {
	return !!(window.ActiveXObject || "ActiveXObject" in window);
};

/**
 * Detect if the browser is MS Edge
 * @returns {Boolean}
 */
Utils.isEdge = function () {
	return !Utils.isIE() && !!window.StyleMedia;
};

module.exports = Utils;
},{}],170:[function(require,module,exports){
var Utils = {};

/**
 * Push items from arr array to data object
 * @param {*} data
 * @param {*} arr
 * @returns {Utils.push.data}
 */
Utils.push = function (data, arr) {
	data = data || [];
	[].push.apply(data, Array.isArray(arr) ? arr : [arr]);
	data = data.filter(function (value, index) {
		return value !== void 0 && data.indexOf(value) === index;
	});
	return data;
};

/**
 * Push items from arr array to data property
 * @param {Object} data
 * @param {String} property
 * @param {*} arr
 * @returns {Array}
 */
Utils.pushToProperty = function (data, property, arr) {
	if (data === void 0) {
		return data;
	}
	data[property] = data[property] || [];
	[].push.apply(data[property], Array.isArray(arr) ? arr : [arr]);
	data[property] = data[property].filter(function (value, index) {
		return value !== void 0 && data[property].indexOf(value) === index;
	});
	return data;
};

Utils.splice = function (array, item) {
	if (!Array.isArray(array)) {
		return false;
	}
	if (Array.isArray(item)) {
		return item.forEach(function (i) {
			Utils.splice(array, i);
		});
	}
	array.splice(array.indexOf(item), 1);
};

module.exports = Utils;
},{}],171:[function(require,module,exports){
var Utils = {};

Utils.enabled = function () {
	return document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled;
};

Utils.element = function () {
	return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
};

Utils.exit = function () {
	(document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen || function () {}).bind(document)();
};

Utils.request = function (element) {
	(element.requestFullscreen || element.webkitRequestFullscreen || element.mozRequestFullScreen || element.msRequestFullscreen || function () {}).bind(element)();
};

module.exports = Utils;
},{}],172:[function(require,module,exports){
var Utils = {};

/**
 * Capitalize string
 * @param {String} string
 * @returns {String} capitalized string
 */
Utils.capitalize = function (string) {
	return string[0].toUpperCase() + string.slice(1);
};

module.exports = Utils;
},{}],173:[function(require,module,exports){
var Utils = {};

Utils.animations = require('./src/animations.js');
Utils.browser = require('./src/browser.js');
Utils.data = require('./src/data.js');
Utils.fullscreen = require('./src/fullscreen.js');
Utils.string = require('./src/string.js');

module.exports = Utils;
},{"./src/animations.js":168,"./src/browser.js":169,"./src/data.js":170,"./src/fullscreen.js":171,"./src/string.js":172}],174:[function(require,module,exports){
var Request = require('request');

function onLoad(id, event, response) {
	this.onMessage && this.onMessage.func.call(this.onMessage.context || this, response.response || response.responseText, id);
}
function onError(id, event, response) {
	this.onError && this.onError.func.call(this.onError.context || this, id);
}

function XHRConnection(options) {
	options.listeners = options.listeners || {};
	this.onMessage = options.listeners.onmessage;
	this.onError = options.listeners.onerror;
	this.host = options.host;
}

XHRConnection.prototype.send = function (payload, id) {
	var request = new Request({
		url: this.host,
		method: "POST"
	});
	request.on('load', onLoad.bind(this, id));
	request.on('error', onError.bind(this, id));
	request.on('abort', onError.bind(this, id));
	request.send(payload);
};

module.exports = XHRConnection;

},{"request":"request"}],175:[function(require,module,exports){
(function (global){(function (){
/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define('punycode', function() {
			return punycode;
		});
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],176:[function(require,module,exports){
/*
 * classList.js: Cross-browser full element.classList implementation.
 * 1.1.20170427
 *
 * By Eli Grey, http://eligrey.com
 * License: Dedicated to the public domain.
 *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */

if ("document" in window.self) {

// Full polyfill for browsers with no classList support
// Including IE < Edge missing SVGElement.classList
if (!("classList" in document.createElement("_")) 
	|| document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg","g"))) {

(function (view) {

"use strict";

if (!('Element' in view)) return;

var
	  classListProp = "classList"
	, protoProp = "prototype"
	, elemCtrProto = view.Element[protoProp]
	, objCtr = Object
	, strTrim = String[protoProp].trim || function () {
		return this.replace(/^\s+|\s+$/g, "");
	}
	, arrIndexOf = Array[protoProp].indexOf || function (item) {
		var
			  i = 0
			, len = this.length
		;
		for (; i < len; i++) {
			if (i in this && this[i] === item) {
				return i;
			}
		}
		return -1;
	}
	// Vendors: please allow content code to instantiate DOMExceptions
	, DOMEx = function (type, message) {
		this.name = type;
		this.code = DOMException[type];
		this.message = message;
	}
	, checkTokenAndGetIndex = function (classList, token) {
		if (token === "") {
			throw new DOMEx(
				  "SYNTAX_ERR"
				, "An invalid or illegal string was specified"
			);
		}
		if (/\s/.test(token)) {
			throw new DOMEx(
				  "INVALID_CHARACTER_ERR"
				, "String contains an invalid character"
			);
		}
		return arrIndexOf.call(classList, token);
	}
	, ClassList = function (elem) {
		var
			  trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
			, classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
			, i = 0
			, len = classes.length
		;
		for (; i < len; i++) {
			this.push(classes[i]);
		}
		this._updateClassName = function () {
			elem.setAttribute("class", this.toString());
		};
	}
	, classListProto = ClassList[protoProp] = []
	, classListGetter = function () {
		return new ClassList(this);
	}
;
// Most DOMException implementations don't allow calling DOMException's toString()
// on non-DOMExceptions. Error's toString() is sufficient here.
DOMEx[protoProp] = Error[protoProp];
classListProto.item = function (i) {
	return this[i] || null;
};
classListProto.contains = function (token) {
	token += "";
	return checkTokenAndGetIndex(this, token) !== -1;
};
classListProto.add = function () {
	var
		  tokens = arguments
		, i = 0
		, l = tokens.length
		, token
		, updated = false
	;
	do {
		token = tokens[i] + "";
		if (checkTokenAndGetIndex(this, token) === -1) {
			this.push(token);
			updated = true;
		}
	}
	while (++i < l);

	if (updated) {
		this._updateClassName();
	}
};
classListProto.remove = function () {
	var
		  tokens = arguments
		, i = 0
		, l = tokens.length
		, token
		, updated = false
		, index
	;
	do {
		token = tokens[i] + "";
		index = checkTokenAndGetIndex(this, token);
		while (index !== -1) {
			this.splice(index, 1);
			updated = true;
			index = checkTokenAndGetIndex(this, token);
		}
	}
	while (++i < l);

	if (updated) {
		this._updateClassName();
	}
};
classListProto.toggle = function (token, force) {
	token += "";

	var
		  result = this.contains(token)
		, method = result ?
			force !== true && "remove"
		:
			force !== false && "add"
	;

	if (method) {
		this[method](token);
	}

	if (force === true || force === false) {
		return force;
	} else {
		return !result;
	}
};
classListProto.toString = function () {
	return this.join(" ");
};

if (objCtr.defineProperty) {
	var classListPropDesc = {
		  get: classListGetter
		, enumerable: true
		, configurable: true
	};
	try {
		objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
	} catch (ex) { // IE 8 doesn't support enumerable:true
		// adding undefined to fight this issue https://github.com/eligrey/classList.js/issues/36
		// modernie IE8-MSW7 machine has IE8 8.0.6001.18702 and is affected
		if (ex.number === undefined || ex.number === -0x7FF5EC54) {
			classListPropDesc.enumerable = false;
			objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
		}
	}
} else if (objCtr[protoProp].__defineGetter__) {
	elemCtrProto.__defineGetter__(classListProp, classListGetter);
}

}(window.self));

}

// There is full or partial native classList support, so just check if we need
// to normalize the add/remove and toggle APIs.

(function () {
	"use strict";

	var testElement = document.createElement("_");

	testElement.classList.add("c1", "c2");

	// Polyfill for IE 10/11 and Firefox <26, where classList.add and
	// classList.remove exist but support only one argument at a time.
	if (!testElement.classList.contains("c2")) {
		var createMethod = function(method) {
			var original = DOMTokenList.prototype[method];

			DOMTokenList.prototype[method] = function(token) {
				var i, len = arguments.length;

				for (i = 0; i < len; i++) {
					token = arguments[i];
					original.call(this, token);
				}
			};
		};
		createMethod('add');
		createMethod('remove');
	}

	testElement.classList.toggle("c3", false);

	// Polyfill for IE 10 and Firefox <24, where classList.toggle does not
	// support the second argument.
	if (testElement.classList.contains("c3")) {
		var _toggle = DOMTokenList.prototype.toggle;

		DOMTokenList.prototype.toggle = function(token, force) {
			if (1 in arguments && !this.contains(token) === !force) {
				return force;
			} else {
				return _toggle.call(this, token);
			}
		};

	}

	testElement = null;
}());

}

},{}],177:[function(require,module,exports){
module.exports = function(arr, obj){
  if (arr.indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
},{}],178:[function(require,module,exports){
'use strict';

require('./index').polyfill();

},{"./index":179}],179:[function(require,module,exports){
/**
 * Code refactored from Mozilla Developer Network:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 */

'use strict';

function assign(target, firstSource) {
  if (target === undefined || target === null) {
    throw new TypeError('Cannot convert first argument to object');
  }

  var to = Object(target);
  for (var i = 1; i < arguments.length; i++) {
    var nextSource = arguments[i];
    if (nextSource === undefined || nextSource === null) {
      continue;
    }

    var keysArray = Object.keys(Object(nextSource));
    for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
      var nextKey = keysArray[nextIndex];
      var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
      if (desc !== undefined && desc.enumerable) {
        to[nextKey] = nextSource[nextKey];
      }
    }
  }
  return to;
}

function polyfill() {
  if (!Object.assign) {
    Object.defineProperty(Object, 'assign', {
      enumerable: false,
      configurable: true,
      writable: true,
      value: assign
    });
  }
}

module.exports = {
  assign: assign,
  polyfill: polyfill
};

},{}],180:[function(require,module,exports){

var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

module.exports = function forEach (obj, fn, ctx) {
    if (toString.call(fn) !== '[object Function]') {
        throw new TypeError('iterator must be a function');
    }
    var l = obj.length;
    if (l === +l) {
        for (var i = 0; i < l; i++) {
            fn.call(ctx, obj[i], i, obj);
        }
    } else {
        for (var k in obj) {
            if (hasOwn.call(obj, k)) {
                fn.call(ctx, obj[k], k, obj);
            }
        }
    }
};


},{}],181:[function(require,module,exports){
var each = require('each'),
	indexOf = require('indexof');

var getFragment = function( url ){

	var url = url || window.location.href;
	return url.replace( /^[^#]*#?(.*)$/, '$1' );

};

var HashChange = function(){

	var self = this;

	this.onChangeCallbacks = [];

	window.addEventListener("hashchange", function(e){
		
		self.hashChanged( getFragment(e.newURL) );

	}, false);

	return this;

};

HashChange.prototype = {

	update : function( callback ){

		if(callback){

			this.onChangeCallbacks.push( callback );
			return this;

		} else {

			this.hashChanged( getFragment() );

		}

	},

	unbind : function( callback ){

		var i = indexOf( this.onChangeCallbacks , callback);

		if(i !== -1){

			this.onChangeCallbacks.splice(i - 1, 1);

		}

		return this;

	},
	
	updateHash : function( hash ){
 
			this.currentHash = hash;
 
			window.location.href = window.location.href.replace( /#.*/, '') + '#' + hash;
 
		},

	hashChanged : function( frag ){

		if(this.onChangeCallbacks.length){

			each(this.onChangeCallbacks, function( callback ){

				callback( frag );

				return true;

			});

		}

		return this;

	},


}

hashChange = new HashChange();

module.exports = hashChange;

},{"each":180,"indexof":177}],182:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _linkify = require('./linkify');

var linkify = _interopRequireWildcard(_linkify);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var tokenize = linkify.tokenize,
    options = linkify.options; /**
                               	Convert strings of text into linkable HTML text
                               */

var Options = options.Options;


function escapeText(text) {
	return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttr(href) {
	return href.replace(/"/g, '&quot;');
}

function attributesToString(attributes) {
	if (!attributes) {
		return '';
	}
	var result = [];

	for (var attr in attributes) {
		var val = attributes[attr] + '';
		result.push(attr + '="' + escapeAttr(val) + '"');
	}
	return result.join(' ');
}

function linkifyStr(str) {
	var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	opts = new Options(opts);

	var tokens = tokenize(str);
	var result = [];

	for (var i = 0; i < tokens.length; i++) {
		var token = tokens[i];

		if (token.type === 'nl' && opts.nl2br) {
			result.push('<br>\n');
			continue;
		} else if (!token.isLink || !opts.check(token)) {
			result.push(escapeText(token.toString()));
			continue;
		}

		var _opts$resolve = opts.resolve(token),
		    formatted = _opts$resolve.formatted,
		    formattedHref = _opts$resolve.formattedHref,
		    tagName = _opts$resolve.tagName,
		    className = _opts$resolve.className,
		    target = _opts$resolve.target,
		    attributes = _opts$resolve.attributes;

		var link = '<' + tagName + ' href="' + escapeAttr(formattedHref) + '"';

		if (className) {
			link += ' class="' + escapeAttr(className) + '"';
		}

		if (target) {
			link += ' target="' + escapeAttr(target) + '"';
		}

		if (attributes) {
			link += ' ' + attributesToString(attributes);
		}

		link += '>' + escapeText(formatted) + '</' + tagName + '>';
		result.push(link);
	}

	return result.join('');
}

if (!String.prototype.linkify) {
	try {
		Object.defineProperty(String.prototype, 'linkify', {
			set: function set() {},
			get: function get() {
				return function linkify(opts) {
					return linkifyStr(this, opts);
				};
			}
		});
	} catch (e) {
		// IE 8 doesn't like Object.defineProperty on non-DOM objects
		if (!String.prototype.linkify) {
			String.prototype.linkify = function (opts) {
				return linkifyStr(this, opts);
			};
		}
	}
}

exports.default = linkifyStr;
},{"./linkify":183}],183:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.tokenize = exports.test = exports.scanner = exports.parser = exports.options = exports.inherits = exports.find = undefined;

var _class = require('./linkify/utils/class');

var _options = require('./linkify/utils/options');

var options = _interopRequireWildcard(_options);

var _scanner = require('./linkify/core/scanner');

var scanner = _interopRequireWildcard(_scanner);

var _parser = require('./linkify/core/parser');

var parser = _interopRequireWildcard(_parser);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

if (!Array.isArray) {
	Array.isArray = function (arg) {
		return Object.prototype.toString.call(arg) === '[object Array]';
	};
}

/**
	Converts a string into tokens that represent linkable and non-linkable bits
	@method tokenize
	@param {String} str
	@return {Array} tokens
*/
var tokenize = function tokenize(str) {
	return parser.run(scanner.run(str));
};

/**
	Returns a list of linkable items in the given string.
*/
var find = function find(str) {
	var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

	var tokens = tokenize(str);
	var filtered = [];

	for (var i = 0; i < tokens.length; i++) {
		var token = tokens[i];
		if (token.isLink && (!type || token.type === type)) {
			filtered.push(token.toObject());
		}
	}

	return filtered;
};

/**
	Is the given string valid linkable text of some sort
	Note that this does not trim the text for you.

	Optionally pass in a second `type` param, which is the type of link to test
	for.

	For example,

		test(str, 'email');

	Will return `true` if str is a valid email.
*/
var test = function test(str) {
	var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

	var tokens = tokenize(str);
	return tokens.length === 1 && tokens[0].isLink && (!type || tokens[0].type === type);
};

// Scanner and parser provide states and tokens for the lexicographic stage
// (will be used to add additional link types)
exports.find = find;
exports.inherits = _class.inherits;
exports.options = options;
exports.parser = parser;
exports.scanner = scanner;
exports.test = test;
exports.tokenize = tokenize;
},{"./linkify/core/parser":184,"./linkify/core/scanner":185,"./linkify/utils/class":190,"./linkify/utils/options":191}],184:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.start = exports.run = exports.TOKENS = exports.State = undefined;

var _state = require('./state');

var _multi = require('./tokens/multi');

var MULTI_TOKENS = _interopRequireWildcard(_multi);

var _text = require('./tokens/text');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
	Not exactly parser, more like the second-stage scanner (although we can
	theoretically hotswap the code here with a real parser in the future... but
	for a little URL-finding utility abstract syntax trees may be a little
	overkill).

	URL format: http://en.wikipedia.org/wiki/URI_scheme
	Email format: http://en.wikipedia.org/wiki/Email_address (links to RFC in
	reference)

	@module linkify
	@submodule parser
	@main parser
*/

var makeState = function makeState(tokenClass) {
	return new _state.TokenState(tokenClass);
};

// The universal starting state.
var S_START = makeState();

// Intermediate states for URLs. Note that domains that begin with a protocol
// are treated slighly differently from those that don't.
var S_PROTOCOL = makeState(); // e.g., 'http:'
var S_MAILTO = makeState(); // 'mailto:'
var S_PROTOCOL_SLASH = makeState(); // e.g., '/', 'http:/''
var S_PROTOCOL_SLASH_SLASH = makeState(); // e.g., '//', 'http://'
var S_DOMAIN = makeState(); // parsed string ends with a potential domain name (A)
var S_DOMAIN_DOT = makeState(); // (A) domain followed by DOT
var S_TLD = makeState(_multi.URL); // (A) Simplest possible URL with no query string
var S_TLD_COLON = makeState(); // (A) URL followed by colon (potential port number here)
var S_TLD_PORT = makeState(_multi.URL); // TLD followed by a port number
var S_URL = makeState(_multi.URL); // Long URL with optional port and maybe query string
var S_URL_NON_ACCEPTING = makeState(); // URL followed by some symbols (will not be part of the final URL)
var S_URL_OPENBRACE = makeState(); // URL followed by {
var S_URL_OPENBRACKET = makeState(); // URL followed by [
var S_URL_OPENANGLEBRACKET = makeState(); // URL followed by <
var S_URL_OPENPAREN = makeState(); // URL followed by (
var S_URL_OPENBRACE_Q = makeState(_multi.URL); // URL followed by { and some symbols that the URL can end it
var S_URL_OPENBRACKET_Q = makeState(_multi.URL); // URL followed by [ and some symbols that the URL can end it
var S_URL_OPENANGLEBRACKET_Q = makeState(_multi.URL); // URL followed by < and some symbols that the URL can end it
var S_URL_OPENPAREN_Q = makeState(_multi.URL); // URL followed by ( and some symbols that the URL can end it
var S_URL_OPENBRACE_SYMS = makeState(); // S_URL_OPENBRACE_Q followed by some symbols it cannot end it
var S_URL_OPENBRACKET_SYMS = makeState(); // S_URL_OPENBRACKET_Q followed by some symbols it cannot end it
var S_URL_OPENANGLEBRACKET_SYMS = makeState(); // S_URL_OPENANGLEBRACKET_Q followed by some symbols it cannot end it
var S_URL_OPENPAREN_SYMS = makeState(); // S_URL_OPENPAREN_Q followed by some symbols it cannot end it
var S_EMAIL_DOMAIN = makeState(); // parsed string starts with local email info + @ with a potential domain name (C)
var S_EMAIL_DOMAIN_DOT = makeState(); // (C) domain followed by DOT
var S_EMAIL = makeState(_multi.EMAIL); // (C) Possible email address (could have more tlds)
var S_EMAIL_COLON = makeState(); // (C) URL followed by colon (potential port number here)
var S_EMAIL_PORT = makeState(_multi.EMAIL); // (C) Email address with a port
var S_MAILTO_EMAIL = makeState(_multi.MAILTOEMAIL); // Email that begins with the mailto prefix (D)
var S_MAILTO_EMAIL_NON_ACCEPTING = makeState(); // (D) Followed by some non-query string chars
var S_LOCALPART = makeState(); // Local part of the email address
var S_LOCALPART_AT = makeState(); // Local part of the email address plus @
var S_LOCALPART_DOT = makeState(); // Local part of the email address plus '.' (localpart cannot end in .)
var S_NL = makeState(_multi.NL); // single new line

// Make path from start to protocol (with '//')
S_START.on(_text.NL, S_NL).on(_text.PROTOCOL, S_PROTOCOL).on(_text.MAILTO, S_MAILTO).on(_text.SLASH, S_PROTOCOL_SLASH);

S_PROTOCOL.on(_text.SLASH, S_PROTOCOL_SLASH);
S_PROTOCOL_SLASH.on(_text.SLASH, S_PROTOCOL_SLASH_SLASH);

// The very first potential domain name
S_START.on(_text.TLD, S_DOMAIN).on(_text.DOMAIN, S_DOMAIN).on(_text.LOCALHOST, S_TLD).on(_text.NUM, S_DOMAIN);

// Force URL for protocol followed by anything sane
S_PROTOCOL_SLASH_SLASH.on(_text.TLD, S_URL).on(_text.DOMAIN, S_URL).on(_text.NUM, S_URL).on(_text.LOCALHOST, S_URL);

// Account for dots and hyphens
// hyphens are usually parts of domain names
S_DOMAIN.on(_text.DOT, S_DOMAIN_DOT);
S_EMAIL_DOMAIN.on(_text.DOT, S_EMAIL_DOMAIN_DOT);

// Hyphen can jump back to a domain name

// After the first domain and a dot, we can find either a URL or another domain
S_DOMAIN_DOT.on(_text.TLD, S_TLD).on(_text.DOMAIN, S_DOMAIN).on(_text.NUM, S_DOMAIN).on(_text.LOCALHOST, S_DOMAIN);

S_EMAIL_DOMAIN_DOT.on(_text.TLD, S_EMAIL).on(_text.DOMAIN, S_EMAIL_DOMAIN).on(_text.NUM, S_EMAIL_DOMAIN).on(_text.LOCALHOST, S_EMAIL_DOMAIN);

// S_TLD accepts! But the URL could be longer, try to find a match greedily
// The `run` function should be able to "rollback" to the accepting state
S_TLD.on(_text.DOT, S_DOMAIN_DOT);
S_EMAIL.on(_text.DOT, S_EMAIL_DOMAIN_DOT);

// Become real URLs after `SLASH` or `COLON NUM SLASH`
// Here PSS and non-PSS converge
S_TLD.on(_text.COLON, S_TLD_COLON).on(_text.SLASH, S_URL);
S_TLD_COLON.on(_text.NUM, S_TLD_PORT);
S_TLD_PORT.on(_text.SLASH, S_URL);
S_EMAIL.on(_text.COLON, S_EMAIL_COLON);
S_EMAIL_COLON.on(_text.NUM, S_EMAIL_PORT);

// Types of characters the URL can definitely end in
var qsAccepting = [_text.DOMAIN, _text.AT, _text.LOCALHOST, _text.NUM, _text.PLUS, _text.POUND, _text.PROTOCOL, _text.SLASH, _text.TLD, _text.UNDERSCORE, _text.SYM, _text.AMPERSAND];

// Types of tokens that can follow a URL and be part of the query string
// but cannot be the very last characters
// Characters that cannot appear in the URL at all should be excluded
var qsNonAccepting = [_text.COLON, _text.DOT, _text.QUERY, _text.PUNCTUATION, _text.CLOSEBRACE, _text.CLOSEBRACKET, _text.CLOSEANGLEBRACKET, _text.CLOSEPAREN, _text.OPENBRACE, _text.OPENBRACKET, _text.OPENANGLEBRACKET, _text.OPENPAREN];

// These states are responsible primarily for determining whether or not to
// include the final round bracket.

// URL, followed by an opening bracket
S_URL.on(_text.OPENBRACE, S_URL_OPENBRACE).on(_text.OPENBRACKET, S_URL_OPENBRACKET).on(_text.OPENANGLEBRACKET, S_URL_OPENANGLEBRACKET).on(_text.OPENPAREN, S_URL_OPENPAREN);

// URL with extra symbols at the end, followed by an opening bracket
S_URL_NON_ACCEPTING.on(_text.OPENBRACE, S_URL_OPENBRACE).on(_text.OPENBRACKET, S_URL_OPENBRACKET).on(_text.OPENANGLEBRACKET, S_URL_OPENANGLEBRACKET).on(_text.OPENPAREN, S_URL_OPENPAREN);

// Closing bracket component. This character WILL be included in the URL
S_URL_OPENBRACE.on(_text.CLOSEBRACE, S_URL);
S_URL_OPENBRACKET.on(_text.CLOSEBRACKET, S_URL);
S_URL_OPENANGLEBRACKET.on(_text.CLOSEANGLEBRACKET, S_URL);
S_URL_OPENPAREN.on(_text.CLOSEPAREN, S_URL);
S_URL_OPENBRACE_Q.on(_text.CLOSEBRACE, S_URL);
S_URL_OPENBRACKET_Q.on(_text.CLOSEBRACKET, S_URL);
S_URL_OPENANGLEBRACKET_Q.on(_text.CLOSEANGLEBRACKET, S_URL);
S_URL_OPENPAREN_Q.on(_text.CLOSEPAREN, S_URL);
S_URL_OPENBRACE_SYMS.on(_text.CLOSEBRACE, S_URL);
S_URL_OPENBRACKET_SYMS.on(_text.CLOSEBRACKET, S_URL);
S_URL_OPENANGLEBRACKET_SYMS.on(_text.CLOSEANGLEBRACKET, S_URL);
S_URL_OPENPAREN_SYMS.on(_text.CLOSEPAREN, S_URL);

// URL that beings with an opening bracket, followed by a symbols.
// Note that the final state can still be `S_URL_OPENBRACE_Q` (if the URL only
// has a single opening bracket for some reason).
S_URL_OPENBRACE.on(qsAccepting, S_URL_OPENBRACE_Q);
S_URL_OPENBRACKET.on(qsAccepting, S_URL_OPENBRACKET_Q);
S_URL_OPENANGLEBRACKET.on(qsAccepting, S_URL_OPENANGLEBRACKET_Q);
S_URL_OPENPAREN.on(qsAccepting, S_URL_OPENPAREN_Q);
S_URL_OPENBRACE.on(qsNonAccepting, S_URL_OPENBRACE_SYMS);
S_URL_OPENBRACKET.on(qsNonAccepting, S_URL_OPENBRACKET_SYMS);
S_URL_OPENANGLEBRACKET.on(qsNonAccepting, S_URL_OPENANGLEBRACKET_SYMS);
S_URL_OPENPAREN.on(qsNonAccepting, S_URL_OPENPAREN_SYMS);

// URL that begins with an opening bracket, followed by some symbols
S_URL_OPENBRACE_Q.on(qsAccepting, S_URL_OPENBRACE_Q);
S_URL_OPENBRACKET_Q.on(qsAccepting, S_URL_OPENBRACKET_Q);
S_URL_OPENANGLEBRACKET_Q.on(qsAccepting, S_URL_OPENANGLEBRACKET_Q);
S_URL_OPENPAREN_Q.on(qsAccepting, S_URL_OPENPAREN_Q);
S_URL_OPENBRACE_Q.on(qsNonAccepting, S_URL_OPENBRACE_Q);
S_URL_OPENBRACKET_Q.on(qsNonAccepting, S_URL_OPENBRACKET_Q);
S_URL_OPENANGLEBRACKET_Q.on(qsNonAccepting, S_URL_OPENANGLEBRACKET_Q);
S_URL_OPENPAREN_Q.on(qsNonAccepting, S_URL_OPENPAREN_Q);

S_URL_OPENBRACE_SYMS.on(qsAccepting, S_URL_OPENBRACE_Q);
S_URL_OPENBRACKET_SYMS.on(qsAccepting, S_URL_OPENBRACKET_Q);
S_URL_OPENANGLEBRACKET_SYMS.on(qsAccepting, S_URL_OPENANGLEBRACKET_Q);
S_URL_OPENPAREN_SYMS.on(qsAccepting, S_URL_OPENPAREN_Q);
S_URL_OPENBRACE_SYMS.on(qsNonAccepting, S_URL_OPENBRACE_SYMS);
S_URL_OPENBRACKET_SYMS.on(qsNonAccepting, S_URL_OPENBRACKET_SYMS);
S_URL_OPENANGLEBRACKET_SYMS.on(qsNonAccepting, S_URL_OPENANGLEBRACKET_SYMS);
S_URL_OPENPAREN_SYMS.on(qsNonAccepting, S_URL_OPENPAREN_SYMS);

// Account for the query string
S_URL.on(qsAccepting, S_URL);
S_URL_NON_ACCEPTING.on(qsAccepting, S_URL);

S_URL.on(qsNonAccepting, S_URL_NON_ACCEPTING);
S_URL_NON_ACCEPTING.on(qsNonAccepting, S_URL_NON_ACCEPTING);

// Email address-specific state definitions
// Note: We are not allowing '/' in email addresses since this would interfere
// with real URLs

// For addresses with the mailto prefix
// 'mailto:' followed by anything sane is a valid email
S_MAILTO.on(_text.TLD, S_MAILTO_EMAIL).on(_text.DOMAIN, S_MAILTO_EMAIL).on(_text.NUM, S_MAILTO_EMAIL).on(_text.LOCALHOST, S_MAILTO_EMAIL);

// Greedily get more potential valid email values
S_MAILTO_EMAIL.on(qsAccepting, S_MAILTO_EMAIL).on(qsNonAccepting, S_MAILTO_EMAIL_NON_ACCEPTING);
S_MAILTO_EMAIL_NON_ACCEPTING.on(qsAccepting, S_MAILTO_EMAIL).on(qsNonAccepting, S_MAILTO_EMAIL_NON_ACCEPTING);

// For addresses without the mailto prefix
// Tokens allowed in the localpart of the email
var localpartAccepting = [_text.DOMAIN, _text.NUM, _text.PLUS, _text.POUND, _text.QUERY, _text.UNDERSCORE, _text.SYM, _text.AMPERSAND, _text.TLD];

// Some of the tokens in `localpartAccepting` are already accounted for here and
// will not be overwritten (don't worry)
S_DOMAIN.on(localpartAccepting, S_LOCALPART).on(_text.AT, S_LOCALPART_AT);
S_TLD.on(localpartAccepting, S_LOCALPART).on(_text.AT, S_LOCALPART_AT);
S_DOMAIN_DOT.on(localpartAccepting, S_LOCALPART);

// Okay we're on a localpart. Now what?
// TODO: IP addresses and what if the email starts with numbers?
S_LOCALPART.on(localpartAccepting, S_LOCALPART).on(_text.AT, S_LOCALPART_AT) // close to an email address now
.on(_text.DOT, S_LOCALPART_DOT);
S_LOCALPART_DOT.on(localpartAccepting, S_LOCALPART);
S_LOCALPART_AT.on(_text.TLD, S_EMAIL_DOMAIN).on(_text.DOMAIN, S_EMAIL_DOMAIN).on(_text.LOCALHOST, S_EMAIL);
// States following `@` defined above

var run = function run(tokens) {
	var len = tokens.length;
	var cursor = 0;
	var multis = [];
	var textTokens = [];

	while (cursor < len) {
		var state = S_START;
		var secondState = null;
		var nextState = null;
		var multiLength = 0;
		var latestAccepting = null;
		var sinceAccepts = -1;

		while (cursor < len && !(secondState = state.next(tokens[cursor]))) {
			// Starting tokens with nowhere to jump to.
			// Consider these to be just plain text
			textTokens.push(tokens[cursor++]);
		}

		while (cursor < len && (nextState = secondState || state.next(tokens[cursor]))) {

			// Get the next state
			secondState = null;
			state = nextState;

			// Keep track of the latest accepting state
			if (state.accepts()) {
				sinceAccepts = 0;
				latestAccepting = state;
			} else if (sinceAccepts >= 0) {
				sinceAccepts++;
			}

			cursor++;
			multiLength++;
		}

		if (sinceAccepts < 0) {

			// No accepting state was found, part of a regular text token
			// Add all the tokens we looked at to the text tokens array
			for (var i = cursor - multiLength; i < cursor; i++) {
				textTokens.push(tokens[i]);
			}
		} else {

			// Accepting state!

			// First close off the textTokens (if available)
			if (textTokens.length > 0) {
				multis.push(new _multi.TEXT(textTokens));
				textTokens = [];
			}

			// Roll back to the latest accepting state
			cursor -= sinceAccepts;
			multiLength -= sinceAccepts;

			// Create a new multitoken
			var MULTI = latestAccepting.emit();
			multis.push(new MULTI(tokens.slice(cursor - multiLength, cursor)));
		}
	}

	// Finally close off the textTokens (if available)
	if (textTokens.length > 0) {
		multis.push(new _multi.TEXT(textTokens));
	}

	return multis;
};

exports.State = _state.TokenState;
exports.TOKENS = MULTI_TOKENS;
exports.run = run;
exports.start = S_START;
},{"./state":186,"./tokens/multi":188,"./tokens/text":189}],185:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.start = exports.run = exports.TOKENS = exports.State = undefined;

var _state = require('./state');

var _text = require('./tokens/text');

var TOKENS = _interopRequireWildcard(_text);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var tlds = 'aaa|aarp|abarth|abb|abbott|abbvie|abc|able|abogado|abudhabi|ac|academy|accenture|accountant|accountants|aco|active|actor|ad|adac|ads|adult|ae|aeg|aero|aetna|af|afamilycompany|afl|africa|ag|agakhan|agency|ai|aig|aigo|airbus|airforce|airtel|akdn|al|alfaromeo|alibaba|alipay|allfinanz|allstate|ally|alsace|alstom|am|americanexpress|americanfamily|amex|amfam|amica|amsterdam|analytics|android|anquan|anz|ao|aol|apartments|app|apple|aq|aquarelle|ar|arab|aramco|archi|army|arpa|art|arte|as|asda|asia|associates|at|athleta|attorney|au|auction|audi|audible|audio|auspost|author|auto|autos|avianca|aw|aws|ax|axa|az|azure|ba|baby|baidu|banamex|bananarepublic|band|bank|bar|barcelona|barclaycard|barclays|barefoot|bargains|baseball|basketball|bauhaus|bayern|bb|bbc|bbt|bbva|bcg|bcn|bd|be|beats|beauty|beer|bentley|berlin|best|bestbuy|bet|bf|bg|bh|bharti|bi|bible|bid|bike|bing|bingo|bio|biz|bj|black|blackfriday|blanco|blockbuster|blog|bloomberg|blue|bm|bms|bmw|bn|bnl|bnpparibas|bo|boats|boehringer|bofa|bom|bond|boo|book|booking|boots|bosch|bostik|boston|bot|boutique|box|br|bradesco|bridgestone|broadway|broker|brother|brussels|bs|bt|budapest|bugatti|build|builders|business|buy|buzz|bv|bw|by|bz|bzh|ca|cab|cafe|cal|call|calvinklein|cam|camera|camp|cancerresearch|canon|capetown|capital|capitalone|car|caravan|cards|care|career|careers|cars|cartier|casa|case|caseih|cash|casino|cat|catering|catholic|cba|cbn|cbre|cbs|cc|cd|ceb|center|ceo|cern|cf|cfa|cfd|cg|ch|chanel|channel|chase|chat|cheap|chintai|chloe|christmas|chrome|chrysler|church|ci|cipriani|circle|cisco|citadel|citi|citic|city|cityeats|ck|cl|claims|cleaning|click|clinic|clinique|clothing|cloud|club|clubmed|cm|cn|co|coach|codes|coffee|college|cologne|com|comcast|commbank|community|company|compare|computer|comsec|condos|construction|consulting|contact|contractors|cooking|cookingchannel|cool|coop|corsica|country|coupon|coupons|courses|cr|credit|creditcard|creditunion|cricket|crown|crs|cruise|cruises|csc|cu|cuisinella|cv|cw|cx|cy|cymru|cyou|cz|dabur|dad|dance|data|date|dating|datsun|day|dclk|dds|de|deal|dealer|deals|degree|delivery|dell|deloitte|delta|democrat|dental|dentist|desi|design|dev|dhl|diamonds|diet|digital|direct|directory|discount|discover|dish|diy|dj|dk|dm|dnp|do|docs|doctor|dodge|dog|doha|domains|dot|download|drive|dtv|dubai|duck|dunlop|duns|dupont|durban|dvag|dvr|dz|earth|eat|ec|eco|edeka|edu|education|ee|eg|email|emerck|energy|engineer|engineering|enterprises|epost|epson|equipment|er|ericsson|erni|es|esq|estate|esurance|et|etisalat|eu|eurovision|eus|events|everbank|exchange|expert|exposed|express|extraspace|fage|fail|fairwinds|faith|family|fan|fans|farm|farmers|fashion|fast|fedex|feedback|ferrari|ferrero|fi|fiat|fidelity|fido|film|final|finance|financial|fire|firestone|firmdale|fish|fishing|fit|fitness|fj|fk|flickr|flights|flir|florist|flowers|fly|fm|fo|foo|food|foodnetwork|football|ford|forex|forsale|forum|foundation|fox|fr|free|fresenius|frl|frogans|frontdoor|frontier|ftr|fujitsu|fujixerox|fun|fund|furniture|futbol|fyi|ga|gal|gallery|gallo|gallup|game|games|gap|garden|gb|gbiz|gd|gdn|ge|gea|gent|genting|george|gf|gg|ggee|gh|gi|gift|gifts|gives|giving|gl|glade|glass|gle|global|globo|gm|gmail|gmbh|gmo|gmx|gn|godaddy|gold|goldpoint|golf|goo|goodhands|goodyear|goog|google|gop|got|gov|gp|gq|gr|grainger|graphics|gratis|green|gripe|grocery|group|gs|gt|gu|guardian|gucci|guge|guide|guitars|guru|gw|gy|hair|hamburg|hangout|haus|hbo|hdfc|hdfcbank|health|healthcare|help|helsinki|here|hermes|hgtv|hiphop|hisamitsu|hitachi|hiv|hk|hkt|hm|hn|hockey|holdings|holiday|homedepot|homegoods|homes|homesense|honda|honeywell|horse|hospital|host|hosting|hot|hoteles|hotels|hotmail|house|how|hr|hsbc|ht|htc|hu|hughes|hyatt|hyundai|ibm|icbc|ice|icu|id|ie|ieee|ifm|ikano|il|im|imamat|imdb|immo|immobilien|in|industries|infiniti|info|ing|ink|institute|insurance|insure|int|intel|international|intuit|investments|io|ipiranga|iq|ir|irish|is|iselect|ismaili|ist|istanbul|it|itau|itv|iveco|iwc|jaguar|java|jcb|jcp|je|jeep|jetzt|jewelry|jio|jlc|jll|jm|jmp|jnj|jo|jobs|joburg|jot|joy|jp|jpmorgan|jprs|juegos|juniper|kaufen|kddi|ke|kerryhotels|kerrylogistics|kerryproperties|kfh|kg|kh|ki|kia|kim|kinder|kindle|kitchen|kiwi|km|kn|koeln|komatsu|kosher|kp|kpmg|kpn|kr|krd|kred|kuokgroup|kw|ky|kyoto|kz|la|lacaixa|ladbrokes|lamborghini|lamer|lancaster|lancia|lancome|land|landrover|lanxess|lasalle|lat|latino|latrobe|law|lawyer|lb|lc|lds|lease|leclerc|lefrak|legal|lego|lexus|lgbt|li|liaison|lidl|life|lifeinsurance|lifestyle|lighting|like|lilly|limited|limo|lincoln|linde|link|lipsy|live|living|lixil|lk|loan|loans|locker|locus|loft|lol|london|lotte|lotto|love|lpl|lplfinancial|lr|ls|lt|ltd|ltda|lu|lundbeck|lupin|luxe|luxury|lv|ly|ma|macys|madrid|maif|maison|makeup|man|management|mango|map|market|marketing|markets|marriott|marshalls|maserati|mattel|mba|mc|mckinsey|md|me|med|media|meet|melbourne|meme|memorial|men|menu|meo|merckmsd|metlife|mg|mh|miami|microsoft|mil|mini|mint|mit|mitsubishi|mk|ml|mlb|mls|mm|mma|mn|mo|mobi|mobile|mobily|moda|moe|moi|mom|monash|money|monster|mopar|mormon|mortgage|moscow|moto|motorcycles|mov|movie|movistar|mp|mq|mr|ms|msd|mt|mtn|mtr|mu|museum|mutual|mv|mw|mx|my|mz|na|nab|nadex|nagoya|name|nationwide|natura|navy|nba|nc|ne|nec|net|netbank|netflix|network|neustar|new|newholland|news|next|nextdirect|nexus|nf|nfl|ng|ngo|nhk|ni|nico|nike|nikon|ninja|nissan|nissay|nl|no|nokia|northwesternmutual|norton|now|nowruz|nowtv|np|nr|nra|nrw|ntt|nu|nyc|nz|obi|observer|off|office|okinawa|olayan|olayangroup|oldnavy|ollo|om|omega|one|ong|onl|online|onyourside|ooo|open|oracle|orange|org|organic|origins|osaka|otsuka|ott|ovh|pa|page|panasonic|panerai|paris|pars|partners|parts|party|passagens|pay|pccw|pe|pet|pf|pfizer|pg|ph|pharmacy|phd|philips|phone|photo|photography|photos|physio|piaget|pics|pictet|pictures|pid|pin|ping|pink|pioneer|pizza|pk|pl|place|play|playstation|plumbing|plus|pm|pn|pnc|pohl|poker|politie|porn|post|pr|pramerica|praxi|press|prime|pro|prod|productions|prof|progressive|promo|properties|property|protection|pru|prudential|ps|pt|pub|pw|pwc|py|qa|qpon|quebec|quest|qvc|racing|radio|raid|re|read|realestate|realtor|realty|recipes|red|redstone|redumbrella|rehab|reise|reisen|reit|reliance|ren|rent|rentals|repair|report|republican|rest|restaurant|review|reviews|rexroth|rich|richardli|ricoh|rightathome|ril|rio|rip|rmit|ro|rocher|rocks|rodeo|rogers|room|rs|rsvp|ru|rugby|ruhr|run|rw|rwe|ryukyu|sa|saarland|safe|safety|sakura|sale|salon|samsclub|samsung|sandvik|sandvikcoromant|sanofi|sap|sapo|sarl|sas|save|saxo|sb|sbi|sbs|sc|sca|scb|schaeffler|schmidt|scholarships|school|schule|schwarz|science|scjohnson|scor|scot|sd|se|search|seat|secure|security|seek|select|sener|services|ses|seven|sew|sex|sexy|sfr|sg|sh|shangrila|sharp|shaw|shell|shia|shiksha|shoes|shop|shopping|shouji|show|showtime|shriram|si|silk|sina|singles|site|sj|sk|ski|skin|sky|skype|sl|sling|sm|smart|smile|sn|sncf|so|soccer|social|softbank|software|sohu|solar|solutions|song|sony|soy|space|spiegel|spot|spreadbetting|sr|srl|srt|st|stada|staples|star|starhub|statebank|statefarm|statoil|stc|stcgroup|stockholm|storage|store|stream|studio|study|style|su|sucks|supplies|supply|support|surf|surgery|suzuki|sv|swatch|swiftcover|swiss|sx|sy|sydney|symantec|systems|sz|tab|taipei|talk|taobao|target|tatamotors|tatar|tattoo|tax|taxi|tc|tci|td|tdk|team|tech|technology|tel|telecity|telefonica|temasek|tennis|teva|tf|tg|th|thd|theater|theatre|tiaa|tickets|tienda|tiffany|tips|tires|tirol|tj|tjmaxx|tjx|tk|tkmaxx|tl|tm|tmall|tn|to|today|tokyo|tools|top|toray|toshiba|total|tours|town|toyota|toys|tr|trade|trading|training|travel|travelchannel|travelers|travelersinsurance|trust|trv|tt|tube|tui|tunes|tushu|tv|tvs|tw|tz|ua|ubank|ubs|uconnect|ug|uk|unicom|university|uno|uol|ups|us|uy|uz|va|vacations|vana|vanguard|vc|ve|vegas|ventures|verisign|versicherung|vet|vg|vi|viajes|video|vig|viking|villas|vin|vip|virgin|visa|vision|vista|vistaprint|viva|vivo|vlaanderen|vn|vodka|volkswagen|volvo|vote|voting|voto|voyage|vu|vuelos|wales|walmart|walter|wang|wanggou|warman|watch|watches|weather|weatherchannel|webcam|weber|website|wed|wedding|weibo|weir|wf|whoswho|wien|wiki|williamhill|win|windows|wine|winners|wme|wolterskluwer|woodside|work|works|world|wow|ws|wtc|wtf|xbox|xerox|xfinity|xihuan|xin|xn--11b4c3d|xn--1ck2e1b|xn--1qqw23a|xn--2scrj9c|xn--30rr7y|xn--3bst00m|xn--3ds443g|xn--3e0b707e|xn--3hcrj9c|xn--3oq18vl8pn36a|xn--3pxu8k|xn--42c2d9a|xn--45br5cyl|xn--45brj9c|xn--45q11c|xn--4gbrim|xn--54b7fta0cc|xn--55qw42g|xn--55qx5d|xn--5su34j936bgsg|xn--5tzm5g|xn--6frz82g|xn--6qq986b3xl|xn--80adxhks|xn--80ao21a|xn--80aqecdr1a|xn--80asehdb|xn--80aswg|xn--8y0a063a|xn--90a3ac|xn--90ae|xn--90ais|xn--9dbq2a|xn--9et52u|xn--9krt00a|xn--b4w605ferd|xn--bck1b9a5dre4c|xn--c1avg|xn--c2br7g|xn--cck2b3b|xn--cg4bki|xn--clchc0ea0b2g2a9gcd|xn--czr694b|xn--czrs0t|xn--czru2d|xn--d1acj3b|xn--d1alf|xn--e1a4c|xn--eckvdtc9d|xn--efvy88h|xn--estv75g|xn--fct429k|xn--fhbei|xn--fiq228c5hs|xn--fiq64b|xn--fiqs8s|xn--fiqz9s|xn--fjq720a|xn--flw351e|xn--fpcrj9c3d|xn--fzc2c9e2c|xn--fzys8d69uvgm|xn--g2xx48c|xn--gckr3f0f|xn--gecrj9c|xn--gk3at1e|xn--h2breg3eve|xn--h2brj9c|xn--h2brj9c8c|xn--hxt814e|xn--i1b6b1a6a2e|xn--imr513n|xn--io0a7i|xn--j1aef|xn--j1amh|xn--j6w193g|xn--jlq61u9w7b|xn--jvr189m|xn--kcrx77d1x4a|xn--kprw13d|xn--kpry57d|xn--kpu716f|xn--kput3i|xn--l1acc|xn--lgbbat1ad8j|xn--mgb9awbf|xn--mgba3a3ejt|xn--mgba3a4f16a|xn--mgba7c0bbn0a|xn--mgbaakc7dvf|xn--mgbaam7a8h|xn--mgbab2bd|xn--mgbai9azgqp6j|xn--mgbayh7gpa|xn--mgbb9fbpob|xn--mgbbh1a|xn--mgbbh1a71e|xn--mgbc0a9azcg|xn--mgbca7dzdo|xn--mgberp4a5d4ar|xn--mgbgu82a|xn--mgbi4ecexp|xn--mgbpl2fh|xn--mgbt3dhd|xn--mgbtx2b|xn--mgbx4cd0ab|xn--mix891f|xn--mk1bu44c|xn--mxtq1m|xn--ngbc5azd|xn--ngbe9e0a|xn--ngbrx|xn--node|xn--nqv7f|xn--nqv7fs00ema|xn--nyqy26a|xn--o3cw4h|xn--ogbpf8fl|xn--p1acf|xn--p1ai|xn--pbt977c|xn--pgbs0dh|xn--pssy2u|xn--q9jyb4c|xn--qcka1pmc|xn--qxam|xn--rhqv96g|xn--rovu88b|xn--rvc1e0am3e|xn--s9brj9c|xn--ses554g|xn--t60b56a|xn--tckwe|xn--tiq49xqyj|xn--unup4y|xn--vermgensberater-ctb|xn--vermgensberatung-pwb|xn--vhquv|xn--vuq861b|xn--w4r85el8fhu5dnra|xn--w4rs40l|xn--wgbh1c|xn--wgbl6a|xn--xhq521b|xn--xkc2al3hye2a|xn--xkc2dl3a5ee0h|xn--y9a3aq|xn--yfro4i67o|xn--ygbi2ammx|xn--zfr164b|xperia|xxx|xyz|yachts|yahoo|yamaxun|yandex|ye|yodobashi|yoga|yokohama|you|youtube|yt|yun|za|zappos|zara|zero|zip|zippo|zm|zone|zuerich|zw'.split('|'); // macro, see gulpfile.js

/**
	The scanner provides an interface that takes a string of text as input, and
	outputs an array of tokens instances that can be used for easy URL parsing.

	@module linkify
	@submodule scanner
	@main scanner
*/

var NUMBERS = '0123456789'.split('');
var ALPHANUM = '0123456789abcdefghijklmnopqrstuvwxyz'.split('');
var WHITESPACE = [' ', '\f', '\r', '\t', '\v', '\xA0', '\u1680', '\u180E']; // excluding line breaks

var domainStates = []; // states that jump to DOMAIN on /[a-z0-9]/
var makeState = function makeState(tokenClass) {
	return new _state.CharacterState(tokenClass);
};

// Frequently used states
var S_START = makeState();
var S_NUM = makeState(_text.NUM);
var S_DOMAIN = makeState(_text.DOMAIN);
var S_DOMAIN_HYPHEN = makeState(); // domain followed by 1 or more hyphen characters
var S_WS = makeState(_text.WS);

// States for special URL symbols
S_START.on('@', makeState(_text.AT)).on('.', makeState(_text.DOT)).on('+', makeState(_text.PLUS)).on('#', makeState(_text.POUND)).on('?', makeState(_text.QUERY)).on('/', makeState(_text.SLASH)).on('_', makeState(_text.UNDERSCORE)).on(':', makeState(_text.COLON)).on('{', makeState(_text.OPENBRACE)).on('[', makeState(_text.OPENBRACKET)).on('<', makeState(_text.OPENANGLEBRACKET)).on('(', makeState(_text.OPENPAREN)).on('}', makeState(_text.CLOSEBRACE)).on(']', makeState(_text.CLOSEBRACKET)).on('>', makeState(_text.CLOSEANGLEBRACKET)).on(')', makeState(_text.CLOSEPAREN)).on('&', makeState(_text.AMPERSAND)).on([',', ';', '!', '"', '\''], makeState(_text.PUNCTUATION));

// Whitespace jumps
// Tokens of only non-newline whitespace are arbitrarily long
S_START.on('\n', makeState(_text.NL)).on(WHITESPACE, S_WS);

// If any whitespace except newline, more whitespace!
S_WS.on(WHITESPACE, S_WS);

// Generates states for top-level domains
// Note that this is most accurate when tlds are in alphabetical order
for (var i = 0; i < tlds.length; i++) {
	var newStates = (0, _state.stateify)(tlds[i], S_START, _text.TLD, _text.DOMAIN);
	domainStates.push.apply(domainStates, newStates);
}

// Collect the states generated by different protocls
var partialProtocolFileStates = (0, _state.stateify)('file', S_START, _text.DOMAIN, _text.DOMAIN);
var partialProtocolFtpStates = (0, _state.stateify)('ftp', S_START, _text.DOMAIN, _text.DOMAIN);
var partialProtocolHttpStates = (0, _state.stateify)('http', S_START, _text.DOMAIN, _text.DOMAIN);
var partialProtocolMailtoStates = (0, _state.stateify)('mailto', S_START, _text.DOMAIN, _text.DOMAIN);

// Add the states to the array of DOMAINeric states
domainStates.push.apply(domainStates, partialProtocolFileStates);
domainStates.push.apply(domainStates, partialProtocolFtpStates);
domainStates.push.apply(domainStates, partialProtocolHttpStates);
domainStates.push.apply(domainStates, partialProtocolMailtoStates);

// Protocol states
var S_PROTOCOL_FILE = partialProtocolFileStates.pop();
var S_PROTOCOL_FTP = partialProtocolFtpStates.pop();
var S_PROTOCOL_HTTP = partialProtocolHttpStates.pop();
var S_MAILTO = partialProtocolMailtoStates.pop();
var S_PROTOCOL_SECURE = makeState(_text.DOMAIN);
var S_FULL_PROTOCOL = makeState(_text.PROTOCOL); // Full protocol ends with COLON
var S_FULL_MAILTO = makeState(_text.MAILTO); // Mailto ends with COLON

// Secure protocols (end with 's')
S_PROTOCOL_FTP.on('s', S_PROTOCOL_SECURE).on(':', S_FULL_PROTOCOL);

S_PROTOCOL_HTTP.on('s', S_PROTOCOL_SECURE).on(':', S_FULL_PROTOCOL);

domainStates.push(S_PROTOCOL_SECURE);

// Become protocol tokens after a COLON
S_PROTOCOL_FILE.on(':', S_FULL_PROTOCOL);
S_PROTOCOL_SECURE.on(':', S_FULL_PROTOCOL);
S_MAILTO.on(':', S_FULL_MAILTO);

// Localhost
var partialLocalhostStates = (0, _state.stateify)('localhost', S_START, _text.LOCALHOST, _text.DOMAIN);
domainStates.push.apply(domainStates, partialLocalhostStates);

// Everything else
// DOMAINs make more DOMAINs
// Number and character transitions
S_START.on(NUMBERS, S_NUM);
S_NUM.on('-', S_DOMAIN_HYPHEN).on(NUMBERS, S_NUM).on(ALPHANUM, S_DOMAIN); // number becomes DOMAIN

S_DOMAIN.on('-', S_DOMAIN_HYPHEN).on(ALPHANUM, S_DOMAIN);

// All the generated states should have a jump to DOMAIN
for (var _i = 0; _i < domainStates.length; _i++) {
	domainStates[_i].on('-', S_DOMAIN_HYPHEN).on(ALPHANUM, S_DOMAIN);
}

S_DOMAIN_HYPHEN.on('-', S_DOMAIN_HYPHEN).on(NUMBERS, S_DOMAIN).on(ALPHANUM, S_DOMAIN);

// Set default transition
S_START.defaultTransition = makeState(_text.SYM);

/**
	Given a string, returns an array of TOKEN instances representing the
	composition of that string.

	@method run
	@param {String} str Input string to scan
	@return {Array} Array of TOKEN instances
*/
var run = function run(str) {

	// The state machine only looks at lowercase strings.
	// This selective `toLowerCase` is used because lowercasing the entire
	// string causes the length and character position to vary in some in some
	// non-English strings. This happens only on V8-based runtimes.
	var lowerStr = str.replace(/[A-Z]/g, function (c) {
		return c.toLowerCase();
	});
	var len = str.length;
	var tokens = []; // return value

	var cursor = 0;

	// Tokenize the string
	while (cursor < len) {
		var state = S_START;
		var nextState = null;
		var tokenLength = 0;
		var latestAccepting = null;
		var sinceAccepts = -1;

		while (cursor < len && (nextState = state.next(lowerStr[cursor]))) {
			state = nextState;

			// Keep track of the latest accepting state
			if (state.accepts()) {
				sinceAccepts = 0;
				latestAccepting = state;
			} else if (sinceAccepts >= 0) {
				sinceAccepts++;
			}

			tokenLength++;
			cursor++;
		}

		if (sinceAccepts < 0) {
			continue;
		} // Should never happen

		// Roll back to the latest accepting state
		cursor -= sinceAccepts;
		tokenLength -= sinceAccepts;

		// Get the class for the new token
		var TOKEN = latestAccepting.emit(); // Current token class

		// No more jumps, just make a new token
		tokens.push(new TOKEN(str.substr(cursor - tokenLength, tokenLength)));
	}

	return tokens;
};

var start = S_START;
exports.State = _state.CharacterState;
exports.TOKENS = TOKENS;
exports.run = run;
exports.start = start;
},{"./state":186,"./tokens/text":189}],186:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.stateify = exports.TokenState = exports.CharacterState = undefined;

var _class = require('../utils/class');

function createStateClass() {
	return function (tClass) {
		this.j = [];
		this.T = tClass || null;
	};
}

/**
	A simple state machine that can emit token classes

	The `j` property in this class refers to state jumps. It's a
	multidimensional array where for each element:

	* index [0] is a symbol or class of symbols to transition to.
	* index [1] is a State instance which matches

	The type of symbol will depend on the target implementation for this class.
	In Linkify, we have a two-stage scanner. Each stage uses this state machine
	but with a slighly different (polymorphic) implementation.

	The `T` property refers to the token class.

	TODO: Can the `on` and `next` methods be combined?

	@class BaseState
*/
var BaseState = createStateClass();
BaseState.prototype = {
	defaultTransition: false,

	/**
 	@method constructor
 	@param {Class} tClass Pass in the kind of token to emit if there are
 		no jumps after this state and the state is accepting.
 */

	/**
 	On the given symbol(s), this machine should go to the given state
 		@method on
 	@param {Array|Mixed} symbol
 	@param {BaseState} state Note that the type of this state should be the
 		same as the current instance (i.e., don't pass in a different
 		subclass)
 */
	on: function on(symbol, state) {
		if (symbol instanceof Array) {
			for (var i = 0; i < symbol.length; i++) {
				this.j.push([symbol[i], state]);
			}
			return this;
		}
		this.j.push([symbol, state]);
		return this;
	},


	/**
 	Given the next item, returns next state for that item
 	@method next
 	@param {Mixed} item Should be an instance of the symbols handled by
 		this particular machine.
 	@return {State} state Returns false if no jumps are available
 */
	next: function next(item) {
		for (var i = 0; i < this.j.length; i++) {
			var jump = this.j[i];
			var symbol = jump[0]; // Next item to check for
			var state = jump[1]; // State to jump to if items match

			// compare item with symbol
			if (this.test(item, symbol)) {
				return state;
			}
		}

		// Nowhere left to jump!
		return this.defaultTransition;
	},


	/**
 	Does this state accept?
 	`true` only of `this.T` exists
 		@method accepts
 	@return {Boolean}
 */
	accepts: function accepts() {
		return !!this.T;
	},


	/**
 	Determine whether a given item "symbolizes" the symbol, where symbol is
 	a class of items handled by this state machine.
 		This method should be overriden in extended classes.
 		@method test
 	@param {Mixed} item Does this item match the given symbol?
 	@param {Mixed} symbol
 	@return {Boolean}
 */
	test: function test(item, symbol) {
		return item === symbol;
	},


	/**
 	Emit the token for this State (just return it in this case)
 	If this emits a token, this instance is an accepting state
 	@method emit
 	@return {Class} T
 */
	emit: function emit() {
		return this.T;
	}
};

/**
	State machine for string-based input

	@class CharacterState
	@extends BaseState
*/
var CharacterState = (0, _class.inherits)(BaseState, createStateClass(), {
	/**
 	Does the given character match the given character or regular
 	expression?
 		@method test
 	@param {String} char
 	@param {String|RegExp} charOrRegExp
 	@return {Boolean}
 */
	test: function test(character, charOrRegExp) {
		return character === charOrRegExp || charOrRegExp instanceof RegExp && charOrRegExp.test(character);
	}
});

/**
	State machine for input in the form of TextTokens

	@class TokenState
	@extends BaseState
*/
var TokenState = (0, _class.inherits)(BaseState, createStateClass(), {

	/**
  * Similar to `on`, but returns the state the results in the transition from
  * the given item
  * @method jump
  * @param {Mixed} item
  * @param {Token} [token]
  * @return state
  */
	jump: function jump(token) {
		var tClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

		var state = this.next(new token('')); // dummy temp token
		if (state === this.defaultTransition) {
			// Make a new state!
			state = new this.constructor(tClass);
			this.on(token, state);
		} else if (tClass) {
			state.T = tClass;
		}
		return state;
	},


	/**
 	Is the given token an instance of the given token class?
 		@method test
 	@param {TextToken} token
 	@param {Class} tokenClass
 	@return {Boolean}
 */
	test: function test(token, tokenClass) {
		return token instanceof tokenClass;
	}
});

/**
	Given a non-empty target string, generates states (if required) for each
	consecutive substring of characters in str starting from the beginning of
	the string. The final state will have a special value, as specified in
	options. All other "in between" substrings will have a default end state.

	This turns the state machine into a Trie-like data structure (rather than a
	intelligently-designed DFA).

	Note that I haven't really tried these with any strings other than
	DOMAIN.

	@param {String} str
	@param {CharacterState} start State to jump from the first character
	@param {Class} endToken Token class to emit when the given string has been
		matched and no more jumps exist.
	@param {Class} defaultToken "Filler token", or which token type to emit when
		we don't have a full match
	@return {Array} list of newly-created states
*/
function stateify(str, start, endToken, defaultToken) {
	var i = 0,
	    len = str.length,
	    state = start,
	    newStates = [],
	    nextState = void 0;

	// Find the next state without a jump to the next character
	while (i < len && (nextState = state.next(str[i]))) {
		state = nextState;
		i++;
	}

	if (i >= len) {
		return [];
	} // no new tokens were added

	while (i < len - 1) {
		nextState = new CharacterState(defaultToken);
		newStates.push(nextState);
		state.on(str[i], nextState);
		state = nextState;
		i++;
	}

	nextState = new CharacterState(endToken);
	newStates.push(nextState);
	state.on(str[len - 1], nextState);

	return newStates;
}

exports.CharacterState = CharacterState;
exports.TokenState = TokenState;
exports.stateify = stateify;
},{"../utils/class":190}],187:[function(require,module,exports){
"use strict";

exports.__esModule = true;
function createTokenClass() {
	return function (value) {
		if (value) {
			this.v = value;
		}
	};
}

exports.createTokenClass = createTokenClass;
},{}],188:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.URL = exports.TEXT = exports.NL = exports.EMAIL = exports.MAILTOEMAIL = exports.Base = undefined;

var _createTokenClass = require('./create-token-class');

var _class = require('../../utils/class');

var _text = require('./text');

/******************************************************************************
	Multi-Tokens
	Tokens composed of arrays of TextTokens
******************************************************************************/

// Is the given token a valid domain token?
// Should nums be included here?
function isDomainToken(token) {
	return token instanceof _text.DOMAIN || token instanceof _text.TLD;
}

/**
	Abstract class used for manufacturing tokens of text tokens. That is rather
	than the value for a token being a small string of text, it's value an array
	of text tokens.

	Used for grouping together URLs, emails, hashtags, and other potential
	creations.

	@class MultiToken
	@abstract
*/
var MultiToken = (0, _createTokenClass.createTokenClass)();

MultiToken.prototype = {
	/**
 	String representing the type for this token
 	@property type
 	@default 'TOKEN'
 */
	type: 'token',

	/**
 	Is this multitoken a link?
 	@property isLink
 	@default false
 */
	isLink: false,

	/**
 	Return the string this token represents.
 	@method toString
 	@return {String}
 */
	toString: function toString() {
		var result = [];
		for (var i = 0; i < this.v.length; i++) {
			result.push(this.v[i].toString());
		}
		return result.join('');
	},


	/**
 	What should the value for this token be in the `href` HTML attribute?
 	Returns the `.toString` value by default.
 		@method toHref
 	@return {String}
 */
	toHref: function toHref() {
		return this.toString();
	},


	/**
 	Returns a hash of relevant values for this token, which includes keys
 	* type - Kind of token ('url', 'email', etc.)
 	* value - Original text
 	* href - The value that should be added to the anchor tag's href
 		attribute
 		@method toObject
 	@param {String} [protocol] `'http'` by default
 	@return {Object}
 */
	toObject: function toObject() {
		var protocol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'http';

		return {
			type: this.type,
			value: this.toString(),
			href: this.toHref(protocol)
		};
	}
};

/**
	Represents an arbitrarily mailto email address with the prefix included
	@class MAILTO
	@extends MultiToken
*/
var MAILTOEMAIL = (0, _class.inherits)(MultiToken, (0, _createTokenClass.createTokenClass)(), {
	type: 'email',
	isLink: true
});

/**
	Represents a list of tokens making up a valid email address
	@class EMAIL
	@extends MultiToken
*/
var EMAIL = (0, _class.inherits)(MultiToken, (0, _createTokenClass.createTokenClass)(), {
	type: 'email',
	isLink: true,
	toHref: function toHref() {
		return 'mailto:' + this.toString();
	}
});

/**
	Represents some plain text
	@class TEXT
	@extends MultiToken
*/
var TEXT = (0, _class.inherits)(MultiToken, (0, _createTokenClass.createTokenClass)(), { type: 'text' });

/**
	Multi-linebreak token - represents a line break
	@class NL
	@extends MultiToken
*/
var NL = (0, _class.inherits)(MultiToken, (0, _createTokenClass.createTokenClass)(), { type: 'nl' });

/**
	Represents a list of tokens making up a valid URL
	@class URL
	@extends MultiToken
*/
var URL = (0, _class.inherits)(MultiToken, (0, _createTokenClass.createTokenClass)(), {
	type: 'url',
	isLink: true,

	/**
 	Lowercases relevant parts of the domain and adds the protocol if
 	required. Note that this will not escape unsafe HTML characters in the
 	URL.
 		@method href
 	@param {String} protocol
 	@return {String}
 */
	toHref: function toHref() {
		var protocol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'http';

		var hasProtocol = false;
		var hasSlashSlash = false;
		var tokens = this.v;
		var result = [];
		var i = 0;

		// Make the first part of the domain lowercase
		// Lowercase protocol
		while (tokens[i] instanceof _text.PROTOCOL) {
			hasProtocol = true;
			result.push(tokens[i].toString().toLowerCase());
			i++;
		}

		// Skip slash-slash
		while (tokens[i] instanceof _text.SLASH) {
			hasSlashSlash = true;
			result.push(tokens[i].toString());
			i++;
		}

		// Lowercase all other characters in the domain
		while (isDomainToken(tokens[i])) {
			result.push(tokens[i].toString().toLowerCase());
			i++;
		}

		// Leave all other characters as they were written
		for (; i < tokens.length; i++) {
			result.push(tokens[i].toString());
		}

		result = result.join('');

		if (!(hasProtocol || hasSlashSlash)) {
			result = protocol + '://' + result;
		}

		return result;
	},
	hasProtocol: function hasProtocol() {
		return this.v[0] instanceof _text.PROTOCOL;
	}
});

exports.Base = MultiToken;
exports.MAILTOEMAIL = MAILTOEMAIL;
exports.EMAIL = EMAIL;
exports.NL = NL;
exports.TEXT = TEXT;
exports.URL = URL;
},{"../../utils/class":190,"./create-token-class":187,"./text":189}],189:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.AMPERSAND = exports.CLOSEPAREN = exports.CLOSEANGLEBRACKET = exports.CLOSEBRACKET = exports.CLOSEBRACE = exports.OPENPAREN = exports.OPENANGLEBRACKET = exports.OPENBRACKET = exports.OPENBRACE = exports.WS = exports.TLD = exports.SYM = exports.UNDERSCORE = exports.SLASH = exports.MAILTO = exports.PROTOCOL = exports.QUERY = exports.POUND = exports.PLUS = exports.NUM = exports.NL = exports.LOCALHOST = exports.PUNCTUATION = exports.DOT = exports.COLON = exports.AT = exports.DOMAIN = exports.Base = undefined;

var _createTokenClass = require('./create-token-class');

var _class = require('../../utils/class');

/******************************************************************************
	Text Tokens
	Tokens composed of strings
******************************************************************************/

/**
	Abstract class used for manufacturing text tokens.
	Pass in the value this token represents

	@class TextToken
	@abstract
*/
var TextToken = (0, _createTokenClass.createTokenClass)();
TextToken.prototype = {
	toString: function toString() {
		return this.v + '';
	}
};

function inheritsToken(value) {
	var props = value ? { v: value } : {};
	return (0, _class.inherits)(TextToken, (0, _createTokenClass.createTokenClass)(), props);
}

/**
	A valid domain token
	@class DOMAIN
	@extends TextToken
*/
var DOMAIN = inheritsToken();

/**
	@class AT
	@extends TextToken
*/
var AT = inheritsToken('@');

/**
	Represents a single colon `:` character

	@class COLON
	@extends TextToken
*/
var COLON = inheritsToken(':');

/**
	@class DOT
	@extends TextToken
*/
var DOT = inheritsToken('.');

/**
	A character class that can surround the URL, but which the URL cannot begin
	or end with. Does not include certain English punctuation like parentheses.

	@class PUNCTUATION
	@extends TextToken
*/
var PUNCTUATION = inheritsToken();

/**
	The word localhost (by itself)
	@class LOCALHOST
	@extends TextToken
*/
var LOCALHOST = inheritsToken();

/**
	Newline token
	@class NL
	@extends TextToken
*/
var NL = inheritsToken('\n');

/**
	@class NUM
	@extends TextToken
*/
var NUM = inheritsToken();

/**
	@class PLUS
	@extends TextToken
*/
var PLUS = inheritsToken('+');

/**
	@class POUND
	@extends TextToken
*/
var POUND = inheritsToken('#');

/**
	Represents a web URL protocol. Supported types include

	* `http:`
	* `https:`
	* `ftp:`
	* `ftps:`

	@class PROTOCOL
	@extends TextToken
*/
var PROTOCOL = inheritsToken();

/**
	Represents the start of the email URI protocol

	@class MAILTO
	@extends TextToken
*/
var MAILTO = inheritsToken('mailto:');

/**
	@class QUERY
	@extends TextToken
*/
var QUERY = inheritsToken('?');

/**
	@class SLASH
	@extends TextToken
*/
var SLASH = inheritsToken('/');

/**
	@class UNDERSCORE
	@extends TextToken
*/
var UNDERSCORE = inheritsToken('_');

/**
	One ore more non-whitespace symbol.
	@class SYM
	@extends TextToken
*/
var SYM = inheritsToken();

/**
	@class TLD
	@extends TextToken
*/
var TLD = inheritsToken();

/**
	Represents a string of consecutive whitespace characters

	@class WS
	@extends TextToken
*/
var WS = inheritsToken();

/**
	Opening/closing bracket classes
*/

var OPENBRACE = inheritsToken('{');
var OPENBRACKET = inheritsToken('[');
var OPENANGLEBRACKET = inheritsToken('<');
var OPENPAREN = inheritsToken('(');
var CLOSEBRACE = inheritsToken('}');
var CLOSEBRACKET = inheritsToken(']');
var CLOSEANGLEBRACKET = inheritsToken('>');
var CLOSEPAREN = inheritsToken(')');

var AMPERSAND = inheritsToken('&');

exports.Base = TextToken;
exports.DOMAIN = DOMAIN;
exports.AT = AT;
exports.COLON = COLON;
exports.DOT = DOT;
exports.PUNCTUATION = PUNCTUATION;
exports.LOCALHOST = LOCALHOST;
exports.NL = NL;
exports.NUM = NUM;
exports.PLUS = PLUS;
exports.POUND = POUND;
exports.QUERY = QUERY;
exports.PROTOCOL = PROTOCOL;
exports.MAILTO = MAILTO;
exports.SLASH = SLASH;
exports.UNDERSCORE = UNDERSCORE;
exports.SYM = SYM;
exports.TLD = TLD;
exports.WS = WS;
exports.OPENBRACE = OPENBRACE;
exports.OPENBRACKET = OPENBRACKET;
exports.OPENANGLEBRACKET = OPENANGLEBRACKET;
exports.OPENPAREN = OPENPAREN;
exports.CLOSEBRACE = CLOSEBRACE;
exports.CLOSEBRACKET = CLOSEBRACKET;
exports.CLOSEANGLEBRACKET = CLOSEANGLEBRACKET;
exports.CLOSEPAREN = CLOSEPAREN;
exports.AMPERSAND = AMPERSAND;
},{"../../utils/class":190,"./create-token-class":187}],190:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports.inherits = inherits;
function inherits(parent, child) {
	var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	var extended = Object.create(parent.prototype);
	for (var p in props) {
		extended[p] = props[p];
	}
	extended.constructor = child;
	child.prototype = extended;
	return child;
}
},{}],191:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var defaults = {
	defaultProtocol: 'http',
	events: null,
	format: noop,
	formatHref: noop,
	nl2br: false,
	tagName: 'a',
	target: typeToTarget,
	validate: true,
	ignoreTags: [],
	attributes: null,
	className: 'linkified' // Deprecated value - no default class will be provided in the future
};

exports.defaults = defaults;
exports.Options = Options;
exports.contains = contains;


function Options(opts) {
	opts = opts || {};

	this.defaultProtocol = opts.hasOwnProperty('defaultProtocol') ? opts.defaultProtocol : defaults.defaultProtocol;
	this.events = opts.hasOwnProperty('events') ? opts.events : defaults.events;
	this.format = opts.hasOwnProperty('format') ? opts.format : defaults.format;
	this.formatHref = opts.hasOwnProperty('formatHref') ? opts.formatHref : defaults.formatHref;
	this.nl2br = opts.hasOwnProperty('nl2br') ? opts.nl2br : defaults.nl2br;
	this.tagName = opts.hasOwnProperty('tagName') ? opts.tagName : defaults.tagName;
	this.target = opts.hasOwnProperty('target') ? opts.target : defaults.target;
	this.validate = opts.hasOwnProperty('validate') ? opts.validate : defaults.validate;
	this.ignoreTags = [];

	// linkAttributes and linkClass is deprecated
	this.attributes = opts.attributes || opts.linkAttributes || defaults.attributes;
	this.className = opts.hasOwnProperty('className') ? opts.className : opts.linkClass || defaults.className;

	// Make all tags names upper case
	var ignoredTags = opts.hasOwnProperty('ignoreTags') ? opts.ignoreTags : defaults.ignoreTags;
	for (var i = 0; i < ignoredTags.length; i++) {
		this.ignoreTags.push(ignoredTags[i].toUpperCase());
	}
}

Options.prototype = {
	/**
  * Given the token, return all options for how it should be displayed
  */
	resolve: function resolve(token) {
		var href = token.toHref(this.defaultProtocol);
		return {
			formatted: this.get('format', token.toString(), token),
			formattedHref: this.get('formatHref', href, token),
			tagName: this.get('tagName', href, token),
			className: this.get('className', href, token),
			target: this.get('target', href, token),
			events: this.getObject('events', href, token),
			attributes: this.getObject('attributes', href, token)
		};
	},


	/**
  * Returns true or false based on whether a token should be displayed as a
  * link based on the user options. By default,
  */
	check: function check(token) {
		return this.get('validate', token.toString(), token);
	},


	// Private methods

	/**
  * Resolve an option's value based on the value of the option and the given
  * params.
  * @param {String} key Name of option to use
  * @param operator will be passed to the target option if it's method
  * @param {MultiToken} token The token from linkify.tokenize
  */
	get: function get(key, operator, token) {
		var optionValue = void 0,
		    option = this[key];
		if (!option) {
			return option;
		}

		switch (typeof option === 'undefined' ? 'undefined' : _typeof(option)) {
			case 'function':
				return option(operator, token.type);
			case 'object':
				optionValue = option.hasOwnProperty(token.type) ? option[token.type] : defaults[key];
				return typeof optionValue === 'function' ? optionValue(operator, token.type) : optionValue;
		}

		return option;
	},
	getObject: function getObject(key, operator, token) {
		var option = this[key];
		return typeof option === 'function' ? option(operator, token.type) : option;
	}
};

/**
 * Quick indexOf replacement for checking the ignoreTags option
 */
function contains(arr, value) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] === value) {
			return true;
		}
	}
	return false;
}

function noop(val) {
	return val;
}

function typeToTarget(href, type) {
	return type === 'url' ? '_blank' : null;
}
},{}],192:[function(require,module,exports){
module.exports = require('./lib/linkify-string').default;

},{"./lib/linkify-string":182}],193:[function(require,module,exports){
/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license */

window.matchMedia || (window.matchMedia = function() {
    "use strict";

    // For browsers that support matchMedium api such as IE 9 and webkit
    var styleMedia = (window.styleMedia || window.media);

    // For those that don't support matchMedium
    if (!styleMedia) {
        var style       = document.createElement('style'),
            script      = document.getElementsByTagName('script')[0],
            info        = null;

        style.type  = 'text/css';
        style.id    = 'matchmediajs-test';

        script.parentNode.insertBefore(style, script);

        // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
        info = ('getComputedStyle' in window) && window.getComputedStyle(style, null) || style.currentStyle;

        styleMedia = {
            matchMedium: function(media) {
                var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

                // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
                if (style.styleSheet) {
                    style.styleSheet.cssText = text;
                } else {
                    style.textContent = text;
                }

                // Test if media query is true or false
                return info.width === '1px';
            }
        };
    }

    return function(media) {
        return {
            matches: styleMedia.matchMedium(media || 'all'),
            media: media || 'all'
        };
    };
}());

},{}],194:[function(require,module,exports){
// THIS FILE IS GENERATED - DO NOT EDIT!
/*!mobile-detect v1.4.4 2019-09-21*/
/*global module:false, define:false*/
/*jshint latedef:false*/
/*!@license Copyright 2013, Heinrich Goebl, License: MIT, see https://github.com/hgoebl/mobile-detect.js*/
(function (define, undefined) {
define(function () {
    'use strict';

    var impl = {};

    impl.mobileDetectRules = {
    "phones": {
        "iPhone": "\\biPhone\\b|\\biPod\\b",
        "BlackBerry": "BlackBerry|\\bBB10\\b|rim[0-9]+|\\b(BBA100|BBB100|BBD100|BBE100|BBF100|STH100)\\b-[0-9]+",
        "HTC": "HTC|HTC.*(Sensation|Evo|Vision|Explorer|6800|8100|8900|A7272|S510e|C110e|Legend|Desire|T8282)|APX515CKT|Qtek9090|APA9292KT|HD_mini|Sensation.*Z710e|PG86100|Z715e|Desire.*(A8181|HD)|ADR6200|ADR6400L|ADR6425|001HT|Inspire 4G|Android.*\\bEVO\\b|T-Mobile G1|Z520m|Android [0-9.]+; Pixel",
        "Nexus": "Nexus One|Nexus S|Galaxy.*Nexus|Android.*Nexus.*Mobile|Nexus 4|Nexus 5|Nexus 6",
        "Dell": "Dell[;]? (Streak|Aero|Venue|Venue Pro|Flash|Smoke|Mini 3iX)|XCD28|XCD35|\\b001DL\\b|\\b101DL\\b|\\bGS01\\b",
        "Motorola": "Motorola|DROIDX|DROID BIONIC|\\bDroid\\b.*Build|Android.*Xoom|HRI39|MOT-|A1260|A1680|A555|A853|A855|A953|A955|A956|Motorola.*ELECTRIFY|Motorola.*i1|i867|i940|MB200|MB300|MB501|MB502|MB508|MB511|MB520|MB525|MB526|MB611|MB612|MB632|MB810|MB855|MB860|MB861|MB865|MB870|ME501|ME502|ME511|ME525|ME600|ME632|ME722|ME811|ME860|ME863|ME865|MT620|MT710|MT716|MT720|MT810|MT870|MT917|Motorola.*TITANIUM|WX435|WX445|XT300|XT301|XT311|XT316|XT317|XT319|XT320|XT390|XT502|XT530|XT531|XT532|XT535|XT603|XT610|XT611|XT615|XT681|XT701|XT702|XT711|XT720|XT800|XT806|XT860|XT862|XT875|XT882|XT883|XT894|XT901|XT907|XT909|XT910|XT912|XT928|XT926|XT915|XT919|XT925|XT1021|\\bMoto E\\b|XT1068|XT1092|XT1052",
        "Samsung": "\\bSamsung\\b|SM-G950F|SM-G955F|SM-G9250|GT-19300|SGH-I337|BGT-S5230|GT-B2100|GT-B2700|GT-B2710|GT-B3210|GT-B3310|GT-B3410|GT-B3730|GT-B3740|GT-B5510|GT-B5512|GT-B5722|GT-B6520|GT-B7300|GT-B7320|GT-B7330|GT-B7350|GT-B7510|GT-B7722|GT-B7800|GT-C3010|GT-C3011|GT-C3060|GT-C3200|GT-C3212|GT-C3212I|GT-C3262|GT-C3222|GT-C3300|GT-C3300K|GT-C3303|GT-C3303K|GT-C3310|GT-C3322|GT-C3330|GT-C3350|GT-C3500|GT-C3510|GT-C3530|GT-C3630|GT-C3780|GT-C5010|GT-C5212|GT-C6620|GT-C6625|GT-C6712|GT-E1050|GT-E1070|GT-E1075|GT-E1080|GT-E1081|GT-E1085|GT-E1087|GT-E1100|GT-E1107|GT-E1110|GT-E1120|GT-E1125|GT-E1130|GT-E1160|GT-E1170|GT-E1175|GT-E1180|GT-E1182|GT-E1200|GT-E1210|GT-E1225|GT-E1230|GT-E1390|GT-E2100|GT-E2120|GT-E2121|GT-E2152|GT-E2220|GT-E2222|GT-E2230|GT-E2232|GT-E2250|GT-E2370|GT-E2550|GT-E2652|GT-E3210|GT-E3213|GT-I5500|GT-I5503|GT-I5700|GT-I5800|GT-I5801|GT-I6410|GT-I6420|GT-I7110|GT-I7410|GT-I7500|GT-I8000|GT-I8150|GT-I8160|GT-I8190|GT-I8320|GT-I8330|GT-I8350|GT-I8530|GT-I8700|GT-I8703|GT-I8910|GT-I9000|GT-I9001|GT-I9003|GT-I9010|GT-I9020|GT-I9023|GT-I9070|GT-I9082|GT-I9100|GT-I9103|GT-I9220|GT-I9250|GT-I9300|GT-I9305|GT-I9500|GT-I9505|GT-M3510|GT-M5650|GT-M7500|GT-M7600|GT-M7603|GT-M8800|GT-M8910|GT-N7000|GT-S3110|GT-S3310|GT-S3350|GT-S3353|GT-S3370|GT-S3650|GT-S3653|GT-S3770|GT-S3850|GT-S5210|GT-S5220|GT-S5229|GT-S5230|GT-S5233|GT-S5250|GT-S5253|GT-S5260|GT-S5263|GT-S5270|GT-S5300|GT-S5330|GT-S5350|GT-S5360|GT-S5363|GT-S5369|GT-S5380|GT-S5380D|GT-S5560|GT-S5570|GT-S5600|GT-S5603|GT-S5610|GT-S5620|GT-S5660|GT-S5670|GT-S5690|GT-S5750|GT-S5780|GT-S5830|GT-S5839|GT-S6102|GT-S6500|GT-S7070|GT-S7200|GT-S7220|GT-S7230|GT-S7233|GT-S7250|GT-S7500|GT-S7530|GT-S7550|GT-S7562|GT-S7710|GT-S8000|GT-S8003|GT-S8500|GT-S8530|GT-S8600|SCH-A310|SCH-A530|SCH-A570|SCH-A610|SCH-A630|SCH-A650|SCH-A790|SCH-A795|SCH-A850|SCH-A870|SCH-A890|SCH-A930|SCH-A950|SCH-A970|SCH-A990|SCH-I100|SCH-I110|SCH-I400|SCH-I405|SCH-I500|SCH-I510|SCH-I515|SCH-I600|SCH-I730|SCH-I760|SCH-I770|SCH-I830|SCH-I910|SCH-I920|SCH-I959|SCH-LC11|SCH-N150|SCH-N300|SCH-R100|SCH-R300|SCH-R351|SCH-R400|SCH-R410|SCH-T300|SCH-U310|SCH-U320|SCH-U350|SCH-U360|SCH-U365|SCH-U370|SCH-U380|SCH-U410|SCH-U430|SCH-U450|SCH-U460|SCH-U470|SCH-U490|SCH-U540|SCH-U550|SCH-U620|SCH-U640|SCH-U650|SCH-U660|SCH-U700|SCH-U740|SCH-U750|SCH-U810|SCH-U820|SCH-U900|SCH-U940|SCH-U960|SCS-26UC|SGH-A107|SGH-A117|SGH-A127|SGH-A137|SGH-A157|SGH-A167|SGH-A177|SGH-A187|SGH-A197|SGH-A227|SGH-A237|SGH-A257|SGH-A437|SGH-A517|SGH-A597|SGH-A637|SGH-A657|SGH-A667|SGH-A687|SGH-A697|SGH-A707|SGH-A717|SGH-A727|SGH-A737|SGH-A747|SGH-A767|SGH-A777|SGH-A797|SGH-A817|SGH-A827|SGH-A837|SGH-A847|SGH-A867|SGH-A877|SGH-A887|SGH-A897|SGH-A927|SGH-B100|SGH-B130|SGH-B200|SGH-B220|SGH-C100|SGH-C110|SGH-C120|SGH-C130|SGH-C140|SGH-C160|SGH-C170|SGH-C180|SGH-C200|SGH-C207|SGH-C210|SGH-C225|SGH-C230|SGH-C417|SGH-C450|SGH-D307|SGH-D347|SGH-D357|SGH-D407|SGH-D415|SGH-D780|SGH-D807|SGH-D980|SGH-E105|SGH-E200|SGH-E315|SGH-E316|SGH-E317|SGH-E335|SGH-E590|SGH-E635|SGH-E715|SGH-E890|SGH-F300|SGH-F480|SGH-I200|SGH-I300|SGH-I320|SGH-I550|SGH-I577|SGH-I600|SGH-I607|SGH-I617|SGH-I627|SGH-I637|SGH-I677|SGH-I700|SGH-I717|SGH-I727|SGH-i747M|SGH-I777|SGH-I780|SGH-I827|SGH-I847|SGH-I857|SGH-I896|SGH-I897|SGH-I900|SGH-I907|SGH-I917|SGH-I927|SGH-I937|SGH-I997|SGH-J150|SGH-J200|SGH-L170|SGH-L700|SGH-M110|SGH-M150|SGH-M200|SGH-N105|SGH-N500|SGH-N600|SGH-N620|SGH-N625|SGH-N700|SGH-N710|SGH-P107|SGH-P207|SGH-P300|SGH-P310|SGH-P520|SGH-P735|SGH-P777|SGH-Q105|SGH-R210|SGH-R220|SGH-R225|SGH-S105|SGH-S307|SGH-T109|SGH-T119|SGH-T139|SGH-T209|SGH-T219|SGH-T229|SGH-T239|SGH-T249|SGH-T259|SGH-T309|SGH-T319|SGH-T329|SGH-T339|SGH-T349|SGH-T359|SGH-T369|SGH-T379|SGH-T409|SGH-T429|SGH-T439|SGH-T459|SGH-T469|SGH-T479|SGH-T499|SGH-T509|SGH-T519|SGH-T539|SGH-T559|SGH-T589|SGH-T609|SGH-T619|SGH-T629|SGH-T639|SGH-T659|SGH-T669|SGH-T679|SGH-T709|SGH-T719|SGH-T729|SGH-T739|SGH-T746|SGH-T749|SGH-T759|SGH-T769|SGH-T809|SGH-T819|SGH-T839|SGH-T919|SGH-T929|SGH-T939|SGH-T959|SGH-T989|SGH-U100|SGH-U200|SGH-U800|SGH-V205|SGH-V206|SGH-X100|SGH-X105|SGH-X120|SGH-X140|SGH-X426|SGH-X427|SGH-X475|SGH-X495|SGH-X497|SGH-X507|SGH-X600|SGH-X610|SGH-X620|SGH-X630|SGH-X700|SGH-X820|SGH-X890|SGH-Z130|SGH-Z150|SGH-Z170|SGH-ZX10|SGH-ZX20|SHW-M110|SPH-A120|SPH-A400|SPH-A420|SPH-A460|SPH-A500|SPH-A560|SPH-A600|SPH-A620|SPH-A660|SPH-A700|SPH-A740|SPH-A760|SPH-A790|SPH-A800|SPH-A820|SPH-A840|SPH-A880|SPH-A900|SPH-A940|SPH-A960|SPH-D600|SPH-D700|SPH-D710|SPH-D720|SPH-I300|SPH-I325|SPH-I330|SPH-I350|SPH-I500|SPH-I600|SPH-I700|SPH-L700|SPH-M100|SPH-M220|SPH-M240|SPH-M300|SPH-M305|SPH-M320|SPH-M330|SPH-M350|SPH-M360|SPH-M370|SPH-M380|SPH-M510|SPH-M540|SPH-M550|SPH-M560|SPH-M570|SPH-M580|SPH-M610|SPH-M620|SPH-M630|SPH-M800|SPH-M810|SPH-M850|SPH-M900|SPH-M910|SPH-M920|SPH-M930|SPH-N100|SPH-N200|SPH-N240|SPH-N300|SPH-N400|SPH-Z400|SWC-E100|SCH-i909|GT-N7100|GT-N7105|SCH-I535|SM-N900A|SGH-I317|SGH-T999L|GT-S5360B|GT-I8262|GT-S6802|GT-S6312|GT-S6310|GT-S5312|GT-S5310|GT-I9105|GT-I8510|GT-S6790N|SM-G7105|SM-N9005|GT-S5301|GT-I9295|GT-I9195|SM-C101|GT-S7392|GT-S7560|GT-B7610|GT-I5510|GT-S7582|GT-S7530E|GT-I8750|SM-G9006V|SM-G9008V|SM-G9009D|SM-G900A|SM-G900D|SM-G900F|SM-G900H|SM-G900I|SM-G900J|SM-G900K|SM-G900L|SM-G900M|SM-G900P|SM-G900R4|SM-G900S|SM-G900T|SM-G900V|SM-G900W8|SHV-E160K|SCH-P709|SCH-P729|SM-T2558|GT-I9205|SM-G9350|SM-J120F|SM-G920F|SM-G920V|SM-G930F|SM-N910C|SM-A310F|GT-I9190|SM-J500FN|SM-G903F|SM-J330F",
        "LG": "\\bLG\\b;|LG[- ]?(C800|C900|E400|E610|E900|E-900|F160|F180K|F180L|F180S|730|855|L160|LS740|LS840|LS970|LU6200|MS690|MS695|MS770|MS840|MS870|MS910|P500|P700|P705|VM696|AS680|AS695|AX840|C729|E970|GS505|272|C395|E739BK|E960|L55C|L75C|LS696|LS860|P769BK|P350|P500|P509|P870|UN272|US730|VS840|VS950|LN272|LN510|LS670|LS855|LW690|MN270|MN510|P509|P769|P930|UN200|UN270|UN510|UN610|US670|US740|US760|UX265|UX840|VN271|VN530|VS660|VS700|VS740|VS750|VS910|VS920|VS930|VX9200|VX11000|AX840A|LW770|P506|P925|P999|E612|D955|D802|MS323|M257)|LM-G710",
        "Sony": "SonyST|SonyLT|SonyEricsson|SonyEricssonLT15iv|LT18i|E10i|LT28h|LT26w|SonyEricssonMT27i|C5303|C6902|C6903|C6906|C6943|D2533",
        "Asus": "Asus.*Galaxy|PadFone.*Mobile",
        "NokiaLumia": "Lumia [0-9]{3,4}",
        "Micromax": "Micromax.*\\b(A210|A92|A88|A72|A111|A110Q|A115|A116|A110|A90S|A26|A51|A35|A54|A25|A27|A89|A68|A65|A57|A90)\\b",
        "Palm": "PalmSource|Palm",
        "Vertu": "Vertu|Vertu.*Ltd|Vertu.*Ascent|Vertu.*Ayxta|Vertu.*Constellation(F|Quest)?|Vertu.*Monika|Vertu.*Signature",
        "Pantech": "PANTECH|IM-A850S|IM-A840S|IM-A830L|IM-A830K|IM-A830S|IM-A820L|IM-A810K|IM-A810S|IM-A800S|IM-T100K|IM-A725L|IM-A780L|IM-A775C|IM-A770K|IM-A760S|IM-A750K|IM-A740S|IM-A730S|IM-A720L|IM-A710K|IM-A690L|IM-A690S|IM-A650S|IM-A630K|IM-A600S|VEGA PTL21|PT003|P8010|ADR910L|P6030|P6020|P9070|P4100|P9060|P5000|CDM8992|TXT8045|ADR8995|IS11PT|P2030|P6010|P8000|PT002|IS06|CDM8999|P9050|PT001|TXT8040|P2020|P9020|P2000|P7040|P7000|C790",
        "Fly": "IQ230|IQ444|IQ450|IQ440|IQ442|IQ441|IQ245|IQ256|IQ236|IQ255|IQ235|IQ245|IQ275|IQ240|IQ285|IQ280|IQ270|IQ260|IQ250",
        "Wiko": "KITE 4G|HIGHWAY|GETAWAY|STAIRWAY|DARKSIDE|DARKFULL|DARKNIGHT|DARKMOON|SLIDE|WAX 4G|RAINBOW|BLOOM|SUNSET|GOA(?!nna)|LENNY|BARRY|IGGY|OZZY|CINK FIVE|CINK PEAX|CINK PEAX 2|CINK SLIM|CINK SLIM 2|CINK +|CINK KING|CINK PEAX|CINK SLIM|SUBLIM",
        "iMobile": "i-mobile (IQ|i-STYLE|idea|ZAA|Hitz)",
        "SimValley": "\\b(SP-80|XT-930|SX-340|XT-930|SX-310|SP-360|SP60|SPT-800|SP-120|SPT-800|SP-140|SPX-5|SPX-8|SP-100|SPX-8|SPX-12)\\b",
        "Wolfgang": "AT-B24D|AT-AS50HD|AT-AS40W|AT-AS55HD|AT-AS45q2|AT-B26D|AT-AS50Q",
        "Alcatel": "Alcatel",
        "Nintendo": "Nintendo (3DS|Switch)",
        "Amoi": "Amoi",
        "INQ": "INQ",
        "OnePlus": "ONEPLUS",
        "GenericPhone": "Tapatalk|PDA;|SAGEM|\\bmmp\\b|pocket|\\bpsp\\b|symbian|Smartphone|smartfon|treo|up.browser|up.link|vodafone|\\bwap\\b|nokia|Series40|Series60|S60|SonyEricsson|N900|MAUI.*WAP.*Browser"
    },
    "tablets": {
        "iPad": "iPad|iPad.*Mobile",
        "NexusTablet": "Android.*Nexus[\\s]+(7|9|10)",
        "GoogleTablet": "Android.*Pixel C",
        "SamsungTablet": "SAMSUNG.*Tablet|Galaxy.*Tab|SC-01C|GT-P1000|GT-P1003|GT-P1010|GT-P3105|GT-P6210|GT-P6800|GT-P6810|GT-P7100|GT-P7300|GT-P7310|GT-P7500|GT-P7510|SCH-I800|SCH-I815|SCH-I905|SGH-I957|SGH-I987|SGH-T849|SGH-T859|SGH-T869|SPH-P100|GT-P3100|GT-P3108|GT-P3110|GT-P5100|GT-P5110|GT-P6200|GT-P7320|GT-P7511|GT-N8000|GT-P8510|SGH-I497|SPH-P500|SGH-T779|SCH-I705|SCH-I915|GT-N8013|GT-P3113|GT-P5113|GT-P8110|GT-N8010|GT-N8005|GT-N8020|GT-P1013|GT-P6201|GT-P7501|GT-N5100|GT-N5105|GT-N5110|SHV-E140K|SHV-E140L|SHV-E140S|SHV-E150S|SHV-E230K|SHV-E230L|SHV-E230S|SHW-M180K|SHW-M180L|SHW-M180S|SHW-M180W|SHW-M300W|SHW-M305W|SHW-M380K|SHW-M380S|SHW-M380W|SHW-M430W|SHW-M480K|SHW-M480S|SHW-M480W|SHW-M485W|SHW-M486W|SHW-M500W|GT-I9228|SCH-P739|SCH-I925|GT-I9200|GT-P5200|GT-P5210|GT-P5210X|SM-T311|SM-T310|SM-T310X|SM-T210|SM-T210R|SM-T211|SM-P600|SM-P601|SM-P605|SM-P900|SM-P901|SM-T217|SM-T217A|SM-T217S|SM-P6000|SM-T3100|SGH-I467|XE500|SM-T110|GT-P5220|GT-I9200X|GT-N5110X|GT-N5120|SM-P905|SM-T111|SM-T2105|SM-T315|SM-T320|SM-T320X|SM-T321|SM-T520|SM-T525|SM-T530NU|SM-T230NU|SM-T330NU|SM-T900|XE500T1C|SM-P605V|SM-P905V|SM-T337V|SM-T537V|SM-T707V|SM-T807V|SM-P600X|SM-P900X|SM-T210X|SM-T230|SM-T230X|SM-T325|GT-P7503|SM-T531|SM-T330|SM-T530|SM-T705|SM-T705C|SM-T535|SM-T331|SM-T800|SM-T700|SM-T537|SM-T807|SM-P907A|SM-T337A|SM-T537A|SM-T707A|SM-T807A|SM-T237|SM-T807P|SM-P607T|SM-T217T|SM-T337T|SM-T807T|SM-T116NQ|SM-T116BU|SM-P550|SM-T350|SM-T550|SM-T9000|SM-P9000|SM-T705Y|SM-T805|GT-P3113|SM-T710|SM-T810|SM-T815|SM-T360|SM-T533|SM-T113|SM-T335|SM-T715|SM-T560|SM-T670|SM-T677|SM-T377|SM-T567|SM-T357T|SM-T555|SM-T561|SM-T713|SM-T719|SM-T813|SM-T819|SM-T580|SM-T355Y?|SM-T280|SM-T817A|SM-T820|SM-W700|SM-P580|SM-T587|SM-P350|SM-P555M|SM-P355M|SM-T113NU|SM-T815Y|SM-T585|SM-T285|SM-T825|SM-W708|SM-T835|SM-T830|SM-T837V|SM-T720|SM-T510|SM-T387V",
        "Kindle": "Kindle|Silk.*Accelerated|Android.*\\b(KFOT|KFTT|KFJWI|KFJWA|KFOTE|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|WFJWAE|KFSAWA|KFSAWI|KFASWI|KFARWI|KFFOWI|KFGIWI|KFMEWI)\\b|Android.*Silk\/[0-9.]+ like Chrome\/[0-9.]+ (?!Mobile)",
        "SurfaceTablet": "Windows NT [0-9.]+; ARM;.*(Tablet|ARMBJS)",
        "HPTablet": "HP Slate (7|8|10)|HP ElitePad 900|hp-tablet|EliteBook.*Touch|HP 8|Slate 21|HP SlateBook 10",
        "AsusTablet": "^.*PadFone((?!Mobile).)*$|Transformer|TF101|TF101G|TF300T|TF300TG|TF300TL|TF700T|TF700KL|TF701T|TF810C|ME171|ME301T|ME302C|ME371MG|ME370T|ME372MG|ME172V|ME173X|ME400C|Slider SL101|\\bK00F\\b|\\bK00C\\b|\\bK00E\\b|\\bK00L\\b|TX201LA|ME176C|ME102A|\\bM80TA\\b|ME372CL|ME560CG|ME372CG|ME302KL| K010 | K011 | K017 | K01E |ME572C|ME103K|ME170C|ME171C|\\bME70C\\b|ME581C|ME581CL|ME8510C|ME181C|P01Y|PO1MA|P01Z|\\bP027\\b|\\bP024\\b|\\bP00C\\b",
        "BlackBerryTablet": "PlayBook|RIM Tablet",
        "HTCtablet": "HTC_Flyer_P512|HTC Flyer|HTC Jetstream|HTC-P715a|HTC EVO View 4G|PG41200|PG09410",
        "MotorolaTablet": "xoom|sholest|MZ615|MZ605|MZ505|MZ601|MZ602|MZ603|MZ604|MZ606|MZ607|MZ608|MZ609|MZ615|MZ616|MZ617",
        "NookTablet": "Android.*Nook|NookColor|nook browser|BNRV200|BNRV200A|BNTV250|BNTV250A|BNTV400|BNTV600|LogicPD Zoom2",
        "AcerTablet": "Android.*; \\b(A100|A101|A110|A200|A210|A211|A500|A501|A510|A511|A700|A701|W500|W500P|W501|W501P|W510|W511|W700|G100|G100W|B1-A71|B1-710|B1-711|A1-810|A1-811|A1-830)\\b|W3-810|\\bA3-A10\\b|\\bA3-A11\\b|\\bA3-A20\\b|\\bA3-A30",
        "ToshibaTablet": "Android.*(AT100|AT105|AT200|AT205|AT270|AT275|AT300|AT305|AT1S5|AT500|AT570|AT700|AT830)|TOSHIBA.*FOLIO",
        "LGTablet": "\\bL-06C|LG-V909|LG-V900|LG-V700|LG-V510|LG-V500|LG-V410|LG-V400|LG-VK810\\b",
        "FujitsuTablet": "Android.*\\b(F-01D|F-02F|F-05E|F-10D|M532|Q572)\\b",
        "PrestigioTablet": "PMP3170B|PMP3270B|PMP3470B|PMP7170B|PMP3370B|PMP3570C|PMP5870C|PMP3670B|PMP5570C|PMP5770D|PMP3970B|PMP3870C|PMP5580C|PMP5880D|PMP5780D|PMP5588C|PMP7280C|PMP7280C3G|PMP7280|PMP7880D|PMP5597D|PMP5597|PMP7100D|PER3464|PER3274|PER3574|PER3884|PER5274|PER5474|PMP5097CPRO|PMP5097|PMP7380D|PMP5297C|PMP5297C_QUAD|PMP812E|PMP812E3G|PMP812F|PMP810E|PMP880TD|PMT3017|PMT3037|PMT3047|PMT3057|PMT7008|PMT5887|PMT5001|PMT5002",
        "LenovoTablet": "Lenovo TAB|Idea(Tab|Pad)( A1|A10| K1|)|ThinkPad([ ]+)?Tablet|YT3-850M|YT3-X90L|YT3-X90F|YT3-X90X|Lenovo.*(S2109|S2110|S5000|S6000|K3011|A3000|A3500|A1000|A2107|A2109|A1107|A5500|A7600|B6000|B8000|B8080)(-|)(FL|F|HV|H|)|TB-X103F|TB-X304X|TB-X304F|TB-X304L|TB-X505F|TB-X505L|TB-X505X|TB-X605F|TB-X605L|TB-8703F|TB-8703X|TB-8703N|TB-8704N|TB-8704F|TB-8704X|TB-8704V|TB-7304F|TB-7304I|TB-7304X|Tab2A7-10F|Tab2A7-20F|TB2-X30L|YT3-X50L|YT3-X50F|YT3-X50M|YT-X705F|YT-X703F|YT-X703L|YT-X705L|YT-X705X|TB2-X30F|TB2-X30L|TB2-X30M|A2107A-F|A2107A-H|TB3-730F|TB3-730M|TB3-730X|TB-7504F|TB-7504X",
        "DellTablet": "Venue 11|Venue 8|Venue 7|Dell Streak 10|Dell Streak 7",
        "YarvikTablet": "Android.*\\b(TAB210|TAB211|TAB224|TAB250|TAB260|TAB264|TAB310|TAB360|TAB364|TAB410|TAB411|TAB420|TAB424|TAB450|TAB460|TAB461|TAB464|TAB465|TAB467|TAB468|TAB07-100|TAB07-101|TAB07-150|TAB07-151|TAB07-152|TAB07-200|TAB07-201-3G|TAB07-210|TAB07-211|TAB07-212|TAB07-214|TAB07-220|TAB07-400|TAB07-485|TAB08-150|TAB08-200|TAB08-201-3G|TAB08-201-30|TAB09-100|TAB09-211|TAB09-410|TAB10-150|TAB10-201|TAB10-211|TAB10-400|TAB10-410|TAB13-201|TAB274EUK|TAB275EUK|TAB374EUK|TAB462EUK|TAB474EUK|TAB9-200)\\b",
        "MedionTablet": "Android.*\\bOYO\\b|LIFE.*(P9212|P9514|P9516|S9512)|LIFETAB",
        "ArnovaTablet": "97G4|AN10G2|AN7bG3|AN7fG3|AN8G3|AN8cG3|AN7G3|AN9G3|AN7dG3|AN7dG3ST|AN7dG3ChildPad|AN10bG3|AN10bG3DT|AN9G2",
        "IntensoTablet": "INM8002KP|INM1010FP|INM805ND|Intenso Tab|TAB1004",
        "IRUTablet": "M702pro",
        "MegafonTablet": "MegaFon V9|\\bZTE V9\\b|Android.*\\bMT7A\\b",
        "EbodaTablet": "E-Boda (Supreme|Impresspeed|Izzycomm|Essential)",
        "AllViewTablet": "Allview.*(Viva|Alldro|City|Speed|All TV|Frenzy|Quasar|Shine|TX1|AX1|AX2)",
        "ArchosTablet": "\\b(101G9|80G9|A101IT)\\b|Qilive 97R|Archos5|\\bARCHOS (70|79|80|90|97|101|FAMILYPAD|)(b|c|)(G10| Cobalt| TITANIUM(HD|)| Xenon| Neon|XSK| 2| XS 2| PLATINUM| CARBON|GAMEPAD)\\b",
        "AinolTablet": "NOVO7|NOVO8|NOVO10|Novo7Aurora|Novo7Basic|NOVO7PALADIN|novo9-Spark",
        "NokiaLumiaTablet": "Lumia 2520",
        "SonyTablet": "Sony.*Tablet|Xperia Tablet|Sony Tablet S|SO-03E|SGPT12|SGPT13|SGPT114|SGPT121|SGPT122|SGPT123|SGPT111|SGPT112|SGPT113|SGPT131|SGPT132|SGPT133|SGPT211|SGPT212|SGPT213|SGP311|SGP312|SGP321|EBRD1101|EBRD1102|EBRD1201|SGP351|SGP341|SGP511|SGP512|SGP521|SGP541|SGP551|SGP621|SGP641|SGP612|SOT31|SGP771|SGP611|SGP612|SGP712",
        "PhilipsTablet": "\\b(PI2010|PI3000|PI3100|PI3105|PI3110|PI3205|PI3210|PI3900|PI4010|PI7000|PI7100)\\b",
        "CubeTablet": "Android.*(K8GT|U9GT|U10GT|U16GT|U17GT|U18GT|U19GT|U20GT|U23GT|U30GT)|CUBE U8GT",
        "CobyTablet": "MID1042|MID1045|MID1125|MID1126|MID7012|MID7014|MID7015|MID7034|MID7035|MID7036|MID7042|MID7048|MID7127|MID8042|MID8048|MID8127|MID9042|MID9740|MID9742|MID7022|MID7010",
        "MIDTablet": "M9701|M9000|M9100|M806|M1052|M806|T703|MID701|MID713|MID710|MID727|MID760|MID830|MID728|MID933|MID125|MID810|MID732|MID120|MID930|MID800|MID731|MID900|MID100|MID820|MID735|MID980|MID130|MID833|MID737|MID960|MID135|MID860|MID736|MID140|MID930|MID835|MID733|MID4X10",
        "MSITablet": "MSI \\b(Primo 73K|Primo 73L|Primo 81L|Primo 77|Primo 93|Primo 75|Primo 76|Primo 73|Primo 81|Primo 91|Primo 90|Enjoy 71|Enjoy 7|Enjoy 10)\\b",
        "SMiTTablet": "Android.*(\\bMID\\b|MID-560|MTV-T1200|MTV-PND531|MTV-P1101|MTV-PND530)",
        "RockChipTablet": "Android.*(RK2818|RK2808A|RK2918|RK3066)|RK2738|RK2808A",
        "FlyTablet": "IQ310|Fly Vision",
        "bqTablet": "Android.*(bq)?.*\\b(Elcano|Curie|Edison|Maxwell|Kepler|Pascal|Tesla|Hypatia|Platon|Newton|Livingstone|Cervantes|Avant|Aquaris ([E|M]10|M8))\\b|Maxwell.*Lite|Maxwell.*Plus",
        "HuaweiTablet": "MediaPad|MediaPad 7 Youth|IDEOS S7|S7-201c|S7-202u|S7-101|S7-103|S7-104|S7-105|S7-106|S7-201|S7-Slim|M2-A01L|BAH-L09|BAH-W09|AGS-L09|CMR-AL19",
        "NecTablet": "\\bN-06D|\\bN-08D",
        "PantechTablet": "Pantech.*P4100",
        "BronchoTablet": "Broncho.*(N701|N708|N802|a710)",
        "VersusTablet": "TOUCHPAD.*[78910]|\\bTOUCHTAB\\b",
        "ZyncTablet": "z1000|Z99 2G|z930|z990|z909|Z919|z900",
        "PositivoTablet": "TB07STA|TB10STA|TB07FTA|TB10FTA",
        "NabiTablet": "Android.*\\bNabi",
        "KoboTablet": "Kobo Touch|\\bK080\\b|\\bVox\\b Build|\\bArc\\b Build",
        "DanewTablet": "DSlide.*\\b(700|701R|702|703R|704|802|970|971|972|973|974|1010|1012)\\b",
        "TexetTablet": "NaviPad|TB-772A|TM-7045|TM-7055|TM-9750|TM-7016|TM-7024|TM-7026|TM-7041|TM-7043|TM-7047|TM-8041|TM-9741|TM-9747|TM-9748|TM-9751|TM-7022|TM-7021|TM-7020|TM-7011|TM-7010|TM-7023|TM-7025|TM-7037W|TM-7038W|TM-7027W|TM-9720|TM-9725|TM-9737W|TM-1020|TM-9738W|TM-9740|TM-9743W|TB-807A|TB-771A|TB-727A|TB-725A|TB-719A|TB-823A|TB-805A|TB-723A|TB-715A|TB-707A|TB-705A|TB-709A|TB-711A|TB-890HD|TB-880HD|TB-790HD|TB-780HD|TB-770HD|TB-721HD|TB-710HD|TB-434HD|TB-860HD|TB-840HD|TB-760HD|TB-750HD|TB-740HD|TB-730HD|TB-722HD|TB-720HD|TB-700HD|TB-500HD|TB-470HD|TB-431HD|TB-430HD|TB-506|TB-504|TB-446|TB-436|TB-416|TB-146SE|TB-126SE",
        "PlaystationTablet": "Playstation.*(Portable|Vita)",
        "TrekstorTablet": "ST10416-1|VT10416-1|ST70408-1|ST702xx-1|ST702xx-2|ST80208|ST97216|ST70104-2|VT10416-2|ST10216-2A|SurfTab",
        "PyleAudioTablet": "\\b(PTBL10CEU|PTBL10C|PTBL72BC|PTBL72BCEU|PTBL7CEU|PTBL7C|PTBL92BC|PTBL92BCEU|PTBL9CEU|PTBL9CUK|PTBL9C)\\b",
        "AdvanTablet": "Android.* \\b(E3A|T3X|T5C|T5B|T3E|T3C|T3B|T1J|T1F|T2A|T1H|T1i|E1C|T1-E|T5-A|T4|E1-B|T2Ci|T1-B|T1-D|O1-A|E1-A|T1-A|T3A|T4i)\\b ",
        "DanyTechTablet": "Genius Tab G3|Genius Tab S2|Genius Tab Q3|Genius Tab G4|Genius Tab Q4|Genius Tab G-II|Genius TAB GII|Genius TAB GIII|Genius Tab S1",
        "GalapadTablet": "Android.*\\bG1\\b(?!\\))",
        "MicromaxTablet": "Funbook|Micromax.*\\b(P250|P560|P360|P362|P600|P300|P350|P500|P275)\\b",
        "KarbonnTablet": "Android.*\\b(A39|A37|A34|ST8|ST10|ST7|Smart Tab3|Smart Tab2)\\b",
        "AllFineTablet": "Fine7 Genius|Fine7 Shine|Fine7 Air|Fine8 Style|Fine9 More|Fine10 Joy|Fine11 Wide",
        "PROSCANTablet": "\\b(PEM63|PLT1023G|PLT1041|PLT1044|PLT1044G|PLT1091|PLT4311|PLT4311PL|PLT4315|PLT7030|PLT7033|PLT7033D|PLT7035|PLT7035D|PLT7044K|PLT7045K|PLT7045KB|PLT7071KG|PLT7072|PLT7223G|PLT7225G|PLT7777G|PLT7810K|PLT7849G|PLT7851G|PLT7852G|PLT8015|PLT8031|PLT8034|PLT8036|PLT8080K|PLT8082|PLT8088|PLT8223G|PLT8234G|PLT8235G|PLT8816K|PLT9011|PLT9045K|PLT9233G|PLT9735|PLT9760G|PLT9770G)\\b",
        "YONESTablet": "BQ1078|BC1003|BC1077|RK9702|BC9730|BC9001|IT9001|BC7008|BC7010|BC708|BC728|BC7012|BC7030|BC7027|BC7026",
        "ChangJiaTablet": "TPC7102|TPC7103|TPC7105|TPC7106|TPC7107|TPC7201|TPC7203|TPC7205|TPC7210|TPC7708|TPC7709|TPC7712|TPC7110|TPC8101|TPC8103|TPC8105|TPC8106|TPC8203|TPC8205|TPC8503|TPC9106|TPC9701|TPC97101|TPC97103|TPC97105|TPC97106|TPC97111|TPC97113|TPC97203|TPC97603|TPC97809|TPC97205|TPC10101|TPC10103|TPC10106|TPC10111|TPC10203|TPC10205|TPC10503",
        "GUTablet": "TX-A1301|TX-M9002|Q702|kf026",
        "PointOfViewTablet": "TAB-P506|TAB-navi-7-3G-M|TAB-P517|TAB-P-527|TAB-P701|TAB-P703|TAB-P721|TAB-P731N|TAB-P741|TAB-P825|TAB-P905|TAB-P925|TAB-PR945|TAB-PL1015|TAB-P1025|TAB-PI1045|TAB-P1325|TAB-PROTAB[0-9]+|TAB-PROTAB25|TAB-PROTAB26|TAB-PROTAB27|TAB-PROTAB26XL|TAB-PROTAB2-IPS9|TAB-PROTAB30-IPS9|TAB-PROTAB25XXL|TAB-PROTAB26-IPS10|TAB-PROTAB30-IPS10",
        "OvermaxTablet": "OV-(SteelCore|NewBase|Basecore|Baseone|Exellen|Quattor|EduTab|Solution|ACTION|BasicTab|TeddyTab|MagicTab|Stream|TB-08|TB-09)|Qualcore 1027",
        "HCLTablet": "HCL.*Tablet|Connect-3G-2.0|Connect-2G-2.0|ME Tablet U1|ME Tablet U2|ME Tablet G1|ME Tablet X1|ME Tablet Y2|ME Tablet Sync",
        "DPSTablet": "DPS Dream 9|DPS Dual 7",
        "VistureTablet": "V97 HD|i75 3G|Visture V4( HD)?|Visture V5( HD)?|Visture V10",
        "CrestaTablet": "CTP(-)?810|CTP(-)?818|CTP(-)?828|CTP(-)?838|CTP(-)?888|CTP(-)?978|CTP(-)?980|CTP(-)?987|CTP(-)?988|CTP(-)?989",
        "MediatekTablet": "\\bMT8125|MT8389|MT8135|MT8377\\b",
        "ConcordeTablet": "Concorde([ ]+)?Tab|ConCorde ReadMan",
        "GoCleverTablet": "GOCLEVER TAB|A7GOCLEVER|M1042|M7841|M742|R1042BK|R1041|TAB A975|TAB A7842|TAB A741|TAB A741L|TAB M723G|TAB M721|TAB A1021|TAB I921|TAB R721|TAB I720|TAB T76|TAB R70|TAB R76.2|TAB R106|TAB R83.2|TAB M813G|TAB I721|GCTA722|TAB I70|TAB I71|TAB S73|TAB R73|TAB R74|TAB R93|TAB R75|TAB R76.1|TAB A73|TAB A93|TAB A93.2|TAB T72|TAB R83|TAB R974|TAB R973|TAB A101|TAB A103|TAB A104|TAB A104.2|R105BK|M713G|A972BK|TAB A971|TAB R974.2|TAB R104|TAB R83.3|TAB A1042",
        "ModecomTablet": "FreeTAB 9000|FreeTAB 7.4|FreeTAB 7004|FreeTAB 7800|FreeTAB 2096|FreeTAB 7.5|FreeTAB 1014|FreeTAB 1001 |FreeTAB 8001|FreeTAB 9706|FreeTAB 9702|FreeTAB 7003|FreeTAB 7002|FreeTAB 1002|FreeTAB 7801|FreeTAB 1331|FreeTAB 1004|FreeTAB 8002|FreeTAB 8014|FreeTAB 9704|FreeTAB 1003",
        "VoninoTablet": "\\b(Argus[ _]?S|Diamond[ _]?79HD|Emerald[ _]?78E|Luna[ _]?70C|Onyx[ _]?S|Onyx[ _]?Z|Orin[ _]?HD|Orin[ _]?S|Otis[ _]?S|SpeedStar[ _]?S|Magnet[ _]?M9|Primus[ _]?94[ _]?3G|Primus[ _]?94HD|Primus[ _]?QS|Android.*\\bQ8\\b|Sirius[ _]?EVO[ _]?QS|Sirius[ _]?QS|Spirit[ _]?S)\\b",
        "ECSTablet": "V07OT2|TM105A|S10OT1|TR10CS1",
        "StorexTablet": "eZee[_']?(Tab|Go)[0-9]+|TabLC7|Looney Tunes Tab",
        "VodafoneTablet": "SmartTab([ ]+)?[0-9]+|SmartTabII10|SmartTabII7|VF-1497|VFD 1400",
        "EssentielBTablet": "Smart[ ']?TAB[ ]+?[0-9]+|Family[ ']?TAB2",
        "RossMoorTablet": "RM-790|RM-997|RMD-878G|RMD-974R|RMT-705A|RMT-701|RME-601|RMT-501|RMT-711",
        "iMobileTablet": "i-mobile i-note",
        "TolinoTablet": "tolino tab [0-9.]+|tolino shine",
        "AudioSonicTablet": "\\bC-22Q|T7-QC|T-17B|T-17P\\b",
        "AMPETablet": "Android.* A78 ",
        "SkkTablet": "Android.* (SKYPAD|PHOENIX|CYCLOPS)",
        "TecnoTablet": "TECNO P9|TECNO DP8D",
        "JXDTablet": "Android.* \\b(F3000|A3300|JXD5000|JXD3000|JXD2000|JXD300B|JXD300|S5800|S7800|S602b|S5110b|S7300|S5300|S602|S603|S5100|S5110|S601|S7100a|P3000F|P3000s|P101|P200s|P1000m|P200m|P9100|P1000s|S6600b|S908|P1000|P300|S18|S6600|S9100)\\b",
        "iJoyTablet": "Tablet (Spirit 7|Essentia|Galatea|Fusion|Onix 7|Landa|Titan|Scooby|Deox|Stella|Themis|Argon|Unique 7|Sygnus|Hexen|Finity 7|Cream|Cream X2|Jade|Neon 7|Neron 7|Kandy|Scape|Saphyr 7|Rebel|Biox|Rebel|Rebel 8GB|Myst|Draco 7|Myst|Tab7-004|Myst|Tadeo Jones|Tablet Boing|Arrow|Draco Dual Cam|Aurix|Mint|Amity|Revolution|Finity 9|Neon 9|T9w|Amity 4GB Dual Cam|Stone 4GB|Stone 8GB|Andromeda|Silken|X2|Andromeda II|Halley|Flame|Saphyr 9,7|Touch 8|Planet|Triton|Unique 10|Hexen 10|Memphis 4GB|Memphis 8GB|Onix 10)",
        "FX2Tablet": "FX2 PAD7|FX2 PAD10",
        "XoroTablet": "KidsPAD 701|PAD[ ]?712|PAD[ ]?714|PAD[ ]?716|PAD[ ]?717|PAD[ ]?718|PAD[ ]?720|PAD[ ]?721|PAD[ ]?722|PAD[ ]?790|PAD[ ]?792|PAD[ ]?900|PAD[ ]?9715D|PAD[ ]?9716DR|PAD[ ]?9718DR|PAD[ ]?9719QR|PAD[ ]?9720QR|TelePAD1030|Telepad1032|TelePAD730|TelePAD731|TelePAD732|TelePAD735Q|TelePAD830|TelePAD9730|TelePAD795|MegaPAD 1331|MegaPAD 1851|MegaPAD 2151",
        "ViewsonicTablet": "ViewPad 10pi|ViewPad 10e|ViewPad 10s|ViewPad E72|ViewPad7|ViewPad E100|ViewPad 7e|ViewSonic VB733|VB100a",
        "VerizonTablet": "QTAQZ3|QTAIR7|QTAQTZ3|QTASUN1|QTASUN2|QTAXIA1",
        "OdysTablet": "LOOX|XENO10|ODYS[ -](Space|EVO|Xpress|NOON)|\\bXELIO\\b|Xelio10Pro|XELIO7PHONETAB|XELIO10EXTREME|XELIOPT2|NEO_QUAD10",
        "CaptivaTablet": "CAPTIVA PAD",
        "IconbitTablet": "NetTAB|NT-3702|NT-3702S|NT-3702S|NT-3603P|NT-3603P|NT-0704S|NT-0704S|NT-3805C|NT-3805C|NT-0806C|NT-0806C|NT-0909T|NT-0909T|NT-0907S|NT-0907S|NT-0902S|NT-0902S",
        "TeclastTablet": "T98 4G|\\bP80\\b|\\bX90HD\\b|X98 Air|X98 Air 3G|\\bX89\\b|P80 3G|\\bX80h\\b|P98 Air|\\bX89HD\\b|P98 3G|\\bP90HD\\b|P89 3G|X98 3G|\\bP70h\\b|P79HD 3G|G18d 3G|\\bP79HD\\b|\\bP89s\\b|\\bA88\\b|\\bP10HD\\b|\\bP19HD\\b|G18 3G|\\bP78HD\\b|\\bA78\\b|\\bP75\\b|G17s 3G|G17h 3G|\\bP85t\\b|\\bP90\\b|\\bP11\\b|\\bP98t\\b|\\bP98HD\\b|\\bG18d\\b|\\bP85s\\b|\\bP11HD\\b|\\bP88s\\b|\\bA80HD\\b|\\bA80se\\b|\\bA10h\\b|\\bP89\\b|\\bP78s\\b|\\bG18\\b|\\bP85\\b|\\bA70h\\b|\\bA70\\b|\\bG17\\b|\\bP18\\b|\\bA80s\\b|\\bA11s\\b|\\bP88HD\\b|\\bA80h\\b|\\bP76s\\b|\\bP76h\\b|\\bP98\\b|\\bA10HD\\b|\\bP78\\b|\\bP88\\b|\\bA11\\b|\\bA10t\\b|\\bP76a\\b|\\bP76t\\b|\\bP76e\\b|\\bP85HD\\b|\\bP85a\\b|\\bP86\\b|\\bP75HD\\b|\\bP76v\\b|\\bA12\\b|\\bP75a\\b|\\bA15\\b|\\bP76Ti\\b|\\bP81HD\\b|\\bA10\\b|\\bT760VE\\b|\\bT720HD\\b|\\bP76\\b|\\bP73\\b|\\bP71\\b|\\bP72\\b|\\bT720SE\\b|\\bC520Ti\\b|\\bT760\\b|\\bT720VE\\b|T720-3GE|T720-WiFi",
        "OndaTablet": "\\b(V975i|Vi30|VX530|V701|Vi60|V701s|Vi50|V801s|V719|Vx610w|VX610W|V819i|Vi10|VX580W|Vi10|V711s|V813|V811|V820w|V820|Vi20|V711|VI30W|V712|V891w|V972|V819w|V820w|Vi60|V820w|V711|V813s|V801|V819|V975s|V801|V819|V819|V818|V811|V712|V975m|V101w|V961w|V812|V818|V971|V971s|V919|V989|V116w|V102w|V973|Vi40)\\b[\\s]+|V10 \\b4G\\b",
        "JaytechTablet": "TPC-PA762",
        "BlaupunktTablet": "Endeavour 800NG|Endeavour 1010",
        "DigmaTablet": "\\b(iDx10|iDx9|iDx8|iDx7|iDxD7|iDxD8|iDsQ8|iDsQ7|iDsQ8|iDsD10|iDnD7|3TS804H|iDsQ11|iDj7|iDs10)\\b",
        "EvolioTablet": "ARIA_Mini_wifi|Aria[ _]Mini|Evolio X10|Evolio X7|Evolio X8|\\bEvotab\\b|\\bNeura\\b",
        "LavaTablet": "QPAD E704|\\bIvoryS\\b|E-TAB IVORY|\\bE-TAB\\b",
        "AocTablet": "MW0811|MW0812|MW0922|MTK8382|MW1031|MW0831|MW0821|MW0931|MW0712",
        "MpmanTablet": "MP11 OCTA|MP10 OCTA|MPQC1114|MPQC1004|MPQC994|MPQC974|MPQC973|MPQC804|MPQC784|MPQC780|\\bMPG7\\b|MPDCG75|MPDCG71|MPDC1006|MP101DC|MPDC9000|MPDC905|MPDC706HD|MPDC706|MPDC705|MPDC110|MPDC100|MPDC99|MPDC97|MPDC88|MPDC8|MPDC77|MP709|MID701|MID711|MID170|MPDC703|MPQC1010",
        "CelkonTablet": "CT695|CT888|CT[\\s]?910|CT7 Tab|CT9 Tab|CT3 Tab|CT2 Tab|CT1 Tab|C820|C720|\\bCT-1\\b",
        "WolderTablet": "miTab \\b(DIAMOND|SPACE|BROOKLYN|NEO|FLY|MANHATTAN|FUNK|EVOLUTION|SKY|GOCAR|IRON|GENIUS|POP|MINT|EPSILON|BROADWAY|JUMP|HOP|LEGEND|NEW AGE|LINE|ADVANCE|FEEL|FOLLOW|LIKE|LINK|LIVE|THINK|FREEDOM|CHICAGO|CLEVELAND|BALTIMORE-GH|IOWA|BOSTON|SEATTLE|PHOENIX|DALLAS|IN 101|MasterChef)\\b",
        "MediacomTablet": "M-MPI10C3G|M-SP10EG|M-SP10EGP|M-SP10HXAH|M-SP7HXAH|M-SP10HXBH|M-SP8HXAH|M-SP8MXA",
        "MiTablet": "\\bMI PAD\\b|\\bHM NOTE 1W\\b",
        "NibiruTablet": "Nibiru M1|Nibiru Jupiter One",
        "NexoTablet": "NEXO NOVA|NEXO 10|NEXO AVIO|NEXO FREE|NEXO GO|NEXO EVO|NEXO 3G|NEXO SMART|NEXO KIDDO|NEXO MOBI",
        "LeaderTablet": "TBLT10Q|TBLT10I|TBL-10WDKB|TBL-10WDKBO2013|TBL-W230V2|TBL-W450|TBL-W500|SV572|TBLT7I|TBA-AC7-8G|TBLT79|TBL-8W16|TBL-10W32|TBL-10WKB|TBL-W100",
        "UbislateTablet": "UbiSlate[\\s]?7C",
        "PocketBookTablet": "Pocketbook",
        "KocasoTablet": "\\b(TB-1207)\\b",
        "HisenseTablet": "\\b(F5281|E2371)\\b",
        "Hudl": "Hudl HT7S3|Hudl 2",
        "TelstraTablet": "T-Hub2",
        "GenericTablet": "Android.*\\b97D\\b|Tablet(?!.*PC)|BNTV250A|MID-WCDMA|LogicPD Zoom2|\\bA7EB\\b|CatNova8|A1_07|CT704|CT1002|\\bM721\\b|rk30sdk|\\bEVOTAB\\b|M758A|ET904|ALUMIUM10|Smartfren Tab|Endeavour 1010|Tablet-PC-4|Tagi Tab|\\bM6pro\\b|CT1020W|arc 10HD|\\bTP750\\b|\\bQTAQZ3\\b|WVT101|TM1088|KT107"
    },
    "oss": {
        "AndroidOS": "Android",
        "BlackBerryOS": "blackberry|\\bBB10\\b|rim tablet os",
        "PalmOS": "PalmOS|avantgo|blazer|elaine|hiptop|palm|plucker|xiino",
        "SymbianOS": "Symbian|SymbOS|Series60|Series40|SYB-[0-9]+|\\bS60\\b",
        "WindowsMobileOS": "Windows CE.*(PPC|Smartphone|Mobile|[0-9]{3}x[0-9]{3})|Windows Mobile|Windows Phone [0-9.]+|WCE;",
        "WindowsPhoneOS": "Windows Phone 10.0|Windows Phone 8.1|Windows Phone 8.0|Windows Phone OS|XBLWP7|ZuneWP7|Windows NT 6.[23]; ARM;",
        "iOS": "\\biPhone.*Mobile|\\biPod|\\biPad|AppleCoreMedia",
        "iPadOS": "CPU OS 13",
        "MeeGoOS": "MeeGo",
        "MaemoOS": "Maemo",
        "JavaOS": "J2ME\/|\\bMIDP\\b|\\bCLDC\\b",
        "webOS": "webOS|hpwOS",
        "badaOS": "\\bBada\\b",
        "BREWOS": "BREW"
    },
    "uas": {
        "Chrome": "\\bCrMo\\b|CriOS|Android.*Chrome\/[.0-9]* (Mobile)?",
        "Dolfin": "\\bDolfin\\b",
        "Opera": "Opera.*Mini|Opera.*Mobi|Android.*Opera|Mobile.*OPR\/[0-9.]+$|Coast\/[0-9.]+",
        "Skyfire": "Skyfire",
        "Edge": "Mobile Safari\/[.0-9]* Edge",
        "IE": "IEMobile|MSIEMobile",
        "Firefox": "fennec|firefox.*maemo|(Mobile|Tablet).*Firefox|Firefox.*Mobile|FxiOS",
        "Bolt": "bolt",
        "TeaShark": "teashark",
        "Blazer": "Blazer",
        "Safari": "Version.*Mobile.*Safari|Safari.*Mobile|MobileSafari",
        "WeChat": "\\bMicroMessenger\\b",
        "UCBrowser": "UC.*Browser|UCWEB",
        "baiduboxapp": "baiduboxapp",
        "baidubrowser": "baidubrowser",
        "DiigoBrowser": "DiigoBrowser",
        "Mercury": "\\bMercury\\b",
        "ObigoBrowser": "Obigo",
        "NetFront": "NF-Browser",
        "GenericBrowser": "NokiaBrowser|OviBrowser|OneBrowser|TwonkyBeamBrowser|SEMC.*Browser|FlyFlow|Minimo|NetFront|Novarra-Vision|MQQBrowser|MicroMessenger",
        "PaleMoon": "Android.*PaleMoon|Mobile.*PaleMoon"
    },
    "props": {
        "Mobile": "Mobile\/[VER]",
        "Build": "Build\/[VER]",
        "Version": "Version\/[VER]",
        "VendorID": "VendorID\/[VER]",
        "iPad": "iPad.*CPU[a-z ]+[VER]",
        "iPhone": "iPhone.*CPU[a-z ]+[VER]",
        "iPod": "iPod.*CPU[a-z ]+[VER]",
        "Kindle": "Kindle\/[VER]",
        "Chrome": [
            "Chrome\/[VER]",
            "CriOS\/[VER]",
            "CrMo\/[VER]"
        ],
        "Coast": [
            "Coast\/[VER]"
        ],
        "Dolfin": "Dolfin\/[VER]",
        "Firefox": [
            "Firefox\/[VER]",
            "FxiOS\/[VER]"
        ],
        "Fennec": "Fennec\/[VER]",
        "Edge": "Edge\/[VER]",
        "IE": [
            "IEMobile\/[VER];",
            "IEMobile [VER]",
            "MSIE [VER];",
            "Trident\/[0-9.]+;.*rv:[VER]"
        ],
        "NetFront": "NetFront\/[VER]",
        "NokiaBrowser": "NokiaBrowser\/[VER]",
        "Opera": [
            " OPR\/[VER]",
            "Opera Mini\/[VER]",
            "Version\/[VER]"
        ],
        "Opera Mini": "Opera Mini\/[VER]",
        "Opera Mobi": "Version\/[VER]",
        "UCBrowser": [
            "UCWEB[VER]",
            "UC.*Browser\/[VER]"
        ],
        "MQQBrowser": "MQQBrowser\/[VER]",
        "MicroMessenger": "MicroMessenger\/[VER]",
        "baiduboxapp": "baiduboxapp\/[VER]",
        "baidubrowser": "baidubrowser\/[VER]",
        "SamsungBrowser": "SamsungBrowser\/[VER]",
        "Iron": "Iron\/[VER]",
        "Safari": [
            "Version\/[VER]",
            "Safari\/[VER]"
        ],
        "Skyfire": "Skyfire\/[VER]",
        "Tizen": "Tizen\/[VER]",
        "Webkit": "webkit[ \/][VER]",
        "PaleMoon": "PaleMoon\/[VER]",
        "Gecko": "Gecko\/[VER]",
        "Trident": "Trident\/[VER]",
        "Presto": "Presto\/[VER]",
        "Goanna": "Goanna\/[VER]",
        "iOS": " \\bi?OS\\b [VER][ ;]{1}",
        "Android": "Android [VER]",
        "BlackBerry": [
            "BlackBerry[\\w]+\/[VER]",
            "BlackBerry.*Version\/[VER]",
            "Version\/[VER]"
        ],
        "BREW": "BREW [VER]",
        "Java": "Java\/[VER]",
        "Windows Phone OS": [
            "Windows Phone OS [VER]",
            "Windows Phone [VER]"
        ],
        "Windows Phone": "Windows Phone [VER]",
        "Windows CE": "Windows CE\/[VER]",
        "Windows NT": "Windows NT [VER]",
        "Symbian": [
            "SymbianOS\/[VER]",
            "Symbian\/[VER]"
        ],
        "webOS": [
            "webOS\/[VER]",
            "hpwOS\/[VER];"
        ]
    },
    "utils": {
        "Bot": "Googlebot|facebookexternalhit|Google-AMPHTML|s~amp-validator|AdsBot-Google|Google Keyword Suggestion|Facebot|YandexBot|YandexMobileBot|bingbot|ia_archiver|AhrefsBot|Ezooms|GSLFbot|WBSearchBot|Twitterbot|TweetmemeBot|Twikle|PaperLiBot|Wotbox|UnwindFetchor|Exabot|MJ12bot|YandexImages|TurnitinBot|Pingdom|contentkingapp",
        "MobileBot": "Googlebot-Mobile|AdsBot-Google-Mobile|YahooSeeker\/M1A1-R2D2",
        "DesktopMode": "WPDesktop",
        "TV": "SonyDTV|HbbTV",
        "WebKit": "(webkit)[ \/]([\\w.]+)",
        "Console": "\\b(Nintendo|Nintendo WiiU|Nintendo 3DS|Nintendo Switch|PLAYSTATION|Xbox)\\b",
        "Watch": "SM-V700"
    }
};

    // following patterns come from http://detectmobilebrowsers.com/
    impl.detectMobileBrowsers = {
        fullPattern: /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i,
        shortPattern: /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i,
        tabletPattern: /android|ipad|playbook|silk/i
    };

    var hasOwnProp = Object.prototype.hasOwnProperty,
        isArray;

    impl.FALLBACK_PHONE = 'UnknownPhone';
    impl.FALLBACK_TABLET = 'UnknownTablet';
    impl.FALLBACK_MOBILE = 'UnknownMobile';

    isArray = ('isArray' in Array) ?
        Array.isArray : function (value) { return Object.prototype.toString.call(value) === '[object Array]'; };

    function equalIC(a, b) {
        return a != null && b != null && a.toLowerCase() === b.toLowerCase();
    }

    function containsIC(array, value) {
        var valueLC, i, len = array.length;
        if (!len || !value) {
            return false;
        }
        valueLC = value.toLowerCase();
        for (i = 0; i < len; ++i) {
            if (valueLC === array[i].toLowerCase()) {
                return true;
            }
        }
        return false;
    }

    function convertPropsToRegExp(object) {
        for (var key in object) {
            if (hasOwnProp.call(object, key)) {
                object[key] = new RegExp(object[key], 'i');
            }
        }
    }

    function prepareUserAgent(userAgent) {
        return (userAgent || '').substr(0, 500); // mitigate vulnerable to ReDoS
    }

    (function init() {
        var key, values, value, i, len, verPos, mobileDetectRules = impl.mobileDetectRules;
        for (key in mobileDetectRules.props) {
            if (hasOwnProp.call(mobileDetectRules.props, key)) {
                values = mobileDetectRules.props[key];
                if (!isArray(values)) {
                    values = [values];
                }
                len = values.length;
                for (i = 0; i < len; ++i) {
                    value = values[i];
                    verPos = value.indexOf('[VER]');
                    if (verPos >= 0) {
                        value = value.substring(0, verPos) + '([\\w._\\+]+)' + value.substring(verPos + 5);
                    }
                    values[i] = new RegExp(value, 'i');
                }
                mobileDetectRules.props[key] = values;
            }
        }
        convertPropsToRegExp(mobileDetectRules.oss);
        convertPropsToRegExp(mobileDetectRules.phones);
        convertPropsToRegExp(mobileDetectRules.tablets);
        convertPropsToRegExp(mobileDetectRules.uas);
        convertPropsToRegExp(mobileDetectRules.utils);

        // copy some patterns to oss0 which are tested first (see issue#15)
        mobileDetectRules.oss0 = {
            WindowsPhoneOS: mobileDetectRules.oss.WindowsPhoneOS,
            WindowsMobileOS: mobileDetectRules.oss.WindowsMobileOS
        };
    }());

    /**
     * Test userAgent string against a set of rules and find the first matched key.
     * @param {Object} rules (key is String, value is RegExp)
     * @param {String} userAgent the navigator.userAgent (or HTTP-Header 'User-Agent').
     * @returns {String|null} the matched key if found, otherwise <tt>null</tt>
     * @private
     */
    impl.findMatch = function(rules, userAgent) {
        for (var key in rules) {
            if (hasOwnProp.call(rules, key)) {
                if (rules[key].test(userAgent)) {
                    return key;
                }
            }
        }
        return null;
    };

    /**
     * Test userAgent string against a set of rules and return an array of matched keys.
     * @param {Object} rules (key is String, value is RegExp)
     * @param {String} userAgent the navigator.userAgent (or HTTP-Header 'User-Agent').
     * @returns {Array} an array of matched keys, may be empty when there is no match, but not <tt>null</tt>
     * @private
     */
    impl.findMatches = function(rules, userAgent) {
        var result = [];
        for (var key in rules) {
            if (hasOwnProp.call(rules, key)) {
                if (rules[key].test(userAgent)) {
                    result.push(key);
                }
            }
        }
        return result;
    };

    /**
     * Check the version of the given property in the User-Agent.
     *
     * @param {String} propertyName
     * @param {String} userAgent
     * @return {String} version or <tt>null</tt> if version not found
     * @private
     */
    impl.getVersionStr = function (propertyName, userAgent) {
        var props = impl.mobileDetectRules.props, patterns, i, len, match;
        if (hasOwnProp.call(props, propertyName)) {
            patterns = props[propertyName];
            len = patterns.length;
            for (i = 0; i < len; ++i) {
                match = patterns[i].exec(userAgent);
                if (match !== null) {
                    return match[1];
                }
            }
        }
        return null;
    };

    /**
     * Check the version of the given property in the User-Agent.
     * Will return a float number. (eg. 2_0 will return 2.0, 4.3.1 will return 4.31)
     *
     * @param {String} propertyName
     * @param {String} userAgent
     * @return {Number} version or <tt>NaN</tt> if version not found
     * @private
     */
    impl.getVersion = function (propertyName, userAgent) {
        var version = impl.getVersionStr(propertyName, userAgent);
        return version ? impl.prepareVersionNo(version) : NaN;
    };

    /**
     * Prepare the version number.
     *
     * @param {String} version
     * @return {Number} the version number as a floating number
     * @private
     */
    impl.prepareVersionNo = function (version) {
        var numbers;

        numbers = version.split(/[a-z._ \/\-]/i);
        if (numbers.length === 1) {
            version = numbers[0];
        }
        if (numbers.length > 1) {
            version = numbers[0] + '.';
            numbers.shift();
            version += numbers.join('');
        }
        return Number(version);
    };

    impl.isMobileFallback = function (userAgent) {
        return impl.detectMobileBrowsers.fullPattern.test(userAgent) ||
            impl.detectMobileBrowsers.shortPattern.test(userAgent.substr(0,4));
    };

    impl.isTabletFallback = function (userAgent) {
        return impl.detectMobileBrowsers.tabletPattern.test(userAgent);
    };

    impl.prepareDetectionCache = function (cache, userAgent, maxPhoneWidth) {
        if (cache.mobile !== undefined) {
            return;
        }
        var phone, tablet, phoneSized;

        // first check for stronger tablet rules, then phone (see issue#5)
        tablet = impl.findMatch(impl.mobileDetectRules.tablets, userAgent);
        if (tablet) {
            cache.mobile = cache.tablet = tablet;
            cache.phone = null;
            return; // unambiguously identified as tablet
        }

        phone = impl.findMatch(impl.mobileDetectRules.phones, userAgent);
        if (phone) {
            cache.mobile = cache.phone = phone;
            cache.tablet = null;
            return; // unambiguously identified as phone
        }

        // our rules haven't found a match -> try more general fallback rules
        if (impl.isMobileFallback(userAgent)) {
            phoneSized = MobileDetect.isPhoneSized(maxPhoneWidth);
            if (phoneSized === undefined) {
                cache.mobile = impl.FALLBACK_MOBILE;
                cache.tablet = cache.phone = null;
            } else if (phoneSized) {
                cache.mobile = cache.phone = impl.FALLBACK_PHONE;
                cache.tablet = null;
            } else {
                cache.mobile = cache.tablet = impl.FALLBACK_TABLET;
                cache.phone = null;
            }
        } else if (impl.isTabletFallback(userAgent)) {
            cache.mobile = cache.tablet = impl.FALLBACK_TABLET;
            cache.phone = null;
        } else {
            // not mobile at all!
            cache.mobile = cache.tablet = cache.phone = null;
        }
    };

    // t is a reference to a MobileDetect instance
    impl.mobileGrade = function (t) {
        // impl note:
        // To keep in sync w/ Mobile_Detect.php easily, the following code is tightly aligned to the PHP version.
        // When changes are made in Mobile_Detect.php, copy this method and replace:
        //     $this-> / t.
        //     self::MOBILE_GRADE_(.) / '$1'
        //     , self::VERSION_TYPE_FLOAT / (nothing)
        //     isIOS() / os('iOS')
        //     [reg] / (nothing)   <-- jsdelivr complaining about unescaped unicode character U+00AE
        var $isMobile = t.mobile() !== null;

        if (
            // Apple iOS 3.2-5.1 - Tested on the original iPad (4.3 / 5.0), iPad 2 (4.3), iPad 3 (5.1), original iPhone (3.1), iPhone 3 (3.2), 3GS (4.3), 4 (4.3 / 5.0), and 4S (5.1)
            t.os('iOS') && t.version('iPad')>=4.3 ||
            t.os('iOS') && t.version('iPhone')>=3.1 ||
            t.os('iOS') && t.version('iPod')>=3.1 ||

            // Android 2.1-2.3 - Tested on the HTC Incredible (2.2), original Droid (2.2), HTC Aria (2.1), Google Nexus S (2.3). Functional on 1.5 & 1.6 but performance may be sluggish, tested on Google G1 (1.5)
            // Android 3.1 (Honeycomb)  - Tested on the Samsung Galaxy Tab 10.1 and Motorola XOOM
            // Android 4.0 (ICS)  - Tested on a Galaxy Nexus. Note: transition performance can be poor on upgraded devices
            // Android 4.1 (Jelly Bean)  - Tested on a Galaxy Nexus and Galaxy 7
            ( t.version('Android')>2.1 && t.is('Webkit') ) ||

            // Windows Phone 7-7.5 - Tested on the HTC Surround (7.0) HTC Trophy (7.5), LG-E900 (7.5), Nokia Lumia 800
            t.version('Windows Phone OS')>=7.0 ||

            // Blackberry 7 - Tested on BlackBerry Torch 9810
            // Blackberry 6.0 - Tested on the Torch 9800 and Style 9670
            t.is('BlackBerry') && t.version('BlackBerry')>=6.0 ||
            // Blackberry Playbook (1.0-2.0) - Tested on PlayBook
            t.match('Playbook.*Tablet') ||

            // Palm WebOS (1.4-2.0) - Tested on the Palm Pixi (1.4), Pre (1.4), Pre 2 (2.0)
            ( t.version('webOS')>=1.4 && t.match('Palm|Pre|Pixi') ) ||
            // Palm WebOS 3.0  - Tested on HP TouchPad
            t.match('hp.*TouchPad') ||

            // Firefox Mobile (12 Beta) - Tested on Android 2.3 device
            ( t.is('Firefox') && t.version('Firefox')>=12 ) ||

            // Chrome for Android - Tested on Android 4.0, 4.1 device
            ( t.is('Chrome') && t.is('AndroidOS') && t.version('Android')>=4.0 ) ||

            // Skyfire 4.1 - Tested on Android 2.3 device
            ( t.is('Skyfire') && t.version('Skyfire')>=4.1 && t.is('AndroidOS') && t.version('Android')>=2.3 ) ||

            // Opera Mobile 11.5-12: Tested on Android 2.3
            ( t.is('Opera') && t.version('Opera Mobi')>11 && t.is('AndroidOS') ) ||

            // Meego 1.2 - Tested on Nokia 950 and N9
            t.is('MeeGoOS') ||

            // Tizen (pre-release) - Tested on early hardware
            t.is('Tizen') ||

            // Samsung Bada 2.0 - Tested on a Samsung Wave 3, Dolphin browser
            // @todo: more tests here!
            t.is('Dolfin') && t.version('Bada')>=2.0 ||

            // UC Browser - Tested on Android 2.3 device
            ( (t.is('UC Browser') || t.is('Dolfin')) && t.version('Android')>=2.3 ) ||

            // Kindle 3 and Fire  - Tested on the built-in WebKit browser for each
            ( t.match('Kindle Fire') ||
                t.is('Kindle') && t.version('Kindle')>=3.0 ) ||

            // Nook Color 1.4.1 - Tested on original Nook Color, not Nook Tablet
            t.is('AndroidOS') && t.is('NookTablet') ||

            // Chrome Desktop 11-21 - Tested on OS X 10.7 and Windows 7
            t.version('Chrome')>=11 && !$isMobile ||

            // Safari Desktop 4-5 - Tested on OS X 10.7 and Windows 7
            t.version('Safari')>=5.0 && !$isMobile ||

            // Firefox Desktop 4-13 - Tested on OS X 10.7 and Windows 7
            t.version('Firefox')>=4.0 && !$isMobile ||

            // Internet Explorer 7-9 - Tested on Windows XP, Vista and 7
            t.version('MSIE')>=7.0 && !$isMobile ||

            // Opera Desktop 10-12 - Tested on OS X 10.7 and Windows 7
            // @reference: http://my.opera.com/community/openweb/idopera/
            t.version('Opera')>=10 && !$isMobile

            ){
            return 'A';
        }

        if (
            t.os('iOS') && t.version('iPad')<4.3 ||
            t.os('iOS') && t.version('iPhone')<3.1 ||
            t.os('iOS') && t.version('iPod')<3.1 ||

            // Blackberry 5.0: Tested on the Storm 2 9550, Bold 9770
            t.is('Blackberry') && t.version('BlackBerry')>=5 && t.version('BlackBerry')<6 ||

            //Opera Mini (5.0-6.5) - Tested on iOS 3.2/4.3 and Android 2.3
            ( t.version('Opera Mini')>=5.0 && t.version('Opera Mini')<=6.5 &&
                (t.version('Android')>=2.3 || t.is('iOS')) ) ||

            // Nokia Symbian^3 - Tested on Nokia N8 (Symbian^3), C7 (Symbian^3), also works on N97 (Symbian^1)
            t.match('NokiaN8|NokiaC7|N97.*Series60|Symbian/3') ||

            // @todo: report this (tested on Nokia N71)
            t.version('Opera Mobi')>=11 && t.is('SymbianOS')
            ){
            return 'B';
        }

        if (
        // Blackberry 4.x - Tested on the Curve 8330
            t.version('BlackBerry')<5.0 ||
            // Windows Mobile - Tested on the HTC Leo (WinMo 5.2)
            t.match('MSIEMobile|Windows CE.*Mobile') || t.version('Windows Mobile')<=5.2

            ){
            return 'C';
        }

        //All older smartphone platforms and featurephones - Any device that doesn't support media queries
        //will receive the basic, C grade experience.
        return 'C';
    };

    impl.detectOS = function (ua) {
        return impl.findMatch(impl.mobileDetectRules.oss0, ua) ||
            impl.findMatch(impl.mobileDetectRules.oss, ua);
    };

    impl.getDeviceSmallerSide = function () {
        return window.screen.width < window.screen.height ?
            window.screen.width :
            window.screen.height;
    };

    /**
     * Constructor for MobileDetect object.
     * <br>
     * Such an object will keep a reference to the given user-agent string and cache most of the detect queries.<br>
     * <div style="background-color: #d9edf7; border: 1px solid #bce8f1; color: #3a87ad; padding: 14px; border-radius: 2px; margin-top: 20px">
     *     <strong>Find information how to download and install:</strong>
     *     <a href="https://github.com/hgoebl/mobile-detect.js/">github.com/hgoebl/mobile-detect.js/</a>
     * </div>
     *
     * @example <pre>
     *     var md = new MobileDetect(window.navigator.userAgent);
     *     if (md.mobile()) {
     *         location.href = (md.mobileGrade() === 'A') ? '/mobile/' : '/lynx/';
     *     }
     * </pre>
     *
     * @param {string} userAgent typically taken from window.navigator.userAgent or http_header['User-Agent']
     * @param {number} [maxPhoneWidth=600] <strong>only for browsers</strong> specify a value for the maximum
     *        width of smallest device side (in logical "CSS" pixels) until a device detected as mobile will be handled
     *        as phone.
     *        This is only used in cases where the device cannot be classified as phone or tablet.<br>
     *        See <a href="http://developer.android.com/guide/practices/screens_support.html">Declaring Tablet Layouts
     *        for Android</a>.<br>
     *        If you provide a value < 0, then this "fuzzy" check is disabled.
     * @constructor
     * @global
     */
    function MobileDetect(userAgent, maxPhoneWidth) {
        this.ua = prepareUserAgent(userAgent);
        this._cache = {};
        //600dp is typical 7" tablet minimum width
        this.maxPhoneWidth = maxPhoneWidth || 600;
    }

    MobileDetect.prototype = {
        constructor: MobileDetect,

        /**
         * Returns the detected phone or tablet type or <tt>null</tt> if it is not a mobile device.
         * <br>
         * For a list of possible return values see {@link MobileDetect#phone} and {@link MobileDetect#tablet}.<br>
         * <br>
         * If the device is not detected by the regular expressions from Mobile-Detect, a test is made against
         * the patterns of <a href="http://detectmobilebrowsers.com/">detectmobilebrowsers.com</a>. If this test
         * is positive, a value of <code>UnknownPhone</code>, <code>UnknownTablet</code> or
         * <code>UnknownMobile</code> is returned.<br>
         * When used in browser, the decision whether phone or tablet is made based on <code>screen.width/height</code>.<br>
         * <br>
         * When used server-side (node.js), there is no way to tell the difference between <code>UnknownTablet</code>
         * and <code>UnknownMobile</code>, so you will get <code>UnknownMobile</code> here.<br>
         * Be aware that since v1.0.0 in this special case you will get <code>UnknownMobile</code> only for:
         * {@link MobileDetect#mobile}, not for {@link MobileDetect#phone} and {@link MobileDetect#tablet}.
         * In versions before v1.0.0 all 3 methods returned <code>UnknownMobile</code> which was tedious to use.
         * <br>
         * In most cases you will use the return value just as a boolean.
         *
         * @returns {String} the key for the phone family or tablet family, e.g. "Nexus".
         * @function MobileDetect#mobile
         */
        mobile: function () {
            impl.prepareDetectionCache(this._cache, this.ua, this.maxPhoneWidth);
            return this._cache.mobile;
        },

        /**
         * Returns the detected phone type/family string or <tt>null</tt>.
         * <br>
         * The returned tablet (family or producer) is one of following keys:<br>
         * <br><tt>iPhone, BlackBerry, HTC, Nexus, Dell, Motorola, Samsung, LG, Sony, Asus,
         * NokiaLumia, Micromax, Palm, Vertu, Pantech, Fly, Wiko, iMobile, SimValley,
         * Wolfgang, Alcatel, Nintendo, Amoi, INQ, OnePlus, GenericPhone</tt><br>
         * <br>
         * If the device is not detected by the regular expressions from Mobile-Detect, a test is made against
         * the patterns of <a href="http://detectmobilebrowsers.com/">detectmobilebrowsers.com</a>. If this test
         * is positive, a value of <code>UnknownPhone</code> or <code>UnknownMobile</code> is returned.<br>
         * When used in browser, the decision whether phone or tablet is made based on <code>screen.width/height</code>.<br>
         * <br>
         * When used server-side (node.js), there is no way to tell the difference between <code>UnknownTablet</code>
         * and <code>UnknownMobile</code>, so you will get <code>null</code> here, while {@link MobileDetect#mobile}
         * will return <code>UnknownMobile</code>.<br>
         * Be aware that since v1.0.0 in this special case you will get <code>UnknownMobile</code> only for:
         * {@link MobileDetect#mobile}, not for {@link MobileDetect#phone} and {@link MobileDetect#tablet}.
         * In versions before v1.0.0 all 3 methods returned <code>UnknownMobile</code> which was tedious to use.
         * <br>
         * In most cases you will use the return value just as a boolean.
         *
         * @returns {String} the key of the phone family or producer, e.g. "iPhone"
         * @function MobileDetect#phone
         */
        phone: function () {
            impl.prepareDetectionCache(this._cache, this.ua, this.maxPhoneWidth);
            return this._cache.phone;
        },

        /**
         * Returns the detected tablet type/family string or <tt>null</tt>.
         * <br>
         * The returned tablet (family or producer) is one of following keys:<br>
         * <br><tt>iPad, NexusTablet, GoogleTablet, SamsungTablet, Kindle, SurfaceTablet,
         * HPTablet, AsusTablet, BlackBerryTablet, HTCtablet, MotorolaTablet, NookTablet,
         * AcerTablet, ToshibaTablet, LGTablet, FujitsuTablet, PrestigioTablet,
         * LenovoTablet, DellTablet, YarvikTablet, MedionTablet, ArnovaTablet,
         * IntensoTablet, IRUTablet, MegafonTablet, EbodaTablet, AllViewTablet,
         * ArchosTablet, AinolTablet, NokiaLumiaTablet, SonyTablet, PhilipsTablet,
         * CubeTablet, CobyTablet, MIDTablet, MSITablet, SMiTTablet, RockChipTablet,
         * FlyTablet, bqTablet, HuaweiTablet, NecTablet, PantechTablet, BronchoTablet,
         * VersusTablet, ZyncTablet, PositivoTablet, NabiTablet, KoboTablet, DanewTablet,
         * TexetTablet, PlaystationTablet, TrekstorTablet, PyleAudioTablet, AdvanTablet,
         * DanyTechTablet, GalapadTablet, MicromaxTablet, KarbonnTablet, AllFineTablet,
         * PROSCANTablet, YONESTablet, ChangJiaTablet, GUTablet, PointOfViewTablet,
         * OvermaxTablet, HCLTablet, DPSTablet, VistureTablet, CrestaTablet,
         * MediatekTablet, ConcordeTablet, GoCleverTablet, ModecomTablet, VoninoTablet,
         * ECSTablet, StorexTablet, VodafoneTablet, EssentielBTablet, RossMoorTablet,
         * iMobileTablet, TolinoTablet, AudioSonicTablet, AMPETablet, SkkTablet,
         * TecnoTablet, JXDTablet, iJoyTablet, FX2Tablet, XoroTablet, ViewsonicTablet,
         * VerizonTablet, OdysTablet, CaptivaTablet, IconbitTablet, TeclastTablet,
         * OndaTablet, JaytechTablet, BlaupunktTablet, DigmaTablet, EvolioTablet,
         * LavaTablet, AocTablet, MpmanTablet, CelkonTablet, WolderTablet, MediacomTablet,
         * MiTablet, NibiruTablet, NexoTablet, LeaderTablet, UbislateTablet,
         * PocketBookTablet, KocasoTablet, HisenseTablet, Hudl, TelstraTablet,
         * GenericTablet</tt><br>
         * <br>
         * If the device is not detected by the regular expressions from Mobile-Detect, a test is made against
         * the patterns of <a href="http://detectmobilebrowsers.com/">detectmobilebrowsers.com</a>. If this test
         * is positive, a value of <code>UnknownTablet</code> or <code>UnknownMobile</code> is returned.<br>
         * When used in browser, the decision whether phone or tablet is made based on <code>screen.width/height</code>.<br>
         * <br>
         * When used server-side (node.js), there is no way to tell the difference between <code>UnknownTablet</code>
         * and <code>UnknownMobile</code>, so you will get <code>null</code> here, while {@link MobileDetect#mobile}
         * will return <code>UnknownMobile</code>.<br>
         * Be aware that since v1.0.0 in this special case you will get <code>UnknownMobile</code> only for:
         * {@link MobileDetect#mobile}, not for {@link MobileDetect#phone} and {@link MobileDetect#tablet}.
         * In versions before v1.0.0 all 3 methods returned <code>UnknownMobile</code> which was tedious to use.
         * <br>
         * In most cases you will use the return value just as a boolean.
         *
         * @returns {String} the key of the tablet family or producer, e.g. "SamsungTablet"
         * @function MobileDetect#tablet
         */
        tablet: function () {
            impl.prepareDetectionCache(this._cache, this.ua, this.maxPhoneWidth);
            return this._cache.tablet;
        },

        /**
         * Returns the (first) detected user-agent string or <tt>null</tt>.
         * <br>
         * The returned user-agent is one of following keys:<br>
         * <br><tt>Chrome, Dolfin, Opera, Skyfire, Edge, IE, Firefox, Bolt, TeaShark, Blazer,
         * Safari, WeChat, UCBrowser, baiduboxapp, baidubrowser, DiigoBrowser, Mercury,
         * ObigoBrowser, NetFront, GenericBrowser, PaleMoon</tt><br>
         * <br>
         * In most cases calling {@link MobileDetect#userAgent} will be sufficient. But there are rare
         * cases where a mobile device pretends to be more than one particular browser. You can get the
         * list of all matches with {@link MobileDetect#userAgents} or check for a particular value by
         * providing one of the defined keys as first argument to {@link MobileDetect#is}.
         *
         * @returns {String} the key for the detected user-agent or <tt>null</tt>
         * @function MobileDetect#userAgent
         */
        userAgent: function () {
            if (this._cache.userAgent === undefined) {
                this._cache.userAgent = impl.findMatch(impl.mobileDetectRules.uas, this.ua);
            }
            return this._cache.userAgent;
        },

        /**
         * Returns all detected user-agent strings.
         * <br>
         * The array is empty or contains one or more of following keys:<br>
         * <br><tt>Chrome, Dolfin, Opera, Skyfire, Edge, IE, Firefox, Bolt, TeaShark, Blazer,
         * Safari, WeChat, UCBrowser, baiduboxapp, baidubrowser, DiigoBrowser, Mercury,
         * ObigoBrowser, NetFront, GenericBrowser, PaleMoon</tt><br>
         * <br>
         * In most cases calling {@link MobileDetect#userAgent} will be sufficient. But there are rare
         * cases where a mobile device pretends to be more than one particular browser. You can get the
         * list of all matches with {@link MobileDetect#userAgents} or check for a particular value by
         * providing one of the defined keys as first argument to {@link MobileDetect#is}.
         *
         * @returns {Array} the array of detected user-agent keys or <tt>[]</tt>
         * @function MobileDetect#userAgents
         */
        userAgents: function () {
            if (this._cache.userAgents === undefined) {
                this._cache.userAgents = impl.findMatches(impl.mobileDetectRules.uas, this.ua);
            }
            return this._cache.userAgents;
        },

        /**
         * Returns the detected operating system string or <tt>null</tt>.
         * <br>
         * The operating system is one of following keys:<br>
         * <br><tt>AndroidOS, BlackBerryOS, PalmOS, SymbianOS, WindowsMobileOS, WindowsPhoneOS,
         * iOS, iPadOS, MeeGoOS, MaemoOS, JavaOS, webOS, badaOS, BREWOS</tt><br>
         *
         * @returns {String} the key for the detected operating system.
         * @function MobileDetect#os
         */
        os: function () {
            if (this._cache.os === undefined) {
                this._cache.os = impl.detectOS(this.ua);
            }
            return this._cache.os;
        },

        /**
         * Get the version (as Number) of the given property in the User-Agent.
         * <br>
         * Will return a float number. (eg. 2_0 will return 2.0, 4.3.1 will return 4.31)
         *
         * @param {String} key a key defining a thing which has a version.<br>
         *        You can use one of following keys:<br>
         * <br><tt>Mobile, Build, Version, VendorID, iPad, iPhone, iPod, Kindle, Chrome, Coast,
         * Dolfin, Firefox, Fennec, Edge, IE, NetFront, NokiaBrowser, Opera, Opera Mini,
         * Opera Mobi, UCBrowser, MQQBrowser, MicroMessenger, baiduboxapp, baidubrowser,
         * SamsungBrowser, Iron, Safari, Skyfire, Tizen, Webkit, PaleMoon, Gecko, Trident,
         * Presto, Goanna, iOS, Android, BlackBerry, BREW, Java, Windows Phone OS, Windows
         * Phone, Windows CE, Windows NT, Symbian, webOS</tt><br>
         *
         * @returns {Number} the version as float or <tt>NaN</tt> if User-Agent doesn't contain this version.
         *          Be careful when comparing this value with '==' operator!
         * @function MobileDetect#version
         */
        version: function (key) {
            return impl.getVersion(key, this.ua);
        },

        /**
         * Get the version (as String) of the given property in the User-Agent.
         * <br>
         *
         * @param {String} key a key defining a thing which has a version.<br>
         *        You can use one of following keys:<br>
         * <br><tt>Mobile, Build, Version, VendorID, iPad, iPhone, iPod, Kindle, Chrome, Coast,
         * Dolfin, Firefox, Fennec, Edge, IE, NetFront, NokiaBrowser, Opera, Opera Mini,
         * Opera Mobi, UCBrowser, MQQBrowser, MicroMessenger, baiduboxapp, baidubrowser,
         * SamsungBrowser, Iron, Safari, Skyfire, Tizen, Webkit, PaleMoon, Gecko, Trident,
         * Presto, Goanna, iOS, Android, BlackBerry, BREW, Java, Windows Phone OS, Windows
         * Phone, Windows CE, Windows NT, Symbian, webOS</tt><br>
         *
         * @returns {String} the "raw" version as String or <tt>null</tt> if User-Agent doesn't contain this version.
         *
         * @function MobileDetect#versionStr
         */
        versionStr: function (key) {
            return impl.getVersionStr(key, this.ua);
        },

        /**
         * Global test key against userAgent, os, phone, tablet and some other properties of userAgent string.
         *
         * @param {String} key the key (case-insensitive) of a userAgent, an operating system, phone or
         *        tablet family.<br>
         *        For a complete list of possible values, see {@link MobileDetect#userAgent},
         *        {@link MobileDetect#os}, {@link MobileDetect#phone}, {@link MobileDetect#tablet}.<br>
         *        Additionally you have following keys:<br>
         * <br><tt>Bot, MobileBot, DesktopMode, TV, WebKit, Console, Watch</tt><br>
         *
         * @returns {boolean} <tt>true</tt> when the given key is one of the defined keys of userAgent, os, phone,
         *                    tablet or one of the listed additional keys, otherwise <tt>false</tt>
         * @function MobileDetect#is
         */
        is: function (key) {
            return containsIC(this.userAgents(), key) ||
                   equalIC(key, this.os()) ||
                   equalIC(key, this.phone()) ||
                   equalIC(key, this.tablet()) ||
                   containsIC(impl.findMatches(impl.mobileDetectRules.utils, this.ua), key);
        },

        /**
         * Do a quick test against navigator::userAgent.
         *
         * @param {String|RegExp} pattern the pattern, either as String or RegExp
         *                        (a string will be converted to a case-insensitive RegExp).
         * @returns {boolean} <tt>true</tt> when the pattern matches, otherwise <tt>false</tt>
         * @function MobileDetect#match
         */
        match: function (pattern) {
            if (!(pattern instanceof RegExp)) {
                pattern = new RegExp(pattern, 'i');
            }
            return pattern.test(this.ua);
        },

        /**
         * Checks whether the mobile device can be considered as phone regarding <code>screen.width</code>.
         * <br>
         * Obviously this method makes sense in browser environments only (not for Node.js)!
         * @param {number} [maxPhoneWidth] the maximum logical pixels (aka. CSS-pixels) to be considered as phone.<br>
         *        The argument is optional and if not present or falsy, the value of the constructor is taken.
         * @returns {boolean|undefined} <code>undefined</code> if screen size wasn't detectable, else <code>true</code>
         *          when screen.width is less or equal to maxPhoneWidth, otherwise <code>false</code>.<br>
         *          Will always return <code>undefined</code> server-side.
         */
        isPhoneSized: function (maxPhoneWidth) {
            return MobileDetect.isPhoneSized(maxPhoneWidth || this.maxPhoneWidth);
        },

        /**
         * Returns the mobile grade ('A', 'B', 'C').
         *
         * @returns {String} one of the mobile grades ('A', 'B', 'C').
         * @function MobileDetect#mobileGrade
         */
        mobileGrade: function () {
            if (this._cache.grade === undefined) {
                this._cache.grade = impl.mobileGrade(this);
            }
            return this._cache.grade;
        }
    };

    // environment-dependent
    if (typeof window !== 'undefined' && window.screen) {
        MobileDetect.isPhoneSized = function (maxPhoneWidth) {
            return maxPhoneWidth < 0 ? undefined : impl.getDeviceSmallerSide() <= maxPhoneWidth;
        };
    } else {
        MobileDetect.isPhoneSized = function () {};
    }

    // should not be replaced by a completely new object - just overwrite existing methods
    MobileDetect._impl = impl;
    
    MobileDetect.version = '1.4.4 2019-09-21';

    return MobileDetect;
}); // end of call of define()
})((function (undefined) {
    if (typeof module !== 'undefined' && module.exports) {
        return function (factory) { module.exports = factory(); };
    } else if (typeof define === 'function' && define.amd) {
        return define;
    } else if (typeof window !== 'undefined') {
        return function (factory) { window.MobileDetect = factory(); };
    } else {
        // please file a bug if you get this error!
        throw new Error('unknown environment');
    }
})());
},{}],195:[function(require,module,exports){
!function(root, factory) {
    "function" == typeof define && define.amd ? // AMD. Register as an anonymous module unless amdModuleId is set
    define([], function() {
        return root.svg4everybody = factory();
    }) : "object" == typeof module && module.exports ? // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory() : root.svg4everybody = factory();
}(this, function() {
    /*! svg4everybody v2.1.9 | github.com/jonathantneal/svg4everybody */
    function embed(parent, svg, target) {
        // if the target exists
        if (target) {
            // create a document fragment to hold the contents of the target
            var fragment = document.createDocumentFragment(), viewBox = !svg.hasAttribute("viewBox") && target.getAttribute("viewBox");
            // conditionally set the viewBox on the svg
            viewBox && svg.setAttribute("viewBox", viewBox);
            // copy the contents of the clone into the fragment
            for (// clone the target
            var clone = target.cloneNode(!0); clone.childNodes.length; ) {
                fragment.appendChild(clone.firstChild);
            }
            // append the fragment into the svg
            parent.appendChild(fragment);
        }
    }
    function loadreadystatechange(xhr) {
        // listen to changes in the request
        xhr.onreadystatechange = function() {
            // if the request is ready
            if (4 === xhr.readyState) {
                // get the cached html document
                var cachedDocument = xhr._cachedDocument;
                // ensure the cached html document based on the xhr response
                cachedDocument || (cachedDocument = xhr._cachedDocument = document.implementation.createHTMLDocument(""), 
                cachedDocument.body.innerHTML = xhr.responseText, xhr._cachedTarget = {}), // clear the xhr embeds list and embed each item
                xhr._embeds.splice(0).map(function(item) {
                    // get the cached target
                    var target = xhr._cachedTarget[item.id];
                    // ensure the cached target
                    target || (target = xhr._cachedTarget[item.id] = cachedDocument.getElementById(item.id)), 
                    // embed the target into the svg
                    embed(item.parent, item.svg, target);
                });
            }
        }, // test the ready state change immediately
        xhr.onreadystatechange();
    }
    function svg4everybody(rawopts) {
        function oninterval() {
            // while the index exists in the live <use> collection
            for (// get the cached <use> index
            var index = 0; index < uses.length; ) {
                // get the current <use>
                var use = uses[index], parent = use.parentNode, svg = getSVGAncestor(parent), src = use.getAttribute("xlink:href") || use.getAttribute("href");
                if (!src && opts.attributeName && (src = use.getAttribute(opts.attributeName)), 
                svg && src) {
                    if (polyfill) {
                        if (!opts.validate || opts.validate(src, svg, use)) {
                            // remove the <use> element
                            parent.removeChild(use);
                            // parse the src and get the url and id
                            var srcSplit = src.split("#"), url = srcSplit.shift(), id = srcSplit.join("#");
                            // if the link is external
                            if (url.length) {
                                // get the cached xhr request
                                var xhr = requests[url];
                                // ensure the xhr request exists
                                xhr || (xhr = requests[url] = new XMLHttpRequest(), xhr.open("GET", url), xhr.send(), 
                                xhr._embeds = []), // add the svg and id as an item to the xhr embeds list
                                xhr._embeds.push({
                                    parent: parent,
                                    svg: svg,
                                    id: id
                                }), // prepare the xhr ready state change event
                                loadreadystatechange(xhr);
                            } else {
                                // embed the local id into the svg
                                embed(parent, svg, document.getElementById(id));
                            }
                        } else {
                            // increase the index when the previous value was not "valid"
                            ++index, ++numberOfSvgUseElementsToBypass;
                        }
                    }
                } else {
                    // increase the index when the previous value was not "valid"
                    ++index;
                }
            }
            // continue the interval
            (!uses.length || uses.length - numberOfSvgUseElementsToBypass > 0) && requestAnimationFrame(oninterval, 67);
        }
        var polyfill, opts = Object(rawopts), newerIEUA = /\bTrident\/[567]\b|\bMSIE (?:9|10)\.0\b/, webkitUA = /\bAppleWebKit\/(\d+)\b/, olderEdgeUA = /\bEdge\/12\.(\d+)\b/, edgeUA = /\bEdge\/.(\d+)\b/, inIframe = window.top !== window.self;
        polyfill = "polyfill" in opts ? opts.polyfill : newerIEUA.test(navigator.userAgent) || (navigator.userAgent.match(olderEdgeUA) || [])[1] < 10547 || (navigator.userAgent.match(webkitUA) || [])[1] < 537 || edgeUA.test(navigator.userAgent) && inIframe;
        // create xhr requests object
        var requests = {}, requestAnimationFrame = window.requestAnimationFrame || setTimeout, uses = document.getElementsByTagName("use"), numberOfSvgUseElementsToBypass = 0;
        // conditionally start the interval if the polyfill is active
        polyfill && oninterval();
    }
    function getSVGAncestor(node) {
        for (var svg = node; "svg" !== svg.nodeName.toLowerCase() && (svg = svg.parentNode); ) {}
        return svg;
    }
    return svg4everybody;
});
},{}],196:[function(require,module,exports){
module.exports={
	"resourcePath": "./server/download.php",
	"avatarResourcePath": "/teamchatapi/files.avatar",
	"icewarpapiUrl": ""
}

},{}]},{},[43]);
