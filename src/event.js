var promise = require('bluebird');

var tableName = 'events';
var attendanceTableName = 'events_attendee';
var eventName = process.env.EVENT || null;

function getThis (knex) {
  if (eventName == null) {
    return promise.reject(new Error('No event specified in process environment variable.'));
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
        reject(new Error('The event not found.'));
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
    .fullOuterJoin(attendanceTableName, tableName + '.id', attendanceTableName + '.event_id')
    .groupBy('capacity').then((rows) => {
      if (rows.length == 0) {
        reject(new Error('No events found.'));
      }
      resolve({ count: parseInt(rows[0].count), capacity: rows[0].capacity });
    }).catch(reject);
  });
}

/**
 * Adds attendee
 */

function addAttendant (attendeeId, knex) {
  return new promise((resolve, reject) => {
    getEvent(knex).then((event) => {
      resolve(knex(attendanceTableName).insert({
        event_id: event.id,
        attendee_id: parseInt(attendeeId),
        registered: knex.fn.now(),
        paid: null,
        status: 'waiting'
      }));
    }).catch(reject);
  });
}

function getPaymentDetails (attendeeId, status, knex) {
  return new promise((resolve, reject) => {
    getEvent(knex).then((event) => {

      var statusDictionary = {
        null: 'neznámý',
        waiting: 'čeká se na platbu',
        paid: 'zaplaceno',
        error: 'došlo k chybě',
        cancel: 'registrace je zrušená'
      };

      resolve({
        status: statusDictionary[status],
        specificSymbol: '73756416',
        variableSymbol: (100 + event.id).toString() +
                        (100 + parseInt(attendeeId)).toString(),
        event
      });

    }).catch(reject);
  });
}

module.exports = { getEvent, getCapacityStatus, addAttendant, getPaymentDetails };
