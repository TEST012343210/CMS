const bcrypt = require('bcrypt');

const plainPassword = 'password123';

const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync(plainPassword, salt);
console.log('Generated Hash:', hashedPassword);
