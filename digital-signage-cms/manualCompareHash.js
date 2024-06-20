const bcrypt = require('bcrypt');

const plainPassword = 'password123';
const storedHash = '$2b$10$oh4zodYwGjk25sdAJFa8v.1C9JeMe/Ehq6DrHB2VkOl.LyojkZyVS'; // Replace this with the actual generated hash

bcrypt.compare(plainPassword, storedHash, (err, isMatch) => {
  if (err) {
    console.error('Error during password comparison:', err);
  } else if (isMatch) {
    console.log('Passwords match');
  } else {
    console.log('Passwords do not match');
  }
});
