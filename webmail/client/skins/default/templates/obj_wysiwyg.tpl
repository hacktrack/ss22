<table>
	<tr>
		<td id="{anchor header}">
			<div class="obj_richheader clearfix">
				<span>
					<a id="{_ins}/undo" class="ico icoundo" title="{RICH::UNDO}"></a>
					<a id="{_ins}/redo" class="ico icoredo" title="{RICH::REDO}"></a>
				</span>
				<span>
					<div class="separator"></div>
				</span>

				{noptional disable_html}
				<span>
					<a id="{_ins}/format" class="ico toggle_format_toolbar" title="{RICH::TEXT}"></a>
				</span>

				<span>
					<div class="separator"></div>
				</span>

				<span>
					<a id="{_ins}/image" class="ico icoimage" title="{RICH::IMAGE}"></a>
					<a id="{_ins}/table" class="ico icotable" title="{RICH::TABLE}"></a>
					<a id="{_ins}/link" class="ico icolink" title="{RICH::ADDLINK}"></a>
					<a id="{_ins}/dropbox" class="ico icodropbox" title="{RICH::DROPBOX}"></a>
				</span>

				<span>
					<div class="separator"></div>
				</span>

				<span>
					<a id="{_ins}/paste_text" class="ico icopastew" title="{RICH::PASTEW}"></a>
					<a id="{_ins}/hr" class="ico icorule" title="{RICH::HORIZONTAL_LINE}"></a>
				</span>

				<span>
					<div class="separator"></div>
				</span>

				<!-- <span>
					<a id="{_ins}/insert" class="ico icoinsert" title="{RICH::INSERT}"></a>
				</span> -->
				{/noptional}

				{optional disable_html}
				<span>
					<a id="{_ins}/paste_text" class="ico icopastew" title="{RICH::PASTEW}"></a>
				</span>

				<span>
					<div class="separator"></div>
				</span>
				{/optional}

				<span>
					<a id="{_ins}/spell" class="ico icospell" title="{RICH::SPELL}"></a>
				</span>

				<span>
					<div class="separator"></div>
				</span>

				<span id="{anchor additional}">
				</span>

				<div id="{anchor additional_right}" class="right">
				</div>
			</div>

			<div id="{anchor format_toolbar}" class="obj_richheader format_toolbar toolbar clearfix hidden">
				<span>
					<obj name="font" type="obj_select" css="noborder small120">
					<value>0</value>
					<title>RICH::FONT</title>
					</obj>
				</span>

				<span>
					<obj name="size" type="obj_select_input" css="noarrow noborder size">
					<value>0</value>
					<fill>
						<item key="10">10</item>
						<item key="13">13</item>
						<item key="16">16</item>
						<item key="18">18</item>
						<item key="24">24</item>
						<item key="32">32</item>
					</fill>
					<title>RICH::SIZE</title>
					</obj>
				</span>

				<span>
					<a id="{_ins}/paragraph" class="ico icoparagraph" title="{RICH::PARAGRAPH}" href="#"></a>
				</span>

				<span>
					<div class="separator"></div>
				</span>

				<span>
					<a id="{_ins}/bold" class="ico icobold" title="{RICH::BOLD}" href="#"></a>
					<a id="{_ins}/italic" class="ico icoitalic" title="{RICH::ITALIC}" href="#"></a>
					<a id="{_ins}/underline" class="ico icounderline" title="{RICH::UNDERLINE}" href="#"></a>
					<a id="{_ins}/strikeThrough" class="ico icostrikethrough" title="{RICH::STRIKETHROUGH}" href="#"></a>
				</span>

				<span>
					<div class="separator"></div>
				</span>

				<span>
					<a id="{_ins}/subscript" class="ico icosubscript" title="{RICH::SUBSCRIPT}"></a>
					<a id="{_ins}/superscript" class="ico icosuperscript" title="{RICH::SUPERSCRIPT}"></a>
				</span>

				<span>
					<div class="separator"></div>
				</span>

				<span>
					<a id="{anchor color}" class="ico icocolor" title="{RICH::COLOR}"><span></span></a>
					<a id="{anchor bgcolor}" class="ico icobgcolor" title="{RICH::BGCOLOR}"><span></span></a>
				</span>

				<span>
					<div class="separator"></div>
				</span>

				<span>
					<a id="{_ins}/align" class="ico icoleft" title="{RICH::ALIGN}" href="#"></a>
					<a id="{_ins}/ordered" class="ico icoordered" title="{RICH::INDENT}" href="#"></a>
				</span>

				<span>
					<div class="separator"></div>
				</span>

				<span>
					<a id="{_ins}/removeFormat" class="ico icoremoveformat" title="{RICH::REMOVE_FORMAT}" href="#"></a>
				</span>

				<span>
					<div class="separator"></div>
				</span>

				<span id="{anchor direction}" class="direction">
					<a id="{_ins}/direction" class="ico icodirection" title="{RICH::DIRECTION}"></a>
				</span>

				<div id="{anchor right}" class="right">
					<obj name="select" type="obj_select" css="small mode_select">
						<fill>
							<item key="enabled">{COMPOSE::HTML}</item>
							<item key="code">{RICH::CODE}</item>
						</fill>
						<value>enabled</value>
					</obj>
				</div>
			</div>
<!--
			<div id="{anchor insert_toolbar}" class="obj_richheader insert_toolbar toolbar clearfix hidden">
				<span>
					<a id="{_ins}/image" class="ico icoimage" title="{RICH::IMAGE}"></a>
					<a id="{_ins}/table" class="ico icotable" title="{RICH::TABLE}"></a>
					<a id="{_ins}/link" class="ico icolink" title="{RICH::ADDLINK}"></a>
					<a id="{_ins}/hr" class="ico icorule" title="{RICH::HORIZONTAL_LINE}"></a>
					<a id="{_ins}/dropbox" class="ico icodropbox" title="{RICH::DROPBOX}"></a>
					<a id="{_ins}/paste_text" class="ico icopastew" title="{RICH::PASTEW}"></a>
				</span>
			</div>
 -->
			<div id="{anchor emoji_toolbar}" class="obj_richheader emoji_toolbar toolbar clearfix hidden"></div>
		</td>
	</tr>
	<tr height="100%">
		<td class="msiebox" id="{anchor msiebox}">
			<div class="msiebox richbox">
				<div id="{anchor frame}"></div>
			</div>
		</td>
	</tr>
</table>
