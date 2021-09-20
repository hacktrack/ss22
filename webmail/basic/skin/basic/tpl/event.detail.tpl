<form action="" method="post">

<div class="cover-b wsto">
<div id="cover_a"><div id="cover_b">
<div class="commandLine">


<input type="hidden" name="_c" value="{info::controller}" />
<input type="hidden" name="container" value="{container::id}" />
<input type="hidden" name="type" value="{container::type}" />
<!--include ../basic/skin/default/tpl/grid/_event.view.tpl-->

{!optional request::all::_n::p::main 'win.main.public'}
{optional request::get::p6}
<div class="into-bottom-line-right" style="padding-top:12px; .padding-top:7px;">
	<input type="submit" name="_a[delete]" value="{lang::mail_main::delete}" class="fancyButton" alt="{lang::confirmation::delete_event}"/>
</div>
{/optional}
{/optional}

</div>
<div id="sizerWatcher" class="wsto">

<div class="wsto spacer event_form">

{optional item::EVN_ID}
	<input type="hidden" name="item[values][0][EVN_ID]" value="{item::EVN_ID ''}" />
	<input type="hidden" name="items[{item::id}]"/>
{/optional}

<table class="gridDetail">
	<tr>
		<th>{lang::event_detail::title}</th>
		<td colspan="2">
			<input type="text" name="item[values][0][EVNTITLE]" class="w2"{optional item::EVNTITLE} value="{htmlspecialchars item::EVNTITLE}"{/optional}/>
		</td>
	</tr>
	<tr>
		<th>{lang::event_detail::location}</th>
		<td colspan="2">
			<input type="text" name="item[values][0][EVNLOCATION]" class="w2"{optional item::EVNLOCATION} value="{htmlspecialchars item::EVNLOCATION}"{/optional}/>
		</td>
	</tr>
	<tr>
		<th>{lang::event_detail::label}</th>
		<td colspan="2">
			<select name="item[values][0][EVNCOLOR]" size="1" class="w2">
				<option{optional item::EVNCOLOR 'Z'} selected="selected"{/optional} value="0">{lang::event_detail::none}</option>
				<option{optional item::EVNCOLOR '1'} selected="selected"{/optional} value="1">{lang::event_detail::important}</option>
				<option{optional item::EVNCOLOR '2'} selected="selected"{/optional} value="2">{lang::event_detail::business}</option>
				<option{optional item::EVNCOLOR '3'} selected="selected"{/optional} value="3">{lang::event_detail::personal}</option>
				<option{optional item::EVNCOLOR '4'} selected="selected"{/optional} value="4">{lang::event_detail::vacation}</option>
				<option{optional item::EVNCOLOR '5'} selected="selected"{/optional} value="5">{lang::event_detail::must_attend}</option>
				<option{optional item::EVNCOLOR '6'} selected="selected"{/optional} value="6">{lang::event_detail::travel_required}</option>
				<option{optional item::EVNCOLOR '7'} selected="selected"{/optional} value="7">{lang::event_detail::needs_preparation}</option>
				<option{optional item::EVNCOLOR '8'} selected="selected"{/optional} value="8">{lang::event_detail::birthday}</option>
				<option{optional item::EVNCOLOR '9'} selected="selected"{/optional} value="9">{lang::event_detail::anniversary}</option>
				<option{optional item::EVNCOLOR 'A'} selected="selected"{/optional} value="A">{lang::event_detail::phone_call}</option>
			</select>
		</td>
	</tr>
	<tr>
		<th>{lang::event_detail::category}</th>
		<td colspan="2">
			<input type="text" class="w2" name="item[values][0][EVNTYPE]" {optional item::EVNTYPE} value="{htmlspecialchars item::EVNTYPE}"{/optional}/>
		</td>
	</tr>

	<tr>
		<td colspan="3">&nbsp;</td>
	</tr>

	<tr>
		<th>{lang::event_detail::from}</th>
		<td>
			<select size="1" name="item[values][0][EVNSTARTMONTH]" id="js_start_month" class="js_checkDate">
				<option{optional item::aditional::startmonth '01'} selected="selected"{/optional} value="1">01</option>
				<option{optional item::aditional::startmonth '02'} selected="selected"{/optional} value="2">02</option>
				<option{optional item::aditional::startmonth '03'} selected="selected"{/optional} value="3">03</option>
				<option{optional item::aditional::startmonth '04'} selected="selected"{/optional} value="4">04</option>
				<option{optional item::aditional::startmonth '05'} selected="selected"{/optional} value="5">05</option>
				<option{optional item::aditional::startmonth '06'} selected="selected"{/optional} value="6">06</option>
				<option{optional item::aditional::startmonth '07'} selected="selected"{/optional} value="7">07</option>
				<option{optional item::aditional::startmonth '08'} selected="selected"{/optional} value="8">08</option>
				<option{optional item::aditional::startmonth '09'} selected="selected"{/optional} value="9">09</option>
				<option{optional item::aditional::startmonth '10'} selected="selected"{/optional} value="10">10</option>
				<option{optional item::aditional::startmonth '11'} selected="selected"{/optional} value="11">11</option>
				<option{optional item::aditional::startmonth '12'} selected="selected"{/optional} value="12">12</option>
			</select>
			<select size="1" name="item[values][0][EVNSTARTDAY]" id="js_start_day" class="js_checkDate">
				<option{optional item::aditional::startday '01'} selected="selected"{/optional} value="1">01</option>
				<option{optional item::aditional::startday '02'} selected="selected"{/optional} value="2">02</option>
				<option{optional item::aditional::startday '03'} selected="selected"{/optional} value="3">03</option>
				<option{optional item::aditional::startday '04'} selected="selected"{/optional} value="4">04</option>
				<option{optional item::aditional::startday '05'} selected="selected"{/optional} value="5">05</option>
				<option{optional item::aditional::startday '06'} selected="selected"{/optional} value="6">06</option>
				<option{optional item::aditional::startday '07'} selected="selected"{/optional} value="7">07</option>
				<option{optional item::aditional::startday '08'} selected="selected"{/optional} value="8">08</option>
				<option{optional item::aditional::startday '09'} selected="selected"{/optional} value="9">09</option>
				<option{optional item::aditional::startday '10'} selected="selected"{/optional} value="10">10</option>
				<option{optional item::aditional::startday '11'} selected="selected"{/optional} value="11">11</option>
				<option{optional item::aditional::startday '12'} selected="selected"{/optional} value="12">12</option>
				<option{optional item::aditional::startday '13'} selected="selected"{/optional} value="13">13</option>
				<option{optional item::aditional::startday '14'} selected="selected"{/optional} value="14">14</option>
				<option{optional item::aditional::startday '15'} selected="selected"{/optional} value="15">15</option>
				<option{optional item::aditional::startday '16'} selected="selected"{/optional} value="16">16</option>
				<option{optional item::aditional::startday '17'} selected="selected"{/optional} value="17">17</option>
				<option{optional item::aditional::startday '18'} selected="selected"{/optional} value="18">18</option>
				<option{optional item::aditional::startday '19'} selected="selected"{/optional} value="19">19</option>
				<option{optional item::aditional::startday '20'} selected="selected"{/optional} value="20">20</option>
				<option{optional item::aditional::startday '21'} selected="selected"{/optional} value="21">21</option>
				<option{optional item::aditional::startday '22'} selected="selected"{/optional} value="22">22</option>
				<option{optional item::aditional::startday '23'} selected="selected"{/optional} value="23">23</option>
				<option{optional item::aditional::startday '24'} selected="selected"{/optional} value="24">24</option>
				<option{optional item::aditional::startday '25'} selected="selected"{/optional} value="25">25</option>
				<option{optional item::aditional::startday '26'} selected="selected"{/optional} value="26">26</option>
				<option{optional item::aditional::startday '27'} selected="selected"{/optional} value="27">27</option>
				<option{optional item::aditional::startday '28'} selected="selected"{/optional} value="28">28</option>
				<option{optional item::aditional::startday '29'} selected="selected"{/optional} value="29">29</option>
				<option{optional item::aditional::startday '30'} selected="selected"{/optional} value="30">30</option>
				<option{optional item::aditional::startday '31'} selected="selected"{/optional} value="31">31</option>
			</select>
			<span id="from_y">
			<select size="1" class="holdSelect js_checkDate" name="item[values][0][EVNSTARTYEAR]" title="from_y" id="js_start_year">
			{optional years}
			{dynamic years}
				<option {optional *::s}selected="selected"{/optional} value="{.*::y}">{.*::y}</option>
			{/dynamic}
			{/optional}
			{optional item::aditional::startyears}
			{dynamic item::aditional::startyears}
				<option {optional *::s}selected="selected"{/optional} value="{.*::y}">{.*::y}</option>
			{/dynamic}
			{/optional}
			</select>
			</span>
			<select size="1" name="item[values][0][EVNSTARTHOUR]" id="js_start_hour" class="js_checkDate">
				<option value="0"{optional item::aditional::starthour '00'} selected="selected"{/optional}>00</option>
				<option value="1"{optional item::aditional::starthour '01'} selected="selected"{/optional}>01</option>
				<option value="2"{optional item::aditional::starthour '02'} selected="selected"{/optional}>02</option>
				<option value="3"{optional item::aditional::starthour '03'} selected="selected"{/optional}>03</option>
				<option value="4"{optional item::aditional::starthour '04'} selected="selected"{/optional}>04</option>
				<option value="5"{optional item::aditional::starthour '05'} selected="selected"{/optional}>05</option>
				<option value="6"{optional item::aditional::starthour '06'} selected="selected"{/optional}>06</option>
				<option value="7"{optional item::aditional::starthour '07'} selected="selected"{/optional}>07</option>
				<option value="8"{optional item::aditional::starthour '08'} selected="selected"{/optional}>08</option>
				<option value="9"{optional item::aditional::starthour '09'} selected="selected"{/optional}>09</option>
				<option value="10"{optional item::aditional::starthour '10'} selected="selected"{/optional}>10</option>
				<option value="11"{optional item::aditional::starthour '11'} selected="selected"{/optional}>11</option>
				<option value="12"{optional item::aditional::starthour '12'} selected="selected"{/optional}>12</option>
				<option value="13"{optional item::aditional::starthour '13'} selected="selected"{/optional}>13</option>
				<option value="14"{optional item::aditional::starthour '14'} selected="selected"{/optional}>14</option>
				<option value="15"{optional item::aditional::starthour '15'} selected="selected"{/optional}>15</option>
				<option value="16"{optional item::aditional::starthour '16'} selected="selected"{/optional}>16</option>
				<option value="17"{optional item::aditional::starthour '17'} selected="selected"{/optional}>17</option>
				<option value="18"{optional item::aditional::starthour '18'} selected="selected"{/optional}>18</option>
				<option value="19"{optional item::aditional::starthour '19'} selected="selected"{/optional}>19</option>
				<option value="20"{optional item::aditional::starthour '20'} selected="selected"{/optional}>20</option>
				<option value="21"{optional item::aditional::starthour '21'} selected="selected"{/optional}>21</option>
				<option value="22"{optional item::aditional::starthour '22'} selected="selected"{/optional}>22</option>
				<option value="23"{optional item::aditional::starthour '23'} selected="selected"{/optional}>23</option>
			</select>
			<select size="1" name="item[values][0][EVNSTARTMINUTE]" id="js_start_minute" class="js_checkDate">
				<option value="0"{optional item::aditional::startminute '01'} selected="selected"{/optional}>00</option>
				<option value="5"{optional item::aditional::startminute '05'} selected="selected"{/optional}>05</option>
				<option value="10"{optional item::aditional::startminute '10'} selected="selected"{/optional}>10</option>
				<option value="15"{optional item::aditional::startminute '15'} selected="selected"{/optional}>15</option>
				<option value="20"{optional item::aditional::startminute '20'} selected="selected"{/optional}>20</option>
				<option value="25"{optional item::aditional::startminute '25'} selected="selected"{/optional}>25</option>
				<option value="30"{optional item::aditional::startminute '30'} selected="selected"{/optional}>30</option>
				<option value="35"{optional item::aditional::startminute '35'} selected="selected"{/optional}>35</option>
				<option value="40"{optional item::aditional::startminute '40'} selected="selected"{/optional}>40</option>
				<option value="45"{optional item::aditional::startminute '45'} selected="selected"{/optional}>45</option>
				<option value="50"{optional item::aditional::startminute '50'} selected="selected"{/optional}>50</option>
				<option value="55"{optional item::aditional::startminute '55'} selected="selected"{/optional}>55</option>
			</select>
		</td>
		<td></td>
	</tr>
	<tr>
		<th>{lang::event_detail::to}</th>
		<td>
			<select size="1" name="item[values][0][EVNENDMONTH]" id="js_end_month" class="js_checkDate">
				<option value="1"{optional item::aditional::endmonth '01'} selected="selected"{/optional}>01</option>
				<option value="2"{optional item::aditional::endmonth '02'} selected="selected"{/optional}>02</option>
				<option value="3"{optional item::aditional::endmonth '03'} selected="selected"{/optional}>03</option>
				<option value="4"{optional item::aditional::endmonth '04'} selected="selected"{/optional}>04</option>
				<option value="5"{optional item::aditional::endmonth '05'} selected="selected"{/optional}>05</option>
				<option value="6"{optional item::aditional::endmonth '06'} selected="selected"{/optional}>06</option>
				<option value="7"{optional item::aditional::endmonth '07'} selected="selected"{/optional}>07</option>
				<option value="8"{optional item::aditional::endmonth '08'} selected="selected"{/optional}>08</option>
				<option value="9"{optional item::aditional::endmonth '09'} selected="selected"{/optional}>09</option>
				<option value="10"{optional item::aditional::endmonth '10'} selected="selected"{/optional}>10</option>
				<option value="11"{optional item::aditional::endmonth '11'} selected="selected"{/optional}>11</option>
				<option value="12"{optional item::aditional::endmonth '12'} selected="selected"{/optional}>12</option>
			</select>
			<select size="1" name="item[values][0][EVNENDDAY]" id="js_end_day" class="js_checkDate">
				<option value="1"{optional item::aditional::endday '01'} selected="selected"{/optional}>01</option>
				<option value="2"{optional item::aditional::endday '02'} selected="selected"{/optional}>02</option>
				<option value="3"{optional item::aditional::endday '03'} selected="selected"{/optional}>03</option>
				<option value="4"{optional item::aditional::endday '04'} selected="selected"{/optional}>04</option>
				<option value="5"{optional item::aditional::endday '05'} selected="selected"{/optional}>05</option>
				<option value="6"{optional item::aditional::endday '06'} selected="selected"{/optional}>06</option>
				<option value="7"{optional item::aditional::endday '07'} selected="selected"{/optional}>07</option>
				<option value="8"{optional item::aditional::endday '08'} selected="selected"{/optional}>08</option>
				<option value="9"{optional item::aditional::endday '09'} selected="selected"{/optional}>09</option>
				<option value="10"{optional item::aditional::endday '10'} selected="selected"{/optional}>10</option>
				<option value="11"{optional item::aditional::endday '11'} selected="selected"{/optional}>11</option>
				<option value="12"{optional item::aditional::endday '12'} selected="selected"{/optional}>12</option>
				<option value="13"{optional item::aditional::endday '13'} selected="selected"{/optional}>13</option>
				<option value="14"{optional item::aditional::endday '14'} selected="selected"{/optional}>14</option>
				<option value="15"{optional item::aditional::endday '15'} selected="selected"{/optional}>15</option>
				<option value="16"{optional item::aditional::endday '16'} selected="selected"{/optional}>16</option>
				<option value="17"{optional item::aditional::endday '17'} selected="selected"{/optional}>17</option>
				<option value="18"{optional item::aditional::endday '18'} selected="selected"{/optional}>18</option>
				<option value="19"{optional item::aditional::endday '19'} selected="selected"{/optional}>19</option>
				<option value="20"{optional item::aditional::endday '20'} selected="selected"{/optional}>20</option>
				<option value="21"{optional item::aditional::endday '21'} selected="selected"{/optional}>21</option>
				<option value="22"{optional item::aditional::endday '22'} selected="selected"{/optional}>22</option>
				<option value="23"{optional item::aditional::endday '23'} selected="selected"{/optional}>23</option>
				<option value="24"{optional item::aditional::endday '24'} selected="selected"{/optional}>24</option>
				<option value="25"{optional item::aditional::endday '25'} selected="selected"{/optional}>25</option>
				<option value="26"{optional item::aditional::endday '26'} selected="selected"{/optional}>26</option>
				<option value="27"{optional item::aditional::endday '27'} selected="selected"{/optional}>27</option>
				<option value="28"{optional item::aditional::endday '28'} selected="selected"{/optional}>28</option>
				<option value="29"{optional item::aditional::endday '29'} selected="selected"{/optional}>29</option>
				<option value="30"{optional item::aditional::endday '30'} selected="selected"{/optional}>30</option>
				<option value="31"{optional item::aditional::endday '31'} selected="selected"{/optional}>31</option>
			</select>
			<span id="to_y">
			<select size="1" class="holdSelect js_checkDate" name="item[values][0][EVNENDYEAR]" title="to_y" id="js_end_year">
			{optional years}
			{dynamic years}
				<option {optional *::s}selected="selected"{/optional} value="{.*::y}">{.*::y}</option>
			{/dynamic}
			{/optional}
			{optional item::aditional::endyears}
			{dynamic item::aditional::endyears}
				<option {optional *::s}selected="selected"{/optional} value="{.*::y}">{.*::y}</option>
			{/dynamic}
			{/optional}
			</select>
			</span>
			<select size="1" name="item[values][0][EVNENDHOUR]" id="js_end_hour" class="js_checkDate">
				<option value="0"{optional item::aditional::endhour '00'} selected="selected"{/optional}>00</option>
				<option value="1"{optional item::aditional::endhour '01'} selected="selected"{/optional}>01</option>
				<option value="2"{optional item::aditional::endhour '02'} selected="selected"{/optional}>02</option>
				<option value="3"{optional item::aditional::endhour '03'} selected="selected"{/optional}>03</option>
				<option value="4"{optional item::aditional::endhour '04'} selected="selected"{/optional}>04</option>
				<option value="5"{optional item::aditional::endhour '05'} selected="selected"{/optional}>05</option>
				<option value="6"{optional item::aditional::endhour '06'} selected="selected"{/optional}>06</option>
				<option value="7"{optional item::aditional::endhour '07'} selected="selected"{/optional}>07</option>
				<option value="8"{optional item::aditional::endhour '08'} selected="selected"{/optional}>08</option>
				<option value="9"{optional item::aditional::endhour '09'} selected="selected"{/optional}>09</option>
				<option value="10"{optional item::aditional::endhour '10'} selected="selected"{/optional}>10</option>
				<option value="11"{optional item::aditional::endhour '11'} selected="selected"{/optional}>11</option>
				<option value="12"{optional item::aditional::endhour '12'} selected="selected"{/optional}>12</option>
				<option value="13"{optional item::aditional::endhour '13'} selected="selected"{/optional}>13</option>
				<option value="14"{optional item::aditional::endhour '14'} selected="selected"{/optional}>14</option>
				<option value="15"{optional item::aditional::endhour '15'} selected="selected"{/optional}>15</option>
				<option value="16"{optional item::aditional::endhour '16'} selected="selected"{/optional}>16</option>
				<option value="17"{optional item::aditional::endhour '17'} selected="selected"{/optional}>17</option>
				<option value="18"{optional item::aditional::endhour '18'} selected="selected"{/optional}>18</option>
				<option value="19"{optional item::aditional::endhour '19'} selected="selected"{/optional}>19</option>
				<option value="20"{optional item::aditional::endhour '20'} selected="selected"{/optional}>20</option>
				<option value="21"{optional item::aditional::endhour '21'} selected="selected"{/optional}>21</option>
				<option value="22"{optional item::aditional::endhour '22'} selected="selected"{/optional}>22</option>
				<option value="23"{optional item::aditional::endhour '23'} selected="selected"{/optional}>23</option>
			</select>
			<select size="1" name="item[values][0][EVNENDMINUTE]" id="js_end_minute" class="js_checkDate">
				<option value="0"{optional item::aditional::endminute '00'} selected="selected"{/optional}>00</option>
				<option value="5"{optional item::aditional::endminute '05'} selected="selected"{/optional}>05</option>
				<option value="10"{optional item::aditional::endminute '10'} selected="selected"{/optional}>10</option>
				<option value="15"{optional item::aditional::endminute '15'} selected="selected"{/optional}>15</option>
				<option value="20"{optional item::aditional::endminute '20'} selected="selected"{/optional}>20</option>
				<option value="25"{optional item::aditional::endminute '25'} selected="selected"{/optional}>25</option>
				<option value="30"{optional item::aditional::endminute '30'} selected="selected"{/optional}>30</option>
				<option value="35"{optional item::aditional::endminute '35'} selected="selected"{/optional}>35</option>
				<option value="40"{optional item::aditional::endminute '40'} selected="selected"{/optional}>40</option>
				<option value="45"{optional item::aditional::endminute '45'} selected="selected"{/optional}>45</option>
				<option value="50"{optional item::aditional::endminute '50'} selected="selected"{/optional}>50</option>
				<option value="55"{optional item::aditional::endminute '55'} selected="selected"{/optional}>55</option>
			</select>
		</td>
		<td></td>
	</tr>
	<tr>
		<th></th>
		<td colspan="2"><input type="checkbox" name="item[values][0][EVNALLDAY]" value="1"{optional item::aditional::allday} checked="checked"{/optional} class="checkbox" />{lang::event_detail::allday}<td>
	</tr>

	<tr>
		<td colspan="3">&nbsp;</td>
	</tr>

	<tr>
		<th colspan="3">{lang::event_detail::notes}</th>
	</tr>
	<tr>
		<td colspan="2">
			<textarea name="item[values][0][EVNNOTE]" class="wsto">{optional item::EVNNOTE}{htmlspecialchars item::EVNNOTE}{/optional}</textarea>
		</td>
		<td>
		</td>
	</tr>
	<tr>
		<td colspan="3">
			<input type="checkbox" name="item[values][0][EVNSHARETYPE]" {optional item::EVNSHARETYPE 'C'} checked="checked"{/optional}{!optional item::EVNSHARETYPE 'C'}{optional item::EVNSHARETYPE 'P'} checked="checked"{/optional}{/optional} class="checkboxFix"/>{lang::event_detail::private}
		</td>
	</tr>
</table>

<br />

{optional item::aditional::attachments}
<table>
<td>{lang::mail_compose::attachments}</td>
</table>
{/optional}

{!optional request::all::_n::p::main 'win.main.public'}
<div class="into-bottom-line" style="padding-top:12px; .padding-top:4px;">
	{optional request::get::p6}
		<input type="submit" value="{lang::grid::save}" class="fancyButton none" name="_a[edit]"/>
	{/optional}
	{!optional request::get::p6}
		<input type="submit" name="_a[create]" value="{lang::event_main::save}" class="fancyButton"/>
	{/optional}
</div>
{/optional}

{dynamic item::aditional::attachments}
	<a href="{.*::ATTURL}" target="_blank">{.*::ATTDESC} ({.*::ATTSIZE})</a><br />
{/dynamic}
<!--
<table>
	<tr>
		<td>
			<div class="fieldHolder" id="attachments">
				<div>
					<input type="file" name="item[attachments][]" size="45" id="attachments_first"/><input type="button" class="bfield submitField noJSHide rem" onclick="addFileField()" value="+" id="addFileField2" />
				</div>
			</div>
			{optional item::attachments}
			<div id="attachmentsBox">
				{dynamic item::attachments}
				<div>
					<div class="attachmentDel left">
						
					</div>
					<a class="left" href="{.*::link}" title="{htmlspecialchars *::name}">{htmlspecialchars *::name}</a>
					<div class="cleaner">
					</div>
				</div>
				{/dynamic}
			</div>
			{/optional}
		</td>
	</tr>
</table>
-->


<div class="cleaner"></div>
</div>
</div>
</div>
</div>
</div>


</form>