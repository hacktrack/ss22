<div class="popupmaindialog">
    <h3>{h}</h3>
    <ol>
        <li>{l1}</li>
        <li>{l2}</li>
        <li>{l3}</li>
    </ol>

    <div class="block">
        <div class="code" id="{anchor qr}"></div>
        <span class="center">{VERIFICATION::APP_AUTH_NOTE}</span>
        <span class="center" id="{anchor manual}">{VERIFICATION::APP_AUTH_HELP}</span>

        {optional reset}<span class="center"><obj name="btn_reset" type="obj_button" css="color2 reset simple"><value>VERIFICATION::RESET</value></obj></span>{/optional}
    </div>
</div>
