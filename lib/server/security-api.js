// The `Security` object is exported and provides the package API
Security = {
  // Putting these on the exported object allows package users to override if necessary
  errorMessages: {
    multipleCan: 'You may not combine more than one insert, update, or remove on a Security.can chain',
    notAllowed: 'Action not allowed',
    requiresDeny: 'Security.defineMethod requires a "deny" function',
    collectionsArg: 'The collections argument must be a Mongo.Collection instance or an array of them',
    noCollectionOrType: 'At a minimum, you must call permit and collections methods for a security rule.',
    updateArgs: 'The update method for Security.can requires two arguments, id and modifier'
  },
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
  Check: function SecurityCheckConstructor(userId) {
    this.userId = userId || null;
  },
  can: function can(userId) {
    return new Security.Check(userId);
  },
  defineMethod: function securityDefineMethod(name, definition) {
    // Check whether a rule with the given name already exists; can't overwrite
    if (Security.Rule.prototype[name]) {
      throw new Error('A security method with the name "' + name + '" has already been defined');
    }
    // Make sure the definition argument is an object that has a `deny` property
    if (!definition || !definition.deny) {
      throw new Error(Security.errorMessages.requiresDeny);
    }
    // Wrap transform, if provided
    if (definition.transform) {
      definition.transform = LocalCollection.wrapTransform(definition.transform);
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
  if (!_.isArray(collections)) collections = [collections];

  // Keep list keyed by collection name
  _.each(collections, function (collection) {
    if (!(collection instanceof Mongo.Collection) &&
        // CollectionFS has underlying collection on `files` property
       !(collection.files instanceof Mongo.Collection)) {
      throw new Error(Security.errorMessages.collectionsArg);
    }
    // CollectionFS has underlying collection on `files` property
    var n = getCollectionName(collection);
    rulesByCollection[n] = rulesByCollection[n] || [];
    rulesByCollection[n].push(self);
  });

  self._collections = collections;

  return self;
};

Security.Rule.prototype.apply = function () {
  var self = this;

  if (!self._collections || !self._types) {
    throw new Error(Security.errorMessages.noCollectionOrType);
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

Security.Rule.prototype.deny = function (type, collection, args) {
  var self = this;
  // Loop through all defined restrictions. Restrictions are additive for this chained
  // rule, so if any deny function returns true, this function should return true.
  return _.any(self._restrictions, function (restriction) {
    var doc, transform = restriction.definition.transform;

    // If transform is a function, apply that
    if (typeof transform === 'function') {
      if (type === 'insert') {
        doc = EJSON.clone(args[1]);
        // The wrapped transform requires an _id, but we
        // don't have access to the generatedId from Meteor API,
        // so we'll fudge one and then remove it.
        doc._id = Random.id();
      } else {
        doc = args[1];
      }
      args[1] = transform(doc);
      if (type === 'insert') {
        delete args[1]._id;
      }
    }

    // If not transform: null, apply the collection transform
    else if (transform !== null && typeof collection._transform === 'function') {
      if (type === 'insert') {
        doc = EJSON.clone(args[1]);
        // The wrapped transform requires an _id, but we
        // don't have access to the generatedId from Meteor API,
        // so we'll fudge one and then remove it.
        doc._id = Random.id();
      } else {
        doc = args[1];
      }
      args[1] = collection._transform(doc);
      if (type === 'insert') {
        delete args[1]._id;
      }
    }

    return restriction.definition.deny.apply(this, [type, restriction.arg].concat(args));
  });
};

Mongo.Collection.prototype.permit = function (types) {
  return Security.permit(types).collections(this);
};

// Security.Check prototypes
Security.Check.prototype.for = function (collection) {
  var self = this;
  self.collection = collection;
  return self;
};

['insert', 'update', 'remove'].forEach(function (type) {
  Security.Check.prototype[type] = function () {
    var self = this;
    if (self.type) throw new Error(Security.errorMessages.multipleCan);
    self.type = type;
    self.args = _.toArray(arguments);
    // Compute and add fields argument for update type
    if (type === 'update') {
      if (self.args.length !== 2) throw new Error(Security.errorMessages.updateArgs);
      self.args = [
        self.args[0],
        computeChangedFieldsFromModifier(self.args[1]),
        self.args[1]
      ];
    }
    return self;
  };
});

// Security.can(userId).insert(doc).for(MyCollection).check()
// Security.can(userId).update(id, modifier).for(MyCollection).check()
// Security.can(userId).remove(id).for(MyCollection).check()
Security.Check.prototype.check = function () {
  var self = this;
  return allRulesPass(self.collection, self.type, [self.userId].concat(self.args));
};

// Security.can(userId).insert(doc).for(MyCollection).throw()
// Security.can(userId).update(id, modifier).for(MyCollection).throw()
// Security.can(userId).remove(id).for(MyCollection).throw()
Security.Check.prototype.throw = function () {
  if (!this.check()) throw new Meteor.Error('access-denied', Security.errorMessages.notAllowed);
};
