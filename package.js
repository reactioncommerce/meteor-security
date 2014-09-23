Package.describe({
  name: "ongoworks:security",
  summary: "Logical MongoDB security",
  version: "1.0.0",
  git: "https://github.com/ongoworks/meteor-security.git"
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@0.9.2.2');
  api.use(['mongo', 'underscore']);
  api.use('alanning:roles@1.2.9', ["client", "server"], {weak: true});
  api.addFiles(['security-util.js', 'security-api.js', 'security-rules.js']);
  api.exports('Security');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('ongoworks:security');
  api.addFiles('security-tests.js');
});
