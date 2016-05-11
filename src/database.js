var knex = require('knex')({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
  searchPath: 'public'
});

var auth = require('./auth');

function init () {
  // Schema structure
  var tables = {
    'events': (table) => {
      table.increments();
      table.string('name');
      table.string('short-name').unique();
      table.string('description');
      table.dateTime('date_from');
      table.dateTime('date_to');
      table.integer('capacity');
      table.string('payment_acc');
      table.string('payment_paypal');
    },
    'attendee': (table) => {
      table.increments();
      table.string('name');
      table.string('surname');
      table.string('email').unique();
      table.string('phone');
    },
    'events_attendee': (table) => {
      table.integer('event_id').references('events.id');
      table.integer('attendee_id').references('attendee.id');
      table.dateTime('registered');
      table.dateTime('paid');
      table.string('status');
      table.string('note');
    },
    'boss_users': (table) => {
      table.increments();
      table.string('username');
      table.string('password');
      table.string('role');
    }
  };

  // Create schema
  knex.schema.createTableIfNotExists('events', tables['events']).then(() => {
    knex.schema.createTableIfNotExists('attendee', tables['attendee']).then(() => {
      knex.schema.createTableIfNotExists('events_attendee', tables['events_attendee'])
        .catch((err) => {
          console.error(err);
        });
    }).catch((err) => { console.error(err); });
  }).catch((err) => { console.error(err); });

  knex.schema.createTableIfNotExists('boss_users', tables['boss_users']).catch((err) => {
    console.error(err);
  });
}

function createDefaultBoss () {
  var password = Math.round(Math.random() * 88888 + 11111).toString();

  knex('boss_users').truncate().insert({
    username: 'boss',
    password: auth.hashPassword(password),
    role: 'SUPERUSER'
  }).catch((err) => {
    console.error('Error creating default boss: ' + err);
  })

  return password;
}

module.exports = { init, createDefaultBoss };
