var promise = require('bluebird');

var utils = require('./utils');
var ev = require('./event');

var tableName = 'attendees';
var eventName = process.env.EVENT || null;

function register (data, knex) {
  return knex(tableName).where({ email: data.email }).count().then((result) => {
    if (result[0].count == 0) {
      return knex(tableName).insert(data).returning('id');
    } else {
      return promise.reject(new Error('Already exists.'));
    }
  });
}

function findByEmail (email, knex) {
  return new promise((resolve, reject) => {
    knex(tableName).where({ email }).then((rows) => {
      if (rows.length == 0) {
        throw new utils.notFoundError();
      } else {
        resolve(rows[0]);
      }
    }).catch(reject);
  });
}

function findById (id, knex) {
  return new promise((resolve, reject) => {
    knex(tableName).where({ id }).then((rows) => {
      if (rows.length == 0) {
        throw new utils.notFoundError();
      } else {
        resolve(rows[0]);
      }
    }).catch(reject);
  });
}

function isAttendingEvent (attendeeId, eventId, knex) {
  return new promise((resolve, reject) => {
    knex('events_attendee').where({
      event_id: eventId,
      attendee_id: attendeeId
    }).count().then((rows) => {
      resolve(parseInt(rows[0].count) > 0);
    }).catch(reject);
  });
}

function getAttendanceDetails (attendeeId, knex) {
  return new promise((resolve, reject) => {
    ev.getEvent(knex).then((event) => {
      return knex('events_attendee').where({
        event_id: event.id,
        attendee_id: attendeeId
      });
    }).then((rows) => {
      if (rows.length == 0) {
        throw new utils.notFoundError('User attendance not found.');
      } else {
        resolve(rows[0]);
      }
    }).catch(reject);
  });
}

module.exports = { register, findByEmail, findById, isAttendingEvent, getAttendanceDetails };
