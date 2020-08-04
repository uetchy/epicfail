import epicfail from '../..';

epicfail({
  assertExpected: (err) => err.name === 'CACError',
});

const err = new Error('Error!');
err.name = 'CACError';

throw err;
