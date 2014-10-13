// Prep is done on both client and server because it should work to define security in common code

function seed(name) {
  if (Meteor.isServer) {
    if (!Collections[name].findOne({_id: "test"})) {
      Collections[name].insert({_id: "test"});
    }
  }
}

collectionNames = [
  "control",
  "allowAnyone",
  "allowAnyoneToInsert",
  "allowAnyoneToUpdate",
  "allowAnyoneToRemove",
  "allowNoOne",
  "allowNoOneToInsert",
  "allowNoOneToUpdate",
  "allowNoOneToRemove"//,
  // TODO add tests for these eventually
  // "allowOnlyLoggedIn",
  // "allowOnlyLoggedInToInsert",
  // "allowOnlyLoggedInToUpdate",
  // "allowOnlyLoggedInToRemove",
  // "allowOnlyUserId",
  // "allowOnlyUserIdToInsert",
  // "allowOnlyUserIdToUpdate",
  // "allowOnlyUserIdToRemove",
  // "allowOnlyRoles",
  // "allowOnlyRolesToInsert",
  // "allowOnlyRolesToUpdate",
  // "allowOnlyRolesToRemove"
];

Collections = {};

_.each(collectionNames, function (name) {
  Collections[name] = new Mongo.Collection(name);
  seed(name);
});

//allowAnyone

Security.clientsMay(['insert', 'update', 'remove']).collections(Collections.allowAnyone).apply();

Security.clientsMay(['insert']).collections(Collections.allowAnyoneToInsert).apply();

Security.clientsMay(['update']).collections(Collections.allowAnyoneToUpdate).apply();

Security.clientsMay(['remove']).collections(Collections.allowAnyoneToRemove).apply();

//allowNoOne

Security.clientsMay(['insert', 'update', 'remove']).collections(Collections.allowNoOne).never().apply();

Security.clientsMay(['insert']).collections(Collections.allowNoOneToInsert).never().apply();

Security.clientsMay(['update']).collections(Collections.allowNoOneToUpdate).never().apply();

Security.clientsMay(['remove']).collections(Collections.allowNoOneToRemove).never().apply();
