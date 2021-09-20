<div class="obj_groupchat_item obj_groupchat_message{optional me} me{/optional}">
	<div class="message">
		{optional avatar}<div class="avatar unselectable"><span style="background-image: url('{avatar}')"></span></div>{/optional}
		<h3 class="name"><strong>{htmlspecialchars from}</strong><span class="time unselectable" title="{fulltime}">{time}</span></h3>

		<div class="border">
			<div class="body">
				{optional body}<div class="cell"><article>{body}</article></div>{/optional}
			</div>
			<div class="addon">
				<table class="frmtbl">
					<tr>
						<td class="image"><div id="{anchor image}"></div></td>
						<td class="info">
							<div>{htmlspecialchars desc}</div>
							<div id="{anchor btn}"><obj name="btn_download" type="obj_button" css="color1"><value>ATTACHMENT::DOWNLOAD</value></obj></div>
						</td>
					</tr>
				</table>
			</div>
		</div>
	</div>
</div>