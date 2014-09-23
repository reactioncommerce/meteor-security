function addFuncForAll(collections, allowOrDeny, types, fetch, func) {
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
}

var defaultAllowCreated = {};
function ensureDefaultAllow(collections) {
  collections = _.reject(collections, function (c) {
    return _.has(defaultAllowCreated, c._name);
  });
  addFuncForAll(collections, "allow", ["insert", "update", "remove"], [], function () {
    return true;
  });
  _.each(collections, function (c) {
    defaultAllowCreated[c._name] = true;
  });
}