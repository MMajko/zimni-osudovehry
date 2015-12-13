require('../scss/main.scss');

require('file?name=logo.png!../img/logo.png');
require('file?name=paypal-button.png!../img/paypal-button.png');

var xhttp = new XMLHttpRequest();
var endpoint = '.';

function showElement(el) {
  document.getElementById(el).classList.remove('u-visuallyhidden');
}

function hideElement(el) {
  document.getElementById(el).classList.add('u-visuallyhidden');
}

function rformGetData() {
  var inputs = document.querySelectorAll('#rform input');
  var data = [];

  for (var input of inputs) {
    data.push(
      encodeURIComponent(input.name) + '=' + encodeURIComponent(input.value)
    );
  }

  return data.join('&').replace(/%20/g, '+');
}

function rformSubmit(e) {
  e.preventDefault();

  if (!document.getElementById("rform-18").checked) {
    alert('Hele... Mrkni na název akce - Osudové hry. Hry o sud. Hry o sud \n \
piva. PIVO. ALKOHOL. Musí ti být 18. Opravdu. Sorry.');
    return;
  }

  hideElement('rform-container');
  showElement('confirmation');
  showElement('processing');

  xhttp.open('POST', endpoint + '/register', true);
  xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhttp.onreadystatechange = rformReceive;
  xhttp.send(rformGetData());
}

function rformReceive() {
  setTimeout(function () {
    showElement('confirmation');
    hideElement('processing');

    if(xhttp.readyState == 4 && xhttp.status == 200) {
      showElement('processed');
      hideElement('capacity');
      document.getElementById('variable-symbol').innerHTML = xhttp.responseText;
    }
    else {
      showElement('not-processed');
    }

  }, 2000);
}

document.getElementById('rform').addEventListener('submit', rformSubmit);
