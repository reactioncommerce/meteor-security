Package.describe({
  name: "ongoworks:security",
  summary: "Logical security for client-originated MongoDB collection operations",
  version: "2.0.0",
  git: "https://github.com/ongoworks/meteor-security.git"
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.0');
  api.use(['mongo', 'underscore']);
  api.use('alanning:roles@1.2.13', ["client", "server"], {weak: true});
  api.addFiles(['security-util.js', 'security-deny.js', 'security-api.js', 'security-rules.js'], ['server']);
  api.export('Security');
});

Package.onTest(function(api) {
  api.versionsFrom('METEOR@1.0');
  api.use('mongo');
  api.use('underscore');
  api.use('tinytest');
  api.use('random');
  api.use('accounts-password');
  api.use('alanning:roles');
  api.use('ongoworks:security');
  api.addFiles('tests/prep.js');
  api.addFiles('tests/tests.js', 'client');
});
