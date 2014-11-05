// Prep is done on both client and server because it should work to define security in common code

function seed(name) {
  if (Meteor.isServer) {
    if (!Collections[name].findOne({_id: "test"})) {
      Collections[name].insert({_id: "test"});
    }
    if (!Collections[name].findOne({_id: "test2"})) {
      Collections[name].insert({_id: "test2"});
    }
    if (!Collections[name].findOne({_id: "test3"})) {
      Collections[name].insert({_id: "test3"});
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
  "allowNoOneToRemove",
  "advanced1",
  "allowOnlyLoggedIn",
  "allowOnlyLoggedInToInsert",
  "allowOnlyLoggedInToUpdate",
  "allowOnlyLoggedInToRemove"//,
  // TODO add tests for these
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

  //advanced1
  Collections.advanced1.permit(['insert', 'update']).ifHasRole('admin').apply();
  Collections.advanced1.permit('update').ifLoggedIn().exceptProps(['author', 'date']).apply();

  Meteor.methods({
    addUserToRole: function (role) {
      Roles.addUsersToRoles(this.userId, role);
    }
  });

}
