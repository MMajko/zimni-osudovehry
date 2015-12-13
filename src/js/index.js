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
  hideElement(document.getElementById('rform-container'));
  showElement(document.getElementById('confirmation'));
  showElement(document.getElementById('processing'));
  e.preventDefault();

  var data = new FormData(document.getElementById('rform'));
  xhttp.open('POST', endpoint + '/register', true);
  xhttp.onreadystatechange = rformReceive;
  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhttp.setRequestHeader('Connection', 'close');
  xhttp.send(data);
}

function rformReceive() {
  setTimeout(function () {
    showElement(document.getElementById('confirmation'));
    hideElement(document.getElementById('processing'));

    if(xhttp.readyState == 4 && xhttp.status == 200) {
      showElement(document.getElementById('processed'));
      document.getElementById('variable-symbol').innerText = xhttp.responseText;
    }
    else {
      showElement(document.getElementById('not-processed'));
    }

  }, 2000);
}

document.getElementById('rform').addEventListener('submit', rformSubmit);
