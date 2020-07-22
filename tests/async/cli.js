const handleErrors = require('../..').default;

handleErrors();

new Promise((_, reject) => reject('Woops'));
