require('../scss/list.scss');

var jsonToTable = require('./json-to-table.js');

var xhttp = new XMLHttpRequest();
var endpoint = '.';

function displayTable() {
  if(xhttp.readyState == 4 && xhttp.status == 200) {
    var data = JSON.parse(xhttp.responseText);

    document.getElementById('table').innerHTML = jsonToTable(data)
  }
}

window.addEventListener('load', function() {
  var token = window.location.search.replace("?", "").replace("&", "");
  xhttp.open('GET', endpoint + '/registered?token=' + token , true);
  xhttp.onreadystatechange = displayTable;
  xhttp.send();

  var inputs = document.querySelectorAll('input[name=token]');
  for (var i in inputs) { inputs[i].value = token; }
});
