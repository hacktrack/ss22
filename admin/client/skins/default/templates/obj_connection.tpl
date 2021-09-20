<div class="topbar" iw-type="connection">
	<div class="menu left" iw-type="button">
		<div class="button icon large icon-warning borderless"></div>
	</div>
	<div class="topbar-center">
		<span id="{anchor errors}" class="no-wrap">{ERROR::CONNECTION}</span>
	</div>
	<div class="menu right" iw-type="button">
		<div id="{anchor retry}">
			<obj name="btn_re" type="obj_button" css="text primary" tabindex="true">
				<value>form_buttons::retry</value>
			</obj>
		</div>
		<div id="{anchor accept}" is-hidden="1">
			<obj name="btn_ok" type="obj_button" css="text primary" tabindex="true">
				<value>form_buttons::ok</value>
			</obj>
		</div>
		<div id="{anchor countdown}"></div>
		<div id="{anchor cancel}">
			<obj name="btn_cancel" type="obj_button" css="text primary grey" tabindex="true">
				<value>form_buttons::cancel</value>
			</obj>
		</div>
	</div>
</div>
