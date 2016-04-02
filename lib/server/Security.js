// The `Security` object is exported and provides the package API
Security = {
  // Putting these on the exported object allows package users to override if necessary
  errorMessages: {
    multipleCan: 'You may not combine more than one insert, update, or remove on a Security.can chain',
    notAllowed: 'Action not allowed',
    requiresDefinition: 'Security.defineMethod requires a "definition" argument',
    requiresAllow: 'Security.defineMethod requires an "allow" function',
    collectionsArg: 'The collections argument must be a Mongo.Collection instance or an array of them',
    noCollectionOrType: 'At a minimum, you must call permit and collections methods for a security rule.',
  },
  // the starting point of the chain
  permit: function permit(types) {
    return new Security.Rule(types);
  },
  can: function can(userId) {
    return new Security.Check(userId);
  },
  defineMethod: function securityDefineMethod(name, definition) {
    // Check whether a rule with the given name already exists; can't overwrite
    if (Security.Rule.prototype[name]) {
      throw new Error('A security method with the name "' + name + '" has already been defined');
    }
    if (!definition) throw new Error(Security.errorMessages.requiresDefinition);
    // If "deny" is used, convert to "allow" for backwards compatibility
    if (definition.deny) {
      definition.allow = (...args) => {
        return !definition.deny(...args);
      };
    }
    // Make sure the definition argument is an object that has an `allow` property
    if (!definition.allow) throw new Error(Security.errorMessages.requiresAllow);
    // Wrap transform, if provided
    if (definition.transform) {
      definition.transform = LocalCollection.wrapTransform(definition.transform);
    }
    Security.Rule.prototype[name] = function (arg) {
      this._restrictions.push({
        definition,
        arg,
      });
      return this;
    };
  }
};

Mongo.Collection.prototype.permit = function (types) {
  return Security.permit(types).collections(this);
};
