/*
 * This file defines built-in restriction methods
 */

/*
 * No one
 */

Security.defineMethod("never", {
  fetch: [],
  deny: function (type, arg) {
    return true;
  }
});

/*
 * Logged In
 */

Security.defineMethod("ifLoggedIn", {
  fetch: [],
  deny: function (type, arg, userId) {
    return !userId;
  }
});

/*
 * Specific User ID
 */

Security.defineMethod("ifHasUserId", {
  fetch: [],
  deny: function (type, arg, userId) {
    return userId !== arg;
  }
});

/*
 * Specific Roles
 */

if (Package && Package["alanning:roles"]) {

  var Roles = Package["alanning:roles"].Roles;

  Security.defineMethod("ifHasRole", {
    fetch: [],
    deny: function (type, arg, userId) {
      return !Roles.userIsInRole(userId, arg);
    }
  });

}

/*
 * Specific Properties
 */

Security.defineMethod("onlyProps", {
  fetch: [],
  deny: function (type, arg, userId, doc, fieldNames) {
    if (!_.isArray(arg)) {
      arg = [arg];
    }

    fieldNames = fieldNames || _.keys(doc);

    return !_.every(fieldNames, function (fieldName) {
      return _.contains(arg, fieldName);
    });
  }
});

Security.defineMethod("exceptProps", {
  fetch: [],
  deny: function (type, arg, userId, doc, fieldNames) {
    if (!_.isArray(arg)) {
      arg = [arg];
    }

    fieldNames = fieldNames || _.keys(doc);

    return _.any(fieldNames, function (fieldName) {
      return _.contains(arg, fieldName);
    });
  }
});
