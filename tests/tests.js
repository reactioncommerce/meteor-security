// Tests are run only on the client because we are only concerned about client-initiated DB operations

/*
 * control
 */

Tinytest.addAsync('Security - control - insert', function(test, next) {
  Collections.control.insert({}, function (error, result) {
    test.isTrue(!!error);
    next();
  });
});

Tinytest.addAsync('Security - control - update', function(test, next) {
  Collections.control.update("test", {$set: {foo: "bar"}}, function (error, result) {
    test.isTrue(!!error);
    next();
  });
});

Tinytest.addAsync('Security - control - remove', function(test, next) {
  Collections.control.remove("test", function (error, result) {
    test.isTrue(!!error);
    next();
  });
});

/*
 * allowAnyone
 */

Tinytest.addAsync('Security - allowAnyone - insert', function(test, next) {
  Collections.allowAnyone.insert({}, function (error, result) {
    test.isFalse(!!error);
    next();
  });
});

Tinytest.addAsync('Security - allowAnyone - update', function(test, next) {
  Collections.allowAnyone.update("test", {$set: {foo: "bar"}}, function (error, result) {
    test.isFalse(!!error);
    next();
  });
});

Tinytest.addAsync('Security - allowAnyone - remove', function(test, next) {
  Collections.allowAnyone.remove("test", function (error, result) {
    test.isFalse(!!error);
    next();
  });
});

/*
 * allowAnyoneToInsert
 */

Tinytest.addAsync('Security - allowAnyoneToInsert - insert', function(test, next) {
  Collections.allowAnyoneToInsert.insert({}, function (error, result) {
    test.isFalse(!!error);
    next();
  });
});

Tinytest.addAsync('Security - allowAnyoneToInsert - update', function(test, next) {
  Collections.allowAnyoneToInsert.update("test", {$set: {foo: "bar"}}, function (error, result) {
    test.isTrue(!!error);
    next();
  });
});

Tinytest.addAsync('Security - allowAnyoneToInsert - remove', function(test, next) {
  Collections.allowAnyoneToInsert.remove("test", function (error, result) {
    test.isTrue(!!error);
    next();
  });
});

/*
 * allowAnyoneToUpdate
 */

Tinytest.addAsync('Security - allowAnyoneToUpdate - insert', function(test, next) {
  Collections.allowAnyoneToUpdate.insert({}, function (error, result) {
    test.isTrue(!!error);
    next();
  });
});

Tinytest.addAsync('Security - allowAnyoneToUpdate - update', function(test, next) {
  Collections.allowAnyoneToUpdate.update("test", {$set: {foo: "bar"}}, function (error, result) {
    test.isFalse(!!error);
    next();
  });
});

Tinytest.addAsync('Security - allowAnyoneToUpdate - remove', function(test, next) {
  Collections.allowAnyoneToUpdate.remove("test", function (error, result) {
    test.isTrue(!!error);
    next();
  });
});

/*
 * allowAnyoneToRemove
 */

Tinytest.addAsync('Security - allowAnyoneToRemove - insert', function(test, next) {
  Collections.allowAnyoneToRemove.insert({}, function (error, result) {
    test.isTrue(!!error);
    next();
  });
});

Tinytest.addAsync('Security - allowAnyoneToRemove - update', function(test, next) {
  Collections.allowAnyoneToRemove.update("test", {$set: {foo: "bar"}}, function (error, result) {
    test.isTrue(!!error);
    next();
  });
});

Tinytest.addAsync('Security - allowAnyoneToRemove - remove', function(test, next) {
  Collections.allowAnyoneToRemove.remove("test", function (error, result) {
    test.isFalse(!!error);
    next();
  });
});

/*
 * allowNoOne
 */

Tinytest.addAsync('Security - allowNoOne - insert', function(test, next) {
  Collections.allowNoOne.insert({}, function (error, result) {
    test.isTrue(!!error);
    next();
  });
});

Tinytest.addAsync('Security - allowNoOne - update', function(test, next) {
  Collections.allowNoOne.update("test", {$set: {foo: "bar"}}, function (error, result) {
    test.isTrue(!!error);
    next();
  });
});

Tinytest.addAsync('Security - allowNoOne - remove', function(test, next) {
  Collections.allowNoOne.remove("test", function (error, result) {
    test.isTrue(!!error);
    next();
  });
});

/*
 * allowNoOneToInsert
 */

Tinytest.addAsync('Security - allowNoOneToInsert - insert', function(test, next) {
  Collections.allowNoOneToInsert.insert({}, function (error, result) {
    test.isTrue(!!error);
    next();
  });
});

Tinytest.addAsync('Security - allowNoOneToInsert - update', function(test, next) {
  Collections.allowNoOneToInsert.update("test", {$set: {foo: "bar"}}, function (error, result) {
    test.isTrue(!!error);
    next();
  });
});

Tinytest.addAsync('Security - allowNoOneToInsert - remove', function(test, next) {
  Collections.allowNoOneToInsert.remove("test", function (error, result) {
    test.isTrue(!!error);
    next();
  });
});

/*
 * allowNoOneToUpdate
 */

Tinytest.addAsync('Security - allowNoOneToUpdate - insert', function(test, next) {
  Collections.allowNoOneToUpdate.insert({}, function (error, result) {
    test.isTrue(!!error);
    next();
  });
});

Tinytest.addAsync('Security - allowNoOneToUpdate - update', function(test, next) {
  Collections.allowNoOneToUpdate.update("test", {$set: {foo: "bar"}}, function (error, result) {
    test.isTrue(!!error);
    next();
  });
});

Tinytest.addAsync('Security - allowNoOneToUpdate - remove', function(test, next) {
  Collections.allowNoOneToUpdate.remove("test", function (error, result) {
    test.isTrue(!!error);
    next();
  });
});

/*
 * allowNoOneToRemove
 */

Tinytest.addAsync('Security - allowNoOneToRemove - insert', function(test, next) {
  Collections.allowNoOneToRemove.insert({}, function (error, result) {
    test.isTrue(!!error);
    next();
  });
});

Tinytest.addAsync('Security - allowNoOneToRemove - update', function(test, next) {
  Collections.allowNoOneToRemove.update("test", {$set: {foo: "bar"}}, function (error, result) {
    test.isTrue(!!error);
    next();
  });
});

Tinytest.addAsync('Security - allowNoOneToRemove - remove', function(test, next) {
  Collections.allowNoOneToRemove.remove("test", function (error, result) {
    test.isTrue(!!error);
    next();
  });
});

/*
 * allowOnlyLoggedIn
 */

Tinytest.addAsync('Security - allowOnlyLoggedIn - insert', function(test, next) {
  Meteor.logout(function () {
    Collections.allowOnlyLoggedIn.insert({}, function (error, result) {
      test.isTrue(!!error);
      createAndLogIn(null, function () {
        Collections.allowOnlyLoggedIn.insert({}, function (error, result) {
          test.isFalse(!!error);
          next();
        });
      });
    });
  });
});

Tinytest.addAsync('Security - allowOnlyLoggedIn - update', function(test, next) {
  Meteor.logout(function () {
    Collections.allowOnlyLoggedIn.update("test2", {$set: {foo: "bar"}}, function (error, result) {
      test.isTrue(!!error);
      createAndLogIn(null, function () {
        Collections.allowOnlyLoggedIn.update("test3", {$set: {foo: "bar"}}, function (error, result) {
          test.isFalse(!!error);
          next();
        });
      });
    });
  });
});

Tinytest.addAsync('Security - allowOnlyLoggedIn - remove', function(test, next) {
  Meteor.logout(function () {
    Collections.allowOnlyLoggedIn.remove("test2", function (error, result) {
      test.isTrue(!!error);
      createAndLogIn(null, function () {
        Collections.allowOnlyLoggedIn.remove("test3", function (error, result) {
          test.isFalse(!!error);
          next();
        });
      });
    });
  });
});

/*
 * allowOnlyLoggedInToInsert
 */

Tinytest.addAsync('Security - allowOnlyLoggedInToInsert - insert', function(test, next) {
  Meteor.logout(function () {
    Collections.allowOnlyLoggedInToInsert.insert({}, function (error, result) {
      test.isTrue(!!error);
      createAndLogIn(null, function () {
        Collections.allowOnlyLoggedInToInsert.insert({foo: "bar"}, function (error, result) {
          test.isFalse(!!error);
          next();
        });
      });
    });
  });
});

Tinytest.addAsync('Security - allowOnlyLoggedInToInsert - update', function(test, next) {
  Meteor.logout(function () {
    Collections.allowOnlyLoggedInToInsert.update("test", {$set: {foo: "bar"}}, function (error, result) {
      test.isTrue(!!error);
      createAndLogIn(null, function () {
        Collections.allowOnlyLoggedInToInsert.update("test", {$set: {foo: "bar"}}, function (error, result) {
          test.isTrue(!!error);
          next();
        });
      });
    });
  });
});

Tinytest.addAsync('Security - allowOnlyLoggedInToInsert - remove', function(test, next) {
  Meteor.logout(function () {
    Collections.allowOnlyLoggedInToInsert.remove("test", function (error, result) {
      test.isTrue(!!error);
      createAndLogIn(null, function () {
        Collections.allowOnlyLoggedInToInsert.remove("test", function (error, result) {
          test.isTrue(!!error);
          next();
        });
      });
    });
  });
});

/*
 * allowOnlyLoggedInToUpdate
 */

Tinytest.addAsync('Security - allowOnlyLoggedInToUpdate - insert', function(test, next) {
  Meteor.logout(function () {
    Collections.allowOnlyLoggedInToUpdate.insert({}, function (error, result) {
      test.isTrue(!!error);
      createAndLogIn(null, function () {
        Collections.allowOnlyLoggedInToUpdate.insert({foo: "bar"}, function (error, result) {
          test.isTrue(!!error);
          next();
        });
      });
    });
  });
});

Tinytest.addAsync('Security - allowOnlyLoggedInToUpdate - update', function(test, next) {
  Meteor.logout(function () {
    Collections.allowOnlyLoggedInToUpdate.update("test", {$set: {foo: "bar"}}, function (error, result) {
      test.isTrue(!!error);
      createAndLogIn(null, function () {
        Collections.allowOnlyLoggedInToUpdate.update("test", {$set: {foo: "bar"}}, function (error, result) {
          test.isFalse(!!error);
          next();
        });
      });
    });
  });
});

Tinytest.addAsync('Security - allowOnlyLoggedInToUpdate - remove', function(test, next) {
  Meteor.logout(function () {
    Collections.allowOnlyLoggedInToUpdate.remove("test", function (error, result) {
      test.isTrue(!!error);
      createAndLogIn(null, function () {
        Collections.allowOnlyLoggedInToUpdate.remove("test", function (error, result) {
          test.isTrue(!!error);
          next();
        });
      });
    });
  });
});

/*
 * allowOnlyLoggedInToRemove
 */

Tinytest.addAsync('Security - allowOnlyLoggedInToRemove - insert', function(test, next) {
  Meteor.logout(function () {
    Collections.allowOnlyLoggedInToRemove.insert({}, function (error, result) {
      test.isTrue(!!error);
      createAndLogIn(null, function () {
        Collections.allowOnlyLoggedInToRemove.insert({foo: "bar"}, function (error, result) {
          test.isTrue(!!error);
          next();
        });
      });
    });
  });
});

Tinytest.addAsync('Security - allowOnlyLoggedInToRemove - update', function(test, next) {
  Meteor.logout(function () {
    Collections.allowOnlyLoggedInToRemove.update("test", {$set: {foo: "bar"}}, function (error, result) {
      test.isTrue(!!error);
      createAndLogIn(null, function () {
        Collections.allowOnlyLoggedInToRemove.update("test", {$set: {foo: "bar"}}, function (error, result) {
          test.isTrue(!!error);
          next();
        });
      });
    });
  });
});

Tinytest.addAsync('Security - allowOnlyLoggedInToRemove - remove', function(test, next) {
  Meteor.logout(function () {
    Collections.allowOnlyLoggedInToRemove.remove("test2", function (error, result) {
      test.isTrue(!!error);
      createAndLogIn(null, function () {
        Collections.allowOnlyLoggedInToRemove.remove("test3", function (error, result) {
          test.isFalse(!!error);
          next();
        });
      });
    });
  });
});

/*
 * advanced1
 */

Tinytest.addAsync('Security - advanced1 - insert anonymous', function(test, next) {
  Meteor.logout(function () {
    Collections.advanced1.insert({}, function (error, result) {
      test.isTrue(!!error);
      next();
    });
  });
});

Tinytest.addAsync('Security - advanced1 - insert logged in', function(test, next) {
  createAndLogIn(null, function () {
    Collections.advanced1.insert({foo: "bar"}, function (error, result) {
      test.isTrue(!!error);
      next();
    });
  });
});

Tinytest.addAsync('Security - advanced1 - insert logged in as admin', function(test, next) {
  createAndLogIn("admin", function () {
    Collections.advanced1.insert({}, function (error, result) {
      test.isFalse(!!error);
      next();
    });
  });
});

Tinytest.addAsync('Security - advanced1 - update anonymous', function(test, next) {
  Meteor.logout(function () {
    Collections.advanced1.update("test", {$set: {foo: "bar"}}, function (error, result) {
      test.isTrue(!!error);
      next();
    });
  });
});

Tinytest.addAsync('Security - advanced1 - update logged in', function(test, next) {
  createAndLogIn(null, function () {
    Collections.advanced1.update("test", {$set: {foo: "bar"}}, function (error, result) {
      test.isFalse(!!error);
      next();
    });
  });
});

Tinytest.addAsync('Security - advanced1 - update logged in as admin', function(test, next) {
  createAndLogIn("admin", function () {
    Collections.advanced1.update("test", {$set: {foo: "bar"}}, function (error, result) {
      test.isFalse(!!error);
      next();
    });
  });
});

function createAndLogIn(role, callback) {
  var email = Random.id() + "@example.com";
  Meteor.logout(function () {
    Accounts.createUser({email: email, password: "newPassword"}, function (error) {
      Meteor.loginWithPassword({email: email}, "newPassword", function (error) {
        if (role) {
          Meteor.call("addUserToRole", role, function () {
            callback();
          });
        } else {
          callback();
        }
      });
    });
  });
}
