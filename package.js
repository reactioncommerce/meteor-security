Package.describe({
  name: "ongoworks:security",
  summary: "Logical security for client-originated MongoDB collection operations",
  version: "2.0.0",
  git: "https://github.com/ongoworks/meteor-security.git"
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@0.9.3');
  api.use(['mongo', 'underscore']);
  api.use('alanning:roles@1.2.9', ["client", "server"], {weak: true});
  api.addFiles(['security-util.js', 'security-api.js', 'security-rules.js']);
  api.export('Security');
});

Package.onTest(function(api) {
  api.versionsFrom('METEOR@0.9.3');
  api.use('mongo');
  api.use('underscore');
  api.use('tinytest');
  api.use('ongoworks:security');
  api.addFiles('tests/prep.js');
  api.addFiles('tests/tests.js', 'client');
});
