<table>
	<tr>
		<td>
			<div id="{anchor header}" class="obj_richheader clearfix">
				<span>
					<a id="{_ins}/insert" class="ico icoinsert" title="{RICH::INSERT}"></a>
				</span>

				<span>
					<div class="separator"></div>
				</span>

				<span>
					<a id="{_ins}/toggle" class="ico toggle_subheader" title="{RICH::TEXT}"></a>
				</span>

				<span>
					<div class="separator"></div>
				</span>

				<span id="{anchor additional}">
				</span>

				<div id="{anchor additional_right}" class="right">
				</div>
			</div>
			<div id="{anchor subheader}" class="obj_richheader clearfix hidden">
				<span>
					<obj name="font" type="obj_select" css="small120">
					<value>0</value>
					<title>RICH::FONT</title>
					</obj>
				</span>

				<span>
					<obj name="size" type="obj_select" css="small60">
					<value>0</value>
					<fill>
						<!--item key="0">0</item-->
						<item key="1">1</item>
						<item key="2">2</item>
						<item key="3">3</item>
						<item key="4">4</item>
						<item key="5">5</item>
						<item key="6">6</item>
					</fill>
					<title>RICH::SIZE</title>
					</obj>
				</span>

				<span>
					<obj name="p" type="obj_select" css="small120">
					<value>0</value>
					<fill>
						<item key="0">{RICH::PARAGRAPH}</item>
						<item key="1">{RICH::NORMAL}</item>
						<item key="2">{RICH::HEADING} 1</item>
						<item key="3">{RICH::HEADING} 2</item>
						<item key="4">{RICH::HEADING} 3</item>
						<item key="5">{RICH::HEADING} 4</item>
						<item key="6">{RICH::HEADING} 5</item>
						<item key="7">{RICH::HEADING} 6</item>
						<item key="removeFormat">{RICH::CLEARFORMATTING}</item>
					</fill>
					<title>RICH::SIZE</title>
					</obj>
				</span>

				<span>
					<a id="{anchor color}" class="ico icocolor" title="{RICH::COLOR}"><span></span></a>
					<a id="{anchor bgcolor}" class="ico icobgcolor" title="{RICH::BGCOLOR}"><span></span></a>
				</span>

				<span>
					<div class="separator"></div>
				</span>

				<span>
					<a id="{_ins}/bold" class="ico icobold" title="{RICH::BOLD}" href="#"></a>
					<a id="{_ins}/italic" class="ico icoitalic" title="{RICH::ITALIC}" href="#"></a>
					<a id="{_ins}/underline" class="ico icounderline" title="{RICH::UNDERLINE}" href="#"></a>
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
					<a id="{_ins}/spell" class="ico icospell" title="{RICH::SPELL}"></a>
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
		</td>
	</tr>
	<tr height="100%">
		<td class="msiebox" id="{anchor msiebox}"><div class="msiebox richbox"><iframe frameborder="0" name="{anchor frame}" marginheight="0" marginwidth="0" src="javascript: void(0);" id="{anchor frame}"></iframe></div></td>
	</tr>
</table>
