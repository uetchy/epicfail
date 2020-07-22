const handleErrors = require('../..');
const fs = require('fs');

handleErrors();

new Promise((_, reject) => reject('Woops'));
