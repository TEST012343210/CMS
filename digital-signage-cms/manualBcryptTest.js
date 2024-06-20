const bcrypt = require('bcrypt');

// The plaintext password
const plainPassword = 'password123';

// Generate a salt
const salt = bcrypt.genSaltSync(10);

// Hash the password
const hashedPassword = bcrypt.hashSync(plainPassword, salt);
console.log('Generated Hash:', hashedPassword);

// Compare the plaintext password to the hash
bcrypt.compare(plainPassword, hashedPassword, (err, isMatch) => {
  if (err) {
    console.error('Error during password comparison:', err);
  } else if (isMatch) {
    console.log('Passwords match');
  } else {
    console.log('Passwords do not match');
  }
});
