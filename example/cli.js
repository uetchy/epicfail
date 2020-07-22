#!/usr/bin/env node

const handleErrors = require('epicfail').default;
const Sentry = require('@sentry/node');
const fs = require('fs');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  defaultIntegrations: false,
});

handleErrors({
  showStackTrace: false,
  onError: Sentry.captureException, // will returns event_id issued at Sentry
});

fs.readFileSync('foo');
