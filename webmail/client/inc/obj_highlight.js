function obj_highlight(){};

obj_highlight.__casing = {
	"xml": 'HTML / XML',
	"markdown": 'Markdown',
	"dart": 'Dart',
	"cs": 'C#',
	"json": 'JSON',
	"swift": 'Swift',
	"php": 'PHP',
	"bash": 'Bash',
	"dockerfile": 'Dockerfile',
	"css": 'CSS',
	"python": 'Python',
	"objectivec": 'Objective-C',
	"sql": 'SQL',
	"typescript": 'TypeScript',
	"javascript": 'JavaScript',
	"java": 'Java',
	"cpp": 'C++',
	"powershell": 'PowerShell',
	"diff": 'Diff',
	"go": 'Go',
	"delphi": 'Delphi'
};

obj_highlight._highlight = function(sBody) {
	return sBody.replace(/(?:\`\`\`)(?: ?([\w]+)\n)?([\s\S]*?)(?:\`\`\`)|(?:\`)(.+?)(?:\`)/g, function(match, language, code_block, code_inline) {
		var highlight,
			prefix = '',
			postfix = '',
			code = (code_block || code_inline || '').trim();

		if(!window.hljs) {
			storage.library('highlight.pack', 'highlight');
		}

		if(language) {
			try {
				highlight = hljs.highlight(language, code);
			} catch(e) {
				highlight = hljs.highlightAuto(code);
			}
		} else {
			highlight = hljs.highlightAuto(code);
		}

		if(!code_inline) {
			prefix = '<pre>';
			postfix = (highlight.language ? '<div class="legend">' + (obj_highlight.__casing[highlight.language] || highlight.language) + '</div>' : '') + '</pre>';
		}

		return prefix + '<code class="hljs ' + (highlight.language || '') + (!code_inline ? '' : ' inline') + '">' + highlight.value + '</code>' + postfix;
	});
};
