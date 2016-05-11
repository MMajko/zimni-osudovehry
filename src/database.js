var knex = require('knex')({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
  searchPath: 'public'
});
var promise = require('bluebird');

var auth = require('./auth');

function init () {
  return new promise((resolve, reject) => {
    var schema = [
      // table: events
      {
        name: 'events',
        cols: (table) => {
          table.increments();
          table.string('name');
          table.string('short-name').unique();
          table.string('description');
          table.dateTime('date_from');
          table.dateTime('date_to');
          table.integer('capacity');
          table.string('payment_acc');
          table.string('payment_paypal');
        }
      },
      // table: attendee
      {
        name: 'attendee',
        cols: (table) => {
          table.increments();
          table.string('name');
          table.string('surname');
          table.string('email').unique();
          table.string('phone');
        }
      },
      // table: events_attendee
      {
        name: 'events_attendee',
        cols: (table) => {
          table.integer('event_id').references('events.id');
          table.integer('attendee_id').references('attendee.id');
          table.dateTime('registered');
          table.dateTime('paid');
          table.string('status');
          table.string('note');
        }
      },
      // table: boss_users
      {
        name: 'boss_users',
        cols: (table) => {
          table.increments();
          table.string('username');
          table.string('password');
          table.string('role');
        }
      },
    ];

    // Sequentially create tables
    promise.each(schema, (table) => {
      return knex.schema.createTableIfNotExists(table.name, table.cols).then();
    }).then(resolve).catch(reject);
  });
}

function createDefaultBoss () {
  return new promise((resolve, reject) => {
    var password = Math.round(Math.random() * 88888 + 11111).toString();

    knex('boss_users').truncate().insert({
      username: 'boss',
      password: auth.hashPassword(password),
      role: 'SUPERUSER'
    }).then(() => { resolve(password); }).catch(reject);
  });
}

module.exports = { init, createDefaultBoss };
