require('../scss/list.scss');

var jsonToTable = require('./json-to-table.js');
var md5 = require('js-md5');

var xhttp = new XMLHttpRequest();
var endpoint = '.';

var regLimit = new Date();
regLimit.setDate(regLimit.getDate() - 4);

function displayTable() {
  var token = window.location.search.replace("?", "").replace("&", "");

  if(xhttp.readyState == 4 && xhttp.status == 200) {
    var data = JSON.parse(xhttp.responseText);
    var tableData = [];
    var invalidTableData = [];

    data.map(function (row) {
      var regDate = new Date(row.registered);
      var isValid = row.paid || (row.valid && regDate > regLimit);

      if (row.paid) {
        var status = 'zaplaceno'
      } else {
        if (row.valid && regDate > regLimit) {
          var status = 'nezaplatil'
        } else if (row.valid) {
          var status = 'prošlá, nezaplatil'
        } else {
          var status = 'neplatná'
        }
      }

      var obj = {
        ' ': '<img src="http://www.gravatar.com/avatar/' + md5(row.email) + '?s=32&d=mm" class="gravatar" alt="Gravatar">',
        'Os. číslo': row.id,
        'Jméno a příjmení': '<small>' + row._id + '</small><br>' + row.name + ' ' + row.surname,
        'Kontakt': row.email + '<br>' + row.phone,
        'Registrace': regDate.toLocaleString(),
        'Stav': status,
        'Akce': '<a href="/markpaid?id=' + row.id + '&token=' + token +'" title="Označit jako zaplacenou">&#x1F44C;</a>' +
                '<a href="/markinvalid?id=' + row.id + '&token=' + token +'" title="Označit jako neplatnou">&#x1F44E;</a>',
      };

      if (isValid) {
        tableData.push(obj);
      } else {
        invalidTableData.push(obj);
      }
    })

    document.getElementById('table').innerHTML = jsonToTable(tableData)
    document.getElementById('table-invalid').innerHTML = jsonToTable(invalidTableData)
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
