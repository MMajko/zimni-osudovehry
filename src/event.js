var promise = require('bluebird');

var tableName = 'events';
var eventName = process.env.EVENT || null;

function getThis (knex) {
  if (eventName == null) {
    return promise.reject('No event specified in process environment variable.');
  }

  return knex(tableName).where('name', eventName);
}

/**
  * Gets this event
  */

function getEvent (knex) {
  return new promise((resolve, reject) => {
    getThis(knex).then((rows) => {
      if (rows.length == 0) {
        reject('The event not found.');
      }

      resolve(rows[0]);
    }).catch(reject);
  });
}

/**
 * Gets this event capacity status.
 * TODO: otestovat
 */

function getCapacityStatus (knex) {
  return new promise((resolve, reject) => {
    getThis(knex).select('capacity').count('attendee_id')
    .fullOuterJoin('events_attendee', 'events.id', 'events_attendee.event_id')
    .groupBy('capacity').then((rows) => {
      if (rows.length == 0) {
        reject('No events found.');
      }
      resolve({ count: parseInt(rows[0].count), capacity: rows[0].capacity });
    }).catch(reject);
  });
}

module.exports = { getEvent, getCapacityStatus };
