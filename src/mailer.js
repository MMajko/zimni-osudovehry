var promise = require('bluebird');
var nodemailer = require('nodemailer');
var transport = require('nodemailer-sendgrid-transport');

var mailerOptions = {
    auth: {
        api_key: process.env.SENDGRID_APIKEY
    }
};

var mailerTransport = nodemailer.createTransport(transport(mailerOptions));

/**
 * Sends a mail.
 */

function sendMail () {
  // TODO
}

/**
 * Sends mail to a new attendee, who just registered.
 */

function sendRegistrationNotice () {
  return new promise((resolve, reject) => {

  });
}

/**
 * Nofities attendee, that his registration is now invalid.
 */

function sendLostRegistrationNotice () {
  return new promise((resolve, reject) => {

  });
}

/**
 * Sends mail confirming a payment from attendee.
 */

function sendPaymentNotice () {
  return new promise((resolve, reject) => {

  });
}

/**
 * Sends notice to all boss users, that capacity has been reached.
 */

function sendCapacityNotice () {
  return new promise((resolve, reject) => {

  });
}

module.exports = { sendMail };
