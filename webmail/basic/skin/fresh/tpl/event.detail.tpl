{include ../basic/skin/fresh/tpl/_toolbar.top_groupware.detail.tpl}

<div class="body form">

{optional item::EVN_ID}
	<input type="hidden" name="item[values][0][EVN_ID]" value="{item::EVN_ID ''}" />
	<input type="hidden" name="items[{item::id}]"/>
	<h2>{lang::event_detail::event}</h2>
{/optional}

{!optional item::EVN_ID}
	<h2>{lang::event_main::add}</h2>
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
		<th>{lang::event_detail::location}</th>
		<td>
			<div class="inp_text">
			<input type="text" class="inp_text" name="item[values][0][EVNLOCATION]" class="w2"{optional item::EVNLOCATION} value="{htmlspecialchars item::EVNLOCATION}"{/optional}/>
			</div>
		</td>
	</tr>
	<!-- OBSOLATE-
	<tr>
		<th>{lang::event_detail::label}</th>
		<td>
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
	-->
	<tr>
		<th>{lang::event_detail::tags}</th>
		<td>
			<div class="inp_text">
			<input type="text" class="inp_text" class="w2" name="item[values][0][EVNTYPE]" {optional item::EVNTYPE} value="{htmlspecialchars item::EVNTYPE}"{/optional}/>
			</div>
		</td>
	</tr>

	<tr>
		<td colspan="2">&nbsp;</td>
	</tr>

	<tr class="check_date_first select_space">
		<th>{lang::event_detail::from}</th>
		<td>
			<table>
			<tr>
			<td class="rbig datePickerBox">
				
				<div>
					<script>DateInput('datePicker_fromDate', true{optional item::aditional::startday},"DD/MM/YYYY","{item::aditional::startday}/{item::aditional::startmonth}/{dynamic item::aditional::startyears}{optional *::s}{.*::y}{/optional}{/dynamic}"{/optional});</script>
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
			</td>
			<td class="rbig lbig">
				<select size="1" name="item[values][0][EVNSTARTHOUR]" id="js_start_hour" class="hours">
					<option value="0"{optional item::aditional::starthour '00'} selected="selected"{/optional}>{optional item::timeformat}00{/optional}{!optional item::timeformat}12am{/optional}</option>
					<option value="1"{optional item::aditional::starthour '01'} selected="selected"{/optional}>01{!optional item::timeformat}am{/optional}</option>
					<option value="2"{optional item::aditional::starthour '02'} selected="selected"{/optional}>02{!optional item::timeformat}am{/optional}</option>
					<option value="3"{optional item::aditional::starthour '03'} selected="selected"{/optional}>03{!optional item::timeformat}am{/optional}</option>
					<option value="4"{optional item::aditional::starthour '04'} selected="selected"{/optional}>04{!optional item::timeformat}am{/optional}</option>
					<option value="5"{optional item::aditional::starthour '05'} selected="selected"{/optional}>05{!optional item::timeformat}am{/optional}</option>
					<option value="6"{optional item::aditional::starthour '06'} selected="selected"{/optional}>06{!optional item::timeformat}am{/optional}</option>
					<option value="7"{optional item::aditional::starthour '07'} selected="selected"{/optional}>07{!optional item::timeformat}am{/optional}</option>
					<option value="8"{optional item::aditional::starthour '08'} selected="selected"{/optional}>08{!optional item::timeformat}am{/optional}</option>
					<option value="9"{optional item::aditional::starthour '09'} selected="selected"{/optional}>09{!optional item::timeformat}am{/optional}</option>
					<option value="10"{optional item::aditional::starthour '10'} selected="selected"{/optional}>10{!optional item::timeformat}am{/optional}</option>
					<option value="11"{optional item::aditional::starthour '11'} selected="selected"{/optional}>11{!optional item::timeformat}am{/optional}</option>
					<option value="12"{optional item::aditional::starthour '12'} selected="selected"{/optional}>12{!optional item::timeformat}pm{/optional}</option>
					<option value="13"{optional item::aditional::starthour '13'} selected="selected"{/optional}>{optional item::timeformat}13{/optional}{!optional item::timeformat}01pm{/optional}</option>
					<option value="14"{optional item::aditional::starthour '14'} selected="selected"{/optional}>{optional item::timeformat}14{/optional}{!optional item::timeformat}02pm{/optional}</option>
					<option value="15"{optional item::aditional::starthour '15'} selected="selected"{/optional}>{optional item::timeformat}15{/optional}{!optional item::timeformat}03pm{/optional}</option>
					<option value="16"{optional item::aditional::starthour '16'} selected="selected"{/optional}>{optional item::timeformat}16{/optional}{!optional item::timeformat}04pm{/optional}</option>
					<option value="17"{optional item::aditional::starthour '17'} selected="selected"{/optional}>{optional item::timeformat}17{/optional}{!optional item::timeformat}05pm{/optional}</option>
					<option value="18"{optional item::aditional::starthour '18'} selected="selected"{/optional}>{optional item::timeformat}18{/optional}{!optional item::timeformat}06pm{/optional}</option>
					<option value="19"{optional item::aditional::starthour '19'} selected="selected"{/optional}>{optional item::timeformat}19{/optional}{!optional item::timeformat}07pm{/optional}</option>
					<option value="20"{optional item::aditional::starthour '20'} selected="selected"{/optional}>{optional item::timeformat}20{/optional}{!optional item::timeformat}08pm{/optional}</option>
					<option value="21"{optional item::aditional::starthour '21'} selected="selected"{/optional}>{optional item::timeformat}21{/optional}{!optional item::timeformat}09pm{/optional}</option>
					<option value="22"{optional item::aditional::starthour '22'} selected="selected"{/optional}>{optional item::timeformat}22{/optional}{!optional item::timeformat}10pm{/optional}</option>
					<option value="23"{optional item::aditional::starthour '23'} selected="selected"{/optional}>{optional item::timeformat}23{/optional}{!optional item::timeformat}11pm{/optional}</option>
				</select>
			</td>
			<td>
				<select size="1" name="item[values][0][EVNSTARTMINUTE]" id="js_start_minute" class="minutes">
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
			</tr></table>
		</td>
	</tr>
	<tr>
		<td colspan="2"><div class="spacer"></div></td>
	</tr>
	<tr class="check_date_second select_space">
		<th>{lang::event_detail::to}</th>
		<td>
			<table><tr>
			<td class="rbig datePickerBox">
				<div>
					<script>DateInput('datePicker_toDate', true{optional item::aditional::endday},"DD/MM/YYYY","{item::aditional::endday}/{item::aditional::endmonth}/{dynamic item::aditional::endyears}{optional *::s}{.*::y}{/optional}{/dynamic}"{/optional});</script>
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
				</div>
			</td>
			<td class="rbig lbig">
				<select size="1" name="item[values][0][EVNENDHOUR]" id="js_end_hour" class="hours">
					<option value="0"{optional item::aditional::endhour '00'} selected="selected"{/optional}>{optional item::timeformat}00{/optional}{!optional item::timeformat}12am{/optional}</option>
					<option value="1"{optional item::aditional::endhour '01'} selected="selected"{/optional}>01{!optional item::timeformat}am{/optional}</option>
					<option value="2"{optional item::aditional::endhour '02'} selected="selected"{/optional}>02{!optional item::timeformat}am{/optional}</option>
					<option value="3"{optional item::aditional::endhour '03'} selected="selected"{/optional}>03{!optional item::timeformat}am{/optional}</option>
					<option value="4"{optional item::aditional::endhour '04'} selected="selected"{/optional}>04{!optional item::timeformat}am{/optional}</option>
					<option value="5"{optional item::aditional::endhour '05'} selected="selected"{/optional}>05{!optional item::timeformat}am{/optional}</option>
					<option value="6"{optional item::aditional::endhour '06'} selected="selected"{/optional}>06{!optional item::timeformat}am{/optional}</option>
					<option value="7"{optional item::aditional::endhour '07'} selected="selected"{/optional}>07{!optional item::timeformat}am{/optional}</option>
					<option value="8"{optional item::aditional::endhour '08'} selected="selected"{/optional}>08{!optional item::timeformat}am{/optional}</option>
					<option value="9"{optional item::aditional::endhour '09'} selected="selected"{/optional}>09{!optional item::timeformat}am{/optional}</option>
					<option value="10"{optional item::aditional::endhour '10'} selected="selected"{/optional}>10{!optional item::timeformat}am{/optional}</option>
					<option value="11"{optional item::aditional::endhour '11'} selected="selected"{/optional}>11{!optional item::timeformat}am{/optional}</option>
					<option value="12"{optional item::aditional::endhour '12'} selected="selected"{/optional}>12{!optional item::timeformat}pm{/optional}</option>
					<option value="13"{optional item::aditional::endhour '13'} selected="selected"{/optional}>{optional item::timeformat}13{/optional}{!optional item::timeformat}01pm{/optional}</option>
					<option value="14"{optional item::aditional::endhour '14'} selected="selected"{/optional}>{optional item::timeformat}14{/optional}{!optional item::timeformat}02pm{/optional}</option>
					<option value="15"{optional item::aditional::endhour '15'} selected="selected"{/optional}>{optional item::timeformat}15{/optional}{!optional item::timeformat}03pm{/optional}</option>
					<option value="16"{optional item::aditional::endhour '16'} selected="selected"{/optional}>{optional item::timeformat}16{/optional}{!optional item::timeformat}04pm{/optional}</option>
					<option value="17"{optional item::aditional::endhour '17'} selected="selected"{/optional}>{optional item::timeformat}17{/optional}{!optional item::timeformat}05pm{/optional}</option>
					<option value="18"{optional item::aditional::endhour '18'} selected="selected"{/optional}>{optional item::timeformat}18{/optional}{!optional item::timeformat}06pm{/optional}</option>
					<option value="19"{optional item::aditional::endhour '19'} selected="selected"{/optional}>{optional item::timeformat}19{/optional}{!optional item::timeformat}07pm{/optional}</option>
					<option value="20"{optional item::aditional::endhour '20'} selected="selected"{/optional}>{optional item::timeformat}20{/optional}{!optional item::timeformat}08pm{/optional}</option>
					<option value="21"{optional item::aditional::endhour '21'} selected="selected"{/optional}>{optional item::timeformat}21{/optional}{!optional item::timeformat}09pm{/optional}</option>
					<option value="22"{optional item::aditional::endhour '22'} selected="selected"{/optional}>{optional item::timeformat}22{/optional}{!optional item::timeformat}10pm{/optional}</option>
					<option value="23"{optional item::aditional::endhour '23'} selected="selected"{/optional}>{optional item::timeformat}23{/optional}{!optional item::timeformat}11pm{/optional}</option>
				</select>
			</td>
			<td>
				<select size="1" name="item[values][0][EVNENDMINUTE]" id="js_end_minute" class="minutes">
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
			</tr></table>
		</td>
	</tr>
	
	<tr>
		<td colspan="2">&nbsp;</td>
	</tr>
	
	<tr>
		<th></th>
		<td>
			<input type="checkbox" id="item[values][0][EVNALLDAY]" name="item[values][0][EVNALLDAY]" value="1"{optional item::aditional::allday} checked="checked"{/optional} class="checkbox" />
			<label for="item[values][0][EVNALLDAY]">{lang::event_detail::allday}</label>
		</td>
	</tr>

	<tr>
		<td colspan="2">&nbsp;</td>
	</tr>
	
	<tr>
		<th><label for="item[reminders][0][reminder][0][values][0][ACTIVE]">{lang::event_detail::remind_me}</label></th>
		<td>
			<table>
				<tr>
					<td>
						{optional item::aditional::reminders::0::ID}<input type="hidden" name="item[reminders][0][reminder][0][values][0][ID]" value="{item::aditional::reminders::0::ID}"/>{/optional}
						<input type="checkbox" id="item[reminders][0][reminder][0][values][ACTIVE]" name="item[reminders][0][reminder][0][values][0][ACTIVE]" value="1"{optional item::aditional::reminders::0::ACTIVE} checked="checked"{/optional} class="checkbox" />
					</td>
					<td>
						&nbsp;
						<input type="text" name="item[reminders][0][reminder][0][values][0][BEFORE]" value="{item::aditional::reminders::0::BEFORE '0'}" class="inp_text" style="width:30px;"/>
					</td>
					<td>
						&nbsp;
						<select size="1" name="item[reminders][0][reminder][0][values][0][UNIT]">
							<option value="m"{optional item::aditional::reminders::0::UNIT 'm'} selected="selected"{/optional}>{lang::event_detail::minutes}</option>
							<option value="h"{optional item::aditional::reminders::0::UNIT 'h'} selected="selected"{/optional}>{lang::event_detail::hours}</option>
							<option value="d"{optional item::aditional::reminders::0::UNIT 'd'} selected="selected"{/optional}>{lang::event_detail::days}</option>
						</select>
					</td>
					<td>&nbsp;{lang::event_detail::before}</td>
				</tr>
			</table>
		</td>
	</tr>


<!-- REPEAT PART -->
	<tr>
		<th style="vertical-align:top">
			<div class="noJSHide">{lang::event_detail::repeat}</div>
			<div id="repeatingDefaults"></div>
		</th>
		<td>
			<div class="noJSHide">
			<table id="repeating_table">
				<tr>
					<td>
						<input id="labelid_1" type="radio" value="0" name="item[recurrences][0][recurrence][0][type]" class="liveRadio mainRadio defaultItem" rel=""/> <label for="labelid_1">{lang::event_detail::no_repeating}</label><br />
						<input id="labelid_2" {optional item::rcr::type '1'}checked="checked"{/optional} type="radio" value="1" name="item[recurrences][0][recurrence][0][type]" class="liveRadio mainRadio" rel="relDaily"/> <label for="labelid_2">{lang::event_detail::daily}</label><br />
						<input id="labelid_3" {optional item::rcr::type '2'}checked="checked"{/optional} type="radio" value="2" name="item[recurrences][0][recurrence][0][type]" class="liveRadio mainRadio" rel="relWeekly"/> <label for="labelid_3">{lang::event_detail::weekly}</label><br />
						<input id="labelid_4" {optional item::rcr::type '3'}checked="checked"{/optional} type="radio" value="3" name="item[recurrences][0][recurrence][0][type]" class="liveRadio mainRadio relMonthly1" rel="relMonthly"/> <label for="labelid_4">{lang::event_detail::monthly}</label><br />
						<input id="labelid_5" {optional item::rcr::type '4'}checked="checked"{/optional} type="radio" value="4" name="item[recurrences][0][recurrence][0][type]" class="liveRadio mainRadio" rel="relYearly"/> <label for="labelid_5">{lang::event_detail::yearly}</label><br />
					</td>
					<td colspan="2">
						<!-- Daily -->
						<div id="repeat_1" class="liveBox relDaily_box">
							<input id="labelid_6"{optional item::rcr::dayrepetition} checked="checked"{/optional} type="radio" value="0" name="item[recurrencesvalues][daily][type]" class="liveItem liveRadio relDaily relDaily1 defaultItem" rel="relDaily1"/> <label for="labelid_6">{lang::event_detail::every}</label> <input class="inp_text liveItem relDaily1" type="text" name="item[recurrencesvalues][daily][rcrdayrepetition]" style="width:30px;" value="{item::rcr::dayrepetition '1'}"/> {lang::event_detail::days}<br />
							<input id="labelid_7" type="radio" value="1" name="item[recurrencesvalues][daily][type]" class="liveItem liveRadio relDaily relDaily1" rel="relDaily"/> <label for="labelid_7">{lang::event_detail::every_workday}</label>
						</div>
						<!-- Weekly -->
						<div id="repeat_2" class="liveBox relWeekly_box">
							<table>
								<tr>
									<td colspan="4">
										{lang::event_detail::recur_every} <input class="inp_text liveItem relWeekly" type="text" name="item[recurrencesvalues][weekly][rcrweekrepetition]" style="width:30px;" value="{item::rcr::weekrepetition '1'}"/> {lang::event_detail::weeks} {lang::event_detail::on}:
									</td>
								</tr>
								<tr>
									<td>
										<input id="labelid_8"{optional item::rcr::weekdays::1} checked="checked"{/optional} type="checkbox" value="1" name="item[recurrencesvalues][weekly][rcrdayofweeknumber][]" class="liveItem relWeekly"/> <label for="labelid_8">{lang::event_detail::monday}</label>
									</td>
									<td>
										<input id="labelid_9"{optional item::rcr::weekdays::3} checked="checked"{/optional} type="checkbox" value="3" name="item[recurrencesvalues][weekly][rcrdayofweeknumber][]" class="liveItem relWeekly"/> <label for="labelid_9">{lang::event_detail::wednesday}</label>
									</td>
									<td>
										<input id="labelid_10"{optional item::rcr::weekdays::5} checked="checked"{/optional} type="checkbox" value="5" name="item[recurrencesvalues][weekly][rcrdayofweeknumber][]" class="liveItem relWeekly"/> <label for="labelid_10">{lang::event_detail::friday}</label>
									</td>
									<td>
										<input id="labelid_11"{optional item::rcr::weekdays::0} checked="checked"{/optional} type="checkbox" value="0" name="item[recurrencesvalues][weekly][rcrdayofweeknumber][]" class="liveItem relWeekly"/> <label for="labelid_11">{lang::event_detail::sunday}</label>
									</td>
								</tr>
								<tr>
									<td>
										<input id="labelid_12"{optional item::rcr::weekdays::2} checked="checked"{/optional} type="checkbox" value="2" name="item[recurrencesvalues][weekly][rcrdayofweeknumber][]" class="liveItem relWeekly"/> <label for="labelid_12">{lang::event_detail::tuesday}</label>
									</td>
									<td>
										<input id="labelid_13"{optional item::rcr::weekdays::4} checked="checked"{/optional} type="checkbox" value="4" name="item[recurrencesvalues][weekly][rcrdayofweeknumber][]" class="liveItem relWeekly"/> <label for="labelid_13">{lang::event_detail::thursday}</label>
									</td>
									<td>
										<input id="labelid_14"{optional item::rcr::weekdays::6} checked="checked"{/optional} type="checkbox" value="6" name="item[recurrencesvalues][weekly][rcrdayofweeknumber][]" class="liveItem relWeekly"/> <label for="labelid_14">{lang::event_detail::saturday}</label>
									</td>
									<td></td>
								</tr>
							</table>
						</div>
						<!-- Monthly -->
						<div id="repeat_3" class="liveBox relMonthly_box">
							<input id="labelid_15"{optional item::rcr::innertype '1'}{optional item::rcr::type '3'} checked="checked"{/optional}{/optional} type="radio" value="1" name="item[recurrencesvalues][monthly][type]" class="liveRadio relMonthly relMonthly1 relMonthly2 defaultItem" rel="relMonthly1"/> <label for="labelid_15">{lang::event_detail::day}</label> <input class="inp_text liveItem relMonthly1" type="text" name="item[recurrencesvalues][monthly][rcrdayrepetition]" style="width:30px;" value="{item::rcr::dayrepetition ''}"/> {lang::event_detail::of_every} <input class="inp_text liveItem relMonthly1" type="text" name="item[recurrencesvalues][monthly][rcrmonthrepetition]" style="width:30px;" value="{item::rcr::monthrepetition ''}"/> {lang::event_detail::months}<br />
							<input id="labelid_16"{optional item::rcr::innertype '2'}{optional item::rcr::type '3'} checked="checked"{/optional}{/optional} type="radio" value="2" name="item[recurrencesvalues][monthly][type]" class="liveRadio relMonthly1 relMonthly2" rel="relMonthly2"/> <label for="labelid_16">{lang::event_detail::the}</label>
								<select name="item[recurrencesvalues][monthly][rcrweekofmonthnumber]" size="1" class="liveItem relMonthly2">
									<option{optional item::rcr::weekofmonthnumber '1'} selected="selected"{/optional} value="1">{lang::event_detail::first}</option>
									<option{optional item::rcr::weekofmonthnumber '2'} selected="selected"{/optional} value="2">{lang::event_detail::second}</option>
									<option{optional item::rcr::weekofmonthnumber '3'} selected="selected"{/optional} value="3">{lang::event_detail::third}</option>
									<option{optional item::rcr::weekofmonthnumber '4'} selected="selected"{/optional} value="4">{lang::event_detail::fourth}</option>
									<option{optional item::rcr::weekofmonthnumber '-1'} selected="selected"{/optional} value="-1">{lang::event_detail::last}</option>
								</select>
								<select name="item[recurrencesvalues][monthly][rcrdayofweeknumber]" class="liveItem relMonthly2">
									<option{optional item::rcr::dayofweeknumber '127'} selected="selected"{/optional} value="127">{lang::event_detail::week}</option>
									<option{optional item::rcr::dayofweeknumber '62'} selected="selected"{/optional} value="62">{lang::event_detail::work_week}</option>
									<option{optional item::rcr::dayofweeknumber '65'} selected="selected"{/optional} value="65">{lang::event_detail::weekend}</option>
									<option{optional item::rcr::dayofweeknumber '1'} selected="selected"{/optional} value="1">{lang::event_detail::sunday}</option>
									<option{optional item::rcr::dayofweeknumber '2'} selected="selected"{/optional} value="2">{lang::event_detail::monday}</option>
									<option{optional item::rcr::dayofweeknumber '4'} selected="selected"{/optional} value="4">{lang::event_detail::tuesday}</option>
									<option{optional item::rcr::dayofweeknumber '8'} selected="selected"{/optional} value="8">{lang::event_detail::wednesday}</option>
									<option{optional item::rcr::dayofweeknumber '16'} selected="selected"{/optional} value="16">{lang::event_detail::thursday}</option>
									<option{optional item::rcr::dayofweeknumber '32'} selected="selected"{/optional} value="32">{lang::event_detail::friday}</option>
									<option{optional item::rcr::dayofweeknumber '64'} selected="selected"{/optional} value="64">{lang::event_detail::saturday}</option>
								</select>
								{lang::event_detail::of_every} <input class="inp_text liveItem relMonthly2" type="text" style="width:30px;" name="item[recurrencesvalues][monthly][rcrmonthrepetition]" value="{item::rcr::monthrepetition ''}"/> {lang::event_detail::months}
						</div>
						<!-- Yearly -->
						<div id="repeat_4" class="liveBox relYearly_box">
							<input id="labelid_17"{optional item::rcr::innertype '1'}{optional item::rcr::type '4'} checked="checked"{/optional}{/optional} type="radio" value="0" name="item[recurrencesvalues][yearly][type]" class="liveRadio relYearly relYearly1 relYearly2 defaultItem" rel="relYearly1"/> <label for="labelid_17">{lang::event_detail::every}</label>
								<select name="item[recurrencesvalues][yearly][rcryearrepetition]" size="1" class="liveItem relYearly1">
									<option{optional item::rcr::yearrepetition '1'} selected="selected"{/optional} value="1">1</option>
									<option{optional item::rcr::yearrepetition '2'} selected="selected"{/optional} value="2">2</option>
									<option{optional item::rcr::yearrepetition '3'} selected="selected"{/optional} value="3">3</option>
									<option{optional item::rcr::yearrepetition '4'} selected="selected"{/optional} value="4">4</option>
									<option{optional item::rcr::yearrepetition '5'} selected="selected"{/optional} value="5">5</option>
								</select>
								{lang::event_detail::years}<br />
							<input id="labelid_18"{optional item::rcr::innertype '2'}{optional item::rcr::type '4'} checked="checked"{/optional}{/optional} type="radio" value="0" name="item[recurrencesvalues][yearly][type]" class="liveRadio relYearly relYearly1 relYearly2" rel="relYearly2"/> <label for="labelid_18">{lang::event_detail::the}</label>
								<select name="item[recurrencesvalues][yearly][rcrweekofmonthnumber]" size="1" class="liveItem relYearly2">
									<option{optional item::rcr::weekofmonthnumber '1'} selected="selected"{/optional} value="1">{lang::event_detail::first}</option>
									<option{optional item::rcr::weekofmonthnumber '2'} selected="selected"{/optional} value="2">{lang::event_detail::second}</option>
									<option{optional item::rcr::weekofmonthnumber '3'} selected="selected"{/optional} value="3">{lang::event_detail::third}</option>
									<option{optional item::rcr::weekofmonthnumber '4'} selected="selected"{/optional} value="4">{lang::event_detail::fourth}</option>
									<option{optional item::rcr::weekofmonthnumber '-1'} selected="selected"{/optional} value="-1">{lang::event_detail::last}</option>
								</select>
								<select name="item[recurrencesvalues][yearly][rcrdayofweeknumber]" size="1" class="liveItem relYearly2">
									<option{optional item::rcr::dayofweeknumber '127'} selected="selected"{/optional} value="127">{lang::event_detail::week}</option>
									<option{optional item::rcr::dayofweeknumber '62'} selected="selected"{/optional} value="62">{lang::event_detail::work_week}</option>
									<option{optional item::rcr::dayofweeknumber '65'} selected="selected"{/optional} value="65">{lang::event_detail::weekend}</option>
									<option{optional item::rcr::dayofweeknumber '1'} selected="selected"{/optional} value="1">{lang::event_detail::sunday}</option>
									<option{optional item::rcr::dayofweeknumber '2'} selected="selected"{/optional} value="2">{lang::event_detail::monday}</option>
									<option{optional item::rcr::dayofweeknumber '4'} selected="selected"{/optional} value="4">{lang::event_detail::tuesday}</option>
									<option{optional item::rcr::dayofweeknumber '8'} selected="selected"{/optional} value="8">{lang::event_detail::wednesday}</option>
									<option{optional item::rcr::dayofweeknumber '16'} selected="selected"{/optional} value="16">{lang::event_detail::thursday}</option>
									<option{optional item::rcr::dayofweeknumber '32'} selected="selected"{/optional} value="32">{lang::event_detail::friday}</option>
									<option{optional item::rcr::dayofweeknumber '64'} selected="selected"{/optional} value="64">{lang::event_detail::saturday}</option>
								</select>
								{lang::event_detail::of}
								<select name="item[recurrencesvalues][yearly][rcrmonthofyearnumber]" size="1" class="liveItem relYearly2">
									<option{optional item::rcr::monthofyearnumber '1'} selected="selected"{/optional} value="1">{lang::event_main::jan}</option>
									<option{optional item::rcr::monthofyearnumber '2'} selected="selected"{/optional} value="2">{lang::event_main::feb}</option>
									<option{optional item::rcr::monthofyearnumber '3'} selected="selected"{/optional} value="3">{lang::event_main::mar}</option>
									<option{optional item::rcr::monthofyearnumber '4'} selected="selected"{/optional} value="4">{lang::event_main::apr}</option>
									<option{optional item::rcr::monthofyearnumber '5'} selected="selected"{/optional} value="5">{lang::event_main::may}</option>
									<option{optional item::rcr::monthofyearnumber '6'} selected="selected"{/optional} value="6">{lang::event_main::jun}</option>
									<option{optional item::rcr::monthofyearnumber '7'} selected="selected"{/optional} value="7">{lang::event_main::jul}</option>
									<option{optional item::rcr::monthofyearnumber '8'} selected="selected"{/optional} value="8">{lang::event_main::aug}</option>
									<option{optional item::rcr::monthofyearnumber '9'} selected="selected"{/optional} value="9">{lang::event_main::sep}</option>
									<option{optional item::rcr::monthofyearnumber '10'} selected="selected"{/optional} value="10">{lang::event_main::oct}</option>
									<option{optional item::rcr::monthofyearnumber '11'} selected="selected"{/optional} value="11">{lang::event_main::nov}</option>
									<option{optional item::rcr::monthofyearnumber '12'} selected="selected"{/optional} value="12">{lang::event_main::dec}</option>
								</select>
						</div>
						<!-- -->
					</td>
				</tr>
				<!-- end date -->
				<tr>
					<th colspan="2">{lang::event_detail::end_date}</th>
					<td></td>
				</tr>
				<tr>
					<td><input id="labelid_19" type="radio" value="0" name="item[recurrencesvalues][enddate][type]" class="liveRadio2 defaultItem"/> <label for="labelid_19">{lang::event_detail::no_end_date}</label></td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td><input raw="{htmlspecialchars item::rcr::enddate_raw}" strval="{htmlspecialchars item::rcr::enddate_strval}" id="labelid_20"{optional item::rcr::enddate_converted} checked="checked"{/optional} type="radio" value="1" name="item[recurrencesvalues][enddate][type]" class="liveRadio2" rel="relEndDate1"/> <label for="labelid_20">{lang::event_detail::until}</label></td>
					<td colspan="2">
					<!--
						<input class="inp_text liveItem2 relEndDate1" type="text" name="item[recurrencesvalues][enddate][rcrenddate][month]" style="width:30px;"/>
						<input class="inp_text liveItem2 relEndDate1" type="text" name="item[recurrencesvalues][enddate][rcrenddate][day]" style="width:30px;"/>
						<input class="inp_text liveItem2 relEndDate1" type="text" name="item[recurrencesvalues][enddate][rcrenddate][year]" style="width:30px;"/>
					-->
						<script>DateInput('datePicker_endDate', true{optional item::rcr::enddate_converted},"DD/MM/YYYY","{item::rcr::enddate_converted}"{/optional});</script>
					</td>
				</tr>
				<tr>
					<td><input id="labelid_21"{optional item::rcr::count} checked="checked"{/optional} type="radio" value="2" name="item[recurrencesvalues][enddate][type]" class="liveRadio2" rel="relEndDate2"/> <label for="labelid_21">{lang::event_detail::count}</label></td>
					<td colspan="2"><input class="inp_text liveItem2 relEndDate2" type="text" name="item[recurrencesvalues][enddate][rcrcount]" style="width:30px;" value="{item::rcr::count ''}"/> {lang::event_detail::times}</td>
				</tr>
				<!-- -->
			</table>
			</div>
		</td>
	</tr>
<!-- END OF REPEAT -->


	<tr>
		<td colspan="2">&nbsp;</td>
	</tr>

	<tr>
		<th colspan="2">{lang::event_detail::notes}</th>
	</tr>
	<tr>
		<td colspan="2">
			{anchor::eventNote}
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
		<td colspan="2" class="attachmentLinkBox"><a href="{.*::ATTURL}" target="_blank" class="ico_{htmlspecialchars *::extension}">{.*::ATTDESC} ({.*::ATTSIZE})</a></td>
	</tr>
	{/dynamic}
	{/optional}
	
</table>

	<label class="sharing clear" for="item[values][0][EVNSHARETYPE]">
		<input type="checkbox" name="item[values][0][EVNSHARETYPE]" {optional item::EVNSHARETYPE 'C'} checked="checked"{/optional}{!optional item::EVNSHARETYPE 'C'}{optional item::EVNSHARETYPE 'P'} checked="checked"{/optional}{/optional} class="checkboxFix" value="P"/>
		{lang::event_detail::private}
	</label>

</div>

{include ../basic/skin/fresh/tpl/_toolbar.bottom_groupware.detail.tpl}