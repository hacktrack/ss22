<div id="{anchor container}" class="itemview itemview_file">
	<iframe name="{anchor frame}" id="{anchor frame}" class="att"></iframe>

	<div class="title">
		{dynamic att}<h1 class="att{optional att::*::ico} ico_{att::*::ico}{/optional}"><bdi>{htmlspecialchars title}</bdi></h1>{/dynamic}
		{optional sharing}<obj name="share" type="obj_button" css="color1 btn_important"><value>COMMON::SHARE</value></obj>{/optional}
	</div>
	<div class="preview{noptional preview_img::small} max{/noptional}" id="{anchor imgpreview}">
		<div class="image" id="{anchor previewimg}">

			{optional itmedit}
			<div class="editbar"><div>{ITEMVIEW::EDIT}</div></div>
			{/optional}
			{optional itmview}
			<div class="editbar viewbar"><div>{ITEMVIEW::VIEW}</div></div>
			{/optional}


			{optional conversion}
			<div class="convert" id="{anchor convert}"><div>{ITEMVIEW::CONVERSION}</div></div>
			{/optional}

			{noptional conversion}
			<div  id="{anchor info}" class="infoblock file_{extension}">
				<h3><bdi>{htmlspecialchars title}</bdi></h3><h4>{full_date} - {size}</h4>
				{optional play}
				<obj name="play" type="obj_player" css="simple"><src>{htmlspecialchars play}</src><title>{htmlspecialchars title}</title></obj>
				{/optional}
			</div>
			{/noptional}

		</div>
	</div>

	<div class="menu">
		<obj name="menu" type="obj_tabs" css="ico transparent nobuttons">
			<obj name="detail" type="obj_tab" css="detail"><value>ITEMVIEW::DETAILS</value><draw form="obj_itemview_f_detail"></draw></obj>
			<obj name="revision" type="obj_tab" css="revision"><value>ITEMVIEW::REVISIONS</value><draw form="obj_itemview_f_revisions"></draw></obj>
		</obj>
	</div>
</div>
