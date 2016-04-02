Security.Rule = class {
  constructor(types) {
    if (!_.isArray(types)) types = [types];
    this._types = types;
    this._restrictions = [];
  }

  collections(collections) {
    // Make sure the `collections` argument is either a `Mongo.Collection` instance or
    // an array of them. If it's a single collection, convert it to a one-item array.
    if (!_.isArray(collections)) collections = [collections];

    // Keep list keyed by collection name
    _.each(collections, collection => {
      if (!(collection instanceof Mongo.Collection) &&
          // CollectionFS has underlying collection on `files` property
        !(collection.files instanceof Mongo.Collection)) {
        throw new Error(Security.errorMessages.collectionsArg);
      }
      // CollectionFS has underlying collection on `files` property
      const collectionName = getCollectionName(collection);
      rulesByCollection[collectionName] = rulesByCollection[collectionName] || [];
      rulesByCollection[collectionName].push(this);
    });

    this._collections = collections;

    return this;
  }

  combinedFetch() {
    // We need a combined `fetch` array. The `fetch` is optional and can be either an array
    // or a function that takes the argument passed to the restriction method and returns an array.
    let fetch = [];
    _.every(this._restrictions, restriction => {
      if (_.isArray(restriction.definition.fetch)) {
        fetch = _.union(fetch, restriction.definition.fetch);
      } else if (typeof restriction.definition.fetch === "function") {
        fetch = _.union(fetch, restriction.definition.fetch(restriction.arg));
      } else if (!restriction.definition.hasOwnProperty('fetch')) {
        // If `fetch` property isn't present, we should fetch the full doc.
        fetch = null;
        return false; // Exit loop
      }
      return true;
    });
    return fetch;
  }

  allowInClientCode() {
    if (!this._collections || !this._types) throw new Error(Security.errorMessages.noCollectionOrType);
    ensureSecureDeny(this._collections, this._types);
  }

  allow(type, collection, userId, doc, modifier, ...args) {
    let fields;
    if (type === 'update') fields = computeChangedFieldsFromModifier(modifier);

    // Loop through all defined restrictions. Restrictions are additive for this chained
    // rule, so if any allow function returns false, this function should return false.
    return _.every(this._restrictions, restriction => {
      // Clone the doc in case we need to transform it. Transformations
      // should apply to only the one restriction.
      let loopDoc = _.clone(doc);

      // If transform is a function, apply that
      let transform = restriction.definition.transform;
      if (transform !== null) {
        transform = transform || collection._transform;
        if (typeof transform === 'function') {
          let addedRandomId = false;
          if (type === 'insert' && !loopDoc._id) {
            // The wrapped transform requires an _id, but we
            // don't have access to the generatedId from Meteor API,
            // so we'll fudge one and then remove it.
            loopDoc._id = Random.id();
            addedRandomId = true;
          }
          loopDoc = transform(loopDoc);
          if (addedRandomId) delete loopDoc._id;
        }
      }

      return restriction.definition.allow(type, restriction.arg, userId, loopDoc, fields, modifier, ...args);
    });
  }
}

function ensureSecureDeny(collections, types) {
  // If we haven't yet done so, set up a default, permissive `allow` function for all of
  // the given collections and types. We control all security through `deny` functions only, but
  // there must first be at least one `allow` function for each collection or all writes
  // will be denied.
  ensureDefaultAllow(collections, types);

  _.each(types, t => {
    _.each(collections, collection => {
      ensureCreated('deny', [collection], [t], null, function (...args) {
        const userId = args.shift();

        // If type is update, remove the `fields` argument. We will create our own
        // for consistency.
        if (t === 'update') args = [args[0], args[2]];

        return !Security.can(userId)[t](...args).for(collection).check();
      });
    });
  });
}

function computeChangedFieldsFromModifier(modifier) {
  var fields = [];
  // This is the same logic Meteor's mongo package uses in
  // https://github.com/meteor/meteor/blob/devel/packages/mongo/collection.js
  _.each(modifier, function (params) {
    _.each(_.keys(params), function (field) {
      // treat dotted fields as if they are replacing their
      // top-level part
      if (field.indexOf('.') !== -1)
        field = field.substring(0, field.indexOf('.'));

      // record the field we are trying to change
      if (!_.contains(fields, field))
        fields.push(field);
    });
  });
  return fields;
}
