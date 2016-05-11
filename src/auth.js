var crypto = require('crypto');

function hashPassword (password) {
  return crypto.createHmac('sha256', process.env.HASH_SECRET || 'osudove-hry')
                .update(password).digest('hex');
}

module.exports = { hashPassword };
