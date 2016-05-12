
/**
 * Database schema.
 */

module.exports = [
  // table: events
  {
    name: 'events',
    cols: (table) => {
      table.increments();
      table.string('name').unique();
      table.string('long_name')
      table.string('description');
      table.dateTime('date_from');
      table.dateTime('date_to');
      table.integer('capacity');
      table.string('payment_acc');
      table.integer('price');
    }
  },
  // table: attendees
  {
    name: 'attendees',
    cols: (table) => {
      table.increments();
      table.string('name');
      table.string('surname');
      table.string('email').unique();
      table.string('phone');
      table.string('secret');
    }
  },
  // table: events_attendee
  {
    name: 'events_attendee',
    cols: (table) => {
      table.integer('event_id').references('events.id');
      table.integer('attendee_id').references('attendees.id');
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
