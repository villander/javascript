let crypto = require('crypto');
let iv = '0123456789012345';

function getPaddedKey(key) {
  return crypto.createHash('sha256').update(key).digest('hex').slice(0, 32);
}

function performEncryption(input, key) {
  if (!key) return input;
  let plaintext = JSON.stringify(input);
  let cipher = crypto.createCipheriv('aes-256-cbc', getPaddedKey(key), iv);
  let base64Encrypted = cipher.update(plaintext, 'utf8', 'base64') + cipher.final('base64');
  return base64Encrypted || input;
}

function performDecryption(input, key) {
  if (!key) return input;
  let decrypted;
  let decipher = crypto.createDecipheriv('aes-256-cbc', getPaddedKey(key), iv);
  try {
    decrypted = decipher.update(input, 'base64', 'utf8') + decipher.final('utf8');
  } catch (e) {
    return null;
  }
  return JSON.parse(decrypted);
}

module.exports = { encrypt: performEncryption, decrypt: performDecryption };
