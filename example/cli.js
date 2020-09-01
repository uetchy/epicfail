#!/usr/bin/env node

const handleErrors = require('epicfail').default;
const fs = require('fs');

handleErrors();

fs.readFileSync('foo');
