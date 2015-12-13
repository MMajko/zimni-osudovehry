require('../scss/main.scss');
require('./form.js');

require('file?name=logo.png!../img/logo.png');
require('file?name=paypal-button.png!../img/paypal-button.png');

var xhttp = new XMLHttpRequest();
var endpoint = 'http://osudove-rest-endpoint.majko.cz';

function showElement(el) {
  el.classList.remove('u-visuallyhidden');
}

function hideElement(el) {
  el.classList.add('u-visuallyhidden');
}

function rformSubmit(e) {
  e.preventDefault();

  if (!document.getElementById("rform-18").checked) {
    alert('Hele... Mrkni na název akce - Osudové hry. Hry o sud. Hry o sud \n \
piva. PIVO. ALKOHOL. Musí ti být 18. Opravdu. Sorry.');
    return;
  }

  hideElement(document.getElementById('rform-container'));
  showElement(document.getElementById('confirmation'));
  showElement(document.getElementById('processing'));

  var data = new FormData(document.getElementById('rform'));
  xhttp.open('POST', endpoint + '/register', true);
  xhttp.onreadystatechange = rformReceive;
  xhttp.send(data);
}

function rformReceive() {
  setTimeout(function () {
    showElement(document.getElementById('confirmation'));
    hideElement(document.getElementById('processing'));

    if(xhttp.readyState == 4 && xhttp.status == 200) {
      showElement(document.getElementById('processed'));
      document.getElementById('variable-symbol').innerText = xhttp.responseText;
      
      document.getElementById('capacity').innerText =
                    parseInt(document.getElementById('capacity').innerText) + 1;
    }
    else {
      showElement(document.getElementById('not-processed'));
    }

  }, 2000);
}

document.getElementById('rform').addEventListener('submit', rformSubmit);
