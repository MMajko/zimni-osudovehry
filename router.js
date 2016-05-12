var express = require('express');
var promise = require('bluebird');

var database = require('./src/database');
var ev = require('./src/event');
var attendees = require('./src/attendees');
var mailer = require('./src/mailer');
var utils = require('./src/utils');

var router = express.Router();

/**
 * GET /
 * Home page
 */

router.get('/', (req, res) => {
  var params = { theme: process.env.THEME };

  ev.getEvent(database.knex).then((result) => {

    params.event = result;
    return ev.getCapacityStatus(database.knex);

  }).then((result) => {

    params.capacityLeft = result.capacity - result.count;
    params.capacityPercentage = Math.round((1 - result.count / result.capacity) * 100);
    res.render('index', params);

  });
});

/**
 * POST /register
 * Attendee registration
 */

router.post('/register', (req, res) => {
  var attendeeId = null;
  var attendeeSecret = Math.round(Math.random() * 888888 + 111111); // TODO: change to alphanumeric

  ev.getCapacityStatus(database.knex).then((result) => {

    // Check if capacity is ok
    if (result.count >= result.capacity) {
      return promise.reject(new Error('capacity_full'));
    }

    // Register new attendee, if needed
    if (req.body.exists != 'on') {
      return attendees.register({
        email: req.body.email,
        name: req.body.name,
        surname: req.body.surname,
        phone: req.body.phone,
        secret: attendeeSecret
      }, database.knex);
    } else {
      return attendees.findByEmail(req.body.email, database.knex).then((at) => {
        attendeeSecret = at.secret;
        return at.id;
      });
    }

  }).then((id) => {

    attendeeId = id;

    // Register his attendance to this event
    return ev.addAttendant(id, database.knex);

  }).then(() => {

    // Send mail about new registration
    return mailer.sendRegistrationNotice();

  }).then((result) => {

    // If the capacity has been reached, send a notice (throwcatch-less)
    ev.getCapacityStatus(database.knex).then((result) => {
      if (result.count >= result.capacity) {
        mailer.sendCapacityNotice();
      }
    });

    res.redirect('/payment-details/' + attendeeId + '/' + attendeeSecret);

  }).catch((err) => {

    res.render('error', { error: { message: err.message } });

  });
});

/**
 * GET /payment-details/:attendeeid/:secret
 * Payment details page
 */
router.get('/payment-details/:attendeeid/:secret', (req, res) => {
  var attendStatus = null;

  attendees.findById(req.params.attendeeid, database.knex).then((attendee) => {

    if (attendee.secret != req.params.secret) {
      throw new Error('Wrong secret token');
    }

    return attendees.getAttendanceDetails(req.params.attendeeid, database.knex);

  }).then((attendance) => {

    return ev.getPaymentDetails(req.params.attendeeid, attendance.status, database.knex);

  }).then((paymentDetails) => {

    res.render('payment-details', paymentDetails);

  }).catch((error) => {
    res.render('error', { error });
  });
});

/**
 * GET /user-exists/:email
 * Checks if user with specified e-mail exists
 */
router.get('/user-exists/:email', (req, res) => {
  attendees.findByEmail(req.params.email, database.knex).then((attendee) => {

    // Check if he's attending
    ev.getEvent(database.knex).then((event) => {
      return attendees.isAttendingEvent(attendee.id, event.id, database.knex);
    }).then((result) => {
      res.json({ result: 'ok', exists: true, attendee, isAttending: result });
    });

  }).catch(utils.notFoundError, () => {

    res.json({ result: 'ok', exists: false });

  }).catch((err) => {

    res.json({ result: 'error', error: err.message });

  });
});

module.exports = router;
