		<div class="body">

			<div class="share">
				<div class="block email"><h4>{POPUP_ITEMS::SEND_AS_EMAIL}</h4><table class="frmtbl frmtbl100 nospace"><tr><td class="td"><obj name="email" type="obj_suggest_mail" css="obj_input_100"></obj></td><td><obj name="send" type="obj_button" css="color1 simple"><value>COMPOSE::SEND</value><disabled>1</disabled></obj></td></tr></table></div>
				<div class="or"><span>{COMMON::OR}</span></div>
				<div class="block"><h4>{ITEM::SHARE}</h4><obj name="url" type="obj_input" css="obj_input_100"></obj></div>
				<div class="close" id="{anchor close}"></div>
			</div>

			<div class="cell preview{optional preview} {preview}{/optional} unselectable" id="{anchor preview}"><div></div></div>
			<div class="cell info">
				<table class="frmtbl nospace">
					<tr>
						<th>{IM::FILE_ADDED}&nbsp;</th>
						<td id="{anchor fname}" class="fname">{htmlspecialchars filename}</td>
					</tr>
					<tr><th colspan="2">{size}</th></tr>
				</table>
				{optional play}<div class="noclick"><obj name="play" type="obj_player" css="simple transparent"><src>{htmlspecialchars url}</src><title>{htmlspecialchars filename}</title></obj></div>{/optional}
				<div class="buttons noclick">
					{optional menubutton}<obj name="download" type="obj_button_menu" css="color1"><value>ATTACHMENT::DOWNLOAD</value></obj>{/optional}
					{noptional menubutton}<obj name="download" type="obj_button" css="color1"><value>ATTACHMENT::DOWNLOAD</value></obj>{/noptional}
					{optional shareable}
					<obj name="share" type="obj_button"><value>MAIN_MENU::SHARE</value></obj>
					{/optional}
				</div>
			</div>

		</div>
