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
  "advanced1",
  "ruleTransform"
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

  //allowAnyone

  Collections.allowAnyone.permit(['insert', 'update', 'remove']).apply();

  Collections.allowAnyoneToInsert.permit(['insert']).apply();

  Collections.allowAnyoneToUpdate.permit(['update']).apply();

  Collections.allowAnyoneToRemove.permit(['remove']).apply();

  //allowNoOne

  Collections.allowNoOne.permit(['insert', 'update', 'remove']).never().apply();

  Collections.allowNoOneToInsert.permit(['insert']).never().apply();

  Collections.allowNoOneToUpdate.permit(['update']).never().apply();

  Collections.allowNoOneToUpdate.permit(['remove']).never().apply();

  //allowOnlyLoggedIn

  Collections.allowOnlyLoggedIn.permit(['insert', 'update', 'remove']).ifLoggedIn().apply();

  Collections.allowOnlyLoggedInToInsert.permit(['insert']).ifLoggedIn().apply();

  Collections.allowOnlyLoggedInToUpdate.permit(['update']).ifLoggedIn().apply();

  Collections.allowOnlyLoggedInToRemove.permit(['remove']).ifLoggedIn().apply();

  //allowOnlyUserId

  var testUserId = Meteor.users.findOne({username: 'jimmy'});
  if (testUserId) {
    testUserId = testUserId._id;
  } else {
    testUserId = Accounts.createUser({username: 'jimmy', password: 'jimmy'});
  }

  Collections.allowOnlyUserId.permit(['insert', 'update', 'remove']).ifHasUserId(testUserId).apply();

  Collections.allowOnlyUserIdToInsert.permit(['insert']).ifHasUserId(testUserId).apply();

  Collections.allowOnlyUserIdToUpdate.permit(['update']).ifHasUserId(testUserId).apply();

  Collections.allowOnlyUserIdToRemove.permit(['remove']).ifHasUserId(testUserId).apply();

  //advanced1
  Collections.advanced1.permit(['insert', 'update']).ifHasRole('admin').apply();
  Collections.advanced1.permit('update').ifLoggedIn().exceptProps(['author', 'date']).apply();

  //transformed
  Security.defineMethod("ifTransformedByCollection", {
    fetch: [],
    deny: function (type, arg, userId, doc) {
      return doc.propAddedByCollectionTransform !== true;
    }
  });

  Collections.transformed.permit(['insert', 'update', 'remove']).ifTransformedByCollection().apply();

  //skipTransform
  Security.defineMethod("ifNotTransformedByCollection", {
    fetch: [],
    transform: null,
    deny: function (type, arg, userId, doc) {
      return doc.propAddedByCollectionTransform === true;
    }
  });

  Collections.skipTransform.permit(['insert', 'update', 'remove']).ifNotTransformedByCollection().apply();

  //ruleTransform
  Security.defineMethod("ifTransformedByRule", {
    fetch: [],
    transform: function (doc) {
      doc.propAddedByRuleTransform = true;
      return doc;
    },
    deny: function (type, arg, userId, doc) {
      return doc.propAddedByRuleTransform !== true;
    }
  });

  Collections.ruleTransform.permit(['insert', 'update', 'remove']).ifTransformedByRule().apply();

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

}
