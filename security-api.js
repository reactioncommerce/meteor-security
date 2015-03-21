// The `Security` object is exported and provides the package API
Security = {
  Rule: function SecurityRuleConstructor(types) {
    var self = this;

    if (!_.isArray(types)) {
      types = [types];
    }
    self._types = types;
    self._restrictions = [];
  },
  // the starting point of the chain
  permit: function permit(types) {
    return new Security.Rule(types);
  },
  defineMethod: function securityDefineMethod(name, definition) {
    // Check whether a rule with the given name already exists; can't overwrite
    if (Security.Rule.prototype[name]) {
      throw new Error('A security method with the name "' + name + '" has already been defined');
    }
    // Make sure the definition argument is an object that has a `deny` property
    if (!definition || !definition.deny) {
      throw new Error('Security.defineMethod requires a "deny" function');
    }
    Security.Rule.prototype[name] = function (arg) {
      var self = this;
      self._restrictions.push({
        definition: definition,
        arg: arg
      });
      return self;
    };
  }
};

// Security.Rule prototypes
Security.Rule.prototype.collections = function (collections) {
  var self = this;
  // Make sure the `collections` argument is either a `Mongo.Collection` instance or
  // an array of them. If it's a single collection, convert it to a one-item array.
  if (!_.isArray(collections)) {
    if (collections instanceof Mongo.Collection) {
      collections = [collections];
    } else {
      throw new Error("The collections argument must be a Mongo.Collection instance or an array of them");
    }
  }

  self._collections = collections;

  // Keep list keyed by collection name
  _.each(collections, function (collection) {
    var n = collection._name;
    rulesByCollection[n] = rulesByCollection[n] || [];
    rulesByCollection[n].push(self);
  });

  return self;
};

Security.Rule.prototype.apply = function () {
  var self = this;

  if (!self._collections || !self._types) {
    throw new Error("At a minimum, you must call permit and collections methods for a security rule.");
  }

  // If we haven't yet done so, set up a default, permissive `allow` function for all of
  // the given collections and types. We control all security through `deny` functions only, but
  // there must first be at least one `allow` function for each collection or all writes
  // will be denied.
  ensureDefaultAllow(self._collections, self._types);

  // We need a combined `fetch` array. The `fetch` is optional and can be either an array
  // or a function that takes the argument passed to the restriction method and returns an array.
  // TODO for now we can't set fetch accurately; maybe need to adjust API so that we "apply" only
  // after we've defined all rules
  //var fetch = [];
  //_.each(self._restrictions, function (restriction) {
  //  if (_.isArray(restriction.definition.fetch)) {
  //    fetch = fetch.concat(restriction.definition.fetch);
  //  } else if (typeof restriction.definition.fetch === "function") {
  //    fetch = fetch.concat(restriction.definition.fetch(restriction.arg));
  //  }
  //});

  ensureSecureDeny(self._collections, self._types);

};

Security.Rule.prototype.deny = function (type, args) {
  var self = this;
  // Loop through all defined restrictions. Restrictions are additive for this chained
  // rule, so if any deny function returns true, this function should return true.
  return _.any(self._restrictions, function (restriction) {
    return restriction.definition.deny.apply(this, [type, restriction.arg].concat(args));
  });
};

Mongo.Collection.prototype.permit = function (types) {
  return Security.permit(types).collections(this);
};
