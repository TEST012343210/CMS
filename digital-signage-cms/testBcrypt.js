// testBcrypt.js
const bcrypt = require('bcrypt');

const storedHash = '$2a$10$I1meMyf4H85FJd/gGqG.luDOJPKjgHizykTWY8CnlEEQOeyjvi0M2';
const enteredPassword = 'password123';

bcrypt.compare(enteredPassword, storedHash, (err, isMatch) => {
  if (err) {
    console.error('Error during password comparison:', err);
    return;
  }

  if (isMatch) {
    console.log('Passwords match');
  } else {
    console.log('Passwords do not match');
  }
});
