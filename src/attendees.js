var tableName = 'attendees';

function register (data, knex) {
  return knex(tableName).insert(data);
}

module.exports = { register };
