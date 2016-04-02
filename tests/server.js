function doTest(test, permissions, expect) {
  if (expect) {
    test.isTrue(permissions.check());
  } else {
    test.isFalse(permissions.check());
    test.throws(function () {
      permissions.throw();
    });
  }
}

/*
 * control
 */

Tinytest.add('Security - control - insert', function(test) {
  var permissions = Security.can(null).insert({}).for(Collections.control);
  doTest(test, permissions, false);
});

Tinytest.add('Security - control - update', function(test) {
  var permissions = Security.can(null).update('test', {$set: {foo: "bar"}}).for(Collections.control);
  doTest(test, permissions, false);
});

Tinytest.add('Security - control - remove', function(test) {
  var permissions = Security.can(null).remove('test').for(Collections.control);
  doTest(test, permissions, false);
});

/*
 * allowAnyone
 */

Tinytest.add('Security - allowAnyone - insert', function(test) {
  var permissions = Security.can(null).insert({}).for(Collections.allowAnyone);
  doTest(test, permissions, true);
});

Tinytest.add('Security - allowAnyone - update', function(test) {
  var permissions = Security.can(null).update('test', {$set: {foo: "bar"}}).for(Collections.allowAnyone);
  doTest(test, permissions, true);
});

Tinytest.add('Security - allowAnyone - remove', function(test) {
  var permissions = Security.can(null).remove('test').for(Collections.allowAnyone);
  doTest(test, permissions, true);
});

/*
 * allowAnyoneToInsert
 */

Tinytest.add('Security - allowAnyoneToInsert - insert', function(test) {
  var permissions = Security.can(null).insert({}).for(Collections.allowAnyoneToInsert);
  doTest(test, permissions, true);
});

Tinytest.add('Security - allowAnyoneToInsert - update', function(test) {
  var permissions = Security.can(null).update('test', {$set: {foo: "bar"}}).for(Collections.allowAnyoneToInsert);
  doTest(test, permissions, false);
});

Tinytest.add('Security - allowAnyoneToInsert - remove', function(test) {
  var permissions = Security.can(null).remove('test').for(Collections.allowAnyoneToInsert);
  doTest(test, permissions, false);
});

/*
 * allowAnyoneToUpdate
 */

Tinytest.add('Security - allowAnyoneToUpdate - insert', function(test) {
  var permissions = Security.can(null).insert({}).for(Collections.allowAnyoneToUpdate);
  doTest(test, permissions, false);
});

Tinytest.add('Security - allowAnyoneToUpdate - update', function(test) {
  var permissions = Security.can(null).update('test', {$set: {foo: "bar"}}).for(Collections.allowAnyoneToUpdate);
  doTest(test, permissions, true);
});

Tinytest.add('Security - allowAnyoneToUpdate - remove', function(test) {
  var permissions = Security.can(null).remove('test').for(Collections.allowAnyoneToUpdate);
  doTest(test, permissions, false);
});

/*
 * allowAnyoneToRemove
 */

Tinytest.add('Security - allowAnyoneToRemove - insert', function(test) {
  var permissions = Security.can(null).insert({}).for(Collections.allowAnyoneToRemove);
  doTest(test, permissions, false);
});

Tinytest.add('Security - allowAnyoneToRemove - update', function(test) {
  var permissions = Security.can(null).update('test', {$set: {foo: "bar"}}).for(Collections.allowAnyoneToRemove);
  doTest(test, permissions, false);
});

Tinytest.add('Security - allowAnyoneToRemove - remove', function(test) {
  var permissions = Security.can(null).remove('test').for(Collections.allowAnyoneToRemove);
  doTest(test, permissions, true);
});

/*
 * allowNoOne
 */

Tinytest.add('Security - allowNoOne - insert', function(test) {
  var permissions = Security.can(null).insert({}).for(Collections.allowNoOne);
  doTest(test, permissions, false);
});

Tinytest.add('Security - allowNoOne - update', function(test) {
  var permissions = Security.can(null).update('test', {$set: {foo: "bar"}}).for(Collections.allowNoOne);
  doTest(test, permissions, false);
});

Tinytest.add('Security - allowNoOne - remove', function(test) {
  var permissions = Security.can(null).remove('test').for(Collections.allowNoOne);
  doTest(test, permissions, false);
});

/*
 * allowOnlyLoggedIn
 */

Tinytest.add('Security - allowOnlyLoggedIn - insert', function(test) {
  var permissions = Security.can(null).insert({}).for(Collections.allowOnlyLoggedIn);
  doTest(test, permissions, false);
  permissions = Security.can('userId').insert({}).for(Collections.allowOnlyLoggedIn);
  doTest(test, permissions, true);
});

Tinytest.add('Security - allowOnlyLoggedIn - update', function(test) {
  var permissions = Security.can(null).update('test2', {$set: {foo: "bar"}}).for(Collections.allowOnlyLoggedIn);
  doTest(test, permissions, false);
  permissions = Security.can('userId').update('test2', {$set: {foo: "bar"}}).for(Collections.allowOnlyLoggedIn);
  doTest(test, permissions, true);
});

Tinytest.add('Security - allowOnlyLoggedIn - remove', function(test) {
  var permissions = Security.can(null).remove('test2').for(Collections.allowOnlyLoggedIn);
  doTest(test, permissions, false);
  permissions = Security.can('userId').remove('test3').for(Collections.allowOnlyLoggedIn);
  doTest(test, permissions, true);
});

/*
 * allowOnlyLoggedInToInsert
 */

Tinytest.add('Security - allowOnlyLoggedInToInsert - insert', function(test) {
  var permissions = Security.can(null).insert({}).for(Collections.allowOnlyLoggedInToInsert);
  doTest(test, permissions, false);
  permissions = Security.can('userId').insert({}).for(Collections.allowOnlyLoggedInToInsert);
  doTest(test, permissions, true);
});

Tinytest.add('Security - allowOnlyLoggedInToInsert - update', function(test) {
  var permissions = Security.can(null).update('test2', {$set: {foo: "bar"}}).for(Collections.allowOnlyLoggedInToInsert);
  doTest(test, permissions, false);
  permissions = Security.can('userId').update('test2', {$set: {foo: "bar"}}).for(Collections.allowOnlyLoggedInToInsert);
  doTest(test, permissions, false);
});

Tinytest.add('Security - allowOnlyLoggedInToInsert - remove', function(test) {
  var permissions = Security.can(null).remove('test2').for(Collections.allowOnlyLoggedInToInsert);
  doTest(test, permissions, false);
  permissions = Security.can('userId').remove('test3').for(Collections.allowOnlyLoggedInToInsert);
  doTest(test, permissions, false);
});

/*
 * allowOnlyLoggedInToUpdate
 */

Tinytest.add('Security - allowOnlyLoggedInToUpdate - insert', function(test) {
  var permissions = Security.can(null).insert({}).for(Collections.allowOnlyLoggedInToUpdate);
  doTest(test, permissions, false);
  permissions = Security.can('userId').insert({}).for(Collections.allowOnlyLoggedInToUpdate);
  doTest(test, permissions, false);
});

Tinytest.add('Security - allowOnlyLoggedInToUpdate - update', function(test) {
  var permissions = Security.can(null).update('test2', {$set: {foo: "bar"}}).for(Collections.allowOnlyLoggedInToUpdate);
  doTest(test, permissions, false);
  permissions = Security.can('userId').update('test2', {$set: {foo: "bar"}}).for(Collections.allowOnlyLoggedInToUpdate);
  doTest(test, permissions, true);
});

Tinytest.add('Security - allowOnlyLoggedInToUpdate - remove', function(test) {
  var permissions = Security.can(null).remove('test2').for(Collections.allowOnlyLoggedInToUpdate);
  doTest(test, permissions, false);
  permissions = Security.can('userId').remove('test3').for(Collections.allowOnlyLoggedInToUpdate);
  doTest(test, permissions, false);
});

/*
 * allowOnlyLoggedInToRemove
 */

Tinytest.add('Security - allowOnlyLoggedInToRemove - insert', function(test) {
  var permissions = Security.can(null).insert({}).for(Collections.allowOnlyLoggedInToRemove);
  doTest(test, permissions, false);
  permissions = Security.can('userId').insert({}).for(Collections.allowOnlyLoggedInToRemove);
  doTest(test, permissions, false);
});

Tinytest.add('Security - allowOnlyLoggedInToRemove - update', function(test) {
  var permissions = Security.can(null).update('test2', {$set: {foo: "bar"}}).for(Collections.allowOnlyLoggedInToRemove);
  doTest(test, permissions, false);
  permissions = Security.can('userId').update('test2', {$set: {foo: "bar"}}).for(Collections.allowOnlyLoggedInToRemove);
  doTest(test, permissions, false);
});

Tinytest.add('Security - allowOnlyLoggedInToRemove - remove', function(test) {
  var permissions = Security.can(null).remove('test2').for(Collections.allowOnlyLoggedInToRemove);
  doTest(test, permissions, false);
  permissions = Security.can('userId').remove('test3').for(Collections.allowOnlyLoggedInToRemove);
  doTest(test, permissions, true);
});

/*
 * allowOnlyUserId
 */

Tinytest.add('Security - allowOnlyUserId - insert', function(test) {
  var permissions = Security.can(null).insert({}).for(Collections.allowOnlyUserId);
  doTest(test, permissions, false);
  permissions = Security.can('userId').insert({}).for(Collections.allowOnlyUserId);
  doTest(test, permissions, false);
  var userId = Meteor.users.findOne({username: 'jimmy'})._id;
  permissions = Security.can(userId).insert({}).for(Collections.allowOnlyUserId);
  doTest(test, permissions, true);
});

Tinytest.add('Security - allowOnlyUserId - update', function(test) {
  var permissions = Security.can(null).update('test2', {$set: {foo: "bar"}}).for(Collections.allowOnlyUserId);
  doTest(test, permissions, false);
  permissions = Security.can('userId').update('test2', {$set: {foo: "bar"}}).for(Collections.allowOnlyUserId);
  doTest(test, permissions, false);
  var userId = Meteor.users.findOne({username: 'jimmy'})._id;
  permissions = Security.can(userId).update('test2', {$set: {foo: "bar"}}).for(Collections.allowOnlyUserId);
  doTest(test, permissions, true);
});

Tinytest.add('Security - allowOnlyUserId - remove', function(test) {
  var permissions = Security.can(null).remove('test2').for(Collections.allowOnlyUserId);
  doTest(test, permissions, false);
  permissions = Security.can('userId').remove('test3').for(Collections.allowOnlyUserId);
  doTest(test, permissions, false);
  var userId = Meteor.users.findOne({username: 'jimmy'})._id;
  permissions = Security.can(userId).remove('test3').for(Collections.allowOnlyUserId);
  doTest(test, permissions, true);
});

/*
 * allowOnlyUserIdToInsert
 */

Tinytest.add('Security - allowOnlyUserIdToInsert - insert', function(test) {
  var permissions = Security.can(null).insert({}).for(Collections.allowOnlyUserIdToInsert);
  doTest(test, permissions, false);
  permissions = Security.can('userId').insert({}).for(Collections.allowOnlyUserIdToInsert);
  doTest(test, permissions, false);
  var userId = Meteor.users.findOne({username: 'jimmy'})._id;
  permissions = Security.can(userId).insert({}).for(Collections.allowOnlyUserIdToInsert);
  doTest(test, permissions, true);
});

Tinytest.add('Security - allowOnlyUserIdToInsert - update', function(test) {
  var permissions = Security.can(null).update('test2', {$set: {foo: "bar"}}).for(Collections.allowOnlyUserIdToInsert);
  doTest(test, permissions, false);
  permissions = Security.can('userId').update('test2', {$set: {foo: "bar"}}).for(Collections.allowOnlyUserIdToInsert);
  doTest(test, permissions, false);
  var userId = Meteor.users.findOne({username: 'jimmy'})._id;
  permissions = Security.can(userId).update('test2', {$set: {foo: "bar"}}).for(Collections.allowOnlyUserIdToInsert);
  doTest(test, permissions, false);
});

Tinytest.add('Security - allowOnlyUserIdToInsert - remove', function(test) {
  var permissions = Security.can(null).remove('test2').for(Collections.allowOnlyUserIdToInsert);
  doTest(test, permissions, false);
  permissions = Security.can('userId').remove('test3').for(Collections.allowOnlyUserIdToInsert);
  doTest(test, permissions, false);
  var userId = Meteor.users.findOne({username: 'jimmy'})._id;
  permissions = Security.can(userId).remove('test3').for(Collections.allowOnlyUserIdToInsert);
  doTest(test, permissions, false);
});

/*
 * allowOnlyUserIdToUpdate
 */

Tinytest.add('Security - allowOnlyUserIdToUpdate - insert', function(test) {
  var permissions = Security.can(null).insert({}).for(Collections.allowOnlyUserIdToUpdate);
  doTest(test, permissions, false);
  permissions = Security.can('userId').insert({}).for(Collections.allowOnlyUserIdToUpdate);
  doTest(test, permissions, false);
  var userId = Meteor.users.findOne({username: 'jimmy'})._id;
  permissions = Security.can(userId).insert({}).for(Collections.allowOnlyUserIdToUpdate);
  doTest(test, permissions, false);
});

Tinytest.add('Security - allowOnlyUserIdToUpdate - update', function(test) {
  var permissions = Security.can(null).update('test2', {$set: {foo: "bar"}}).for(Collections.allowOnlyUserIdToUpdate);
  doTest(test, permissions, false);
  permissions = Security.can('userId').update('test2', {$set: {foo: "bar"}}).for(Collections.allowOnlyUserIdToUpdate);
  doTest(test, permissions, false);
  var userId = Meteor.users.findOne({username: 'jimmy'})._id;
  permissions = Security.can(userId).update('test2', {$set: {foo: "bar"}}).for(Collections.allowOnlyUserIdToUpdate);
  doTest(test, permissions, true);
});

Tinytest.add('Security - allowOnlyUserIdToUpdate - remove', function(test) {
  var permissions = Security.can(null).remove('test2').for(Collections.allowOnlyUserIdToUpdate);
  doTest(test, permissions, false);
  permissions = Security.can('userId').remove('test3').for(Collections.allowOnlyUserIdToUpdate);
  doTest(test, permissions, false);
  var userId = Meteor.users.findOne({username: 'jimmy'})._id;
  permissions = Security.can(userId).remove('test3').for(Collections.allowOnlyUserIdToUpdate);
  doTest(test, permissions, false);
});

/*
 * allowOnlyUserIdToRemove
 */

Tinytest.add('Security - allowOnlyUserIdToRemove - insert', function(test) {
  var permissions = Security.can(null).insert({}).for(Collections.allowOnlyUserIdToRemove);
  doTest(test, permissions, false);
  permissions = Security.can('userId').insert({}).for(Collections.allowOnlyUserIdToRemove);
  doTest(test, permissions, false);
  var userId = Meteor.users.findOne({username: 'jimmy'})._id;
  permissions = Security.can(userId).insert({}).for(Collections.allowOnlyUserIdToRemove);
  doTest(test, permissions, false);
});

Tinytest.add('Security - allowOnlyUserIdToRemove - update', function(test) {
  var permissions = Security.can(null).update('test2', {$set: {foo: "bar"}}).for(Collections.allowOnlyUserIdToRemove);
  doTest(test, permissions, false);
  permissions = Security.can('userId').update('test2', {$set: {foo: "bar"}}).for(Collections.allowOnlyUserIdToRemove);
  doTest(test, permissions, false);
  var userId = Meteor.users.findOne({username: 'jimmy'})._id;
  permissions = Security.can(userId).update('test2', {$set: {foo: "bar"}}).for(Collections.allowOnlyUserIdToRemove);
  doTest(test, permissions, false);
});

Tinytest.add('Security - allowOnlyUserIdToRemove - remove', function(test) {
  var permissions = Security.can(null).remove('test2').for(Collections.allowOnlyUserIdToRemove);
  doTest(test, permissions, false);
  permissions = Security.can('userId').remove('test3').for(Collections.allowOnlyUserIdToRemove);
  doTest(test, permissions, false);
  var userId = Meteor.users.findOne({username: 'jimmy'})._id;
  permissions = Security.can(userId).remove('test3').for(Collections.allowOnlyUserIdToRemove);
  doTest(test, permissions, true);
});

/*
 * allowOnlyUserIdToRead
 */

Tinytest.add('Security - allowOnlyUserIdToRead', function(test) {
  var permissions = Security.can(null).read({}).for(Collections.allowOnlyUserIdToRead);
  doTest(test, permissions, false);
  permissions = Security.can('userId').read({}).for(Collections.allowOnlyUserIdToRead);
  doTest(test, permissions, false);
  var userId = Meteor.users.findOne({username: 'jimmy'})._id;
  permissions = Security.can(userId).read({}).for(Collections.allowOnlyUserIdToRead);
  doTest(test, permissions, true);
});

/*
 * advanced1
 */

Tinytest.add('Security - advanced1 - insert anonymous', function(test) {
  var permissions = Security.can(null).insert({}).for(Collections.advanced1);
  doTest(test, permissions, false);
});

Tinytest.add('Security - advanced1 - insert logged in', function(test) {
  var permissions = Security.can('userId').insert({foo: "bar"}).for(Collections.advanced1);
  doTest(test, permissions, false);
});

Tinytest.add('Security - advanced1 - insert logged in as admin', function(test) {
  var userId = Accounts.createUser({email: Random.id() + "@example.com", password: "newPassword"});
  Roles.addUsersToRoles(userId, 'admin');
  var permissions = Security.can(userId).insert({}).for(Collections.advanced1);
  doTest(test, permissions, true);
});

Tinytest.add('Security - advanced1 - update anonymous', function(test) {
  var permissions = Security.can(null).update('test', {$set: {foo: "bar"}}).for(Collections.advanced1);
  doTest(test, permissions, false);
});

Tinytest.add('Security - advanced1 - update logged in', function(test) {
  var permissions = Security.can('userId').update('test', {$set: {foo: "bar"}}).for(Collections.advanced1);
  doTest(test, permissions, true);
  permissions = Security.can('userId').update('test', {$set: {author: "john"}}).for(Collections.advanced1);
  doTest(test, permissions, false);
});

Tinytest.add('Security - advanced1 - update logged in as admin', function(test) {
  var userId = Accounts.createUser({email: Random.id() + "@example.com", password: "newPassword"});
  Roles.addUsersToRoles(userId, 'admin');
  var permissions = Security.can(userId).update('test', {$set: {foo: "bar"}}).for(Collections.advanced1);
  doTest(test, permissions, true);
});

Tinytest.add('Security - issue #34', function (test) {
  // Make sure this does not throw
  Security.permit(['insert', 'remove', 'update']).collections([Meteor.roles]).ifHasRole('admin');
});

Tinytest.add('Security - testFetch', function (test) {
  var id = Collections.testFetch.insert({
    foo: 'foo',
    bar: 'bar',
    noFetch: 'noFetch',
  });

  var permissions = Security.can(null).update(id, {$unset: {foo: ''}}).for(Collections.testFetch);
  doTest(test, permissions, true);
  permissions = Security.can(null).read(id).for(Collections.testFetch);
  doTest(test, permissions, true);
  permissions = Security.can(null).remove(id).for(Collections.testFetch);
  doTest(test, permissions, true);
});
