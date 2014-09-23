var definedRules = {};

// The `Security` object is exported and provides the package API
Security = {
  defineRule: function Security_defineRule(name, definition) {
    // Check whether a rule with the given name already exists; can't overwrite
    if (_.has(definedRules, name)) {
      throw new Error('A security rule with the name "' + name + '" has already been defined');
    }
    // Make sure the definition argument is an object that has a `deny` property
    if (!definition || !definition.deny) {
      throw new Error('Security.defineRule requires a "deny" function');
    }
    // Add the rule to the running list of rules, providing a default `types` property
    // in case the user did not supply one.
    definedRules[name] = _.extend({types: ["insert", "update", "remove"]}, definition);
  },
  applyRule: function Security_applyRule(name, collections, options) {
    // Make sure a rule with the given name exists
    if (!_.has(definedRules, name)) {
      throw new Error('There is no security rule with the name "' + name + '"');
    }
    // Make sure the `collections` argument is either a `Mongo.Collection` instance or
    // an array of them. If it's a single collection, convert it to a one-item array.
    if (!_.isArray(collections)) {
      if (collections instanceof Mongo.Collection) {
        collections = [collections];
      } else {
        throw new Error("The collections argument must be a Mongo.Collection instance or an array of them");
      }
    }
    // Get the requested rule definition
    var rule = definedRules[name];
    // If we haven't yet done so, set up a default, permissive `allow` function for all of
    // the given collections and types. We control all security through `deny` functions only, but
    // there must first be at least one `allow` function for each collection or all writes
    // will be denied.
    ensureDefaultAllow(collections, rule.types);
    // Add the rule's deny function for all given collections
    addFuncForAll(collections, "deny", rule.types, rule.fetch, function () {
      var args = _.toArray(arguments);
      return rule.deny.apply(this, [options].concat(args));
    });
  }
};
