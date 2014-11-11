rulesByCollection = {};

addFuncForAll = function addFuncForAll(collections, allowOrDeny, types, fetch, func) {
  var rules = {};
  if (_.isArray(fetch)) {
    rules.fetch = fetch;
  }
  _.each(types, function (t) {
    rules[t] = func;
  });
  _.each(collections, function (c) {
    c[allowOrDeny](rules);
  });
};

var created = {
  allow: {
    insert: {},
    update: {},
    remove: {}
  },
  deny: {
    insert: {},
    update: {},
    remove: {}
  }
};
ensureCreated = function ensureCreated(allowOrDeny, collections, types, func) {
  _.each(types, function (t) {
    collections = _.reject(collections, function (c) {
      return _.has(created[allowOrDeny][t], c._name);
    });
    addFuncForAll(collections, allowOrDeny, [t], null, func);
    // mark that we've defined function for collection-type combo
    _.each(collections, function (c) {
      created[allowOrDeny][t][c._name] = true;
    });
  });
};

ensureDefaultAllow = function ensureDefaultAllow(collections, types) {
  ensureCreated("allow", collections, types, function () {
    return true;
  });
};
