require('../scss/list.scss');
var Tabella = require('./tabella.js');

var xhttp = new XMLHttpRequest();
var endpoint = '.';

function displayTable() {
  if(xhttp.readyState == 4 && xhttp.status == 200) {
    var data = JSON.parse(xhttp.responseText);

    var rowVal = [];
    var rowDesc = [];

    for (var i in data) {
      var expired = !data[i].paid && (new Date().getTime() - new Date(data[i].registered).getTime()) > 5760000;

      rowVal.push([
        data[i].id.toString(),
        data[i].name.toString(),
        data[i].surname.toString(),
        data[i].email.toString(),
        data[i].phone.toString(),
        data[i].registered.toString(),
        data[i].paid.toString(),
        expired.toString(),
        data[i].valid.toString(),
      ]);

      rowDesc.push(data[i]._id);
    }

    var myTabella = new Tabella(
        document.getElementById('tabella'),
        {
            from: '',
            tableHeader: [
              ["id"], ["name"], ["surname"], ["email"], ["phone"],
              ["registered"], ["paid"], ["expired"], ["valid"]
            ],
            rows : [
                {
                    rowHeader: 'Ucastnici',
                    rowVal: rowVal,
                    rowDesc: rowDesc
                }
            ],
            currency: '',
            cellBreakpoints: {
              default: [0,1],
              small: [360,1],
              medium: [640,2],
              large: [820,3],
              xlarge: [1280,5]
            }
        }
    );
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
