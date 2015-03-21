/*
 * A single deny function runs all the deny functions registered by this package, allowing us to have
 * an OR relationship among multiple security rule chains.
 */

ensureSecureDeny = function ensureSecureDeny(collections, types) {
  _.each(types, function (t) {
    _.each(collections, function (collection) {
      var collectionName = collection._name;
      ensureCreated("deny", [collection], [t], null, function () {
        var args = _.toArray(arguments);
        var rules = rulesByCollection[collectionName] || [];

        // select only those rules that apply to this operation type
        rules = _.select(rules, function (rule) {
          return _.contains(rule._types, t);
        });

        // Loop through all defined rules for this collection. There is an OR relationship among
        // all rules for the collection, so if any do NOT return true, we allow.
        return _.every(rules, function (rule) {
          return rule.deny(t, args);
        });
      });
    });
  });
};
