var express = require('express');
var promise = require('bluebird');

var database = require('./src/database.js');
var ev = require('./src/event.js');
var attendees = require('./src/attendees.js');
var mailer = require('./src/mailer.js');

var router = express.Router();

/**
 * GET /
 * Home page
 */

router.get('/', function(req, res) {
  var params = {};

  ev.getEvent(database.knex).then((result) => {

    params.event = result;
    return ev.getCapacityStatus(database.knex);

  }).then((result) => {

    params.capacityLeft = result.capacity - result.count;
    res.render('index', params);

  });
});

/**
 * POST /register
 * Attendee registration
 */

router.post('/register', function(req, res) {
  ev.getCapacityStatus(database.knex).then((result) => {

    // Check if capacity is ok
    if (result.count >= result.capacity) {
      return promise.reject('capacity_full');
    }

    // Register new attendee
    return attendees.register({});
    // TODO: input data!

  }).then((result) => {

    // Send mail about new registration
    return mailer.sendRegistrationNotice();

  }).then((result) => {

    // If the capacity has been reached, send a notice (throwcatch-less)
    ev.getCapacityStatus(database.knex).then((result) => {
      if (result.count >= result.capacity) {
        mailer.sendCapacityNotice();
      }
    });

    res.json({ result: 'ok' });

  }).catch((err) => {

    res.json({ result: 'error', error: err });

  });
});

module.exports = router;
