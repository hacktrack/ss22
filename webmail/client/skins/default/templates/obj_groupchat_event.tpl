<div class="body">
	<div class="cell preview" id="{anchor preview}"></div>
	<div class="cell info">
		<h4 class="title private_msg">{htmlspecialchars title}</h4>

		{optional date}<p>{htmlspecialchars date}</p>{/optional}
		{optional location}<p>{htmlspecialchars location}</p>{/optional}

		{optional body}<article>{htmlspecialchars body}</article>{/optional}
		<div class="buttons noclick">
			<obj name="btn_accept" type="obj_button" css="color1 select"><value>FORM_BUTTONS::ACCEPT</value><disabled>1</disabled></obj>
			<obj name="btn_info" type="obj_button"><value>IM::MORE_INFO</value></obj>
			{optional conference}
			<obj name="btn_join" type="obj_button" css="color3"><value>EVENT::JOINCONFERENCE</value></obj>
			{/optional}
			<obj name="attendees" type="obj_label"><disabled>1</disabled></obj>
		</div>
	</div>
</div>
