/* global _, rulesByCollection:true, addFuncForAll:true, ensureCreated:true, ensureDefaultAllow:true */

rulesByCollection = {};

var created = {
  allow: {
    insert: {},
    update: {},
    remove: {},
    download: {} // for use with CollectionFS packages
  },
  deny: {
    insert: {},
    update: {},
    remove: {},
    download: {} // for use with CollectionFS packages
  }
};

/**
 * Adds the given function as an allow or deny function for all specified collections and types.
 * @param {Array(Mongo.Collection)} collections Array of Mongo.Collection instances
 * @param {String}                  allowOrDeny "allow" or "deny"
 * @param {Array(String)}           types       Array of types ("insert", "update", "remove")
 * @param {Array(String)|null}      fetch       `fetch` property to use
 * @param {Function}                func        The function
 */
addFuncForAll = function addFuncForAll(collections, allowOrDeny, types, fetch, func) {
  // We always disable transformation, but we transform for specific
  // rules upon running our deny function if requested.
  var rules = {transform: null};
  if (_.isArray(fetch)) {
    rules.fetch = fetch;
  }
  _.each(types, function (t) {
    rules[t] = func;
  });
  _.each(collections, function (c) {
    c[allowOrDeny](rules);
  });
};

/**
 * Creates the allow or deny function for the given collections if not already created. This ensures that this package only ever creates up to one allow and one deny per collection.
 * @param   {String}                  allowOrDeny "allow" or "deny"
 * @param   {Array(Mongo.Collection)} collections An array of collections
 * @param   {Array(String)}           types       An array of types ("insert", "update", "remove")
 * @param   {Array(String)|null}      fetch       `fetch` property to use
 * @param   {Function}                func        The function
 */
ensureCreated = function ensureCreated(allowOrDeny, collections, types, fetch, func) {
  _.each(types, t => {
    // Ignore "read"
    if (!_.contains(['insert', 'update', 'remove', 'download'], t)) return;

    collections = _.reject(collections, c => {
      return _.has(created[allowOrDeny][t], getCollectionName(c));
    });
    addFuncForAll(collections, allowOrDeny, [t], null, func);
    // mark that we've defined function for collection-type combo
    _.each(collections, c => {
      created[allowOrDeny][t][getCollectionName(c)] = true;
    });
  });
};

/**
 * Sets up default allow functions for the collections and types.
 * @param   {Array(Mongo.Collection)} collections Array of Mongo.Collection instances
 * @param   {Array(String)}           types       Array of types ("insert", "update", "remove")
 */
ensureDefaultAllow = function ensureDefaultAllow(collections, types) {
  ensureCreated("allow", collections, types, [], function () {
    return true;
  });
};

/**
 * Return only those rules that apply to the given collection and operation type
 */
getRulesForCollectionAndType = function getRulesForCollectionAndType(collectionName, type) {
  var rules = rulesByCollection[collectionName] || [];
  return _.select(rules, function (rule) {
    return _.contains(rule._types, type);
  });
};

getCollectionName = function getCollectionName(collection) {
  // CollectionFS has underlying collection on `files` property
  return collection._name || (collection.files && collection.files._name);
};
