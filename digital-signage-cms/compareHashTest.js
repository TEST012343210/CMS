const bcrypt = require('bcrypt');

const plainPassword = 'password123';
const storedHash = '$2b$10$fYaUWlsg5zeyAC5hVKlEk.gQuTnMSgDnescaTYRSVVaZRkEIacyU.'; // Use the same hash from the logs

// Compare the plaintext password to the stored hash
bcrypt.compare(plainPassword, storedHash, (err, isMatch) => {
  if (err) {
    console.error('Error during password comparison:', err);
  } else if (isMatch) {
    console.log('Passwords match');
  } else {
    console.log('Passwords do not match');
  }
});
