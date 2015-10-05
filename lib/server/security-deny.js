/*
 * A single deny function runs all the deny functions registered by this package, allowing us to have
 * an OR relationship among multiple security rule chains.
 */

allRulesPass = function allRulesPass(collection, type, args) {
  // select only those rules that apply to this operation type
  var rules = getRulesForCollectionAndType(getCollectionName(collection), type);

  // Loop through all defined rules for this collection. There is an OR relationship among
  // all rules for the collection, so if any do NOT return true, we allow.
  return !_.every(rules, function (rule) {
    return rule.deny(type, collection, args);
  });
};

ensureSecureDeny = function ensureSecureDeny(collections, types) {
  _.each(types, function (t) {
    _.each(collections, function (collection) {
      ensureCreated("deny", [collection], [t], null, function () {
        return !allRulesPass(collection, t, _.toArray(arguments));
      });
    });
  });
};
