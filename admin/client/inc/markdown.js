/** Micromarkdown and toMarkdown */

/*
 * µmarkdown.js
 * markdown in under 5kb
 *
 * Copyright 2015, Simon Waldherr - http://simon.waldherr.eu/
 * Released under the MIT Licence
 * http://simon.waldherr.eu/license/mit/
 *
 * Github:  https://github.com/simonwaldherr/micromarkdown.js/
 * Version: 0.3.4
 */

/*jslint browser: true, node: true, plusplus: true, indent: 2, regexp: true, ass: true */
/*global ActiveXObject, define */

var micromarkdown = {
  useajax: false,
  regexobject: {
    headline: /^(\#{1,6})([^\#\n]+)$/m,
    code: /\s\`\`\`\n?([^`]+)\`\`\`/g,
    hr: /^(?:([\*\-_] ?)+)\1\1$/gm,
    lists: /^((\s*((\*|\-)|\d(\.|\))) [^\n]+)\n)+/gm,
    bolditalic: /(?:([\*_~]{1,3}))([^\*_~\n]+[^\*_~\s])\1/g,
    links: /!?\[([^\]<>]+)\]\(([^ \)<>]+)( "[^\(\)\"]+")?\)/g,
    reflinks: /\[([^\]]+)\]\[([^\]]+)\]/g,
    smlinks: /\@([a-z0-9]{3,})\@(t|gh|fb|gp|adn)/gi,
    mail: /<(([a-z0-9_\-\.])+\@([a-z0-9_\-\.])+\.([a-z]{2,7}))>/gmi,
    tables: /\n(([^|\n]+ *\| *)+([^|\n]+\n))((:?\-+:?\|)+(:?\-+:?)*\n)((([^|\n]+ *\| *)+([^|\n]+)\n)+)/g,
    include: /[\[<]include (\S+) from (https?:\/\/[a-z0-9\.\-]+\.[a-z]{2,9}[a-z0-9\.\-\?\&\/]+)[\]>]/gi,
    url: /<([a-zA-Z0-9@:%_\+.~#?&\/=]{2,256}\.[a-z]{2,4}\b(\/[\-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?)>/g,
    url2: /[ \t\n]([a-zA-Z]{2,16}:\/\/[a-zA-Z0-9@:%_\+.~#?&=]{2,256}.[a-z]{2,4}\b(\/[\-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?)[ \t\n]/g
  },
  codeblocks: {},
  parse: function (str, strict) {
    'use strict';
    var line, nstatus = 0,
      status, cel, calign, indent, helper, helper1, helper2, count, repstr, stra, trashgc = [],
      casca = 0,
      i = 0,
      j = 0,
      crc32str = '';
    str = '\n' + str + '\n';

    if (strict !== true) {
      micromarkdown.regexobject.lists = /^((\s*(\*|\d\.) [^\n]+)\n)+/gm;
    }

    str = str.replace('$&', '&#x0024&amp;');

    /* code */
    str=micromarkdown.trim(str);
    while ((stra = micromarkdown.regexobject.code.exec(str)) !== null) {
      crc32str = micromarkdown.crc32(stra[0]);
      micromarkdown.codeblocks[crc32str] = '<code>\n' + micromarkdown.htmlEncode(stra[1]).replace(/\n/gm, '<br/>').replace(/\ /gm, '&nbsp;') + '</code>\n';
      str = str.replace(stra[0], ' §§§' + crc32str + '§§§ '); 
    }
    str="\n"+str+"\n";

    /* headlines */
    while ((stra = micromarkdown.regexobject.headline.exec(str)) !== null) {
      count = stra[1].length;
      str = str.replace(stra[0], '<h' + count + '>' + stra[2] + '</h' + count + '>' + '\n');
    }

    /* lists */
    while ((stra = micromarkdown.regexobject.lists.exec(str)) !== null) {
      casca = 0;
      if ((stra[0].trim().substr(0, 1) === '*') || (stra[0].trim().substr(0, 1) === '-')) {
        repstr = '<ul>';
      } else {
        repstr = '<ol>';
      }
      helper = stra[0].split('\n');
      helper1 = [];
      status = 0;
      indent = false;
      for (i = 0; i < helper.length; i++) {
        if ((line = /^((\s*)((\*|\-)|\d(\.|\))) ([^\n]+))/.exec(helper[i])) !== null) {
          if ((line[2] === undefined) || (line[2].length === 0)) {
            nstatus = 0;
          } else {
            if (indent === false) {
              indent = line[2].replace(/\t/, '    ').length;
            }
            nstatus = Math.round(line[2].replace(/\t/, '    ').length / indent);
          }
          while (status > nstatus) {
            repstr += helper1.pop();
            status--;
            casca--;
          }
          while (status < nstatus) {
            if ((line[0].trim().substr(0, 1) === '*') || (line[0].trim().substr(0, 1) === '-')) {
              repstr += '<ul>';
              helper1.push('</ul>');
            } else {
              repstr += '<ol>';
              helper1.push('</ol>');
            }
            status++;
            casca++;
          }
          repstr += '<li>' + line[6] + '</li>' + '\n';
        }
      }
      while (casca > 0) {
        repstr += '</ul>';
        casca--;
      }
      if ((stra[0].trim().substr(0, 1) === '*') || (stra[0].trim().substr(0, 1) === '-')) {
        repstr += '</ul>';
      } else {
        repstr += '</ol>';
      }
      str = str.replace(stra[0], repstr + '\n');
    }

    /* tables */
    while ((stra = micromarkdown.regexobject.tables.exec(str)) !== null) {
      repstr = '<table><tr>';
      helper = stra[1].split('|');
      calign = stra[4].split('|');
      for (i = 0; i < helper.length; i++) {
        if (calign.length <= i) {
          calign.push(0);
        } else if ((calign[i].trimRight().slice(-1) === ':') && (strict !== true)) {
          if (calign[i][0] === ':') {
            calign[i] = 3;
          } else {
            calign[i] = 2;
          }
        } else if (strict !== true) {
          if (calign[i][0] === ':') {
            calign[i] = 1;
          } else {
            calign[i] = 0;
          }
        } else {
          calign[i] = 0;
        }
      }
      cel = ['<th>', '<th align="left">', '<th align="right">', '<th align="center">'];
      for (i = 0; i < helper.length; i++) {
        repstr += cel[calign[i]] + helper[i].trim() + '</th>';
      }
      repstr += '</tr>';
      cel = ['<td>', '<td align="left">', '<td align="right">', '<td align="center">'];
      helper1 = stra[7].split('\n');
      for (i = 0; i < helper1.length; i++) {
        helper2 = helper1[i].split('|');
        if (helper2[0].length !== 0) {
          while (calign.length < helper2.length) {
            calign.push(0);
          }
          repstr += '<tr>';
          for (j = 0; j < helper2.length; j++) {
            repstr += cel[calign[j]] + helper2[j].trim() + '</td>';
          }
          repstr += '</tr>' + '\n';
        }
      }
      repstr += '</table>';
      str = str.replace(stra[0], repstr);
    }

    /* bold and italic */
    for (i = 0; i < 3; i++) {
      while ((stra = micromarkdown.regexobject.bolditalic.exec(str)) !== null) {
        repstr = [];
        if (stra[1] === '~~') {
          str = str.replace(stra[0], '<del>' + stra[2] + '</del>');
        } else {
          switch (stra[1].length) {
          case 1:
            repstr = ['<i>', '</i>'];
            break;
          case 2:
            repstr = ['<b>', '</b>'];
            break;
          case 3:
            repstr = ['<i><b>', '</b></i>'];
            break;
          }
          str = str.replace(stra[0], repstr[0] + stra[2] + repstr[1]);
        }
      }
    }

    /* links */
    while ((stra = micromarkdown.regexobject.links.exec(str)) !== null) {
      if (stra[0].substr(0, 1) === '!') {
        str = str.replace(stra[0], '<img src="' + stra[2] + '" alt="' + stra[1] + '" title="' + stra[1] + '" />\n');
      } else {
        str = str.replace(stra[0], '<a ' + micromarkdown.mmdCSSclass(stra[2], strict) + 'href="' + stra[2] + '">' + stra[1] + '</a>\n');
      }
    }
    while ((stra = micromarkdown.regexobject.mail.exec(str)) !== null) {
      str = str.replace(stra[0], '<a href="mailto:' + stra[1] + '">' + stra[1] + '</a>');
    }
    while ((stra = micromarkdown.regexobject.url.exec(str)) !== null) {
      repstr = stra[1];
      if (repstr.indexOf('://') === -1) {
        repstr = 'http://' + repstr;
      }
      str = str.replace(stra[0], '<a ' + micromarkdown.mmdCSSclass(repstr, strict) + 'href="' + repstr + '">' + repstr.replace(/(https:\/\/|http:\/\/|mailto:|ftp:\/\/)/gmi, '') + '</a>');
    }
    while ((stra = micromarkdown.regexobject.reflinks.exec(str)) !== null) {
      helper1 = new RegExp('\\[' + stra[2] + '\\]: ?([^ \n]+)', "gi");
      if ((helper = helper1.exec(str)) !== null) {
        str = str.replace(stra[0], '<a ' + micromarkdown.mmdCSSclass(helper[1], strict) + 'href="' + helper[1] + '">' + stra[1] + '</a>');
        trashgc.push(helper[0]);
      }
    }
    for (i = 0; i < trashgc.length; i++) {
      str = str.replace(trashgc[i], '');
    }
    while ((stra = micromarkdown.regexobject.smlinks.exec(str)) !== null) {
      switch (stra[2]) {
      case 't':
        repstr = 'https://twitter.com/' + stra[1];
        break;
      case 'gh':
        repstr = 'https://github.com/' + stra[1];
        break;
      case 'fb':
        repstr = 'https://www.facebook.com/' + stra[1];
        break;
      case 'gp':
        repstr = 'https://plus.google.com/+' + stra[1];
        break;
      case 'adn':
        repstr = 'https://alpha.app.net/' + stra[1];
        break;
      }
      str = str.replace(stra[0], '<a ' + micromarkdown.mmdCSSclass(repstr, strict) + 'href="' + repstr + '">' + stra[1] + '</a>');
    }
    while ((stra = micromarkdown.regexobject.url2.exec(str)) !== null) {
      repstr = stra[1];
      str = str.replace(stra[0], '<a ' + micromarkdown.mmdCSSclass(repstr, strict) + 'href="' + repstr + '">' + repstr + '</a>');
    }

    /* horizontal line */
    while ((stra = micromarkdown.regexobject.hr.exec(str)) !== null) {
      str = str.replace(stra[0], '\n<hr/>\n');
    }

    /* include */
    if ((micromarkdown.useajax !== false) && (strict !== true)) {
      while ((stra = micromarkdown.regexobject.include.exec(str)) !== null) {
        helper = stra[2].replace(/[\.\:\/]+/gm, '');
        helper1 = '';
        if (document.getElementById(helper)) {
          helper1 = document.getElementById(helper).innerHTML.trim();
        } else {
          micromarkdown.ajax(stra[2]);
        }
        if ((stra[1] === 'csv') && (helper1 !== '')) {
          helper2 = {
            ';': [],
            '\t': [],
            ',': [],
            '|': []
          };
          helper2[0] = [';', '\t', ',', '|'];
          helper1 = helper1.split('\n');
          for (j = 0; j < helper2[0].length; j++) {
            for (i = 0; i < helper1.length; i++) {
              if (i > 0) {
                if (helper2[helper2[0][j]] !== false) {
                  if ((helper2[helper2[0][j]][i] !== helper2[helper2[0][j]][i - 1]) || (helper2[helper2[0][j]][i] === 1)) {
                    helper2[helper2[0][j]] = false;
                  }
                }
              }
            }
          }
          if ((helper2[';'] !== false) || (helper2['\t'] !== false) || (helper2[','] !== false) || (helper2['|'] !== false)) {
            if (helper2[';'] !== false) {
              helper2 = ';';
            } else if (helper2['\t']) {
              helper2 = '\t';
            } else if (helper2[',']) {
              helper2 = ',';
            } else if (helper2['|']) {
              helper2 = '|';
            }
            repstr = '<table>';
            for (i = 0; i < helper1.length; i++) {
              helper = helper1[i].split(helper2);
              repstr += '<tr>';
              for (j = 0; j < helper.length; j++) {
                repstr += '<td>' + micromarkdown.htmlEncode(helper[j]) + '</td>';
              }
              repstr += '</tr>';
            }
            repstr += '</table>';
            str = str.replace(stra[0], repstr);
          } else {
            str = str.replace(stra[0], '<code>' + helper1.join('\n') + '</code>');
          }
        } else {
          str = str.replace(stra[0], '');
        }
      }
    }

	str=micromarkdown.trim(str);
    str = str.replace(/ {2,}[\n]+/gmi, '<br/>');
    str = str.replace(/[\n]{2,}/gmi, '<br/><br/>');
    str="\n"+str+"\n";

    for(var index in micromarkdown.codeblocks) { 
      if(micromarkdown.codeblocks.hasOwnProperty(index)) {
        str = str.replace('§§§' + index + '§§§', micromarkdown.codeblocks[index]); 
      }
    }
    str = str.replace('&#x0024&amp;', '$&');

    return micromarkdown.trim(str);
  },
  ajax: function (str) {
    'use strict';
    var xhr;
    if (document.getElementById(str.replace(/[\.\:\/]+/gm, ''))) {
      return false;
    }
    if (window.ActiveXObject) {
      try {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {
        xhr = null;
        return e;
      }
    } else {
      xhr = new XMLHttpRequest();
    }
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        var ele = document.createElement('code');
        ele.innerHTML = xhr.responseText;
        ele.id = str.replace(/[\.\:\/]+/gm, '');
        ele.style.display = 'none';
        document.getElementsByTagName('body')[0].appendChild(ele);
        micromarkdown.useajax();
      }
    };
    xhr.open('GET', str, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send();
  },
  crc32: function (string) {
    "use strict";
    var crc = 0,
      n, x, i, len, table = ["00000000", "77073096", "EE0E612C", "990951BA", "076DC419", "706AF48F", "E963A535", "9E6495A3", "0EDB8832", "79DCB8A4", "E0D5E91E", "97D2D988", "09B64C2B", "7EB17CBD", "E7B82D07", "90BF1D91", "1DB71064", "6AB020F2", "F3B97148", "84BE41DE", "1ADAD47D", "6DDDE4EB", "F4D4B551", "83D385C7", "136C9856", "646BA8C0", "FD62F97A", "8A65C9EC", "14015C4F", "63066CD9", "FA0F3D63", "8D080DF5", "3B6E20C8", "4C69105E", "D56041E4", "A2677172", "3C03E4D1", "4B04D447", "D20D85FD", "A50AB56B", "35B5A8FA", "42B2986C", "DBBBC9D6", "ACBCF940", "32D86CE3", "45DF5C75", "DCD60DCF", "ABD13D59", "26D930AC", "51DE003A", "C8D75180", "BFD06116", "21B4F4B5", "56B3C423", "CFBA9599", "B8BDA50F", "2802B89E", "5F058808", "C60CD9B2", "B10BE924", "2F6F7C87", "58684C11", "C1611DAB", "B6662D3D", "76DC4190", "01DB7106", "98D220BC", "EFD5102A", "71B18589", "06B6B51F", "9FBFE4A5", "E8B8D433", "7807C9A2", "0F00F934", "9609A88E", "E10E9818", "7F6A0DBB", "086D3D2D", "91646C97", "E6635C01", "6B6B51F4", "1C6C6162", "856530D8", "F262004E", "6C0695ED", "1B01A57B", "8208F4C1", "F50FC457", "65B0D9C6", "12B7E950", "8BBEB8EA", "FCB9887C", "62DD1DDF", "15DA2D49", "8CD37CF3", "FBD44C65", "4DB26158", "3AB551CE", "A3BC0074", "D4BB30E2", "4ADFA541", "3DD895D7", "A4D1C46D", "D3D6F4FB", "4369E96A", "346ED9FC", "AD678846", "DA60B8D0", "44042D73", "33031DE5", "AA0A4C5F", "DD0D7CC9", "5005713C", "270241AA", "BE0B1010", "C90C2086", "5768B525", "206F85B3", "B966D409", "CE61E49F", "5EDEF90E", "29D9C998", "B0D09822", "C7D7A8B4", "59B33D17", "2EB40D81", "B7BD5C3B", "C0BA6CAD", "EDB88320", "9ABFB3B6", "03B6E20C", "74B1D29A", "EAD54739", "9DD277AF", "04DB2615", "73DC1683", "E3630B12", "94643B84", "0D6D6A3E", "7A6A5AA8", "E40ECF0B", "9309FF9D", "0A00AE27", "7D079EB1", "F00F9344", "8708A3D2", "1E01F268", "6906C2FE", "F762575D", "806567CB", "196C3671", "6E6B06E7", "FED41B76", "89D32BE0", "10DA7A5A", "67DD4ACC", "F9B9DF6F", "8EBEEFF9", "17B7BE43", "60B08ED5", "D6D6A3E8", "A1D1937E", "38D8C2C4", "4FDFF252", "D1BB67F1", "A6BC5767", "3FB506DD", "48B2364B", "D80D2BDA", "AF0A1B4C", "36034AF6", "41047A60", "DF60EFC3", "A867DF55", "316E8EEF", "4669BE79", "CB61B38C", "BC66831A", "256FD2A0", "5268E236", "CC0C7795", "BB0B4703", "220216B9", "5505262F", "C5BA3BBE", "B2BD0B28", "2BB45A92", "5CB36A04", "C2D7FFA7", "B5D0CF31", "2CD99E8B", "5BDEAE1D", "9B64C2B0", "EC63F226", "756AA39C", "026D930A", "9C0906A9", "EB0E363F", "72076785", "05005713", "95BF4A82", "E2B87A14", "7BB12BAE", "0CB61B38", "92D28E9B", "E5D5BE0D", "7CDCEFB7", "0BDBDF21", "86D3D2D4", "F1D4E242", "68DDB3F8", "1FDA836E", "81BE16CD", "F6B9265B", "6FB077E1", "18B74777", "88085AE6", "FF0F6A70", "66063BCA", "11010B5C", "8F659EFF", "F862AE69", "616BFFD3", "166CCF45", "A00AE278", "D70DD2EE", "4E048354", "3903B3C2", "A7672661", "D06016F7", "4969474D", "3E6E77DB", "AED16A4A", "D9D65ADC", "40DF0B66", "37D83BF0", "A9BCAE53", "DEBB9EC5", "47B2CF7F", "30B5FFE9", "BDBDF21C", "CABAC28A", "53B39330", "24B4A3A6", "BAD03605", "CDD70693", "54DE5729", "23D967BF", "B3667A2E", "C4614AB8", "5D681B02", "2A6F2B94", "B40BBE37", "C30C8EA1", "5A05DF1B", "2D02EF8D"];
    n = 0;
    x = 0;
    len = string.length;
    crc = crc ^ (-1);
    for (i = 0; i < len; i++) {
      n = (crc ^ string.charCodeAt(i)) & 0xFF;
      x = "0x" + table[n];
      crc = (crc >>> 8) ^ x;
    }
    return crc ^ (-1);
  },
  countingChars: function (str, split) {
    'use strict';
    str = str.split(split);
    if (typeof str === 'object') {
      return str.length - 1;
    }
    return 0;
  },
  htmlEncode: function (str) {
    'use strict';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    str = div.innerHTML;
    div = undefined;
    return str;
  },
  htmlDecode: function(text) {
	  return text.replace(/&amp;/gi,'&').
	  		 replace(/&lt;/gi,'<').
  		 	 replace(/&gt;/gi,'>').
  		 	 replace(/&quot;/gi,'"').
  		 	 replace(/&#039;/gi,"'");
  },
  trim: function(str, charlist) {
	  var whitespace, l = 0,
	    i = 0;
	  str += '';
	
	  if (!charlist) {
	    // default list
	    whitespace =
	      ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
	  } else {
	    // preg_quote custom list
	    charlist += '';
	    whitespace = charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
	  }
	
	  l = str.length;
	  for (i = 0; i < l; i++) {
	    if (whitespace.indexOf(str.charAt(i)) === -1) {
	      str = str.substring(i);
	      break;
	    }
	  }
	
	  l = str.length;
	  for (i = l - 1; i >= 0; i--) {
	    if (whitespace.indexOf(str.charAt(i)) === -1) {
	      str = str.substring(0, i + 1);
	      break;
	    }
	  }
	
	  return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
  },
  mmdCSSclass: function (str, strict) {
    'use strict';
    var urlTemp;
    if ((str.indexOf('/') !== -1) && (strict !== true)) {
      urlTemp = str.split('/');
      if (urlTemp[1].length === 0) {
        urlTemp = urlTemp[2].split('.');
      } else {
        urlTemp = urlTemp[0].split('.');
      }
      return 'class="mmd_' + urlTemp[urlTemp.length - 2].replace(/[^\w\d]/g, '') + urlTemp[urlTemp.length - 1] + '" ';
    }
    return '';
  }
};

(function (root, factory) {
  "use strict";
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.returnExports = factory();
  }
}(this, function () {
  'use strict';
  return micromarkdown;
}));


/** *****************************************************************/
/** *****************************************************************/
/** *****************************************************************/
/** *****************************************************************/
/** *****************************************************************/
/** *****************************************************************/
/** *****************************************************************/
/** *****************************************************************/
/** *****************************************************************/
/** *****************************************************************/

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.toMarkdown = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * to-markdown - an HTML to Markdown converter
 *
 * Copyright 2011-15, Dom Christie
 * Licenced under the MIT licence
 *
 */

var toMarkdown;
var converters;
var mdConverters = require('./lib/md-converters');
var gfmConverters = require('./lib/gfm-converters');
var collapse = require('collapse-whitespace');

/*
 * Set up window and document for Node.js
 */

var _window = (typeof window !== 'undefined' ? window : this), _document;
if (typeof document === 'undefined') {
  _document = require('jsdom').jsdom();
}
else {
  _document = document;
}

/*
 * Utilities
 */

function trim(string) {
  return string.replace(/^[ \r\n\t]+|[ \r\n\t]+$/g, '');
}

var blocks = ['address', 'article', 'aside', 'audio', 'blockquote', 'body',
  'canvas', 'center', 'dd', 'dir', 'div', 'dl', 'dt', 'fieldset', 'figcaption',
  'figure', 'footer', 'form', 'frameset', 'h1', 'h2', 'h3', 'h4','h5', 'h6',
  'header', 'hgroup', 'hr', 'html', 'isindex', 'li', 'main', 'menu', 'nav',
  'noframes', 'noscript', 'ol', 'output', 'p', 'pre', 'section', 'table',
  'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'ul'
];

function isBlock(node) {
  return blocks.indexOf(node.nodeName.toLowerCase()) !== -1;
}

var voids = [
  'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input',
  'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'
];

function isVoid(node) {
  return voids.indexOf(node.nodeName.toLowerCase()) !== -1;
}

/*
 * Parsing HTML strings
 */

function canParseHtml() {
  var Parser = _window.DOMParser, canParse = false;

  // Adapted from https://gist.github.com/1129031
  // Firefox/Opera/IE throw errors on unsupported types
  try {
    // WebKit returns null on unsupported types
    if (new Parser().parseFromString('', 'text/html')) {
      canParse = true;
    }
  } catch (e) {}
  return canParse;
}

function createHtmlParser() {
  var Parser = function () {};

  Parser.prototype.parseFromString = function (string) {
    var newDoc = _document.implementation.createHTMLDocument('');

    if (string.toLowerCase().indexOf('<!doctype') > -1) {
      newDoc.documentElement.innerHTML = string;
    }
    else {
      newDoc.body.innerHTML = string;
    }
    return newDoc;
  };
  return Parser;
}

var HtmlParser = canParseHtml() ? _window.DOMParser : createHtmlParser();

function htmlToDom(string) {
  var tree = new HtmlParser().parseFromString(string, 'text/html');
  collapse(tree, isBlock);
  return tree;
}

/*
 * Flattens DOM tree into single array
 */

function bfsOrder(node) {
  var inqueue = [node],
      outqueue = [],
      elem, children, i;

  while (inqueue.length > 0) {
    elem = inqueue.shift();
    outqueue.push(elem);
    children = elem.childNodes;
    for (i = 0 ; i < children.length; i++) {
      if (children[i].nodeType === 1) { inqueue.push(children[i]); }
    }
  }
  outqueue.shift();
  return outqueue;
}

/*
 * Contructs a Markdown string of replacement text for a given node
 */

function getContent(node) {
  var text = '';
  for (var i = 0; i < node.childNodes.length; i++) {
    if (node.childNodes[i].nodeType === 1) {
      text += node.childNodes[i]._replacement;
    }
    else if (node.childNodes[i].nodeType === 3) {
      text += node.childNodes[i].data;
    }
    else { continue; }
  }
  return text;
}

/*
 * Returns the HTML string of an element with its contents converted
 */

function outer(node, content) {
  return node.cloneNode(false).outerHTML.replace('><', '>'+ content +'<');
}

function canConvert(node, filter) {
  if (typeof filter === 'string') {
    return filter === node.nodeName.toLowerCase();
  }
  if (Array.isArray(filter)) {
    return filter.indexOf(node.nodeName.toLowerCase()) !== -1;
  }
  else if (typeof filter === 'function') {
    return filter.call(toMarkdown, node);
  }
  else {
    throw new TypeError('`filter` needs to be a string, array, or function');
  }
}

function isFlankedByWhitespace(side, node) {
  var sibling, regExp, isFlanked;

  if (side === 'left') {
    sibling = node.previousSibling;
    regExp = / $/;
  }
  else {
    sibling = node.nextSibling;
    regExp = /^ /;
  }

  if (sibling) {
    if (sibling.nodeType === 3) {
      isFlanked = regExp.test(sibling.nodeValue);
    }
    else if(sibling.nodeType === 1 && !isBlock(sibling)) {
      isFlanked = regExp.test(sibling.textContent);
    }
  }
  return isFlanked;
}

function flankingWhitespace(node) {
  var leading = '', trailing = '';

  if (!isBlock(node)) {
    var hasLeading = /^[ \r\n\t]/.test(node.innerHTML),
        hasTrailing = /[ \r\n\t]$/.test(node.innerHTML);

    if (hasLeading && !isFlankedByWhitespace('left', node)) {
      leading = ' ';
    }
    if (hasTrailing && !isFlankedByWhitespace('right', node)) {
      trailing = ' ';
    }
  }

  return { leading: leading, trailing: trailing };
}

/*
 * Finds a Markdown converter, gets the replacement, and sets it on
 * `_replacement`
 */

function process(node) {
  var replacement, content = getContent(node);

  // Remove blank nodes
  if (!isVoid(node) && !/A/.test(node.nodeName) && /^\s*$/i.test(content)) {
    node._replacement = '';
    return;
  }

  for (var i = 0; i < converters.length; i++) {
    var converter = converters[i];

    if (canConvert(node, converter.filter)) {
      if (typeof converter.replacement !== 'function') {
        throw new TypeError(
          '`replacement` needs to be a function that returns a string'
        );
      }

      var whitespace = flankingWhitespace(node);

      if (whitespace.leading || whitespace.trailing) {
        content = trim(content);
      }
      replacement = whitespace.leading +
                    converter.replacement.call(toMarkdown, content, node) +
                    whitespace.trailing;
      break;
    }
  }

  node._replacement = replacement;
}

toMarkdown = function (input, options) {
  options = options || {};

  if (typeof input !== 'string') {
    throw new TypeError(input + ' is not a string');
  }

  // Escape potential ol triggers
  input = input.replace(/(\d+)\. /g, '$1\\. ');

  var clone = htmlToDom(input).body,
      nodes = bfsOrder(clone),
      output;

  converters = mdConverters.slice(0);
  if (options.gfm) {
    converters = gfmConverters.concat(converters);
  }

  if (options.converters) {
    converters = options.converters.concat(converters);
  }

  // Process through nodes in reverse (so deepest child elements are first).
  for (var i = nodes.length - 1; i >= 0; i--) {
    process(nodes[i]);
  }
  output = getContent(clone);

  return output.replace(/^[\t\r\n]+|[\t\r\n\s]+$/g, '')
               .replace(/\n\s+\n/g, '\n\n')
               .replace(/\n{3,}/g, '\n\n');
};

toMarkdown.isBlock = isBlock;
toMarkdown.isVoid = isVoid;
toMarkdown.trim = trim;
toMarkdown.outer = outer;

module.exports = toMarkdown;

},{"./lib/gfm-converters":2,"./lib/md-converters":3,"collapse-whitespace":4,"jsdom":7}],2:[function(require,module,exports){
'use strict';

function cell(content, node) {
  var index = Array.prototype.indexOf.call(node.parentNode.childNodes, node);
  var prefix = ' ';
  if (index === 0) { prefix = '| '; }
  return prefix + content + ' |';
}

var highlightRegEx = /highlight highlight-(\S+)/;

module.exports = [
  {
    filter: 'br',
    replacement: function () {
      return '\n';
    }
  },
  {
    filter: ['del', 's', 'strike'],
    replacement: function (content) {
      return '~~' + content + '~~';
    }
  },

  {
    filter: function (node) {
      return node.type === 'checkbox' && node.parentNode.nodeName === 'LI';
    },
    replacement: function (content, node) {
      return (node.checked ? '[x]' : '[ ]') + ' ';
    }
  },

  {
    filter: ['th', 'td'],
    replacement: function (content, node) {
      return cell(content, node);
    }
  },

  {
    filter: 'tr',
    replacement: function (content, node) {
      var borderCells = '';
      var alignMap = { left: ':--', right: '--:', center: ':-:' };

      if (node.parentNode.nodeName === 'THEAD') {
        for (var i = 0; i < node.childNodes.length; i++) {
          var align = node.childNodes[i].attributes.align;
          var border = '---';

          if (align) { border = alignMap[align.value] || border; }

          borderCells += cell(border, node.childNodes[i]);
        }
      }
      return '\n' + content + (borderCells ? '\n' + borderCells : '');
    }
  },

  {
    filter: 'table',
    replacement: function (content) {
      return '\n\n' + content + '\n\n';
    }
  },

  {
    filter: ['thead', 'tbody', 'tfoot'],
    replacement: function (content) {
      return content;
    }
  },

  // Fenced code blocks
  {
    filter: function (node) {
      return node.nodeName === 'PRE' &&
             node.firstChild &&
             node.firstChild.nodeName === 'CODE';
    },
    replacement: function(content, node) {
      return '\n\n```\n' + node.firstChild.textContent + '\n```\n\n';
    }
  },

  // Syntax-highlighted code blocks
  {
    filter: function (node) {
      return node.nodeName === 'PRE' &&
             node.parentNode.nodeName === 'DIV' &&
             highlightRegEx.test(node.parentNode.className);
    },
    replacement: function (content, node) {
      var language = node.parentNode.className.match(highlightRegEx)[1];
      return '\n\n```' + language + '\n' + node.textContent + '\n```\n\n';
    }
  },

  {
    filter: function (node) {
      return node.nodeName === 'DIV' &&
             highlightRegEx.test(node.className);
    },
    replacement: function (content) {
      return '\n\n' + content + '\n\n';
    }
  }
];

},{}],3:[function(require,module,exports){
'use strict';

module.exports = [
  {
    filter: 'p',
    replacement: function (content) {
      return '\n\n' + content + '\n\n';
    }
  },

  {
    filter: 'br',
    replacement: function () {
      return '  \n';
    }
  },

  {
    filter: ['h1', 'h2', 'h3', 'h4','h5', 'h6'],
    replacement: function(content, node) {
      var hLevel = node.nodeName.charAt(1);
      var hPrefix = '';
      for(var i = 0; i < hLevel; i++) {
        hPrefix += '#';
      }
      return '\n\n' + hPrefix + ' ' + content + '\n\n';
    }
  },

  {
    filter: 'hr',
    replacement: function () {
      return '\n\n* * *\n\n';
    }
  },

  {
    filter: ['em', 'i'],
    replacement: function (content) {
      return '_' + content + '_';
    }
  },

  {
    filter: ['strong', 'b'],
    replacement: function (content) {
      return '**' + content + '**';
    }
  },

  // Inline code
  {
    filter: function (node) {
      var hasSiblings = node.previousSibling || node.nextSibling;
      var isCodeBlock = node.parentNode.nodeName === 'PRE' && !hasSiblings;

      return node.nodeName === 'CODE' && !isCodeBlock;
    },
    replacement: function(content) {
      return '`' + content + '`';
    }
  },

  {
    filter: function (node) {
      return node.nodeName === 'A' && node.getAttribute('href');
    },
    replacement: function(content, node) {
      var titlePart = node.title ? ' "'+ node.title +'"' : '';
      return '[' + content + '](' + node.getAttribute('href') + titlePart + ')';
    }
  },

  {
    filter: 'img',
    replacement: function(content, node) {
      var alt = node.alt || '';
      var src = node.getAttribute('src') || '';
      var title = node.title || '';
      var titlePart = title ? ' "'+ title +'"' : '';
      return src ? '![' + alt + ']' + '(' + src + titlePart + ')' : '';
    }
  },

  // Code blocks
  {
    filter: function (node) {
      return node.nodeName === 'PRE' && node.firstChild.nodeName === 'CODE';
    },
    replacement: function(content, node) {
      return '\n\n    ' + node.firstChild.textContent.replace(/\n/g, '\n    ') + '\n\n';
    }
  },

  {
    filter: 'blockquote',
    replacement: function (content) {
      content = this.trim(content);
      content = content.replace(/\n{3,}/g, '\n\n');
      content = content.replace(/^/gm, '> ');
      return '\n\n' + content + '\n\n';
    }
  },

  {
    filter: 'li',
    replacement: function (content, node) {
      content = content.replace(/^\s+/, '').replace(/\n/gm, '\n    ');
      var prefix = '*   ';
      var parent = node.parentNode;
      var index = Array.prototype.indexOf.call(parent.children, node) + 1;

      prefix = /ol/i.test(parent.nodeName) ? index + '.  ' : '*   ';
      return prefix + content;
    }
  },

  {
    filter: ['ul', 'ol'],
    replacement: function (content, node) {
      var strings = [];
      for (var i = 0; i < node.childNodes.length; i++) {
        strings.push(node.childNodes[i]._replacement);
      }

      if (/li/i.test(node.parentNode.nodeName)) {
        return '\n' + strings.join('\n');
      }
      return '\n\n' + strings.join('\n') + '\n\n';
    }
  },

  {
    filter: function (node) {
      return this.isBlock(node);
    },
    replacement: function (content, node) {
      return '\n\n' + this.outer(node, content) + '\n\n';
    }
  },

  // Anything else!
  {
    filter: function () {
      return true;
    },
    replacement: function (content, node) {
      return this.outer(node, content);
    }
  }
];
},{}],4:[function(require,module,exports){
'use strict';

var voidElements = require('void-elements');
Object.keys(voidElements).forEach(function (name) {
  voidElements[name.toUpperCase()] = 1;
});

var blockElements = {};
require('block-elements').forEach(function (name) {
  blockElements[name.toUpperCase()] = 1;
});

/**
 * isBlockElem(node) determines if the given node is a block element.
 *
 * @param {Node} node
 * @return {Boolean}
 */
function isBlockElem(node) {
  return !!(node && blockElements[node.nodeName]);
}

/**
 * isVoid(node) determines if the given node is a void element.
 *
 * @param {Node} node
 * @return {Boolean}
 */
function isVoid(node) {
  return !!(node && voidElements[node.nodeName]);
}

/**
 * whitespace(elem [, isBlock]) removes extraneous whitespace from an
 * the given element. The function isBlock may optionally be passed in
 * to determine whether or not an element is a block element; if none
 * is provided, defaults to using the list of block elements provided
 * by the `block-elements` module.
 *
 * @param {Node} elem
 * @param {Function} blockTest
 */
function collapseWhitespace(elem, isBlock) {
  if (!elem.firstChild || elem.nodeName === 'PRE') return;

  if (typeof isBlock !== 'function') {
    isBlock = isBlockElem;
  }

  var prevText = null;
  var prevVoid = false;

  var prev = null;
  var node = next(prev, elem);

  while (node !== elem) {
    if (node.nodeType === 3) {
      // Node.TEXT_NODE
      var text = node.data.replace(/[ \r\n\t]+/g, ' ');

      if ((!prevText || / $/.test(prevText.data)) && !prevVoid && text[0] === ' ') {
        text = text.substr(1);
      }

      // `text` might be empty at this point.
      if (!text) {
        node = remove(node);
        continue;
      }

      node.data = text;
      prevText = node;
    } else if (node.nodeType === 1) {
      // Node.ELEMENT_NODE
      if (isBlock(node) || node.nodeName === 'BR') {
        if (prevText) {
          prevText.data = prevText.data.replace(/ $/, '');
        }

        prevText = null;
        prevVoid = false;
      } else if (isVoid(node)) {
        // Avoid trimming space around non-block, non-BR void elements.
        prevText = null;
        prevVoid = true;
      }
    } else {
      node = remove(node);
      continue;
    }

    var nextNode = next(prev, node);
    prev = node;
    node = nextNode;
  }

  if (prevText) {
    prevText.data = prevText.data.replace(/ $/, '');
    if (!prevText.data) {
      remove(prevText);
    }
  }
}

/**
 * remove(node) removes the given node from the DOM and returns the
 * next node in the sequence.
 *
 * @param {Node} node
 * @return {Node} node
 */
function remove(node) {
  var next = node.nextSibling || node.parentNode;

  node.parentNode.removeChild(node);

  return next;
}

/**
 * next(prev, current) returns the next node in the sequence, given the
 * current and previous nodes.
 *
 * @param {Node} prev
 * @param {Node} current
 * @return {Node}
 */
function next(prev, current) {
  if (prev && prev.parentNode === current || current.nodeName === 'PRE') {
    return current.nextSibling || current.parentNode;
  }

  return current.firstChild || current.nextSibling || current.parentNode;
}

module.exports = collapseWhitespace;

},{"block-elements":5,"void-elements":6}],5:[function(require,module,exports){
/**
 * This file automatically generated from `build.js`.
 * Do not manually edit.
 */

module.exports = [
  "address",
  "article",
  "aside",
  "audio",
  "blockquote",
  "canvas",
  "dd",
  "div",
  "dl",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "hgroup",
  "hr",
  "main",
  "nav",
  "noscript",
  "ol",
  "output",
  "p",
  "pre",
  "section",
  "table",
  "tfoot",
  "ul",
  "video"
];

},{}],6:[function(require,module,exports){
/**
 * This file automatically generated from `pre-publish.js`.
 * Do not manually edit.
 */

module.exports = {
  "area": true,
  "base": true,
  "br": true,
  "col": true,
  "embed": true,
  "hr": true,
  "img": true,
  "input": true,
  "keygen": true,
  "link": true,
  "menuitem": true,
  "meta": true,
  "param": true,
  "source": true,
  "track": true,
  "wbr": true
};

},{}],7:[function(require,module,exports){

},{}]},{},[1])(1)
});



/** Wrapper */

markdown = {};
markdown.encode = function(text){
	return micromarkdown.parse(micromarkdown.htmlEncode(text));
}
markdown.decode = function(html){
	return micromarkdown.htmlDecode(toMarkdown(html));
}