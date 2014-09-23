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

var defaultAllowCreated = {
  insert: {},
  update: {},
  remove: {}
};
ensureDefaultAllow = function ensureDefaultAllow(collections, types) {
  _.each(types, function (t) {
    collections = _.reject(collections, function (c) {
      return _.has(defaultAllowCreated[t], c._name);
    });
    addFuncForAll(collections, "allow", [t], [], function () {
      return true;
    });
    // mark that we've defined allow function for collection-type combo
    _.each(collections, function (c) {
      defaultAllowCreated[t][c._name] = true;
    });
  });
};