ongoworks:security
=========================

A Meteor package that provides a simple, logical, plain language API for defining write security on your MongoDB collections. Wraps the core allow/deny security.

## Installation

```bash
$ meteor add ongoworks:security
```

## Why?

Meteor developers, both newbies and pros, often find the allow/deny paradigm very confusing. Worse yet, many think they understand it but don't fully. Since securing database write operations is a key requirement of any app, it makes sense to have a simpler security API, one that leaves very little room for mistakes.

Furthermore, when you come back to a project after some time, it may be difficult to read through allow/deny rules and try to figure out what they are doing. By encapsulating security logic in a readable string, it becomes much easier to skim your applied rules and understand what you might need to change or fix.

## How It Works

This package exports a `Security` object, which contains just two API functions: `defineRule` and `applyRule`. Since there are some common rules predefined for you, let's start by talking about `applyRule`.

### Security.applyRule(name, collections, [options])

To set up security for one or more collections, call `Security.applyRule`. Pass a rule name and a list of collections to which that rule should be applied. There are some predefined rules. The simplest examples are the "allowAnyone" rules:

```js
Security.applyRule("allowAnyone", [Subjects, Reports]);
Security.applyRule("allowAnyoneToInsert", Feedback);
Security.applyRule("allowAnyoneToUpdate", Posts);
Security.applyRule("allowAnyoneToRemove", Posts);
```

In this example, `Subjects`, `Reports`, `Feedback`, and `Posts` are `Mongo.Collection` instances defined elsewhere. Hopefully it is very clear what is happening in this example; that's the idea behind this package.

Here's a full list of the predefined rules:

* allowAnyone
* allowAnyoneToInsert
* allowAnyoneToUpdate
* allowAnyoneToRemove
* allowNoOne
* allowNoOneToInsert
* allowNoOneToUpdate
* allowNoOneToRemove
* allowOnlyLoggedIn
* allowOnlyLoggedInToInsert
* allowOnlyLoggedInToUpdate
* allowOnlyLoggedInToRemove
* allowOnlyUserId
* allowOnlyUserIdToInsert
* allowOnlyUserIdToUpdate
* allowOnlyUserIdToRemove

There are some additional predefined rules available only if your app also uses the `alanning:roles` package:

* allowOnlyRoles
* allowOnlyRolesToInsert
* allowOnlyRolesToUpdate
* allowOnlyRolesToRemove

#### Passing Additional Options To The Rule

You might have noticed the "allowOnlyUserId" and "allowOnlyRoles" rules, and you might be wondering, "How do I specify which user or which roles?" Good question! It's easy. Simply pass some options as the third argument. The options can be anything, as long as the rule you are using knows what to do with them.

For example, here's how to use the "allowOnlyUserId" and "allowOnlyRoles" rules:

```js
Security.applyRule("allowOnlyUserId", Secrets, {userId: superAdminUserId});
Security.applyRule("allowOnlyRoles", [Steps, Config], {roles: ["admin", "manager"]});
```

### Security.defineRule(name, definition)

Call `Security.defineRule` to define named rules. Pass a `definition` argument, which must contain a `deny` property set to a `deny` function for that rule. The `deny` function is the same as the standard Meteor one, except that it receives an `options` object from `applyRule` as its first argument. You may additionally specify `types` and `fetch` properties. If you don't specify `types`, the rule will apply to all operation types (insert, update, and remove). If you don't specify `fetch`, all document properties will be fetched. 

As an example, here is the definition for the predefined rule "allowOnlyUserIdToUpdate":

```js
Security.defineRule("allowOnlyUserIdToUpdate", {
  types: ["update"],
  fetch: [],
  deny: function (options, userId) {
    return userId !== options.userId;
  }
});
```

How about some more examples?

#### Example 1: Only Owner May Update or Remove

Let's say you have two collections, `Posts` and `Comments`. In both cases, anyone may insert one, but after that, only the owner may update or delete it. Upon insert, you always set `doc.owner = Meteor.userId()`. (You do this using a hook or schema automatic value, which is outside the scope of this discussion.) Here's how you would set up the proper security:

```js
Security.defineRule("allowOnlyOwnerToUpdateOrRemove", {
  types: ["update", "remove"],
  fetch: ["owner"],
  deny: function (options, userId, doc) {
    return doc.owner !== userId;
  }
});

Security.applyRule("allowAnyoneToInsert", [Posts, Comments]);
Security.applyRule("allowOnlyOwnerToUpdateOrRemove", [Posts, Comments]);
```

#### Example 2: Only Certain Roles May Set Some Properties

You could make a generic rule that requires certain user roles to edit certain properties:

```js
Security.defineRule("allowOnlyRolesToSetSomeProps", {
  types: ["insert", "update"],
  deny: function (options, userId, doc, fieldNames) {
    fieldNames = fieldNames || _.keys(doc);
    return _.intersection(fieldNames, options.props).length > 0 && !Roles.userIsInRole(userId, options.roles);
  }
});

Security.applyRule("allowOnlyRolesToSetSomeProps", [Posts, Comments], {roles: 'admin', props: ['foo', 'bar']});
```

## Details

* If you have not called `Security.applyRule` for a collection, nothing is allowed (assuming you have removed the `insecure` package).
* One you call `Security.applyRule` for a collection for the first time, everything is allowed unless it's prevented by the rules you've applied.
* Rules are additive. It is fine and often necessary to apply more than one rule to the same collection. As you do so, write access to that collection becomes more and more strict.

## Contributing

You are welcome to submit pull requests if you have ideas for fixing or improving the API. If you come up with generally useful security rules, you should publish your own package that depends on this one and document the rules it provides so that others can use them. You may then submit a pull request to add a link to your package documentation in this readme.