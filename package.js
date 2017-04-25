Package.describe({
  name: "ongoworks:security",
  summary: "Logical security for client-originated MongoDB collection operations",
  version: "2.1.0",
  git: "https://github.com/ongoworks/meteor-security.git"
});

Package.onUse(function (api) {
  api.versionsFrom(['METEOR@1.0', 'METEOR@1.1', 'METEOR@1.2', 'METEOR@1.3', 'METEOR@1.4']);

  api.use([
    'mongo',
    'underscore',
    'minimongo',
    'random',
    'ejson',
    'ecmascript',
  ]);
  api.use('alanning:roles@1.2.16', ['client', 'server'], {
    weak: true
  });

  api.use('mongo-id', 'server');

  api.addFiles([
    'lib/server/utility.js',
    'lib/server/Security.js',
    'lib/server/Security.Rule.js',
    'lib/server/Security.Check.js',
  ], 'server');

  api.addFiles([
    'lib/client/Security.js',
    'lib/client/Security.Rule.js',
    'lib/client/Security.Check.js',
  ], 'client');

  api.addFiles([
    'lib/builtInRules.js'
  ]);

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
    'alanning:roles@1.2.16'
  ]);

  api.addFiles('tests/prep.js');
  api.addFiles('tests/server.js', 'server');
  api.addFiles('tests/client.js', 'client');
});
