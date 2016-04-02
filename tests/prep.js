// Prep is done on both client and server because it should work to define security in common code

collectionNames = [
  "control",
  "allowAnyone",
  "allowAnyoneToInsert",
  "allowAnyoneToUpdate",
  "allowAnyoneToRemove",
  "allowNoOne",
  "allowNoOneToInsert",
  "allowNoOneToUpdate",
  "allowNoOneToRemove",
  "allowOnlyLoggedIn",
  "allowOnlyLoggedInToInsert",
  "allowOnlyLoggedInToUpdate",
  "allowOnlyLoggedInToRemove",
  "allowOnlyUserId",
  "allowOnlyUserIdToInsert",
  "allowOnlyUserIdToUpdate",
  "allowOnlyUserIdToRemove",
  "allowOnlyUserIdToRead",
  "advanced1",
  "ruleTransform",
  "testFetch"
];

Collections = {};

_.each(collectionNames, function (name) {
  Collections[name] = new Mongo.Collection(name);
});

Collections.transformed = new Mongo.Collection('transformed', {
  transform: function (doc) {
    doc.propAddedByCollectionTransform = true;
    return doc;
  }
});

Collections.skipTransform = new Mongo.Collection('skipTransform', {
  transform: function (doc) {
    doc.propAddedByCollectionTransform = true;
    return doc;
  }
});

if (Meteor.isServer) {

  // See https://github.com/meteor/meteor/tree/master/packages/ddp-rate-limiter
  Accounts.removeDefaultRateLimit();

  Meteor.methods({
    addUserToRole: function (role) {
      Roles.addUsersToRoles(this.userId, role);
    },
    seed: function () {
      _.each(collectionNames, function (name) {
        if (!Collections[name].findOne({_id: "test"})) {
          Collections[name].insert({_id: "test"});
        }
        if (!Collections[name].findOne({_id: "test2"})) {
          Collections[name].insert({_id: "test2"});
        }
        if (!Collections[name].findOne({_id: "test3"})) {
          Collections[name].insert({_id: "test3"});
        }
      });
    }
  });

  //allowOnlyUserId

  var testUserId = Meteor.users.findOne({username: 'jimmy'});
  if (testUserId) {
    testUserId = testUserId._id;
  } else {
    testUserId = Accounts.createUser({username: 'jimmy', password: 'jimmy'});
  }

  Collections.allowOnlyUserId.permit(['insert', 'update', 'remove']).ifHasUserId(testUserId).allowInClientCode();

  Collections.allowOnlyUserIdToInsert.permit(['insert']).ifHasUserId(testUserId).allowInClientCode();

  Collections.allowOnlyUserIdToUpdate.permit(['update']).ifHasUserId(testUserId).allowInClientCode();

  Collections.allowOnlyUserIdToRemove.permit(['remove']).ifHasUserId(testUserId).allowInClientCode();
}

// allowOnlyUserIdToRead

Security.permit('read').collections(Collections.allowOnlyUserIdToRead).ifHasUserId(testUserId).allowInClientCode();


// We do the rest of this in common code to ensure that the client stubs are properly
// preventing errors when these are called in client code.

//allowAnyone
Collections.allowAnyone.permit(['insert', 'update', 'remove']).allowInClientCode();

Collections.allowAnyoneToInsert.permit(['insert']).allowInClientCode();

Collections.allowAnyoneToUpdate.permit(['update']).allowInClientCode();

Collections.allowAnyoneToRemove.permit(['remove']).allowInClientCode();

//allowNoOne

Collections.allowNoOne.permit(['insert', 'update', 'remove']).never().allowInClientCode();

Collections.allowNoOneToInsert.permit(['insert']).never().allowInClientCode();

Collections.allowNoOneToUpdate.permit(['update']).never().allowInClientCode();

Collections.allowNoOneToRemove.permit(['remove']).never().allowInClientCode();

//allowOnlyLoggedIn

Collections.allowOnlyLoggedIn.permit(['insert', 'update', 'remove']).ifLoggedIn().allowInClientCode();

Collections.allowOnlyLoggedInToInsert.permit(['insert']).ifLoggedIn().allowInClientCode();

Collections.allowOnlyLoggedInToUpdate.permit(['update']).ifLoggedIn().allowInClientCode();

Collections.allowOnlyLoggedInToRemove.permit(['remove']).ifLoggedIn().allowInClientCode();

//advanced1
Collections.advanced1.permit(['insert', 'update']).ifHasRole('admin').allowInClientCode();
Collections.advanced1.permit('update').ifLoggedIn().exceptProps(['author', 'date']).allowInClientCode();

//transformed
Security.defineMethod("ifTransformedByCollection", {
  fetch: [],
  allow: function (type, arg, userId, doc) {
    return doc.propAddedByCollectionTransform === true;
  }
});

Collections.transformed.permit(['insert', 'update', 'remove']).ifTransformedByCollection().allowInClientCode();

//skipTransform
Security.defineMethod("ifNotTransformedByCollection", {
  fetch: [],
  transform: null,
  allow: function (type, arg, userId, doc) {
    return doc.propAddedByCollectionTransform !== true;
  }
});

Collections.skipTransform.permit(['insert', 'update', 'remove']).ifNotTransformedByCollection().allowInClientCode();

//ruleTransform
Security.defineMethod("ifTransformedByRule", {
  fetch: [],
  transform: function (doc) {
    doc.propAddedByRuleTransform = true;
    return doc;
  },
  allow: function (type, arg, userId, doc) {
    return doc.propAddedByRuleTransform === true;
  }
});

Collections.ruleTransform.permit(['insert', 'update', 'remove']).ifTransformedByRule().allowInClientCode();

//testFetch
Security.defineMethod("ifFetchFoo", {
  fetch: ['foo'],
  allow: function (type, arg, userId, doc) {
    return doc.hasOwnProperty('foo') && doc.hasOwnProperty('bar') && !doc.hasOwnProperty('noFetch');
  }
});

Security.defineMethod("ifFetchArg", {
  fetch: function (arg) {
    return arg;
  },
  allow: function (type, arg, userId, doc) {
    return doc.hasOwnProperty('foo') && doc.hasOwnProperty('bar') && !doc.hasOwnProperty('noFetch');
  }
});

Collections.testFetch.permit(['update', 'remove', 'read']).ifFetchFoo().ifFetchArg(['bar']);
