{include ../basic/skin/fresh/tpl/_toolbar.top_groupware.detail.tpl}


<div class="body form">

{optional item::EVN_ID}
<input type="hidden" name="item[values][0][EVN_ID]" value="{item::EVN_ID}" />
<input type="hidden" name="items[{item::id}]"/>
<h2>{lang::tasks_detail::task}</h2>
{/optional}

{!optional item::EVN_ID}
<h2>{lang::tasks_main::add}</h2>
{/optional}

<table class="frmtbl frmtbl100">
	<tr>
		<th class="th">{lang::event_detail::title}</th>
		<td class="td">
			<div class="inp_text">
			<input type="text" class="inp_text" name="item[values][0][EVNTITLE]" class="w2"{optional item::EVNTITLE} value="{htmlspecialchars item::EVNTITLE}"{/optional}/>
			</div>
		</td>
	</tr>
	<tr>
		<th>{lang::event_detail::tags}</th>
		<td>
			<div class="inp_text">
			<input type="text" class="inp_text" class="w2" name="item[values][0][EVNTYPE]" {optional item::EVNTYPE} value="{htmlspecialchars item::EVNTYPE}"{/optional}/>
			</div>
		</td>
	</tr>
	<tr>
		<td colspan="2"><div class="spacer"></div></td>
	</tr>
	<tr>
		<th>{lang::tasks_detail::status}</th>
		<td>
			<select name="item[values][0][EVNSTATUS]" size="1" class="w2">
				<option{optional item::EVNSTATUS 'B'} selected="selected"{/optional} value="B" style="background:url('skin/fresh/images/icons/ico_task_B.gif') 2px 50% no-repeat; padding:2px 0 2px 22px;">{lang::tasks_detail::not_started}</option>
				<option{optional item::EVNSTATUS 'I'} selected="selected"{/optional} value="I" style="background:url('skin/fresh/images/icons/ico_task_I.gif') 2px 50% no-repeat; padding:2px 0 2px 22px;">{lang::tasks_detail::in_progress}</option>
				<option{optional item::EVNSTATUS 'M'} selected="selected"{/optional} value="M" style="background:url('skin/fresh/images/icons/ico_task_M.gif') 2px 50% no-repeat; padding:2px 0 2px 22px;">{lang::tasks_detail::completed}</option>
				<option{optional item::EVNSTATUS 'Q'} selected="selected"{/optional} value="Q" style="background:url('skin/fresh/images/icons/ico_task_Q.gif') 2px 50% no-repeat; padding:2px 0 2px 22px;">{lang::tasks_detail::deferred}</option>
				<option{optional item::EVNSTATUS 'N'} selected="selected"{/optional} value="N" style="background:url('skin/fresh/images/icons/ico_task_N.gif') 2px 50% no-repeat; padding:2px 0 2px 22px;">{lang::tasks_detail::waiting_for_someone_else}</option>
			</select>
		</td>
	</tr>
	<tr>
		<td colspan="2"><div class="spacer"></div></td>
	</tr>
	<tr>
		<th>{lang::tasks_detail::complete} [%]</th>
		<td>
			<select name="item[values][0][EVNCOMPLETE]" size="1" class="w2">
				<option{optional item::EVNCOMPLETE '0'} selected="selected"{/optional} value="0">0</option>
				<option{optional item::EVNCOMPLETE '25'} selected="selected"{/optional} value="25">25</option>
				<option{optional item::EVNCOMPLETE '50'} selected="selected"{/optional} value="50">50</option>
				<option{optional item::EVNCOMPLETE '75'} selected="selected"{/optional} value="75">75</option>
				<option{optional item::EVNCOMPLETE '100'} selected="selected"{/optional} value="100">100</option>
			</select>
		</td>
	</tr>
	<tr>
		<td colspan="2"><div class="spacer"></div></td>
	</tr>
	<tr>
		<th>{lang::tasks_detail::priority}</th>
		<td>
			<select name="item[values][0][EVNPRIORITY]" size="1" class="w2">
				<option{optional item::EVNPRIORITY '0'} selected="selected"{/optional} value="0">{lang::tasks_detail::medium}</option>
				<option{optional item::EVNPRIORITY '1'} selected="selected"{/optional} value="1">{lang::tasks_detail::high}</option>
				<option{optional item::EVNPRIORITY '9'} selected="selected"{/optional} value="9">{lang::tasks_detail::low}</option>
			</select>
		</td>
	</tr>
	<tr>
		<td colspan="2">&nbsp;</td>
	</tr>

	<tr class="check_date_first">
		<th>
			<input type="checkbox" id="startTimeCheckbox"{optional item::aditional::startactive} checked="checked"{/optional} name="item[values][0][EVNENDCHECK]"/>
			{lang::event_detail::from}
		</th>
		<td class="rbig datePickerBox">
			<div>
					<script>DateInput('datePicker_toDate', true{optional item::aditional::startday},"DD/MM/YYYY","{item::aditional::startday}/{item::aditional::startmonth}/{dynamic item::aditional::startyears}{optional *::s}{.*::y}{/optional}{/dynamic}"{/optional});</script>
				</div>
				<div class="noJSShow">
					<table>
						<tr>
							<td>
								<select size="1" name="item[values][0][EVNENDDAY]" id="js_end_day" class="day">
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
							</td>
							<td>
								<select size="1" name="item[values][0][EVNENDMONTH]" id="js_end_month" class="month">
									<option value="1"{optional item::aditional::endmonth '01'} selected="selected"{/optional}>{lang::event_main::jan}</option>
									<option value="2"{optional item::aditional::endmonth '02'} selected="selected"{/optional}>{lang::event_main::feb}</option>
									<option value="3"{optional item::aditional::endmonth '03'} selected="selected"{/optional}>{lang::event_main::mar}</option>
									<option value="4"{optional item::aditional::endmonth '04'} selected="selected"{/optional}>{lang::event_main::apr}</option>
									<option value="5"{optional item::aditional::endmonth '05'} selected="selected"{/optional}>{lang::event_main::may}</option>
									<option value="6"{optional item::aditional::endmonth '06'} selected="selected"{/optional}>{lang::event_main::jun}</option>
									<option value="7"{optional item::aditional::endmonth '07'} selected="selected"{/optional}>{lang::event_main::jul}</option>
									<option value="8"{optional item::aditional::endmonth '08'} selected="selected"{/optional}>{lang::event_main::aug}</option>
									<option value="9"{optional item::aditional::endmonth '09'} selected="selected"{/optional}>{lang::event_main::sep}</option>
									<option value="10"{optional item::aditional::endmonth '10'} selected="selected"{/optional}>{lang::event_main::oct}</option>
									<option value="11"{optional item::aditional::endmonth '11'} selected="selected"{/optional}>{lang::event_main::nov}</option>
									<option value="12"{optional item::aditional::endmonth '12'} selected="selected"{/optional}>{lang::event_main::dec}</option>
								</select>
							</td>
							<td>
								<span id="to_y">
								<select size="1" class="holdSelect year infinite_year" name="item[values][0][EVNENDYEAR]" title="to_y" id="js_end_year">
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
							</td>
						</tr>
					</table>
				
		<!--
			<table><tr>
			<td class="rbig">
				<select size="1" class="startTimeCheckbox month" id="js_start_month" name="item[values][0][EVNENDMONTH]">
					<option{optional item::aditional::startmonth '01'} selected="selected"{/optional} value="1">{lang::event_main::jan}</option>
					<option{optional item::aditional::startmonth '02'} selected="selected"{/optional} value="2">{lang::event_main::feb}</option>
					<option{optional item::aditional::startmonth '03'} selected="selected"{/optional} value="3">{lang::event_main::mar}</option>
					<option{optional item::aditional::startmonth '04'} selected="selected"{/optional} value="4">{lang::event_main::apr}</option>
					<option{optional item::aditional::startmonth '05'} selected="selected"{/optional} value="5">{lang::event_main::may}</option>
					<option{optional item::aditional::startmonth '06'} selected="selected"{/optional} value="6">{lang::event_main::jun}</option>
					<option{optional item::aditional::startmonth '07'} selected="selected"{/optional} value="7">{lang::event_main::jul}</option>
					<option{optional item::aditional::startmonth '08'} selected="selected"{/optional} value="8">{lang::event_main::aug}</option>
					<option{optional item::aditional::startmonth '09'} selected="selected"{/optional} value="9">{lang::event_main::sep}</option>
					<option{optional item::aditional::startmonth '10'} selected="selected"{/optional} value="10">{lang::event_main::oct}</option>
					<option{optional item::aditional::startmonth '11'} selected="selected"{/optional} value="11">{lang::event_main::nov}</option>
					<option{optional item::aditional::startmonth '12'} selected="selected"{/optional} value="12">{lang::event_main::dec}</option>
				</select>
			</td>
			<td class="rbig">
				<select size="1" class="startTimeCheckbox day" id="js_start_day" name="item[values][0][EVNENDDAY]">
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
			</td>
			<td>
				<span id="from_y">
				<select size="1" class="holdSelect startTimeCheckbox year infinite_year" id="js_start_year" name="item[values][0][EVNENDYEAR]" title="from_y">
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
			</td>
			</tr></table>
			-->
		</td>
	</tr>
	<tr>
		<td colspan="2"><div class="spacer"></div></td>
	</tr>
	<tr>
		<th>
			<input type="checkbox" id="endTimeCheckbox"{optional item::aditional::endactive} checked="checked"{/optional} name="item[values][0][EVNSTARTCHECK]"/>
			{lang::event_detail::to}
		</th>
		<td class="rbig datePickerBox">
			<div>
					<script>DateInput('datePicker_fromDate', true{optional item::aditional::endday},"DD/MM/YYYY","{item::aditional::endday}/{item::aditional::endmonth}/{dynamic item::aditional::endyears}{optional *::s}{.*::y}{/optional}{/dynamic}"{/optional});</script>
				</div>
				
				<div class="noJSShow">
					<table>
						<tr>
							<td>
								<select size="1" name="item[values][0][EVNSTARTDAY]" id="js_start_day" class="day">
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
								<select size="1" name="item[values][0][EVNSTARTMONTH]" id="js_start_month" class="month">
									<option{optional item::aditional::startmonth '01'} selected="selected"{/optional} value="1">{lang::event_main::jan}</option>
									<option{optional item::aditional::startmonth '02'} selected="selected"{/optional} value="2">{lang::event_main::feb}</option>
									<option{optional item::aditional::startmonth '03'} selected="selected"{/optional} value="3">{lang::event_main::mar}</option>
									<option{optional item::aditional::startmonth '04'} selected="selected"{/optional} value="4">{lang::event_main::apr}</option>
									<option{optional item::aditional::startmonth '05'} selected="selected"{/optional} value="5">{lang::event_main::may}</option>
									<option{optional item::aditional::startmonth '06'} selected="selected"{/optional} value="6">{lang::event_main::jun}</option>
									<option{optional item::aditional::startmonth '07'} selected="selected"{/optional} value="7">{lang::event_main::jul}</option>
									<option{optional item::aditional::startmonth '08'} selected="selected"{/optional} value="8">{lang::event_main::aug}</option>
									<option{optional item::aditional::startmonth '09'} selected="selected"{/optional} value="9">{lang::event_main::sep}</option>
									<option{optional item::aditional::startmonth '10'} selected="selected"{/optional} value="10">{lang::event_main::oct}</option>
									<option{optional item::aditional::startmonth '11'} selected="selected"{/optional} value="11">{lang::event_main::nov}</option>
									<option{optional item::aditional::startmonth '12'} selected="selected"{/optional} value="12">{lang::event_main::dec}</option>
								</select>
								<span id="from_y">
								<select size="1" class="holdSelect year infinite_year" name="item[values][0][EVNSTARTYEAR]" title="from_y" id="js_start_year">
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
							</td>
						</tr>
					</table>
				</div>
			<!--
			<table><tr>
			<td class="rbig">
				<select class="endTimeCheckbox month" size="1" id="js_end_month" name="item[values][0][EVNSTARTMONTH]">
					<option value="1"{optional item::aditional::endmonth '01'} selected="selected"{/optional}>{lang::event_main::jan}</option>
					<option value="2"{optional item::aditional::endmonth '02'} selected="selected"{/optional}>{lang::event_main::feb}</option>
					<option value="3"{optional item::aditional::endmonth '03'} selected="selected"{/optional}>{lang::event_main::mar}</option>
					<option value="4"{optional item::aditional::endmonth '04'} selected="selected"{/optional}>{lang::event_main::apr}</option>
					<option value="5"{optional item::aditional::endmonth '05'} selected="selected"{/optional}>{lang::event_main::may}</option>
					<option value="6"{optional item::aditional::endmonth '06'} selected="selected"{/optional}>{lang::event_main::jun}</option>
					<option value="7"{optional item::aditional::endmonth '07'} selected="selected"{/optional}>{lang::event_main::jul}</option>
					<option value="8"{optional item::aditional::endmonth '08'} selected="selected"{/optional}>{lang::event_main::aug}</option>
					<option value="9"{optional item::aditional::endmonth '09'} selected="selected"{/optional}>{lang::event_main::sep}</option>
					<option value="10"{optional item::aditional::endmonth '10'} selected="selected"{/optional}>{lang::event_main::oct}</option>
					<option value="11"{optional item::aditional::endmonth '11'} selected="selected"{/optional}>{lang::event_main::nov}</option>
					<option value="12"{optional item::aditional::endmonth '12'} selected="selected"{/optional}>{lang::event_main::dec}</option>
				</select>
			</td>
			<td class="rbig">
				<select class="endTimeCheckbox day" size="1" id="js_end_day" name="item[values][0][EVNSTARTDAY]">
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
			</td>
			<td>
				<span id="to_y">
				<select size="1" class="holdSelect endTimeCheckbox year infinite_year" id="js_end_year" name="item[values][0][EVNSTARTYEAR]" title="to_y">
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
			</td>
			</tr></table>
			-->
		</td>
	</tr>

	<tr>
		<td colspan="2">&nbsp;</td>
	</tr>
	
	<!--
	
	<tr class="check_date_second">
		<th>
			<input type="checkbox" id="item[reminders][0][reminder][0][values][ACTIVE]" name="item[reminders][0][reminder][0][values][0][ACTIVE]" value="1"{optional item::aditional::reminders::0::ACTIVE} checked="checked"{/optional} class="checkbox" />
			<label for="item[reminders][0][reminder][0][values][0][ACTIVE]">{lang::event_detail::remind_me}</label>
		</th>
		<td>
			<table><tr>
			<td class="rbig">
				<select class="endTimeCheckbox month" size="1" name="item[reminders][0][reminder][0][values][0][M]">
					<option value="1"{optional item::aditional::endmonth '01'} selected="selected"{/optional}>{lang::event_main::jan}</option>
					<option value="2"{optional item::aditional::endmonth '02'} selected="selected"{/optional}>{lang::event_main::feb}</option>
					<option value="3"{optional item::aditional::endmonth '03'} selected="selected"{/optional}>{lang::event_main::mar}</option>
					<option value="4"{optional item::aditional::endmonth '04'} selected="selected"{/optional}>{lang::event_main::apr}</option>
					<option value="5"{optional item::aditional::endmonth '05'} selected="selected"{/optional}>{lang::event_main::may}</option>
					<option value="6"{optional item::aditional::endmonth '06'} selected="selected"{/optional}>{lang::event_main::jun}</option>
					<option value="7"{optional item::aditional::endmonth '07'} selected="selected"{/optional}>{lang::event_main::jul}</option>
					<option value="8"{optional item::aditional::endmonth '08'} selected="selected"{/optional}>{lang::event_main::aug}</option>
					<option value="9"{optional item::aditional::endmonth '09'} selected="selected"{/optional}>{lang::event_main::sep}</option>
					<option value="10"{optional item::aditional::endmonth '10'} selected="selected"{/optional}>{lang::event_main::oct}</option>
					<option value="11"{optional item::aditional::endmonth '11'} selected="selected"{/optional}>{lang::event_main::nov}</option>
					<option value="12"{optional item::aditional::endmonth '12'} selected="selected"{/optional}>{lang::event_main::dec}</option>
				</select>
			</td>
			<td class="rbig">
				<select class="endTimeCheckbox day" size="1" name="item[reminders][0][reminder][0][values][0][D]">
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
			</td>
			<td class="rbig">
				<span id="to_y">
				<select size="1" class="holdSelect endTimeCheckbox year infinite_year" id="js_reminder_year" name="item[reminders][0][reminder][0][values][0][Y]" title="to_y">
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
			</td>
			<td>
				<select size="1" name="item[reminders][0][reminder][0][values][0][T]">
					<option value="0">0:00</option>
					<option value="30">00:30</option>
					<option value="60">01:00</option>
					<option value="90">01:30</option>
					<option value="120">02:00</option>
					<option value="150">02:30</option>
					<option value="180">03:00</option>
					<option value="210">03:30</option>
					<option value="240">04:00</option>
					<option value="270">04:30</option>
					<option value="300">05:00</option>
					<option value="330">05:30</option>
					<option value="360">06:00</option>
					<option value="390">06:30</option>
					<option value="410">07:00</option>
					<option value="450">07:30</option>
					<option value="480">08:00</option>
					<option value="510">08:30</option>
					<option value="540">09:00</option>
					<option value="570">09:30</option>
					<option value="600">10:00</option>
					<option value="630">10:30</option>
					<option value="660">11:00</option>
					<option value="690">11:30</option>
					<option value="720">12:00</option>
					<option value="750">12:30</option>
					<option value="780">13:00</option>
					<option value="810">13:30</option>
					<option value="840">14:00</option>
					<option value="870">14:30</option>
					<option value="900">15:00</option>
					<option value="930">15:30</option>
					<option value="960">16:00</option>
					<option value="990">16:30</option>
					<option value="1020">17:00</option>
					<option value="1050">17:30</option>
					<option value="1080">18:00</option>
					<option value="1110">18:30</option>
					<option value="1140">19:00</option>
					<option value="1170">19:30</option>
					<option value="1200">20:00</option>
					<option value="1230">20:30</option>
					<option value="1260">21:00</option>
					<option value="1290">21:30</option>
					<option value="1320">22:30</option>
					<option value="1350">22:30</option>
					<option value="1380">23:30</option>
				</select>
			</td>
			</tr>
			</table>
		</td>
	</tr>
	
	-->
	{optional item::aditional::reminder::id}<input type="hidden" name="item[reminders][0][reminder][0][values][0][ID]" value="{item::aditional::reminder::id}"/>{/optional}
						
	<tr>
	
		<th><label for="item[reminders][0][reminder][0][values][0][ACTIVE]"><input type="checkbox" id="item[reminders][0][reminder][0][values][ACTIVE]" name="item[reminders][0][reminder][0][values][0][ACTIVE]" value="1"{optional item::aditional::reminder::RMNTIME} checked="checked"{/optional} class="checkbox" /> {lang::event_detail::remind_me}</label></th>
		<td>
			<table class="rbig datePickerBox">
				<tr>
					<td>
						<script>DateInput('datePicker_reminder', true{optional item::aditional::reminder::hr::day},"DD/MM/YYYY","{item::aditional::reminder::hr::day}/{item::aditional::reminder::hr::month}/{optional item::aditional::reminder::hr::year}{item::aditional::reminder::hr::year}{/optional}"{/optional});</script>
					</td>
					<td>
						<input type="text" name="item[reminders][0][reminder][0][values][0][HOURS]" class="inp_text" style="width:50px" value="{item::aditional::reminder::hr::hour ''}"/>:<input type="text" name="item[reminders][0][reminder][0][values][0][MINUTES]" class="inp_text" style="width:50px" value="{item::aditional::reminder::hr::minute ''}"/>
					</td>
					<td></td>
				</tr>
			</table>
		</td>
	</tr>

	<tr>
		<td colspan="2">&nbsp;</td>
	</tr>

	<tr>
		<th colspan="2">{lang::event_detail::notes}</th>
	</tr>
	<tr>
		<td colspan="2">
			{anchor::taskNote}
		</td>
	</tr>

    {optional item::aditional::attachments}
	<tr>
		<td colspan="2">&nbsp;</td>
	</tr>
	<tr>
		<th colspan="2">{lang::mail_compose::attachments}</th>
	</tr>
	{dynamic item::aditional::attachments}
	<tr>
		<td colspan="2" class="attachmentLinkBox"><a href="{.*::ATTURL}" target="_blank" class="clear {htmlspecialchars *::extension}">{.*::ATTDESC} ({.*::ATTSIZE})</a></td>
	</tr>
	{/dynamic}
	{/optional}
</table>

<label class="sharing clear" for="item[values][0][EVNSHARETYPE]">
    <input type="checkbox" name="item[values][0][EVNSHARETYPE]" id="item[values][0][EVNSHARETYPE]" {optional item::EVNSHARETYPE 'C'} checked="checked"{/optional}{!optional item::EVNSHARETYPE 'C'}{optional item::EVNSHARETYPE 'P'} checked="checked"{/optional}{/optional} class="checkboxFix"/>
	{lang::event_detail::private}
</label>

</div>


{include ../basic/skin/fresh/tpl/_toolbar.bottom_groupware.detail.tpl}