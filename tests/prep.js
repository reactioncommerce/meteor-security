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

  if (name !== "control")
    Security.applyRule(name, Collections[name]);

  seed(name);
});

// Combinations

Collections.allowAllExceptInsert = new Mongo.Collection("allowAllExceptInsert");
seed("allowAllExceptInsert");
Security.applyRule("allowAnyone", Collections.allowAllExceptInsert);
Security.applyRule("allowNoOneToInsert", Collections.allowAllExceptInsert);

Collections.allowAllExceptUpdate = new Mongo.Collection("allowAllExceptUpdate");
seed("allowAllExceptUpdate");
Security.applyRule("allowAnyone", Collections.allowAllExceptUpdate);
Security.applyRule("allowNoOneToUpdate", Collections.allowAllExceptUpdate);

Collections.allowAllExceptRemove = new Mongo.Collection("allowAllExceptRemove");
seed("allowAllExceptRemove");
Security.applyRule("allowAnyone", Collections.allowAllExceptRemove);
Security.applyRule("allowNoOneToRemove", Collections.allowAllExceptRemove);

Collections.allowOnlyInsertAndRemove = new Mongo.Collection("allowOnlyInsertAndRemove");
seed("allowOnlyInsertAndRemove");
Security.applyRule("allowAnyoneToInsert", Collections.allowOnlyInsertAndRemove);
Security.applyRule("allowAnyoneToRemove", Collections.allowOnlyInsertAndRemove);

Collections.allowOnlyInsertAndUpdate = new Mongo.Collection("allowOnlyInsertAndUpdate");
seed("allowOnlyInsertAndUpdate");
Security.applyRule("allowAnyoneToInsert", Collections.allowOnlyInsertAndUpdate);
Security.applyRule("allowAnyoneToUpdate", Collections.allowOnlyInsertAndUpdate);

Collections.allowOnlyUpdateAndRemove = new Mongo.Collection("allowOnlyUpdateAndRemove");
seed("allowOnlyUpdateAndRemove");
Security.applyRule("allowAnyoneToUpdate", Collections.allowOnlyUpdateAndRemove);
Security.applyRule("allowAnyoneToRemove", Collections.allowOnlyUpdateAndRemove);
