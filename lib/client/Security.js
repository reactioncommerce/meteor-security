// We only stub on the client to prevent errors if putting in common code

Security = {
  // the starting point of the chain
  permit: function permit() {
    return new Security.Rule();
  },
  can: function can() {
    return new Security.Check();
  },
  defineMethod: function securityDefineMethod(name) {
    // Check whether a rule with the given name already exists; can't overwrite
    if (Security.Rule.prototype[name]) {
      throw new Error('A security method with the name "' + name + '" has already been defined');
    }
    Security.Rule.prototype[name] = function () {
      return this;
    };
  }
};

Mongo.Collection.prototype.permit = function () {
  return Security.permit().collections(this);
};
