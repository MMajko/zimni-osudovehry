var express = require('express'),
    Datastore = require('nedb'),
    ppl = new Datastore({ filename: './db/osudove-ppl.db', autoload: true }),
    cors = require('cors'),
    bodyParser = require('body-parser');

var gamesIdentifier = '101';
var gamesCapacity = 16;

var port = process.env.PORT || 80;
var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

String.prototype.lpad = function(padString, length) {
    var str = this;
    while (str.length < length)
        str = padString + str;
    return str;
};

function registerNewUser(id, name, surname, email, phone, callback) {
  ppl.insert({
    id: id,
    name: name,
    surname: surname,
    email: email,
    phone: phone,
    registered: new Date()
  }, function (err, docs) {
    callback(docs[0]);
  });
}

function createNewUserId(lastid) {
  var rawId = parseInt(lastid.substr(3));
  return gamesIdentifier + (rawId + 1).toString().lpad('0',3);
}

function getCapacityCount(callback) {
  ppl.find({}).exec(function (err, docs) {
    callback({ registered: docs.length, capacity: gamesCapacity });
  });
}

// Serve static files
app.use(express.static('../dist'));

// New user registration
app.post('/register', function(req, res) {
  getCapacityCount(function (cap) {
      if (cap.registered >= cap.capacity) {
        res.send('you must be fun at parties, right?');
        return;
      }

      ppl.find({}).sort({ registered: -1 }).limit(1).exec(function (err, docs) {
        var newId = docs.length > 0 ? createNewUserId(docs[0].id) : gamesIdentifier + '000';

        registerNewUser(newId, req.body.name, req.body.surname, req.body.email,
                        req.body.phone, function(err, docs) {
          if (!err) res.send(newId);
        });
      });
  });
});

// Capacity capacity-count
app.get('/capacity', function(req, res) {
  getCapacityCount(function (cap) {
      res.send(cap.registered + '/' + cap.capacity);
  });
});

// Dumping users database
app.get('/registered', function(req, res) {
    res.send('okok');
})

var server = app.listen(port, function () {
  var port = server.address().port;
  console.log('App running on %s', port);
});
