ongoworks:security
=========================

A Meteor package that provides a simple, logical, plain language API for defining write security on your MongoDB collections. Wraps the core allow/deny security. This package is most useful for large apps with a lot of different security concerns.

## Installation

```bash
$ meteor add ongoworks:security
```

## Why?

There are two main problems that this package solves.

### Allow Functions Don't Provide Reliable Security

Most Meteor developers should be familiar with the standard `allow` and `deny` functions that can be used to secure database operations that originate on the client. But most developers handle security by simply defining a few `allow` functions. This may work in most cases, but many people don't realize that only *one* allow function needs to return true and then the rest of them aren't even called. If you use a lot of community packages in your app, there is the possibility that one of them will add an `allow` function that returns `true` for a perfectly good reason, but if you are not aware of it, you may not even realize that your `allow` function is never being called, and your security logic is not being applied.

*This package takes `allow` functions out of the equation and handles all security through `deny` functions, which are guaranteed to be called.*

### A File Full of Allow/Deny Functions Is Not Easy To Read

When you come back to a project after some time or begin helping with a project you did not create, it may be difficult to read through allow/deny rules and try to figure out what they are doing. By encapsulating security logic in a readable string, it becomes much easier to skim your applied rules and understand what you might need to change or fix.

*This package assign readable names to rules, making it easier to skim and see what security is applied to which collections.*

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
  types: ["update"], // rule applies only to update operations
  fetch: [], // we don't need any doc properties fetched
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
  types: ["update", "remove"], // rule applies to both update and remove operations
  fetch: ["owner"], // fetch only the "owner" property of `doc`
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
  types: ["insert", "update"], // rule applies to both insert and update operations
  deny: function (options, userId, doc, fieldNames) {
    fieldNames = fieldNames || _.keys(doc);
    return _.intersection(fieldNames, options.props).length > 0 && !Roles.userIsInRole(userId, options.roles);
  }
});

Security.applyRule("allowOnlyRolesToSetSomeProps", [Posts, Comments], {roles: 'admin', props: ['foo', 'bar']});
```

## Details

* Simply adding this package to your app does not affect your app security in any way. Only calling `Security.applyRule` for a collection will affect your app security.
* If you have not called `Security.applyRule` for a collection, nothing is allowed (assuming you have removed the `insecure` package).
* Once you call `Security.applyRule` for a collection for the first time, everything is allowed for the affected operation types, unless it's prevented by the rules you've applied.
* Rules are additive. It is fine and often necessary to apply more than one rule to the same collection. As you do so, write access to that collection becomes more and more strict.
* You can mix 'n' match `Security.applyRule` with normal `allow/deny` functions, but keep in mind that your `allow` functions may have no effect if you've called `Security.applyRule` for the same collection.

## Troubleshooting

* It's important to note that you can only *add* strictness to operation types, and once you've done so, you can't make them less strict. For example, if you apply "allowNoOne" to a collection and then apply "allowAnyoneToInsert" to the same collection, the "allowNoOne" rule stays in effect. Nobody will be able to insert. By contrast, if you apply "allowAnyone" followed by "allowOnlyLoggedInToInsert", then you will need to be logged in to insert. The "allowOnlyLoggedInToInsert" rule wins because it is most strict.

## Contributing

You are welcome to submit pull requests if you have ideas for fixing or improving the API. If you come up with generally useful security rules, you should publish your own package that depends on this one and document the rules it provides so that others can use them. You may then submit a pull request to add a link to your package documentation in this readme.
