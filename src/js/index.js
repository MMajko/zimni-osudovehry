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

  for (var i in inputs) {
    data.push(
      encodeURIComponent(inputs[i].name)+'='+encodeURIComponent(inputs[i].value)
    );
  }

  return data.join('&').replace(/%20/g, '+');
}

function rformCheckFilled() {
  var inputs = document.querySelectorAll('#rform input');
  for (var i in inputs) {
    if (inputs[i].value.length == 0) {
      alert('Vyplňte prosím všechna pole, jsou povinná.');
      return false;
    }
    if (inputs[i].name == 'email' && !(inputs[i].value.match(/\S+@\S+\.\S+/))) {
      alert('Zadejte prosím validní e-mailovou adresu.');
      return false;
    }
    if (inputs[i].name == 'phone' && !(inputs[i].value.match(/(\+[0-9]{12}|[0-9]{9})/))) {
      alert('Zadejte prosím validní telefonní číslo.');
      return false;
    }
  }
  return true;
}

function rformSubmit(e) {
  e.preventDefault();

  window.location.href = '#registration';

  if (!document.getElementById("rform-18").checked) {
    alert('Hele... Mrkni na název akce - Osudové hry. Hry o sud. Hry o sud \n \
piva. PIVO. ALKOHOL. Musí ti být 18. Opravdu. Sorry.');
    return;
  }

  if (!rformCheckFilled()) return;

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
      document.getElementById('paypal-id').value =
                          document.getElementById('specific-symbol').innerHTML +
                          xhttp.responseText;
    }
    else {
      showElement('not-processed');
    }

  }, 2000);
}

document.getElementById('rform').addEventListener('submit', rformSubmit);
