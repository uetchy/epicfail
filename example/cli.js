#!/usr/bin/env node

const handleErrors = require('epicfail');
const fs = require('fs');

handleErrors({
  showStackTrace: false,
});

fs.readFileSync('foo');
