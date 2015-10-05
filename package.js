Package.describe({
  name: "ongoworks:security",
  summary: "Logical security for client-originated MongoDB collection operations",
  version: "1.2.0",
  git: "https://github.com/ongoworks/meteor-security.git"
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@1.0');

  api.use([
    'mongo',
    'underscore',
    'minimongo',
    'random',
    'ejson'
  ]);
  api.use('alanning:roles@1.2.14', ['client', 'server'], {
    weak: true
  });

  api.addFiles([
    'security-util.js',
    'security-deny.js',
    'security-api.js',
    'security-rules.js'
  ], 'server');

  api.export('Security');
});

Package.onTest(function (api) {
  api.versionsFrom('METEOR@1.0');
  api.use([
    'ongoworks:security',
    'mongo',
    'underscore',
    'tinytest',
    'random',
    'accounts-password',
    'alanning:roles@1.2.14'
  ]);

  api.addFiles('tests/prep.js');
  api.addFiles('tests/tests.js', 'client');
});
