// ==UserScript==
// @name        LifeMilesScan
// @namespace   http://www.lifemiles.com
// @description Does it all
// @include     https://www.lifemiles.com/eng/use/red/dynredpar.aspx
// @include     https://www.lifemiles.com/eng/use/red/dynredflts.aspx
// @include     https://www.lifemiles.com/eng/use/red/dynreddatessocae.aspx
// @version     1
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @grant       GM_openInTab
// ==/UserScript==
// Initialize interactive data entry 
GM_registerMenuCommand('Change # of weeks', changeCount);
GM_registerMenuCommand('Store Parameters', storeParameters);
GM_registerMenuCommand('Set exact time', setTime);
function changeCount() {
  var newCount = prompt('How many weeks?');
  GM_setValue('maxCount', newCount);
};
function setTime() {
  var exactTimeText = prompt('Enter exact departure time, format hhmm');
  GM_setValue('starttime', exactTimeText);
  var exactTime = parseInt(exactTimeText) + 100;
  if ((exactTime % 100) == 0) {
    document.getElementById('horaSalida') .value = exactTime;
  } else {
    exactTimeText = exactTimeText.substr(0, 2) + ':' + exactTimeText.substr(2, 2);
    var exactTimeText2 = ('0000' + exactTime) .slice( - 4);
    document.getElementById('horaSalida') .options.add(new Option(exactTimeText, exactTimeText2, false, true));
  }
};
function storeParameters() {
  GM_setValue('origin', document.getElementById('cmbOrigen') .value);
  GM_setValue('oriText', document.getElementById('textOrigen') .value);
  GM_setValue('destination', document.getElementById('cmbDestino') .value);
  GM_setValue('destiText', document.getElementById('textDestino') .value);
  GM_setValue('startdate', document.getElementById('fechaSalida') .value);
  GM_setValue('class', document.getElementById('cmbCabin') .selectedIndex);
  var exactTimeText = ('0000' + (parseInt(document.getElementById('horaSalida') .value) - 100)) .slice( - 4);
  GM_setValue('starttime', exactTimeText);
  GM_setValue('paxNum', document.getElementById('CmbPaxNum') .value);
  GM_setValue('airline', document.getElementById('hidCSocio') .value);
  GM_setValue('option', document.getElementById('cmbSocAe') .selectedIndex);
}
if (window.location.href == 'https://www.lifemiles.com/eng/use/red/dynredpar.aspx') {
  document.getElementById('divSubmitOn') .childNodes[1].href = 'javascript:document.getElementById(\'requirementsform\').submit();';
  document.getElementById('horaSalida') .innerHTML = '<option value="0000" selected="selected">Departure Time</option><option value="0200">01:00</option><option value="0300">02:00</option><option value="0400">03:00</option><option value="0500">04:00</option><option value="0600">05:00</option><option value="0700">06:00</option><option value="0800">07:00</option><option value="0900">08:00</option><option value="1000">09:00</option><option value="1100">10:00</option><option value="1200">11:00</option><option value="1300">12:00</option><option value="1400">13:00</option><option value="1500">14:00</option><option value="1600">15:00</option><option value="1700">16:00</option><option value="1800">17:00</option><option value="1900">18:00</option><option value="2000">19:00</option><option value="2100">20:00</option><option value="2200">21:00</option><option value="2300">22:00</option><option value="2400">23:00</option>';
  GM_setValue('count', 0);
  console.log('waiting ...');
  var delayedFunc = function () {
    console.log('in delayed function');
    if ((typeof document.getElementById('textOrigen') == 'object') && (document.getElementById('textOrigen') .value.length > 0)) {
      var optionSelected = GM_getValue('option', 2);
      var airline = GM_getValue('airline', 'SS');
      document.getElementById('cmbSocAe') .options[optionSelected].selected = true;
      document.getElementById('hidCSocio') .value = airline;
      document.getElementById('itiTypeRoundTrip') .checked = false;
      document.getElementById('itiTypeOneWay') .checked = true;
      document.getElementById('onep1') .hidden = true;
      var origin = GM_getValue('origin', 'SAW');
      var oriText = GM_getValue('oriText', 'Sahiba Goekcen (SAW), United States');
      var destination = GM_getValue('destination', 'NYC');
      var destiText = GM_getValue('destiText', 'New York All Airports (NYC), United States');
      document.getElementById('cmbOrigen') .options.add(new Option(oriText, origin, false, true));
      document.getElementById('cmbDestino') .options.add(new Option(destiText, destination, false, true));
      document.getElementById('textOrigen') .value = oriText;
      document.getElementById('textDestino') .value = destiText;
      document.getElementById('fechaSalida') .value = GM_getValue('startdate', '04/01/2014');
      document.getElementById('CmbPaxNum') .value = GM_getValue('paxNum', '1');
      var exactTimeText = GM_getValue('starttime', '0000');
      var exactTime = parseInt(exactTimeText) + 100;
      if ((exactTime % 100) == 0) {
        document.getElementById('horaSalida') .value = exactTime;
      } else {
        exactTimeText = exactTimeText.substr(0, 2) + ':' + exactTimeText.substr(2, 2);
        var exactTimeText2 = ('0000' + exactTime) .slice( - 4);
        document.getElementById('horaSalida') .options.add(new Option(exactTimeText, exactTimeText2, false, true));
      }
      // 0 Economy, 1 Business, 2 First  

      var travelClass = GM_getValue('class', 0);
      document.getElementById('cmbCabin') .options[travelClass].selected = true;
      console.log('all set.');
    } else {
      // Ajax not yet ready
      window.setTimeout(delayedFunc, 1000);
    }
  };
  window.setTimeout(delayedFunc, 1000);
} 
else if (window.location.href == 'https://www.lifemiles.com/eng/use/red/dynreddatessocae.aspx') {
  var text = document.getElementsByClassName('space-available') [0].getElementsByClassName('label-value') [0].textContent;
  if (text == 'Not available') {
    var travelClass = GM_getValue('class', 0);
    console.log(travelClass);
    if (travelClass == 0) {
      // check for Business or First availability when Economy is selected
      text = document.getElementsByClassName('promo-wrapper') [1].getElementsByClassName('label-value') [0].textContent;
      if (text == 'Not available') {
        text = document.getElementsByClassName('promo-wrapper') [2].getElementsByClassName('label-value') [0].textContent;
      }
    }
  };
  console.log(text);
  var count = GM_getValue('count', 0);
  var maxCount = GM_getValue('maxCount', 3);
  console.log(count);
  if (count < maxCount - 1) {
    if (text == 'Not available') {
      GM_setValue('count', ++count);
      console.log(count);
      document.getElementById('ctl00_cphContent_hidChangeDate') .value = '0/5';
      document.getElementById('ctl00_cphContent_btnCambiarFecha') .click();
    } 
    else
    {
      console.log('found one that week');
      // commented out so we can continue to booking 
      // GM_openInTab("https://www.lifemiles.com/eng/use/red/dynredpar.aspx");
    }
  } 
  else
  {
    console.log('ran out of trials');
    GM_openInTab('https://www.lifemiles.com/eng/use/red/dynredpar.aspx');
  }
} 
else if (window.location.href == 'https://www.lifemiles.com/eng/use/red/dynredflts.aspx') {
  GM_setValue(document.getElementById('flightOD0') .parentElement.parentElement.parentElement.children[2].textContent, document.getElementById('flightOD0') .parentElement.parentElement.parentElement.children[1].textContent);
  // commented out so we can continue to booking 
  //   GM_openInTab("https://www.lifemiles.com/eng/use/red/dynredpar.aspx");
} 
else if (window.location.href == 'https://www.lifemiles.com/eng/use/red/dynrederr.aspx') {
  console.log('error');
  GM_openInTab('https://www.lifemiles.com/eng/use/red/dynredpar.aspx');
} 
else
{
  alert('what the fuck?');
}
