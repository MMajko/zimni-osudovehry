var crypto = require('crypto');

function hashPassword (password) {
  return crypto.createHmac('sha256', process.env.HASH_SECRET || 'osudove-hry')
                .update(password).digest('hex');
}

function generateSecret () {
  return crypto.createHmac('sha256', process.env.HASH_SECRET || 'osudove-hry')
                .update(Math.random() * Math.pow(2,256)).digest('hex');
}

module.exports = { hashPassword };
