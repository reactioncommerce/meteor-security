// We only stub on the client to prevent errors if putting in common code

Security = {
  Rule: function () {},
  // the starting point of the chain
  permit: function permit() {
    return new Security.Rule();
  },
  Check: function () {},
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

// Security.Rule prototypes
Security.Rule.prototype.collections = function () {
  return this;
};

Security.Rule.prototype.apply = function () {};

Mongo.Collection.prototype.permit = function () {
  return Security.permit().collections(this);
};

// Security.Check prototypes
Security.Check.prototype.for = function () {
  return this;
};

['insert', 'update', 'remove'].forEach(function (type) {
  Security.Check.prototype[type] = function () {
    return this;
  };
});

Security.Check.prototype.check = function () {
  return true;
};

Security.Check.prototype.throw = function () {};
